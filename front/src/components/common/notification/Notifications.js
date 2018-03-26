import React, { PureComponent } from 'react';
import Snackbar from 'material-ui/Snackbar';
import _ from 'lodash';

class Notifications extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			message: 'Saved',
			open: false,
			closeTime: 1500
		}
	}

	showNotification(message, closeTime) {
		this.setState({
			open: true,
			message: message || this.state.message,
			closeTime: closeTime || this.state.closeTime
		});
		setTimeout(() => {
			this.setState({ open: false });
		}, this.state.closeTime);
	}

	render() {
		return(
			<Snackbar
	        	open={ this.state.open }
	        	message={ this.state.message }
	        	autoHideDuration={ this.state.closeTime }
	        />			
		);
	}
}

export default Notifications;
