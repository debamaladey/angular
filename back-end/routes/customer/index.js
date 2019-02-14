var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../customer/controller/crud");
var dashboard_controller = require("../customer/controller/dashboard");

router.get('/get_meter_id/:customer', crud_controller.meter_id);
router.get('/get_virtual_meter_id/:customer', crud_controller.virtual_meter_id);
router.get('/get_virtual_tag_id/:customer', crud_controller.virtual_tag_id);
router.post('/create_meter', crud_controller.create_meter);
router.post('/update_meter', crud_controller.update_meter);
router.get('/view_meter/:id', crud_controller.view_meter);
router.get('/list_meter/:customer', crud_controller.list_meter);
router.get('/delete_meter/:id', crud_controller.delete_meter);
router.get('/meter_list_by_resource/:customer/:resource/:meter/:type', crud_controller.meter_list_by_resource);
router.get('/list_tag/:customer/:meter', crud_controller.list_tag);
router.post('/update_meter_config', crud_controller.update_meter_config);
router.get('/source_meter_list/:customer/:type/:resource/:meter', crud_controller.list_source_meter);
router.post('/create_virtual_meter', crud_controller.create_virtual_meter);
router.get('/list_virtual_meter/:customer', crud_controller.list_virtual_meter);

router.post('/dashboard',dashboard_controller.index_post);
router.post('/dashboard/consumption_resource_dropdown',dashboard_controller.consumption_resource_dropdown_post);
router.get('/dashboard/consumption_resource_unit_details/:meter_id',dashboard_controller.consumption_resource_unit_details_get);
router.post('/dashboard/consumption_tag_data_details', dashboard_controller.consumption_tag_data_details_post)

router.get('/consumption_meter_list/:customer/:parent/:meter', crud_controller.fetch_consumption_meter);

router.post('/dashboard/major_consumption_resource_unit_details',dashboard_controller.major_consumption_resource_unit_details_post);
module.exports = router;
