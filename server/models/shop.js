/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

// shop schema
var ShopSchema = new Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	myshopify_domain: { type: String, required: true },
	domain: String,
	shop_owner: String,
	newsletter: { type: Boolean, default: true },
	lang: { type: String, default: 'en' },
	primary_locale: { type: String, default: 'en' },
	currency: { type: String }, // might be null or undefined
	money_format: { type: String, default: '$' }, // when currency is NOT specified
	money_with_currency_format: { type: String }, // $ USD - only when currency is specified
	plan_name: { type: String, default: '' },
	country_code: { type: String },
	pricingScheme: { type: String, default: 'NONE' },
	charge_data: { type: Object },
	charge_id: { type: Number },
	charge: { type: Boolean, default: false }
});

exports.default = _mongoose2.default.model(_config.DB_CONFIG.models.Shop, ShopSchema);