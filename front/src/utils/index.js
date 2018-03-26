/* jshint node: true */
'use strict';

class Utils {
	// generate random uid
	static uid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
	
	static getImagePreferedSize(size = '_400x', imgSrc) {
		if (!_.isString(imgSrc) || imgSrc.length === 0) {
			return '';
		}
		const n = imgSrc.lastIndexOf(".");
		const pre = imgSrc.substring(0, n);
		const after = imgSrc.substring(n, imgSrc.length);
		return `${pre}${size}${after}`;
	}
}

export default Utils;
