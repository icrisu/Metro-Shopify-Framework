/* jshint node: true */
'use strict';

import BaseShopifyService from './base';
import debugPck from 'debug';
const debug = debugPck('blocks:AuthController');
import _ from 'lodash';
import safe from 'undefsafe';


import { getBillingPostData } from '../../config/billing';

class ChargeService extends BaseShopifyService {

	constructor(myShopifyDomain, access_token, nonce) {
		super(myShopifyDomain, access_token, nonce);
	}

	// place recurring charge request
	placeRecurringChargeRequest(req) {
		return new Promise((resolve, reject) => {
			this.getShop()
			.then((shop) => {
				return this.getAccessToken();
			})
			.then(() => {
				let postData = getBillingPostData(this.shop.myshopify_domain);
				postData.recurring_application_charge.return_url = req.protocol + '://' + req.get('host') + '/auth/payment/' + String(this.shop._id);

				this.APIInterface.post('/admin/recurring_application_charges.json', postData, (err, data) => {
					if(err){
						reject(err);
						return;
					}

					this.shop.charge_data = data.recurring_application_charge;
					this.shop.charge_id = this.shop.charge_data.id;
					this.shop.save((err, data) => {
						if (err) {
							return reject(err);
						}
						resolve(this.shop);
					});
				});


			})
		});		
	}

	// get recurring charge
	getRecurringCharge(chargeId) {
		debug('get recurring charge ...');
		return new Promise((resolve, reject) => {
			this.APIInterface.get('/admin/recurring_application_charges/' + chargeId + '.json', (err, data) => {
				if(err){
					return reject(err);
				}

				if (data.recurring_application_charge.status === 'accepted') {
					this.activateCharge(chargeId)
					.then(() => {
						this.shop.charge = true;
						this.shop.save((err, data) => {
							if (err) {
								return reject(err);
							}
							resolve(this.shop);
						});						
					})
					.catch((err) => {
						return reject(err);
					})
				} else {
					resolve(this.shop);
				}				

			});
		});
	}

	activateCharge(chargeId) {		
		return new Promise((resolve, reject) => {
			this.APIInterface.post('/admin/recurring_application_charges/' + chargeId + '/activate.json', {}, (err, data) => {
				if(err){
					return reject(err);
				} 
				resolve({});
			});
		});		
	}	

}

export default ChargeService;
