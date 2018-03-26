/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authController = require('../controllers/auth-controller');

var _authController2 = _interopRequireDefault(_authController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', _authController2.default.index);

router.get('/complete', _authController2.default.runComplete);

//place charge request
router.get('/charge-request', _authController2.default.placeChargeRequest);

//uninstall hook
router.post('/uninstall/:shop_id', _authController2.default.uninstall);

//verify payment gateway
router.get('/payment/:shop_id', _authController2.default.payment);

exports.default = router;