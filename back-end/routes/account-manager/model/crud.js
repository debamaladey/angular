var customerTypeTable = 'customer_type';
var stateTable = 'state';
var cityTable = 'city';
var customerAccountManagerTable = 'account_customer_relation';
var customerTable = 'customer';
var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');
var async = require('async');
var QueryBuilder = require('datatable');

exports.customer_list = function (req, res) {
    var sql = "SELECT CM.*, CT.cust_type_name,ST.name as sname,C.name as cname " +
        " FROM " + customerTable + " CM " +
        " LEFT JOIN " + customerTypeTable + " CT ON CT.id = CM.customer_type" +
        " LEFT JOIN " + customerAccountManagerTable + " AC ON AC.customer_id = CM.id" +
        " LEFT JOIN " + stateTable + " ST ON ST.id=CM.state_id" +
        " LEFT JOIN " + cityTable + " C ON C.id=CM.city_id" +
        " WHERE AC.user_id = " + req.body.id + " order by CM.id desc";
    return sql;
};

exports.get_template_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('trm.resource_id, trl1.tdl_id')
        .from('tariff_rule_master trm')
        .join('tariff_rule_log_1 trl1', 'trl1.trl1_id = trm.trl1_id')
        .where({ 'trm.customer_id': req.params.id })
        .get((err, response) => {
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

exports.view_customer_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('cu.*, cu.customer_name, state.name AS state_name, city.name AS city_name')
        .from('customer cu')
        .join('state', 'state.id = cu.state_id')
        .join('city', 'city.id = cu.city_id')
        .where({ 'cu.id': req.params.id })
        .get((err, response) => {
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

exports.list_template_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('tdl.tdl_id, tdl.temp_name, ru.unit_name')
        .from('template_master tm')
        .join('template_details_log tdl', 'tm.tdl_id = tdl.tdl_id')
        .join('customer cu', 'cu.state_id = tdl.state_id AND cu.city_id = tdl.city_id')
        .join('resource_unit ru', 'ru.ru_id = tdl.ru_id')
        .where({ 'cu.id': req.params.customer_id, 'tdl.resource_id': req.params.resource_id })
        .get((err, response) => {
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

exports.set_template_data = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        tdl_id: req.body.tdl_id,
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('tariff_rule_log_1', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var trl1_id = response.insertId;

            qb.select('*')
                .from('tariff_rule_master')
                .where({ customer_id: req.body.customer_id, resource_id: req.body.resource_id })
                .get((err, response) => {
                    // console.log("Query Ran: " + qb.last_query());
                    // console.log(response);
                    if (err) {
                        res.status(403).json({ err });
                    } else {
                        if (response.length) {
                            var data2 = {
                                trl1_id: trl1_id,
                                updated_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                            };
                            var con = {
                                customer_id: req.body.customer_id,
                                resource_id: req.body.resource_id,
                            };
                            qb.update('tariff_rule_master', data2, con, (err, response) => {
                                if (err) {
                                    res.status(403).json({ err });
                                }
                                else {
                                    // console.log(response);                        
                                    if (response.affectedRows > 0) {
                                        var token = jwt.sign({ id: trl1_id }, config_master.API_SECRET, {
                                            expiresIn: 86400 // expires in 24 hours
                                        });
                                        res.status(200).send({ auth: true, token: token });
                                    }
                                }
                            });
                        }
                        else {
                            var data2 = {
                                customer_id: req.body.customer_id,
                                trl1_id: trl1_id,
                                resource_id: req.body.resource_id,
                            };
                            qb.insert('tariff_rule_master', data2, (err, response) => {
                                if (err) {
                                    res.status(403).json({ err });
                                }
                                else {
                                    // console.log("Query Ran: " + qb.last_query());
                                    // console.log(response);                    
                                    if (response.affectedRows > 0) {
                                        var token = jwt.sign({ id: trl1_id }, config_master.API_SECRET, {
                                            expiresIn: 86400 // expires in 24 hours
                                        });
                                        res.status(200).send({ auth: true, token: token });
                                    }
                                }
                            });
                        }
                    }
                })


        }
    });
};

exports.list_tariff_rule_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('tc_id, tc_name')
        .from('template_charges')
        .where({ tdl_id: req.params.id, tc_status: '1' })
        .get((err, response) => {
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

exports.get_template_by_tariff_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('tdl.tdl_id, tdl.temp_name')
        .from('template_details_log tdl')
        .join('template_charges tc', 'tc.tdl_id = tdl.tdl_id')
        .where({ 'tc.tc_id': req.params.tc_id })
        .get((err, response) => {
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

exports.get_template_tariff_variable_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('tcvn_id, tc_var_name')
        .from('template_charges_var_name')
        .where({ 'tc_id': req.params.tc_id })
        .get((err, response) => {
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

exports.get_tariff_rule_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('trm.trm_id, trm.trl1_id')
        .from('tariff_rule_master trm')
        .where({ 'trm.customer_id': req.params.customer_id })
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                qb.select('trl4.*')
                    .from('tariff_rule_log_4 trl4')
                    .join('tariff_rule_log_2 trl2', 'trl4.trl3_id = trl2.trl3_id')
                    .join('tariff_rule_master trm', 'trl2.trl1_id = trm.trl1_id')
                    .where({ 'trm.customer_id': req.params.customer_id, 'trl2.tc_id': req.params.tc_id })
                    .get((err, response2) => {
                        // console.log("Query Ran: " + qb.last_query());
                        // console.log(response);
                        if (err) {
                            res.status(403).json({ err });
                        } else {
                            response[0].tariff_rule = response2;
                            qb.select('trl5.*')
                                .from('tariff_rule_log_5 trl5')
                                .join('tariff_rule_log_2 trl2', 'trl5.trl3_id = trl2.trl3_id')
                                .join('tariff_rule_master trm', 'trl2.trl1_id = trm.trl1_id')
                                .where({ 'trm.customer_id': req.params.customer_id, 'trl2.tc_id': req.params.tc_id })
                                .get((err, response3) => {
                                    // console.log("Query Ran: " + qb.last_query());
                                    // console.log(response);
                                    if (err) {
                                        res.status(403).json({ err });
                                    } else {
                                        response[0].tod_rule = response3;
                                        var token = jwt.sign({ list: response }, config_master.API_SECRET, {
                                            expiresIn: 86400 // expires in 24 hours
                                        });
                                        res.status(200).send({ auth: true, token: token });
                                    }
                                });
                        }
                    });
            }
        })
};

insert_trl3_id = function (req, res, trl3_id) {
    var qb = req.app.get('qb');
    qb.select('*')
        .from('tariff_rule_log_2')
        .where({ tc_id: req.body.tc_id, trl1_id: req.body.trl1_id })
        .get((err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                if (response.length) {
                    var data2 = {
                        trl3_id: trl3_id,
                    };
                    var con = {
                        tc_id: req.body.tc_id,
                        trl1_id: req.body.trl1_id,
                    };
                    qb.update('tariff_rule_log_2', data2, con, (err, response) => {
                        if (err) {
                            res.status(403).json({ err });
                        }
                        else {
                            // console.log(response);                        
                            if (response.affectedRows > 0) {
                                //
                            }
                        }
                    });
                }
                else {
                    var data2 = {
                        tc_id: req.body.tc_id,
                        trl3_id: trl3_id,
                        trl1_id: req.body.trl1_id,
                    };
                    qb.insert('tariff_rule_log_2', data2, (err, response) => {
                        if (err) {
                            res.status(403).json({ err });
                        }
                        else {
                            // console.log("Query Ran: " + qb.last_query());
                            // console.log(response);                    
                            if (response.affectedRows > 0) {
                                //
                            }
                        }
                    });
                }
            }
        })
}

insert_resource_data = function (req, res, trl3_id) {
    var qb = req.app.get('qb');
    var data2 = new Array();
    for (var x = 0; x < req.body.rule_items.length; x++) {
        var from_date = req.body.rule_items[x].from_date;
        var to_date = req.body.rule_items[x].to_date;
        for (var y = 0; y < req.body.rule_items[x].rule_values.length; y++) {
            var tempData = {
                trl3_id: trl3_id,
                from_date: from_date,
                to_date: to_date,
                tcvn_id: req.body.rule_items[x].rule_values[y].tcvn_id,
                trl4_value: req.body.rule_items[x].rule_values[y].trl4_value,
            };
            data2.push(tempData);
        }
    }
    var data3 = new Array();
    if (req.body.tod_items.length > 1) {
        for (var x = 0; x < req.body.tod_items.length; x++) {
            for (var y = 0; y < req.body.tod_items[x].tod_values.length; y++) {
                var tempData = {
                    trl3_id: trl3_id,
                    tcvn_id: req.body.tod_items[x].tod_values[y].tcvn_id,
                    day: req.body.tod_items[x].tod_values[y].day,
                    start_time: req.body.tod_items[x].tod_values[y].start_time,
                    end_time: req.body.tod_items[x].tod_values[y].end_time,
                };
                data3.push(tempData);
            }
        }
    }
    async.parallel(
        {
            q1: function (cb) {
                qb.insert_batch('tariff_rule_log_4', data2, cb);
            },
            q2: function (cb) {
                qb.insert_batch('tariff_rule_log_5', data3, cb);
            },
        },
        function (err, results) {
            if (err) { res.status(403).json({ err }); }
            else {
                console.log(results);
                var token = jwt.sign({ id: trl3_id }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        }
    );
}

exports.set_resource_data = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('tariff_rule_log_3', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var trl3_id = response.insertId;

            insert_trl3_id(req, res, trl3_id);
            insert_resource_data(req, res, trl3_id);

        }
    });
};

insert_environmental_data = function (req, res, trl3_id) {
    var qb = req.app.get('qb');
    var data2 = new Array();
    for (var x = 0; x < req.body.rule_items.length; x++) {
        var tcvn_id = req.body.rule_items[x].tcvn_id;
        for (var y = 0; y < req.body.rule_items[x].rule_values.length; y++) {
            var tempData = {
                trl3_id: trl3_id,
                from_date: req.body.rule_items[x].rule_values[y].from_date,
                to_date: req.body.rule_items[x].rule_values[y].to_date,
                tcvn_id: tcvn_id,
                trl4_value: req.body.rule_items[x].rule_values[y].trl4_value,
            };
            data2.push(tempData);
        }
    }

    async.parallel(
        {
            q1: function (cb) {
                qb.insert_batch('tariff_rule_log_4', data2, cb);
            },
        },
        function (err, results) {
            if (err) { res.status(403).json({ err }); }
            else {
                console.log(results);
                var token = jwt.sign({ id: trl3_id }, config_master.API_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        }
    );
}

exports.set_environmental_data = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('tariff_rule_log_3', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var trl3_id = response.insertId;

            insert_trl3_id(req, res, trl3_id);
            insert_environmental_data(req, res, trl3_id);

        }
    });
};

exports.set_fixed_data = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('tariff_rule_log_3', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var trl3_id = response.insertId;

            insert_trl3_id(req, res, trl3_id);

            var data2 = new Array();
            for (var x = 0; x < req.body.rule_items.length; x++) {
                var tempData = {
                    trl3_id: trl3_id,
                    tcvn_id: req.body.rule_items[x].tcvn_id,
                    trl4_value: req.body.rule_items[x].trl4_value,
                    trl4_period: req.body.rule_items[x].trl4_period,
                };
                data2.push(tempData);
            }
            qb.insert_batch('tariff_rule_log_4', data2, (err, response) => {
                if (err) {
                    res.status(403).json({ err });
                }
                else {
                    var token = jwt.sign({ id: trl3_id }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }
            });

        }
    });
};

