
var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var queryModel = require('../model/crude');
var arrayToTree = require('array-to-tree');
var title = 'Consumption';
var unit_title = 'Consumption unit';

exports.get_lists = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.getConsumptionLists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            if(result.length > 0){
                var resourceArr = new Array();
                result.forEach(element => {               
                    resourceArr.push({
                        id: element.resource_id,                        
                        name: element.resource_name,
                        parent_id: element.parent_resource_id
                    });
                });              
            }
            var data = (arrayToTree(resourceArr));
            var token = jwt.sign({ list: data }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });   
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.delete_consumption = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.deleteConsumption(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            var rep = {
                status: 'success',
                msg: 'Consumption deleted Successfully'
            }
            var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });
}

exports.add_edit_consumption = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.rowExists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            if(result[0].cnt>0){
                connection_enview_master.query(queryModel.updateConsumption(req, res), function (err1, result1) {
                    if(err1){
                        res.status(403).json({ err1 });
                    }else{
                        var rep = {
                            status: 'success',
                            msg: 'Consumption updated Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                });
            }else{
                connection_enview_master.query(queryModel.insertConsumption(req, res), function (err1, result1) {
                    if(err1){
                        res.status(403).json({ err1 });
                    }else{
                        var rep = {
                            status: 'success',
                            msg: 'Consumption Added Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                });
            }            
        }
    });
}

exports.get_cons_meter_lists = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.getConsumptionMeterLists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            
            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });   
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.get_meter_lists = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.getMeterLists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            
            var token = jwt.sign({ list: result }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });   
            res.status(200).send({ auth: true, token: token});
        }
    });
}

exports.assign_consumption_meter = function(req, res){ 
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(queryModel.meterRowExists(req, res), function (err, result) {
        if(err){
            res.status(403).json({ err });
        }else{
            if(result[0].cnt>0){
                connection_enview_master.query(queryModel.updateAssignMeter(req, res), function (err1, result1) {
                    if(err1){
                        res.status(403).json({ err1 });
                    }else{
                        var rep = {
                            status: 'success',
                            msg: 'Meter Assigned Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                });
            }else{
                connection_enview_master.query(queryModel.insertAssignMeter(req, res), function (err1, result1) {
                    if(err1){
                        res.status(403).json({ err1 });
                    }else{
                        var rep = {
                            status: 'success',
                            msg: 'Meter Assigned Successfully'
                        }
                        var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                });
            }            
        }
    });
}