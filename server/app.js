'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _letsencrypt = require('./middleware/letsencrypt');

var _letsencrypt2 = _interopRequireDefault(_letsencrypt);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _authRouter = require('./routes/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _appRouter = require('./routes/app-router');

var _appRouter2 = _interopRequireDefault(_appRouter);

var _session = require('./middleware/session');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import express from 'express');
var debug = (0, _debug2.default)('blocks:AppMain');


_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect('mongodb://localhost:27017/' + _config.DB_CONFIG.dbName, { useMongoClient: true }).then(function () {
	debug('mongodb connected');
}).catch(function (err) {
	debug('Could not connect to mongo DB! - start mongo daemon');
});

var app = (0, _express2.default)();

// handle session midleware
app.use((0, _session.useSession)());

// use compression
app.use((0, _compression2.default)());

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.use('/', _index2.default);
app.use('/auth', _authRouter2.default);
app.use('/app', _appRouter2.default);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

exports.default = (0, _letsencrypt2.default)(app);