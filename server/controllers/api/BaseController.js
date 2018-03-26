'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('TheLoop:BaseController');

var BaseController = function () {
    function BaseController() {
        _classCallCheck(this, BaseController);
    }

    _createClass(BaseController, null, [{
        key: 'errorHelper',
        value: function errorHelper() {
            var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            return {
                status: 'FAIL',
                errors: errors
            };
        }
    }, {
        key: 'buildError',
        value: function buildError() {
            var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 503;

            return {
                status: statusCode,
                title: title
            };
        }

        // response helper

    }, {
        key: 'responseHelper',
        value: function responseHelper() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _self = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var links = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            return { data: data, links: links, _self: _self, status: 'OK' };
        }

        // curent path

    }, {
        key: 'selfApiPath',
        value: function selfApiPath(req) {
            return req.protocol + '://' + req.hostname + req.path;
        }

        // prevent sensitive fields update

    }, {
        key: 'prevendFieldsUpdate',
        value: function prevendFieldsUpdate(req) {
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
    }]);

    return BaseController;
}();

exports.default = BaseController;