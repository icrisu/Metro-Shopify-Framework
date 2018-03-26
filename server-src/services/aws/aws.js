/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:AwsService');
import _ from 'lodash';
import safe from 'undefsafe';

import AWSBaseService from './AWSBaseService';


class AWSService extends AWSBaseService {

	constructor() {
		super();
	}

	// remove and add new objects
	processAssets(storeAssetsServiceInstance) {
		this.storeAssetsServiceInstance = storeAssetsServiceInstance;
		if (this.storeAssetsServiceInstance.getAssets().length === 0) {
			return Promise.reject({message: 'no files to upload'});
		}		
		return this.removeExistingAsset()
		.then(() => {
			return this.uploadObjects();
		})
	}

	// upload objects
	uploadObjects() {
		let allPromises = [];
		const assets = this.storeAssetsServiceInstance.getAssets();
		debug('Prepare to upload assets to aws ', assets.length)
		for (let asset of assets) {
			allPromises.push(this.uploadObject(asset));
		}
		return Promise.all(allPromises)
		.then(() => {
			return this.storeAssetsServiceInstance;
		});
	}

	uploadObject(object) {
		return this.putObject(object)
		.then((data) => {
			object.url = data.url;
			debug('AWS DATA UPLOAD RESULT ', data);
		})
	}

	// used internaly
	removeExistingAsset() {
		return this.deleteMany(this.storeAssetsServiceInstance.getAssets());
	}

	removeAllAssets(assets) {
		return this.deleteMany(assets);
	}

}

export default AWSService;


