
var jwt = require('jsonwebtoken');
var datetime = require('node-datetime'); 
var config_master = require('../../../config_master');
var todZoneDeffModel = require('../model/tod_zone_deff');
var tod_zone_deff_title = 'TOD Zone Deffination';

getEncodedData = function(rep){
    var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token
}

exports.index_get = function(req, res) {
    var connection_enview_master = req.app.get('connection_enview_master');
    connection_enview_master.query(todZoneDeffModel.listQuery(req, res), function (err, result) {  
        if (err) {
            res.status(403).json({ err });
        }else {
            var rep = {
                status : 'success',
                msg : ' fetch successfully.',
                data : result
            }
            var token = getEncodedData(rep);
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.tod_zone_deff_save = function(req, res){
    var dbCon = req.app.get('connection_enview_master');
    var data = Array;
    var todItems = req.body;
    if(todItems.length > 0){
        todItems.forEach(element => {
            if(element.tod_id == 0){
                add(req, res, element, dbCon);
            }else{
                update(req, res, element, dbCon);
            }
        });
        var rep = {
            status : 'success',
            msg : tod_zone_deff_title+' details saved successfully.',
            data : null
        }
    }else{
        var rep = {
            status : 'danger',
            msg : ' Something went wrong '+tod_zone_deff_title,
            data : null
        }
    }
    var token = getEncodedData(rep);
    res.status(200).send({ auth: true, token: token });
}

add = function(req, res, postData = Array, dbCon){
    //console.log(postData);
    var data = Array;
    data = dataPreparation(postData);
    //console.log(data);
    dbCon.query(todZoneDeffModel.addQueryTodZoneMaster(req, res), data.tod_zone_master, function (err, result) {  
        if (err) {
            //res.status(403).json({ err });
        }else {
            var tzm_id = result.insertId;
            //console.log(tzm_id);
            dbCon.query(todZoneDeffModel.addQueryTodZoneDeffLog(req, res), data.tod_zone_deff_log, function (err1, result1) {  
                if (err1) {
                    //res.status(403).json({ err1 });
                }else{
                    tzmUpData = {
                        last_tzdl_id : result1.insertId
                    }
                    dbCon.query(todZoneDeffModel.updateQueryTodZoneMaster(tzm_id), tzmUpData, function (err2, result2) {  
                        if (err2) {
                            //res.status(403).json({ err2 });
                        }else{
                            
                        }
                    })
                }
            }) 
        }
    })  
}

update = function(req, res, postData, dbCon){
    //console.log(postData);
    var data = Array;
    data = dataPreparation(postData);
    dbCon.query(todZoneDeffModel.addQueryTodZoneDeffLog(req, res), data.tod_zone_deff_log, function (err, result) {  
        if (err) {

        }else{
            var tzm_id = postData.tod_id;
            tzmUpData = {
                last_tzdl_id : result.insertId
            }
            dbCon.query(todZoneDeffModel.updateQueryTodZoneMaster(tzm_id), tzmUpData, function (err1, result1) {  
                if (err) {

                }else{
                    
                }
            })
        }
    }) 
}

dataPreparation = function(postData = Array){
    var retData = Array;
    if(postData.tod_id == 0){
        data = {
            tod_zone_deff_log : {
                tod_name: postData.tod_name,
                sun_start: this.getTime(postData.sun_start),
                sun_end: this.getTime(postData.sun_end),
                mon_start: this.getTime(postData.mon_start),
                mon_end: this.getTime(postData.mon_end),
                tues_start: this.getTime(postData.tues_start),
                tues_end: this.getTime(postData.tues_end),
                wed_start: this.getTime(postData.wed_start),
                wed_end: this.getTime(postData.wed_end),
                thur_start: this.getTime(postData.thur_start),
                thur_end: this.getTime(postData.thur_end),
                fri_start: this.getTime(postData.fri_start),
                fri_end: this.getTime(postData.fri_end),
                sat_start: this.getTime(postData.sat_start),
                sat_end: this.getTime(postData.sat_end),
                created_by: postData.created_by,
            },
            tod_zone_master : {
                last_tzdl_id : 0
            }
        }
    }else if(postData.tod_id > 0){
        data = {
            tod_zone_deff_log : {
                tod_name: postData.tod_name,
                sun_start: this.getTime(postData.sun_start),
                sun_end: this.getTime(postData.sun_end),
                mon_start: this.getTime(postData.mon_start),
                mon_end: this.getTime(postData.mon_end),
                tues_start: this.getTime(postData.tues_start),
                tues_end: this.getTime(postData.tues_end),
                wed_start: this.getTime(postData.wed_start),
                wed_end: this.getTime(postData.wed_end),
                thur_start: this.getTime(postData.thur_start),
                thur_end: this.getTime(postData.thur_end),
                fri_start: this.getTime(postData.fri_start),
                fri_end: this.getTime(postData.fri_end),
                sat_start: this.getTime(postData.sat_start),
                sat_end: this.getTime(postData.sat_end),
                created_by: postData.created_by,
            }
        }
    }
    return data;
}

getTime = function(data = Number){
    var pastDD = String;
    if(data > 9){
        if(data == 24){
            pastDD = "2018-12-12"+" "+data;
        }else{
            pastDD = "2018-12-12"+" "+data;
        }
    }else{
        pastDD = "2018-12-12"+" "+data;
    }
    var dt = datetime.create(pastDD);
    var formatted = dt.format('H:M:S');
    return formatted;
}
