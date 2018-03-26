/* jshint node: true */
'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

import { DB_CONFIG } from '../config';


const TokenSchema = new Schema({
	shop_id: { type: ObjectId, required: true },	
	shop_access_token: { type: String, required: false },	
	impersonate_token: { type: String, required: false }
});

export default mongoose.model(DB_CONFIG.models.Token, TokenSchema);