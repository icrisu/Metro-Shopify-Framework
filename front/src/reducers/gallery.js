import { GET_GALLERY } from '../actions/Types';

export default (state = {}, action) => {
	switch(action.type) {
		case GET_GALLERY:
			return action.payload || {};
		default:
			return state;		
	}
	return state;
}