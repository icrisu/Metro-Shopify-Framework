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


var CustomDataSchema = new Schema({
	shopId: { type: ObjectId, required: true },
	customCss: { type: String, default: '' }
});

exports.default = _mongoose2.default.model(_config.DB_CONFIG.models.CustomData, CustomDataSchema);