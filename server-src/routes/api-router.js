/* jshint node: true */
'use strict';

import express from 'express';
const router = express.Router({ mergeParams: true });

import GalleryController from '../controllers/api/GalleryController';
import CustomDataController from '../controllers/api/CustomDataController';


router.get('/galleries', GalleryController.getGalleries);
router.get('/galleries/:id', GalleryController.getGallery);
router.post('/galleries', GalleryController.createGallery);
router.post('/galleries/clone/:id', GalleryController.cloneGallery);
router.put('/galleries/:id', GalleryController.updateGallery);
router.delete('/galleries/:id', GalleryController.deleteGallery);

router.get('/custom-data', CustomDataController.getData);
router.put('/custom-data', CustomDataController.update);

router.use((err, req, res, next) => {
	if (err) {
		res.status(err.status || 500).json({
			message: err.message || 'An error has occured',
			status: err.status || 500
		});
	} else {
		next();
	}
});

export default router;