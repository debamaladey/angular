var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crud');
var date = require('date-and-time');

exports.customer_data = function(req, res) {
    queryModel.customer_data(req, res); 
};

