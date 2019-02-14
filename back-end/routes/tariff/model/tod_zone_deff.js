
var tod_zone_deff_log = 'tod_zone_deff_log';
var tod_zone_master = "tod_zone_master";

exports.listQuery = function(req,res) {
    var sql = "SELECT TZM.tzm_id,TZDL.* " +
    " FROM "+tod_zone_master+" TZM "+
    " JOIN  "+tod_zone_deff_log+" TZDL ON TZDL.tzdl_id = TZM.last_tzdl_id"+
    " WHERE 1 "+
    " AND TZM.is_deleted = '0'"+
    " ORDER BY TZM.tzm_id ASC";
    //console.log(sql);
    return sql;
};

exports.addQueryTodZoneMaster = function(req, res) {
    var sql = "INSERT INTO "+tod_zone_master+" SET ? ";
    return sql;
};

exports.addQueryTodZoneDeffLog = function(req, res) {
    var sql = "INSERT INTO "+tod_zone_deff_log+" SET ? ";
    return sql;
};

exports.updateQueryTodZoneMaster = function(tzm_id) {
    var sql = " UPDATE "+tod_zone_master+" SET ? WHERE tzm_id = "+tzm_id
    return sql;
};

exports.updateQuery = function(tod_id) {
    var sql = " UPDATE "+tod_zone_deff+" SET ? WHERE tod_id = "+tod_id
    return sql;
};