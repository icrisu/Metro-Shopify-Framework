// @flow
import axios from 'axios';
import { MENU_INFO, CREATE_GALLERY, GET_GALLERIES, 
    REMOVE_GALLERY, GET_GALLERY, UPDATE_GALLERY, GET_CUSTOM_DATA } from './Types';
import type { GalleryCreatePayload } from '../beans';
import _ from 'lodash';

const retriveXimp = () => {
    if(localStorage !== "undefined") {
    	return localStorage.getItem("x_imp");
    }
    return false;
}
const x_imp = retriveXimp();

const hasSignature = () => {
    let out = false;
    if (window.blocksSettings && window.blocksSettings.signature && window.blocksSettings.signature.shop) {
        out = true;
    }
    return out;
};

// Add a request interceptor
axios.interceptors.request.use((config) => {
    if (x_imp && !hasSignature()) {
    	config.headers.x_imp = x_imp;
    } else {
    	config.headers.x_shopify_auth = window.blocksSettings.signature;
    }    
    return config;
  }, (error) => {
  	// TBD dispatch ERROR GLOBAL
    // console.log('AN HXR ERROR HAPPENED'); 
    return Promise.reject(error);
});

export const API_ROOT = `${window.blocksSettings.apiRoot}/app/api`;

export const ACTION_EVENTS = {
    GET_GALLERIES: 'GET_GALLERIES'
};

export const broadcastMenuInfo = (info: any = {}): any => {
    return {
        type: MENU_INFO,
        payload: info
    }
}

// get all galleries
export const getGalleries = (cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.get(`${API_ROOT}/galleries`)
        .then(({ data }) => {
            dispatch({
                type: GET_GALLERIES,
                payload: data.data
            });
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);                
            }
        })
    }    
}

// create gallery
export const createGallery = (data: GalleryCreatePayload, cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.post(`${API_ROOT}/galleries`, data)
        .then(({ data }) => {            
            dispatch({
                type: CREATE_GALLERY,
            });
            dispatch(getGalleries());
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);                
            }
        })
    } 
}

// update gallery
export const updateGallery = (id: string, data: any, cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.put(`${API_ROOT}/galleries/${id}`, data)
        .then(({ data }) => {            
            dispatch({
                type: UPDATE_GALLERY,
            });
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);
            }
        })
    } 
}

// get gallery
export const retrieveGallery = (id:string, cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.get(`${API_ROOT}/galleries/${id}`)
        .then(({ data }) => {            
            dispatch({
                type: GET_GALLERY,
                payload: data.data
            });
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);                
            }
        })
    } 
}

// remove gallery
export const removeGallery = (id:string, cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.delete(`${API_ROOT}/galleries/${id}`)
        .then(({ data }) => {            
            // dispatch({
            //     type: REMOVE_GALLERY,
            // });
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);                
            }
            dispatch(getGalleries());
        })
    } 
}

// clone gallery
export const cloneGallery = (id: string, name: string, cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.post(`${API_ROOT}/galleries/clone/${id}`, { name })
        .then(({ data }) => { 
            dispatch(getGalleries());
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);                
            }
        })
    } 
}

// update css
export const updateCustomData = (data: any, cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.put(`${API_ROOT}/custom-data`, data)
        .then(({ data }) => {            
            dispatch(retrieveCustomData());
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data);
            }
        })
    } 
}

export const retrieveCustomData = (cb: any) => {
    return (dispatch: any, getState: any) => {   
        axios.get(`${API_ROOT}/custom-data`)
        .then(({ data }) => {            
            dispatch({
                type: GET_CUSTOM_DATA,
                payload: data.data
            });
            if (!_.isNil(cb) && _.isFunction(cb)) {
                cb(data.data);                
            }
        })
    } 
}


