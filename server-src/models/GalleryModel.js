/* jshint node: true */
'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
import shortid from 'shortid';

import { DB_CONFIG } from '../config';


const GallerySchema = new Schema({
	shopId: { type: ObjectId, required: true },
	myshopify_domain: { type: String },
	name: { type: String },
	type: { type: String, enum: ['simple', 'advanced'] },
	galleryId: { type: String, default: shortid.generate },
	sections: { type: Array, default: [] },
	createdAt: { type: Date, default: Date.now },
	gap: { type: Number, default: 1 },
	menuPosition: { type: String, default: 'right' },
	menuColor: { type: String, default: '#6B828E' },
	menuSelectedColor: { type: String, default: '#E88E0C' }
});

export default mongoose.model(DB_CONFIG.models.Gallery, GallerySchema);
