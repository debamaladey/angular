
var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/dashboard');
var date = require('date-and-time');

exports.index_post = function(req, res) {
    
};

exports.consumption_resource_dropdown_post = function (req, res) {
    queryModel.consumption_resource_dropdown(req, res);
}

exports.consumption_resource_unit_details_get = function(req, res){
    queryModel.consumption_resource_unit_details(req, res);
}

exports.consumption_tag_data_details_post = function(req, res){
    queryModel.consumption_tag_data_details(req, res);
}

exports.major_consumption_resource_unit_details_post = function(req, res){
    queryModel.major_consumption_resource_unit_details(req, res);
}