exports.set_load_details_data = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('tariff_rule_log_3', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var trl3_id = response.insertId;

            insert_trl3_id(req, res, trl3_id);

            var data2 = new Array();
            for (var x = 0; x < req.body.rule_items.length; x++) {
                var tempData = {
                    trl3_id: trl3_id,
                    tcvn_id: req.body.rule_items[x].tcvn_id,
                    trl4_value: req.body.rule_items[x].trl4_value,
                };
                data2.push(tempData);
            }
            qb.insert_batch('tariff_rule_log_4', data2, (err, response) => {
                if (err) {
                    res.status(403).json({ err });
                }
                else {
                    var token = jwt.sign({ id: trl3_id }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }
            });

        }
    });
};

exports.set_contract_demand_data = function (req, res) {
    var qb = req.app.get('qb');
    var data = {
        created_date: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        created_by: req.body.created_by,
    };
    qb.insert('tariff_rule_log_3', data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        }
        else {
            // console.log(response);
            var trl3_id = response.insertId;

            insert_trl3_id(req, res, trl3_id);

            var data2 = new Array();
            for (var x = 0; x < req.body.rule_items.length; x++) {
                var tempData = {
                    trl3_id: trl3_id,
                    tcvn_id: req.body.rule_items[x].tcvn_id,
                    trl4_value: req.body.rule_items[x].trl4_value,
                    trl4_contract: req.body.rule_items[x].trl4_contract,
                };
                data2.push(tempData);
            }
            qb.insert_batch('tariff_rule_log_4', data2, (err, response) => {
                if (err) {
                    res.status(403).json({ err });
                }
                else {
                    var token = jwt.sign({ id: trl3_id }, config_master.API_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }
            });

        }
    });
};

