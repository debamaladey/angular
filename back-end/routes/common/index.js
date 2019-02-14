var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../common/controller/crud");

router.get('/resource_list/:customer/:parent', crud_controller.fetch_resource);

router.get('/resource_parameters/:resource', crud_controller.resource_parameters);

router.get('/resource_units/:parameter', crud_controller.resource_units);

router.get('/state_list', crud_controller.state_list);

router.get('/city_list/:state_id', crud_controller.city_list);

router.get('/phone_code', crud_controller.phone_code);

router.get('/consumption_list/:customer/:parent/', crud_controller.fetch_consumption);
router.get('/get_email_details', crud_controller.get_email_details);

router.post('/add', crud_controller.add);
router.get('/migrate', crud_controller.migrate);


module.exports = router;
