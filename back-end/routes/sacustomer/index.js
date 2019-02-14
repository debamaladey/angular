var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../sacustomer/controller/crud");

router.get('/cust_type_list', crud_controller.fetch_cust_type);
router.get('/state_list', crud_controller.fetch_states);
router.post('/city_list', crud_controller.fetch_cities);
router.post('/createUser', crud_controller.createUser);
router.post('/getAllUser', crud_controller.getAllUser);
router.post('/deleteUser', crud_controller.deleteUser);
router.post('/viewUser', crud_controller.viewUser);
router.post('/updateUser', crud_controller.updateUser);

module.exports = router;