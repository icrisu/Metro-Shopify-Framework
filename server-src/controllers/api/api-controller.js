/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:ApiController');
import _ from 'lodash';
import safe from 'undefsafe';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import moment from 'moment';
import AssetsService from '../../services/assets';
import AWSService from '../../services/aws/aws';
import ShopBaseService from '../../services/shopify/base-shop-service';

class ApiController {

	// first time data called from Auth controller
	// set default data
	static handleFirstTimeData(shopId, myshopify_domain, shop_access_token) {
		// override here
		ApiController.placeResourcesToAWS(shopId);
		// place script tag
		let assetService = new AssetsService(shopId);
		const shopService = new ShopBaseService(myshopify_domain, shop_access_token, shopId);
		return shopService.addScriptTag(assetService.getMainJSUrl())
		.then(script_tag_id => {
			return {
				script_tag_id
			}
		})
		.catch(err => {
			console.log('Err', err);
		});
		return Promise.resolve();
	}

	// place main JS and CSS file to AWS
	static placeResourcesToAWS(shopId) {
		debug('Place resources to AWS')
		let awsService = new AWSService();
		let assetService = new AssetsService(shopId);
		return assetService.createMainJS()
		.then(() => {
			return assetService.createMainCSS();
		})
		.then(() => {
			return awsService.processAssets(assetService)
		})
		.catch(err => {
			debug('Err', err);
		});		
	}


}

export default ApiController;