exports.datatable_data = function (req, res) {
    var tableDefinition = {
        sDatabaseOrSchema: '`'+config_master.database.db+'`',
        sSelectSql: "city.id as city_id, city.name as city_name, state.name AS state_name, country.name AS country_name",
        sFromSql: "city JOIN state ON city.state_id=state.id JOIN country ON state.country_id = country.id",
    };
    var queryBuilder = new QueryBuilder(tableDefinition);
    // console.log(req.body);

    
    var requestQuery = req.body;
    for (let i = 0; i < requestQuery.columns.length; i++) {
        const element = requestQuery.columns[i];
        if (requestQuery.columns[i].searchable) {
            requestQuery.columns[i].searchable = 'true';
        }
        if (requestQuery.columns[i].orderable) {
            requestQuery.columns[i].orderable = 'true';
        }        
    }

    // Build an object of SQL statements
    var queries = queryBuilder.buildQuery(req.body);

    // Connect to the database
    var myDbObject = req.app.get('connection_enview_master');

    // Execute the SQL statements generated by queryBuilder.buildQuery
    myDbObject.query(queries.changeDatabaseOrSchema, function (err) {
        if (err) { res.status(403).json({ err }); }
        else {
            if (!queries.recordsFiltered) {
                queries.recordsFiltered = queries.recordsTotal;
            }

            // res.status(403).json(queries);
            // return false;
            async.parallel(
                {
                    recordsFiltered: function (cb) {
                        myDbObject.query(queries.recordsFiltered, cb);
                    },
                    recordsTotal: function (cb) {
                        myDbObject.query(queries.recordsTotal, cb);
                    },
                    select: function (cb) {
                        myDbObject.query(queries.select, cb);
                    }
                },
                function (err, results) {
                    if (err) { res.status(403).json({ err }); }
                    else {
                        // res.status(403).json(queryBuilder.parseResponse(results));
                        var token = jwt.sign(queryBuilder.parseResponse(results), config_master.API_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                    }
                }
            );
        }
    });

};