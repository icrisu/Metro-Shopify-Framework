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

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _shop = require('../models/shop');

var _shop2 = _interopRequireDefault(_shop);

var _token = require('../models/token');

var _token2 = _interopRequireDefault(_token);

var _auth = require('../services/shopify/auth');

var _auth2 = _interopRequireDefault(_auth);

var _helpers = require('../utils/helpers');

var _app = require('../models/app');

var _app2 = _interopRequireDefault(_app);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _ImpersonateService = require('../services/ImpersonateService');

var _ImpersonateService2 = _interopRequireDefault(_ImpersonateService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:AppController');

var AppController = function () {
	function AppController() {
		_classCallCheck(this, AppController);
	}

	_createClass(AppController, null, [{
		key: 'validateSignature',


		// we do not use session because 
		// on how Safari handles session withn iFrames
		value: function validateSignature(req, res, next) {

			if (!_lodash2.default.isNil((0, _undefsafe2.default)(req, 'headers.x_imp'))) {
				return AppController.impersonate(req, req.headers.x_imp, next);
			}

			var signature = {};
			if (!_lodash2.default.isNil((0, _undefsafe2.default)(req, 'query.shop'))) {
				signature = req.query;
			} else if (!_lodash2.default.isNil((0, _undefsafe2.default)(req, 'headers.x_shopify_auth'))) {
				signature = _queryString2.default.parse(req.headers.x_shopify_auth);
			}

			if (!_lodash2.default.isEmpty(signature)) {
				return AppController.validateWithSignature(req, signature, next);
			}

			next(new Error('Can not loggin or register - Invalid signature 1'));
		}
	}, {
		key: 'validateWithSignature',
		value: function validateWithSignature(req, signature, next) {
			var authService = _auth2.default.buildService(signature.shop);
			authService.isValidSignature(req, false, signature).then(function () {
				next();
			}).catch(function (err) {
				next(new Error('You have already installed the application, you can access it from within your Shopify\'s Admin > Apps.'));
			});
		}
	}, {
		key: 'impersonate',
		value: function impersonate(req, impersonateToken, next) {
			var decoded = _ImpersonateService2.default.isValidToken(impersonateToken);
			if (decoded && !_lodash2.default.isNil((0, _undefsafe2.default)(decoded, 'myshopify_domain'))) {
				req.stopRedirect = true;
				req.query.shop = decoded.myshopify_domain;
				next();
			} else {
				next(new Error('Invalid signature'));
			}
		}

		// preserve shop data within request

	}, {
		key: 'useShop',
		value: function useShop(req, res, next) {
			var shopDomain = req.query.shop;
			if (_lodash2.default.isNil(shopDomain) && !_lodash2.default.isNil((0, _undefsafe2.default)(req, 'headers.x_shopify_auth'))) {
				shopDomain = _queryString2.default.parse(req.headers.x_shopify_auth).shop;
			}

			_shop2.default.findOne({ myshopify_domain: shopDomain }).then(function (shop) {
				if (_lodash2.default.isNull(shop)) {
					next(new Error('Could not find the store'));
				} else {
					req.shop = shop;
					return shop;
				}
			}).then(function (shop) {
				return _token2.default.findOne({ shop_id: shop._id }).then(function (token) {
					req.shop_access_token = token.shop_access_token;
					next();
				});
			}).catch(function (err) {
				next(new Error('An error has occured while searching for shop'));
			});
		}
	}, {
		key: 'index',
		value: function index(req, res, next) {
			res.render('app/index', _app2.default.createFromData(req.shop, req.stopRedirect === true ? 'true' : 'false'));
		}
	}]);

	return AppController;
}();

exports.default = AppController;