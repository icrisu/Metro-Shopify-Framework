/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _appController = require('../controllers/app-controller');

var _appController2 = _interopRequireDefault(_appController);

var _authController = require('../controllers/auth-controller');

var _authController2 = _interopRequireDefault(_authController);

var _apiRouter = require('./api-router');

var _apiRouter2 = _interopRequireDefault(_apiRouter);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/impersonate', function (req, res, next) {
	res.render('app/impersonate');
});

router.get('/', function (req, res, next) {
	if (!_lodash2.default.isNil(req.query.x_imp)) {
		req.headers.x_imp = req.query.x_imp;
	}
	console.log('AICI ', req.query.x_imp);
	next();
});

// verify signature
router.use(_appController2.default.validateSignature);

// get shop data
router.use(_appController2.default.useShop);

// validate billing
router.use(_authController2.default.validateBilling);

router.get('/', _appController2.default.index);

// api
router.use('/api', _apiRouter2.default);

exports.default = router;