var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var password_length = 10;
var date = require('date-and-time');
var now = new Date();
var formatted = date.format(now, 'YYYY-MM-DD HH:mm:ss');
var config_master = require('../config_master');
var common = require('./helper');
var async = require('async');
var QueryBuilder = require('datatable');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/createUser', function (req, res, next) {

    var name = req.body.name;
    var mobile = req.body.mobile;
    //var email = new Buffer(req.body.email).toString('base64');
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    var userid = req.body.userid;
    var UserRoleType = req.body.UserRoleType;
    var created_at = formatted;
    var customer_id = req.body.customer_id;
    if(customer_id != 0){
        var role_type = 'Customer';
    } else {
        var role_type = 'SA';
    }
    var connection_enview_master = req.app.get('connection_enview_master');
    // TO_BASE64 == encode

    connection_enview_master.query('SELECT * FROM user_master WHERE ea_decode(email) = "' + email + '" and is_deleted = "0"', function (err, result) {
			//if(err) throw err
		if (err) {

			res.status(403).json({ err })

		} else {

			if (result.length > 0) {

				res.status(400).send({ message: 'Email already exists' });

			} else { 

				bcrypt.hash(password, password_length, function (err1, hash) {
			        // Store hash in your password DB.

			        var hash_pass = hash;

			        var obj = {
			            name: name,
			            mobile: mobile,
			            email: email,
                        password: hash_pass,
                        created_by:userid,
			            created_at:created_at
                    }

			        connection_enview_master.query("INSERT INTO user_master (`name`, `mobile`, `email`, `password`,`user_type`, `created_by`, `created_at`) VALUES ('"+name+"', ea_encode('"+mobile+"'), ea_encode('"+email+"'), '"+hash_pass+"', '"+role_type+"', '"+userid+"', '"+created_at+"')",function (err2, result2) {
			            //if(err) throw err
			            if (err2) {
			                ///console.log(err); 
			                //res.status(500).json({ err2 });

			            } else {
                            var last_userid = result2.insertId;
                            var obj1 = {
                                user_id: last_userid,
                                role_id: role
                            }
                            connection_enview_master.query('INSERT INTO user_role SET ?', obj1, function (err3, result3) { 
                            });
                            var obj2 = {
                                user_id: last_userid,
                                customer_id: customer_id
                            }
                            connection_enview_master.query('INSERT INTO customer_user SET ?', obj2, function (err5, result5) {
                            });

                            connection_enview_master.query("INSERT INTO user_master_log (`user_id`,`name`, `mobile`, `email`, `password`,`user_type`, `role_id`) VALUES ('"+last_userid+"','"+name+"', ea_encode('"+mobile+"'), ea_encode('"+email+"'), '"+hash_pass+"', '"+role_type+"', '"+role+"')",function (err6, result6) {
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
			                var rep = {
			                    status: 'success',
			                    msg: 'User created Successfully'
                            }
                            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                
                            res.status(200).send({ auth: true, token: token });
			            }
			        });

			    });

			}
		}   

	});
});

