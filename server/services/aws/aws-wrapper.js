/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('blocks:AwsService');

var AwsService = function () {
	function AwsService() {
		_classCallCheck(this, AwsService);
	}

	_createClass(AwsService, null, [{
		key: 'buildMainJS',
		value: function buildMainJS() {
			return new Promise(function (resolve, reject) {
				resolve({
					content: 'var test = "Hello"; console.log(test)'
				});
			});
		}
	}, {
		key: 'buildMainCSS',
		value: function buildMainCSS() {
			return new Promise(function (resolve, reject) {
				resolve({
					content: '.test { color: green; }'
				});
			});
		}
	}]);

	return AwsService;
}();

exports.default = AwsService;