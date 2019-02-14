var roleTable = 'role_master';
var moduleTable = 'module_master';
var rolemoduleTable = 'role_module';

exports.rolelistQuery = function(req,res) {
    var sql = "SELECT RM.role_id,RM.role_name FROM "+roleTable+" RM " +
    "LEFT JOIN "+moduleTable+" MM ON MM.role_id = RM.role_id " +
    "where RM.status = 'active' AND RM.role_id!=1 group by MM.role_id ";
    return sql;
};

exports.modulelistQuery = function(req,res) {
    var sql = "SELECT MM.module_id,MM.module_name FROM "+moduleTable+" MM " +
    "where MM.status = 'active' AND MM.role_id = "+req.body.roleId+" ";
    return sql;
};

exports.rolemodulelistQuery = function(req,res) {
    var sql = "SELECT RMT.module_id,RMT.role_id FROM "+rolemoduleTable+" RMT";
    return sql;
};

exports.rolewisemodulePermission = function(req,res) {
    if(req.body.val == 1){        
        var sql = "INSERT INTO "+rolemoduleTable+" (`role_id`, `module_id`) VALUES ('"+req.body.roleId+"', '"+req.body.moduleId+"')";    
    }
    if(req.body.val == 0){   
        var sql = "DELETE FROM "+rolemoduleTable+" WHERE `role_id`="+req.body.roleId+" AND `module_id`="+req.body.moduleId+"";    
    }  
    return sql;
};
