var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');
var async = require('async');


create_meter_log = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        meter_id: req.body.meter_id,
        meter_name: req.body.meter_name,
        meter_set_val: req.body.meter_set_val,
        high_val: req.body.high_val,
        low_val: req.body.low_val,
        resource_id: req.body.resource_id,
        consumption_id: req.body.consumption_id,
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('meter_info_log', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            if (response.affectedRows > 0 && response.insertId) {
                qb.update('meter_info', { meter_log_id: response.insertId }, { meter_id: data.meter_id }, (err, response2) => {
                    if (err) {
                        res.status(403).json({ err });
                    }
                    else {
                        // console.log(response2);                        
                        insert_meter_other_info(req, res, response.insertId);
                        if (response2.affectedRows > 0) {
                            var token = jwt.sign({ meter_id: data.meter_id }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.status(200).send({ auth: true, token: token });
                        }
                        else {
                            console.log("Meter log id was not update to database!");
                        }

                    }
                });
            }
            else {
                console.log("Meter log was not added to database!");
            }

        }
    });
};

insert_meter_other_info = function (req, res, meter_log_id) {
    var qb = req.app.get('qb');
    // console.log(response);
    if (req.body.source_meters) {
        var data = new Array();
        for (var x = 0; x < req.body.source_meters.length; x++) {
            data.push({
                meter_log_id: meter_log_id,
                source_meter_id: req.body.source_meters[x].meter_id,
                operation: req.body.source_meters[x].operation,
                contribution: req.body.source_meters[x].contribution,
                type: req.body.source_meters[x].type,
            });
        }
        qb.insert_batch('meter_virtual_added_info', data, (err, res) => {
            if (err) {
                res.status(403).json({ err });
            }
            else {
                console.log(qb.last_query());
            }
        });
    }
    if (req.body.value_items) {
        var data = new Array();
        for (var x = 0; x < req.body.value_items.length; x++) {
            data.push({
                meter_log_id: meter_log_id,
                meter_val: req.body.value_items[x].meter_val,
                miv_priod: req.body.value_items[x].miv_priod,
                miv_type: req.body.value_items[x].miv_type,
            });
        }
        qb.insert_batch('meter_info_value', data, (err, res) => {
            if (err) {
                res.status(403).json({ err });
            }
            else {
                console.log(qb.last_query());
            }
        });
    }
};

exports.create_meter = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        given_meter_id: req.body.given_meter_id,
        updated_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.customer_id,
    };
    qb.insert('meter_info', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            if (response.affectedRows > 0 && response.insertId) {
                req.body.meter_id = response.insertId;
                create_meter_log(req, res);
            }
            else {
                console.log("New meter was not added to database!");
            }

        }
    });
};

exports.update_meter = function (req, res) {
    create_meter_log(req, res);
};

exports.view_meter_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('mi.*, mil.meter_name, mil.resource_id, mil.consumption_id, mil.created_by, ')
        .select('(SELECT GROUP_CONCAT(`mct`.`tag_id`) FROM `meter_config_tag` `mct` WHERE `mct`.`meter_config_id` =`mi`.`meter_config_id` GROUP BY `mct`.`meter_config_id` )  AS tag_id ', false)
        .from('meter_info mi')
        .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id')
        .join('meter_config mc', 'mi.meter_config_id = mc.meter_config_id', 'LEFT')
        .where({ 'mi.meter_id': req.params.id })
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {

                async.parallel(
                    {
                        meter_virtual_added_info: function (cb) {
                            qb.select('*')
                                .where({ 'meter_log_id': response[0].meter_log_id })
                                .from('meter_virtual_added_info')
                                .get(cb);
                        },
                        meter_info_value: function (cb) {
                            qb.select('*')
                                .where({ 'meter_log_id': response[0].meter_log_id })
                                .from('meter_info_value')
                                .get(cb);
                        },
                        meter_config_tag_list: function (cb) {
                            qb.select('mct.ru_id, ru.rp_id', false)
                                .select('GROUP_CONCAT(mct.tag_id) AS tag_id', false)
                                .from('meter_config_tag mct')
                                .join('resource_unit ru', 'ru.ru_id = mct.ru_id')
                                .where({ 'mct.meter_config_id': response[0].meter_config_id })
                                .group_by('mct.ru_id')
                                .get(cb);
                        },
                    },
                    function (err, results) {
                        if (err) { res.status(403).json({ err }); }
                        else {
                            response[0].source_meter_list = results.meter_virtual_added_info;
                            response[0].value_list = results.meter_info_value;
                            response[0].tag_list = results.meter_config_tag_list;
                            var token = jwt.sign({ meter: response }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.status(200).send({ auth: true, token: token });
                        }
                    }
                );
            }
        })
};

