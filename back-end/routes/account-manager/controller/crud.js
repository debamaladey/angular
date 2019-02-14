var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crud');
var date = require('date-and-time');

exports.assign_customer = function(req, res) {
    
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.customer_list(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
              });
            res.status(200).send({ auth: true, token: token });
        }
    });

};

exports.view_customer = function(req, res) {
    queryModel.view_customer_data(req, res); 
};

exports.get_template = function(req, res) {
    queryModel.get_template_data(req, res); 
};

exports.list_template = function(req, res) {
    queryModel.list_template_data(req, res); 
};

exports.set_template = function(req, res) {
    queryModel.set_template_data(req, res); 
};

exports.list_tariff_rule = function(req, res) {
    queryModel.list_tariff_rule_data(req, res); 
};

exports.get_template_by_tariff = function(req, res) {
    queryModel.get_template_by_tariff_data(req, res); 
};

exports.get_template_tariff_variable = function(req, res) {
    queryModel.get_template_tariff_variable_data(req, res); 
};

exports.get_tariff_rule = function(req, res) {
    queryModel.get_tariff_rule_data(req, res); 
};

exports.set_resource = function(req, res) {
    queryModel.set_resource_data(req, res); 
};

exports.set_environmental = function(req, res) {
    queryModel.set_environmental_data(req, res); 
};

exports.set_fixed = function(req, res) {
    queryModel.set_fixed_data(req, res); 
};

exports.set_load_details = function(req, res) {
    queryModel.set_load_details_data(req, res); 
};

exports.set_contract_demand = function(req, res) {
    queryModel.set_contract_demand_data(req, res); 
};

exports.datatable = function(req, res) {
    queryModel.datatable_data(req, res); 
};
