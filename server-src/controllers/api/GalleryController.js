'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:GalleryController');
import _ from 'lodash';
import safe from 'undefsafe';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import BaseController from './BaseController';
import GalleryModel from '../../models/GalleryModel';
import AssetsService from '../../services/assets';
import AWSService from '../../services/aws/aws';

class GalleryController extends BaseController {
	// get all galleries
	static getGalleries(req, res, next) {
		GalleryModel.find({
			shopId: req.shop._id
		})
		.sort({createdAt: 'desc'})
		.select({ _id: 1, name: 1, type: 1 })
		.then(r => {
			return res.status(200).json(BaseController.responseHelper(r, BaseController.selfApiPath(req)));            
		})
		.catch(err => {
            return res.status(503).json(
                BaseController.errorHelper([
                    BaseController.buildError(err.message)
                ])                
            );
		});
	}

	// get specific gallery
	static getGallery(req, res, next) {
		GalleryModel.findOne({
			_id: req.params.id,
			shopId: req.shop._id
		})
		.then(r => {
			return res.status(200).json(BaseController.responseHelper(r, BaseController.selfApiPath(req)));            
		})
		.catch(err => {
            return res.status(503).json(
                BaseController.errorHelper([
                    BaseController.buildError(err.message)
                ])                
            );
		});
	}

	// create gallery
	static createGallery(req, res, next) {
		let m = new GalleryModel({
			shopId: req.shop._id,
			myshopify_domain: req.shop.myshopify_domain,
			name: req.body.name,
			type: req.body.type
		});
		GalleryModel.count()
		.then(count => {
			if (_.isNumber(count) && count >= 500) {
				return Promise.reject({message: 'You have reached maximum number of galleries'});
			}
			return m.save();
		})
		.then(r => {
			return res.status(200).json(BaseController.responseHelper(r, BaseController.selfApiPath(req)));            
		})
		.catch(err => {
            return res.status(503).json(
                BaseController.errorHelper([
                    BaseController.buildError(err.message)
                ])                
            );
		});
	}

	// update gallery
	static updateGallery(req, res, next) {
		GalleryModel.findOneAndUpdate({
			_id: req.params.id,
			shopId: req.shop._id
		}, req.body, {
			new: true
		})
		.lean(true)
		.then(r => {
			let awsService = new AWSService();
			let assetService = new AssetsService(req.shop._id);
			return assetService.addContentFile(r, r.galleryId)
			.then(() => {
				return assetService.createMainJS();
			})
			.then(() => {
				return assetService.createMainCSS();
			})			
			// return assetService.createMainJS()
			// return assetService.createMainCSS()			
			.then(() => {
				return awsService.processAssets(assetService)
			})			
			.then(() => {
				return r;
			});
		})
		.then(r => {
			return res.status(200).json(BaseController.responseHelper(r, BaseController.selfApiPath(req)));
		})
		.catch(err => {
			console.log('ERR', err);
            return res.status(503).json(
                BaseController.errorHelper([
                    BaseController.buildError(err.message)
                ])                
            );
		});
	}

	// delete gallery
	static deleteGallery(req, res, next) {
		GalleryModel.findOneAndRemove({
			_id: req.params.id,
			shopId: req.shop._id
		})
		.then(r => {
			let awsService = new AWSService();
			let assetService = new AssetsService(req.shop._id);
			return awsService.removeAllAssets([
				assetService.getEmptyDataAsset(r.galleryId)
			])
			.then(() => {
				return r;
			});
		})
		.then(r => {
			return res.status(200).json(BaseController.responseHelper(r, BaseController.selfApiPath(req)));
		})
		.catch(err => {
            return res.status(503).json(
                BaseController.errorHelper([
                    BaseController.buildError(err.message)
                ])                
            );
		});
	}

	static getAllByKey(shopId) {
		return GalleryModel.find({
			shopId
		})
		.select({ galleryId: 1 })	
	}

	// clone gallery
	static cloneGallery(req, res, next) {

		GalleryModel.findOne({
			_id: req.params.id,
			shopId: req.shop._id
		})
		.lean(true)
		.then(r => {
			if (!_.isNil(r)) {
				delete r._id;
				delete r.createdAt;
				r.name = req.body.name;
				let m = new GalleryModel(r);
				GalleryModel.count()
				.then(count => {
					if (_.isNumber(count) && count >= 500) {
						return Promise.reject({message: 'You have reached maximum number of galleries'});
					}
					return m.save();
				})				
			} else {
				return Promise.reject({ message: 'Something went wrong' });
			}
		})
		.then(() => {
			return res.status(200).json(BaseController.responseHelper({}, BaseController.selfApiPath(req)));
		})
		.catch(err => {
            return res.status(503).json(
                BaseController.errorHelper([
                    BaseController.buildError(err.message)
                ])                
            );
		});		
	}
	
	static removeAll(shopId) {
		// return GalleryController.getAllByKey(shopId)
		// .then(galleries => {
		// 	let ids = galleries.map(o => {
		// 		return o.galleryId;
		// 	});
		// 	debug('IDS', ids)
		// 	let awsService = new AWSService();
		// 	let assetService = new AssetsService(shopId);
		// 	debug(assetService.getEmptyAssets(ids))
		// 	awsService.removeAllAssets(assetService.getEmptyAssets(ids))
		// 	return;
		// })		
	}
	
}

export default GalleryController;