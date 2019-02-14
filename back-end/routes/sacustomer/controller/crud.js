var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var bcrypt = require('bcrypt');
var password_length = 10;
var date = require('date-and-time');
var now = new Date();
var formatted = date.format(now, 'YYYY-MM-DD HH:mm:ss');
var queryModel = require('../model/crude');
var fs = require('fs');
var common = require('../../helper');

exports.fetch_cust_type = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.cusTypelistQuery(req, res), function (err, result) {  
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

exports.fetch_states = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.statelistQuery(req, res), function (err, result) {  
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

exports.fetch_cities = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.citylistQuery(req, res), function (err, result) {  
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

exports.createUser = function(req, res) {
    var name = req.body.name;
    var mobile = req.body.mobile;
    //var email = new Buffer(req.body.email).toString('base64');
    var email = req.body.email;
    var password = req.body.password;
    var userid = req.body.userid;
    var created_at = formatted;
    var customer_name = req.body.customer_name;
    var cus_type = req.body.cus_type;
    var state = req.body.state;
    var city = req.body.city;
    var address = req.body.address;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var customer_unique_id = req.body.customer_unique_id;
    var id = req.body.id;
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.checkEmail(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            if (result.length > 0) {

				res.status(400).send({ message: 'Email already exists' });

			} else {

                connection_enview_master.query(queryModel.checkCustomerUniqueId(req, res), function (err1, result1) {  
                    if (err1) {
                        res.status(403).json({ err1 });
                    }else {
                        if (result1.length > 0) {
            
                            res.status(400).send({ message: 'Customer Unique ID already exists' });
            
                        } else {
                            bcrypt.hash(password, password_length, function (err5, hash) {
                                // Store hash in your password DB.
            
                                var hash_pass = hash;
            
                                connection_enview_master.query("INSERT INTO user_master (`name`, `mobile`, `email`, `password`,`user_type`, `created_by`, `created_at`) VALUES ('"+name+"', ea_encode('"+mobile+"'), ea_encode('"+email+"'), '"+hash_pass+"','Customer', '"+userid+"', '"+created_at+"')",function (err2, result2) {
                                    //if(err) throw err
                                    if (err2) {
                                        ///console.log(err); 
                                        res.status(500).json({ err2 });
            
                                    } else { 
                                        var last_userid = result2.insertId;
                                        connection_enview_master.query("INSERT INTO user_master_log (`user_id`,`name`, `mobile`, `email`, `password`,`role_id`) VALUES ('"+last_userid+"','"+name+"', ea_encode('"+mobile+"'), ea_encode('"+email+"'), '"+hash_pass+"', 4)",function (err6, result6) {
                                            //if(err) throw err
                                            if (err6) {
                                                ///console.log(err); 
                                                //res.status(500).json({ err6 });        
                                            }else{
                                                var last_logid = result6.insertId;
                                                connection_enview_master.query("UPDATE user_master SET `uml_id`='"+last_logid+"' WHERE id = " + last_userid, function (err7, result7) {
                                                    //if(err) throw err
                                                    if (err7) {
                                                        ///console.log(err); 
                                                        //res.status(500).json({ err7 });        
                                                    }
                                                });
                                            }
                                        });

                                        var email_send = common.sendMail(email,req,res);
                                        var obj1 = {
                                            user_id: last_userid,
                                            role_id: 4
                                        }
                                        connection_enview_master.query('INSERT INTO user_role SET ?', obj1, function (err3, result3) {
                                            //if(err) throw err
                                            if (err3) {
                                                ///console.log(err); 
                                                res.status(500).json({ err3 });        
                                            }
                                        });
                                        connection_enview_master.query("INSERT INTO customer (`customer_unique_id`,`customer_name`, `customer_type`, `state_id`, `city_id`,`address`, `latitude`, `longitude`, `created_by`, `created_at`) VALUES ('"+customer_unique_id+"','"+customer_name+"','"+cus_type+"', '"+state+"', '"+city+"','"+address+"','"+latitude+"','"+longitude+"', '"+userid+"', '"+created_at+"')",function (err4, result4) {
                                            //if(err) throw err
                                            if (err4) {
                                                ///console.log(err); 
                                                res.status(500).json({ err4 });        
                                            } else {
                                                var custid = result4.insertId;
                                                var obj2 = {
                                                    user_id: last_userid,
                                                    customer_id: custid
                                                }
                                                connection_enview_master.query('INSERT INTO customer_user SET ?', obj2, function (err5, result5) {
                                                    //if(err) throw err
                                                    if (err5) {
                                                        ///console.log(err); 
                                                        res.status(500).json({ err5 });        
                                                    }
                                                });

                                                connection_enview_master.query("INSERT INTO customer_log (`customer_id`,`customer_unique_id`,`customer_name`, `customer_type`, `state_id`, `city_id`,`address`, `latitude`, `longitude`) VALUES ('"+custid+"','"+customer_unique_id+"','"+customer_name+"','"+cus_type+"', '"+state+"', '"+city+"','"+address+"','"+latitude+"','"+longitude+"')",function (err16, result16) {
                                                    //if(err) throw err
                                                    if (err16) {
                                                        ///console.log(err); 
                                                        //res.status(500).json({ err6 });        
                                                    }else{
                                                        var last_logid = result16.insertId;
                                                        connection_enview_master.query("UPDATE customer SET `cl_id`='"+last_logid+"' WHERE id = " + custid, function (err17, result17) {
                                                            //if(err) throw err
                                                            if (err17) {
                                                                ///console.log(err); 
                                                                //res.status(500).json({ err7 });        
                                                            }
                                                        });
                                                    }
                                                });
            
                                            }
                                        });
                                    }
                                });
            
                            });
            
                            var rep = {
                                status: 'success',
                                msg: 'Customer created Successfully'
                            }
                            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.status(200).send({ auth: true, token: token });
                        }            
                    }
                });
            }            
        }
    })
};

exports.getAllUser = function(req, res) {
    queryModel.customerlistQuery(req, res);
};

exports.deleteUser = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.customerdeleteQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            connection_enview_master.query('SELECT user_id from customer_user where customer_id = '+req.body.id+'', function (err1, result1) {
                //if(err) throw err
                if (err1) {
                    ///console.log(err); 
                    res.status(500).json({ err1 });        
                } else { 
                   if(result1.length >0){
                        result1.forEach(element => {                             
                            //  connection_enview_master.query('delete from customer_user where user_id = '+element.user_id+'', function (err2, result2) {
                            //     //if(err) throw err
                            //     if (err2) {
                            //         ///console.log(err); 
                            //         res.status(500).json({ err2 });        
                            //     } 
                            // });
                            connection_enview_master.query('update user_master set is_deleted = "1" where id = '+element.user_id+'', function (err3, result3) {
                                //if(err) throw err
                                if (err3) {
                                    ///console.log(err); 
                                    res.status(500).json({ err3 });        
                                } 
                            });
                            // connection_enview_master.query('delete from user_role where user_id = '+element.user_id+'', function (err3, result3) {
                            //     //if(err) throw err
                            //     if (err3) {
                            //         ///console.log(err); 
                            //         res.status(500).json({ err3 });        
                            //     } 
                            // });
                        });
                   }        
                }
            });
            var rep = {
                status: 'success',
                msg: 'Customer deleted Successfully'
            }
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });
};

