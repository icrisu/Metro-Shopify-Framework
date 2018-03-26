/* jshint node: true */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AWSBaseService = require('../services/aws/AWSBaseService');

var _AWSBaseService2 = _interopRequireDefault(_AWSBaseService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (process.env.NODE_ENV !== 'ops') {
	console.log('You should be in ops mode');
	process.exit(1);
}

var RemoveAllFiles = function () {
	function RemoveAllFiles() {
		_classCallCheck(this, RemoveAllFiles);

		this.service = new _AWSBaseService2.default();
	}

	_createClass(RemoveAllFiles, [{
		key: 'retrieveAndRemove',
		value: function retrieveAndRemove() {
			var _this = this;

			this.service.getObjects().then(function (data) {
				var toBeDeleted = [];
				for (var i = 0; i < data.Contents.length; i++) {
					toBeDeleted.push({
						Key: data.Contents[i].Key
					});
				}
				console.log(toBeDeleted);
				return _this.service.deleteMany(toBeDeleted);
			}).then(function () {
				console.log('ALL OBJECTS HAVE BEEN DELETED ...');
			}).catch(function (err) {
				console.log('ERR:', err);
			});
		}
	}]);

	return RemoveAllFiles;
}();

var remover = new RemoveAllFiles();
remover.retrieveAndRemove();