var json2sql = require.main.require('./models/JsonToSql.js');
var replaceModelWithBody = require.main.require('./models/replaceModelWithBody.js').bodytoquery;

exports.executeClientRequest = executeClientRequest;

function executeClientRequest(params, callback) {

    if (params.query_model.sqlmethod == 'insert') {

        var modelob = replaceModelWithBody(params.query_model.query_json, params.request.body);
        if (modelob.error) {
            return callback({
                response_code: 400,
                error: modelob.error
            })
        }

        var query = new json2sql(
            modelob.models,
            params.currentModel, {}
        ).generate();

        params.db({
            text: query.text,
            values: query.values
        }, function(err, result) {
            if (err) {
                return callback({
                    response_code: 500,
                    error: err
                })
            }

            var returnob = {};
            var returnpaths = Object.keys(result.rows[0])

            for (let i = 0; i < returnpaths.length; i++) {
                _.set(returnob, returnpaths[i], result.rows[0][returnpaths[i]])
            }

            return callback(null, {
                data: returnob
            })

        })


    } else if (params.query_model.sqlmethod == 'select' || params.query_model.sqlmethod == 'update') {

        if (params.query_model.querypaths && params.query_model.querypaths.length > 0) {
            for (let i = 0; i < params.query_model.querypaths.length; i++) {
                const element = params.query_model.querypaths[i];

                var cond_val;
                if (element.input_key.indexOf('URL') > -1) {
                    if (!url_param_value) {
                        return callback({
                            response_code: 400,
                            error: 'Missing URL param'
                        })
                    }
                    cond_val = url_param_value
                } else if (element.input_key.indexOf('QUERY') > -1) {
                    var query_param_split = element.input_key.split('.')
                    query_param_split.shift()
                    var query_param = query_param_split.join('.');
                    if (!params.request.query[query_param]) {
                        return callback({
                            response_code: 400,
                            error: 'Missing query param' + query_param
                        })
                    }
                    cond_val = params.request.query[query_param]
                }
                _.set(params.query_model.query_json.where, element.path + 'value', cond_val)
            }
        }

        if (params.query_model.sqlmethod == 'update') {
            var modelob = replaceModelWithBody([params.query_model.query_json], params.request.body);
            if (modelob.error) {
                return callback({
                    response_code: 400,
                    error: modelob.error
                })
            }
        }

        if (params.query_model.pagination) {
            if (params.request.query._page) {
                var page = parseInt(params.request.query._page);
                if (!isNaN(page)) {
                    params.query_model.query_json.offset = params.query_model.query_json.limit * page;
                }
            }
        }

        var query = new json2sql(
            [params.query_model.query_json],
            params.currentModel, {}
        ).generate();

        params.db({
            text: query.text,
            values: query.values
        }, function(err, result) {
            if (err) {
                return callback({
                    response_code: 500,
                    error: err
                })
            }

            var resob;

            if (params.query_model.sqlmethod == 'select') {
                resob = {
                    [params.query_model.query_json.table_alias]: result.rows
                }
            } else {
                resob = result.rows[0]
            }

            return callback(null, {
                data: resob
            })
        })


    } else {
        return callback({
            response_code: 404,
            error: 404
        })
    }

}