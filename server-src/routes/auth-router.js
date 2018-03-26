/* jshint node: true */
'use strict';

import express from 'express';
const router = express.Router();

import AuthController from '../controllers/auth-controller';

router.get('/', AuthController.index);

router.get('/complete', AuthController.runComplete);

//place charge request
router.get('/charge-request', AuthController.placeChargeRequest);

//uninstall hook
router.post('/uninstall/:shop_id', AuthController.uninstall);

//verify payment gateway
router.get('/payment/:shop_id', AuthController.payment);

export default router;