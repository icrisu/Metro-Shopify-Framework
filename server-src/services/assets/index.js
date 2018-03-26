/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:AssetsService');
import _ from 'lodash';
import safe from 'undefsafe';
import fs from 'fs';
import path from 'path';
import lunr from 'lunr';

import ApiController from '../../controllers/api/api-controller';
import { CONTENT_TYPES } from '../../config/aws-config';
import { buildAWSObjectUrl, awsPublicBucketRoot } from '../aws/AWSBaseService';
import { VERSION } from '../../config';

export const PRE_KEY = 'metro';
import zlib from 'zlib';


class AssetsService {

	constructor(shopId) {
		this.baseKey = String(shopId);	
		this.shopId = shopId;
		this.assets = [];
	}

	_gzipContent(content = '') {
		return new Promise((resolve, reject) => {
			zlib.gzip(content, (error, result) => {
				if (error) {
					return reject();
				}
				return resolve(result);
			});
		});
	}

	// add content file 
	addContentFile(payload, payloadKey) {
		return new Promise((resolve, reject) => {
			let payloadSerializied = '';
			try {
				payloadSerializied = `${JSON.stringify(payload)}`;
			} catch (e) {
				debug(e);
			}

			this._gzipContent(payloadSerializied)
			.then((gzipData) => {
				let data = {
					Key: `${PRE_KEY}-${this.baseKey}-${payloadKey}.json`,
					body: gzipData,
					contentType: CONTENT_TYPES.json,
					contentEncoding: 'gzip'
				};
				this.assets.push(data);
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})	
		});
	}

	// create main JS file
	createMainJS() {
		debug('Create main js file');
		return new Promise((resolve, reject) => {
			AssetsService.readFile('main.js')
			.then((fileData) => {
const preContent = `
var PRE_KEY = "${PRE_KEY}"; var SHOP_BASE_KEY = "${this.baseKey}"; var CDN_MAIN = "${awsPublicBucketRoot()}";
`
				return this._gzipContent(`${preContent}${fileData.contents}`)
				.then((gzipData) => {
					this.mainJS = {
						Key: `${PRE_KEY}-${this.baseKey}.js`,
						body: gzipData,
						contentType: CONTENT_TYPES.javascript,
						contentEncoding: 'gzip'
					};
					this.assets.push(this.mainJS);
					resolve(this.mainJS);
				});
			})
			.catch(reject);
		});		
	}

	// create main CSS file
	createMainCSS(customCSS = '') {
		debug('Create main css file');
		return new Promise((resolve, reject) => {
			AssetsService.readFile('main.css')
			.then((fileData) => {
				return this._gzipContent(`${fileData.contents}${customCSS}`)
				.then((gzipData) => {
					this.mainCSS = {
						Key: `${PRE_KEY}-${this.baseKey}.css`,
						body: gzipData,
						contentType: CONTENT_TYPES.css,
						contentEncoding: 'gzip'
					};
					this.assets.push(this.mainCSS);
					resolve(this.mainCSS);
				});
			})
			.catch(reject);
		});	
	}

	// retrive all assets / empty
	getEmptyAssets(contentFileIds = []) {
		let contentFilesKeys = [];
		contentFilesKeys = contentFileIds.map(id => {
			return { Key: `${PRE_KEY}-${this.baseKey}-${id}.json` };
		});
		return [
			{ Key: `${PRE_KEY}-${this.baseKey}.js` }, { Key: `${PRE_KEY}-${this.baseKey}.css` }, ...contentFilesKeys
		]
	}

	getEmptyDataAsset(id = '') {
		return { Key: `${PRE_KEY}-${this.baseKey}-${id}.json` };
	}

	// retrive assets
	getAssets() {
		return this.assets;
	}

	// read file
	static readFile(filename) {
		return new Promise((resolve, reject) => {
			const p = path.join(__dirname, '..', '..', 'public/storefront-static', filename);
			fs.readFile(p, 'utf8', (err, data) => {
				if (err) {
					return reject({
						contents: ''
					});
				}
				resolve({
					contents: data
				})
			});			
		});		
	}

	getMainJSUrl() {
		return buildAWSObjectUrl(`${PRE_KEY}-${this.baseKey}.js`);
	}

	getMainCSSUrl() {
		return buildAWSObjectUrl(`${PRE_KEY}-${this.baseKey}.css`);
	}

	getStaticFileEmptyAWSObject(type = 'js') {
		return {
			Key: `${PRE_KEY}-${this.baseKey}.${type}`
		}
	}
	
	placeEmtyAsset(asset) {
		this.assets.push(asset);
	}
}

export default AssetsService;


