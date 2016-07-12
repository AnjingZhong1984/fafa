var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

global.config = require('./config.js');
global.tool = require('./utils/tool');

log4js.configure(require('./log4js'));
global.log4js = log4js;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('trust proxy', true);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger("http"), {
  level: 'debug',
  format: ':method | :status | :response-time ms | :url '
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  name: 'breezee.sid',
  saveUninitialized: true,
  cookie: {maxAge: 1800000},
  store: new FileStore({

  })
}));

app.use('/', require('./routes/index'));
app.use('/view', require('./routes/view'));
app.use('/api', require('./routes/data'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (err, req, res, next) {
  if (err.status == 404 || err.message.indexOf('Failed to lookup view') > -1) {
    res.render(req.session.endType + '/notFound', {
      message: err.message,
      error: err
    });
  } else if (err.status == 401) {
    res.render(req.session.endType + '/forbid', {
      message: err.message,
      error: err
    });
  } else {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

module.exports = app;
