var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../permission/controller/crud");

router.get('/roles_list', crud_controller.fetch_role);
router.post('/modules_list', crud_controller.fetch_module);
router.get('/role_modules_list', crud_controller.role_modules_list);
router.post('/permission_role_module', crud_controller.role_module_permission);

module.exports = router;