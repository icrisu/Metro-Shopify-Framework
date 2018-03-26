/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.INTERNAL_APP_NAME = exports.VERSION = exports.MAX_PRODUCTS_ON_SHOP = exports.JWT_CONFIG = exports.MAP_SHOP_PRIMARY_LOCALE = exports.AVAILABLE_LANGS = exports.SESSION_CONFIG = exports.API_CONFIG = exports.SHARED_SECRET = exports.API_KEY = exports.DB_CONFIG = exports.LETS_ENCRYPT_CONFIG = exports.APP_HOST = exports.IS_PRODUCTION = undefined;

var _configDev = require('./config-dev.js');

var _configProd = require('./config-prod.js');

var IS_PRODUCTION = exports.IS_PRODUCTION = process.env.NODE_ENV === 'production' ? true : false;
var APP_HOST = exports.APP_HOST = process.env.NODE_ENV === 'production' ? _configProd.APP_HOST : _configDev.APP_HOST;

// letsencrypt config
var getLetsEncryptConfig = function getLetsEncryptConfig() {
    return IS_PRODUCTION ? _configProd.LETS_ENCRYPT : _configDev.LETS_ENCRYPT;
};
var LETS_ENCRYPT_CONFIG = exports.LETS_ENCRYPT_CONFIG = getLetsEncryptConfig();

// Database config
var DB_CONFIG = exports.DB_CONFIG = IS_PRODUCTION ? _configProd.DB_CONFIG : _configDev.DB_CONFIG;

// Shopify API config
var API_KEY = exports.API_KEY = IS_PRODUCTION ? _configProd.API_KEY : _configDev.API_KEY;
var SHARED_SECRET = exports.SHARED_SECRET = IS_PRODUCTION ? _configProd.SHARED_SECRET : _configDev.SHARED_SECRET;

var API_CONFIG = exports.API_CONFIG = {
    shop: '', // MYSHOP.myshopify.com - will be replaced once we get the shop
    shopify_api_key: API_KEY, // API key
    shopify_shared_secret: SHARED_SECRET, // Shared Secret
    shopify_scope: ['read_script_tags', 'write_script_tags', 'read_products'],
    redirect_uri: '' // will be replaced once we get the shop
};

// Session config
var SESSION_CONFIG = exports.SESSION_CONFIG = {
    sessionSecret: '&*@(*)@*&***H@#AADdskfdskfk@*&#723642@^#%'
};

// available admin languages
var AVAILABLE_LANGS = exports.AVAILABLE_LANGS = ['en', 'fr']; // available langs, first is default
var MAP_SHOP_PRIMARY_LOCALE = exports.MAP_SHOP_PRIMARY_LOCALE = false; // fall admin translation to shop's primary_locale

// JWT secret
var JWT_CONFIG = exports.JWT_CONFIG = {
    secret: 'ahd92378423uj&^#&@*@(#(*#(@*jsdkfhskfksh__@*#&@*&#**&#@&^#'

    // max products to index / shop
};var MAX_PRODUCTS_ON_SHOP = exports.MAX_PRODUCTS_ON_SHOP = 20000;

var VERSION = exports.VERSION = 'v.1.0';

var INTERNAL_APP_NAME = exports.INTERNAL_APP_NAME = 'Metro';