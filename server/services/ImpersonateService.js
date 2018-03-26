/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('../config');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImpersonateService = function () {
	function ImpersonateService() {
		_classCallCheck(this, ImpersonateService);
	}

	_createClass(ImpersonateService, null, [{
		key: 'generateAccessToken',
		value: function generateAccessToken(myshopify_domain) {
			var token = _jsonwebtoken2.default.sign({
				myshopify_domain: myshopify_domain
			}, _config.JWT_CONFIG.secret);
			return token;
		}
	}, {
		key: 'isValidToken',
		value: function isValidToken(token) {
			var decoded = false;
			try {
				decoded = _jsonwebtoken2.default.verify(token, _config.JWT_CONFIG.secret);
			} catch (err) {
				decoded = false;
			}
			return decoded;
		}
	}]);

	return ImpersonateService;
}();

exports.default = ImpersonateService;