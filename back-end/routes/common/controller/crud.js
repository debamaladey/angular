var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crud');
var date = require('date-and-time');

exports.fetch_resource = function(req, res) {
    queryModel.resource_master_list(req, res); 
};

exports.resource_parameters = function(req, res) {
    queryModel.resource_parameters_data(req, res); 
};

exports.resource_units = function(req, res) {
    queryModel.resource_units_data(req, res); 
};

exports.state_list = function(req, res) {
    var country_id = 13;
    queryModel.state_list(req, res, country_id); 
};

exports.city_list = function(req, res) {
    var state_id = req.params.state_id;
    queryModel.city_list(req, res, state_id); 
};

exports.phone_code = function(req, res) {
    var country_id = 13;
    queryModel.phone_code(req, res, country_id); 
};

exports.fetch_consumption = function(req, res) {
    queryModel.consumption_master_list(req, res); 
};

exports.get_email_details = function(req, res) {
    queryModel.get_email_details(req, res); 
};

exports.add = function(req, res) {
    queryModel.add(req, res); 
};

exports.migrate = function(req, res) {
    queryModel.migrate(req, res); 
};

