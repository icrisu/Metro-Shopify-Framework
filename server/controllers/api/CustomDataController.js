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

var _CustomDataModel = require('../../models/CustomDataModel');

var _CustomDataModel2 = _interopRequireDefault(_CustomDataModel);

var _BaseController2 = require('./BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _assets = require('../../services/assets');

var _assets2 = _interopRequireDefault(_assets);

var _aws = require('../../services/aws/aws');

var _aws2 = _interopRequireDefault(_aws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:CustomDataController');

var ObjectId = _mongoose2.default.Types.ObjectId;

var CustomDataController = function (_BaseController) {
				_inherits(CustomDataController, _BaseController);

				function CustomDataController() {
								_classCallCheck(this, CustomDataController);

								return _possibleConstructorReturn(this, (CustomDataController.__proto__ || Object.getPrototypeOf(CustomDataController)).apply(this, arguments));
				}

				_createClass(CustomDataController, null, [{
								key: 'getData',
								value: function getData(req, res, next) {
												_CustomDataModel2.default.findOne({
																shopId: req.shop._id
												}).lean(true).then(function (r) {
																if (_lodash2.default.isNil(r)) {
																				r = {
																								customCss: ''
																				};
																}
																return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
												}).catch(function (err) {
																return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
												});
								}
				}, {
								key: 'update',
								value: function update(req, res, next) {
												_CustomDataModel2.default.findOneAndUpdate({
																shopId: req.shop._id
												}, req.body, { upsert: true, new: true }).lean(true).then(function (r) {
																var awsService = new _aws2.default();
																var assetService = new _assets2.default(req.shop._id);
																return assetService.createMainCSS(r.customCSS).then(function () {
																				return awsService.processAssets(assetService);
																}).then(function () {
																				return r;
																});
												}).then(function (r) {
																// debug('AAAA', r.customCSS)
																return res.status(200).json(_BaseController3.default.responseHelper(r, _BaseController3.default.selfApiPath(req)));
												}).catch(function (err) {
																console.log('ERR', err);
																return res.status(503).json(_BaseController3.default.errorHelper([_BaseController3.default.buildError(err.message)]));
												});
								}
				}]);

				return CustomDataController;
}(_BaseController3.default);

exports.default = CustomDataController;