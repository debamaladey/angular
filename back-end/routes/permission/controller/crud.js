
var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crude');

exports.fetch_role = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.rolelistQuery(req, res), function (err, result) {  
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

exports.fetch_module = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.modulelistQuery(req, res), function (err, result) {  
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

exports.role_modules_list = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.rolemodulelistQuery(req, res), function (err, result) {  
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

exports.role_module_permission = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.rolewisemodulePermission(req, res), function (err, result) {  
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
