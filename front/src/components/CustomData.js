import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card } from '@shopify/polaris';
import { broadcastMenuInfo, retrieveCustomData, updateCustomData } from '../actions';
import SaveLoaderButton from './common/buttons/SaveLoaderButton';
import { Banner } from '@shopify/polaris';

class CustomData extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isSaving: false,
			customCSS: ''
		}
	}

	componentDidMount() {
		this.props.broadcastMenuInfo(<div>>:: Customn CSS</div>);
	}

	componentWillMount() {
		this.props.retrieveCustomData();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.customData) {
			this.setState({ customCSS: nextProps.customData.customCSS });
		}
	}

	saveChanges() {
		this.setState({ isSaving: true });
		this.props.updateCustomData({
			customCSS: this.state.customCSS
		}, () => {
			setTimeout(() => {
				this.setState({ isSaving: false });
				ShopifyApp.flashNotice('Custom css saved!');
			}, 100);
		})
	}

	onCSSChange(e) {
		this.setState({ customCSS: e.currentTarget.value })
	}

	render() {
		return(
			<div className="row">			
				<div className="col-md-8">
					<Card title="Custom CSS" sectioned>
						<Banner
							status="info"
							>
							<p>Custom css allows you to further customize the look &amp; feel of the widgets. Add custom css below and save changes. 
								If you need help, feel free to contact us at <b>contact@eblocks.co</b></p>
						</Banner><br />					
						<textarea className="custom-css-display" 
							onChange={ this.onCSSChange.bind(this) } 
							value={this.state.customCSS}></textarea>
					</Card>
				</div>
				<div className="col-md-4">
					<Card title="Save data" sectioned>
                        <SaveLoaderButton 
                            onClick={ () => this.saveChanges() } 
                            isSaving={ this.state.isSaving } 
                            label="Save changes" primary={true} /><br />
					</Card>
				</div>				
			</div>
		);
	}
}

const mapStateToProps = ({ customData }) => {
	return {
		customData
	}
}

export default connect(mapStateToProps, { broadcastMenuInfo, retrieveCustomData, updateCustomData })(CustomData);
