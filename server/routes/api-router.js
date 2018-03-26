/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _GalleryController = require('../controllers/api/GalleryController');

var _GalleryController2 = _interopRequireDefault(_GalleryController);

var _CustomDataController = require('../controllers/api/CustomDataController');

var _CustomDataController2 = _interopRequireDefault(_CustomDataController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ mergeParams: true });

router.get('/galleries', _GalleryController2.default.getGalleries);
router.get('/galleries/:id', _GalleryController2.default.getGallery);
router.post('/galleries', _GalleryController2.default.createGallery);
router.post('/galleries/clone/:id', _GalleryController2.default.cloneGallery);
router.put('/galleries/:id', _GalleryController2.default.updateGallery);
router.delete('/galleries/:id', _GalleryController2.default.deleteGallery);

router.get('/custom-data', _CustomDataController2.default.getData);
router.put('/custom-data', _CustomDataController2.default.update);

router.use(function (err, req, res, next) {
	if (err) {
		res.status(err.status || 500).json({
			message: err.message || 'An error has occured',
			status: err.status || 500
		});
	} else {
		next();
	}
});

exports.default = router;