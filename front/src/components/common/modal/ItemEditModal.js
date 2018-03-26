import React from "react";
import SimpleModal from './SimpleModal';
import _ from 'lodash';
import { Tabs } from '@shopify/polaris';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import ImageSelectHandler from '../../../utils/ImageSelectHandler';
import ImageSelectModal from './ImageSelectModal';
import Utils from '../../../utils';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ColorPicker from 'material-ui-color-picker';
import Slider from 'material-ui/Slider';
import MetroItemPreview from './parts/MetroItemPreview';
import { Banner } from '@shopify/polaris';

const buildDefaultItem = () => {
	return {
		ids: Utils.uid(),
		image: {
			cdn: false,
			url: '',
			cUrl: ''// https://dummyimage.com/600x400/000/fff
		},
		url: '',
		target: '_self',
		headline: '',
		headlineText: '',
		headlinePosition: 'top_left',
		headlineColor: '#e3dfbf',
		overlayColor: '#000000',
		overlayOpacity: .2,
		width: '33.33',
		useVideo: false,
		videoUrl: '',
		headlineFontSize: 24,
		callToActionFontSize: 18
	}
}

class ItemEditModal extends SimpleModal {
    constructor(props) {
		super(props);
		const defaultItem = buildDefaultItem();
		let item = props.item || defaultItem;
		if (!item.headlineFontSize) {
			item.headlineFontSize = defaultItem.headlineFontSize;
		}
		if (!item.callToActionFontSize) {
			item.callToActionFontSize = defaultItem.callToActionFontSize;
		}		
        this.state = {
			item: item,
			sectionIndex: props.sectionIndex,
			selected: 0,
			isChoosingImage: false,
			imageSelect: false,
			currentRawImages: []
		}
	}
	
	componentWillMount() {
		this.setState({opacityIntermediate: this.state.item.overlayOpacity});
	}
	
	onTabSelect(selected) {
		this.setState({selected})
	}

	useImageFromUrl(e) {
		this.setState({
			item: { ...this.state.item, image: { ...this.state.item.image, cdn: !this.state.item.image.cdn }}
		});
	}

	updateCustomUrl(e) {
		this.setState({
			item: { ...this.state.item, image: { ...this.state.item.image, cUrl: e.currentTarget.value }}
		});		
	}

	// upload image
	uploadImage(from = 'product') {
		if (this.state.isChoosingImage) {
			return;
		}
		this.setState({isChoosingImage: true});
		if (from === 'product') {
			ImageSelectHandler.selectFromProducts((success, images) => {
				this.setState({isChoosingImage: false});
				if (!success) return;
				this.setState({currentRawImages: images, imageSelect: true});
			}, true)
		}
		if (from === 'collection') {
			ImageSelectHandler.selectFromCollections((success, images) => {
				this.setState({isChoosingImage: false});
				if (!success) return;
				this.onSelectedImage(images[0])
			}, true)
		}		
	}

	onSelectedImage(image) {
		this.setState({currentRawImages: [], imageSelect: false});
		this.setState({
			item: { ...this.state.item, image: { ...this.state.item.image, url: image }}
		})
	}
	

	renderImageThumb() {
		if (this.state.item.image.cdn && this.state.item.image.cUrl !== '') {
			return <img className="thumb-preview" src={this.state.item.image.cUrl} />
		}
		if (this.state.item.image.url !== '' && !this.state.item.image.cdn) {
			return <img className="thumb-preview" src={Utils.getImagePreferedSize('_350x', this.state.item.image.url)} />
		}
	}

	urlOnChange(e) {
		this.setState({
			item: { ...this.state.item, url: e.currentTarget.value }
		});
	}

	handleTargetChange(event, value) {
		this.setState({
			item: { ...this.state.item, target: value }
		});
	}

	headlineChange(e) {
		this.setState({
			item: { ...this.state.item, headline: e.currentTarget.value }
		});		
	}

	headlineTextChange(e) {
		this.setState({
			item: { ...this.state.item, headlineText: e.currentTarget.value }
		});		
	}

	handleHeadlinePositionChange(event, value) {
		this.setState({
			item: { ...this.state.item, headlinePosition: value }
		});
	}

	headlineColorChange(color) {
		this.setState({
			item: { ...this.state.item, headlineColor: color }
		});	
	}

	overlayColorChange(color) {
		this.setState({
			item: { ...this.state.item, overlayColor: color }
		});		
	}

	opacityChange(e, value) {
		this.setState({ opacityIntermediate: value })	
	}

	setOverlayOpacity() {
		this.setState({
			item: { ...this.state.item, overlayOpacity: this.state.opacityIntermediate }
		});	
	}

	handleWidthChange(event, value) {
		this.setState({
			item: { ...this.state.item, width: value }
		});			
	}

	useVideoAsPreview(e) {
		this.setState({
			item: { ...this.state.item, useVideo: !this.state.item.useVideo }
		});
	}

