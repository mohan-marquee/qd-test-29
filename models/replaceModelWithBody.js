

var test_models = [
    {
      "schema": "public",
      "table": "firms",
      "table_alias": "firms",
      "table_body_path": "firms",
      "columns": [
        {
          "id": "16593.2",
          "pathid": "16593$2",
          "columnName": "public.firms.name",
          "operator": "$req-body",
          "value": "firms.name",
          "body_path": "firms"
        }
      ],
      "with_alias": "qinsert_firms",
      "returns": {
        "qref": [
          "uid"
        ],
        "user": []
      },
      "conflict": {
        "constraint": null,
        "columns": []
      },
      "method": "insert",
      "allow_multiple_row": false,
      "aggAlias": "firms$ayo4zb",
      "queryAlias": "qao5p64"
    },
    {
      "schema": "public",
      "table": "firm_contacts",
      "table_alias": "firm_contacts",
      "table_body_path": "firms.firm_contacts",
      "columns": [
        {
          "id": "16563.2",
          "pathid": "16593.1-16563.2$2",
          "columnName": "public.firm_contacts.firm_id",
          "operator": "$qref",
          "value": "qinsert_firms$uid"
        },
        {
          "id": "16563.4",
          "pathid": "16593.1-16563.2$4",
          "columnName": "public.firm_contacts.email",
          "operator": "$req-body",
          "value": "firms.firm_contacts.email",
          "body_path": "firms.firm_contacts"
        }
      ],
      "with_alias": "qinsert_firm_contacts",
      "returns": {
        "qref": [],
        "user": []
      },
      "conflict": {
        "constraint": null,
        "columns": []
      },
      "method": "insert",
      "allow_multiple_row": true,
      "aggAlias": "firm_contacts$alwysw",
      "queryAlias": "qa_3nmw"
    }
]

var test_body = {
    "firms": {
      "name": "TEST FIRM",
      "firm_contacts": [
        {
          "email": "e@re.com"
        },
        {
          "email": "e@rse.com",
          name: 'name'
        }
      ]
    }
  }


const _ = require('lodash');

function test() {

    var ob = bodytoquery(test_models, test_body)
    console.log(JSON.stringify(ob, null, 4));
}

// todo: add 'final_key' in insert columns
function bodytoquery(models, body) {

    for (let i = 0; i < models.length; i++) {
        var model = models[i];

        var modelVal = _.get(body, model.table_body_path);

        if(!modelVal) return {error: "Value is null for '" + model.table_body_path + "'"};

        if(model.allow_multiple_row) {

            if(!Array.isArray(modelVal)) {
                return {error: "Value for '" + model.table_body_path + "' should be an array"};
            }

            var new_columns = []

            for (let j = 0; j < modelVal.length; j++) {

                var cols = []
                
                column_loop:
                for (let k = 0; k < model.columns.length; k++) {
                    var column = JSON.parse(JSON.stringify(model.columns[k]));
                    if(column.operator == '$req-body') {
                        var col_val_spl = column.value.split('.')
                        var final_key = col_val_spl[col_val_spl.length - 1]
                        if(typeof modelVal[j][final_key] === 'undefined' || modelVal[j][final_key] === null) {
                          if(column.required) return {error: "Value is null for '" + column.columnName.split('.')[2] + "'"};
                          continue column_loop;
                        }
                        column.value = modelVal[j][final_key]
                    }

                    cols.push(column)
                }

                new_columns.push(cols)
                
            }

            model.columns = new_columns

        } else {

            var new_cols = [];

            column_loop:
            for (let j = 0; j < model.columns.length; j++) {

                if(model.columns[j].operator == '$req-body') {
                    var col_val_spl = model.columns[j].value.split('.')
                    var final_key = col_val_spl[col_val_spl.length - 1]
                    if(typeof modelVal[final_key] === 'undefined' || modelVal[final_key] === null) {
                      if(model.columns[j].required) return {error: "Value is null for '" + model.columns[j].columnName.split('.')[2] + "'"};
                      continue column_loop;
                    }
                    model.columns[j].value = modelVal[final_key];
                    new_cols.push(model.columns[j])
                }
            }

            if(new_cols.length == 0) return {error: 'All values missing for ' + model.table_body_path}

            model.columns = new_cols;

            // model.conflict.columns.push({
            //   id: '16563.5',
            //   pathid: '16563.5',
            //   columnName: 'public.firm_contacts.designation',
            //   operator: '$excluded',
            //   value: 'firm_contacts.designation',
            //   required: false,
            //   body_path: 'firm_contacts'
            // })

            if(model.conflict && model.conflict.columns && model.conflict.columns.length > 0) {

              var con_cols = []

              con_cols_loop:
              for (let j = 0; j < model.conflict.columns.length; j++) {
                const element = model.conflict.columns[j];

                var col_val_spl = element.value.split('.')
                var final_key = col_val_spl[col_val_spl.length - 1]

                if(typeof modelVal[final_key] === 'undefined') {
                  continue con_cols_loop;
                }

                element.value = modelVal[final_key]

                delete element.operator;

                con_cols.push(element)
                
              }

              model.conflict.columns = con_cols

            }

        }
    }

    return {models: models}

}

exports.bodytoquery = bodytoquery;

exports.test = test