/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:ShopBaseService');
import BaseShopifyService from './base';

import _ from 'lodash';
import safe from 'undefsafe';

class ShopBaseService extends BaseShopifyService {

	constructor(shop, access_token) {
		super(shop, access_token);
	}

	// add script tag
	addScriptTag(src) {
		debug('ADD SCRIPT TAG >>>');
		return new Promise((resolve, reject) => {
			var post_data = {
				script_tag: {
					event: 'onload',
					src: src
				}
			};
			this.APIInterface.post('/admin/script_tags.json', post_data, (err, data, headers) => {
				if(err){
					return reject(err);
				}	
				let script_tag_id = safe(data, 'script_tag.id');
				resolve(script_tag_id);
			});
		});		
	}

	// remove existing script tag
	removeScriptTag(script_tag_id) {
		return new Promise((resolve, reject) => {
			this.APIInterface.delete('/admin/script_tags/' + script_tag_id + '.json', (err, data, headers) => {
				if(err){
					return reject(err);
				}
				resolve(script_tag_id);
			});
		});
	}

	// retrive the number of products
	getProductsCount() {
		return new Promise((resolve, reject) => {
			this.APIInterface.get('/admin/products/count.json', (err, data, headers) => {
				if(err){
					return reject(err);
				}
				debug('PRODUCT COUNT:', data.count);
				resolve(data.count);
			});			
		});
	}

	// retrive products
	getProductsWithFilter(page = 1, maxProductsChunk = 250, fieldsFilter = '') {
		return new Promise((resolve, reject) => {
			this.APIInterface.get(`/admin/products.json?limit=${maxProductsChunk}&page=${page}${fieldsFilter}`, (err, data, headers) => {
				if(err){
					return reject(err);
				}
				//debug(data);
				resolve(data);
			});			
		});		
	}

	// create a product
	createProduct(post_data) {
		return new Promise((resolve, reject) => {
			this.APIInterface.post('/admin/products.json', post_data, (err, data, headers) => {
				if(err){
					return reject(err);
				}
				resolve(data);
			});
		});		
	}

	// update collection products
	updateCollectionProducts(collectionId, collects = []) {
		return new Promise((resolve, reject) => {
			let post_data = {
				custom_collection: {
					id: collectionId,
					collects: collects
				}
			}
			this.APIInterface.put(`/admin/custom_collections/${collectionId}.json`, post_data, (err, data, headers) => {
				if(err){
					return reject(err);
				}
				resolve(data);
			});
		});	
	}

	getCustomCollections() {
		return new Promise((resolve, reject) => {
			this.APIInterface.get(`/admin/custom_collections.json`, (err, data, headers) => {
				if(err){
					return reject(err);
				}
				resolve(data);
			});
		});			
	}
}

export default ShopBaseService;
