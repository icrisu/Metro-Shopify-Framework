import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/editor/border-color';
import IconButton from 'material-ui/IconButton';
import CustomAlert from '../modal/CustomAlert';
import { removeGallery, cloneGallery } from '../../../actions';
import CloneGalleryModal from '../modal/CloneGalleryModal';

class GalleryCard extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			alertOpen: false,
			cloneCardAlert: false
		};		
	}

	// clone gallery
	cloneGallery() {
		this.setState({ cloneCardAlert: true })
	}

	proceedClone(e, data) {
		this.props.cloneGallery(this.props.gallery._id, data.name, () => {
			this.setState({ cloneCardAlert: false });
			ShopifyApp.flashNotice('Widget successfully cloned!');
		});
	}

	removeGallery() {
		this.setState({
			alertOpen: true
		});
	}

	removeGalleryNow(event) {
        if (event) {
            event.preventDefault();
        }
		this.setState({
			alertOpen: false
		});
		this.props.removeGallery(this.props.gallery._id, () => {
			return ShopifyApp.flashNotice('Widget successfully deleted!');
		});
	}	

	renderAlert() {
		if (this.state.alertOpen) {
			return(
				<CustomAlert minw="450px" onAccept={ (e, data) => this.removeGalleryNow(e, data) } onCancel={ () => this.setState({alertOpen: false}) } title="Alert">
					<p>{`Are you sure you want to permanently remove ${this.props.gallery.name} ?`}</p>
				</CustomAlert>
			)
		}
	}
	
	renderCloneModal() {
		if (this.state.cloneCardAlert) {
			return <CloneGalleryModal minw="450px" onAccept={ (e, data) => this.proceedClone(e, data) } onCancel={ () => this.setState({cloneCardAlert: false}) } title="Clone widget" />
		}
	}	

	render() {
		return(
			<div className="gallery-ui-list-item card-new card-gallery">
				<div className="clone-card">
					<IconButton
						onClick={ e => this.cloneGallery() }
						iconClassName="icon-copy2 remove-card-icon" tooltip="Clone widget"
						tooltipPosition="bottom-right"
					/>
				</div>			
				<div className="remove-card">
					<IconButton
						onClick={ e => this.removeGallery() }
						iconClassName="icon-trash-2 remove-card-icon" tooltip="Remove widget"
						tooltipPosition="bottom-left"
					/>
				</div>
				<Link to={`/app/widgets/${this.props.gallery.type}/${this.props.gallery._id}`}>
					<FloatingActionButton secondary={true} className="plus"
							iconStyle={{color: '#565656'}}
						>
						<EditIcon />
					</FloatingActionButton>
				</Link>
				<Link to={`/app/widgets/${this.props.gallery.type}/${this.props.gallery._id}`} className="card-info">{ this.props.cardTitle }</Link>
				{ this.renderAlert() }
				{ this.renderCloneModal() }
			</div>
		)
	}
}

export default connect(null, { removeGallery, cloneGallery })(GalleryCard);

