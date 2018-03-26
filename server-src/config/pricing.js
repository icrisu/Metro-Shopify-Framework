/* jshint node: true */
'use strict';

export const STARTER = 'STARTER';
export const STARTUP = 'STARTUP';
export const PROFFESIONAL = 'PROFFESIONAL';

const PRICING_SCHEMES = {
	[STARTER]: {
		slug: STARTER,
		price: 9,
		unit: '$',
		prettyTitle: 'Starter plan',
		smallDescription: 'Get access to the apps from Starter plan',
		extendedDescription: 'Some extended description'
	},
	[STARTUP]: {
		slug: STARTUP,
		price: 19,
		unit: '$',
		prettyTitle: 'Startup plan',
		smallDescription: 'Get access to all apps from Starter plan & Startup plan',
		extendedDescription: 'Some extended description'
	},
	[PROFFESIONAL]: {
		slug: PROFFESIONAL,
		price: 29,
		unit: '$',
		prettyTitle: 'Proffesional plan',
		smallDescription: 'Get access to all apps',
		extendedDescription: 'Some extended description'
	}
};

export default PRICING_SCHEMES;