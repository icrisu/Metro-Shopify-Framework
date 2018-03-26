/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getBillingPostData = getBillingPostData;
var IS_BILLABLE = exports.IS_BILLABLE = true;

var whitelistedDomains = ['blocks-dev-store.myshopify.com', 'elastik-search-demo.myshopify.com', 'metro-demo.myshopify.com'];

var isWhitelisted = function isWhitelisted(myShopifyDomain) {
	var out = false;
	for (var i = 0; i < whitelistedDomains.length; i++) {
		if (whitelistedDomains[i] === myShopifyDomain) {
			out = true;
			break;
		}
	}
	return out;
};

function getBillingPostData() {
	var myShopifyDomain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'dummy';

	if (!myShopifyDomain) {
		throw new Error('myShopifyDomain is missing !!!');
	}

	var postData = {
		recurring_application_charge: {
			name: 'Standard plan',
			price: 5,
			trial_days: 10,
			test: isWhitelisted(myShopifyDomain) ? true : false
		}
	};
	return postData;
}