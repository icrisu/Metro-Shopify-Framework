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

var _token = require('../../models/token');

var _token2 = _interopRequireDefault(_token);

var _shopData = require('../../models/shop-data');

var _shopData2 = _interopRequireDefault(_shopData);

var _shopService = require('../shopify/shop-service');

var _shopService2 = _interopRequireDefault(_shopService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:TaskRuner');

var ObjectId = _mongoose2.default.Types.ObjectId;

var MIN = 5;
var MAIN_DELAY = 1000 * 60 * MIN; // 6 min
var TASKS = {};

var TaskRuner = function () {
	function TaskRuner() {
		_classCallCheck(this, TaskRuner);
	}

	_createClass(TaskRuner, null, [{
		key: 'stopIfExisting',


		// stop if existing task
		value: function stopIfExisting(shopifyDomain) {
			if (TASKS[shopifyDomain]) {
				debug('REMOVE EXISTING TASK');
				if (TASKS[shopifyDomain].isWorking === true) {
					TASKS[shopifyDomain].isWorking = false;
					try {
						TASKS[shopifyDomain].service.hangUp();
					} catch (e) {
						debug('ERROR ', e);
					}
				}

				try {
					debug('Clear time');
					clearTimeout(TASKS[shopifyDomain].timeout);
				} catch (e) {
					debug(e);
				}
				TaskRuner.killTask(shopifyDomain);
			}
		}
	}, {
		key: 'addBackgroundTask',
		value: function addBackgroundTask(shopifyDomain, shopId) {
			var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAIN_DELAY;

			if (!_mongoose2.default.Types.ObjectId.isValid(shopId)) {
				shopId = new ObjectId(String(shopId));
			}

			TaskRuner.stopIfExisting(shopifyDomain);

			debug('ADDING NEW TASK');

			TASKS[shopifyDomain] = {
				shopId: shopId,
				isWorking: false,
				service: null
			};

			TASKS[shopifyDomain].timeout = setTimeout(function () {
				TaskRuner.executeTask(shopifyDomain);
			}, delay);
		}
	}, {
		key: 'executeTask',
		value: function executeTask(shopifyDomain) {
			if (TASKS[shopifyDomain]) {
				TASKS[shopifyDomain].isWorking = true;
			}
			TaskRuner.getShopAccessToken(TASKS[shopifyDomain].shopId).then(function (token) {
				debug('GOT TOKEN ', token);
				try {
					TASKS[shopifyDomain].service = new _shopService2.default(shopifyDomain, token, TASKS[shopifyDomain].shopId);
					TASKS[shopifyDomain].service.fetchAll(true);
				} catch (e) {
					TaskRuner.killTask(shopifyDomain);
				}
			}).catch(function (err) {
				debug('KILL TASK ON ERROR');
				debug(err);
				TaskRuner.killTask(shopifyDomain);
			});

			console.log('EXECUTE TASK on: ', shopifyDomain);
		}
	}, {
		key: 'killTask',
		value: function killTask(shopifyDomain) {
			debug('KILL TASK ', TASKS[shopifyDomain]);
			try {
				_lodash2.default.unset(TASKS, shopifyDomain);
			} catch (err) {}
			debug('KILL TASK:', shopifyDomain, TASKS);
		}
	}, {
		key: 'getShopAccessToken',
		value: function getShopAccessToken(shopId) {
			return _token2.default.findOne({ shop_id: shopId }).then(function (token) {
				return token.shop_access_token;
			});
		}
	}]);

	return TaskRuner;
}();

exports.default = TaskRuner;