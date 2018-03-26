/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PRE_KEY = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

var _apiController = require('../../controllers/api/api-controller');

var _apiController2 = _interopRequireDefault(_apiController);

var _awsConfig = require('../../config/aws-config');

var _AWSBaseService = require('../aws/AWSBaseService');

var _config = require('../../config');

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:AssetsService');
var PRE_KEY = exports.PRE_KEY = 'metro';

var AssetsService = function () {
	function AssetsService(shopId) {
		_classCallCheck(this, AssetsService);

		this.baseKey = String(shopId);
		this.shopId = shopId;
		this.assets = [];
	}

	_createClass(AssetsService, [{
		key: '_gzipContent',
		value: function _gzipContent() {
			var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			return new Promise(function (resolve, reject) {
				_zlib2.default.gzip(content, function (error, result) {
					if (error) {
						return reject();
					}
					return resolve(result);
				});
			});
		}

		// add content file 

	}, {
		key: 'addContentFile',
		value: function addContentFile(payload, payloadKey) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				var payloadSerializied = '';
				try {
					payloadSerializied = '' + JSON.stringify(payload);
				} catch (e) {
					debug(e);
				}

				_this._gzipContent(payloadSerializied).then(function (gzipData) {
					var data = {
						Key: PRE_KEY + '-' + _this.baseKey + '-' + payloadKey + '.json',
						body: gzipData,
						contentType: _awsConfig.CONTENT_TYPES.json,
						contentEncoding: 'gzip'
					};
					_this.assets.push(data);
					resolve(data);
				}).catch(function (err) {
					reject(err);
				});
			});
		}

		// create main JS file

	}, {
		key: 'createMainJS',
		value: function createMainJS() {
			var _this2 = this;

			debug('Create main js file');
			return new Promise(function (resolve, reject) {
				AssetsService.readFile('main.js').then(function (fileData) {
					var preContent = '\nvar PRE_KEY = "' + PRE_KEY + '"; var SHOP_BASE_KEY = "' + _this2.baseKey + '"; var CDN_MAIN = "' + (0, _AWSBaseService.awsPublicBucketRoot)() + '";\n';
					return _this2._gzipContent('' + preContent + fileData.contents).then(function (gzipData) {
						_this2.mainJS = {
							Key: PRE_KEY + '-' + _this2.baseKey + '.js',
							body: gzipData,
							contentType: _awsConfig.CONTENT_TYPES.javascript,
							contentEncoding: 'gzip'
						};
						_this2.assets.push(_this2.mainJS);
						resolve(_this2.mainJS);
					});
				}).catch(reject);
			});
		}

		// create main CSS file

	}, {
		key: 'createMainCSS',
		value: function createMainCSS() {
			var _this3 = this;

			var customCSS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			debug('Create main css file');
			return new Promise(function (resolve, reject) {
				AssetsService.readFile('main.css').then(function (fileData) {
					return _this3._gzipContent('' + fileData.contents + customCSS).then(function (gzipData) {
						_this3.mainCSS = {
							Key: PRE_KEY + '-' + _this3.baseKey + '.css',
							body: gzipData,
							contentType: _awsConfig.CONTENT_TYPES.css,
							contentEncoding: 'gzip'
						};
						_this3.assets.push(_this3.mainCSS);
						resolve(_this3.mainCSS);
					});
				}).catch(reject);
			});
		}

		// retrive all assets / empty

	}, {
		key: 'getEmptyAssets',
		value: function getEmptyAssets() {
			var _this4 = this;

			var contentFileIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			var contentFilesKeys = [];
			contentFilesKeys = contentFileIds.map(function (id) {
				return { Key: PRE_KEY + '-' + _this4.baseKey + '-' + id + '.json' };
			});
			return [{ Key: PRE_KEY + '-' + this.baseKey + '.js' }, { Key: PRE_KEY + '-' + this.baseKey + '.css' }].concat(_toConsumableArray(contentFilesKeys));
		}
	}, {
		key: 'getEmptyDataAsset',
		value: function getEmptyDataAsset() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			return { Key: PRE_KEY + '-' + this.baseKey + '-' + id + '.json' };
		}

		// retrive assets

	}, {
		key: 'getAssets',
		value: function getAssets() {
			return this.assets;
		}

		// read file

	}, {
		key: 'getMainJSUrl',
		value: function getMainJSUrl() {
			return (0, _AWSBaseService.buildAWSObjectUrl)(PRE_KEY + '-' + this.baseKey + '.js');
		}
	}, {
		key: 'getMainCSSUrl',
		value: function getMainCSSUrl() {
			return (0, _AWSBaseService.buildAWSObjectUrl)(PRE_KEY + '-' + this.baseKey + '.css');
		}
	}, {
		key: 'getStaticFileEmptyAWSObject',
		value: function getStaticFileEmptyAWSObject() {
			var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'js';

			return {
				Key: PRE_KEY + '-' + this.baseKey + '.' + type
			};
		}
	}, {
		key: 'placeEmtyAsset',
		value: function placeEmtyAsset(asset) {
			this.assets.push(asset);
		}
	}], [{
		key: 'readFile',
		value: function readFile(filename) {
			return new Promise(function (resolve, reject) {
				var p = _path2.default.join(__dirname, '..', '..', 'public/storefront-static', filename);
				_fs2.default.readFile(p, 'utf8', function (err, data) {
					if (err) {
						return reject({
							contents: ''
						});
					}
					resolve({
						contents: data
					});
				});
			});
		}
	}]);

	return AssetsService;
}();

exports.default = AssetsService;