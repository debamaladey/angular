var jwt = require('jsonwebtoken');
var config_master = require('../../../config_master');
var date = require('date-and-time');
var async = require('async');

exports.customer_data = function (req, res) {
    var qb = req.app.get('qb');
    var customerId = 1;
    var startDate = '2018-01-01';
    var endDate = '2018-02-01';
    if (req.method == 'POST') {
        customerId = req.body.customer_id;
        startDate = req.body.start_date;
        endDate = req.body.end_date;
    }


    qb.select('rm.resource_id, rm.resource_name, tdl.tdl_id, tdl.temp_name, trl1.trl1_id')
        .from('resource_master rm')
        .join('tariff_rule_master trm', 'rm.resource_id = trm.resource_id')
        .join('tariff_rule_log_1 trl1', 'trl1.trl1_id = trm.trl1_id')
        .join('template_details_log tdl', 'trl1.tdl_id = tdl.tdl_id')
        .where({
            'rm.status': 'active',
            'rm.type': 'resource',
            'rm.is_deleted': '0',
            'rm.parent_resource_id': 0,
            'rm.customer_id': 0,
            'trm.customer_id': customerId,
        })
        .get((err, resResourses) => {
            // console.log("Query Ran: " + qb.last_query());
            // console.log(resResourses);
            if (err) {
                res.status(403).json({ err });
            } else {
                var resource_parallel = {};
                for (let i = 0; i < resResourses.length; i++) {
                    const resourse = resResourses[i];
                    resource_parallel['meter_list_' + i] = function (cb) {
                        qb.select('mi.meter_id, mi.given_meter_id, mil.meter_name, ti.tag_id, ti.tag_name, ru.ru_id, ru.unit_name, rp.rp_id, rp.parameter_name')
                            .from('meter_info mi')
                            .join('meter_info_log mil', 'mi.meter_log_id = mil.meter_log_id')
                            .join('resource_master rm', 'rm.resource_id = mil.resource_id')
                            .join('resource_master cons', 'cons.resource_id = mil.consumption_id')
                            .join('meter_config_tag mct', 'mct.meter_config_id = mi.meter_config_id AND mct.ru_id = rm.billing_ru_id')
                            .join('tag_info ti', 'mct.tag_id = ti.tag_id')
                            .join('resource_unit ru', 'mct.ru_id = ru.ru_id')
                            .join('resource_parameter rp', 'rp.rp_id = ru.rp_id')
                            .where({
                                'mi.type': 'real',
                                'mi.status': 'active',
                                'mi.is_deleted': '0',
                                'mil.resource_id': resourse.resource_id,
                                'mi.customer_id': customerId,
                                'cons.parent_resource_id': resourse.resource_id,
                            })
                            .get(cb);
                    }
                    resource_parallel['charges_' + i] = function (cb) {
                        qb.select('tc.tc_id, tc.tc_name, trl2.trl3_id')
                            .from('template_charges tc')
                            .join('tariff_rule_log_2 trl2', 'trl2.tc_id = tc.tc_id')
                            .where({
                                'tc.tc_status': 1,
                                'tc.tdl_id': resourse.tdl_id,
                                'trl2.trl1_id': resourse.trl1_id,
                            })
                            .get(cb);
                    }
                }

                async.parallel(resource_parallel,
                    function (err, resource_results) {
                        if (err) { res.status(403).json({ err }); }
                        else {
                            var meter_parallel = {};
                            for (let i = 0; i < resResourses.length; i++) {
                                resResourses[i].meter_list = resource_results['meter_list_' + i];
                                for (let m = 0; m < resResourses[i].meter_list.length; m++) {
                                    const meterInfo = resResourses[i].meter_list[m];
                                    meter_parallel['cron_data_' + i + '-' + m] = function (cb) {
                                        qb.select('cmdh.date_time, cmdh.data')
                                            .from('tag_info ti')
                                            .join('cron_meter_data_hourly cmdh', 'ti.tag_id = cmdh.tag_id')
                                            .where({
                                                'ti.tag_id': meterInfo.tag_id,
                                                'ti.customer_id': customerId,
                                                'cmdh.date_time >=': startDate,
                                                'cmdh.date_time <': endDate,
                                            })
                                            .order_by('cmdh.date_time ASC')
                                            .get(cb);
                                    }
                                }
                                resResourses[i].charges = resource_results['charges_' + i];
                                for (let c = 0; c < resResourses[i].charges.length; c++) {
                                    const chargeInfo = resResourses[i].charges[c];
                                    meter_parallel['tariff_rule_' + i + '-' + c] = function (cb) {
                                        qb.select('trl4.*, tcvn.tc_var_name, trl5.day, trl5.start_time, trl5.end_time')
                                            .from('tariff_rule_log_4 trl4')
                                            .join('template_charges_var_name tcvn', 'tcvn.tcvn_id = trl4.tcvn_id')
                                            .join('tariff_rule_log_5 trl5', 'trl5.trl3_id = trl4.trl3_id AND trl5.tcvn_id = trl4.tcvn_id', 'LEFT')
                                            .where({
                                                'trl4.trl3_id': chargeInfo.trl3_id,
                                            })
                                            .get(cb);
                                    }

                                    meter_parallel['tariff_var_' + i + '-' + c] = function (cb) {
                                        qb.select('tcvn.*')
                                            .from('template_charges_var_name tcvn')
                                            .where({
                                                'tcvn.tc_id': chargeInfo.tc_id,
                                            })
                                            .get(cb);
                                    }
                                }
                            }
                            async.parallel(meter_parallel,
                                function (err, meter_results) {
                                    if (err) { res.status(403).json({ err }); }
                                    else {
                                        for (let i = 0; i < resResourses.length; i++) {
                                            for (let m = 0; m < resResourses[i].meter_list.length; m++) {
                                                var cron_data = {};
                                                var total_unit = 0;
                                                var cData = meter_results['cron_data_' + i + '-' + m];
                                                for (let d = 0; d < cData.length; d++) {
                                                    const element = cData[d];
                                                    cron_data[date.format(cData[d].date_time, 'YYYYMMDDHH')] = cData[d].data;
                                                    total_unit += cData[d].data;
                                                }
                                                resResourses[i].meter_list[m].cron_data = cron_data;
                                                resResourses[i].meter_list[m].total_unit = total_unit;
                                            }
                                            for (let c = 0; c < resResourses[i].charges.length; c++) {
                                                resResourses[i].charges[c].tariff_rule = meter_results['tariff_rule_' + i + '-' + c];
                                                resResourses[i].charges[c].tariff_var = meter_results['tariff_var_' + i + '-' + c];
                                            }
                                        }
                                        // res.status(403).json({ data: resResourses });
                                        req.body.fatch_data = resResourses;
                                        calculateData(req, res);
                                    }
                                }
                            );
                        }
                    }
                );


            }
        })
};