router.post('/updateUser', function (req, res, next) {
    
    var name = req.body.name;
    var mobile = req.body.mobile;
    var password = req.body.password;
    var id = req.body.id;
    var role = req.body.role;

    var connection_enview_master = req.app.get('connection_enview_master');
    
    if(password == '' || password == null){
        connection_enview_master.query("UPDATE user_master SET `name`='"+name+"',`mobile`= ea_encode('"+mobile+"') WHERE id = " + id,function (err, result) {
            //if(err) throw err
            if (err) {

                res.status(500).json({ err });

            } else {
                
                connection_enview_master.query("UPDATE user_role SET `role_id`='"+role+"' WHERE user_id = " + id, function (err3, result3) {
                    //if(err) throw err
                    if (err3) {
                        ///console.log(err); 
                        //res.status(500).json({ err3 });        
                    }
                });
                connection_enview_master.query("INSERT INTO user_master_log (`user_id`,`name`,`mobile`,`role_id`) VALUES ('"+id+"','"+name+"',ea_encode('"+mobile+"'),'"+role+"')",function (err6, result6) {
                    //if(err) throw err
                    if (err6) {
                        ///console.log(err); 
                        //res.status(500).json({ err6 });        
                    }else{
                        var last_logid = result6.insertId;
                        connection_enview_master.query("UPDATE user_master SET `uml_id`='"+last_logid+"' WHERE id = " + id, function (err7, result7) {
                            //if(err) throw err
                            if (err7) {
                                ///console.log(err); 
                                //res.status(500).json({ err7 });        
                            }
                        });
                    }
                });

                var rep = {
                    status: 'success',
                    msg: 'User updated Successfully'
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.status(200).send({ auth: true, token: token });
            
            }
        });
    } else {
        bcrypt.hash(password, password_length, function (err1, hash) {

            var hash_pass = hash;
        
            connection_enview_master.query("UPDATE user_master SET `name`='"+name+"',`mobile`= ea_encode('"+mobile+"'),`password`= '"+hash_pass+"' WHERE id = " + id,function (err, result) {
                //if(err) throw err
                if (err) {
    
                    res.status(500).json({ err });
    
                } else {
                    
                    connection_enview_master.query("UPDATE user_role SET `role_id`='"+role+"' WHERE user_id = " + id, function (err3, result3) {
                        //if(err) throw err
                        if (err3) {
                            //console.log(err); 
                            //res.status(500).json({ err3 });        
                        }
                    });

                    connection_enview_master.query("INSERT INTO user_master_log (`user_id`,`name`, `mobile`,`password`,`role_id`) VALUES ('"+id+"','"+name+"', ea_encode('"+mobile+"'),'"+hash_pass+"','"+role+"')",function (err6, result6) {
                        //if(err) throw err
                        if (err6) {
                            //console.log(err); 
                            //res.status(500).json({ err6 });        
                        }else{
                            var last_logid = result6.insertId;
                            connection_enview_master.query("UPDATE user_master SET `uml_id`='"+last_logid+"' WHERE id = " + id, function (err7, result7) {
                                //if(err) throw err
                                if (err7) {
                                    //console.log(err); 
                                    //res.status(500).json({ err7 });        
                                }
                            });
                        }
                    });
    
                    var rep = {
                        status: 'success',
                        msg: 'User updated Successfully'
                    }
                    var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
    
                    res.status(200).send({ auth: true, token: token });
                
                }
            });
        });
    }

});

router.post('/getAllUser', function (req, res, next) {

    var customer_id = req.body.customer_id;
    if(customer_id != 0){
        var role_type = 'Customer';
    } else {
        var role_type = 'SA';
    }

    var tableDefinition = {
        sDatabaseOrSchema: '`'+config_master.database.db+'`',
        sSelectSql: "u.id,u.name,ea_decode(u.mobile) as mobile,ea_decode(u.email) as email,r.role_name,r.role_id,cu.customer_id",
        sFromSql: "user_master u LEFT JOIN user_role ur on u.id=ur.user_id LEFT JOIN role_master r on ur.role_id=r.role_id LEFT JOIN customer_user cu on u.id=cu.user_id ",    
        sWhereAndSql: " u.is_deleted = '0' AND  u.user_type='"+role_type+"' ",
        aSearchColumns: ["u.name", "ea_decode(u.mobile)", "ea_decode(u.email)", "r.role_name"]    
    };
    var queryBuilder = new QueryBuilder(tableDefinition);
    
    var requestQuery = req.body.data;
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
    var queries = queryBuilder.buildQuery(req.body.data);
    
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
});

router.post('/ViewUser', function (req, res, next) {

    var id = req.body.id;

    var connection_enview_master = req.app.get('connection_enview_master');

    connection_enview_master.query('SELECT u.id,u.name,ea_decode(u.mobile) as mobile,ea_decode(u.email) as email,r.role_name,r.role_id FROM user_master u JOIN user_role ur on u.id=ur.user_id JOIN role_master r on ur.role_id=r.role_id  WHERE u.id = "' + id + '"', function (err, result) {
            //if(err) throw err
            if (err) {

                res.status(403).json({ err });

            } else {

                if (result.length > 0) {

                    var token = jwt.sign({ user_edit: result }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                      });
        
                    res.status(200).send({ auth: true, token: token });

                } else {
                    res.status(400).send({ message: 'Wrong Id provided' })
                }

            }
        })

});

