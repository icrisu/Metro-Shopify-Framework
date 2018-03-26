'use strict';

import debugPck from 'debug';
const debug = debugPck('TheLoop:BaseController');
import _ from 'lodash';
import safe from 'undefsafe';


class BaseController {


	static errorHelper(errors = []) {
        return {
            status: 'FAIL', 
            errors: errors            
        }        
    }

    static buildError(title = '', statusCode = 503) {
        return {
            status: statusCode,
            title: title
        }
    }


    // response helper
    static responseHelper(data = {}, _self='', links = []) {
        return { data, links, _self, status: 'OK' };        
    }

    // curent path
    static selfApiPath(req) {
        return `${req.protocol}://${req.hostname}${req.path}`;
    }

    // prevent sensitive fields update
    static prevendFieldsUpdate(req) {
        if (req.body._id) {
            delete req.body._id;
        }
        if (req.body.userId) {
            delete req.body.userId;
        }        
        if (req.body.agency) {
            delete req.body.agency;
        }
    }
}

export default BaseController;
