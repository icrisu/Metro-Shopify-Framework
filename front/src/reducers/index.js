import { combineReducers } from 'redux';
import GalleriesReducer from './galleries.reducer';
import menuInfo from './menuInfo';
import gallery from './gallery';
import customData from './customData';
// import OptionsReducer from './options.reducer';

const reducers = combineReducers({
	galleries: GalleriesReducer,
	menuInfo: menuInfo,
	gallery: gallery,
	customData: customData
});

export default reducers;
