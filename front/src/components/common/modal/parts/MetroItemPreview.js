import React, { PureComponent } from 'react';
import Utils from '../../../../utils';

class MetroItemPreview extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item
        }
    }

    extractImageUrl() {
        let src = '';
		if (this.state.item.image.cdn && this.state.item.image.cUrl !== '') {
            src = this.state.item.image.cUrl;
		}
		if (this.state.item.image.url !== '' && !this.state.item.image.cdn) {
            src = Utils.getImagePreferedSize('_400x', this.state.item.image.url);
        }
        return src;
    }

    getOverlayStyle() {
        return {
            opacity: this.state.item.overlayOpacity,
            backgroundColor: this.state.item.overlayColor
        }
    }

    getTextStyleHeadline() {
        let style = {
            color: this.state.item.headlineColor
        }
        if (this.state.item.headlineFontSize) {
            style.fontSize = this.state.item.headlineFontSize + 'px';
        }
        return style;
    }

    getTextStyleCallToAction() {
        let style = {
            color: this.state.item.headlineColor
        }
        if (this.state.item.callToActionFontSize) {
            style.fontSize = this.state.item.callToActionFontSize + 'px';
        }        
        return style;
    }    

    getVideo() {
        if (this.state.item.useVideo) {
            return (
                <video className="video-metro" muted loop autoPlay>
                    <source src={ this.state.item.videoUrl } type="video/mp4;codecs=&quot;avc1.42E01E, mp4a.40.2&quot;"></source>
                </video>
            )
        }
    }

    hasVideo() {
        return this.state.item.useVideo && this.state.item.videoUrl !== '';
    }

    render() {       
        return (
            <div className="item-preview">
                <img className="img-ui" style={{ opacity: this.hasVideo() ? 0 : 1 }} src={this.extractImageUrl()} />
                { this.getVideo() }
                <div style={this.getOverlayStyle()} className="item-preview-overlay"></div>
                <div className={`metro-headlines ${this.state.item.headlinePosition}`}>
                    <p style={this.getTextStyleHeadline()} className="metro-headline">{this.state.item.headline}</p>
                    <div className="metro-info" style={this.getTextStyleCallToAction()} dangerouslySetInnerHTML={{ __html: this.state.item.headlineText.replace(/\n/g, "<br />") }}></div>
                </div>
            </div>
        )
    }
}

export default MetroItemPreview;