exports.list_meter_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('mi.*, mil.meter_name, mil.resource_id, mil.consumption_id, mil.created_by, rm.resource_name')
        .select('(SELECT GROUP_CONCAT(`ti`.`tag_name`) FROM `meter_config_tag` `mct` JOIN `tag_info` `ti` ON `mct`.`tag_id` = `ti`.`tag_id` WHERE `mct`.`meter_config_id` =`mi`.`meter_config_id` GROUP BY `mct`.`meter_config_id` )  AS tag_name ', false)
        .from('meter_info mi')
        .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id')
        .join('resource_master rm', 'mil.resource_id = rm.resource_id')
        .where({ 'mi.customer_id': req.params.customer, 'mi.is_deleted': '0', 'mi.type': 'real' })
        .order_by('mi.meter_id', 'desc')
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                // response = meter_tag_details(req, response);
                var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        })
};

exports.delete_meter_data = function (req, res) {
    var qb = req.app.get('qb');

    const sql = 'UPDATE (`meter_info`) SET `is_deleted` = "1" WHERE `meter_id` = ' + req.params.id;
    qb.query(sql, (err, response) => {
        console.log("Query Ran: " + qb.last_query());
        console.log(response);
        if (err) {
            res.status(403).json({ err });
        }
        else {
            var msg = '';
            if (response.affectedRows > 0) {
                msg = 'Meter successfully deleted';
            }
            else {
                msg = 'Meter not deleted';
            }
            var token = jwt.sign({ msg: msg }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });

        }
    });
};

exports.meter_list_by_resource_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('mi.meter_id, mi.given_meter_id, mil.meter_name')
        .from('meter_info mi')
        .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id');
    if (req.params.meter != '0') {
        qb.where({ 'mi.meter_id': req.params.meter });
    }
    else {
        qb.where({ 'mi.meter_config_id': 0 });
    }
    if (req.params.type != '0') {
        qb.where({ 'mi.type': req.params.type });
    }
    qb.where({ 'mi.is_deleted': '0', 'mi.customer_id': req.params.customer, 'mil.resource_id': req.params.resource });
    qb.get((err, response) => {
        // console.log("Query Ran: " + qb.last_query());
        // console.log(response);
        if (err) {
            res.status(403).json({ err });
        } else {
            var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.list_tag_data = function (req, res) {
    var qb = req.app.get('qb');
    var linkTags = new Array();
    qb.select('mct.tag_id')
        .from('meter_info mi')
        .join('meter_config_tag mct', 'mct.meter_config_id = mi.meter_config_id');
    if (req.params.meter != '0') {
        qb.where({ 'mi.meter_id <>': req.params.meter });
    }
    qb.get((err, response) => {
        // console.log("Query Ran: " + qb.last_query());
        // console.log(response);
        if (err) {
            console.log(err);
        }
        else {
            for (let j = 0; j < response.length; j++) {
                linkTags.push(response[j].tag_id);
            }
            qb.select('ti.tag_id, ti.tag_name')
                .from('tag_info ti')
                .where({ 'ti.customer_id': req.params.customer, 'ti.is_deleted': '0' });
            if (linkTags.length) {
                qb.where_not_in('ti.tag_id', linkTags);
            }
            qb.order_by('ti.tag_id', 'desc')
                .get((err, response2) => {
                    // console.log("Query Ran: " + qb.last_query());
                    // console.log(response);
                    if (err) {
                        res.status(403).json({ err });
                    } else {
                        var token = jwt.sign({ list: response2 }, config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                })

        }
    })

};

exports.update_meter_config = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        meter_id: req.body.meter_id,
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    var data2 = new Array();
    qb.insert('meter_config', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            if (response.affectedRows > 0 && response.insertId) {
                for (var x = 0; x < req.body.tag_items.length; x++) {
                    const tag_item = req.body.tag_items[x];
                    for (let i = 0; i < tag_item.tag_id.length; i++) {
                        const tag_id = tag_item.tag_id[i];
                        data2.push({
                            meter_config_id: response.insertId,
                            ru_id: tag_item.ru_id,
                            tag_id: tag_id
                        });
                    }
                }
                qb.insert_batch('meter_config_tag', data2, (err, response) => {
                    if (err) {
                        res.status(403).json({ err });
                    }
                    else {
                        console.log(qb.last_query());
                    }
                });
                qb.update('meter_info', { meter_config_id: response.insertId }, { meter_id: data.meter_id }, (err, response) => {
                    if (err) {
                        res.status(403).json({ err });
                    }
                    else {
                        // console.log(response);                        
                        if (response.affectedRows > 0) {
                            var token = jwt.sign({ meter_id: data.meter_id }, config_master.API_SECRET, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.status(200).send({ auth: true, token: token });
                        }
                        else {
                            console.log("Meter log id was not update to database!");
                        }

                    }
                });
            }
            else {
                console.log("Meter log was not added to database!");
            }

        }
    });
};

exports.list_source_meter_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('mi.meter_id, mi.given_meter_id, mil.meter_name')
        .from('meter_info mi')
        .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id')
        .where({ 'mi.customer_id': req.params.customer, 'mi.is_deleted': '0', 'mi.type': req.params.type, 'mil.resource_id': req.params.resource, 'mi.meter_id <>': req.params.meter })
        .order_by('mi.meter_id', 'desc')
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                // response = meter_tag_details(req, response);
                var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        })
};

