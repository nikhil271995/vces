var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var fs = require('fs');
var flash = require('connect-flash');
var moment = require('moment');
var crypto =  require('crypto');
var async = require('async');
var mongoose = require('mongoose');

//Database
mongoose.connect('mongodb://localhost/vces');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

var routes = require('./routes/index');

var app = express();

//define moment for app
app.locals.moment = moment;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
swig.setDefaults({ locals: { now : function () { return new Date(); } }});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
