'use strict';
import Packery from 'packery';
import $ from 'zeptojs';
import PackElement from './PackElement';

class WidgetBlock {

    constructor(itemUI, data) {
        this.itemUI = itemUI;
        this.data = data;
        this.pckUIClass = `grid-ui-${this.itemUI.attr('id')}`;
        this.menuDataUI = [];
        this.gridElements = [];
        this.gridUiId = 'g-' + WidgetBlock.uid();

        this.menuUI = $(`<ul class="metro-menu" style="text-align: ${this.data.menuPosition}"></ul>`);
        this.menuUI.appendTo(this.itemUI);
        this.packeryContainerUI = $(`<div id="${this.gridUiId}" class="metro-grid ${this.pckUIClass}"></div>`).appendTo(this.itemUI);

        this.createMenu();
        this.createElements();
        this.initPackery();
        if (this.data.sections.length > 0) {
            const s = 0;
            this.selectSection(s, this.data.sections[s].ids);
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

    // create menu
    createMenu() {
        const _self = this;
        for (let i = 0; i < this.data.sections.length; i++) {
            let section = this.data.sections[i];
            let menuItem = $(`<li><div data-indx="${i}" data-sectionid="${section.ids}" class="menu-btn">${section.name}</div></li>`);
            const menuItemBtn = menuItem.find('.menu-btn');
            menuItemBtn.click(function(e) {
                e.preventDefault();
                _self.selectSection(parseInt(menuItemBtn.attr('data-indx')), menuItemBtn.attr('data-sectionid'));
            });
            this.menuDataUI.push(menuItem);
            menuItem.appendTo(this.menuUI);   
        }
    }

    // select menu item
    selectMenuItem(indx = 0) {
        for (let i = 0; i < this.menuDataUI.length; i++) {
            let item = this.menuDataUI[i].find('.menu-btn');
            item.css('color', this.data.menuColor);
            item.css('border-color', this.data.menuColor);
            item.css('cursor', 'pointer');
            if (i === indx) {
                item.css('cursor', 'default');
                item.css('color', this.data.menuSelectedColor);
                item.css('border-color', this.data.menuSelectedColor);
            }
        }
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
        this.startLoadFromSection(sectionId);
    }

    startLoadFromSection(sectionId) {
        if (this.gridElements.length > 0) {
            for (let i = 0; i < this.gridElements.length; i++) {
                const gridElement = this.gridElements[i];
                if (gridElement.getSectionIds() === sectionId) {
                    gridElement.loadMe();
                    break;
                }
                
            }
        }
    }

    selectSection(indx, sectionId) {
        this.selectedSection = {
            index: indx,
            sectionId: sectionId
        }
        indx = parseInt(indx);
        this.selectMenuItem(indx);
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

export default WidgetBlock;
