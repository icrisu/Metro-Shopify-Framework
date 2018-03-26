/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _shopifyNodeApi = require('shopify-node-api');

var _shopifyNodeApi2 = _interopRequireDefault(_shopifyNodeApi);

var _config = require('../../config');

var _validators = require('../validators');

var _token = require('../../models/token');

var _token2 = _interopRequireDefault(_token);

var _shop = require('../../models/shop');

var _shop2 = _interopRequireDefault(_shop);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _shopifyAPIConfig = Symbol();

var BaseShopifyService = function () {
	function BaseShopifyService(shop, access_token, nonce) {
		_classCallCheck(this, BaseShopifyService);

		if (!(0, _validators.IsValidShop)(shop)) {
			throw new Error('shop param missing');
		}

		this.shopifyAPIConfig = {
			shopify_api_key: _config.API_CONFIG.shopify_api_key,
			shopify_shared_secret: _config.API_CONFIG.shopify_shared_secret,
			shopify_scope: _config.API_CONFIG.shopify_scope
		};

		this.shopifyAPIConfig.shop = shop;
		this.shopifyAPIConfig.verbose = false;

		this.myShopifyDomain = shop;

		if (nonce) {
			this.shopifyAPIConfig.nonce = nonce;
		} else {
			this.shopifyAPIConfig.nonce = _utils2.default.uid();
		}

		if (access_token) {
			this.shopifyAPIConfig.access_token = access_token;
		}
		this.shopifyBridge = new _shopifyNodeApi2.default(this.shopifyAPIConfig);
	}

	_createClass(BaseShopifyService, [{
		key: 'getShop',
		value: function getShop() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_shop2.default.findOne({ myshopify_domain: _this.myShopifyDomain }).then(function (shop) {
					if (_lodash2.default.isNull(shop)) {
						return reject({ message: 'could not find the shop' });
					} else {
						_this.shop = shop;
						resolve(shop);
					}
				});
			});
		}
	}, {
		key: 'getAccessToken',
		value: function getAccessToken() {
			var _this2 = this;

			if (_lodash2.default.isNil(this.shopInstance)) {
				return Promise.reject({ message: 'getAccessToken requires shop populated' });
			}
			return new Promise(function (resolve, reject) {
				_token2.default.findOne({ shop_id: _this2.shop._id }).then(function (token) {
					if (_lodash2.default.isNull(token)) {
						return reject({ message: 'could not find the token' });
					} else {
						_this2.accessToken = token.shop_access_token;
						resolve(token.shop_access_token);
					}
				}).catch(reject);
			});
		}

		// set access token

	}, {
		key: 'accessToken',
		set: function set(token) {
			this.shopifyAPIConfig.access_token = token;
			return this;
		}

		// get access token
		,
		get: function get() {
			return this.shopifyAPIConfig.access_token || '';
		}

		// set redirect URI

	}, {
		key: 'redirectURI',
		set: function set(url) {
			this.shopifyAPIConfig.redirect_uri = url;
		}

		// get redirect URI
		,
		get: function get() {
			return this.shopifyAPIConfig.redirect_uri;
		}

		// get api config

	}, {
		key: 'apiConfig',
		get: function get() {
			return this.shopifyAPIConfig;
		}

		// get nounce

	}, {
		key: 'nonce',
		get: function get() {
			return this.shopifyAPIConfig.nonce;
		}

		// API interface

	}, {
		key: 'APIInterface',
		get: function get() {
			// if (!this.shopifyBridge) {
			// 	this.shopifyBridge = new ShopifyAPI(this.shopifyAPIConfig);
			// }
			// return this.shopifyBridge;
			return new _shopifyNodeApi2.default(this.shopifyAPIConfig);
		}
	}, {
		key: 'shop',
		set: function set(s) {
			this.shopInstance = s;
		},
		get: function get() {
			return this.shopInstance;
		}

		// get validator

	}], [{
		key: 'getValidator',
		value: function getValidator() {
			// return ServiceValidator;
		}
	}, {
		key: 'buildService',
		value: function buildService() {}
	}]);

	return BaseShopifyService;
}();

exports.default = BaseShopifyService;