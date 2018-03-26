/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shop = require('../models/shop');

var _shop2 = _interopRequireDefault(_shop);

var _token = require('../models/token');

var _token2 = _interopRequireDefault(_token);

var _GalleryModel = require('../models/GalleryModel');

var _GalleryModel2 = _interopRequireDefault(_GalleryModel);

var _notifications = require('./notifications/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _aws = require('./aws/aws');

var _aws2 = _interopRequireDefault(_aws);

var _assets = require('./assets');

var _assets2 = _interopRequireDefault(_assets);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _GalleryController = require('../controllers/api/GalleryController');

var _GalleryController2 = _interopRequireDefault(_GalleryController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:SweepService');

var ObjectId = _mongoose2.default.Types.ObjectId;

var SweepService = function () {
	function SweepService() {
		_classCallCheck(this, SweepService);
	}

	_createClass(SweepService, null, [{
		key: 'removeShop',
		value: function removeShop(shopId, _id) {
			var assetService = new _assets2.default(_id);
			debug('SWEEP NOW');
			_GalleryController2.default.getAllByKey(_id).then(function (allGaleries) {
				if (_lodash2.default.isArray(allGaleries)) {
					for (var i = 0; i < allGaleries.length; i++) {
						assetService.placeEmtyAsset(assetService.getEmptyDataAsset(allGaleries[i].galleryId));
					}
				}
				assetService.placeEmtyAsset(assetService.getStaticFileEmptyAWSObject('js'));
				assetService.placeEmtyAsset(assetService.getStaticFileEmptyAWSObject('css'));
				var awsService = new _aws2.default();
				return awsService.removeAllAssets(assetService.getAssets()).then(function () {
					debug('ALL AWS DELETED');
					_shop2.default.findOne({ id: shopId }).then(function (shop) {
						if (!_lodash2.default.isNull(shop)) {
							_notifications2.default.sendSlackNotification(shop, false);
						}
						return _shop2.default.remove({
							_id: _id
						});
					}).then(function () {
						return _GalleryModel2.default.remove({
							shopId: _id
						});
					}).then(function () {
						return _token2.default.remove({
							shop_id: _id
						});
					});
				});
			}).catch(function (err) {
				debug(err);
			});
		}
	}]);

	return SweepService;
}();

exports.default = SweepService;