/* jshint node: true */
'use strict';

import BaseShopifyService from './base';
import PromiseA from 'bluebird';
import debugPck from 'debug';
const debug = debugPck('blocks:AuthController');
import _ from 'lodash';
import Shop from '../../models/shop';
import Token from '../../models/token';
import safe from 'undefsafe';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import ImpersonateService from '../ImpersonateService';

import { ErrorHelper } from '../../utils/helpers';
import { AVAILABLE_LANGS, MAP_SHOP_PRIMARY_LOCALE, APP_HOST } from '../../config';

class AuthService extends BaseShopifyService {

	constructor(shop, access_token, nonce) {
		super(shop, access_token, nonce);
	}

	// build auth URL
	getAuthURL(req) {
		this.redirectURI = req.protocol + '://' + req.get('host') + '/auth/complete';

		let session = req.session;
		session.nonce = this.nonce;

		// return auth URL
		return this.APIInterface.buildAuthURL();
	}

	// check if signature is valid
	// agregate multiple errors
	isValidSignature(req, hardCheck, x_shopify_auth = null) {
		return new PromiseA((resolve, reject) => {

			let errorHelper = new ErrorHelper();

			let signature = !_.isNil(x_shopify_auth) ? x_shopify_auth : req.query;

			if (!this.APIInterface.is_valid_signature(signature, true)) {
				errorHelper.addError(403, '1', 'Invalid signature on complete');
			}

			// also check against session nonce
			if (hardCheck) {
				if (req.query.state != req.session.nonce) {
					errorHelper.addError(403, '2', 'Invalid signature on complete');
				}
			}

			if (errorHelper.hasErrors()) {
				reject(errorHelper.getErrorsObject());
			} else {
				resolve(true);
			}
		});
	}

	// exchange temporary token with a permanent one
	exchangeTemporaryToken(req) {
		debug('exchange token ...');
		return new PromiseA((resolve, reject) => {
			this.APIInterface.exchange_temporary_token(req.query, (err, data) => {

				let errorHelper = new ErrorHelper();
				if (err) {
					errorHelper.addError(500, '1', 'exchangeTemporaryToken - something went wrong');
				}

				if (!this.APIInterface.is_valid_signature(req.query)) {
					errorHelper.addError(403, '2', 'exchangeTemporaryToken - Invalid signature');
				}

				if (_.isUndefined(data) || _.isUndefined(data.access_token)) {
					errorHelper.addError(498, '3', 'exchangeTemporaryToken - Invalid token');
				}

				if (errorHelper.hasErrors()) {
					reject(errorHelper.getErrorsObject());
				} else {
					this.accessToken = data.access_token;
					resolve(data.access_token);
				}
			});
		});
	}

	// retrieve and save shop data
	retriveAndCreateShop() {
		debug('get shop data ...');
		return new PromiseA((resolve, reject) => {
			this.APIInterface.get('/admin/shop.json', (err, data, headers) => {
				if (err) {
					return reject(err);
				}
				if (!data.shop) {
					return reject(new Error('Invalid shop data'));
				}
				// data.shop.access_token = this.accessToken;

				// set up default internationalization
				if (MAP_SHOP_PRIMARY_LOCALE) {
					let primary_locale = safe(data, 'shop.primary_locale');
					let locale = _.intersection([primary_locale], AVAILABLE_LANGS);
					if (locale.length === 0) {
						data.shop.lang = AVAILABLE_LANGS[0];
					} else {
						data.shop.lang = locale[0];
					}
				}
				
				let shop = new Shop(data.shop);
				shop.save((err, shopData) => {
					if (err) {
						return reject(err);
					}
					let token = new Token({
						shop_id: shopData._id,
						shop_access_token: this.accessToken,
						impersonate_token: ImpersonateService.generateAccessToken(shopData.myshopify_domain)
					});
					token.save()
					.then(tokenData => {
						resolve(shopData);
					})
					.catch(reject);
				});
			});
		});
	}

	// create storefront access token 
	createStorefrontAccessToken() {
		debug('RETRIVE STOREFRON ACCES TOKEN');
		return new Promise((resolve, reject) => {
			let post_data = {
				'storefront_access_token': {
					'title': 'List products token'
				}
			};

			this.APIInterface.post('/admin/storefront_access_tokens.json', post_data, (err, data, headers) => {
				if (err) {
					return reject(err);
				}
				resolve(data);
			});			
		});
	}

	// register uninstall hook
	registerUninstallHook(req, shop = {}) {

		return new PromiseA((resolve, reject) => {

			// prevent register webhook
			if (APP_HOST === 'localhost' || APP_HOST === '127.0.0.1') {
				return resolve(shop);
			}

			let post_data = {
				'webhook': {
					'topic': 'app/uninstalled',
					'address': req.protocol + '://' + req.get('host') + '/auth/uninstall/' + shop._id,
					'format': 'json'
				}
			};

			this.APIInterface.post('/admin/webhooks.json', post_data, (err, webhookData, headers) => {
				if (err) {
					return reject(err);
				}
				resolve(shop);
			});
		});
	}

	// product change webhook : products/create, products/delete, products/update
	registerProductChangeHook(req, shop = {}, topic = 'products/create') {

		debug('REGISTER PRODUCT HOOK: > ' + topic);
		return new PromiseA((resolve, reject) => {

			// prevent register webhook
			if (APP_HOST === 'localhost' || APP_HOST === '127.0.0.1') {
				return resolve(shop);
			}
			let post_data = {
				'webhook': {
					'topic': topic,
					'address': req.protocol + '://' + req.get('host') + '/auth/product-change/' + shop._id + '/' + shop.myshopify_domain,
					'format': 'json'
				}
			};
			this.APIInterface.post('/admin/webhooks.json', post_data, (err, webhookData, headers) => {
				if (err) {
					return reject(err);
				}
				resolve(shop);
			});
		});
	}	

	// dynamically build service
	static buildService(shop, access_token, nonce) {
		return new AuthService(shop, access_token, nonce);
	}
}

export default AuthService;
