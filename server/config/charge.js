/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var IS_BILLABLE = exports.IS_BILLABLE = true;

var WHITELISTED_DOMAINS = exports.WHITELISTED_DOMAINS = [];

// Billing config
var BILLING = exports.BILLING = {
	planName: 'Standard plan',
	isBillable: false,
	whitelistedDomains: [// add whitelisted domains (will not apply billing for those)
	'eblocks-dev.myshopify.com', 'recentt-showcase.myshopify.com'],
	price: 3.0,
	trial_days: 10
};