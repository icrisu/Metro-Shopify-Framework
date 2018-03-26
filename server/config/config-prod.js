/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var APP_HOST = exports.APP_HOST = 'metro.eblocks.co';

var LETS_ENCRYPT = exports.LETS_ENCRYPT = {
	email: 'crisu.ionel@gmail.com',
	approvedDomains: [APP_HOST]

	// Database config
};var DB_CONFIG = exports.DB_CONFIG = {
	dbName: 'blocks_prod',
	models: {
		Shop: 'Shop',
		Token: 'Token',
		Gallery: 'Gallery',
		CustomData: 'CustomData'

		// API config
	} };
var API_KEY = exports.API_KEY = 'ed69a4ff4a8c7a3d85b4aae82fe27f4e';
var SHARED_SECRET = exports.SHARED_SECRET = '50e8b62ee1a737544f6e23efc172e55d';