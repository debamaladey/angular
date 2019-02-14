var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crud');
var date = require('date-and-time');

exports.list = function(req, res) {
    
    queryModel.cluster_list(req, res);  

};

exports.delete = function(req, res) {
    
    queryModel.cluster_delete(req, res);  

};

exports.customer_lists = function(req, res) {
    
    queryModel.customer_lists(req, res);  

};

exports.assign_customers = function(req, res) {
    
    queryModel.assigned_customers(req, res);  

};

exports.assign_customer_by_sa = function(req, res) {
    
    queryModel.assign_customer_by_sa(req, res);  

};

exports.delete_assign_customer = function(req, res) {
    
    queryModel.delete_assign_customer(req, res);  

};

exports.editCluster = function(req, res) {
    
    queryModel.edit_cluster(req, res);  

};