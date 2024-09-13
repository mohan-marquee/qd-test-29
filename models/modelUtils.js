exports.idToJoinPathOb = function(params) {

    var id = params.id;
    var currentModel = params.currentModel;

    // id = "78.1-81.21-81.34-50.1"

    let id_spl = id.split('-');

    if (id_spl.length == 2) {
        // simple
        return {
            condition: 'AND',
            rules: [{
                columnName: currentModel.models.idToName[id_spl[1]].join('.'),
                operator: '$columnref',
                value: currentModel.models.idToName[id_spl[0]].join('.')
            }]

        };
    } else {
        // chain
        let dummy_on = {
            condition: 'AND',
            rules: [{
                columnName: 'uid',
                operator: '$inq',
                value: {
                    schema: 'public',
                    table: 'jtable',
                    columns: [{
                        columnName: 'campaign_id'
                    }],
                    where: {
                        condition: 'AND',
                        rules: [{
                            columnName: 'uid',
                            operator: '$inq',
                            value: {
                                schema: 'public',
                                table: 'jtable',
                                columns: [{
                                    columnName: 'pitch_id'
                                }],
                                where: {
                                    condition: 'AND',
                                    rules: [{
                                        columnName: 'contact_id',
                                        operator: '$columnref',
                                        value: 'marketing.contacts.uid'
                                    }]
                                }
                            }
                        }]
                    }
                }
            }]
        };

        let on_models = [];
        let init_w = {
            condition: 'AND'
        };
        // ////console.log(id_spl.length)
        for (let i = 0; i < id_spl.length; i = i + 2) {
            const element = id_spl[i];
            if (i == 0) {
                // ////console.log("P1")
                // init where
                // init_w[allModels['cd00ac2a-79d7-4cdb-a7d5-9258590ab899'].test.idToName[id_spl[0]].join('.')] = {$columnref: allModels['cd00ac2a-79d7-4cdb-a7d5-9258590ab899'].test.idToName[id_spl[1]].join('.')};
                init_w.rules = [{
                    columnName: currentModel.models.idToName[id_spl[1]].join('.'),
                    operator: '$columnref',
                    value: currentModel.models.idToName[id_spl[0]].join('.')
                }];

            } else {
                let n1 = currentModel.models.idToName[id_spl[i]];
                let n2 = currentModel.models.idToName[id_spl[i + 1]];
                let n3 = currentModel.models.idToName[id_spl[i + 2]];
                if (on_models.length == 0) {


                    on_models.push({
                        schema: n1[0],
                        table: n1[1],
                        columns: [{
                            columnName: n1.join('.')
                        }],
                        where: init_w
                    });
                }
                if (!n3) {
                    on_models.push({
                        condition: 'AND',
                        rules: [{
                            columnName: n2.join('.'),
                            operator: '$inq',
                            value: on_models[on_models.length - 1]
                        }]
                    });
                } else {


                    on_models.push(

                        {
                            schema: n3[0],
                            table: n3[1],
                            columns: [{
                                columnName: n3.join('.')
                            }],
                            where: {
                                condition: 'AND',
                                rules: [{
                                    columnName: n2.join('.'),
                                    operator: '$inq',
                                    value: on_models[on_models.length - 1]
                                }]
                            }
                        }

                    );

                }
            }
        }

        return on_models[on_models.length - 1];

    }

}

exports.idToJoinPathText = function(params) {

    var id = params.id;
    var currentModel = params.currentModel;

    var arr = [];

    let id_spl = id.split('-');

    for (let i = 0; i < id_spl.length; i++) {
        const element = id_spl[i];
        var textid = currentModel.models.idToName[element].join('.');
        if (arr[arr.length - 1] != textid) arr.push(textid);
    }
    return arr;
}