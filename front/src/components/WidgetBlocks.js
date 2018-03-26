import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Banner } from '@shopify/polaris';
import { getGalleries, broadcastMenuInfo, createGallery } from '../actions';
import CreateNewCard from './common/cards/CreateNewCard';
import GalleryCard from './common/cards/GalleryCard';
import NewGalleryModal from './common/modal/NewGalleryModal';
import type { GalleryCreatePayload } from '../beans';
import RaisedButton from 'material-ui/RaisedButton';
import VideoHelpModal from './common/modal/VideoHelpModal';

type Props = {
	broadcastMenuInfo: any
};

type State = {}

class WidgetBlocks extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			newModalOpen: false,
			openVideoTutorial: false
		};
	}

	componentWillMount() {
		this.props.getGalleries();		
	}

	componentDidMount() {
		// this.props.broadcastMenuInfo(<a href="#">hello</a>);
		this.props.broadcastMenuInfo(<div>::: My Widgets</div>);
	}

	createNew() {
		this.setState({ newModalOpen: true })
	}

	proceedCreate(event, data) {
        if (event) {
            event.preventDefault();
        }		
		this.setState({ newModalOpen: false })
		const payload: GalleryCreatePayload = {
			type: data.type,
			name: data.name
		};
		this.props.createGallery(payload, () => {
			ShopifyApp.flashNotice('Widget successfully created!');		
		});
	}

	renderModal() {
		if (this.state.newModalOpen) {
			return <NewGalleryModal minw="450px" onAccept={ (e, data) => this.proceedCreate(e, data) } onCancel={ () => this.setState({newModalOpen: false}) } title="New widget" />
		}
	}

	renderExistingGalleries() {
		if (!_.isNil(this.props.galleries) && _.isArray(this.props.galleries)) {
			return this.props.galleries.map(o => {
				return <GalleryCard key={o._id} gallery={o} cardTitle={ o.name } />
			});
		}
	}

	videoHelp(videoId, title='') {
		if (!_.isNil(videoId)) {
			this.videoId = videoId;
			this.videoTitle = title;
			this.setState({ openVideoTutorial: true })
		}
	}	

	renderCallToAction() {
		if (!_.isNil(this.props.galleries) && _.isArray(this.props.galleries) && this.props.galleries.length === 0) {
			return (
				<div className="welcome-start-info">
					<img src="/assets/img/arrow.png" />
					<p>Start by creating a new widget</p>
					<div className="tutorial-button">
						<a href="#" onClick={e => this.videoHelp('3-oKZ0E_3EI', 'Create filterable widget')} style={{display: 'inline-block'}}><span className="icon-play"></span>Watch video tutorial</a>
					</div>
				</div>			
			)
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
			<div className="row">			
				<div className="col-md-12">
					<CreateNewCard cardTitle="Create new" click={ () => this.createNew() } />
					{ this.renderCallToAction() }
					{ this.renderExistingGalleries() }
				</div>
				{ this.renderVideoModal() }
				{ this.renderModal() }
			</div>
		);
	}
}

WidgetBlocks.propTypes = {
	galleries: PropTypes.array
}
WidgetBlocks.defaultProps = {
	galleries: []
};

const mapStateToProps = ({galleries}) => {
	return {
		galleries
	}
}


export default connect(mapStateToProps, { getGalleries, broadcastMenuInfo, createGallery })(WidgetBlocks);
