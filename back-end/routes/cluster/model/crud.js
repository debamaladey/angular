var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');
var date = require('date-and-time');
var now = new Date();
var formatted = date.format(now, 'YYYY-MM-DD HH:mm:ss');

exports.cluster_list = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('cluster_name,id')
        .from('cluster_master')
        .where('is_deleted','0')
        .order_by('id', 'desc')
        .get((err, response) => {
            if (err) {
                res.status(403).json({ err });
            } else {
                var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        })
};

exports.cluster_delete = function (req, res) {
    var qb = req.app.get('qb');
    qb.update('cluster_master', { is_deleted: 1 }, { id: req.body.id }, (err, response2) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            if (response2.affectedRows > 0) {
                var rep = {
                    status: 'success',
                    msg: 'Cluster deleted Successfully'
                }
                var token = jwt.sign({ list: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            } 
        }
    });
};

exports.customer_lists = function (req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT C.id,C.customer_name FROM customer C WHERE C.id NOT IN(SELECT AC.customer_id FROM cluster_customer_relation AC LEFT JOIN cluster_master CM on CM.id = AC.cluster_id WHERE CM.is_deleted="0") AND C.is_deleted="0"', function (err, result) {
        //if(err) throw err
        if (err) {            
           
            res.status(403).json({ err });
        }
        else {
            var customer_details = new Array();
            if(result.length > 0){
                for (let i = 0; i < result.length; i++) {
                    customer_details.push({'id':result[i].id,'name':result[i].customer_name});
                }
                var token = jwt.sign({ list: customer_details }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }            
        }
    })
};

exports.assigned_customers = function (req, res) {
    var id = req.body.id;

    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT C.id,C.customer_name,AC.id as relation_id FROM customer C LEFT JOIN cluster_customer_relation AC on C.id = AC.customer_id WHERE AC.cluster_id = "' + id + '"', function (err, result) {
        //if(err) throw err
        if (err) {
           
            res.status(403).json({ err });
        }
        else {

            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
              });

            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.assign_customer_by_sa = function (req, res) {
    var id = req.body.id;
    var cluster_name = req.body.cluster_name;
    var cluster_desc = req.body.cluster_desc;
    var customer = req.body.customer;
    var connection_enview_master = req.app.get('connection_enview_master');
    if(id == 0){        
        connection_enview_master.query("INSERT INTO cluster_master (`cluster_name`, `cluster_desc` ,`created_date`) VALUES ('"+cluster_name+"','"+cluster_desc+"', '"+formatted+"')",function (err2, result2) {
            //if(err) throw err
            if (err2) {
                console.log(err2); 
                res.status(500).json({ err2 });

            } else {
                var last_clusterid = result2.insertId;
                if(customer.length > 0){
                    for(let i = 0; i < customer.length; i++){
                        connection_enview_master.query("INSERT INTO cluster_customer_relation (`cluster_id`, `customer_id`) VALUES ("+last_clusterid+","+customer[i]+")",function (err, result) {
                            //if(err) throw err
                            if (err) {
                    
                            } else {  
                            }
                        });
                    }  
                }
                var rep = {
                    status: 'success',
                    msg: 'data inserted Successfully'
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });        
                res.status(200).send({ auth: true, token: token });
            }
        });
    } else {
        
        connection_enview_master.query("UPDATE cluster_master SET `cluster_name`='"+cluster_name+"',`cluster_desc`= '"+cluster_desc+"' WHERE id = " + id,function (err2, result2) {
            //if(err) throw err
            if (err2) {
                //console.log(err2); 
                res.status(500).json({ err2 });

            } else {
                var last_clusterid = id;
                if(customer.length > 0){
                    for(let i = 0; i < customer.length; i++){
                        connection_enview_master.query("INSERT INTO cluster_customer_relation (`cluster_id`, `customer_id`) VALUES ("+last_clusterid+","+customer[i]+")",function (err, result) {
                            //if(err) throw err
                            if (err) {
                    
                            } else {  
                            }
                        });
                    }  
                }
                var rep = {
                    status: 'success',
                    msg: 'data updated Successfully'
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });        
                res.status(200).send({ auth: true, token: token });
            }
        });    
    }  
};

exports.delete_assign_customer = function (req, res) {
    var id = req.body.rid;
    var cid = req.body.cid;
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT * FROM cluster_customer_relation WHERE cluster_id = "' + cid + '"', function (err, result) {
        //if(err) throw err
        if (err) {
           
            res.status(403).json({ err });
        }
        else {

            if(result.length > 1){

                connection_enview_master.query('DELETE FROM cluster_customer_relation WHERE id = "' + id + '"', function (err1, result1) {
                    //if(err) throw err
                    if (err1) {
                        //console.log(err); 
                        res.status(403).json({ err1 });
            
                    } else {
                        var rep = {
                            status: 'success',
                            msg: 'Assigned customer removed Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
            
                        res.status(200).send({ auth: true, token: token });
                    }
                });

            } else {
                var rep = {
                    status: 'success',
                    msg: 'You have to assign at least one customer'
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
    
                res.status(200).send({ auth: true, token: token });
            }
            
        }
    })    
};

exports.edit_cluster = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('*')
        .from('cluster_master')
        .where({ 'id': req.body.id })
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        })
};