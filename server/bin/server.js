/* jshint node: true */
'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('blocks:server');

var numCPUs = _os2.default.cpus().length;

if (_cluster2.default.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        _cluster2.default.fork();
    }

    _cluster2.default.on('exit', function (worker, code, signal) {
        debug('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    var httpsServer = require('../app');
    debug('started on worker');
}