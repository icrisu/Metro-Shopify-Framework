/* jshint node: true */
'use strict';

import cluster from 'cluster';
import http from 'http';
import os from 'os';
import debugPck from 'debug';
const debug = debugPck('blocks:server');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        debug(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    let httpsServer = require('../app');
    debug('started on worker');
}