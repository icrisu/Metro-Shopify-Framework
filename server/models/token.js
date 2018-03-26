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

var TokenSchema = new Schema({
	shop_id: { type: ObjectId, required: true },
	shop_access_token: { type: String, required: false },
	impersonate_token: { type: String, required: false }
});

exports.default = _mongoose2.default.model(_config.DB_CONFIG.models.Token, TokenSchema);