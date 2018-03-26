'use strict';
// var PRE_KEY = 'metro'; 
// var SHOP_BASE_KEY = '5a264a061f1bf105647d5f05'; 
// var CDN_MAIN = 'https://s3-eu-west-1.amazonaws.com/blocks-dev-shopify/';

import $ from 'zeptojs';
import WidgetBlock from './WidgetBlock';
import WidgetSimple from './WidgetSimple';

const CSS_URL = `${CDN_MAIN}${PRE_KEY}-${SHOP_BASE_KEY}.css`;
const placeCSS = () => {
	let link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('type', 'text/css');
	link.setAttribute('href', CSS_URL);
	document.getElementsByTagName('head')[0].appendChild(link);	
}
placeCSS();

$('.metro').each((indx, item) => {
	const url = `${CDN_MAIN}${PRE_KEY}-${SHOP_BASE_KEY}-${$(item).attr('id')}.json`
	$.getJSON(url, (data, status) => {
		if (status === 'success') {
			if (data.type === 'advanced') {
				new WidgetBlock($(item), data);
			} else {
				new WidgetSimple($(item), data);
			}
		} else {
			console.log('invalid data');
		}
	})	
})


