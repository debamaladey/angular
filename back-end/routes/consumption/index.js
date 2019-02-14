var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../consumption/controller/crud");
// GET resource listing.

router.post('/getAllList', crud_controller.get_lists);
router.post('/deleteConsumption', crud_controller.delete_consumption);
router.post('/add_edit_consumption', crud_controller.add_edit_consumption);
router.post('/getLists', crud_controller.get_cons_meter_lists);
router.get('/getMeterLists', crud_controller.get_meter_lists);
router.post('/assignMeter', crud_controller.assign_consumption_meter);

module.exports = router;