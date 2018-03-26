/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var APP_HOST = exports.APP_HOST = process.env.STAGING === 'yes' ? 'blocks-dev.eblocks.co' : '127.0.0.1';

var LETS_ENCRYPT = exports.LETS_ENCRYPT = {
	email: 'crisu.ionel@gmail.com',
	approvedDomains: [APP_HOST]

	// Database config
};var DB_CONFIG = exports.DB_CONFIG = {
	dbName: 'blocks_dev',
	models: {
		Shop: 'Shop',
		Token: 'Token',
		Gallery: 'Gallery',
		CustomData: 'CustomData'

		// API config
	} };
var API_KEY = exports.API_KEY = '56558126e978013e1951dd123774b0a0';
var SHARED_SECRET = exports.SHARED_SECRET = '6f33886d499e6f096c0bcdc3c21b9675';