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

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _AWSBaseService2 = require('./AWSBaseService');

var _AWSBaseService3 = _interopRequireDefault(_AWSBaseService2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:AwsService');

var AWSService = function (_AWSBaseService) {
	_inherits(AWSService, _AWSBaseService);

	function AWSService() {
		_classCallCheck(this, AWSService);

		return _possibleConstructorReturn(this, (AWSService.__proto__ || Object.getPrototypeOf(AWSService)).call(this));
	}

	// remove and add new objects


	_createClass(AWSService, [{
		key: 'processAssets',
		value: function processAssets(storeAssetsServiceInstance) {
			var _this2 = this;

			this.storeAssetsServiceInstance = storeAssetsServiceInstance;
			if (this.storeAssetsServiceInstance.getAssets().length === 0) {
				return Promise.reject({ message: 'no files to upload' });
			}
			return this.removeExistingAsset().then(function () {
				return _this2.uploadObjects();
			});
		}

		// upload objects

	}, {
		key: 'uploadObjects',
		value: function uploadObjects() {
			var _this3 = this;

			var allPromises = [];
			var assets = this.storeAssetsServiceInstance.getAssets();
			debug('Prepare to upload assets to aws ', assets.length);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var asset = _step.value;

					allPromises.push(this.uploadObject(asset));
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return Promise.all(allPromises).then(function () {
				return _this3.storeAssetsServiceInstance;
			});
		}
	}, {
		key: 'uploadObject',
		value: function uploadObject(object) {
			return this.putObject(object).then(function (data) {
				object.url = data.url;
				debug('AWS DATA UPLOAD RESULT ', data);
			});
		}

		// used internaly

	}, {
		key: 'removeExistingAsset',
		value: function removeExistingAsset() {
			return this.deleteMany(this.storeAssetsServiceInstance.getAssets());
		}
	}, {
		key: 'removeAllAssets',
		value: function removeAllAssets(assets) {
			return this.deleteMany(assets);
		}
	}]);

	return AWSService;
}(_AWSBaseService3.default);

exports.default = AWSService;