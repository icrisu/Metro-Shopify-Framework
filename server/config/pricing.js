/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PRICING_SCHEMES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var STARTER = exports.STARTER = 'STARTER';
var STARTUP = exports.STARTUP = 'STARTUP';
var PROFFESIONAL = exports.PROFFESIONAL = 'PROFFESIONAL';

var PRICING_SCHEMES = (_PRICING_SCHEMES = {}, _defineProperty(_PRICING_SCHEMES, STARTER, {
	slug: STARTER,
	price: 9,
	unit: '$',
	prettyTitle: 'Starter plan',
	smallDescription: 'Get access to the apps from Starter plan',
	extendedDescription: 'Some extended description'
}), _defineProperty(_PRICING_SCHEMES, STARTUP, {
	slug: STARTUP,
	price: 19,
	unit: '$',
	prettyTitle: 'Startup plan',
	smallDescription: 'Get access to all apps from Starter plan & Startup plan',
	extendedDescription: 'Some extended description'
}), _defineProperty(_PRICING_SCHEMES, PROFFESIONAL, {
	slug: PROFFESIONAL,
	price: 29,
	unit: '$',
	prettyTitle: 'Proffesional plan',
	smallDescription: 'Get access to all apps',
	extendedDescription: 'Some extended description'
}), _PRICING_SCHEMES);

exports.default = PRICING_SCHEMES;