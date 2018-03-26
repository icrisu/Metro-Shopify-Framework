/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.IsValidShop = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IsValidShop = exports.IsValidShop = function IsValidShop(shop) {
	return !_lodash2.default.isUndefined(shop) && !_lodash2.default.isNull(shop) && _lodash2.default.isString(shop);
};

var ValidatorService = function () {
	function ValidatorService() {
		_classCallCheck(this, ValidatorService);
	}

	_createClass(ValidatorService, null, [{
		key: 'isValidShop',


		// check if shop param is valid
		value: function isValidShop(shop) {
			return ShopValidator(shop);
		}
	}]);

	return ValidatorService;
}();

// export default ValidatorService;