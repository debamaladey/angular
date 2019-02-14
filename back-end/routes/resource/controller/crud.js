
var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crude');
var arrayToTree = require('array-to-tree');
var title = 'Resource';
var unit_title = 'Resource unit';

exports.index_get = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.listQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.deleted_list_get = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.deletedListQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.add_post = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    var postData = req.body;
    var resource_master = {
        resource_name:postData.resource_name,
        created_by:postData.created_by
    }
    connection_enview_master.query(queryModel.checkUniqueNameQuery(postData.resource_name, 0), resource_master, function (errCUR, resultCUR) {
        if(errCUR){
            res.status(403).json({ errCUR });
        }else{
            if(resultCUR.length >= 1){
                var rep = {
                    status : 'danger',
                    msg : title+' is already used',
                    data : null
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }else{
                connection_enview_master.query(queryModel.addQuery(req, res), resource_master, function (err, result) {  
                    if (err) {
                        res.status(403).json({ err });
                    }else {
                        var last_userid = result.insertId;
                        if(last_userid > 0){
                            var rep = {
                                status : 'success',
                                msg : title+' created Successfully',
                                data : last_userid
                            }
                        }else{
                            var rep = {
                                status: 'danger',
                                msg: ' Something went wrong',
                                data : null
                            }
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                })
            }
        }
        
    })
};

exports.view_get = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.viewQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var rep = {
                status : 'success',
                msg : ' get one Successfully',
                data : result
            }
            //console.log(result);
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.update_post = function(req, res){
    var connection_enview_master = req.app.get('connection_enview_master');
    var data = req.body;
    var postData = {
        resource_name : data.resource_name
    }
    connection_enview_master.query(queryModel.checkUniqueNameQuery(data.resource_name, req.params.id), postData, function (errCUR, resultCUR) {
        if(errCUR){
            res.status(403).json({ errCUR });
        }else{
            if(resultCUR.length >= 1){
                var rep = {
                    status : 'danger',
                    msg : title+' is already used',
                    data : null
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }else{
                connection_enview_master.query(queryModel.updateQuery(req, res), postData, function (err, result) {  
                    if (err) {
                        res.status(403).json({ err });
                    }else {
                        var rep = {
                            status : 'success',
                            msg : title+' updated Successfully',
                            data : result
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                })
            }
        }
    })
};

exports.delete_status_change_get = function(req, res){
    var connection_enview_master = req.app.get('connection_enview_master');
    var postData = {
        is_deleted : '1'
    }
    connection_enview_master.query(queryModel.deleteStatusQuery(req, res), postData, function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            insertResourceMasterLog(req, 'delete', connection_enview_master);
            var rep = {
                status : 'success',
                msg : title+' deleted Successfully',
                data : result
            }
            //console.log(result);
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
}

exports.un_delete_status_change_post = function(req, res){
    var connection_enview_master = req.app.get('connection_enview_master');
    var postData = req.body;
    connection_enview_master.query(queryModel.unDeleteStatusQuery(req, res), postData, function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            insertResourceMasterLog(req,'add',connection_enview_master);
            var rep = {
                status : 'success',
                msg : title+' deleted Successfully',
                data : result
            }
            //console.log(result);
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
}

insertResourceMasterLog = function(req, status, db_con){
    var postData = req.body;
    var inData = {};
    if(status == 'add'){
        inData = {
            resource_id:req.params.id,
            ru_id:postData.billing_ru_id,
            created_by:postData.created_by,
            action:status
        } ;
    }else if(status == 'delete'){
        inData = {
            resource_id:req.params.id,
            ru_id:0,
            created_by:req.params.user_id,
            action:status
        }
    }
    console.log(inData);
    db_con.query(queryModel.insertResourceMasterLog(req), inData);
}

exports.unit_index_get = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    //console.log(req.params);
    connection_enview_master.query(queryModel.unitListQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.unit_delete_status_change_get = function(req, res){
    var connection_enview_master = req.app.get('connection_enview_master');
    var postData = {
        is_deleted : '1'
    }
    connection_enview_master.query(queryModel.unitDeleteStatusQuery(req, res), postData, function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var rep = {
                status : 'success',
                msg : unit_title+' deleted Successfully',
                data : result
            }
            //console.log(result);
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
}

exports.unit_add_post = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    var postData = req.body;
    var resource_master = {
        resource_name:postData.resource_name,
        created_by:postData.created_by
    }
    connection_enview_master.query(queryModel.checkUniqueNameQuery(postData.resource_name, 0), resource_master, function (errCUR, resultCUR) {
        if(errCUR){
            res.status(403).json({ errCUR });
        }else{
            if(resultCUR.length >= 1){
                var rep = {
                    status : 'danger',
                    msg : title+' is already used',
                    data : null
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }else{
                connection_enview_master.query(queryModel.addQuery(req, res), resource_master, function (err, result) {  
                    if (err) {
                        res.status(403).json({ err });
                    }else {
                        var last_userid = result.insertId;
                        if(last_userid > 0){
                            var rep = {
                                status : 'success',
                                msg : title+' created Successfully',
                                data : last_userid
                            }
                        }else{
                            var rep = {
                                status: 'danger',
                                msg: ' Something went wrong',
                                data : null
                            }
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                })
            }
        }
        
    })
};

exports.unit_view_get = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.viewQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var rep = {
                status : 'success',
                msg : ' get one Successfully',
                data : result
            }
            //console.log(result);
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.unit_update_post = function(req, res){
    var connection_enview_master = req.app.get('connection_enview_master');
    var data = req.body;
    var postData = {
        resource_name : data.resource_name
    }
    connection_enview_master.query(queryModel.checkUniqueNameQuery(data.resource_name, req.params.id), postData, function (errCUR, resultCUR) {
        if(errCUR){
            res.status(403).json({ errCUR });
        }else{
            if(resultCUR.length >= 1){
                var rep = {
                    status : 'danger',
                    msg : title+' is already used',
                    data : null
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }else{
                connection_enview_master.query(queryModel.updateQuery(req, res), postData, function (err, result) {  
                    if (err) {
                        res.status(403).json({ err });
                    }else {
                        var rep = {
                            status : 'success',
                            msg : title+' updated Successfully',
                            data : result
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                })
            }
        }
    })
};

exports.customer_wise_resource_get = function(req, res){
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.getCustomerWiseResource(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            var rep = {
                status : 'success',
                msg : title+' updated Successfully',
                data : result
            }
            var token = getEncodedData(rep);
            if(result.length > 0){
                var dd = Array;
                result.forEach(element => {
                    dd[element.parent_resource_id] = Array;
                    dd[element.parent_resource_id][element.resource_id] = element.resource_name 
                    //console.log(element);
                });
                console.log(dd);
            }
            res.status(200).send({ auth: true, token: rep});
        }
    })
}

getEncodedData = function(rep){
    var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token
}

// exports.check_unique_name_post = function(req, res){
//     var connection_enview_master = req.app.get('connection_enview_master');
//     connection_enview_master.query(queryModel.checkUniqueNameQuery(req, res), function (err, result) {  
//         if (err) {
//             res.status(403).json({ err });
//         }else {
//             var rep = {
//                 status : 'success',
//                 msg : title+' hit Successfully',
//                 data : result
//             }
//             var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
//                 expiresIn: 86400 // expires in 24 hours
//             });
//             res.status(200).send({ auth: true, token: token });
//         }
//     })
// }

// exports.add_post = function(req, res) {
//     //resource_model.add();
//     res.status(200).send({ auth: true, token: token });
// };




// res.status(200).send({ auth: true, token: token });
// res.status(403).send({ message: 'Wrong Password' });
// res.status(400).send({ message: 'Wrong Email' });
// 402 Payment Required
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 500 Internal Server Error
// 502 Bad Gateway
// 503 Service Unavailable

exports.get_lists = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.getResourceLists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            
            if(result.length > 0){
                var resourceArr = new Array();
                result.forEach(element => {               
                    resourceArr.push({
                        id: element.resource_id,                        
                        name: element.resource_name,
                        parent_id: element.parent_resource_id
                      });
                    // resourceArr[element.resource_id] = new Array();
                    // resourceArr[element.resource_id][element.parent_resource_id] = element.resource_name; 
                });              
            }
            var data = (arrayToTree(resourceArr));
            var token = jwt.sign({ list: data }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });   
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.delete_resource = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.deleteResource(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            var rep = {
                status: 'success',
                msg: 'Resource deleted Successfully'
            }
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });
}

exports.add_edit_resource = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.rowExists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            if(result[0].cnt>0){
                connection_enview_master.query(queryModel.updateResource(req, res), function (err1, result1) {
                    if(err1){
                        res.status(403).json({ err1 });
                    }else{
                        var rep = {
                            status: 'success',
                            msg: 'Resource updated Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                });
            }else{
                connection_enview_master.query(queryModel.insertResource(req, res), function (err1, result1) {
                    if(err1){
                        res.status(403).json({ err1 });
                    }else{
                        var rep = {
                            status: 'success',
                            msg: 'Resource Added Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                });
            }            
        }
    });
}