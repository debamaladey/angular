var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../account-manager/controller/crud");

router.post('/assign_customer', crud_controller.assign_customer);
router.get('/view_customer/:id', crud_controller.view_customer);
router.get('/get_template/:id', crud_controller.get_template);
router.get('/list_template/:customer_id/:resource_id', crud_controller.list_template);
router.post('/set_template', crud_controller.set_template);
router.get('/list_tariff_rule/:id', crud_controller.list_tariff_rule);
router.get('/get_template_by_tariff/:tc_id', crud_controller.get_template_by_tariff);
router.get('/get_template_tariff_variable/:tc_id', crud_controller.get_template_tariff_variable);
router.get('/get_tariff_rule/:customer_id/:tc_id', crud_controller.get_tariff_rule);
router.post('/set_resource', crud_controller.set_resource);
router.post('/set_environmental', crud_controller.set_environmental);
router.post('/set_fixed', crud_controller.set_fixed);
router.post('/set_load_details', crud_controller.set_load_details);
router.post('/set_contract_demand', crud_controller.set_contract_demand);
router.post('/datatable', crud_controller.datatable);

module.exports = router;
