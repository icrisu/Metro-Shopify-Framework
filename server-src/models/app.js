/* jshint node: true */
'use strict';

import _ from 'lodash';
import { API_KEY, APP_HOST } from '../config';
import { getBillingPostData } from '../config/billing';

class AppModel {

	constructor(data) {
		if (!_.isNull(data)) {
			for (let property in data) {
				if (data.hasOwnProperty(property)) {
					this[property] = data[property];
				}
			}
		}
	}

	static createFromData(shop, stopRedirect) {
		const billingPostData = getBillingPostData('myShopifyDomain');
		return new AppModel({
			apiKey: API_KEY,
			shopOrigin: 'https://' + shop.myshopify_domain,
			app_host: 'https://' + APP_HOST,
			lang: shop.lang,
			pricingScheme: shop.pricingScheme,
			stopRedirect: stopRedirect || 'false',
			trial_days: billingPostData.recurring_application_charge.trial_days
		});
	}
}

export default AppModel;