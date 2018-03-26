/* jshint node: true */
'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
import shortid from 'shortid';

import { DB_CONFIG } from '../config';


const CustomDataSchema = new Schema({
	shopId: { type: ObjectId, required: true },
	customCSS: { type: String, default: '' }
});

export default mongoose.model(DB_CONFIG.models.CustomData, CustomDataSchema);

