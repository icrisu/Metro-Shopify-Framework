/* jshint node: true */
'use strict';

import express from 'express';
const router = express.Router();

import AppController from '../controllers/app-controller';
import AuthController from '../controllers/auth-controller';
import APIRouter from './api-router';
import _ from 'lodash';



router.get('/impersonate', (req, res, next) => {
	res.render('app/impersonate');
});

router.get('/', (req, res, next) => {
	if (!_.isNil(req.query.x_imp)) {
		req.headers.x_imp = req.query.x_imp;
	}
	console.log('AICI ', req.query.x_imp);
	next();
});

// verify signature
router.use(AppController.validateSignature);

// get shop data
router.use(AppController.useShop);

// validate billing
router.use(AuthController.validateBilling);

router.get('/', AppController.index);

// api
router.use('/api', APIRouter);

export default router;