/* jshint node: true */
'use strict';

if (process.env.NODE_ENV !== 'ops') {
	console.log('You should be in ops mode');
	process.exit(1);
}

import AWSBaseService from '../services/aws/AWSBaseService';

class RemoveAllFiles {
	constructor() {
		this.service = new AWSBaseService();
	}

	retrieveAndRemove() {
		this.service.getObjects()
		.then(data => {
			let toBeDeleted = [];
			for (var i = 0; i < data.Contents.length; i++) {
				toBeDeleted.push({
					Key: data.Contents[i].Key
				});
			}
			console.log(toBeDeleted)
			return this.service.deleteMany(toBeDeleted);
		})
		.then(() => {
			console.log('ALL OBJECTS HAVE BEEN DELETED ...');
		})
		.catch(err => {
			console.log('ERR:', err);
		})
	}
}


const remover = new RemoveAllFiles();
remover.retrieveAndRemove();