exports.viewUser = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.viewUserQuery(req, res), function (err, result) {  
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

exports.updateUser = function(req, res) {
    
    var name = req.body.name;
    var mobile = req.body.mobile;
    var password = req.body.password;
    var userid = req.body.userid;
    var created_at = formatted;
    var customer_name = req.body.customer_name;
    var cus_type = req.body.cus_type;
    var state = req.body.state;
    var city = req.body.city;
    var address = req.body.address;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var customer_user_id = req.body.customer_user_id;
    var id = req.body.id;
    var customer_unique_id = req.body.customer_unique_id;
    var connection_enview_master = req.app.get('connection_enview_master');
    
    connection_enview_master.query(queryModel.checkCustomerUniqueId(req, res), function (err1, result1) {  
        if (err1) {
            res.status(403).json({ err1 });
        }else {
            if (result1.length > 0) {

                res.status(400).send({ message: 'Customer Unique ID already exists' });

            } else {
                if(password == '' || password == null){

                    connection_enview_master.query("UPDATE customer SET `customer_unique_id`='"+customer_unique_id+"',`customer_name`='"+customer_name+"',`customer_type`='"+cus_type+"',`state_id`='"+state+"',`city_id`='"+city+"',`address`='"+address+"',`latitude`='"+latitude+"',`longitude`='"+longitude+"' WHERE id = " + id, function (err3, result3) {
                        //if(err) throw err
                        if (err3) {
                            ///console.log(err); 
                            res.status(500).json({ err3 });        
                        } 
                    });
            
                    connection_enview_master.query("UPDATE user_master SET `name`='"+name+"',`mobile`= ea_encode('"+mobile+"') WHERE id = " + customer_user_id, function (err2, result2) {
                        //if(err) throw err
                        if (err2) {
                            ///console.log(err); 
                            res.status(500).json({ err2 });        
                        } 
                    });

                    connection_enview_master.query("INSERT INTO user_master_log (`user_id`,`name`, `mobile`) VALUES ('"+customer_user_id+"','"+name+"', ea_encode('"+mobile+"'))",function (err6, result6) {
                        //if(err) throw err
                        if (err6) {
                            ///console.log(err); 
                            //res.status(500).json({ err6 });        
                        }else{
                            var last_logid = result6.insertId;
                            connection_enview_master.query("UPDATE user_master SET `uml_id`='"+last_logid+"' WHERE id = " + customer_user_id, function (err7, result7) {
                                //if(err) throw err
                                if (err7) {
                                    ///console.log(err); 
                                    //res.status(500).json({ err7 });        
                                }
                            });
                        }
                    });

                    connection_enview_master.query("INSERT INTO customer_log (`customer_id`,`customer_unique_id`,`customer_name`, `customer_type`, `state_id`, `city_id`,`address`, `latitude`, `longitude`) VALUES ('"+id+"','"+customer_unique_id+"','"+customer_name+"','"+cus_type+"', '"+state+"', '"+city+"','"+address+"','"+latitude+"','"+longitude+"')",function (err16, result16) {
                        //if(err) throw err
                        if (err16) {
                            ///console.log(err); 
                            //res.status(500).json({ err6 });        
                        }else{
                            var last_logid = result16.insertId;
                            connection_enview_master.query("UPDATE customer SET `cl_id`='"+last_logid+"' WHERE id = " + id, function (err17, result17) {
                                //if(err) throw err
                                if (err17) {
                                    ///console.log(err); 
                                    //res.status(500).json({ err7 });        
                                }
                            });
                        }
                    });
            
                    var rep = {
                        status: 'success',
                        msg: 'Customer updated Successfully'
                    }
                    var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
            
                    res.status(200).send({ auth: true, token: token });            
            
                } else {
            
                    bcrypt.hash(password, password_length, function (err1, hash) {
            
                        var hash_pass = hash;
            
                        connection_enview_master.query("UPDATE customer SET `customer_unique_id`='"+customer_unique_id+"',`customer_name`='"+customer_name+"',`customer_type`='"+cus_type+"',`state_id`='"+state+"',`city_id`='"+city+"',`address`='"+address+"',`latitude`='"+latitude+"',`longitude`='"+longitude+"' WHERE id = " + id, function (err3, result3) {
                            //if(err) throw err
                            if (err3) {
                                ///console.log(err); 
                                res.status(500).json({ err3 });        
                            } 
                        });
                
                        connection_enview_master.query("UPDATE user_master SET `name`='"+name+"',`mobile`= ea_encode('"+mobile+"'),`password`= '"+hash_pass+"' WHERE id = " + customer_user_id, function (err2, result2) {
                            //if(err) throw err
                            if (err2) {
                                ///console.log(err); 
                                res.status(500).json({ err2 });        
                            } 
                        });

                        connection_enview_master.query("INSERT INTO user_master_log (`user_id`,`name`, `mobile`, `password`) VALUES ('"+customer_user_id+"','"+name+"', ea_encode('"+mobile+"'),'"+hash_pass+"')",function (err6, result6) {
                            //if(err) throw err
                            if (err6) {
                                ///console.log(err); 
                                //res.status(500).json({ err6 });        
                            }else{
                                var last_logid = result6.insertId;
                                connection_enview_master.query("UPDATE user_master SET `uml_id`='"+last_logid+"' WHERE id = " + customer_user_id, function (err7, result7) {
                                    //if(err) throw err
                                    if (err7) {
                                        ///console.log(err); 
                                        //res.status(500).json({ err7 });        
                                    }
                                });
                            }
                        });

                        connection_enview_master.query("INSERT INTO customer_log (`customer_id`,`customer_unique_id`,`customer_name`, `customer_type`, `state_id`, `city_id`,`address`, `latitude`, `longitude`) VALUES ('"+id+"','"+customer_unique_id+"','"+customer_name+"','"+cus_type+"', '"+state+"', '"+city+"','"+address+"','"+latitude+"','"+longitude+"')",function (err16, result16) {
                            //if(err) throw err
                            if (err16) {
                                ///console.log(err); 
                                //res.status(500).json({ err6 });        
                            }else{
                                var last_logid = result16.insertId;
                                connection_enview_master.query("UPDATE customer SET `cl_id`='"+last_logid+"' WHERE id = " + id, function (err17, result17) {
                                    //if(err) throw err
                                    if (err17) {
                                        ///console.log(err); 
                                        //res.status(500).json({ err7 });        
                                    }
                                });
                            }
                        });
                
                        var rep = {
                            status: 'success',
                            msg: 'Customer updated Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                
                        res.status(200).send({ auth: true, token: token }); 
                    
                    });
                }
            }            
        }
    });
    

};