var date = require('date-and-time');
var now = new Date();
var formatted = date.format(now, 'YYYY-MM-DD HH:mm:ss');
var masterTable = 'resource_master';
var userMasterTable = 'user_master';
var resourceParamRelTable = 'resource_parameter_relation';
var parammeterTable = 'resource_parameter';
var resourceUnitTable = 'resource_unit';
var masterTableLog = 'resource_master_log';

exports.listQuery = function(req,res) {
    var sql = "SELECT RM.*, UM.name user_name,count(DISTINCT RU.ru_id) total_unit, count(DISTINCT RU.rp_id) total_parameter, RU1.unit_name " +
    " FROM "+masterTable+" RM "+
    " JOIN "+resourceParamRelTable+" RPR ON RPR.resource_id=RM.resource_id"+
    " LEFT JOIN "+resourceUnitTable+" RU ON RU.rp_id=RPR.rp_id" +
    " LEFT JOIN "+resourceUnitTable+" RU1 ON RU1.ru_id=RM.billing_ru_id" +
    " LEFT JOIN "+userMasterTable+" UM ON UM.id=RM.created_by " +
    " WHERE RM.`parent_resource_id` = 0 "+
    " AND RM.is_deleted = '0'"+
    " GROUP BY RM.resource_id "+
    " ORDER BY RM.resource_id DESC";
    //console.log(sql);
    return sql;
};

exports.deletedListQuery = function(req,res) {
    var sql = "SELECT RM.* " +
    " FROM "+masterTable+" RM "+
    " WHERE RM.`parent_resource_id` = 0 "+
    " AND RM.is_deleted = '1'"+
    " ORDER BY RM.resource_id DESC";
    //console.log(sql);
    return sql;
};

exports.addQuery = function(req,res) {
    var sql = "INSERT INTO "+masterTable+" SET ? ";
    return sql;
};

exports.lastInsertId = function(req,res){
    var sql = " SELECT LAST_INSERT_ID()";
    return sql;
}

exports.viewQuery = function(req,res) {
    var sql = "SELECT RM.* FROM "+masterTable+" RM " +
    " WHERE RM.`parent_resource_id` = 0" +
    " AND RM.is_deleted = '0'"+
    " AND RM.resource_id = "+req.params.id;
    return sql;
};

exports.updateQuery = function(req,res) {
    var sql = " UPDATE "+masterTable+" SET ? WHERE resource_id = "+req.params.id
    return sql;
};

exports.deleteStatusQuery = function(req, res){
    var sql = " UPDATE "+masterTable+" SET ? WHERE resource_id = "+req.params.id;
    return sql;
};

exports.unDeleteStatusQuery = function(req, res){
    var sql = " UPDATE "+masterTable+" SET ? WHERE resource_id = "+req.params.id;
    return sql;
};

exports.insertResourceMasterLog = function(req){
    var sql = "INSERT INTO "+masterTableLog+" SET ? ";
    return sql;
}

exports.checkUniqueNameQuery = function(resource_name, resource_id){
    var sql = "SELECT RM.* FROM "+masterTable+" RM " +
    " WHERE RM.`parent_resource_id` = 0" +
    " AND RM.is_deleted = '0'";
    if(resource_name != ''){
        sql += " AND RM.resource_name = '"+resource_name+"'";
    }
    if(resource_id > 0){
        sql += " AND RM.resource_id != "+resource_id;
    }
    //console.log(sql);
    return sql;
}

exports.addResourceUnitQuery = function(req, res){
    var sql = "INSERT INTO "+resourceUnitTable+" (unit_name,resource_id) VALUES ? ";
    return sql;
};

exports.unitListQuery = function(req,res) {
    var sql = "SELECT RP.parameter_name, group_concat(RU.unit_name ORDER BY RP.parameter_name ASC, RU.ru_id DESC) unit_name " +
    " FROM "+resourceParamRelTable+" RPR "+
    " LEFT JOIN "+parammeterTable+" RP ON RP.rp_id=RPR.rp_id" +
    " LEFT JOIN "+resourceUnitTable+" RU ON RU.rp_id=RP.rp_id" +
    " WHERE 1 "+
    " AND RPR.`resource_id` = "+req.params.resource_id+
    " GROUP BY RPR.rp_id ";
    //console.log(sql);
    return sql;
};

exports.unitDeleteStatusQuery = function(req,res){
    var sql = " UPDATE "+resourceUnitTable+" SET ? WHERE ru_id = "+req.params.unit_id;
    return sql;
}

exports.getCustomerWiseResource = function(req, res){
    var sql =  " SELECT * "+
            " FROM resource_master "+
            " WHERE 1 "+
            " AND (customer_id = 0 OR customer_id = 1) "+
            " ORDER BY parent_resource_id";
    //console.log(sql);        
    return  sql;       
}

exports.getResourceLists = function(req, res) {
    var sql = "SELECT RM.resource_name,RM.resource_id,RM.parent_resource_id " +
    " FROM "+masterTable+" RM "+
    " WHERE 1 "+
    " AND RM.is_deleted = '0'"+
    " AND RM.type = 'resource'"+
    " AND (RM.customer_id = 0"+
    " OR RM.customer_id = "+req.body.customerId+")";
    return sql;
};

exports.deleteResource = function(req, res) {
    var sql = "UPDATE "+masterTable+" SET is_deleted = '1' WHERE resource_id = "+req.body.resouceId+" OR parent_resource_id = "+req.body.resouceId+" ";
    return sql;
};

exports.updateResource = function(req, res) {
    var sql = "UPDATE "+masterTable+" SET resource_name = '"+req.body.resourceName+"' WHERE resource_id = "+req.body.resouceId+" ";
    return sql;
};

exports.rowExists = function(req, res) {
    var sql = "select count(resource_id) as cnt from "+masterTable+" WHERE resource_id = "+req.body.resouceId+" ";
    return sql;
}

exports.insertResource = function(req, res) {
    var sql = "INSERT INTO "+masterTable+" (`resource_name`, `parent_resource_id`, `customer_id`,`created_by`, `created_date`) VALUES ('"+req.body.resourceName+"', '"+req.body.parent_id+"', '"+req.body.customerId+"', '"+req.body.userId+"', '"+formatted+"')";
    console.log(sql);
    return sql;
};
