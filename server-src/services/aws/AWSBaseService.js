/* jshint node: true */
'use strict';

import AWS from 'aws-sdk';
import { AWS_ACCESS } from '../../config/aws-access';
AWS.config = new AWS.Config(AWS_ACCESS);
import { AWS_CONFIG, AWS_ACLS, CONTENT_TYPES } from '../../config/aws-config';

import debugPck from 'debug';
const debug = debugPck('blocks:AWSBaseService');
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

// also used externaly
export const buildAWSObjectUrl = (objKey) => {
	return `https://s3-${AWS_CONFIG.LocationConstraint}.amazonaws.com/${AWS_CONFIG.Bucket}/${objKey}`;
}

export const awsPublicBucketRoot = () => {
	return `https://s3-${AWS_CONFIG.LocationConstraint}.amazonaws.com/${AWS_CONFIG.Bucket}/`;
}

class AWSBaseService {

	constructor(props) {
		this.props = props;
		this.s3 = new AWS.S3({ apiVersion: AWS_CONFIG.apiVersion });
	}

	// create bucket if it does not exists
	createAppBucket(permission = AWS_ACLS.PUBLIC_READ) {
		debug('AWS create bucket')
		return this.getBuckets().then(data => {
			if (!_.isNil(data) && _.isArray(data.Buckets)) {
				if (!this.bucketExists(data.Buckets)) {
					const params = {
						Bucket: AWS_CONFIG.Bucket,
						ACL: permission,
						CreateBucketConfiguration: {
							LocationConstraint: AWS_CONFIG.LocationConstraint
						}
					};
					this.s3.createBucket(params, (err, data) => {
						if (err) {
							debug(err);
						}
						debug('BUCKET CREATED', data);
					});
				} else {
					debug('S3 BUCKET EXISTS');
				}
			}
		}).catch(err => {
			debug('S3 bucket error ', err);
		});
	}

	// check if bucket exists
	bucketExists(buckets) {
		let out = false;
		for (var i = 0; i < buckets.length; i++) {
			if (buckets[i].Name === AWS_CONFIG.Bucket) {
				out = true;
				break;
			}
		}
		return out;
	}

	// retrive buckets
	getBuckets() {
		return new Promise((resolve, reject) => {
			this.s3.listBuckets({}, (err, data) => {
				if (err) {
					return reject(err);
				}
				resolve(data);
			});
		});
	}

	putObject(object) {
		const objKey = object.Key;
		const params = {
			Bucket: AWS_CONFIG.Bucket,
			Key: objKey,
			ACL: AWS_ACLS.PUBLIC_READ,
			Body: object.body,
			ContentType: object.contentType
		};
		if (object.contentEncoding) {
			params.ContentEncoding = object.contentEncoding;
		}
		return new Promise((resolve, reject) => {
			this.s3.putObject(params).promise().then(data => {
				resolve({
					url: buildAWSObjectUrl(objKey),
					key: `${objKey}`
				});
			}).catch(reject);
		});
	}

	// delete object
	deleteObject(objKey) {
		if (_.isNil(objKey)) {
			return Promise.reject({ message: 'Invalid object key' });
		}
		const params = {
			Bucket: AWS_CONFIG.Bucket,
			Key: objKey
		};
		return this.s3.deleteObject(params).promise();
	}

	// delete many
	deleteMany(objects) {
		if (_.isArray(objects) && objects.length > 1000) {
			objects = objects.slice(0, 999);
		}
		if (!_.isArray(objects)) {
			return Promise.reject({ message: 'invalid aws objects 2183' })
		}
		let preparedObjects = [];
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].Key) {
				preparedObjects.push({
					Key: objects[i].Key
				});
			}
		}
		const params = {
			Bucket: AWS_CONFIG.Bucket,
			Delete: {
				Objects: preparedObjects
			}
		};
		return this.s3.deleteObjects(params).promise();
	}

	// get all objects from bucket
	getObjects() {
		return this.s3.listObjectsV2({
			Bucket: AWS_CONFIG.Bucket
		}).promise();
	}

}

export default AWSBaseService;
