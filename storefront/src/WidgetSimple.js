'use strict';
import Packery from 'packery';
import $ from 'zeptojs';
import PackElement from './PackElement';

class WidgetSimple {

    constructor(itemUI, data) {
        this.itemUI = itemUI;
        this.data = data;
        this.pckUIClass = `grid-ui-${this.itemUI.attr('id')}`;
        this.menuDataUI = [];
        this.gridElements = [];
        this.gridUiId = 'g-' + WidgetSimple.uid();
        this.packeryContainerUI = $(`<div id="${this.gridUiId}" class="metro-grid ${this.pckUIClass}"></div>`).appendTo(this.itemUI);
        this.createElements();
        this.initPackery();
        if (this.data.sections.length > 0) {
            this.selectSection(0, this.data.sections[0].ids);
        }        
    }

    // init packery
    initPackery() {
        var elem = document.querySelector(`#${this.gridUiId}`);
        this.pckry = new Packery( elem, {
          // options
          itemSelector: '.metro-grid-item',
          gutter: 0
        }); 
    }

    selectItemsFromSection(sectionId) {
        this.packeryContainerUI.find('.metro-grid-item').each(function(indx) {
            if ($(this).hasClass(sectionId)) {
                $(this).css('display', 'block');
            } else {
                $(this).css('display', 'none');
            }
        });
        this.pckry.layout();
    }

    selectSection(indx, sectionId) {
        this.selectedSection = {
            index: indx,
            sectionId: sectionId
        }
        indx = parseInt(indx);
        this.selectItemsFromSection(sectionId);
    }

    // create elements
    createElements() {
        let elemCount = 0;
        for (let i = 0; i < this.data.sections.length; i++) {
            let section = this.data.sections[i];
            for (let k = 0; k < section.items.length; k++) {
                const itm = section.items[k];
                let packElement = new PackElement(section.items[k], section, this.data.gap, this.packeryContainerUI.width());
                const itemUI = packElement.prerender();
                this.packeryContainerUI.append(itemUI);
                this.gridElements.push(packElement);
                packElement.onLoadedEvent((itemUI) => {
                    this.pckry.layout();
                })
                if (this.gridElements[elemCount-1]) {
                    this.gridElements[elemCount-1].setNext(packElement);
                }
                elemCount++;
            }
        }
        if (this.gridElements.length > 0) {
            this.gridElements[0].loadMe();
        }
        this.packeryContainerUI.append($('<div class="metroclear"></div>'));
    }

	static uid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}    
}

export default WidgetSimple;