exports.create_virtual_meter = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        given_meter_id: req.body.given_meter_id,
        updated_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.customer_id,
        type: 'virtual',
    };
    qb.insert('meter_info', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            if (response.affectedRows > 0 && response.insertId) {
                req.body.meter_id = response.insertId;
                create_meter_log(req, res);
                update_virtual_meter_config(req, res, response.insertId);
            }
            else {
                console.log("New meter was not added to database!");
            }

        }
    });
};

update_virtual_meter_config = function (req, res, meter_id) {
    var qb = req.app.get('qb');
    var data = {
        meter_id: meter_id,
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('meter_config', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var data2 = {
                meter_config_id: response.insertId,
                tag_id: req.body.given_tag_id + data.meter_id,
            };
            qb.insert('meter_config_tag', data2, (err, res) => {
                if (err) {
                    res.status(403).json({ err });
                }
                else {
                    console.log(qb.last_query());
                }
            });

            qb.update('meter_info', { meter_config_id: response.insertId }, { meter_id: data.meter_id }, (err, response2) => {
                if (err) {
                    res.status(403).json({ err });
                }
                else {
                    // console.log(response2);                        
                    if (response2.affectedRows > 0) {
                    }
                    else {
                        console.log("Meter log id was not update to database!");
                    }

                }
            });
        }
    });
};

exports.list_virtual_meter_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('mi.*, mil.*, rm.resource_name')
        .select('(SELECT GROUP_CONCAT(`mct`.`tag_id`) FROM `meter_config_tag` `mct` WHERE `mct`.`meter_config_id` =`mi`.`meter_config_id` GROUP BY `mct`.`meter_config_id` )  AS tag_id ', false)
        .from('meter_info mi')
        .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id')
        .join('resource_master rm', 'mil.resource_id = rm.resource_id')
        .where({ 'mi.customer_id': req.params.customer, 'mi.is_deleted': '0', 'mi.type': 'virtual' })
        .order_by('mi.meter_id', 'desc')
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                // response = meter_tag_details(req, response);
                var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        })
};

exports.consumption_meter_list = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('mi.meter_id, mil.consumption_id')
        .from('meter_info mi')
        .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id')
        .where({ 'mi.customer_id': req.params.customer, 'mi.is_deleted': '0' });
    if (req.params.meter != '0') {
        qb.where({ 'mi.meter_id <>': req.params.meter });
    }
    qb.get((err, response) => {
        // console.log("Query Ran: " + qb.last_query());
        // console.log(response);
        if (err) {
            console.log(err);
        }
        else {
            var token = jwt.sign({ list: response}, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })



};

createArrayTree = function (data, parent_id) {
    const tree = new Array();
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.parent_id == parent_id) {
            element['children'] = createArrayTree(data, element.id);
            tree.push(element);
        }
    }
    return tree;
}
