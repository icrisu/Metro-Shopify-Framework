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

var _BaseController2 = require('./BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _GalleryModel = require('../../models/GalleryModel');

var _GalleryModel2 = _interopRequireDefault(_GalleryModel);

var _assets = require('../../services/assets');

var _assets2 = _interopRequireDefault(_assets);

var _aws = require('../../services/aws/aws');

var _aws2 = _interopRequireDefault(_aws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:GalleryController');

var ObjectId = _mongoose2.default.Types.ObjectId;

var GalleryController = function (_BaseController) {
	_inherits(GalleryController, _BaseController);

	function GalleryController() {
		_classCallCheck(this, GalleryController);

		return _possibleConstructorReturn(this, (GalleryController.__proto__ || Object.getPrototypeOf(GalleryController)).apply(this, arguments));
	}

	_createClass(GalleryController, null, [{
		key: 'getGalleries',

		// get all galleries
		value: function getGalleries(req, res, next) {
			_GalleryModel2.default.find({
				shopId: req.shop._id
			}).sort({ createdAt: 'desc' }).select({ _id: 1, name: 1, type: 1 }).then(function (r) {
				return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
			}).catch(function (err) {
				return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
			});
		}

		// get specific gallery

	}, {
		key: 'getGallery',
		value: function getGallery(req, res, next) {
			_GalleryModel2.default.findOne({
				_id: req.params.id,
				shopId: req.shop._id
			}).then(function (r) {
				return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
			}).catch(function (err) {
				return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
			});
		}

		// create gallery

	}, {
		key: 'createGallery',
		value: function createGallery(req, res, next) {
			var m = new _GalleryModel2.default({
				shopId: req.shop._id,
				myshopify_domain: req.shop.myshopify_domain,
				name: req.body.name,
				type: req.body.type
			});
			_GalleryModel2.default.count().then(function (count) {
				if (_lodash2.default.isNumber(count) && count >= 500) {
					return Promise.reject({ message: 'You have reached maximum number of galleries' });
				}
				return m.save();
			}).then(function (r) {
				return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
			}).catch(function (err) {
				return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
			});
		}

		// update gallery

	}, {
		key: 'updateGallery',
		value: function updateGallery(req, res, next) {
			_GalleryModel2.default.findOneAndUpdate({
				_id: req.params.id,
				shopId: req.shop._id
			}, req.body, {
				new: true
			}).lean(true).then(function (r) {
				var awsService = new _aws2.default();
				var assetService = new _assets2.default(req.shop._id);
				return assetService.addContentFile(r, r.galleryId).then(function () {
					return assetService.createMainJS();
				}).then(function () {
					return assetService.createMainCSS();
				})
				// return assetService.createMainJS()
				// return assetService.createMainCSS()			
				.then(function () {
					return awsService.processAssets(assetService);
				}).then(function () {
					return r;
				});
			}).then(function (r) {
				return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
			}).catch(function (err) {
				console.log('ERR', err);
				return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
			});
		}

		// delete gallery

	}, {
		key: 'deleteGallery',
		value: function deleteGallery(req, res, next) {
			_GalleryModel2.default.findOneAndRemove({
				_id: req.params.id,
				shopId: req.shop._id
			}).then(function (r) {
				var awsService = new _aws2.default();
				var assetService = new _assets2.default(req.shop._id);
				return awsService.removeAllAssets([assetService.getEmptyDataAsset(r.galleryId)]).then(function () {
					return r;
				});
			}).then(function (r) {
				return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
			}).catch(function (err) {
				return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
			});
		}
	}, {
		key: 'getAllByKey',
		value: function getAllByKey(shopId) {
			return _GalleryModel2.default.find({
				shopId: shopId
			}).select({ galleryId: 1 });
		}

		// clone gallery

	}, {
		key: 'cloneGallery',
		value: function cloneGallery(req, res, next) {

			_GalleryModel2.default.findOne({
				_id: req.params.id,
				shopId: req.shop._id
			}).lean(true).then(function (r) {
				if (!_lodash2.default.isNil(r)) {
					delete r._id;
					delete r.createdAt;
					r.name = req.body.name;
					var m = new _GalleryModel2.default(r);
					_GalleryModel2.default.count().then(function (count) {
						if (_lodash2.default.isNumber(count) && count >= 500) {
							return Promise.reject({ message: 'You have reached maximum number of galleries' });
						}
						return m.save();
					});
				} else {
					return Promise.reject({ message: 'Something went wrong' });
				}
			}).then(function () {
				return res.status(200).json(_BaseController3.default.responseHelper({}, _BaseController3.default.selfApiPath(req)));
			}).catch(function (err) {
				return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
			});
		}
	}, {
		key: 'removeAll',
		value: function removeAll(shopId) {
			// return GalleryController.getAllByKey(shopId)
			// .then(galleries => {
			// 	let ids = galleries.map(o => {
			// 		return o.galleryId;
			// 	});
			// 	debug('IDS', ids)
			// 	let awsService = new AWSService();
			// 	let assetService = new AssetsService(shopId);
			// 	debug(assetService.getEmptyAssets(ids))
			// 	awsService.removeAllAssets(assetService.getEmptyAssets(ids))
			// 	return;
			// })		
		}
	}]);

	return GalleryController;
}(_BaseController3.default);

exports.default = GalleryController;