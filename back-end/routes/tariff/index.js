var express = require('express');
var router = express.Router();

// Require controller modules.
var tod_zone_deff_cont = require("../tariff/controller/tod_zone_deff");
var template_cont = require("../tariff/controller/template");
// RULE 1
// TOD Zone Deff Add
// GET resource listing.
router.get('/tod_zone_deff_list', tod_zone_deff_cont.index_get);
router.post('/tod_zone_deff_save', tod_zone_deff_cont.tod_zone_deff_save);
router.get('/template_list', template_cont.template_list_get);
router.post('/sa_template_datatable', template_cont.sa_template_datatable_post);
router.post('/template_save', template_cont.template_save);
router.get('/template_delete/:tm_id', template_cont.template_delete_get);
router.get('/get_template_data/:tm_id', template_cont.get_template_data);
router.post('/template_config_save', template_cont.template_config_save_post);
router.get('/get_template_data_view/:tm_id', template_cont.get_template_data_view);
router.get('/get_template_config_data_view/:tm_id', template_cont.get_template_config_data_view);






module.exports = router;