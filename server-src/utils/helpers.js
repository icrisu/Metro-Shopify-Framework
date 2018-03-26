/* jshint node: true */
'use strict';

import url from 'url';

// preserve original search query
export class RedirectHelper {

	static redirectTo(route, req, res) {
		return res.redirect(req.protocol + '://' + req.get('host') + route + url.parse(req.originalUrl).search);
	}
}

// build standard JSON Error responses
export class ErrorHelper {

	constructor(status, id, title) {
		this.errors = [];
		if (status && id && title) {
			this.addError(status, id, title);
		}
	}

	// add error object
	addError(status, id, title, detail, source) {
		this.errors.push({
			status: status,
			id: id,
			title: title,
			detail: detail,
			source: source
		});
	}

	// check if errors 
	hasErrors() {
		return this.errors.length > 0;
	}

	// retrieve first error status code
	getMainStatus() {
		if (this.errors.length === 0) {
			throw new Error('Error stack empty');
		}
		return this.errors[0].status;
	}

	// get errors object
	getErrorsObject() {
		return {
			errors: this.errors
		};
	}

	// helpers for quick error object 
	static quickError(status, id, title) {
		let eh = new ErrorHelper(status, id, title);
		return eh.getErrorsObject();
	}

	// helper for custom error
	static getCustomError(status) {
		return CUSTOM_ERROR[status];
	}

	// helper method to wrap a custom error - comply with the standard
	static wrapCustomError(status, title) {
		return {
			errors: [{ status: status, title: title }]
		};
	}
}

const CUSTOM_ERROR = {
	204: ErrorHelper.wrapCustomError(204, 'No content'),
	400: ErrorHelper.wrapCustomError(400, 'Bad request'),
	401: ErrorHelper.wrapCustomError(401, 'Unauthorized'),
	402: ErrorHelper.wrapCustomError(402, 'Payment Required'),
	403: ErrorHelper.wrapCustomError(403, 'Forbidden'),
	404: ErrorHelper.wrapCustomError(404, 'Resource not found'),
	409: ErrorHelper.wrapCustomError(409, 'Error conflict'),
	500: ErrorHelper.wrapCustomError(500, 'Error')
};