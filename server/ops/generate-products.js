/* jshint node: true */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shopService = require('../services/shopify/shop-service');

var _shopService2 = _interopRequireDefault(_shopService);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (process.env.NODE_ENV !== 'ops') {
	console.log('You should be in ops mode');
	process.exit(1);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var ProductGenerator = function () {
	function ProductGenerator() {
		var _this = this;

		_classCallCheck(this, ProductGenerator);

		console.log('START ');
		this.maxProductsToGenerate = 2000;
		this.currentIndex = 0;
		this.productsReferences = [];
		this.prices = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
		this.demoImages = [];

		this.service = new _shopService2.default('elastik-search-demo.myshopify.com', 'fa370c53be2a4b877db4df798d0247ee', '59e2263a1921d50e873ed0b7');

		// this.readAllImages()
		// .then(() => {
		// 	console.log('AICI');
		// 	return this.readFileFromPath(this.demoImages[0]);
		// })
		// .then((base64) => {
		// 	console.log('FILE RED', base64);
		// })
		// .catch(err => {
		// 	console.log(err);
		// })
		// console.log('STOP');

		this.readAllImages().then(function () {
			// this.base64Data = base64Data;
			_this.getNextImage();
		}).catch(function (err) {
			console.log(err);
		});
	}

	_createClass(ProductGenerator, [{
		key: 'getNextImage',
		value: function getNextImage() {
			var _this2 = this;

			var imagePath = this.demoImages[getRandomInt(0, this.demoImages.length - 1)];
			this.readFileFromPath(imagePath).then(function (base64Data) {
				_this2.base64Data = base64Data;
				_this2.postProduct();
			}).catch(function (err) {
				console.log(err);
			});
		}
	}, {
		key: 'postProduct',
		value: function postProduct() {
			var _this3 = this;

			var price = this.prices[getRandomInt(0, 9)] || 550;
			console.log('PRICE', price);
			// if (this.currentIndex > this.maxProductsToGenerate / 3) {
			// 	price = 650;
			// }
			// if (this.currentIndex > this.maxProductsToGenerate / 2) {
			// 	price = 900;
			// }		
			var post_data = {
				product: {
					title: _faker2.default.commerce.productName(),
					body_html: "<p>" + _faker2.default.lorem.sentence() + "<\/p>",
					vendor: "Burton",
					product_type: "",
					tags: _faker2.default.commerce.product() + ', ' + _faker2.default.commerce.product(),
					price: price,
					images: [{
						attachment: this.base64Data
					}],
					"variants": [{
						"option1": "First - " + _faker2.default.commerce.productName(),
						"price": price,
						"sku": "123",
						compare_at_price: price + 90
					}, {
						"option1": "Second - " + _faker2.default.commerce.productName(),
						"price": price + 10,
						"sku": "123"
					}]
				}
			};
			setTimeout(function () {
				_this3.service.createProduct(post_data).then(function (productData) {
					console.log('PRODUCT CREATED >>>>>> ' + _this3.currentIndex);

					_this3.productsReferences.push({
						product_id: productData.product.id
					});

					if (_this3.currentIndex < _this3.maxProductsToGenerate) {
						_this3.currentIndex++;
						_this3.getNextImage();
					} else {
						_this3.assignToCollections();
					}
				}).catch(function (err) {
					console.log('ERROR ', err);
				});
			}, 550);
		}
	}, {
		key: 'assignToCollections',
		value: function assignToCollections() {
			// frontpage 2815983644
			// Test collection 5648810012
			console.log('ASSIGN TO COLELCTIONS', 'ALL DONE');
			return;
			var half = Math.round(this.productsReferences.length / 2);
			var first = this.productsReferences.slice(0, half);
			var second = this.productsReferences.slice(half, this.productsReferences.length);

			console.log('FIRST ARRAY', first);

			this.service.updateCollectionProducts(5648810012, first).then(function () {
				console.log('DONE');
			}).catch(function (err) {
				console.log('ERR ', err);
			});
		}
	}, {
		key: 'readAllImages',
		value: function readAllImages() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				(0, _glob2.default)('./dummy-files/**/*', function (err, result) {
					if (!err) {
						_this4.demoImages = result;
					};
					resolve();
				});
			});
		}
	}, {
		key: 'readFileFromPath',
		value: function readFileFromPath(filePath) {
			console.log('File read OK');
			return new Promise(function (resolve, reject) {
				var p = _path2.default.join(__dirname, filePath);
				var data = _fs2.default.readFileSync(p);
				resolve(data.toString('base64'));
			});
		}
	}, {
		key: 'readFile',
		value: function readFile(filename) {
			console.log('File read OK');
			return new Promise(function (resolve, reject) {
				var p = _path2.default.join(__dirname, 'dummy-files', filename);
				var data = _fs2.default.readFileSync(p);
				resolve(data.toString('base64'));
			});
		}
	}]);

	return ProductGenerator;
}();

var pg = new ProductGenerator();

// console.log(faker.image.technics());