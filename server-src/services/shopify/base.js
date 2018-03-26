/* jshint node: true */
'use strict';

import Utils from '../../utils';
import ShopifyAPI from 'shopify-node-api';
import { API_CONFIG } from '../../config';

import { IsValidShop } from '../validators';

import Token from '../../models/token';
import Shop from '../../models/shop';
import _ from 'lodash';

let _shopifyAPIConfig = Symbol();

class BaseShopifyService {

	constructor(shop, access_token, nonce) {
		if (!IsValidShop(shop)) {
			throw new Error('shop param missing');
		}

		this.shopifyAPIConfig = {
			shopify_api_key: API_CONFIG.shopify_api_key,
			shopify_shared_secret: API_CONFIG.shopify_shared_secret,
			shopify_scope: API_CONFIG.shopify_scope,
		}

		this.shopifyAPIConfig.shop = shop;
		this.shopifyAPIConfig.verbose = false;

		this.myShopifyDomain = shop;

		if (nonce) {
			this.shopifyAPIConfig.nonce = nonce;
		} else {
			this.shopifyAPIConfig.nonce = Utils.uid();
		}

		if (access_token) {
			this.shopifyAPIConfig.access_token = access_token;
		}
		this.shopifyBridge = new ShopifyAPI(this.shopifyAPIConfig);
	}

	getShop() {
		return new Promise((resolve, reject) => {
			Shop.findOne({ myshopify_domain: this.myShopifyDomain })
			.then(shop => {
				if (_.isNull(shop)) {
					return reject({ message: 'could not find the shop' });
				} else {
					this.shop = shop;
					resolve(shop);
				}
			})
		});
	}

	getAccessToken() {
		if (_.isNil(this.shopInstance)) {
			return Promise.reject({ message: 'getAccessToken requires shop populated' });
		}
		return new Promise((resolve, reject) => {
			Token.findOne({ shop_id: this.shop._id })
			.then(token => {
				if (_.isNull(token)) {
					return reject({ message: 'could not find the token' });
				} else {
					this.accessToken = token.shop_access_token;
					resolve(token.shop_access_token);
				}
			})
			.catch(reject);
		});
	}

	// set access token
	set accessToken(token) {
		this.shopifyAPIConfig.access_token = token;
		return this;
	}

	// get access token
	get accessToken() {
		return this.shopifyAPIConfig.access_token || '';
	}

	// set redirect URI
	set redirectURI(url) {
		this.shopifyAPIConfig.redirect_uri = url;
	}

	// get redirect URI
	get redirectURI() {
		return this.shopifyAPIConfig.redirect_uri;
	}

	// get api config
	get apiConfig() {
		return this.shopifyAPIConfig;
	}

	// get nounce
	get nonce() {
		return this.shopifyAPIConfig.nonce;
	}

	// API interface
	get APIInterface() {
		// if (!this.shopifyBridge) {
		// 	this.shopifyBridge = new ShopifyAPI(this.shopifyAPIConfig);
		// }
		// return this.shopifyBridge;
		return new ShopifyAPI(this.shopifyAPIConfig);
	}

	set shop(s) {
		this.shopInstance = s;
	}

	get shop() {
		return this.shopInstance;
	}	

	// get validator
	static getValidator() {
		// return ServiceValidator;
	}

	static buildService() {
		
	}
}

export default BaseShopifyService;
