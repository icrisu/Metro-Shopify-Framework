/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _baseShopService = require('./base-shop-service');

var _baseShopService2 = _interopRequireDefault(_baseShopService);

var _shopData = require('../../models/shop-data');

var _shopData2 = _interopRequireDefault(_shopData);

var _apiController = require('../../controllers/api/api-controller');

var _apiController2 = _interopRequireDefault(_apiController);

var _config = require('../../config');

var _TaskRuner = require('../product/TaskRuner');

var _TaskRuner2 = _interopRequireDefault(_TaskRuner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:ShopService');

var ObjectId = _mongoose2.default.Types.ObjectId;

var ShopService = function (_ShopBaseService) {
	_inherits(ShopService, _ShopBaseService);

	function ShopService(shop, access_token, shopId) {
		_classCallCheck(this, ShopService);

		var _this = _possibleConstructorReturn(this, (ShopService.__proto__ || Object.getPrototypeOf(ShopService)).call(this, shop, access_token));

		if (!_mongoose2.default.Types.ObjectId.isValid(shopId)) {
			shopId = new ObjectId(String(shopId));
		}
		_this.shopId = shopId;
		_this.stop = false;
		_this.page = 1;
		_this.timeout;
		_this.interval = 4000;
		_this.maxProductsChunk = 250; // 250
		_this.fetchedProducts = [];
		_this.myShopifyDomain = shop;
		_this.currentProductsCount = 0;
		_this.processId = (0, _v2.default)();
		return _this;
	}

	_createClass(ShopService, [{
		key: 'fetchAll',
		value: function fetchAll() {
			var _this2 = this;

			var isTaskRunner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			this.isTaskRunner = isTaskRunner;
			try {
				clearTimeout(this.timeout);
			} catch (e) {}
			if (isTaskRunner) {
				this.resetProductsData().then(function () {
					_this2.fetchProductsChunk().catch(function (err) {
						_this2.sendKillSignal();
					});
				}).catch(function (err) {
					_this2.sendKillSignal();
				});
			} else {
				this.fetchProductsChunk().catch(function (err) {
					_this2.sendKillSignal();
				});
			}

			return;
			debug('FETCH PRODUCTS ...');
		}
	}, {
		key: 'fetchProductsChunk',
		value: function fetchProductsChunk() {
			var _this3 = this;

			return this.getProductsByPage().then(function (productsData) {
				if (_this3.stop === true) {
					debug('STOPPING PROCESS >>>>>> ', _this3.processId);
					return;
				}
				// if products empty - stop
				if (_lodash2.default.isArray((0, _undefsafe2.default)(productsData, 'products')) && (0, _undefsafe2.default)(productsData, 'products').length === 0) {
					debug('ALL PRODUCTS DONE!');
					// update DB 
					// trigger AWS update
					_this3.indexComplete().then(function () {
						_apiController2.default.placeResourcesToAWS(_this3.shopId, _this3.accessToken);
						_this3.sendKillSignal();
					});
					return;
				}

				// cannot exceed max products
				if (_this3.currentProductsCount > _config.MAX_PRODUCTS_ON_SHOP) {
					debug('MAX PRODUCTS EXCEDDED');
					_this3.indexComplete().then(function () {
						_apiController2.default.placeResourcesToAWS(_this3.shopId, _this3.accessToken);
						_this3.sendKillSignal();
					});
					return;
				}

				// add products to DB
				debug('GOT: products shop: ' + _this3.myShopifyDomain + ' shopId: ' + _this3.shopId, _this3.currentProductsCount);
				debug('GOT: products: ' + productsData.products.length + ' , page: ' + _this3.page);
				_this3.updateProducts(productsData.products).then(function () {
					// get shop products count here 
					if (!_this3.stop === true) {
						_this3.page++;
						_this3.timeout = setTimeout(function () {
							_this3.fetchProductsChunk();
						}, _this3.interval);
					} else {
						try {
							clearTimeout(_this3.timeout);
						} catch (e) {
							_this3.sendKillSignal();
						}
					}
				});
			});
		}
	}, {
		key: 'indexComplete',
		value: function indexComplete() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_shopData2.default.findOneAndUpdate({
					shopId: _this4.shopId
				}, {
					$set: {
						'products.isIndexing': false,
						'products.lastIndexTime': Date.now(),
						'products.indexHash': (0, _v2.default)() }
				}).then(function (data) {
					// debug('INDEX COMPLETE', data);
					resolve();
				}).catch(function (err) {
					debug('ERR ', err);
					_this4.sendKillSignal();
				});
			});
		}

		// update products

	}, {
		key: 'updateProducts',
		value: function updateProducts() {
			var _this5 = this;

			var newProducts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			newProducts = this.processProducts(newProducts);
			this.currentProductsCount += newProducts.length;
			return new Promise(function (resolve, reject) {
				_shopData2.default.findOneAndUpdate({
					shopId: _this5.shopId
				}, _defineProperty({
					$set: { 'products.isIndexing': true },
					$push: { 'products.products': { $each: newProducts } }
				}, '$set', { 'products.indexedProducts': _this5.currentProductsCount
					// $inc: { 'products.indexedProducts': newProducts.length }
				})).then(function () {
					resolve();
				}).catch(function (err) {
					debug('ERR ', err);
					_this5.sendKillSignal();
				});
			});
		}
	}, {
		key: 'processProducts',
		value: function processProducts(newProducts) {
			return newProducts.map(function (product) {
				//debug('INFO', product.id, product.price, product);
				// min price
				var minPrice = '';
				var isOnSale = 0;
				if (_lodash2.default.isArray(product.variants)) {
					minPrice = _lodash2.default.minBy(product.variants, function (o) {
						return o.price;
					});
					minPrice = minPrice.price;
					product.variants.map(function (variant) {
						if (!_lodash2.default.isNil(variant.compare_at_price) && variant.compare_at_price > variant.price) {
							isOnSale = 1;
						}
					});
				}

				var productImage = '';
				if (_lodash2.default.isArray(product.images) && product.images.length > 0) {
					productImage = product.images[0].src;
				}

				return {
					id: String(product.id),
					t: product.title,
					tg: product.tags,
					p: minPrice,
					i: productImage,
					h: product.handle,
					s: isOnSale
				};
			});
		}

		// reset products in shop data

	}, {
		key: 'resetProductsData',
		value: function resetProductsData() {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				_this6.getProductsCount().then(function (count) {
					debug('PRODUCTS COUNT HERE >>>> ', count);
					_shopData2.default.findOneAndUpdate({
						shopId: _this6.shopId
					}, {
						'products.isIndexing': true,
						'products.productsCount': count,
						'products.indexedProducts': 0,
						'products.products': []
					}).then(function () {
						resolve();
					});
				}).catch(reject);
			});
		}

		// kill process

	}, {
		key: 'sendKillSignal',
		value: function sendKillSignal() {
			if (!this.isTaskRunner) {
				return;
			}
			try {
				_TaskRuner2.default.killTask(this.myShopifyDomain);
			} catch (e) {}
		}
	}, {
		key: 'getProductsByPage',
		value: function getProductsByPage() {
			var fieldsFilter = '&fields=title,id,tags,images,handle,variants';
			// const fieldsFilter = '';
			return this.getProductsWithFilter(this.page, this.maxProductsChunk, fieldsFilter);
		}
	}, {
		key: 'hangUp',
		value: function hangUp() {
			debug('SET STOP ');
			this.stop = true;
		}
	}]);

	return ShopService;
}(_baseShopService2.default);

exports.default = ShopService;