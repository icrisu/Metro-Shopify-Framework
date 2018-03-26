/* jshint node: true */
'use strict';

import session from 'express-session';
import MongoStoreBuilder from 'connect-mongo';

const MongoStore = MongoStoreBuilder(session);
import { SESSION_CONFIG } from '../config';

export const useSession = () => {
    return session({
        secret: SESSION_CONFIG.sessionSecret,
        store: new MongoStore({ url: 'mongodb://localhost/sessions' }),
        resave: false,
        saveUninitialized: true
    });
};