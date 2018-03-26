import { MENU_INFO } from '../actions/Types';

export default (state = {}, action) => {
	switch(action.type) {
		case MENU_INFO:
			return action.payload
		default:
			return state;		
	}
	return state;
}