router.post('/deleteUser', function (req, res, next) {

    var id = req.body.id;

    var connection_enview_master = req.app.get('connection_enview_master');


    connection_enview_master.query('UPDATE user_master SET is_deleted = "1" WHERE id = "' + id + '"', function (err, result) {
        //if(err) throw err
        if (err) {
            //console.log(err); 
            res.status(403).json({ err });

        } else {

            var rep = {
                status: 'success',
                msg: 'User deleted Successfully'
            }
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).send({ auth: true, token: token });
            
            // connection_enview_master.query('DELETE FROM user_role WHERE user_id = "' + id + '"', function (err1, result1) {
            //     //if(err) throw err
            //     if (err1) {
            //         //console.log(err); 
            //         res.status(403).json({ err1 });
        
            //     } else {

            //         var rep = {
            //             status: 'success',
            //             msg: 'User deleted Successfully'
            //         }
            //         var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
            //             expiresIn: 86400 // expires in 24 hours
            //         });
    
            //         res.status(200).send({ auth: true, token: token });
            //     }
            // });
        }
    });

});

router.post('/user_roles', function (req, res, next) {

    var customer_id = req.body.customer_id;
    if(customer_id != 0){
        var role_type = 'Customer';
    } else {
        var role_type = 'SA';
    }

    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT role_id,role_name FROM role_master where user_type="' + role_type + '"', function (err, result) {
        //if(err) throw err
        if (err) {
           
            res.status(403).json({ err });
        }
        else {

            var token = jwt.sign({ roles_list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
              });

            res.status(200).send({ auth: true, token: token });
        }
    })

});

router.post('/user_module', function (req, res, next) {

    var role = req.body.role;

    var connection_enview_master = req.app.get('connection_enview_master');

    connection_enview_master.query('SELECT module_id FROM role_module WHERE role_id = "' + role + '"', function (err, result) {
        //if(err) throw err
        if (err) {
           
            res.status(403).json({ err });
        }
        else {

            var token = jwt.sign({ module_list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
              });

            res.status(200).send({ auth: true, token: token });
        }
    })

});

router.get('/getAllAccManager', function (req, res, next) {

    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT u.id,u.name,ea_decode(u.mobile) as mobile,ea_decode(u.email) as email,r.role_name,r.role_id,cu.customer_id FROM user_master u LEFT JOIN user_role ur on u.id=ur.user_id LEFT JOIN role_master r on ur.role_id=r.role_id LEFT JOIN customer_user cu on u.id=cu.user_id where r.role_id=2 order by u.id desc', function (err, result) {
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

});

router.get('/customer_lists', function (req, res, next) {
    
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT C.id,C.customer_name FROM customer C WHERE C.id NOT IN(SELECT AC.customer_id FROM account_customer_relation AC LEFT JOIN user_master U on U.id = AC.user_id WHERE U.is_deleted="0") AND C.is_deleted="0"', function (err, result) {
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

});

router.post('/assigned_customers', function (req, res, next) {

    var amId = req.body.am_id;

    var connection_enview_master = req.app.get('connection_enview_master');

    connection_enview_master.query('SELECT C.id,C.customer_name,AC.id as relation_id FROM customer C LEFT JOIN account_customer_relation AC on C.id = AC.customer_id WHERE AC.user_id = "' + amId + '"', function (err, result) {
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

});

router.post('/assign_customer_by_acc_manager', function (req, res, next) {

    var am_id = req.body.am_id;
    //var acc_manager = req.body.acc_manager;
    var acc_manager = req.body.am_id;
    var customer = req.body.customer;
    var connection_enview_master = req.app.get('connection_enview_master');

    if(customer.length > 0){
        
        for(let i = 0; i < customer.length; i++){
            connection_enview_master.query("INSERT INTO account_customer_relation (`user_id`, `customer_id`) VALUES ("+acc_manager+","+customer[i]+")",function (err, result) {
                //if(err) throw err
                if (err) {
                    ///console.log(err); 
                    //res.status(500).json({ err });
        
                } else {  
                }
            });
        }  
        var rep = {
            status: 'success',
            msg: 'Customer assigned Successfully'
        }
        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });        
        res.status(200).send({ auth: true, token: token });
    }
});

router.post('/delete_assign_customer', function (req, res, next) {

    var id = req.body.rid;

    var connection_enview_master = req.app.get('connection_enview_master');


    connection_enview_master.query('DELETE FROM account_customer_relation WHERE id = "' + id + '"', function (err, result) {
        //if(err) throw err
        if (err) {
            //console.log(err); 
            res.status(403).json({ err });

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

});

module.exports = router;