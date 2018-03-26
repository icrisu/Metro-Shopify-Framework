/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _pricing = require('./pricing');

var _pricing2 = _interopRequireDefault(_pricing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// pricing scheme test against OR || 
var APPS_CONFIG = [{
	title: 'Starter plan',
	smallDescription: 'Get started with apps below',
	pricingScheme: _pricing2.default[_pricing.STARTER],
	apps: [{
		title: 'My app 1',
		slug: 'popup-app',
		model: {},
		requiresPricingSchemes: [_pricing.STARTER, _pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 2',
		slug: 'popup-app2',
		model: {},
		requiresPricingSchemes: [_pricing.STARTER, _pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 3',
		slug: 'popup-app',
		model: {},
		requiresPricingSchemes: [_pricing.STARTER, _pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 4',
		slug: 'popup-app2',
		model: {},
		requiresPricingSchemes: [_pricing.STARTER, _pricing.STARTUP, _pricing.PROFFESIONAL]
	}]
}, {
	title: 'Startup plan',
	smallDescription: 'Get access to all apps from Starter plan & Startup plan',
	pricingScheme: _pricing2.default[_pricing.STARTUP],
	apps: [{
		title: 'My app 5',
		slug: 'popup-app3',
		model: {},
		requiresPricingSchemes: [_pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 6',
		slug: 'popup-app3',
		model: {},
		requiresPricingSchemes: [_pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 7',
		slug: 'popup-app3',
		model: {},
		requiresPricingSchemes: [_pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 8',
		slug: 'popup-app3',
		model: {},
		requiresPricingSchemes: [_pricing.STARTUP, _pricing.PROFFESIONAL]
	}, {
		title: 'My app 9',
		slug: 'popup-app3',
		model: {},
		requiresPricingSchemes: [_pricing.STARTUP, _pricing.PROFFESIONAL]
	}]
}, {
	title: 'Proffessional plan',
	smallDescription: 'Get access to all apps',
	pricingScheme: _pricing2.default[_pricing.PROFFESIONAL],
	apps: [{
		title: 'My app 10',
		slug: 'popup-app4',
		model: {},
		requiresPricingSchemes: [_pricing.PROFFESIONAL]
	}, {
		title: 'My app 11',
		slug: 'popup-app4',
		model: {},
		requiresPricingSchemes: [_pricing.PROFFESIONAL]
	}]
}];

exports.default = APPS_CONFIG;