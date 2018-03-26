/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ErrorHelper = exports.RedirectHelper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// preserve original search query
var RedirectHelper = exports.RedirectHelper = function () {
	function RedirectHelper() {
		_classCallCheck(this, RedirectHelper);
	}

	_createClass(RedirectHelper, null, [{
		key: 'redirectTo',
		value: function redirectTo(route, req, res) {
			return res.redirect(req.protocol + '://' + req.get('host') + route + _url2.default.parse(req.originalUrl).search);
		}
	}]);

	return RedirectHelper;
}();

// build standard JSON Error responses


var ErrorHelper = exports.ErrorHelper = function () {
	function ErrorHelper(status, id, title) {
		_classCallCheck(this, ErrorHelper);

		this.errors = [];
		if (status && id && title) {
			this.addError(status, id, title);
		}
	}

	// add error object


	_createClass(ErrorHelper, [{
		key: 'addError',
		value: function addError(status, id, title, detail, source) {
			this.errors.push({
				status: status,
				id: id,
				title: title,
				detail: detail,
				source: source
			});
		}

		// check if errors 

	}, {
		key: 'hasErrors',
		value: function hasErrors() {
			return this.errors.length > 0;
		}

		// retrieve first error status code

	}, {
		key: 'getMainStatus',
		value: function getMainStatus() {
			if (this.errors.length === 0) {
				throw new Error('Error stack empty');
			}
			return this.errors[0].status;
		}

		// get errors object

	}, {
		key: 'getErrorsObject',
		value: function getErrorsObject() {
			return {
				errors: this.errors
			};
		}

		// helpers for quick error object 

	}], [{
		key: 'quickError',
		value: function quickError(status, id, title) {
			var eh = new ErrorHelper(status, id, title);
			return eh.getErrorsObject();
		}

		// helper for custom error

	}, {
		key: 'getCustomError',
		value: function getCustomError(status) {
			return CUSTOM_ERROR[status];
		}

		// helper method to wrap a custom error - comply with the standard

	}, {
		key: 'wrapCustomError',
		value: function wrapCustomError(status, title) {
			return {
				errors: [{ status: status, title: title }]
			};
		}
	}]);

	return ErrorHelper;
}();

var CUSTOM_ERROR = {
	204: ErrorHelper.wrapCustomError(204, 'No content'),
	400: ErrorHelper.wrapCustomError(400, 'Bad request'),
	401: ErrorHelper.wrapCustomError(401, 'Unauthorized'),
	402: ErrorHelper.wrapCustomError(402, 'Payment Required'),
	403: ErrorHelper.wrapCustomError(403, 'Forbidden'),
	404: ErrorHelper.wrapCustomError(404, 'Resource not found'),
	409: ErrorHelper.wrapCustomError(409, 'Error conflict'),
	500: ErrorHelper.wrapCustomError(500, 'Error')
};