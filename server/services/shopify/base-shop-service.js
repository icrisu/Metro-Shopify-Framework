/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:ShopBaseService');

var ShopBaseService = function (_BaseShopifyService) {
	_inherits(ShopBaseService, _BaseShopifyService);

	function ShopBaseService(shop, access_token) {
		_classCallCheck(this, ShopBaseService);

		return _possibleConstructorReturn(this, (ShopBaseService.__proto__ || Object.getPrototypeOf(ShopBaseService)).call(this, shop, access_token));
	}

	// add script tag


	_createClass(ShopBaseService, [{
		key: 'addScriptTag',
		value: function addScriptTag(src) {
			var _this2 = this;

			debug('ADD SCRIPT TAG >>>');
			return new Promise(function (resolve, reject) {
				var post_data = {
					script_tag: {
						event: 'onload',
						src: src
					}
				};
				_this2.APIInterface.post('/admin/script_tags.json', post_data, function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					var script_tag_id = (0, _undefsafe2.default)(data, 'script_tag.id');
					resolve(script_tag_id);
				});
			});
		}

		// remove existing script tag

	}, {
		key: 'removeScriptTag',
		value: function removeScriptTag(script_tag_id) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3.APIInterface.delete('/admin/script_tags/' + script_tag_id + '.json', function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					resolve(script_tag_id);
				});
			});
		}

		// retrive the number of products

	}, {
		key: 'getProductsCount',
		value: function getProductsCount() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_this4.APIInterface.get('/admin/products/count.json', function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					debug('PRODUCT COUNT:', data.count);
					resolve(data.count);
				});
			});
		}

		// retrive products

	}, {
		key: 'getProductsWithFilter',
		value: function getProductsWithFilter() {
			var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			var _this5 = this;

			var maxProductsChunk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
			var fieldsFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

			return new Promise(function (resolve, reject) {
				_this5.APIInterface.get('/admin/products.json?limit=' + maxProductsChunk + '&page=' + page + fieldsFilter, function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					//debug(data);
					resolve(data);
				});
			});
		}

		// create a product

	}, {
		key: 'createProduct',
		value: function createProduct(post_data) {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				_this6.APIInterface.post('/admin/products.json', post_data, function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}

		// update collection products

	}, {
		key: 'updateCollectionProducts',
		value: function updateCollectionProducts(collectionId) {
			var _this7 = this;

			var collects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			return new Promise(function (resolve, reject) {
				var post_data = {
					custom_collection: {
						id: collectionId,
						collects: collects
					}
				};
				_this7.APIInterface.put('/admin/custom_collections/' + collectionId + '.json', post_data, function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}
	}, {
		key: 'getCustomCollections',
		value: function getCustomCollections() {
			var _this8 = this;

			return new Promise(function (resolve, reject) {
				_this8.APIInterface.get('/admin/custom_collections.json', function (err, data, headers) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}
	}]);

	return ShopBaseService;
}(_base2.default);

exports.default = ShopBaseService;