/* jshint node: true */
'use strict';

export const APP_HOST = 'metro.eblocks.co';

export const LETS_ENCRYPT = {
	email: 'crisu.ionel@gmail.com',
	approvedDomains: [APP_HOST]

	// Database config
};export const DB_CONFIG = {
	dbName: 'blocks_prod',
	models: {
		Shop: 'Shop',
		Token: 'Token',
		Gallery: 'Gallery',
		CustomData: 'CustomData'
	}

	// API config
};
export const API_KEY = 'SHOPIFY_API_KEY'; // paste u re api key
export const SHARED_SECRET = 'SHOPIFY_SHARED_SECRET'; // paste u're api secret