/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shop = require('../../models/shop');

var _shop2 = _interopRequireDefault(_shop);

var _token = require('../../models/token');

var _token2 = _interopRequireDefault(_token);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ImpersonateService = require('../ImpersonateService');

var _ImpersonateService2 = _interopRequireDefault(_ImpersonateService);

var _helpers = require('../../utils/helpers');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:AuthController');

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var AuthService = function (_BaseShopifyService) {
	_inherits(AuthService, _BaseShopifyService);

	function AuthService(shop, access_token, nonce) {
		_classCallCheck(this, AuthService);

		return _possibleConstructorReturn(this, (AuthService.__proto__ || Object.getPrototypeOf(AuthService)).call(this, shop, access_token, nonce));
	}

	// build auth URL


	_createClass(AuthService, [{
		key: 'getAuthURL',
		value: function getAuthURL(req) {
			this.redirectURI = req.protocol + '://' + req.get('host') + '/auth/complete';

			var session = req.session;
			session.nonce = this.nonce;

			// return auth URL
			return this.APIInterface.buildAuthURL();
		}

		// check if signature is valid
		// agregate multiple errors

	}, {
		key: 'isValidSignature',
		value: function isValidSignature(req, hardCheck) {
			var _this2 = this;

			var x_shopify_auth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			return new _bluebird2.default(function (resolve, reject) {

				var errorHelper = new _helpers.ErrorHelper();

				var signature = !_lodash2.default.isNil(x_shopify_auth) ? x_shopify_auth : req.query;

				if (!_this2.APIInterface.is_valid_signature(signature, true)) {
					errorHelper.addError(403, '1', 'Invalid signature on complete');
				}

				// also check against session nonce
				if (hardCheck) {
					if (req.query.state != req.session.nonce) {
						errorHelper.addError(403, '2', 'Invalid signature on complete');
					}
				}

				if (errorHelper.hasErrors()) {
					reject(errorHelper.getErrorsObject());
				} else {
					resolve(true);
				}
			});
		}

		// exchange temporary token with a permanent one

	}, {
		key: 'exchangeTemporaryToken',
		value: function exchangeTemporaryToken(req) {
			var _this3 = this;

			debug('exchange token ...');
			return new _bluebird2.default(function (resolve, reject) {
				_this3.APIInterface.exchange_temporary_token(req.query, function (err, data) {

					var errorHelper = new _helpers.ErrorHelper();
					if (err) {
						errorHelper.addError(500, '1', 'exchangeTemporaryToken - something went wrong');
					}

					if (!_this3.APIInterface.is_valid_signature(req.query)) {
						errorHelper.addError(403, '2', 'exchangeTemporaryToken - Invalid signature');
					}

					if (_lodash2.default.isUndefined(data) || _lodash2.default.isUndefined(data.access_token)) {
						errorHelper.addError(498, '3', 'exchangeTemporaryToken - Invalid token');
					}

					if (errorHelper.hasErrors()) {
						reject(errorHelper.getErrorsObject());
					} else {
						_this3.accessToken = data.access_token;
						resolve(data.access_token);
					}
				});
			});
		}

		// retrieve and save shop data

	}, {
		key: 'retriveAndCreateShop',
		value: function retriveAndCreateShop() {
			var _this4 = this;

			debug('get shop data ...');
			return new _bluebird2.default(function (resolve, reject) {
				_this4.APIInterface.get('/admin/shop.json', function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					if (!data.shop) {
						return reject(new Error('Invalid shop data'));
					}
					// data.shop.access_token = this.accessToken;

					// set up default internationalization
					if (_config.MAP_SHOP_PRIMARY_LOCALE) {
						var primary_locale = (0, _undefsafe2.default)(data, 'shop.primary_locale');
						var locale = _lodash2.default.intersection([primary_locale], _config.AVAILABLE_LANGS);
						if (locale.length === 0) {
							data.shop.lang = _config.AVAILABLE_LANGS[0];
						} else {
							data.shop.lang = locale[0];
						}
					}

					var shop = new _shop2.default(data.shop);
					shop.save(function (err, shopData) {
						if (err) {
							return reject(err);
						}
						var token = new _token2.default({
							shop_id: shopData._id,
							shop_access_token: _this4.accessToken,
							impersonate_token: _ImpersonateService2.default.generateAccessToken(shopData.myshopify_domain)
						});
						token.save().then(function (tokenData) {
							resolve(shopData);
						}).catch(reject);
					});
				});
			});
		}

		// create storefront access token 

	}, {
		key: 'createStorefrontAccessToken',
		value: function createStorefrontAccessToken() {
			var _this5 = this;

			debug('RETRIVE STOREFRON ACCES TOKEN');
			return new Promise(function (resolve, reject) {
				var post_data = {
					'storefront_access_token': {
						'title': 'List products token'
					}
				};

				_this5.APIInterface.post('/admin/storefront_access_tokens.json', post_data, function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}

		// register uninstall hook

	}, {
		key: 'registerUninstallHook',
		value: function registerUninstallHook(req) {
			var _this6 = this;

			var shop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


			return new _bluebird2.default(function (resolve, reject) {

				// prevent register webhook
				if (_config.APP_HOST === 'localhost' || _config.APP_HOST === '127.0.0.1') {
					return resolve(shop);
				}

				var post_data = {
					'webhook': {
						'topic': 'app/uninstalled',
						'address': req.protocol + '://' + req.get('host') + '/auth/uninstall/' + shop._id,
						'format': 'json'
					}
				};

				_this6.APIInterface.post('/admin/webhooks.json', post_data, function (err, webhookData, headers) {
					if (err) {
						return reject(err);
					}
					resolve(shop);
				});
			});
		}

		// product change webhook : products/create, products/delete, products/update

	}, {
		key: 'registerProductChangeHook',
		value: function registerProductChangeHook(req) {
			var _this7 = this;

			var shop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var topic = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'products/create';


			debug('REGISTER PRODUCT HOOK: > ' + topic);
			return new _bluebird2.default(function (resolve, reject) {

				// prevent register webhook
				if (_config.APP_HOST === 'localhost' || _config.APP_HOST === '127.0.0.1') {
					return resolve(shop);
				}
				var post_data = {
					'webhook': {
						'topic': topic,
						'address': req.protocol + '://' + req.get('host') + '/auth/product-change/' + shop._id + '/' + shop.myshopify_domain,
						'format': 'json'
					}
				};
				_this7.APIInterface.post('/admin/webhooks.json', post_data, function (err, webhookData, headers) {
					if (err) {
						return reject(err);
					}
					resolve(shop);
				});
			});
		}

		// dynamically build service

	}], [{
		key: 'buildService',
		value: function buildService(shop, access_token, nonce) {
			return new AuthService(shop, access_token, nonce);
		}
	}]);

	return AuthService;
}(_base2.default);

exports.default = AuthService;