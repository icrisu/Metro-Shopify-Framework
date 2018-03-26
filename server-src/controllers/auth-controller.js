/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:AuthController');
import _ from 'lodash';
import url from 'url';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import safe from 'undefsafe';
import NotificationsService from '../services/notifications/notifications';
import SweepService  from '../services/sweep';

import Shop from '../models/shop';
// import Token from '../models/token';
import AppModel from '../models/app';
import AuthService from '../services/shopify/auth';
import ChargeService from '../services/shopify/ChargeService';
import { RedirectHelper } from '../utils/helpers';
import { IS_BILLABLE } from '../config/billing';

import ApiController from './api/api-controller';

class AuthController {

	//run authentication
	static index(req, res, next) {
		if (!req.query.shop) {
			return next(new Error('Could not process request, shop param is missing!'));
		}
		Shop.findOne({ myshopify_domain: req.query.shop }).then(shop => {
			// debug(shop);
			if (_.isNull(shop)) {
				// sign up
				res.redirect(AuthService.buildService(req.query.shop).getAuthURL(req));
			} else {
				RedirectHelper.redirectTo('/app', req, res);
			}
		}).catch(err => {
			// sign up
			res.redirect(AuthService.buildService(req.query.shop).getAuthURL(req));
		});
	}

	//run authentication complete
	static runComplete(req, res, next) {
		if (!req.query.shop) {
			return next(new Error('Could not process request, shop param is missing!'));
		}
		let authService = AuthService.buildService(req.query.shop, null, req.session.nonce);

		authService.isValidSignature(req, true)
		.then(() => authService.exchangeTemporaryToken(req))
		.then(() => authService.retriveAndCreateShop())
		.then(shopData => {
			return ApiController.handleFirstTimeData(shopData._id, shopData.myshopify_domain, authService.accessToken)
			.then(() => {
				return authService.registerUninstallHook(req, shopData);
			});
		})
		.then((shopData) => {
			if (IS_BILLABLE) {
				RedirectHelper.redirectTo('/auth/charge-request', req, res);
			} else {
				RedirectHelper.redirectTo('/app', req, res);
			}
		})
		.catch(err => {
			debug('ERRRRRR ', err)
			res.status(403).json(err);
		});
	}

	// check if recurring billing is activated
	static validateBilling(req, res, next) {
		if (IS_BILLABLE && req.shop.charge !== true) {
			return res.render('payment', AppModel.createFromData(req.shop, 'false'));
		}
		next();
	}	

	// place charge request
	static placeChargeRequest(req, res, next) {
		debug('place charge request ...');

		var authService = AuthService.buildService(req.query.shop);

		authService.isValidSignature(req, false)
		.then(() => Shop.findOne({ myshopify_domain: req.query.shop }))
		.then((shop) => {
			if (_.isNil(shop)) {
				return Promise.reject({ message: 'Shop does not exists'});
			} else {
				if (!shop.charge) {
					const chargeService = new ChargeService(shop.myshopify_domain);
					return chargeService.placeRecurringChargeRequest(req)
					.then((shop) => {
						res.redirect(shop.charge_data.confirmation_url);
					});
				} else {
					// redirect to app
					RedirectHelper.redirectTo('/app', req, res);
				}
			}
		})
		.catch((err) => {
			debug('ERR ', err);
			res.status(500).json(err);
		});
	}	

	// handle recurring payment approval
	static payment(req, res, next) {
		debug('payment route ...', req.params.shop_id);

		if (_.isUndefined(req.query.charge_id) || _.isNil(req.params.shop_id)) {
			return res.status(500).send('Invalid charge id or shop id');
		}

		Shop.findOne({ charge_id: req.query.charge_id, _id: new ObjectId(String(req.params.shop_id)) })
		.then((shop) => {
			if (_.isNil(shop)) {
				return res.status(500).send('Could not find the shop');
			} else {	
				if (!shop.charge) {
					const chargeService = new ChargeService(shop.myshopify_domain, null);
					chargeService.shop = shop;
					return chargeService.getAccessToken()
					.then(() => chargeService.getRecurringCharge(req.query.charge_id))		
				} else {
					NotificationsService.sendSlackNotification(shop);
					return shop;
				}
			}
			
		})
		.then((shop) => {
			if (!shop.charge) {
				// redirect to payment
				res.render('payment', AppModel.createFromData(shop, 'false'));
			} else {
				// iFrame Shopify SDK will handle the redirect
				res.render('app/index', AppModel.createFromData(shop, 'false'));
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
	}	

	// uninstall hook
	static uninstall(req, res, next) {
		debug('uninstall web hook ...', req.body.id, req.params.shop_id);

		try {
			SweepService.removeShop(req.body.id, req.params.shop_id);
		} catch (e) {
			debug(e);
		}

		// send response immediately otherwhise shopify will keep posting to this route
		res.sendStatus(200);
	}

}

export default AuthController;