'use strict';
import $ from 'zeptojs';
import animation from './libs/animation';
animation($);

class PackElement {

    ui = null;
    isLoading = false;
    hasBeenLoaded = false;

    constructor(itemData, section, gap, parentWidth) {
        this.itemData = itemData;
        this.section = section;
        this.gap = gap;
        this.parentWidth = parentWidth;
        // console.log('ITEM DATA', itemData);
    }

    getSectionIds() {
        return this.section.ids;
    }

    onLoadedEvent(loadedCb) {
        this.loadedCb = loadedCb;
    }
    
	static getImagePreferedSize(size = '_400x', imgSrc) {
		if (imgSrc === '') {
			return '';
		}
		const n = imgSrc.lastIndexOf(".");
		const pre = imgSrc.substring(0, n);
		const after = imgSrc.substring(n, imgSrc.length);
		return `${pre}${size}${after}`;
    }
    
    getImageSrc() {
        let src = '';
		if (this.itemData.image.cdn && this.itemData.image.cUrl !== '') {
            src = this.itemData.image.cUrl;
		}
		if (this.itemData.image.url !== '' && !this.itemData.image.cdn) {
            let imageRecommendedSize = 400;
            if (this.parentWidth > 0) {
                imageRecommendedSize = (this.itemData.width * this.parentWidth) / 100;
                imageRecommendedSize += 140;
                imageRecommendedSize = Math.round(imageRecommendedSize);
            }
            src = PackElement.getImagePreferedSize(`_${imageRecommendedSize}x`, this.itemData.image.url);
        }
        return src;        
    }

    loadMe() {
        if (this.isLoading || this.hasBeenLoaded) {
            return;
        }
        this.isLoading = true;
        this.img = $('<img alt="" />');
        this.img.on('load', () => {
            this.hasBeenLoaded = true;
            this.ui.find('.metro-item-inside').animate({
                opacity: 1
            }, 300)
            if (this.loadedCb) {
                this.loadedCb(this.ui);
            }
            if (this.next) {
                this.next.loadMe();
            }
        });
        this.img.appendTo(this.ui.find('.img-inner'));
        this.img.attr('src', this.getImageSrc());
    }

    setNext(next) {
        if (next) {
            this.next = next;
        }
    }

    getVideo() {
        if (this.itemData.useVideo) {
            return `
                <video class="video-metro" muted loop autoPlay>
                    <source src=${this.itemData.videoUrl} type="video/mp4;codecs=&quot;avc1.42E01E, mp4a.40.2&quot;"></source>
                </video>
            `;
        } else {
            return '';
        }
    }

    hasVideo() {
        return this.itemData.useVideo && this.itemData.videoUrl !== '';
    }
    
    getImageOpacityStyle() {
        if (this.hasVideo()) {
            return 'opacity: 0'
        }
        return '';
    }

    hasUrl() {
        return this.itemData.url !== '';
    }

    itemCursorCSS() {
        if (this.hasUrl()) {
            return 'cursor: pointer'
        }
        return '';
    }

    prerender() {
        let headlineSizeCSS = '';
        if (this.itemData.headlineFontSize) {
            headlineSizeCSS = `;font-size: ${this.itemData.headlineFontSize}px;`;
        }
        let callToActionFontSizeCSS = '';
        if (this.itemData.callToActionFontSize) {
            callToActionFontSizeCSS = `;font-size: ${this.itemData.callToActionFontSize}px;`;
        }        
        this.ui = $(`
            <div style="
                width: ${this.itemData.width}%;
                padding: ${this.gap}px; ${this.itemCursorCSS()}
            " class="metro-grid-item ${this.section.ids}">
                <div class="metro-item-inside">
                    <div class="img-inner" style="${this.getImageOpacityStyle()}"></div>
                    ${this.getVideo()}
                    <div style="
                        background: ${this.itemData.overlayColor};
                        opacity: ${this.itemData.overlayOpacity}
                    " class="metro-overlay"></div>
                    <div class="metro-headlines ${this.itemData.headlinePosition}">
                        <div style="color: ${this.itemData.headlineColor}${headlineSizeCSS}" class="metro-headline">${this.itemData.headline}</div>
                        <div style="color: ${this.itemData.headlineColor}${callToActionFontSizeCSS}" class="metro-info">${this.itemData.headlineText.replace(/\n/g, "<br />")}</div>                        
                    </div>
                </div>
            </div>
        `);
        if (this.hasUrl()) {
            this.ui.click(() => {
                window.open(this.itemData.url, this.itemData.target);
            })
        }
        this.handleHover();
        return this.ui;
    }

    handleHover() {
        if (isNaN(this.itemData.overlayOpacity)) {
            return;
        }
        let overOpacity = this.itemData.overlayOpacity - 20;
        if (overOpacity < 0) {
            overOpacity = 0;
        }

        const _self = this;
        this.ui.on('mouseover', function(e) {
            $(this).find('.metro-overlay').animate({
                opacity: overOpacity
            }, 200)
        })
        this.ui.on('mouseout', function(e) {
            $(this).find('.metro-overlay').animate({
                opacity: _self.itemData.overlayOpacity
            }, 200)
        })        
    }
}

export default PackElement;


