/* jshint node: true */
'use strict';

if (process.env.NODE_ENV !== 'ops') {
	console.log('You should be in ops mode');
	process.exit(1);
}

import ShopService from '../services/shopify/shop-service';
import faker from 'faker';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class ProductGenerator {
	constructor() {
		console.log('START ');
		this.maxProductsToGenerate = 2000;
		this.currentIndex = 0;
		this.productsReferences = [];
		this.prices = [
			200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200
		];
		this.demoImages = [];

		this.service = new ShopService('elastik-search-demo.myshopify.com', 'fa370c53be2a4b877db4df798d0247ee', '59e2263a1921d50e873ed0b7');

		// this.readAllImages()
		// .then(() => {
		// 	console.log('AICI');
		// 	return this.readFileFromPath(this.demoImages[0]);
		// })
		// .then((base64) => {
		// 	console.log('FILE RED', base64);
		// })
		// .catch(err => {
		// 	console.log(err);
		// })
		// console.log('STOP');

		this.readAllImages()
		.then(() => {
			// this.base64Data = base64Data;
			this.getNextImage();
		})
		.catch(err => {
			console.log(err);
		});
	}

	getNextImage() {
		let imagePath = this.demoImages[getRandomInt(0, this.demoImages.length - 1)];
		this.readFileFromPath(imagePath)
		.then((base64Data) => {
			this.base64Data = base64Data;
			this.postProduct();
		})
		.catch(err => {
			console.log(err);
		});
	}

	postProduct() {
		let price = this.prices[getRandomInt(0, 9)] || 550;
		console.log('PRICE', price)
		// if (this.currentIndex > this.maxProductsToGenerate / 3) {
		// 	price = 650;
		// }
		// if (this.currentIndex > this.maxProductsToGenerate / 2) {
		// 	price = 900;
		// }		
		const post_data = {
			product: {
				title: faker.commerce.productName(),
				body_html: "<p>" + faker.lorem.sentence() + "<\/p>",
				vendor: "Burton",
				product_type: "",
				tags: `${faker.commerce.product()}, ${faker.commerce.product()}`,
				price: price,
				images: [
					{
						attachment: this.base64Data
					}
				],
			    "variants": [
			      {
			        "option1": "First - " + faker.commerce.productName(),
			        "price": price,
			        "sku": "123",
			        compare_at_price: price + 90
			      },
			      {
			        "option1": "Second - " + faker.commerce.productName(),
			        "price": price + 10,
			        "sku": "123"
			      }
			    ]				
			}
		};			
		setTimeout(() => {
			this.service.createProduct(post_data)
			.then((productData) => {
				console.log('PRODUCT CREATED >>>>>> ' + this.currentIndex);
				
				this.productsReferences.push({
					product_id: productData.product.id
				});

				if (this.currentIndex < this.maxProductsToGenerate) {
					this.currentIndex ++;
					this.getNextImage();
				} else {
					this.assignToCollections();
				}
			})
			.catch(err => {
				console.log('ERROR ', err);
			})		
		}, 550);	
	}

	assignToCollections() {
		// frontpage 2815983644
		// Test collection 5648810012
		console.log('ASSIGN TO COLELCTIONS', 'ALL DONE');
		return;
		const half = Math.round(this.productsReferences.length / 2);
		const first = this.productsReferences.slice(0, half);
		const second = this.productsReferences.slice(half, this.productsReferences.length);

		console.log('FIRST ARRAY', first);

		this.service.updateCollectionProducts(5648810012, first)
		.then(() => {
			console.log('DONE');
		})
		.catch(err => {
			console.log('ERR ', err)
		})
	}

	readAllImages() {
		return new Promise((resolve, reject) => {
			glob('./dummy-files/**/*', (err, result) => {
				if (!err) {
					this.demoImages = result;
				};
				resolve();
			});
		});			
	}

	readFileFromPath(filePath) {
		console.log('File read OK');
		return new Promise((resolve, reject) => {
			const p = path.join(__dirname, filePath);
			const data = fs.readFileSync(p);
			resolve(data.toString('base64'));	
		});		
	}		

	readFile(filename) {
		console.log('File read OK');
		return new Promise((resolve, reject) => {
			const p = path.join(__dirname, 'dummy-files', filename);
			const data = fs.readFileSync(p);
			resolve(data.toString('base64'));	
		});		
	}	
}

const pg = new ProductGenerator();

// console.log(faker.image.technics());