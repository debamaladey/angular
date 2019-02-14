var express = require('express');
var router = express.Router();

// Require controller modules.
var crud_controller = require("../resource/controller/crud");
// GET resource listing.
router.get('/list', crud_controller.index_get);
// GET resource listing.
router.get('/deleted_list', crud_controller.deleted_list_get);
// GET resource details to Add.
router.post('/add', crud_controller.add_post);
// GET resource details to view.
router.get('/view/:id', crud_controller.view_get);
// GET resource details to update.
router.post('/update/:id', crud_controller.update_post);
// DELETE resource .
router.get('/delete/:id/:user_id', crud_controller.delete_status_change_get);
// Undelete resources
router.post('/un_delete/:id', crud_controller.un_delete_status_change_post);
// // CHECK resource unique name.
// router.post('/checkUniqueName/:id', crud_controller.check_unique_name_post)

// GET resource unit listing.
router.get('/unit/list/:resource_id', crud_controller.unit_index_get);
// GET resource unit details to Add.
router.post('/unit/add/:resource_id', crud_controller.unit_add_post);
// GET resource unit details to view.
//router.get('/unit/view/:resource_id/:id', crud_controller.unit_view_get);
// GET resource unit details to update.
router.post('/unit/update/:resource_id/:unit_id', crud_controller.unit_update_post);
// DELETE resource unit .
router.get('/unit/delete/:unit_id', crud_controller.unit_delete_status_change_get);
// GET Resource details as per customer
router.get('/customerWise/:customer_id', crud_controller.customer_wise_resource_get);

router.post('/getAllList', crud_controller.get_lists);
router.post('/deleteResource', crud_controller.delete_resource);
router.post('/add_edit_resource', crud_controller.add_edit_resource);

module.exports = router;