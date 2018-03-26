/* jshint node: true */
'use strict';

export const APP_HOST = process.env.STAGING === 'yes' ? 'blocks-dev.eblocks.co' : '127.0.0.1';

export const LETS_ENCRYPT = {
	email: 'crisu.ionel@gmail.com',
	approvedDomains: [APP_HOST]

	// Database config
};export const DB_CONFIG = {
	dbName: 'blocks_dev',
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