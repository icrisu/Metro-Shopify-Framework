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
var ObjectId = Schema.Types.ObjectId;

var defaultOptions = {
	maxSearchResults: 20,
	currency: "$",
	currencyInFront: 'yes',
	showOnSale: true,
	useNativeField: true,
	nativeOffsetY: 0,
	productOpensSamePage: true,
	linkTarget: '_self',
	defaultColor: '#1FD68D',
	labelNotFound: 'No results found ...',
	labelSearchPlaceholder: 'Search ...',
	customCSSContent: '',
	showPrice: true
};

var ShopDataSchema = new Schema({
	shopId: { type: ObjectId, required: true },
	myshopify_domain: { type: String },
	searchOptions: { type: Object, default: defaultOptions },
	mainScriptTag: { type: Object },
	customCSS: { type: String, default: '' },
	settings: { type: Object, default: {} },
	awsFiles: { type: Array },
	products: { type: Object }
});

exports.default = _mongoose2.default.model(_config.DB_CONFIG.models.ShopData, ShopDataSchema);