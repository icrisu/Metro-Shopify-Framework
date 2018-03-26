/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useSession = undefined;

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);
var useSession = exports.useSession = function useSession() {
    return (0, _expressSession2.default)({
        secret: _config.SESSION_CONFIG.sessionSecret,
        store: new MongoStore({ url: 'mongodb://localhost/sessions' }),
        resave: false,
        saveUninitialized: true
    });
};