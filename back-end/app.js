var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// debomala
var apiRouter = require('./routes/auth');
var permissionRoute = require('./routes/permission');
var sacustomerRoute = require('./routes/sacustomer');
var accountManagerRoute = require('./routes/account-manager');
var consumptionRoute = require('./routes/consumption');
var clusterRoute = require('./routes/cluster');
// debomala

//Ranajit
var customerRoute = require('./routes/customer');
var resourceRoute = require('./routes/resource');
var tariffRoute = require('./routes/tariff');
var commonRoute = require('./routes/common');
var billRouter = require('./routes/bill');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var config_master = require('./config_master');

// debomala
var newConnection = mysql.createPool({
    host: config_master.database.host,
    user: config_master.database.user,
    password : config_master.database.password,
    port : config_master.database.port, 
    database:config_master.database.db});

app.set('connection_enview_master',newConnection);
// debomala

//rahul
var dbsettings = {
  host: config_master.database.host,
  user: config_master.database.user,
  password : config_master.database.password,
  port : config_master.database.port, 
  database:config_master.database.db
};
var qb = require('node-querybuilder').QueryBuilder(dbsettings, 'mysql', 'single');
app.set('qb',qb);
//rahul

app.use('/', indexRouter);
app.use('/users', usersRouter);

// debomala
app.use('/auth', apiRouter);
app.use('/permission', permissionRoute);
app.use('/sacustomer', sacustomerRoute);
app.use('/account_manager', accountManagerRoute);
app.use('/consumption', consumptionRoute);
app.use('/cluster', clusterRoute);
// debomala


//Ranajit
app.use('/customer', customerRoute);
app.use('/resource', resourceRoute);
app.use('/tariff', tariffRoute);
app.use('/common', commonRoute);
app.use('/bill', billRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;