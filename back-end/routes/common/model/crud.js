var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');

exports.resource_master_list = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('resource_id, resource_name')
        .where({ status: 'active', type: 'resource', is_deleted: '0', parent_resource_id: req.params.parent, customer_id: req.params.customer })
        .get('resource_master', (err, response) => {
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

exports.resource_parameters_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('rp.rp_id, rp.parameter_name')
        .from('resource_parameter rp')
        .join('resource_parameter_relation rpr', 'rp.rp_id = rpr.rp_id')
        .where({ 'rpr.resource_id': req.params.resource, 'rp.status': 'active' })
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

exports.resource_units_data = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('ru_id, unit_name')
        .where({ status: 'active', rp_id: req.params.parameter })
        .get('resource_unit', (err, response) => {
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

exports.state_list = function (req, res, c_id) {
    var qb = req.app.get('qb');
    qb.select('id, name');
    if (c_id > 0) {
        qb.where({ country_id: c_id });
    }
    qb.get('state', (err, response) => {
        //  console.log("Query Ran: " + qb.last_query());
        // console.log(response);
        if (err) {
            res.status(403).json({ err });
        } else {
            res.status(200).send({ auth: true, token: getEncodedData(response) });
        }
    })
};

exports.city_list = function (req, res, state_id) {
    var qb = req.app.get('qb');
    qb.select('id, name');
    if (state_id > 0) {
        qb.where({ state_id: state_id });
    }
    qb.get('city', (err, response) => {
        //  console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        } else {
            res.status(200).send({ auth: true, token: getEncodedData(response) });
        }
    })
};


exports.get_email_details = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('*');
    qb.limit(1);
    qb.order_by('ec_id', 'desc');
    qb.get('email_config', (err, response) => {
        //  console.log("Query Ran: " + qb.last_query());
        if (err) {
            res.status(403).json({ err });
        } else {
            res.status(200).send({ auth: true, token: getEncodedData(response) });
        }
    })
};

getEncodedData = function (result) {

    var rep = {
        status: 'success',
        msg: ' fetch successfully.',
        data: { list: result }
    }
    var token = jwt.sign({ rep: rep }, config_master.API_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token
}

exports.phone_code = function (req, res, c_id) {
    var qb = req.app.get('qb');
    qb.select('phonecode');
    qb.where({ id: c_id });
    qb.get('country', (err, response) => {
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

exports.consumption_master_list = function (req, res) {
    var qb = req.app.get('qb');
    qb.select('resource_id, resource_name, parent_resource_id')
        .where({
            type: 'consumption',
            status: 'active',
            is_deleted: '0',
            customer_id: req.params.customer,
        })
        // .where("((type = 'resource' AND parent_resource_id = 0) OR (type = 'consumption'))")
        // .where("(customer_id = 0 OR customer_id = " + req.params.customer + ")")
        .get('resource_master', (err, response) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(response);
            if (err) {
                res.status(403).json({ err });
            } else {
                var resourceArr = new Array();
                for (let i = 0; i < response.length; i++) {
                    const element = response[i];
                    resourceArr.push({
                        id: element.resource_id,
                        name: element.resource_name,
                        parent_id: element.parent_resource_id
                    });
                }
                var data = (createArrayTree(resourceArr, req.params.parent));
                var token = jwt.sign({ list: data }, config_master.API_SECRET, {
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

exports.add = function (req, res) {
    var data = req.body.inData;
    var table_name = req.body.table_name;
    var qb = req.app.get('qb');
    qb.insert(table_name, data, (err, response) => {
        if (err) {
            res.status(403).json({ err });
        } else {
            var token = jwt.sign({ list: response.insertId }, config_master.API_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }
    })
};

exports.migrate = function (req, res) {
    
    var columns = ["column1", "column2", "column3", "column4", "column5", "column6"];
    require("csv-to-array")({
    file: "/home/rahul/Desktop/meter data/data set hourly/M6.csv",
    columns: columns
    }, function (err, array) {
        if (err) {
            res.status(403).json({ err });
        }
        else{
            res.status(200).json({ array });
            return false;
            var data = new Array();
            for (let i = 1; i < array.length; i++) {
                const element = array[i];
                data.push({tag_id: '43', date_time:element.column1, data: element.column2});
                data.push({tag_id: '44', date_time:element.column1, data: element.column3});
                data.push({tag_id: '45', date_time:element.column1, data: element.column4});
                data.push({tag_id: '46', date_time:element.column1, data: element.column5});
                data.push({tag_id: '47', date_time:element.column1, data: element.column6});
            }
            var qb = req.app.get('qb');
            qb.insert_batch('cron_meter_data_hourly', data, (err, response) => {
                if (err) {
                    res.status(403).json({ err });
                }
                else {
                    res.status(200).json({ response });
                }
            });
        }
    });
};
