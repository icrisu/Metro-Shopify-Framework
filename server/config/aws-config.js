/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var AWS_CONFIG = exports.AWS_CONFIG = {
	Bucket: process.env.NODE_ENV === 'production' || process.env.STAGING === 'yes' ? 'metro-app-prod' : 'blocks-dev-shopify',
	apiVersion: '2006-03-01',
	LocationConstraint: 'eu-west-1'
};

var AWS_ACLS = exports.AWS_ACLS = {
	PUBLIC_READ: 'public-read'
};

var CONTENT_TYPES = exports.CONTENT_TYPES = {
	json: 'application/json',
	image: 'image/jpeg',
	javascript: 'application/javascript',
	css: 'text/css',
	stream: 'application/octet-stream'
};