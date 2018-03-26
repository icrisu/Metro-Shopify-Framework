/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _notifications = require('../services/notifications/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _sweep = require('../services/sweep');

var _sweep2 = _interopRequireDefault(_sweep);

var _shop = require('../models/shop');

var _shop2 = _interopRequireDefault(_shop);

var _app = require('../models/app');

var _app2 = _interopRequireDefault(_app);

var _auth = require('../services/shopify/auth');

var _auth2 = _interopRequireDefault(_auth);

var _ChargeService = require('../services/shopify/ChargeService');

var _ChargeService2 = _interopRequireDefault(_ChargeService);

var _helpers = require('../utils/helpers');

var _billing = require('../config/billing');

var _apiController = require('./api/api-controller');

var _apiController2 = _interopRequireDefault(_apiController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:AuthController');

var ObjectId = _mongoose2.default.Types.ObjectId;
// import Token from '../models/token';

var AuthController = function () {
	function AuthController() {
		_classCallCheck(this, AuthController);
	}

	_createClass(AuthController, null, [{
		key: 'index',


		//run authentication
		value: function index(req, res, next) {
			if (!req.query.shop) {
				return next(new Error('Could not process request, shop param is missing!'));
			}
			_shop2.default.findOne({ myshopify_domain: req.query.shop }).then(function (shop) {
				// debug(shop);
				if (_lodash2.default.isNull(shop)) {
					// sign up
					res.redirect(_auth2.default.buildService(req.query.shop).getAuthURL(req));
				} else {
					_helpers.RedirectHelper.redirectTo('/app', req, res);
				}
			}).catch(function (err) {
				// sign up
				res.redirect(_auth2.default.buildService(req.query.shop).getAuthURL(req));
			});
		}

		//run authentication complete

	}, {
		key: 'runComplete',
		value: function runComplete(req, res, next) {
			if (!req.query.shop) {
				return next(new Error('Could not process request, shop param is missing!'));
			}
			var authService = _auth2.default.buildService(req.query.shop, null, req.session.nonce);

			authService.isValidSignature(req, true).then(function () {
				return authService.exchangeTemporaryToken(req);
			}).then(function () {
				return authService.retriveAndCreateShop();
			}).then(function (shopData) {
				return _apiController2.default.handleFirstTimeData(shopData._id, shopData.myshopify_domain, authService.accessToken).then(function () {
					return authService.registerUninstallHook(req, shopData);
				});
			}).then(function (shopData) {
				if (_billing.IS_BILLABLE) {
					_helpers.RedirectHelper.redirectTo('/auth/charge-request', req, res);
				} else {
					_helpers.RedirectHelper.redirectTo('/app', req, res);
				}
			}).catch(function (err) {
				debug('ERRRRRR ', err);
				res.status(403).json(err);
			});
		}

		// check if recurring billing is activated

	}, {
		key: 'validateBilling',
		value: function validateBilling(req, res, next) {
			if (_billing.IS_BILLABLE && req.shop.charge !== true) {
				return res.render('payment', _app2.default.createFromData(req.shop, 'false'));
			}
			next();
		}

		// place charge request

	}, {
		key: 'placeChargeRequest',
		value: function placeChargeRequest(req, res, next) {
			debug('place charge request ...');

			var authService = _auth2.default.buildService(req.query.shop);

			authService.isValidSignature(req, false).then(function () {
				return _shop2.default.findOne({ myshopify_domain: req.query.shop });
			}).then(function (shop) {
				if (_lodash2.default.isNil(shop)) {
					return Promise.reject({ message: 'Shop does not exists' });
				} else {
					if (!shop.charge) {
						var chargeService = new _ChargeService2.default(shop.myshopify_domain);
						return chargeService.placeRecurringChargeRequest(req).then(function (shop) {
							res.redirect(shop.charge_data.confirmation_url);
						});
					} else {
						// redirect to app
						_helpers.RedirectHelper.redirectTo('/app', req, res);
					}
				}
			}).catch(function (err) {
				debug('ERR ', err);
				res.status(500).json(err);
			});
		}

		// handle recurring payment approval

	}, {
		key: 'payment',
		value: function payment(req, res, next) {
			debug('payment route ...', req.params.shop_id);

			if (_lodash2.default.isUndefined(req.query.charge_id) || _lodash2.default.isNil(req.params.shop_id)) {
				return res.status(500).send('Invalid charge id or shop id');
			}

			_shop2.default.findOne({ charge_id: req.query.charge_id, _id: new ObjectId(String(req.params.shop_id)) }).then(function (shop) {
				if (_lodash2.default.isNil(shop)) {
					return res.status(500).send('Could not find the shop');
				} else {
					if (!shop.charge) {
						var chargeService = new _ChargeService2.default(shop.myshopify_domain, null);
						chargeService.shop = shop;
						return chargeService.getAccessToken().then(function () {
							return chargeService.getRecurringCharge(req.query.charge_id);
						});
					} else {
						_notifications2.default.sendSlackNotification(shop);
						return shop;
					}
				}
			}).then(function (shop) {
				if (!shop.charge) {
					// redirect to payment
					res.render('payment', _app2.default.createFromData(shop, 'false'));
				} else {
					// iFrame Shopify SDK will handle the redirect
					res.render('app/index', _app2.default.createFromData(shop, 'false'));
				}
			}).catch(function (err) {
				res.status(500).json(err);
			});
		}

		// uninstall hook

	}, {
		key: 'uninstall',
		value: function uninstall(req, res, next) {
			debug('uninstall web hook ...', req.body.id, req.params.shop_id);

			try {
				_sweep2.default.removeShop(req.body.id, req.params.shop_id);
			} catch (e) {
				debug(e);
			}

			// send response immediately otherwhise shopify will keep posting to this route
			res.sendStatus(200);
		}
	}]);

	return AuthController;
}();

exports.default = AuthController;