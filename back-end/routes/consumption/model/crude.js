var date = require('date-and-time');
var now = new Date();
var formatted = date.format(now, 'YYYY-MM-DD HH:mm:ss');
var masterTable = 'resource_master';
var consumptionMeterTable = 'consumption_meter_assign';

exports.getConsumptionLists = function(req, res) {
    var sql = "SELECT RM.resource_name,RM.resource_id,RM.parent_resource_id " +
    " FROM "+masterTable+" RM "+
    " WHERE 1 "+
    " AND RM.is_deleted = '0'"+
    " AND ((RM.type = 'resource' AND RM.parent_resource_id = 0) OR (RM.type = 'consumption'))"+
    " AND (RM.customer_id = 0"+
    " OR RM.customer_id = "+req.body.customerId+")";
    return sql;
};

exports.deleteConsumption = function(req, res) {
    var sql = "UPDATE "+masterTable+" set is_deleted = '1' WHERE resource_id = "+req.body.resouceId+" OR parent_resource_id = "+req.body.resouceId+" ";
    return sql;
};

exports.updateConsumption = function(req, res) {
    var sql = "UPDATE "+masterTable+" SET resource_name = '"+req.body.resourceName+"' WHERE resource_id = "+req.body.resouceId+" ";
    return sql;
};

exports.rowExists = function(req, res) {
    var sql = "select count(resource_id) as cnt from "+masterTable+" WHERE resource_id = "+req.body.resouceId+" ";
    return sql;
}

exports.insertConsumption = function(req, res) {
    var sql = "INSERT INTO "+masterTable+" (`resource_name`, `parent_resource_id`, `customer_id`,`created_by`, `created_date`, `type`) VALUES ('"+req.body.resourceName+"', '"+req.body.parent_id+"', '"+req.body.customerId+"', '"+req.body.userId+"', '"+formatted+"', 'consumption')";
    return sql;
};

exports.getConsumptionMeterLists = function(req, res) {
    var sql = "SELECT RM.resource_name,RM.resource_id,RM.parent_resource_id,CM.meter_id,ML.meter_name " +
    " FROM "+masterTable+" RM "+
    " LEFT JOIN "+consumptionMeterTable+" CM ON CM.consumption_id = RM.resource_id" +
    " LEFT JOIN meter_info M ON M.meter_id = CM.meter_id" +
    " LEFT JOIN meter_info_log ML ON ML.meter_log_id = M.meter_log_id" +
    " WHERE 1 "+
    " AND RM.is_deleted = '0'"+
    " AND RM.type = 'consumption'"+
    " AND (RM.customer_id = 0"+
    " OR RM.customer_id = "+req.body.customerId+")";
    return sql;
};

exports.getMeterLists = function(req, res) {
    var sql = "SELECT M.meter_id,ML.meter_name " +
    " FROM meter_info M "+
    " LEFT JOIN meter_info_log ML ON ML.meter_log_id = M.meter_log_id" +
    " WHERE 1 "+
    " AND M.is_deleted = '0'"+
    " AND M.meter_id not in(SELECT meter_id FROM "+consumptionMeterTable+") ";
    return sql;
};

exports.meterRowExists = function(req, res) {
    var sql = "select count(meter_id) as cnt from consumption_meter_assign WHERE consumption_id = "+req.body.resourceID+" ";
    return sql;
}

exports.insertAssignMeter = function(req, res) {
    var sql = "INSERT INTO consumption_meter_assign (`consumption_id`, `meter_id`) VALUES ('"+req.body.resourceID+"', '"+req.body.meterId+"')";
    return sql;
};

exports.updateAssignMeter = function(req, res) {
    var sql = "UPDATE consumption_meter_assign SET meter_id = '"+req.body.meterId+"' WHERE consumption_id = "+req.body.resourceID+" ";
    return sql;
};