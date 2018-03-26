/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _slack = require('./slack');

var _shop = require('../../models/shop');

var _shop2 = _interopRequireDefault(_shop);

var _billing = require('../../config/billing');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:NotificationsService');

var NotificationsService = function () {
	function NotificationsService() {
		_classCallCheck(this, NotificationsService);
	}

	_createClass(NotificationsService, null, [{
		key: 'sendSlackNotification',


		// send slack install notification
		value: function sendSlackNotification(shop) {
			var typeInstall = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			try {
				var slk = new _slack.SlackBroadcastManager();
				_shop2.default.count().then(function (count) {
					var message = typeInstall ? 'New shop install' : 'Shop unistall';
					message = _config.INTERNAL_APP_NAME + ' : ' + message;
					slk.setEvent(_slack.SLACK_EVENTS.NEW_SHOP_INSTALL).broadcast(message + ': ' + shop.myshopify_domain + ' -> Current installs: ' + count + ' -> Price: $' + (0, _billing.getBillingPostData)().recurring_application_charge.price + '/m').catch(function (err) {
						debug('SLACK ERR' + err);
					});
				});
			} catch (err) {
				debug('SLACK ERR 2 ' + err);
			}
		}
	}]);

	return NotificationsService;
}();

exports.default = NotificationsService;