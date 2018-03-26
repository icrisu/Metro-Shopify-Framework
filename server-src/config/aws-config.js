/* jshint node: true */
'use strict';

export const AWS_CONFIG = {
	Bucket: process.env.NODE_ENV === 'production' || process.env.STAGING === 'yes' ? 'metro-app-prod' : 'blocks-dev-shopify',
	apiVersion: '2006-03-01',
	LocationConstraint: 'eu-west-1'
};

export const AWS_ACLS = {
	PUBLIC_READ: 'public-read'
};

export const CONTENT_TYPES = {
	json: 'application/json',
	image: 'image/jpeg',
	javascript: 'application/javascript',
	css: 'text/css',
	stream: 'application/octet-stream'
};