'use strict';
const {
	isArray
} = require("lodash");
const _ = require('lodash');

const modelutils = require.main.require('./models/modelUtils')

var agg_types = ['row_to_json', 'json_agg'];
var otherutils = require('./utils');

var MYSQL = 'MySQL'
var POSTGRES = 'Postgres'

module.exports = class builder {

	constructor(models, currentModel, otherOpts) {
		this.models = models;
		this.currentModel = currentModel;
		this.db_type = otherOpts && otherOpts.db_type || POSTGRES;
		this.quotes = otherOpts && otherOpts.db_type == MYSQL ? '`' : '"'
		this.otherOpts = otherOpts;
		if (otherOpts && otherOpts.whereOnly) this.whereOnly = true;

		this.depthmap = this.depthmap || [];
		this.depthpaths = this.depthpaths || [];

		return this;
	}

	getParamMapIndex(val) {

		if (!this.paramMap) this.paramMap = {};
		if (!this.paramMapIndex) this.paramMapIndex = 0;
		if (this.paramMap[val]) return this.paramMap[val];
		++this.paramMapIndex;
		this.paramMap[val] = '$' + this.paramMapIndex;
		return this.paramMap[val];
	}

	getParamMapAsIndexArr() {
		var arr = [];
		if (!this.paramMap) this.paramMap = {};
		var param_keys = Object.keys(this.paramMap);

		for (let i = 0; i < param_keys.length; i++) {
			var newi = parseInt(this.paramMap[param_keys[i]].replace('$', ''));
			arr[(newi - 1)] = param_keys[i];
		}
		return arr;
	}

	generate() {
		this.queries = [];

		if (this.otherOpts.method == 'insert' && this.otherOpts.query_values && this.otherOpts.request) {
			this.fomatModelColumn(this.models, this.otherOpts.query_values, this.otherOpts.request)
		}
		if (this.whereOnly) {
			return {
				text: this.resolveWhere(this.models),
				values: [],
				getParamMapAsIndexArr: this.getParamMapAsIndexArr(),
				paramMap: this.paramMap
			};
		}

		for (var i = 0; i < this.models.length; i++) {

			if (this.models[i].method == 'select') {

				this.queries.push({
					query: this.select(this.models[i]),
					alias: 'q' + this.makeid(3)
				});
			} else {

				this.addInupQuery(this.models[i]);
			}
		}

		if (this.queries.length == 1) return {
			text: this.queries[0].query,
			values: this.getParamMapAsIndexArr() || [],
			getParamMapAsIndexArr: this.getParamMapAsIndexArr(),
			paramMap: this.paramMap,
			querypaths: this.depthpaths
		};
		var finalQuery = 'WITH ';
		var aliasArray = [];
		for (var j = 0; j < this.queries.length; j++) {
			if (!this.queries[j].alias.match(/insert|update|delete/)) aliasArray.push(this.queries[j].alias);

			finalQuery += this.queries[j].alias + ' AS (' + this.queries[j].query + ') ';
			if (j != this.queries.length - 1) finalQuery += ', ';
		}
		finalQuery += ' SELECT * FROM ' + aliasArray.join(', ') + ';';
		return {
			text: finalQuery,
			values: this.getParamMapAsIndexArr() || [],
			getParamMapAsIndexArr: this.getParamMapAsIndexArr(),
			paramMap: this.paramMap,
			querypaths: this.depthpaths,
		};
	}

	select(model, agg_type) {

		var finalColumns = this.resolveSelectColumns(model);

		var jtext = ' ';

		if (model.joins && model.joins.length > 0) {
			for (var i = 0; i < model.joins.length; i++) {

				if (model.joins[i].agg_type && agg_types.indexOf(model.joins[i].agg_type) > -1) {
					model.joins[i].where = model.joins[i].on;
					finalColumns.push('( ' + this.select(model.joins[i], model.joins[i].agg_type) + ' )');
				} else {
					jtext += ' ' + (model.joins[i].type) + ' JOIN ' + (model.joins[i].schema + '.' + model.joins[i].table);
					// if(model.q.joins[i].model.q.as) jtext += ' AS ' + this.identAlias(model.q.joins[i].model.q.as) + ' ';
					// old
					// jtext += ' ON ' + this.resolveConditions(this.addSchemaToObKeys(model.q.joins[i].on, model.q.joins[i].model), model.q.joins[i].model);
					if (!(this.db_type == POSTGRES && model.joins[i].type == 'CROSS')) {
						jtext += ' ON ' + this.resolveConditions(model.joins[i].on);
					}


					finalColumns = finalColumns.concat(this.resolveSelectColumns(model.joins[i]));
				}
			}
		}

		jtext += ' ';

		var off = model.offset ? ' OFFSET ' + model.offset : '';

		if (finalColumns.length == 0) { // wildcard if not columns
			finalColumns = ['*'];
		}
		var aliastext = '';

		// if(model.q.as) aliastext = ' AS ' + this.identAlias(model.q.as) + ' ';

		// if(model.orderby) model.q.orderby.by = this.addSchemaToObKeys(model.q.orderby.by, model, model.q.as);

		var fq = 'SELECT ' +
			finalColumns.join(',') +
			' FROM ' +
			`${this.quotes}${model.schema}${this.quotes}.${this.quotes}${model.table}${this.quotes}` +
			jtext +
			this.resolveWhere(model) +
			this.resolveGroup(model.groupby) +
			this.resolveOrder(model.orderby) +
			off +
			this.resolveLimit(model.limit)

		;

		// if(single) return fq;
		var id = this.makeid(6);
		if (agg_type) {
			if (agg_type == 'row_to_json') {
				return ' SELECT ROW_TO_JSON(' + id + '.*) AS ' + model.table_alias + ' FROM ( ' + fq + ' ) ' + id;
			} else if (agg_type == 'json_agg') {
				return ' SELECT JSON_AGG(' + id + '.*) AS ' + model.table_alias + ' FROM (' + fq + ') ' + id;
			}
		}
		// if(model.q.aggArray) return ' SELECT ARRAY_AGG(aggm.' + Object.keys(model.q.columns)[0].split('.').pop() + ') AS ' + model.q.aggArray + ' FROM (' + fq + ') aggm ';
		// if(model.q.aggregateOne) return ' SELECT ROW_TO_JSON(' + id + '.*) AS ' + this.identAlias(model.q.aggAlias || model.q.as || model.constructor.properties.schema_name + '.' + model.constructor.properties.table_name) + ' FROM ( ' + fq + ' ) ' + id;
		return fq;

	}

	resolveSelectColumns(model) {


		var finalColumns = [];
		let quotes = this.quotes;
		// quotes =  '`'
		for (let i = 0; i < model.columns.length; i++) {
			// var coltext = this.addSchemaToColumn(model.columns[i].columnName, model);

			// if(model.q.columns[i].alias) coltext += ' AS ' + this.identAlias(model.columns[i].alias);

			// quotes = ''
			var col_name = model.columns[i].columnName;
			let colNameQuotes = quotes + model.columns[i].columnName.split(".").join(quotes + "." + quotes) + quotes;
			// var col_name_quotes = quotes +  model.columns[i].columnName.split(".").join(quotes+ "." + quotes) + quotes;
			if (model.columns[i].fn && !model.columns[i].def) {
				if (['sum', 'count', 'max', 'min', 'avg'].indexOf(model.columns[i].fn) > -1) {
					if (model.columns[i].rowCount) {
						col_name = "count(*)";
					} else {
						col_name = model.columns[i].fn + '(' + colNameQuotes + ')';
						model.columns[i].alias = `${model.columns[i].fn}_${model.table}_${model.columns[i].columnName.split(".").pop()}`; // Expicitly add alias name for aggregate func
					}
				} else if (model.columns[i].fn == 'date_trunc') {
					// var pgtype = this.getType(params.realcname);
					var ts_type = otherutils.gettimeseriestype(col_name, this.getType(col_name));
					if (ts_type) {
						col_name = this.resolveTimeStampColumn(model.columns[i], colNameQuotes, ts_type);
					}
				}
			} else {
				col_name = colNameQuotes;
			}
			if (model.columns[i].def) {
				// alias priority order for custom cols  :  alias > lable > def
				let currAliasName = model.columns[i].alias || model.columns[i].label || model.columns[i].def
				if (['sum', 'count', 'max', 'min', 'avg'].indexOf(model.columns[i].fn) > -1) {
					// if not alias then add agg_func name in columns
					if (currAliasName !== model.columns[i].alias) currAliasName = model.columns[i].fn + "_" + currAliasName;
					finalColumns.push(`${model.columns[i].fn}(${model.columns[i].def}) AS ${quotes}${currAliasName}${quotes}`);
				} else {
					if (model.columns[i].fn === 'date_trunc') {
						if (!model.columns[i].customColType) throw new Error("must have value for 'customColType' ")
						currAliasName = 'tp'; // force alias name as tp if timestamp is selected  
						let ts_type = otherutils.gettimeseriestype(col_name, model.columns[i].customColType);
						colNameQuotes = `(${model.columns[i].def})`;
						col_name = this.resolveTimeStampColumn(model.columns[i], colNameQuotes, ts_type);
						finalColumns.push(`${col_name} AS ${quotes}${currAliasName}${quotes}`);
					} else {
						finalColumns.push(`${model.columns[i].def} AS ${quotes}${currAliasName}${quotes}`);
					}
				}

				// finalColumns.push(`${model.columns[i].def} `);
			} else if(model.columns[i].operator == 'static_value') {
				finalColumns.push(' 1 ')
			} else {
				// col_name = quotes + col_name.split(".").join(quotes + "." + quotes) + quotes;
				if (model.columns[i].alias) {
					finalColumns.push(col_name + ' AS ' + quotes + model.columns[i].alias + quotes);
				} else {
					finalColumns.push(col_name + ' AS ' + quotes + model.columns[i].columnName + quotes);
				}
			}

		}

		return finalColumns;

	}
	resolveTimeStampColumn(column, colNameQuotes, ts_type) {
		let col_name;
		column.alias = 'tp';
		// column.columnName = "1676371748121"
		// ts_type ={max_gran: 'second', type: 'unixms'};
		column.ts_gran = column.ts_gran || 'day';
		if (ts_type.type == 'date' || ts_type.type == 'datetime') {
			if (['second', 'minute', 'hour'].indexOf(column.ts_gran) > -1) {
				column.ts_gran = 'week'; // TODO : Weeks or days
			}
			if (this.db_type == MYSQL) col_name = this.dateFormat(colNameQuotes, column.ts_gran);
			else col_name = this.dateFormat(colNameQuotes, column.ts_gran);

		} else if (ts_type.type == 'timestamp' || ts_type.type == 'timestamp without time zone' || ts_type.type == 'time') {
			if (this.db_type == MYSQL) col_name = this.dateFormat(colNameQuotes, column.ts_gran);
			else col_name = this.dateFormat(colNameQuotes, column.ts_gran);

		} else if (ts_type.type.indexOf('unix') > -1) {

			if (ts_type.type.indexOf('unixms') > -1) { // if unix millisecond
				if (this.db_type == MYSQL) col_name = this.dateFormat(` FROM_UNIXTIME(${colNameQuotes}/1000) `, column.ts_gran);
				else col_name = this.dateFormat(` to_timestamp(${colNameQuotes}/1000) `, column.ts_gran);

			} else {

				if (this.db_type == MYSQL) col_name = this.dateFormat(` (CAST(${colNameQuotes} AS DATETIME)) `, column.ts_gran);
				else col_name = this.dateFormat(` to_timestamp(${colNameQuotes}) `, column.ts_gran);

			}
		}
		return col_name;
	}
	dateFormat(col_name, ts_gran) {
		//['second','minute','hour','day','week','month','year']; 
		// %f : for microseconds 


		if (this.db_type == MYSQL) {
			switch (ts_gran) {
				case "second":
					return `DATE_FORMAT(${col_name},'%Y-%m-%dT%H:%i:%s.000Z')`;
				case "minute":
					return `DATE_FORMAT(${col_name},'%Y-%m-%dT%H:%i:00.000Z')`;
				case "hour":
					return `DATE_FORMAT(${col_name} , '%Y-%m-%dT%H:00:00.000Z')`;
				case "day":
					return `DATE_FORMAT(${col_name},'%Y-%m-%dT00:00:00.000Z')`;
				case 'week':
					return `DATE_FORMAT(DATE_SUB(${col_name},INTERVAL WEEKDAY(${col_name}) DAY) , '%Y-%m-%dT00:00:00.000Z')`;
				case "month":
					return `DATE_FORMAT(${col_name} ,'%Y-%m-01T00:00:00.000Z')`;
				case "year":
					return `DATE_FORMAT(${col_name},'%Y-01-01T00:00:00.000Z')`;
				default:
					return `DATE_FORMAT(${col_name},'%Y-%m-%dT%H:%i:%s.%fZ')`;

					// code block
			}

		} else {
			return `DATE_TRUNC('${ts_gran}',${col_name}::TIMESTAMP)`
		}




		return
		if (this.db_type == MYSQL) {
			switch (ts_gran) {
				case "second":
					return `DATE_FORMAT(${col_name},'%d %b %I:%i:%s %p')`;
				case "minute":
					return `DATE_FORMAT(${col_name},'%d %b %I:%i %p')`;
				case "hour":
					return `DATE_FORMAT(${col_name} , '%d %b %I %p')`;
				case "day":
					return `DATE_FORMAT(${col_name},'%a, %d %b %Y')`;
				case 'week':
					return `DATE_FORMAT(DATE_SUB(${col_name},INTERVAL WEEKDAY(${col_name}) DAY), '%d %b %Y')`;
				case "month":
					return `DATE_FORMAT(${col_name} ,'%b %Y')`;
				case "year":
					return `DATE_FORMAT(${col_name},'%Y')`;
				default:
					return `DATE_FORMAT(${col_name},'%d %b %I:%i:%s %p')`;

			}
		} else {
			switch (ts_gran) {
				case "second":
					return `TO_CHAR(${col_name}::TIMESTAMP, 'DD Mon HH:MI:SS AM')`;
				case "minute":
					return `TO_CHAR(${col_name}::TIMESTAMP, 'DD Mon HH:MI AM')`
				case "hour":
					return `TO_CHAR(${col_name}::TIMESTAMP , 'DD Mon HH AM')`;
				case "day":
					return `TO_CHAR(${col_name}::TIMESTAMP ,'Dy, DD Mon YYYY')`;
				case 'week':
					return `TO_CHAR(DATE_TRUNC('week',${col_name}::TIMESTAMP),'DD Mon YYYY')`;
				case "month":
					return `TO_CHAR(${col_name}::TIMESTAMP ,'Mon YYYY')`;
				case "year":
					return `TO_CHAR(${col_name}::TIMESTAMP ,'YYYY')`;;
				default:
					return `TO_CHAR(${col_name}::TIMESTAMP , 'DD Mon HH:MI:SS AM')`;

			}
		}

	}


	addInupQuery(model) {
		if (model.method == 'select') throw 'cannot inup select model';
		model.aggAlias = model.aggAlias || (model.schema != 'public' ? (model.schema + '.') : '') + model.table + '$' + this.makeid(3);

		var ob = this[model.method](model);
		// if(ob.prequery) {
		//   this.queries.push({
		//     query: 'SELECT JSON_AGG(l.*) AS ' + this.identAlias('old$' + model.q.aggAlias) + ' FROM (' +  ob.prequery + ') l',
		//     alias: 'q' + this.makeid(3)
		//   });
		// }
		var ii = 'q' + model.method + '_' + model.table
		this.queries.push({
			query: ob.query,
			alias: ii
		});

		var agg_func = ((model.allow_multiple_row || model.method == 'update') ? 'JSON_AGG' : 'ROW_TO_JSON')

		this.queries.push({
			query: 'SELECT ' + agg_func + '(' + ii + '.*) AS "' + model.table_body_path + '" FROM ' + ii,
			alias: 'q' + this.makeid(3)
		});
		// var prefix = model.q.method == 'delete' ? 'deleted' : 'new';
		// this.queries.push({
		//   query: 'SELECT JSON_AGG(' + ii + '.*) AS ' + this.identAlias(prefix + '$' + model.q.aggAlias) + ' FROM ' + ii,
		//   alias: 'q' + this.makeid(3)
		// });
		// model.generatedQuery = true;
		model.queryAlias = ii;
		model.toReturn = ob.returnVal;
		return {
			queryAlias: ii,
			toReturn: ob.returnVal
		};
	}

	onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	resolveConflict(model) {

		if (!model.conflict || model.conflict?.columns?.length === 0) return '';
		let allkeys = [];
		let result;
		for (let i = 0; i < model.conflict.columns.length; i++) {
			allkeys.push(model.conflict.columns[i].columnName.split(".").pop())
		}

		result = ' ON CONFLICT ON CONSTRAINT "' + model.conflict.constraint + '"' +
			' DO UPDATE SET '
		if (allkeys.length > 1) {
			result = result +
				' (' + allkeys.join(',') + ') ' +
				' = ' + this.resolveValues(model.conflict.columns, {
					conflict: true
				})

		} else {
			result = result +
				' ' + allkeys.join(',') + ' ' +
				' = ' + this.resolveValues(model.conflict.columns, {
					conflict: true
				})
		}
		return result;
	}


	insert(model) {

		// check for extra columns
		var allkeys = [];
		var li = model.columns.length;
		let col_name;
		for (var i = 0; i < li; i++) {
			if (Array.isArray(model.columns[i])) {
				for (var j = 0; j < model.columns[i].length; j++) {
					col_name = model.columns[i][j].columnName.split(".").pop();
					if (!allkeys.includes(col_name)) allkeys.push(col_name);
				}
			} else {
				col_name = model.columns[i].columnName.split(".").pop();
				if (!allkeys.includes(col_name)) allkeys.push(col_name);
			}
		}
		var return_arr = model.returns.user.map(elem => {
			let colName = elem.columnName.split('.')[2];
			if (elem.alias) return `${colName} AS  ${elem.alias}`;
			else return colName;
		});
		return_arr = return_arr.concat(model.returns.qref)
		return_arr = return_arr.filter(this.onlyUnique);
		// let return_arr_len = return_arr.length;
		// for (let i = 0; i < return_arr_len; i++) {
		//   return_arr.push ( ` ${return_arr[i]} AS "${model.schema}.${model.table}.${return_arr[i]}"`) ; 
		// }
		// for (let i = 0; i <  allkeys.length; i++) {
		//   return_arr.push ( ` ${allkeys[i]} AS "${model.schema}.${model.table}.${allkeys[i]}"`) ; 
		// }

		var q = "INSERT INTO " +
			model.schema + '.' + model.table +
			" (" + allkeys.join(', ') + ") " +
			' VALUES ' + this.resolveValues(model.columns) + ' ' +
			this.resolveConflict(model) +
			' RETURNING ' +
			(return_arr.length > 0 ? return_arr.join(', ') : '*');

		return {
			// prequery: prequery,
			query: q,
			// returnVal: model.q.returning && typeof model.q.returning == 'object' ? Object.keys(model.q.returning)[0] : null
		};

	}

	update(model) {
		//  if (!model.where) throw new Error('Cannot update without where conditions');


		var w = this.resolveWhere(model);

		var allkeys = [];


		for (let i = 0; i < model.columns.length; i++) {
			allkeys.push(model.columns[i].columnName.split(".").pop())
		}

		var return_arr = model.returns.user.map(elem => {
			let colName = elem.columnName;
			if (elem.alias) return `${colName} AS  ${elem.alias}`;
			else return colName;
		});
		return_arr = return_arr.concat(model.returns.qref)
		return_arr = return_arr.filter(this.onlyUnique);
		var q;
		// let return_arr_len = return_arr.length;
		// for (let i = 0; i < return_arr_len; i++) {
		// return_arr.push ( ` ${return_arr[i]} AS "${model.schema}.${model.table}.${return_arr[i]}"`) ; 
		// }
		// for (let i = 0; i < allkeys.length; i++) {
		//   return_arr.push ( ` ${allkeys[i]} AS "${model.schema}.${model.table}.${allkeys[i]}"`) ; 
		// }

		if (allkeys.length > 1) {
			q = 'UPDATE ' + model.schema + '.' + model.table +
				' SET (' + allkeys.join(',') + ' ) ' +
				' = ' + this.resolveValues(model.columns) + ' ' //this.resolveValues([model.q.columns], allkeys) +
				+
				w +
				' RETURNING ' +
				(return_arr.length > 0 ? return_arr.join(', ') : '*');
		} else {
			q = 'UPDATE ' + model.schema + '.' + model.table +
				' SET ' + allkeys.join(',') +
				' = ' + this.resolveValues(model.columns) + ' ' +
				w +
				' RETURNING ' +
				(return_arr.length > 0 ? return_arr.join(', ') : '*');
		}

		return {
			// prequery: 'SELECT * FROM ' + model.constructor.properties.schema_name + '.' + model.constructor.properties.table_name + w,
			query: q,
			// returnVal: model.q.returning && typeof model.q.returning == 'object' ? Object.keys(model.q.returning)[0] : null
		};
	}

	fomatModelColumn(models, query_values, request) {


		for (let i = 0; i < models.length; i++) {
			let field_input = _.get(query_values, models[i].table_body_path);
			let table_request_body = _.get(request, models[i].table_body_path);

			let result = [];
			if (models[i].allow_multiple_row) {
				if (!Array.isArray(field_input) || field_input.length === 0) {
					throw new Error(`${models[i].table_body_path} must be of type array  with atleast 1 row values`);
				}
				for (let j = 0; j < field_input.length; j++) {
					let currColumns = normalizeColumns(models[i], field_input, table_request_body[0], j)
					result.push(currColumns)
				}

			} else {
				let currColumns = normalizeColumns(models[i], field_input, table_request_body, )
				result.push(currColumns)
			}
			models[i].columns = result;

		}

		function normalizeColumns(model, input, table_request_body, iteration) {
			let currColumns = [];
			for (let j = 0; j < model.columns.length; j++) {
				let currCol = {
					...model.columns[j],
				}
				let column_name = model.columns[j].columnName.split(".").pop();
				if (model.columns[j].operator === "$req-body") {
					if (Array.isArray(input)) { // for array of  object input 
						if (
							input[iteration][column_name] === undefined && (
								table_request_body[column_name].required === false ||
								table_request_body[column_name].default !== null
							)
						) {
							currCol.operator = "$default"
						} else {
							currCol.value = model.columns[j].value + '[' + iteration + ']';
						}
					} else { // for object  input
						if (input[column_name] === undefined) {
							currCol.operator = "$default"
						}
					}
				}
				currColumns.push(currCol)
			}
			return currColumns;
		}

	}


	resolveValues(columns_arr, options) {

		var val_arr = [];
		var valtext = '';
		let is_multi_col_insert = false;
		if (!Array.isArray(columns_arr[0])) columns_arr = [columns_arr]
		for (let index = 0; index < columns_arr.length; index++) {
			var columns = columns_arr[index]
			let nv_arr = [];
			valtext += '(';
			for (let i = 0; i < columns.length; i++) {


				if (options && options.conflict) columns[i].operator = '$excluded'

				var v = columns[i].value;
				var op = columns[i].operator;
				var nv;
				if (v && typeof v == 'object' && v.model) {
					// model
					if (v.q.method == 'insert' || v.q.method == 'update') {
						if (v.generatedQuery) {
							// repeat
							nv = '(SELECT ' + v.toReturn + ' FROM ' + v.queryAlias + ')';
						} else {
							// new
							var res = this.addInupQuery(v);
							nv = '(SELECT ' + res.toReturn + ' FROM ' + res.queryAlias + ')';
						}
					} else {
						nv = '(' + this.select(v) + ')';
					}
				} else if (op) {
					if (v && op == '$append') {
						nv = 'ARRAY_APPEND(' + columns[i].columnName + ', ' + this.getParamMapIndex(v) + ')';
					} else if (v && op == '$prepend') {
						nv = 'ARRAY_PREPEND(' + columns[i].columnName + ', ' + this.getParamMapIndex(v) + ')';
					} else if (v && op == '$remove') {
						nv = 'ARRAY_REMOVE(' + columns[i].columnName + ', ' + this.getParamMapIndex(v) + ')';
					} else if (v && op == '$cat') {
						nv = 'ARRAY_CAT(' + columns[i].columnName + ', ' + this.getParamMapIndex(v) + ')';
					} else if (op == '$default') {
						nv = 'DEFAULT';
					} else if (op == '$qref') {
						var q_ref_split = v.split && v.split('$') || [v];
						var ref_col = q_ref_split[q_ref_split.length - 1];
						var ref_alias = q_ref_split[q_ref_split.length - 2];
						nv = ' (select ' + ref_col + ' from ' + ref_alias + ') ';
					} else if (op == '$excluded') { // for conflict columns 
						nv = 'EXCLUDED.' + columns[i].columnName.split(".").pop();
					} else {
						// throw 'unknown insert operator'
						if (typeof v == 'object') v = JSON.stringify(v)
						nv = this.getParamMapIndex(v);
					}
				} else {
					if (!v) throw "insert value missing";
					nv = this.getParamMapIndex(v);
				}
				nv_arr.push(nv);

				valtext += nv;
				if (i != columns_arr[0].length - 1) valtext += ', ';
			}
			valtext += ')';
			if (index < columns_arr.length - 1) valtext += ', ';
			if (columns.length > 1) {
				val_arr.push(`(${nv_arr.join(",")})`)
				is_multi_col_insert = true;
			} else {
				val_arr.push(nv_arr[0])
			}

		}

		return valtext

		// if (Array.isArray(columns_arr[0])) {
		//   return is_multi_col_insert ? val_arr.join(",") : `(${val_arr.join(",")})`;
		// } else {
		//   return columns_arr.length === 1 ? val_arr.join(",") : `(${val_arr.join(",")})`;
		// }

	}

	resolveGroup(group) {
		if (!group || group.length == 0) return '';


		let resultGroupByArr = [];
		for (let i = 0; i < group.length; i++) {
			if (group[i].def) resultGroupByArr.push(group[i].def);
			else resultGroupByArr.push(this.quotes + group[i].columnName.split(".").join(this.quotes + "." + this.quotes) + this.quotes)
		}
		return ' GROUP BY ' + resultGroupByArr.join(',');
	}

	resolveOrder(order) {
		// if (!order || typeof order != 'object' || (Object.keys(order.by)).length == 0) return '';
		// var ok = Object.keys(order.by);
		// var orderedt = ' ORDER BY ';
		// for(var i = 0; i < ok.length; i++) {
		//     orderedt += ok[i];
		//     if(typeof order.by[ok[i]] == 'string') orderedt += ' ' + order.by[ok[i]];
		//     else if(order.type) orderedt += ' ' + order.type;

		//     if(i != (ok.length - 1)) orderedt += ',';
		// }
		// return orderedt;

		if (!order || typeof order != 'object' || !Array.isArray(order) || order.length == 0) return '';

		var orderedt = ' ORDER BY ';
		// var ol  = order.by // orderby option list 
		for (var i = 0; i < order.length; i++) {
			// orderedt += order[i].name;
			let col_name = order[i].name;
			if (order[i].fn === 'date_trunc') {
				if (order[i].def) order[i].alias = 'tp' // force alias name as 'tp' for custom column timestamp  
				else if (!order[i].alias) order[i].alias = 'tp'
			}
			// orderedt +=   col_name ; 
			col_name = this.quotes + col_name.split(".").join(this.quotes + "." + this.quotes) + this.quotes;
			// alias priority order for custom cols  :  alias > lable > def
			//|| order[i].label
			if (order[i].alias) {
				order[i].alias = order[i].alias;
				order[i].alias = this.quotes + order[i].alias + this.quotes;
			} else if (order[i].def) {
				order[i].alias = order[i].def;
			}


			orderedt += order[i].alias ? order[i].alias : col_name;

			if (order[i].asc == false || order[i].desc == true) orderedt += ' DESC';
			else if (order[i].asc == true || order[i].desc == false) orderedt += ' ASC';

			if (i != (order.length - 1)) orderedt += ',';
		}
		return orderedt;

	}
	resolveOffset(l) {
		if (!l) return '';
		return ' OFFSET ' + l;
	}
	resolveLimit(l) {
		if (l == undefined) return '';
		return ' LIMIT ' + l;
	}

	resolveWhere(model) {

		if (!model.where || !model.where.rules || Object.keys(model.where.rules).length === 0 ) return '';
		var w = this.resolveConditions(model.where, model);
		return ' WHERE ' + w;
	}

	/*   resolveConditions_tree(conditions, mymodel){

	    
	    var condt = '';

	    var type = ' AND ';
	    var rules = Object.values(conditions.children1);
	                    if(conditions.properties.conjunction == 'OR') {
	      type = ' OR ';
	    }

	    for (let i = 0; i < rules.length; i++) {
	      const element = rules[i];

	      if(element.type.indexOf('group') > -1) {
	        // nest 
	        condt += ' ( ' + this.resolveConditions_tree(element, mymodel) + ' ) ';
	      } else {
	        condt += this.resolveOperators({
	          columnName: element.properties.field,
	          realcname: element.properties.field,
	          operator: element.properties.operator,
	          value: element.properties.value[0], 
	          def: element.def,
	          type: element.type,
	        });
	      }
	        
	      if(i != rules.length - 1) condt += type;
	    }
	    
	    return condt;
	  } */

	resolveConditions(conditions, mymodel, dp, depthpath) {


		dp = dp || {
			depth: 0
		};
		var depthpath = depthpath || '';

		var condt = '';

		var type = (conditions.condition && conditions.condition.toLowerCase() == 'or') ? ' OR ' : ' AND ';

		for (let i = 0; i < conditions.rules.length; i++) {
			const element = conditions.rules[i];
			if (conditions.rules[i].rules && conditions.rules[i].condition) {

				// nest
				condt += ' ( ' + this.resolveConditions(conditions.rules[i], mymodel, ({
					depth: dp.depth + 1,
					superindex: i
				}), depthpath + 'rules[' + i + '].') + ' ) ';

			} else if(conditions.rules[i].operator.indexOf('exists') > -1) {

				var exists_path_spl = conditions.rules[i].exists_path.split('-');
				var schema_split = this.currentModel.idToName[exists_path_spl[exists_path_spl.length - 1]];

				var exists_base_conditions = modelutils.idToJoinPathOb({
					id: conditions.rules[i].exists_path,
					currentModel: this.currentModel
				});
				if(conditions.rules[i].exists_where) {
					exists_base_conditions.rules.push(conditions.rules[i].exists_where)
				}

				var exists_select = this.select({
					schema: schema_split[0],
					table: schema_split[1],
					columns: [
						{
							columnName: 'static_value',
							operator: 'static_value',
							value: 'static_value'
						}
					],
					where: exists_base_conditions
				});

				condt += ' (' + (conditions.rules[i].operator.indexOf('!exists') > -1 ? 'NOT EXISTS' : 'EXISTS') + ' (' + exists_select + ')) '

			} else {
				// conditions.rules[i].columnName = this.addSchemaToColumn(conditions.rules[i].columnName, mymodel)
				let val;
				if (conditions.rules[i].value) {
					val = conditions.rules[i].value;
				} else if (conditions.rules[i].values[0]) {
					val = conditions.rules[i].values[0].value;
				} else {
					console.log("oepration not found  frp, JTsql ");
					console.log(conditions.rules[i]);
				}

				// this.depthpaths.push
				if(val !== undefined && 	conditions.rules[i].input_key === undefined  ){
                 // condition  value is static 
				}
				else if (val && (!conditions.rules[i].operator || conditions.rules[i].operator.indexOf('$') == -1)) {

					val = this.getParamMapIndex(val)
					if (conditions.rules[i].input_key && conditions.rules[i].input_key.match(/BODY|QUERY|URL|SESSION/)) {

						if(conditions.rules[i].input_key.indexOf('SESSION') > -1 && !conditions.rules[i].session_key) continue;

						this.depthpaths.push({
							path: depthpath + 'rules[' + i + '].',
							input_key: conditions.rules[i].input_key,
							column: conditions.rules[i].columnName || conditions.rules[i].fieldName || conditions.rules[i].id,
							session: {
								key: conditions.rules[i].session_key,
								// name: this.currentModel.idToName[conditions.rules[i].session_key].join('.')
							}
						})
					}else{
						console.log( 'else not key')
					}
				}
                 
				condt += this.resolveOperators({
					columnName: conditions.rules[i].columnName || conditions.rules[i].fieldName || conditions.rules[i].id,
					realcname: conditions.rules[i].columnName || conditions.rules[i].fieldName || conditions.rules[i].id,
					operator: conditions.rules[i].operator,
					value: val,
					def: conditions.rules[i].def,
					type: conditions.rules[i].type,
					input_key: conditions.rules[i].input_key
				});
			}
			if (i != conditions.rules.length - 1) condt += type;
		}

		if (conditions.not) {
			if (conditions.rules.length > 1) condt = ' NOT (' + condt + ' ) ';
			else condt = ' NOT ' + condt;
		}

		return condt;
	}

	// columnName operator value realcname
	resolveOperators(params) {
		// if(!operator.$type) operator.$type = 'or'

		// if(params.operator == '$req-body') {

		// }
        // console.log('resolveOperators',params  )
		var pgtype = this.getType(params.realcname);
		var suptype = otherutils.getSuperType(pgtype);
		if (params.def && params.type) {
			pgtype = params.type.toLowerCase();
			suptype = otherutils.getSuperType(pgtype);
		} else {
			pgtype = this.getType(params.realcname);
			suptype = otherutils.getSuperType(pgtype);
		}
		// var optype = typeof params.operator;
		var valtype = typeof params.value;

		var translate = {
			'equal': '$eq',
			'not_equal': '$!eq',
			'less_than': '$lt',
			'less_or_equal': '$lte',
			'greater_than': '$gt',
			'greater_or_equal': '$gte',
			'is_null': '$null',
			'is_empty': '$null',
			'is_not_null': '$!null',
			'is_not_empty': '$!null',
			'is_true': '$true',
			'is_not_true': '$!true',
			'is_false': '$false',
			'is_not_false': '$!false',
			'like': '$regex',
			'not_like': '$!regex',
			'ilike': '$ilike', // case insensitive like
			'not_ilike': '$!ilike', // case  insensitive  not like
			'regex': '$regex',
			'not_regex': '$!regex'
		};
		let quotes = this.quotes

		if (params.def) params.columnName = params.def;
		else params.columnName = quotes + params.columnName.split(".").join(quotes + "." + quotes) + quotes;

		if (translate[params.operator]) params.operator = translate[params.operator]; // translate operator

		if (params.operator == '$null') return params.columnName + ' IS NULL ';
		if (params.operator == '$!null') return params.columnName + ' IS NOT NULL ';

		// BOOL
		if (pgtype == 'boolean') {

			if (params.operator == '$true') return params.columnName + ' IS TRUE ';
			else if (params.operator == '$!true') return params.columnName + ' IS NOT TRUE ';
			else if (params.operator == '$false') return params.columnName + ' IS FALSE ';
			else if (params.operator == '$!false') return params.columnName + ' IS NOT FALSE ';
			else return '';
			/*       if(valtype == 'boolean') {
			  if(params.value) return params.columnName + ' IS TRUE ';
			  else return params.columnName + ' IS FALSE ';
			} else if(valtype == 'number') {
			  if(params.value > 0) return params.columnName + ' IS TRUE ';
			  else return params.columnName + ' IS FALSE ';
			} else if(valtype == 'string') {
			  if(params.value == 'true') return params.columnName + ' IS TRUE ';
			  else if(params.value == '!true') return params.columnName + ' IS NOT TRUE ';
			  else if(params.value == 'false') return params.columnName + ' IS FALSE ';
			  else if(params.value == '!false') return params.columnName + ' IS NOT FALSE ';
			  else if(params.value == 'null') return params.columnName + ' IS NULL ';
			  else if(params.value == '!null') return params.columnName + ' IS NOT NULL ';
			  else return params.columnName + ' IS TRUE ';
			} else {
			  if(!params.value) return params.columnName + ' IS NULL ';
			  else return params.columnName + ' IS NOT NULL ';
			} */
		}

		if (params.operator === '$gt') return params.columnName + ' > ' + params.value;
		else if (params.operator === '$gte') return params.columnName + ' >= ' + params.value;
		else if (params.operator === '$lt') return params.columnName + ' < ' + params.value;
		else if (params.operator === '$lte') return params.columnName + ' <= ' + params.value;
		else if (params.operator === '$eq' && suptype == 'text') return params.columnName + " = '" + params.value + "'";
		else if (params.operator === '$eq') return params.columnName + ' = ' + params.value;
		else if (params.operator === '$!eq' && suptype == 'text') return params.columnName + " != '" + params.value + "'";
		else if (params.operator === '$!eq') return params.columnName + ' != ' + params.value;
		else if (params.operator === '$columnref') { // add quotes to value if value is also a table columnname
			params.value = quotes + params.value.split(".").join(quotes + "." + quotes) + quotes;
			return params.columnName + ' = ' + params.value;
		} else if (params.operator === '$inq') return params.columnName + ' IN (' + this.select(params.value) + ')';
		// else if (params.operator === '$inq') text += this.wrapType(columnName, realcname) + ' IN (' + this.select(params.value) + ')';
		// else if (params.operator.indexOf('$cilike') > -1) text += 'LOWER(' + this.wrapType(columnName, realcname) + ') ~ LOWER(' + val + ')';
		else if (params.operator === '$like') {
			if (this.db_type == MYSQL) return `${params.columnName} LIKE BINARY '${params.value}'`;
			else return params.columnName + ' LIKE' + "'" + params.value + "'";
		} else if (params.operator === '$!like') {
			if (this.db_type == MYSQL) return `${params.columnName} NOT LIKE BINARY '${params.value}'`;
			else return `${params.columnName} NOT LIKE '${params.value}'`;
		} else if (params.operator === '$ilike') {
			if (this.db_type == MYSQL) return `${params.columnName} LIKE '${params.value}'`;
			else return params.columnName + ' ILIKE' + "'" + params.value + "'";
		} else if (params.operator === '$!ilike') {
			if (this.db_type == MYSQL) return `${params.columnName} NOT LIKE '${params.value}'`;
			else return `${params.columnName} NOT ILIKE '${params.value}'`;
		} else if (params.operator === '$regex') {
			if (this.db_type == MYSQL) return `${params.columnName} REGEXP '${params.value}'`;
			else return params.columnName + ' ~* ' + "'" + params.value + "'";
		} else if (params.operator === '$!regex') {
			if (this.db_type == MYSQL) return `${params.columnName} NOT REGEXP '${params.value}'`;
			else return params.columnName + ' !~ ' + "'" + params.value + "'";
		} else if (params.operator.indexOf('$cnq') > -1) return params.columnName + ' @> ARRAY[(' + this.select(params.value) + ')]';
		else if (params.operator.indexOf('$cnbq') > -1) return params.columnName + ' <@ ARRAY[(' + this.select(params.value) + ')]';
		else if (params.operator.indexOf('$cnb') > -1) return params.columnName + ' <@ ' + (params.value.indexOf('$') > -1 ? params.value : 'ARRAY[' + params.value + ']') + '::' + pgtype + '[]';
		else if (params.operator.indexOf('$!cnb') > -1) return ' NOT (' + params.columnName + ' <@ ' + params.value + '::' + pgtype + '[]) ';
		else if (params.operator.indexOf('$cn') > -1) return params.columnName + ' @> ' + params.value + '::' + pgtype;
		else if (params.operator.indexOf('$!cn') > -1) return ' NOT (' + params.columnName + ' @> ' + params.value + '::' + pgtype + ') ';

		return null;
	}

	getType(columnName) {

		var c = columnName.split('.');
		// if(c.length !== 3  ) return ""; 

		return this.currentModel.models[c[0]][c[1]].properties.columns[c[2]]?.type.toLowerCase() || "";
	}

	makeid(len) {
		len = len + 2;
		var text = "a";
		var possible = "1bc62de3f23gh4ij5k_0_lmno231pq6rst7uvw864xy9z";

		for (var i = 0; i < len; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

};