var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../cluster/controller/crud");

router.get('/lists', crud_controller.list);
router.post('/delete', crud_controller.delete);
router.get('/customer_lists', crud_controller.customer_lists);
router.post('/assign_customers', crud_controller.assign_customers);
router.post('/assign_customer_by_sa', crud_controller.assign_customer_by_sa);
router.post('/delete_assign_customer', crud_controller.delete_assign_customer);
router.post('/editCluster', crud_controller.editCluster);

module.exports = router;
