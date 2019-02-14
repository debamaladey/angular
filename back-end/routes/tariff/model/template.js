var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');
var async = require('async');
var QueryBuilder = require('datatable');

exports.template_list_get = function(req, res){
    var tm_id = req.params.tm_id;
    var qb = req.app.get('qb');
    qb.select('TM.*,TMD.temp_name, ST.name state_name, CT.name city_name, RM.resource_name, RU.unit_name,UM.name user_name');
    qb.from('template_master TM ');
    qb.join('template_details_log TMD','TMD.tdl_id=TM.tdl_id','INNER');
    qb.join('state ST','ST.id=TMD.state_id');
    qb.join('city CT','CT.id=TMD.city_id');
    qb.join('resource_master RM','RM.resource_id=TMD.resource_id');
    qb.join('resource_unit RU','RU.ru_id=TMD.ru_id');
    qb.join('user_master UM','UM.id=TMD.created_by');
    qb.where('TM.is_deleted', 'no');
    qb.order_by('TM.tm_id','DESC');
    qb.get((err, result) => {
         //console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        }else {
            //console.log(result);
            var repApiData = { 
                status : 'success', msg : 'fetch successfully.', data : { list: result }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.get_template_data = function(req, res){
    var tm_id = req.params.tm_id;
    var qb = req.app.get('qb');
    qb.select('TM.*, TMD.temp_name, TC.tc_id, TC.tc_name, tc_status');
    qb.from('template_master TM ');
    qb.join('template_details_log TMD','TMD.tdl_id=TM.tdl_id','INNER');
    qb.join('template_charges TC','TC.tdl_id=TM.tdl_id','INNER');
    qb.where('TM.tm_id', tm_id);
    qb.where('TM.is_deleted', 'no');
    qb.get((err, result) => {
         //console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        }else {
            //console.log(result);
            var repApiData = { 
                status : 'success', msg : 'fetch successfully.', data : { list: result }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.save = function(req, res) {
    postData = req.body;
    retData = templateDataPreparation(postData);
    var qb = req.app.get('qb');
    qb.insert('template_master', retData.template_master, (err, result) => {
        //  console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        }else {
            tm_id = result.insertId;
            addTemplateDetailsLogTable(retData, tm_id, qb);
            var repApiData = { 
                status : 'success', msg : 'fetch successfully.', data : { list: tm_id }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    })
};

addTemplateDetailsLogTable = function(data, tm_id, qb){
    postData = data.template_details_log
    inData = {
        temp_name: postData.temp_name,
        state_id: postData.state_id,
        city_id: postData.city_id,
        resource_id: postData.resource_id,
        rp_id: postData.rp_id,
        ru_id: postData.ru_id,
        created_by: postData.created_by,
        tm_id: tm_id
    }
    qb.insert('template_details_log', inData, (err, res1) => {
        tdl_id = res1.insertId;
        addTemplateChargesTable(data, tdl_id, tm_id, qb);
        updateTemplateMasterTable(tdl_id, tm_id, qb);
    });
}

addTemplateChargesTable = function(data, tdl_id, tm_id, qb){
    postData = data.template_charges;
    inData = [];
    Object.entries(postData).forEach(([key, value]) => {
        tempData = {tc_name : key,tc_status : value,tdl_id : tdl_id, tm_id: tm_id};
        inData.push(tempData);
    });

    qb.insert_batch('template_charges', inData, (err, res) => {
        
    });
}

updateTemplateMasterTable = function(tdl_id, tm_id, qb){
    data = { tdl_id: tdl_id };
    where = { tm_id: tm_id };
    qb.update('template_master', data, where, (err, res) => {
        
    });
}

templateDataPreparation = function(postData){
    if(postData.tm_id == 0){
        data = {
            template_master : {
                tdl_id: 0,
            },
            template_details_log : {
                temp_name: postData.temp_name,
                state_id: postData.state_id,
                city_id: postData.city_id,
                resource_id: postData.resource_id,
                rp_id: postData.rp_id,
                ru_id: postData.ru_id,
                created_by: postData.created_by,
            },
            template_charges : {
                checkbox_res_chrages: (postData.checkbox_res_chrages)?1:0,
                checkbox_env_chrages: (postData.checkbox_env_chrages)?1:0,
                checkbox_fixed_chrages: (postData.checkbox_fixed_chrages)?1:0,
                checkbox_load_chrages: (postData.checkbox_load_chrages)?1:0,
                checkbox_contract_chrages: (postData.checkbox_contract_chrages)?1:0,
            }
        }
    }
    return data;
}

exports.template_config_save_post = function(req, res){
    postData = req.body;
    var tm_id = postData.tm_id;
    inData = [];
    Object.keys(postData).forEach(function(key) {
        if(key != 'tm_id'){
            var val = postData[key];
            for (let index = 0; index < val.length; index++) {
                const element = val[index];
                inData.push(element);
            }
        }
    });
    var qb = req.app.get('qb');
    qb.insert_batch('template_charges_var_name', inData, (err, result) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            var repApiData = { 
                status : 'success', msg : 'Added successfully.', data : { list: 0 }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    });
    let now = new Date();
    nowDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    upData = { 
        "config_status" : "yes", 
        "config_status_date" : nowDate 
    };
    where = {"tm_id" : tm_id};
    qb.update('template_master', upData, where, (err1, result1) => {
    });
}

exports.template_delete_get = function(req, res){
    var qb = req.app.get('qb');
    let now = new Date();
    nowDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    var tm_id = req.params.tm_id;
    upData = { 
        "is_deleted" : "yes", 
        "is_deleted_date" : nowDate 
    };
    where = {"tm_id" : tm_id};
    qb.update('template_master', upData, where, (err, result) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            var repApiData = { 
                status : 'success', msg : 'Deleted successfully.', data : { list: 0 }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.get_template_data_view = function(req, res){
    var tm_id = req.params.tm_id;
    var qb = req.app.get('qb');
    qb.select('TM.*,TMD.temp_name, ST.name state_name, CT.name city_name, RM.resource_name, RP.parameter_name, RU.unit_name,UM.name user_name');
    qb.from('template_master TM ');
    qb.join('template_details_log TMD','TMD.tdl_id=TM.tdl_id','INNER');
    qb.join('state ST','ST.id=TMD.state_id');
    qb.join('city CT','CT.id=TMD.city_id');
    qb.join('resource_master RM','RM.resource_id=TMD.resource_id');
    qb.join('resource_parameter RP','RP.rp_id=TMD.rp_id');
    qb.join('resource_unit RU','RU.ru_id=TMD.ru_id');
    qb.join('user_master UM','UM.id=TMD.created_by');
    qb.where('TM.is_deleted', 'no');
    qb.where('TM.tm_id', tm_id);
    qb.get((err, result) => {
         //console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        }else {
            //console.log(result);
            var repApiData = { 
                status : 'success', msg : 'fetch successfully.', data : { list: result }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.get_template_config_data_view = function(req, res){
    var tm_id = req.params.tm_id;
    var qb = req.app.get('qb');
    qb.select('TM.tm_id,TM.tdl_id,TC.tc_name,tc_status, TCVN.tcvn_id, TCVN.tc_var_name ');
    qb.from('template_master TM ');
    qb.join('template_details_log TMD','TMD.tdl_id=TM.tdl_id','INNER');
    qb.join('template_charges TC','TC.tdl_id=TMD.tdl_id','INNER');
    qb.join('template_charges_var_name TCVN','TCVN.tc_id=TC.tc_id','INNER');
    qb.where('TM.is_deleted', 'no');
    qb.where('TM.tm_id', tm_id);
    qb.get((err, result) => {
         //console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        }else {
            //console.log(result);
            var repApiData = { 
                status : 'success', msg : 'fetch successfully.', data : { list: result }
            }
            var token = jwt.sign({ rep: repApiData }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.sa_template_datatable_post = function(req, res){
    var tableDefinition = {
        sDatabaseOrSchema: '`'+config_master.database.db+'`',
        //sSelectSql: "city.id as city_id, city.name as city_name, state.name AS state_name, country.name AS country_name",
        //sFromSql: "city JOIN state ON city.state_id=state.id JOIN country ON state.country_id = country.id",
        sSelectSql: "TM.*,TMD.temp_name, ST.name state_name, CT.name city_name, RM.resource_name, RU.unit_name,UM.name user_name",
        sFromSql: " template_master TM "+ 
        " INNER JOIN template_details_log TMD ON TMD.tdl_id=TM.tdl_id "+ 
        " LEFT JOIN state ST ON ST.id=TMD.state_id "+
        " LEFT JOIN city CT ON CT.id=TMD.city_id "+
        " LEFT JOIN resource_master RM ON RM.resource_id=TMD.resource_id "+
        " LEFT JOIN resource_unit RU ON RU.ru_id=TMD.ru_id "+
        " LEFT JOIN user_master UM ON UM.id=TMD.created_by ",    
        sWhereAndSql: " TM.is_deleted='no' ",
        aSearchColumns: ["TMD.temp_name", "ST.name", "CT.name", "RM.resource_name", "RU.unit_name", "UM.name"],
    
    };
    var queryBuilder = new QueryBuilder(tableDefinition);
    // console.log(req.body);

    
    var requestQuery = req.body;
    for (let i = 0; i < requestQuery.columns.length; i++) {
        const element = requestQuery.columns[i];
        if (requestQuery.columns[i].searchable) {
            requestQuery.columns[i].searchable = 'true';
        }
        if (requestQuery.columns[i].orderable) {
            requestQuery.columns[i].orderable = 'true';
        }        
    }

    // Build an object of SQL statements
    var queries = queryBuilder.buildQuery(req.body);

    // Connect to the database
    var myDbObject = req.app.get('connection_enview_master');

    // Execute the SQL statements generated by queryBuilder.buildQuery
    myDbObject.query(queries.changeDatabaseOrSchema, function (err) {
        if (err) { res.status(403).json({ err }); }
        else {
            
            if (!queries.recordsFiltered) {
                queries.recordsFiltered = queries.recordsTotal;
            }

            // res.status(403).json(queries);
            // return false;
            async.parallel(
                {
                    recordsFiltered: function (cb) {
                        myDbObject.query(queries.recordsFiltered, cb);
                    },
                    recordsTotal: function (cb) {
                        myDbObject.query(queries.recordsTotal, cb);
                    },
                    select: function (cb) {
                        myDbObject.query(queries.select, cb);
                    }
                },
                function (err, results) {
                    if (err) { res.status(403).json({ err }); }
                    else {
                        // res.status(403).json(queryBuilder.parseResponse(results));
                        var token = jwt.sign(queryBuilder.parseResponse(results), config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                }
            );
        }
    });
}



