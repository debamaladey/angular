var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var nodemailer = require('nodemailer');

exports.sendMail = function(email,req,res){
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query('SELECT * FROM email_config order by ec_id desc limit 0,1', function (err, result) {
        //if(err) throw err
        if (err) {
           console.log(err);
           return false;
        } else {
            // create reusable transporter object using the default SMTP transport
            if(result[0].protocol == 'smtp'){
                if(result[0].smtp_port == 465){
                    var secure = true;
                } else {
                    var secure = false;
                }
                var transporter = nodemailer.createTransport({
                    host: result[0].host_name,
                    port: result[0].smtp_port,
                    secure: secure, // true for 465, false for other ports
                    auth: {
                        user: result[0].smtp_user, // generated ethereal user
                        pass: result[0].smtp_password // generated ethereal password
                    }
                });
            } else {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: result[0].smtp_user,
                        pass: result[0].smtp_password
                    }
                });
            }           

            // setup email data with unicode symbols
            let mailOptions = {
                from: result[0].email_from, // sender address
                to: email, // list of receivers
                subject: req.body.subject, // Subject line
                html: req.body.msg // html body
            };
            // send mail with defined transport object
            let info = transporter.sendMail(mailOptions);
            return true;
        }
    });
}