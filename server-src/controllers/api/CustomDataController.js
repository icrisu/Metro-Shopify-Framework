'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:CustomDataController');
import _ from 'lodash';
import safe from 'undefsafe';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import CustomDataModel from '../../models/CustomDataModel';
import BaseController from './BaseController';
import AssetsService from '../../services/assets';
import AWSService from '../../services/aws/aws';

class CustomDataController extends BaseController {

    static getData(req, res, next) {
		CustomDataModel.findOne({
			shopId: req.shop._id
        })
        .lean(true)
		.then(r => {
            if (_.isNil(r)) {
                r = {
                    customCss: ''
                }
            }
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

    static update(req, res, next) {
		CustomDataModel.findOneAndUpdate({
			shopId: req.shop._id
		}, req.body, { upsert: true, new: true })
        .lean(true)
		.then(r => {
			let awsService = new AWSService();
			let assetService = new AssetsService(req.shop._id);
			return assetService.createMainCSS(r.customCSS)			
			.then(() => {
				return awsService.processAssets(assetService)
			})			
			.then(() => {
				return r;
			});
		})        
		.then(r => {
            // debug('AAAA', r.customCSS)
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
}

export default CustomDataController;
