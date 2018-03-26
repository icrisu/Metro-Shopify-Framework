/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.Types.ObjectId;


var GallerySchema = new Schema({
	shopId: { type: ObjectId, required: true },
	myshopify_domain: { type: String },
	name: { type: String },
	type: { type: String, enum: ['simple', 'advanced'] },
	galleryId: { type: String, default: _shortid2.default.generate },
	sections: { type: Array, default: [] },
	createdAt: { type: Date, default: Date.now },
	gap: { type: Number, default: 1 },
	menuPosition: { type: String, default: 'right' },
	menuColor: { type: String, default: '#6B828E' },
	menuSelectedColor: { type: String, default: '#E88E0C' }
});

exports.default = _mongoose2.default.model(_config.DB_CONFIG.models.Gallery, GallerySchema);