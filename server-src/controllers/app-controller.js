/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:AppController');
import _ from 'lodash';
import url from 'url';
import safe from 'undefsafe';

import Shop from '../models/shop';
import Token from '../models/token';
import AuthService from '../services/shopify/auth';
import { RedirectHelper } from '../utils/helpers';
import AppModel from '../models/app';
import queryString from 'query-string';
import ImpersonateService from '../services/ImpersonateService';

class AppController {

	// we do not use session because 
	// on how Safari handles session withn iFrames
	static validateSignature(req, res, next) {

		if (!_.isNil(safe(req, 'headers.x_imp'))) {
			return AppController.impersonate(req, req.headers.x_imp, next)
		}

		let signature = {};
		if (!_.isNil(safe(req, 'query.shop'))) {
			signature = req.query;
		} else if (!_.isNil(safe(req, 'headers.x_shopify_auth'))) {
			signature = queryString.parse(req.headers.x_shopify_auth);
		}

		if (!_.isEmpty(signature)) {
			return AppController.validateWithSignature(req, signature, next);
		}

		next(new Error('Can not loggin or register - Invalid signature 1'));
	}

	static validateWithSignature(req, signature, next) {
		let authService = AuthService.buildService(signature.shop);
		authService.isValidSignature(req, false, signature).then(() => {
			next();
		}).catch(err => {
			next(new Error('You have already installed the application, you can access it from within your Shopify\'s Admin > Apps.'));
		});
	}

	static impersonate(req, impersonateToken, next) {
		const decoded = ImpersonateService.isValidToken(impersonateToken);
		if (decoded && !_.isNil(safe(decoded, 'myshopify_domain'))) {
			req.stopRedirect = true;
			req.query.shop = decoded.myshopify_domain;
			next();
		} else {
			next(new Error('Invalid signature'));
		}
	}

	// preserve shop data within request
	static useShop(req, res, next) {
		let shopDomain = req.query.shop;
		if (_.isNil(shopDomain) && !_.isNil(safe(req, 'headers.x_shopify_auth'))) {
			shopDomain = queryString.parse(req.headers.x_shopify_auth).shop;
		}

		Shop.findOne({ myshopify_domain: shopDomain })
		.then(shop => {
			if (_.isNull(shop)) {
				next(new Error('Could not find the store'));
			} else {
				req.shop = shop;
				return shop;
			}
		})
		.then(shop => {
			return Token.findOne({ shop_id: shop._id })
			.then((token) => {
				req.shop_access_token = token.shop_access_token;
				next();
			})
		})
		.catch(err => {
			next(new Error('An error has occured while searching for shop'));
		});
	}

	static index(req, res, next) {
		res.render('app/index', AppModel.createFromData(req.shop, (req.stopRedirect === true) ? 'true' : 'false'));
	}

}

export default AppController;