	updateVideoUrl(e) {
		this.setState({
			item: { ...this.state.item, videoUrl: e.currentTarget.value }
		});		
	}
	
	headlineFontSizeChange(e) {
		this.setState({
			item: { ...this.state.item, headlineFontSize: e.currentTarget.value }
		});		
	}
	
	callToActionFontSizeChange(e) {
		this.setState({
			item: { ...this.state.item, callToActionFontSize: e.currentTarget.value }
		});		
	}	

	// Render image selection
	renderImageUI() {
		if (this.state.selected === 0) {
			return (
				<div className="row">
					<div className="col-md-6">
  						<div className="item-controll-info">
							<RaisedButton onClick={ () => this.uploadImage('product') } label="Upload from products" primary={true} disabled={this.state.item.image.cdn} />
							<p>Choose an image from your products</p>
						</div>
						<div className="item-controll-info">
							<RaisedButton onClick={ () => this.uploadImage('collection') } label="Upload from collections" primary={true} disabled={this.state.item.image.cdn} />
							<p>Choose an image from your collections</p>
						</div>
						<div className="item-controll-info">
							<Checkbox
								label="Use image from url"
								checked={this.state.item.image.cdn}
								onCheck={this.useImageFromUrl.bind(this)}
							/>
							<TextField value={this.state.item.image.cUrl} onChange={this.updateCustomUrl.bind(this)} hintText="Image url" disabled={!this.state.item.image.cdn} /><br />
						</div>																	
                    </div>
					<div className="col-md-6">
  						{this.renderImageThumb()}
                    </div>
				</div>
			)
		}
	}

	// render settings
	renderSettings() {
		if (this.state.selected === 1) {
			return (
				<div className="row item-settings">
					<div className="col-md-6">
						<div className="item-settings-block">
							<p className="title">Item link</p>
							<div className="content">
								<TextField
									hintText="url/link"
									value={this.state.item.url}
									onChange={this.urlOnChange.bind(this)}
								/><br /><br />
								<RadioButtonGroup onChange={this.handleTargetChange.bind(this)} name="shipSpeed" defaultSelected={this.state.item.target}>
									<RadioButton
									value="_self"
									label="Self"
									/>
									<RadioButton
									value="_blank"
									label="Blank"
									/>
								</RadioButtonGroup>
							</div>
						</div>
						<div className="item-settings-block">
							<p className="title">Item overlay</p>
							<div className="content">
								<p className="small-info">Overlay color</p>
								<ColorPicker id="cp-2374732"
									defaultValue={this.state.item.overlayColor}
									onChange={this.overlayColorChange.bind(this)}
								/><br />
								<p className="small-info">Overlay opacity { Math.round(this.state.opacityIntermediate * 100) }%</p>
								<Slider onDragStop={ this.setOverlayOpacity.bind(this) } onChange={this.opacityChange.bind(this)} defaultValue={this.state.item.overlayOpacity} />						
							</div>
						</div>
                    </div>
					<div className="col-md-6">
						<div className="item-settings-block">
							<p className="title">Item headlines / Call to action</p>
							<div className="content">
								<TextField
									hintText="Main headline"
									value={this.state.item.headline}
									onChange={this.headlineChange.bind(this)}
								/><br /><br />
								<TextField
									value={this.state.item.headlineText}
									onChange={this.headlineTextChange.bind(this)}
									rowsMax={4}
									hintText="Message Field"
									floatingLabelText="Call to action message"
									multiLine={true}
									rows={2}
								/><br /><br />
								<p className="small-info">Text color</p>
								<ColorPicker id="cp-2374732"
									defaultValue={this.state.item.headlineColor}
									onChange={this.headlineColorChange.bind(this)}
								/><br />								
								<p className="small-info">Headline position</p><br />
								<RadioButtonGroup onChange={this.handleHeadlinePositionChange.bind(this)} name="shipSpeed" defaultSelected={this.state.item.headlinePosition}>
									<RadioButton
									value="top_left"
									label="Top left"
									/>
									<RadioButton
									value="top_right"
									label="Top right"
									/>
									<RadioButton
									value="top_center"
									label="Top center"
									/>									
									<RadioButton
									value="bottom_left"
									label="Bottom left"
									/>
									<RadioButton
									value="bottom_right"
									label="Bottom right"
									/>
									<RadioButton
									value="bottom_center"
									label="Bottom center"
									/>
									<RadioButton
									value="center_center"
									label="Center"
									/>									
								</RadioButtonGroup>																						
							</div>
						</div>
                    </div>					
				</div>
			)
		}
	}

