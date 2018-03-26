import React, { PureComponent } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

class SaveLoaderButton extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isSaving: false
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.saveComplete) {
			this.setState({
				isSaving: false
			})
		}
	}	

	displayProgress() {
		if (this.props.isSaving) {
			return(
				<CircularProgress size={ 30 } className="pull-left" style={
					{
						opacity: .5, marginLeft: '15px', top: '2px'
					}
				} />				
			);			
		}
	}

	onClick(e) {
		e.preventDefault();
		if (!this.props.isSaving && typeof this.props.onClick === 'function') {
			this.props.onClick(e);
		}
	}

	render() {
		return(
			<div style={this.props.style || {}}>
				<RaisedButton onClick={ e => this.onClick(e) } label={this.props.label} primary={this.props.primary} disabled={ this.props.isSaving || this.props.disabled } className="pull-left" />
				{ this.displayProgress() }
				<div className="clearfix"></div>
			</div>
		);
	}
}

export default SaveLoaderButton;
