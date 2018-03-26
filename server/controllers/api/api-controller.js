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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _assets = require('../../services/assets');

var _assets2 = _interopRequireDefault(_assets);

var _aws = require('../../services/aws/aws');

var _aws2 = _interopRequireDefault(_aws);

var _baseShopService = require('../../services/shopify/base-shop-service');

var _baseShopService2 = _interopRequireDefault(_baseShopService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:ApiController');

var ObjectId = _mongoose2.default.Types.ObjectId;

var ApiController = function () {
	function ApiController() {
		_classCallCheck(this, ApiController);
	}

	_createClass(ApiController, null, [{
		key: 'handleFirstTimeData',


		// first time data called from Auth controller
		// set default data
		value: function handleFirstTimeData(shopId, myshopify_domain, shop_access_token) {
			// override here
			ApiController.placeResourcesToAWS(shopId);
			// place script tag
			var assetService = new _assets2.default(shopId);
			var shopService = new _baseShopService2.default(myshopify_domain, shop_access_token, shopId);
			return shopService.addScriptTag(assetService.getMainJSUrl()).then(function (script_tag_id) {
				return {
					script_tag_id: script_tag_id
				};
			}).catch(function (err) {
				console.log('Err', err);
			});
			return Promise.resolve();
		}

		// place main JS and CSS file to AWS

	}, {
		key: 'placeResourcesToAWS',
		value: function placeResourcesToAWS(shopId) {
			debug('Place resources to AWS');
			var awsService = new _aws2.default();
			var assetService = new _assets2.default(shopId);
			return assetService.createMainJS().then(function () {
				return assetService.createMainCSS();
			}).then(function () {
				return awsService.processAssets(assetService);
			}).catch(function (err) {
				debug('Err', err);
			});
		}
	}]);

	return ApiController;
}();

exports.default = ApiController;