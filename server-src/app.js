// import express from 'express');
import express from 'express';

import path from 'path';

import Https from './middleware/letsencrypt';

import debugPck from 'debug';
const debug = debugPck('blocks:AppMain');
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import index from './routes/index';
import authRouter from './routes/auth-router';
import appRouter from './routes/app-router';

import { useSession } from './middleware/session';

import mongoose from 'mongoose';
import { DB_CONFIG } from './config';

import compression from 'compression';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/' + DB_CONFIG.dbName, { useMongoClient: true }).then(() => {
	debug('mongodb connected');
}).catch(err => {
	debug('Could not connect to mongo DB! - start mongo daemon');
});

const app = express();

// handle session midleware
app.use(useSession());

// use compression
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', authRouter);
app.use('/app', appRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

export default Https(app);