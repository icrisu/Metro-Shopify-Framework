/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _billing = require('../../config/billing');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('blocks:AuthController');

var ChargeService = function (_BaseShopifyService) {
	_inherits(ChargeService, _BaseShopifyService);

	function ChargeService(myShopifyDomain, access_token, nonce) {
		_classCallCheck(this, ChargeService);

		return _possibleConstructorReturn(this, (ChargeService.__proto__ || Object.getPrototypeOf(ChargeService)).call(this, myShopifyDomain, access_token, nonce));
	}

	// place recurring charge request


	_createClass(ChargeService, [{
		key: 'placeRecurringChargeRequest',
		value: function placeRecurringChargeRequest(req) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.getShop().then(function (shop) {
					return _this2.getAccessToken();
				}).then(function () {
					var postData = (0, _billing.getBillingPostData)(_this2.shop.myshopify_domain);
					postData.recurring_application_charge.return_url = req.protocol + '://' + req.get('host') + '/auth/payment/' + String(_this2.shop._id);

					_this2.APIInterface.post('/admin/recurring_application_charges.json', postData, function (err, data) {
						if (err) {
							reject(err);
							return;
						}

						_this2.shop.charge_data = data.recurring_application_charge;
						_this2.shop.charge_id = _this2.shop.charge_data.id;
						_this2.shop.save(function (err, data) {
							if (err) {
								return reject(err);
							}
							resolve(_this2.shop);
						});
					});
				});
			});
		}

		// get recurring charge

	}, {
		key: 'getRecurringCharge',
		value: function getRecurringCharge(chargeId) {
			var _this3 = this;

			debug('get recurring charge ...');
			return new Promise(function (resolve, reject) {
				_this3.APIInterface.get('/admin/recurring_application_charges/' + chargeId + '.json', function (err, data) {
					if (err) {
						return reject(err);
					}

					if (data.recurring_application_charge.status === 'accepted') {
						_this3.activateCharge(chargeId).then(function () {
							_this3.shop.charge = true;
							_this3.shop.save(function (err, data) {
								if (err) {
									return reject(err);
								}
								resolve(_this3.shop);
							});
						}).catch(function (err) {
							return reject(err);
						});
					} else {
						resolve(_this3.shop);
					}
				});
			});
		}
	}, {
		key: 'activateCharge',
		value: function activateCharge(chargeId) {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_this4.APIInterface.post('/admin/recurring_application_charges/' + chargeId + '/activate.json', {}, function (err, data) {
					if (err) {
						return reject(err);
					}
					resolve({});
				});
			});
		}
	}]);

	return ChargeService;
}(_base2.default);

exports.default = ChargeService;