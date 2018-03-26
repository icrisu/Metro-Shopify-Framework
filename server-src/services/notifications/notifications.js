/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('blocks:NotificationsService');
import { SlackBroadcastManager, SLACK_EVENTS } from './slack';
import Shop from '../../models/shop';
import { getBillingPostData } from '../../config/billing';

import { INTERNAL_APP_NAME } from '../../config';

class NotificationsService {

	// send slack install notification
	static sendSlackNotification(shop, typeInstall = true) {
		try {
			let slk = new SlackBroadcastManager();
			Shop.count()
			.then((count) => {
				let message = (typeInstall) ? `New shop install` : `Shop unistall`;
				message = `${INTERNAL_APP_NAME} : ${message}`;
				slk.setEvent(SLACK_EVENTS.NEW_SHOP_INSTALL).broadcast(`${message}: ${shop.myshopify_domain} -> Current installs: ${count} -> Price: $${getBillingPostData().recurring_application_charge.price}/m`)
				.catch(err => {
					debug('SLACK ERR' + err)
				});
			})
		} catch(err) {
			debug('SLACK ERR 2 ' + err)
		}
	}
}

export default NotificationsService;
