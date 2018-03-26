import { GET_GALLERIES } from '../actions/Types';

export default (state = [], action) => {
	switch(action.type) {
		case GET_GALLERIES:
			return action.payload || [];
		default:
			return state;		
	}
	return state;
}