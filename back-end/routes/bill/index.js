var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("./controller/crud");

router.get('/customer_data/', crud_controller.customer_data);
router.post('/customer_data/', crud_controller.customer_data);

module.exports = router;
