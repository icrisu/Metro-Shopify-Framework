/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('../config');

var _billing = require('../config/billing');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppModel = function () {
	function AppModel(data) {
		_classCallCheck(this, AppModel);

		if (!_lodash2.default.isNull(data)) {
			for (var property in data) {
				if (data.hasOwnProperty(property)) {
					this[property] = data[property];
				}
			}
		}
	}

	_createClass(AppModel, null, [{
		key: 'createFromData',
		value: function createFromData(shop, stopRedirect) {
			var billingPostData = (0, _billing.getBillingPostData)('myShopifyDomain');
			return new AppModel({
				apiKey: _config.API_KEY,
				shopOrigin: 'https://' + shop.myshopify_domain,
				app_host: 'https://' + _config.APP_HOST,
				lang: shop.lang,
				pricingScheme: shop.pricingScheme,
				stopRedirect: stopRedirect || 'false',
				trial_days: billingPostData.recurring_application_charge.trial_days
			});
		}
	}]);

	return AppModel;
}();

exports.default = AppModel;