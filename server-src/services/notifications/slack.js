/* jshint node: true */
'use strict';

const env = process.env.NODE_ENV;
const _  = require('lodash');
const safe = require('undefsafe');
const Slack = require('slack-node');

const CONF_PRD = {
	NEW_SHOP_INSTALL: {
      webhook: 'SLACK_HOOK_URL',
      chanel: "#eblocks"      
    }
}

export const SLACK_EVENTS = {
	NEW_SHOP_INSTALL: 'NEW_SHOP_INSTALL'
}

export class SlackBroadcastManager {

	constructor() {		
		this.slack = new Slack();
		this.conf = CONF_PRD;
	}

	// set chanel
	setEvent(event) {
		if (_.isNil(event)) {
			throw new Error('Event is undefined');
		}
		let chanelData = this.conf[event];
		if (_.isNil(chanelData) || _.isNil(safe(chanelData, 'webhook'))) {
			throw new Error('chanelData is undefined');	
		}
		this.setWebhook(chanelData.webhook);	
		this.setChanel(chanelData.chanel);	
		return this;
	}

	// set webhook
	setWebhook(webhook) {
		if (_.isNil(webhook)) {
			throw new Error('Webhook is undefined');
		}
		this.slack.setWebhook(webhook);
		return this;
	}

	setChanel(chanel) {
		if (_.isNil(chanel)) {
			throw new Error('slack chanel is undefined');
		}		
		this.chanel = chanel;
	}

	// set username
	setUserName(userName) {
		this.userName = userName;
		return this;
	}

	// broadcast
	broadcast(message) {
		if (_.isNil(this.chanel)) {
			return Promise.reject({status: 'Chanel can not be empty'});
		}
		return new Promise((resolve, reject) => {
			return this.slack.webhook({
				channel: this.chanel,
				username: this.userName || 'Ionel Crisu',
				text: message
			}, (err, response) => {
				if (err) {
					return reject(err);
				}
				resolve(response);
			});
		});		
	}

	// return available events
	events() {
		return SLACK_EVENTS;
	}
}

//export SlackBroadcastManager;

