var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');
var async = require('async');

exports.index = function(){
    
}

exports.consumption_resource_dropdown = function(req, res){
    var qb = req.app.get('qb');
    qb.select('RM1.resource_id p_resource_id,RM1.resource_name p_resource_name, RM.resource_id , RM.resource_name , MI.meter_id, MIL.meter_name,MCT.tag_id,RU.ru_id,RU.unit_name');
    qb.from('resource_master RM');
    qb.join('meter_info_log MIL','MIL.consumption_id=RM.resource_id','inner');
    qb.join('meter_info MI','MI.meter_log_id=MIL.meter_log_id AND MI.meter_id=MIL.meter_id','inner');
    qb.join('meter_config_tag MCT','MCT.meter_config_id=MI.meter_config_id','inner');
    qb.join('resource_master RM1','RM1.resource_id=RM.parent_resource_id AND RM1.parent_resource_id=0 AND MCT.ru_id=RM1.billing_ru_id','inner');
    qb.join('resource_unit RU','RU.ru_id=RM1.billing_ru_id','inner');
    qb.where('RM.customer_id', req.body.customer_id);
    qb.where('RM.type','consumption');
    qb.where('MI.is_deleted','0');
    qb.where('RM1.is_deleted','0');
    qb.order_by('RM1.resource_id','ASC');
    qb.get((err, response) => {
        //console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var token = jwt.sign({ list : response }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });

}

exports.consumption_resource_unit_details = function(req, res){
    var qb = req.app.get('qb');
    qb.select('MI.meter_id,MIL.meter_name, MCT.tag_id, RU.ru_id,RU.unit_name,RM.resource_id,RM.resource_name');
    qb.from('meter_info MI');
    qb.join('meter_info_log MIL','MIL.meter_log_id=MI.meter_log_id','inner');
    qb.join('meter_config_tag MCT','MCT.meter_config_id = MI.meter_config_id','inner');
    qb.join('resource_unit RU','RU.ru_id = MCT.ru_id','inner');
    qb.join('resource_unit RU1','RU1.rp_id = RU.rp_id','inner');
    qb.join('resource_master RM','RM.billing_ru_id = RU1.ru_id AND MIL.resource_id=RM.resource_id','inner');
    qb.where('MI.meter_id', req.params.meter_id);
    qb.where('RM.is_deleted','0');
    qb.get((err, response) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            // console.log(response);
            var token = jwt.sign({ list : response }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });
}

exports.consumption_tag_data_details = function(req, res){
    postData = req.body;
    var qb = req.app.get('qb');
    qb.select('last_data_date_time');
    qb.from('cron_history');
    qb.where('cron_id', 1);
    qb.get((err, response) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            dateArr = createTypeWiseDate(response, postData.type);
            console.log(dateArr);
            startDate =  date.format(dateArr.startDate, 'YYYY-MM-DD HH:mm:ss');
            endDate =  date.format(dateArr.endDate, 'YYYY-MM-DD HH:mm:ss');

            if(postData.type == 'today'){
                qb.select('DATE_FORMAT(CMDH.date_time, "%H:%i") AS date_time', false);
                qb.select('CMDH.data');
            }else if(postData.type == 'monthly'){
                qb.select_sum('CMDH.data');
                qb.select('DATE_FORMAT(CMDH.date_time, "%b,%d") AS date_time', false);
                qb.group_by('DATE_FORMAT(CMDH.date_time, "%Y-%m-%d")');
            }else if(postData.type == 'yearly' || postData.type == 'quarterly'){
                qb.select_sum('CMDH.data');
                qb.select('DATE_FORMAT(CMDH.date_time, "%b,%Y") AS date_time', false);
                qb.group_by('DATE_FORMAT(CMDH.date_time, "%Y-%m")');
            }
            qb.from('cron_meter_data_hourly CMDH');
            qb.where('CMDH.tag_id', postData.tag_id);
            qb.where('CMDH.date_time >=', startDate);
            qb.where('CMDH.date_time <', endDate);
            qb.order_by('CMDH.date_time', "ASC");

            qb.get((err1, response1) => {
                //console.log("Query Ran: " + qb.last_query());
                if(err1){
                    res.status(403).json({ err1 });
                }else{
                    //console.log(response1);
                    data = createDataTypeWise(response1, postData.type);
                    //console.log(data);
                    var token = jwt.sign({ list : data }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }
            });
        }
    });
}

createDataTypeWise= function(response1, type){
    tempData = [];
    if(type == 'today'){
        sum = 0;
        for (let index = 0; index < response1.length; index++) {
            sum = sum + response1[index].data
            data = {
                // "date": date.format(response1[index].date_time, 'YYYY-MM-DD HH:mm'),
                "date": response1[index].date_time,
                "value": sum.toFixed(2),
                "fixed": 50,
                "lineColor":"#0d8924",
            }
            tempData.push(data);
        }
        
    }else if(type == 'monthly'){
        sum = 0;
        for (let index = 0; index < response1.length; index++) {
            sum = sum + response1[index].data
            data = {
                // "date": date.format(response1[index].date_time, 'YYYY-MM-DD'),
                "date": response1[index].date_time,
                "value": sum.toFixed(2),
                "fixed": 50,
                "lineColor":"#0d8924",
            }
            tempData.push(data);
        }
    }else if(type == 'yearly' || type == 'quarterly'){
        sum = 0;
        for (let index = 0; index < response1.length; index++) {
            sum = sum + response1[index].data
            data = {
                // "date": date.format(response1[index].date_time, 'YYYY-MM'),
                "date": response1[index].date_time,
                "value": sum.toFixed(2),
                "fixed": 50,
                "lineColor":"#0d8924",
            }
            tempData.push(data);
        }
    }
    return tempData;
}

exports.major_consumption_resource_unit_details = function(req, res){
    postData = req.body;
    var qb = req.app.get('qb');
    qb.select('MI.meter_id,MIL.meter_name, MCT.tag_id, RU.ru_id,RU.unit_name,RM.resource_id,RM.resource_name');
    qb.from('meter_info MI');
    qb.join('meter_info_log MIL','MIL.meter_log_id=MI.meter_log_id','inner');
    qb.join('meter_config_tag MCT','MCT.meter_config_id = MI.meter_config_id','inner');
    qb.join('resource_unit RU','RU.ru_id = MCT.ru_id','inner');
    qb.join('resource_unit RU1','RU1.rp_id = RU.rp_id','inner');
    qb.join('resource_master RM','RM.billing_ru_id = RU1.ru_id AND MIL.resource_id=RM.resource_id','inner');
    qb.where('MI.meter_id', req.params.meter_id);
    qb.where('RM.is_deleted','0');
    qb.get((err, response) => {
        if (err) {
            res.status(403).json({ err });
        }else {
            // console.log(response);
            var token = jwt.sign({ list : response }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    });
}


createTypeWiseDate = function(response, type){
    retDateArr = {
        startDate : '',
        endDate : ''
    }
    dataYear = date.format(response[0].last_data_date_time, 'YYYY');
    dataMonth = date.format(response[0].last_data_date_time, 'MM');
    dataMonthNumber = date.format(response[0].last_data_date_time, 'M');
    dataDay = date.format(response[0].last_data_date_time, 'DD');
    if(type == 'today'){
        startDate = date.parse(dataYear+'-'+dataMonth+'-'+dataDay+' 00:00:00','YYYY-MM-DD HH:mm:ss');
        retDateArr = { 
            startDate : startDate, 
            endDate : date.addDays(startDate, 1)
        }
    }else if(type == 'monthly'){
        startDate = date.parse(dataYear+'-'+dataMonth+'-01 00:00:00','YYYY-MM-DD HH:mm:ss');
        retDateArr = { 
            startDate : startDate, 
            endDate : date.addMonths(startDate, 1)
        }
    }else if(type == 'quarterly'){
        if(dataMonthNumber >= 1 && dataMonthNumber <= 3){
            startDate = dataYear+'-01-01 00:00:00';
        }else if(dataMonthNumber >= 4 && dataMonthNumber <= 6){
            startDate = dataYear+'-04-01 00:00:00';
        }else if(dataMonthNumber >= 7 && dataMonthNumber <= 9){
            startDate = dataYear+'-07-01 00:00:00';
        }else if(dataMonthNumber >= 10 && dataMonthNumber <= 12){
            startDate = dataYear+'-10-01 00:00:00';
        }
        startDate = date.parse(startDate,'YYYY-MM-DD HH:mm:ss');
        endDate = date.addMonths(startDate, 3);
        retDateArr = { 
            startDate : startDate, 
            endDate : endDate
        }
    }else if(type == 'yearly'){
        startDate = dataYear+'-01-01 00:00:00';
        startDate = date.parse(startDate,'YYYY-MM-DD HH:mm:ss');
        retDateArr = { 
            startDate : startDate,
            endDate : date.addYears(startDate, 1)
        }
    }     
    return retDateArr;
}