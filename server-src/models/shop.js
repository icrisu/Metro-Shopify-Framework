/* jshint node: true */
'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { DB_CONFIG } from '../config';

// shop schema
const ShopSchema = new Schema({
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
	charge_id: { type: Number},
	charge: { type: Boolean, default: false }
});

export default mongoose.model(DB_CONFIG.models.Shop, ShopSchema);