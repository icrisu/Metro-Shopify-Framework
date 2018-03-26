/* jshint node: true */
'use strict';

import Shop from '../models/shop';
import Token from '../models/token';
import GalleryModel from '../models/GalleryModel';
import NotificationsService from './notifications/notifications';
import AWSService from './aws/aws';
import AssetsService from './assets';

import debugPck from 'debug';
const debug = debugPck('blocks:SweepService');
import _ from 'lodash';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

import GalleryController from '../controllers/api/GalleryController';

class SweepService {

	static removeShop(shopId, _id) {
		let assetService = new AssetsService(_id);
		debug('SWEEP NOW');
		GalleryController.getAllByKey(_id)
		.then(allGaleries => {
			if (_.isArray(allGaleries)) {
				for (let i = 0; i < allGaleries.length; i++) {
					assetService.placeEmtyAsset(assetService.getEmptyDataAsset(allGaleries[i].galleryId));
				}
			}
			assetService.placeEmtyAsset(assetService.getStaticFileEmptyAWSObject('js'));
			assetService.placeEmtyAsset(assetService.getStaticFileEmptyAWSObject('css'));
			const awsService = new AWSService();
			return awsService.removeAllAssets(assetService.getAssets())
			.then(() => {
				debug('ALL AWS DELETED');
				Shop.findOne({ id: shopId })
				.then(shop => {
					if (!_.isNull(shop)) {
						NotificationsService.sendSlackNotification(shop, false);
					}
					return Shop.remove({
						_id: _id
					})					
				})
				.then(() => {
					return GalleryModel.remove({
						shopId: _id
					})					
				})
				.then(() => {
					return Token.remove({
						shop_id: _id
					})
				})				
			});			
		})
		.catch(err => {
			debug(err);
		});
	}
}

export default SweepService;

