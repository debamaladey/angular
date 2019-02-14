var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crud');
var date = require('date-and-time');

exports.meter_id = function(req, res) {
    var formatted1 = 'M'+req.params.customer+date.format(new Date(), 'YYYYMMDDHHmmss');
    console.log(formatted1);
    var token = jwt.sign({ id: formatted1 }, config_master.API_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
};

exports.virtual_meter_id = function(req, res) {
    var formatted1 = 'V'+req.params.customer+date.format(new Date(), 'YYYYMMDDHHmmss');
    console.log(formatted1);
    var token = jwt.sign({ id: formatted1 }, config_master.API_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
};

exports.virtual_tag_id = function(req, res) {
    var formatted1 = req.params.customer+date.format(new Date(), 'YYYYMM');
    console.log(formatted1);
    var token = jwt.sign({ id: formatted1 }, config_master.API_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
};

exports.create_meter = function(req, res) {
    queryModel.create_meter(req, res);  
};

exports.update_meter = function(req, res) {
    queryModel.update_meter(req, res);  
};

exports.view_meter = function(req, res) {
    queryModel.view_meter_data(req, res); 
};

exports.list_meter = function(req, res) {
    queryModel.list_meter_data(req, res); 
};

exports.delete_meter = function(req, res) {
    queryModel.delete_meter_data(req, res); 
};

exports.meter_list_by_resource = function(req, res) {
    queryModel.meter_list_by_resource_data(req, res); 
};

exports.list_tag = function(req, res) {
    queryModel.list_tag_data(req, res); 
};

exports.update_meter_config = function(req, res) {
    queryModel.update_meter_config(req, res);  
};

exports.list_source_meter = function(req, res) {
    queryModel.list_source_meter_data(req, res); 
};

exports.create_virtual_meter = function(req, res) {
    queryModel.create_virtual_meter(req, res);  
};

exports.list_virtual_meter = function(req, res) {
    queryModel.list_virtual_meter_data(req, res); 
};

exports.fetch_consumption_meter = function(req, res) {
    queryModel.consumption_meter_list(req, res); 
};

