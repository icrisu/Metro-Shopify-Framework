/* jshint node: true */
'use strict';

import { LETS_ENCRYPT as LETS_ENCRYPT_DEV } from './config-dev.js';
import { LETS_ENCRYPT } from './config-prod.js';

import { DB_CONFIG as DB_CONFIG_DEV } from './config-dev.js';
import { DB_CONFIG as DB_CONFIG_PROD } from './config-prod.js';

import { API_KEY as API_KEY_DEV } from './config-dev.js';
import { API_KEY as API_KEY_PROD } from './config-prod.js';

import { SHARED_SECRET as SHARED_SECRET_DEV } from './config-dev.js';
import { SHARED_SECRET as SHARED_SECRET_PROD } from './config-prod.js';

import { APP_HOST as APP_HOST_DEV } from './config-dev.js';
import { APP_HOST as APP_HOST_PROD } from './config-prod.js';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production' ? true : false;
export const APP_HOST = process.env.NODE_ENV === 'production' ? APP_HOST_PROD : APP_HOST_DEV;

// letsencrypt config
const getLetsEncryptConfig = () => {
    return IS_PRODUCTION ? LETS_ENCRYPT : LETS_ENCRYPT_DEV;
};
export const LETS_ENCRYPT_CONFIG = getLetsEncryptConfig();

// Database config
export const DB_CONFIG = IS_PRODUCTION ? DB_CONFIG_PROD : DB_CONFIG_DEV;

// Shopify API config
export const API_KEY = IS_PRODUCTION ? API_KEY_PROD : API_KEY_DEV;
export const SHARED_SECRET = IS_PRODUCTION ? SHARED_SECRET_PROD : SHARED_SECRET_DEV;

export const API_CONFIG = {
    shop: '', // MYSHOP.myshopify.com - will be replaced once we get the shop
    shopify_api_key: API_KEY, // API key
    shopify_shared_secret: SHARED_SECRET, // Shared Secret
    shopify_scope: ['read_script_tags', 
    'write_script_tags', 'read_products'],
    redirect_uri: '' // will be replaced once we get the shop
};

// Session config
export const SESSION_CONFIG = {
    sessionSecret: '&*@(*)@*&***H@#AADdskfdskfk@*&#723642@^#%'
};

// available admin languages
export const AVAILABLE_LANGS = ['en', 'fr']; // available langs, first is default
export const MAP_SHOP_PRIMARY_LOCALE = false; // fall admin translation to shop's primary_locale

// JWT secret
export const JWT_CONFIG = {
	secret: 'JWT_SECRET_HERE^^^^' // u re JWT secret
}

export const VERSION = 'v.1.0';

export const INTERNAL_APP_NAME = 'Metro';


