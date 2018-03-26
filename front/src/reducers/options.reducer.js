import { ACTION_EVENTS } from '../actions';

export default (state = {}, action) => {
	switch(action.type) {
		case ACTION_EVENTS.APP_OPTIONS:
			return action.payload
		default:
			return state;
	}
	return state;
}