calculateData = function (req, res) {
    var data = req.body.fatch_data;

    for (let r = 0; r < data.length; r++) {
        data[r].test = [];
        const resourse = data[r];
        resourse.total_unit = 0;
        resourse.total_amount = 0;

        for (let m = 0; m < data[r].meter_list.length; m++) {
            const meter = data[r].meter_list[m];
            meter.charges = resourse.charges;
            resourse.total_unit += meter.total_unit;
            meter.total_amount = 0;

            for (let c = 0; c < meter.charges.length; c++) {
                const charge = meter.charges[c];
                charge.total_unit = 0;
                charge.total_amount = 0;
                switch (charge.tc_name) {
                    case 'checkbox_res_chrages':
                        if (charge.tariff_var.length > 1) {

                            for (let t = 0; t < charge.tariff_rule.length; t++) {
                                const tRule = charge.tariff_rule[t];
                                tRule.total_unit = 0;
                                tRule.total_amount = 0;
                                var fDate = new Date(tRule.from_date);
                                var tDate = new Date(tRule.to_date);
                                tDate.setDate(tDate.getDate() + 1);

                                for (var d = new Date(fDate); d < tDate; d.setHours(d.getHours() + 1)) {
                                    var
                                        rDay = date.format(d, 'dddd').toLowerCase(),
                                        cTime = parseInt(date.format(d, 'HH')),
                                        sTime = parseInt(tRule.start_time.substring(0, 2)),
                                        eTime = parseInt(tRule.end_time.substring(0, 2));

                                    if (rDay == tRule.day && (cTime >= sTime && cTime <= eTime)) {
                                        if (meter.cron_data[date.format(d, 'YYYYMMDDHH')]) {
                                            tRule.total_unit += meter.cron_data[date.format(d, 'YYYYMMDDHH')];
                                        }
                                    }
                                }
                                tRule.total_amount = tRule.total_unit * tRule.trl4_value;
                                charge.total_unit += tRule.total_unit;
                                charge.total_amount += tRule.total_amount;
                            }
                        }
                        else {
                            for (let t = 0; t < charge.tariff_rule.length; t++) {
                                const tRule = charge.tariff_rule[0];
                                tRule.total_unit = 0;
                                tRule.total_amount = 0;
                                var fDate = new Date(tRule.from_date);
                                var tDate = new Date(tRule.to_date);
                                tDate.setDate(tDate.getDate() + 1);

                                for (var d = new Date(fDate); d < tDate; d.setHours(d.getHours() + 1)) {
                                    if (meter.cron_data[date.format(d, 'YYYYMMDDHH')]) {
                                        tRule.total_unit += meter.cron_data[date.format(d, 'YYYYMMDDHH')];
                                    }
                                }
                                tRule.total_amount = tRule.total_unit * tRule.trl4_value;
                                charge.total_unit += tRule.total_unit;
                                charge.total_amount += tRule.total_amount;
                            }
                        }
                        break;
                    case 'checkbox_env_chrages':
                        for (let t = 0; t < charge.tariff_rule.length; t++) {
                            const tRule = charge.tariff_rule[t];
                            tRule.total_unit = 0;
                            tRule.total_amount = 0;
                            var fDate = new Date(tRule.from_date);
                            var tDate = new Date(tRule.to_date);
                            tDate.setDate(tDate.getDate() + 1);

                            for (var d = new Date(fDate); d < tDate; d.setHours(d.getHours() + 1)) {
                                if (meter.cron_data[date.format(d, 'YYYYMMDDHH')]) {
                                    tRule.total_unit += meter.cron_data[date.format(d, 'YYYYMMDDHH')];
                                }
                            }
                            tRule.total_amount = tRule.total_unit * tRule.trl4_value;
                            charge.total_unit += tRule.total_unit;
                            charge.total_amount += tRule.total_amount;
                        }
                        break;

                    case 'checkbox_contract_chrages':
                        for (let t = 0; t < charge.tariff_rule.length; t++) {
                            const tRule = charge.tariff_rule[t];
                            tRule.total_unit = 0;
                            tRule.total_amount = 0;
                            if (meter.total_unit > tRule.trl4_contract) {
                                tRule.total_unit = (meter.total_unit - tRule.trl4_contract);
                            }
                            tRule.total_amount = tRule.total_unit * tRule.trl4_value;
                            charge.total_unit += tRule.total_unit;
                            charge.total_amount += tRule.total_amount;
                        }
                        break;

                    case 'checkbox_fixed_chrages':
                        for (let t = 0; t < charge.tariff_rule.length; t++) {
                            const tRule = charge.tariff_rule[t];
                            tRule.total_unit = 0;
                            tRule.total_amount = 0;
                            switch (tRule.trl4_period) {
                                case 'monthly':
                                    tRule.total_amount = tRule.trl4_value;
                                    break;
                                case 'annually':
                                    tRule.total_amount = tRule.trl4_value / 12;
                                    break;
                            }
                            charge.total_amount += tRule.total_amount;
                        }
                        break;
                }
                meter.total_amount += charge.total_amount;
            }
            resourse.total_amount += meter.total_amount;
        }
    }


    res.status(200).json({ data: data });


}