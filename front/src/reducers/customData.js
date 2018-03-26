import { GET_CUSTOM_DATA } from '../actions/Types';

export default (state = {}, action) => {
	switch(action.type) {
		case GET_CUSTOM_DATA:
			return action.payload || {};
		default:
			return state;		
	}
	return state;
}