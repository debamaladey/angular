var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config_master = require('../config_master');
var password_length = 10;
var common = require('./helper');
const Cryptr = require('cryptr');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('success');
});

router.post('/login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var qb = req.app.get('qb');
    qb.select('*');
    qb.from('user_master ');
    qb.where('ea_decode(email)', email);
    qb.get((err, result) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            if (result.length > 0) {

                bcrypt.compare(password, result[0].password, function (err, match) {
                    if (match) {

                        qb.select('u.id,u.name,ur.role_id,r.user_type as role_user_type,cu.customer_id,u.password_set,c.customer_name,r.role_name');
                        qb.select('ea_decode(u.mobile) as mobile',false);
                        qb.select('ea_decode(u.email) as email',false);
                        qb.from('user_master u ');
                        qb.join('user_role ur','u.id=ur.user_id','INNER');
                        qb.join('customer_user cu','u.id=cu.user_id','LEFT');
                        qb.join('customer c','cu.customer_id=c.id','LEFT');
                        qb.join('role_master r','ur.role_id=r.role_id','LEFT');
                        qb.where('ea_decode(email)', email);
                        qb.get((err1, result1) => {
                            var token = jwt.sign({ id: result1[0].id,email: result1[0].email,name: result1[0].name,role_id: result1[0].role_id,role_user_type: result1[0].role_user_type, customer_id:result1[0].customer_id,password_set:result1[0].password_set,customer_name:result1[0].customer_name,role_name:result1[0].role_name }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });

                            res.status(200).send({ auth: true, token: token });
                        });
                    } else {
                        res.status(403).send({ message: 'Wrong Password' })
                        // Passwords don't match
                    }
                });
            } else {
                res.status(400).send({ message: 'Wrong Email' })
            }
        }
    });
});

// router.post('/login', function (req, res, next) {

//     var email = req.body.email;
//     var password = req.body.password;

//     // email = new Buffer(email).toString('base64');

//     var connection_enview_master = req.app.get('connection_enview_master');

//     connection_enview_master.query('SELECT * FROM user_master WHERE ea_decode(email) = "' + email + '"', function (err, result) {
       
//         if (err) {
           
//             res.status(403).json({ err });

//         } else {

//             if (result.length > 0) {

//                 bcrypt.compare(password, result[0].password, function (err, match) {
//                     if (match) {
//                         // Passwords match 
//                         connection_enview_master.query('SELECT u.id,u.name,ea_decode(u.mobile) as mobile,ea_decode(u.email) as email,ur.role_id,r.user_type as role_user_type,cu.customer_id,u.password_set FROM user_master u JOIN user_role ur on u.id=ur.user_id LEFT JOIN customer_user cu on u.id=cu.user_id LEFT JOIN role_master r on ur.role_id=r.role_id WHERE ea_decode(email) = "' + email + '"', function (err1, result1) { 
                            
//                             var token = jwt.sign({ id: result1[0].id,email: result1[0].email,name: result1[0].name,role_id: result1[0].role_id,role_user_type: result1[0].role_user_type, customer_id:result1[0].customer_id,password_set:result1[0].password_set }, config_master.API_SECRET, {
//                                 expiresIn: 86400 // expires in 24 hours
//                             });

//                             res.status(200).send({ auth: true, token: token });
//                         });
//                     } else {
//                         res.status(403).send({ message: 'Wrong Password' })
//                         // Passwords don't match
//                     }
//                 });
//             } else {
//                 res.status(400).send({ message: 'Wrong Email' })
//             }
//         }
//     });

// });

router.post('/encodeUserSession', function (req, res, next) {

    var value = req.body.value;
    if(value){     
        var token = jwt.sign({ id: value.id,email: value.email,name: value.name,role_id: value.role_id,role_user_type: value.role_user_type, customer_id:value.customer_id,password_set:value.password_set,customer_name:value.customer_name,role_name:value.role_name }, config_master.API_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    } else {
        res.status(400).send({ message: 'Wrong Value' })
    }

});

router.post('/update_password', function (req, res, next) {

    var password = req.body.password;
    var userid = req.body.userid;
    var connection_enview_master = req.app.get('connection_enview_master');

    bcrypt.hash(password, password_length, function (err1, hash) {

        var hash_pass = hash;
    
        connection_enview_master.query("UPDATE user_master SET `password`= '"+hash_pass+"' WHERE id = " + userid,function (err2, result2) {
            //if(err) throw err
            if (err2) {

                res.status(500).json({ err2 });

            } else {   
                connection_enview_master.query("UPDATE user_master SET `password_set`= 'Yes' WHERE id = " + userid,function (err3, result3) {
                    //if(err) throw err
                    if (err3) {                    
                    } else {                                                   
                    }
                });                         
                var rep = {
                    status: 'success',
                    msg: 'Password changed successfully'
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.status(200).send({ auth: true, token: token });                        
            }
        });
    });

});

router.post('/forgot_password', function (req, res, next) {

    var email = req.body.email;
    
    var qb = req.app.get('qb');
    qb.select('*');
    qb.from('user_master ');
    qb.where('ea_decode(email)', email);
    qb.get((err, result) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            if (result.length > 0) {

                var subject = "Forgot Password Mail";
                const cryptr = new Cryptr('myTotalySecretKey'); 
                const encryptedString = cryptr.encrypt(result[0].id);
                var link = config_master.FRONT_URL+"forgot-password/change/"+encryptedString;
                var msg = "<html><body><div>Hi "+result[0].name+",<br> Please click on the below link to change your passowd. <br>The link is <a href="+link+">here</a> <br> Regards, Admin</div></body></html>";

                req.body.subject = subject;
                req.body.msg = msg;

                var email_send = common.sendMail(email,req,res);
                var rep = {
                    status: 'success',
                    msg: 'Email send Successfully'
                }
                var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
    
                res.status(200).send({ auth: true, token: token });
                  
            } else {
                res.status(400).send({ message: 'Wrong Email' })
            }
        }
    });

});

router.post('/change_forgot_password', function (req, res, next) {

    var password = req.body.password;
    var userid = req.body.userid;
    const cryptr = new Cryptr('myTotalySecretKey');
    const decryptedString = cryptr.decrypt(userid);
    var connection_enview_master = req.app.get('connection_enview_master');

    connection_enview_master.query('SELECT * FROM user_master WHERE id = "' + decryptedString + '"', function (err, result) {
       
        if (err) {
           
            res.status(403).json({ err });

        } else {

            if (result.length > 0) {

                bcrypt.hash(password, password_length, function (err1, hash) {

                    var hash_pass = hash;
                
                    connection_enview_master.query("UPDATE user_master SET `password`= '"+hash_pass+"' WHERE id = " + decryptedString,function (err2, result2) {
                        //if(err) throw err
                        if (err2) {
            
                            res.status(500).json({ err2 });
            
                        } else {       
                            var link = config_master.FRONT_URL+"login"; 
                            var rep = {
                                status: 'success',
                                msg: 'Password changed successfully.'
                            }
                            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });
            
                            res.status(200).send({ auth: true, token: token });                        
                        }
                    });
                });
            } else {
                res.status(400).send({ message: 'User doesnot exist' })
            }
        }
    });

});

module.exports = router;
