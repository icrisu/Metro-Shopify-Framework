/* jshint node: true */
'use strict';

export const IS_BILLABLE = true;

const whitelistedDomains = [
	'blocks-dev-store.myshopify.com',
	'elastik-search-demo.myshopify.com',
	'metro-demo.myshopify.com'
];

const isWhitelisted = (myShopifyDomain) => {
	let out = false;
	for (var i = 0; i < whitelistedDomains.length; i++) {
		if (whitelistedDomains[i] === myShopifyDomain) {
			out = true;
			break;
		}
	}
	return out;
}

export function getBillingPostData(myShopifyDomain = 'dummy') {
	if (!myShopifyDomain) {
		throw new Error('myShopifyDomain is missing !!!');
	}

	const postData = {			
		recurring_application_charge: {
			name: 'Standard plan',
			price: 5,
			trial_days: 10,
			test: isWhitelisted(myShopifyDomain) ? true : false
		}
	};
	return postData;
}


