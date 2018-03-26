/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.awsPublicBucketRoot = exports.buildAWSObjectUrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _awsAccess = require('../../config/aws-access');

var _awsConfig = require('../../config/aws-config');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_awsSdk2.default.config = new _awsSdk2.default.Config(_awsAccess.AWS_ACCESS);

var debug = (0, _debug2.default)('blocks:AWSBaseService');


// also used externaly
var buildAWSObjectUrl = exports.buildAWSObjectUrl = function buildAWSObjectUrl(objKey) {
	return 'https://s3-' + _awsConfig.AWS_CONFIG.LocationConstraint + '.amazonaws.com/' + _awsConfig.AWS_CONFIG.Bucket + '/' + objKey;
};

var awsPublicBucketRoot = exports.awsPublicBucketRoot = function awsPublicBucketRoot() {
	return 'https://s3-' + _awsConfig.AWS_CONFIG.LocationConstraint + '.amazonaws.com/' + _awsConfig.AWS_CONFIG.Bucket + '/';
};

var AWSBaseService = function () {
	function AWSBaseService(props) {
		_classCallCheck(this, AWSBaseService);

		this.props = props;
		this.s3 = new _awsSdk2.default.S3({ apiVersion: _awsConfig.AWS_CONFIG.apiVersion });
	}

	// create bucket if it does not exists


	_createClass(AWSBaseService, [{
		key: 'createAppBucket',
		value: function createAppBucket() {
			var _this = this;

			var permission = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _awsConfig.AWS_ACLS.PUBLIC_READ;

			debug('AWS create bucket');
			return this.getBuckets().then(function (data) {
				if (!_lodash2.default.isNil(data) && _lodash2.default.isArray(data.Buckets)) {
					if (!_this.bucketExists(data.Buckets)) {
						var params = {
							Bucket: _awsConfig.AWS_CONFIG.Bucket,
							ACL: permission,
							CreateBucketConfiguration: {
								LocationConstraint: _awsConfig.AWS_CONFIG.LocationConstraint
							}
						};
						_this.s3.createBucket(params, function (err, data) {
							if (err) {
								debug(err);
							}
							debug('BUCKET CREATED', data);
						});
					} else {
						debug('S3 BUCKET EXISTS');
					}
				}
			}).catch(function (err) {
				debug('S3 bucket error ', err);
			});
		}

		// check if bucket exists

	}, {
		key: 'bucketExists',
		value: function bucketExists(buckets) {
			var out = false;
			for (var i = 0; i < buckets.length; i++) {
				if (buckets[i].Name === _awsConfig.AWS_CONFIG.Bucket) {
					out = true;
					break;
				}
			}
			return out;
		}

		// retrive buckets

	}, {
		key: 'getBuckets',
		value: function getBuckets() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.s3.listBuckets({}, function (err, data) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}
	}, {
		key: 'putObject',
		value: function putObject(object) {
			var _this3 = this;

			var objKey = object.Key;
			var params = {
				Bucket: _awsConfig.AWS_CONFIG.Bucket,
				Key: objKey,
				ACL: _awsConfig.AWS_ACLS.PUBLIC_READ,
				Body: object.body,
				ContentType: object.contentType
			};
			if (object.contentEncoding) {
				params.ContentEncoding = object.contentEncoding;
			}
			return new Promise(function (resolve, reject) {
				_this3.s3.putObject(params).promise().then(function (data) {
					resolve({
						url: buildAWSObjectUrl(objKey),
						key: '' + objKey
					});
				}).catch(reject);
			});
		}

		// delete object

	}, {
		key: 'deleteObject',
		value: function deleteObject(objKey) {
			if (_lodash2.default.isNil(objKey)) {
				return Promise.reject({ message: 'Invalid object key' });
			}
			var params = {
				Bucket: _awsConfig.AWS_CONFIG.Bucket,
				Key: objKey
			};
			return this.s3.deleteObject(params).promise();
		}

		// delete many

	}, {
		key: 'deleteMany',
		value: function deleteMany(objects) {
			if (_lodash2.default.isArray(objects) && objects.length > 1000) {
				objects = objects.slice(0, 999);
			}
			if (!_lodash2.default.isArray(objects)) {
				return Promise.reject({ message: 'invalid aws objects 2183' });
			}
			var preparedObjects = [];
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].Key) {
					preparedObjects.push({
						Key: objects[i].Key
					});
				}
			}
			var params = {
				Bucket: _awsConfig.AWS_CONFIG.Bucket,
				Delete: {
					Objects: preparedObjects
				}
			};
			return this.s3.deleteObjects(params).promise();
		}

		// get all objects from bucket

	}, {
		key: 'getObjects',
		value: function getObjects() {
			return this.s3.listObjectsV2({
				Bucket: _awsConfig.AWS_CONFIG.Bucket
			}).promise();
		}
	}]);

	return AWSBaseService;
}();

exports.default = AWSBaseService;