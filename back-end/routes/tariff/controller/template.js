var queryModel = require('../model/template');

exports.get_template_data = function(req, res){
    queryModel.get_template_data(req, res);
}

exports.template_save = function(req, res) {
    queryModel.save(req, res); 
};

exports.template_list_get = function(req, res){
    queryModel.template_list_get(req, res);
}

exports.template_config_save_post = function(req, res){
    queryModel.template_config_save_post(req, res);
}

exports.template_delete_get = function(req, res){
    queryModel.template_delete_get(req, res);
}

exports.get_template_data_view = function(req, res){
    queryModel.get_template_data_view(req, res);
}

exports.get_template_config_data_view = function(req, res){
    queryModel.get_template_config_data_view(req, res);
}

exports.sa_template_datatable_post = function(req, res){
    queryModel.sa_template_datatable_post(req, res);
}


