/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var env = process.env.NODE_ENV;
var _ = require('lodash');
var safe = require('undefsafe');
var Slack = require('slack-node');

var CONF_PRD = {
	NEW_SHOP_INSTALL: {
		webhook: 'https://hooks.slack.com/services/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',
		chanel: "#eblocks"
	}
};

var SLACK_EVENTS = exports.SLACK_EVENTS = {
	NEW_SHOP_INSTALL: 'NEW_SHOP_INSTALL'
};

var SlackBroadcastManager = exports.SlackBroadcastManager = function () {
	function SlackBroadcastManager() {
		_classCallCheck(this, SlackBroadcastManager);

		this.slack = new Slack();
		this.conf = CONF_PRD;
	}

	// set chanel


	_createClass(SlackBroadcastManager, [{
		key: 'setEvent',
		value: function setEvent(event) {
			if (_.isNil(event)) {
				throw new Error('Event is undefined');
			}
			var chanelData = this.conf[event];
			if (_.isNil(chanelData) || _.isNil(safe(chanelData, 'webhook'))) {
				throw new Error('chanelData is undefined');
			}
			this.setWebhook(chanelData.webhook);
			this.setChanel(chanelData.chanel);
			return this;
		}

		// set webhook

	}, {
		key: 'setWebhook',
		value: function setWebhook(webhook) {
			if (_.isNil(webhook)) {
				throw new Error('Webhook is undefined');
			}
			this.slack.setWebhook(webhook);
			return this;
		}
	}, {
		key: 'setChanel',
		value: function setChanel(chanel) {
			if (_.isNil(chanel)) {
				throw new Error('slack chanel is undefined');
			}
			this.chanel = chanel;
		}

		// set username

	}, {
		key: 'setUserName',
		value: function setUserName(userName) {
			this.userName = userName;
			return this;
		}

		// broadcast

	}, {
		key: 'broadcast',
		value: function broadcast(message) {
			var _this = this;

			if (_.isNil(this.chanel)) {
				return Promise.reject({ status: 'Chanel can not be empty' });
			}
			return new Promise(function (resolve, reject) {
				return _this.slack.webhook({
					channel: _this.chanel,
					username: _this.userName || 'Ionel Crisu',
					text: message
				}, function (err, response) {
					if (err) {
						return reject(err);
					}
					resolve(response);
				});
			});
		}

		// return available events

	}, {
		key: 'events',
		value: function events() {
			return SLACK_EVENTS;
		}
	}]);

	return SlackBroadcastManager;
}();

//export SlackBroadcastManager;