	renderSizeRadioButton(size, label) {
		return (
			<RadioButton
			value={size}
			label={label}
			/>	
		)
	}
	// render item size
	renderSize() {
		if (this.state.selected === 2) {
			return (
				<div className="row item-settings">
					<div className="col-md-6">
						<Banner
							status="info"
							>
							<p>By default there all items have a size of 33%, which will render as three columns.</p>
						</Banner>
						<div className="item-settings-block space-top-medium">
							<p className="title">Font size</p>
							<div className="content">
								<TextField
									hintText="Font size"
									floatingLabelText="Headline font size"
									type="number" min="8" max="100"
									value={this.state.item.headlineFontSize}
									onChange={this.headlineFontSizeChange.bind(this)}
								/><br /><br />
								<TextField
									hintText="Font size"
									floatingLabelText="Call to action font size"
									type="number" min="8" max="100"
									value={this.state.item.callToActionFontSize}
									onChange={this.callToActionFontSizeChange.bind(this)}
								/><br /><br />				
							</div>
						</div>						
					</div>
					<div className="col-md-6">
						<div className="item-settings-block">
							<p className="title">Item size / width</p>
							<div className="content">
								<RadioButtonGroup name="i-size" onChange={this.handleWidthChange.bind(this)} defaultSelected={this.state.item.width}>
										{ this.renderSizeRadioButton('25', '25%') }
										{ this.renderSizeRadioButton('30', '30%') }
										{ this.renderSizeRadioButton('33.33', '33%') }
										{ this.renderSizeRadioButton('40', '40%') }
										{ this.renderSizeRadioButton('50', '50%') }
										{ this.renderSizeRadioButton('60', '60%') }
										{ this.renderSizeRadioButton('70', '70%') }
										{ this.renderSizeRadioButton('75', '75%') }
										{ this.renderSizeRadioButton('100', '100%') }																												
								</RadioButtonGroup>							
							</div>
						</div>					
					</div>					
				</div>
			);
		}
	}

	// render item video
	renderVideo() {
		if (this.state.selected === 3) {
			return (
				<div className="row item-settings">
					<div className="col-md-6">
						<Banner
							status="info"
							>
							<p>Preview will play a video (no sound). In order to keep proportions an image for the item is still mandatory.</p>
						</Banner>
					</div>
					<div className="col-md-6">
						<div className="item-settings-block">
							<p className="title">Video settings</p>
							<div className="content">
								<Checkbox
									label="Use video as preview"
									checked={this.state.item.useVideo}
									onCheck={this.useVideoAsPreview.bind(this)}
								/>
								<TextField value={this.state.item.videoUrl} onChange={this.updateVideoUrl.bind(this)} hintText="Video url (.mp4)" disabled={!this.state.item.useVideo} /><br />
							</div>
						</div>					
					</div>					
				</div>
			);
		}
	}	

	renderPreview() {
		if (this.state.selected === 4) {
			return (
				<div className="row item-settings">
					<div className="col-md-6">
						<Banner
							status="info"
							>
							<p>Please note that the item preview might not look exactly as it would within your storefront.</p>
						</Banner>
					</div>
					<div className="col-md-6">
						<MetroItemPreview item={this.state.item} />
					</div>					
				</div>
			)
		}
	}
	

    renderContent() {
        return(
			<div className="item-edit-modal-content">
				<div className="tabs-ui">
					<Tabs
					onSelect={(tbIndx) => this.onTabSelect(tbIndx)}
					selected={this.state.selected}
					tabs={[
						{
							id: 'img',
							title: 'Image',
							panelID: 'img-content',
						},
						{
							id: 'settings',
							title: 'Settings',
							panelID: 'settings-content',
						},
						{
							id: 'size',
							title: 'Item width & font sizes',
							panelID: 'size-content',
						},
						{
							id: 'video',
							title: 'Video',
							panelID: 'video-content',
						},												
						{
							id: 'preview-c',
							title: 'Preview',
							panelID: 'preview',
						}
					]}
					/>					
				</div>
				<div className="clearfix"></div>
                <div className="item-tabs-content">
					{ this.renderImageUI() }
					{ this.renderSettings() }
					{ this.renderSize() }
					{ this.renderVideo() }
					{ this.renderPreview() }
                </div>
			   { this.renderImageSelect() }
            </div>
        )
	}
	
	renderImageSelect() {
		if (this.state.imageSelect) {
			return (
				<ImageSelectModal 
				images={this.state.currentRawImages}
				minw="780px"
				zindex= '9999991'
				smallNav={true}
				hasCancel={true}
				onAccept={ (e, data) => this.onSelectedImage(e, data) } 
				onCancel={ () => this.setState({imageSelect: false}) } 
				title="Select image" />
			);
		}
	}

    onAccept(e: any) {
		if (this.state.item.image.cdn === true && this.state.item.image.cUrl === '') {
			return ShopifyApp.flashNotice('Please select an image for this item');
		}
		if (this.state.item.image.url === '' && this.state.item.image.cdn === false) {
			return ShopifyApp.flashNotice('Please select an image for this item');
		}
        if (this.props.onAccept) {
            this.props.onAccept(this.state.item, this.state.sectionIndex);
        }
    } 	
}

export default ItemEditModal;
