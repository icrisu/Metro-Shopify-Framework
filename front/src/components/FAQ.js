import React, { PureComponent } from 'react';
import { Card } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import VideoHelpModal from './common/modal/VideoHelpModal';

class FAQ extends PureComponent {
	
	videoId = null;
	videoTitle = '';

	constructor(props) {
		super(props);
		this.state = { openVideoTutorial: false };
	}

	videoHelp(videoId, title='') {
		if (!_.isNil(videoId)) {
			this.videoId = videoId;
			this.videoTitle = title;
			this.setState({ openVideoTutorial: true })
		}
	}

	videoTutorialComplete(e, data) {
		this.setState({openVideoTutorial: false});
	}

	renderVideoModal() {
		if (this.state.openVideoTutorial) {
			return (
				<VideoHelpModal 
				videoId={ this.videoId }
				minw="700px"
				smallNav={true}
				hasCancel={false}
				onAccept={ (e, data) => this.videoTutorialComplete(e, data) } 
				onCancel={ () => this.setState({openVideoTutorial: false}) } 
				title={ this.videoTitle } />
			);
		}
	}

	render() {
		return(
			<div className="row-spacing row">
				<div className="col-md-8">
					<Card title="FAQ" sectioned>
						<div className="faq-group">
							<p><b>About</b></p>
							<p>Metro is widget builder that shows your store's categories or products in an interactive way. Metro is best fit for your store's homepage where you can point visitors to their desired products/categories right from the start.</p>
						</div>
						<div className="faq-group">
							<p><b>Widget types</b></p>
							<p>With Metro you can create two types of widgets: simple and filterable. Using the filterable feature you can segment categories further. A filterable widget block could have sections like: Men, Women, Children and each section could have different items that could point to a certain category.</p>						
						</div>
						<div className="faq-group">
							<p><b>Adding widgets to your storefront</b></p>
							<p>Once you've created a widget block, within edit mode, on the ride side panel you can copy the "widget shortcode" and add it within your store's homepage, or any other page. Please see the "Videos / how to" from the right side.</p>	
						</div>
						<div className="faq-group">
							<p><b>Settings &amp; custom CSS</b></p>
							<p>For each widget you can adjust menu color, selected color, menu position and items gap within the edit mode. Also you can adjust multiple settings for each item. You can also add custom CSS from within the <Link to="/app/custom-data">Custom CSS</Link> section. If you need help, feel free to contact us at <b>contact@eblocks.co</b>.</p>						
						</div>
						<div className="faq-group">
							<p><b>Uninstall</b></p>
							<p>The app handles uninstall gracefully, we do not keep files within your theme's folder. Basically you don't have to do anything, however if you did add widget div shortcodes to your theme, you might want to remove those even if it does not have any functional or visual impact to your theme. Please see the "Videos / how to" from the right side.</p>
						</div>
					</Card>
				</div>
				<div className="col-md-4">
					<Card title="Support" sectioned>
						<p>If you need help, feel free to contact us at <b>contact@eblocks.co</b>.</p>
						<br />
						<p>Both support and custom integration with your theme are free.</p>
					</Card>
					<Card title="Videos / How to" sectioned>
						<p>Below you can find video tutorials on how to create &amp; remove widget blocs.</p>
						<br />
						<div className="video-tutorials">
							<a className="video-tutorial-link" onClick={ e => this.videoHelp('4sVQqcoyNH4', 'Place shortcode within homepage') } href="#">Place shortcode within storefront homepage</a>
							<a className="video-tutorial-link" onClick={ e => this.videoHelp('KajcDxM6Ous', 'Place shortcode within regular page') } href="#">Place shortcode within regular page</a>
							<a className="video-tutorial-link" onClick={ e => this.videoHelp('3-oKZ0E_3EI', 'Create filterable widget') } href="#">Create filterable widget</a>
							<a className="video-tutorial-link" onClick={ e => this.videoHelp('_7x-gd4luwc', 'Create simple widget') } href="#">Create simple widget</a>
							<a className="video-tutorial-link" onClick={ e => this.videoHelp('OH13lyY0slA', 'Remove shortcode') } href="#">Remove shortcode within storefront</a>
						</div>
					</Card>									
				</div>
				{ this.renderVideoModal() }
			</div>
		);
	}
}

export default FAQ;
