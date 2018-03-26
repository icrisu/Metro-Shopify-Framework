/* jshint node: true */
'use strict';

import _ from 'lodash';
import { JWT_CONFIG } from '../config';
import jwt from 'jsonwebtoken';

class ImpersonateService {

	static generateAccessToken(myshopify_domain) {
		let token = jwt.sign({
			myshopify_domain: myshopify_domain
		}, JWT_CONFIG.secret);
		return token;
	}

	static isValidToken(token) {
		let decoded = false;
		try {
		  decoded = jwt.verify(token, JWT_CONFIG.secret);
		} catch(err) {
		  decoded = false;
		}		
		return decoded;
	}
}

export default ImpersonateService;
