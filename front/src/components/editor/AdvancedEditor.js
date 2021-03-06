import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import { broadcastMenuInfo, retrieveGallery, updateGallery } from '../../actions';
import RaisedButton from 'material-ui/RaisedButton';
import NewSectionModal from '../common/modal/NewSectionModal';
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc';
import Utils from '../../utils';
import { SectionHeaderStyle, SectionMoveButtonStyle, SectionNameStyle, 
    itemLeftBtn, itemRightBtn, itemEditBtn } from './beans/EditorStyles';
import IconButton from 'material-ui/IconButton';
import SaveLoaderButton from '../common/buttons/SaveLoaderButton';
import Notifications from '../common/notification/Notifications';
import TextField from 'material-ui/TextField';
import ItemEditModal from '../common/modal/ItemEditModal';
import { Banner } from '@shopify/polaris';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ColorPicker from 'material-ui-color-picker';


class AdvancedEditor extends Component {
    
    hasReceivedProps: false;

	constructor(props) {
        super(props);
        this.state = {
            newSectionOpen: false,
            isSaving: false,
            editItemModal: false,
            currentSelectedItem: null,
            currentSelectedItemSectionIndex: null,
            sections: [],
            gap: 1,
            menuPosition: 'right',
            menuColor: '#6B828E',
            menuSelectedColor: '#E88E0C'
        }
    } 

    // SORTABLE SECTION ITEMS
    SortableListItems = SortableContainer(({items, sectionIndex}) => {
        return (
        <div className="section-items-container">
            {items.map((value, index) => {
                return <this.SortableSectionItem key={`items-${index}`} index={index} sectionIndex={sectionIndex} item={value} />
            })}
        </div>
        );
    });
    SortableSectionItem = SortableElement((props) => {
            let imgUrl = '';
            if (props.item.image.cdn && props.item.image.cUrl != '') {
                imgUrl = `url("${props.item.image.cUrl}")`;
            } else {
                imgUrl = props.item.image.url || '';
                imgUrl = `url("${Utils.getImagePreferedSize('_250x', imgUrl)}")`;
            }
            
            return(
                <div className="sortable-section-item" style={{ backgroundImage: imgUrl }}>
                    <div className="section-item-inside">
                        <div className="left-top-btn">
                            <this.DragItemHandle />
                        </div>
                        <div className="right-top-btn">
                            <IconButton style={itemRightBtn}
                                onClick={ e => this.removeExistingItem(props.item, props.sectionIndex) }
                                iconClassName="icon-trash-2" tooltip="Remove item"
                                tooltipPosition="top-right"
                            />
                        </div>
                        <div style={itemEditBtn}>
                            <IconButton style={itemRightBtn}
                                onClick={ e => this.editExistingItem(props.item, props.sectionIndex) }
                                iconClassName="icon-edit-3" tooltip="Edit item"
                                tooltipPosition="top-center"
                            />
                        </div>                                                
                    </div>
                </div>
            )
        }
    );
    DragItemHandle = SortableHandle(props => {
        return(
            <IconButton
                iconClassName="icon-arrows" tooltip="Drag to change order"
                tooltipPosition="top-right"
            />
        )
    });      
    onItemsSortEnd = ({oldIndex, newIndex}, sectionIndex) => {
        let sectionsClone = _.cloneDeep(this.state.sections);
        sectionsClone[sectionIndex].items = arrayMove(sectionsClone[sectionIndex].items, oldIndex, newIndex);
        this.setState({
          sections: sectionsClone
        });
    };    
    // END SORTABLE SECTION ITEMS

    SortableList = SortableContainer(({items}) => {
        return (
        <div className="section-container"
            style={{
                listStyleType: 'none', padding: '0px', margin: '0px'
            }}
            >
            {items.map((value, index) => {
                return <this.SortableItem key={`item-${index}`} index={index} idx={index} section={value} />
            })}
        </div>
        );
    });

    DragHandle = SortableHandle(props => {
        return(
            <span className="icon-move-vertical" style={SectionMoveButtonStyle}></span>        
        )
    });       

    // section header
    renderSectionHeader(props) {
        let openClose;
        if (this.state.sections[props.indx].isOpen) {
            openClose = () => {
                return(
                    <div style={{float: 'right'}}>
                        <IconButton
                            onClick={ e => this.sectionOpen(props.indx, 'close') }
                            iconClassName="icon-keyboard_arrow_up" tooltip="Close section"
                            tooltipPosition="top-center"
                        />
                    </div>
                )
            }
        } else {
            openClose = () => {
                return(
                    <div style={{float: 'right'}}>
                        <IconButton
                            onClick={ e => this.sectionOpen(props.indx, 'open') }
                            iconClassName="icon-keyboard_arrow_down" tooltip="Open section"
                            tooltipPosition="top-center"
                        />
                    </div>
                )
            }
        }
        return(
            <div className="section-header" onClick={() => { this.sectionOpen(props.indx, (this.state.sections[props.indx].isOpen) ? 'close' : 'open') }} style={SectionHeaderStyle}>
                <div style={{float: 'left'}} onMouseDown={() => { this.onSortSectionsBeforeStart() }}>
                    <this.DragHandle />
                </div>
                <div className="section-name" style={SectionNameStyle}>
                    { props.name }
                </div>
                {openClose()}  
                <div style={{float: 'right'}}>
                    <IconButton
                        onClick={ e => this.removeSection(e, props.indx) }
                        iconClassName="icon-trash-2" tooltip="Remove section"
                        tooltipPosition="top-center"
                    />
                </div>
                <div className="clearfix" style={{clear: 'both'}}></div>
            </div>        
        )
    }

    // sortable element
    SortableItem = SortableElement((props) => {
            const displayContent = this.state.sections[props.idx].isOpen ? 'block' : 'none';
            return(
                <div>
                    { this.renderSectionHeader({
                        name: props.section.name,
                        indx: props.idx
                    }) }
                    
                    <div className="section-content-ui" style={{ display: displayContent, background: '#FFFFFF' }}>
                        <div className="section-content"
                            style={{ overflow: 'hidden', padding: '10px', paddingTop: '20px' }}
                            >
                            <div className="pull-right">
                                <TextField hintText="Section name" value={this.state.sections[props.idx].name} onChange={ (e) => {
                                this.onSectionNameChange(e, props.idx)
                                } }/><br />
                            </div>
                            <div className="pull-left">
                                <RaisedButton label="New item" onClick={ e => this.addNewItem(e, props.idx) } />
                            </div>
                            <div className="hr-line s-line"></div>
                            <div className="section-items">
                            <this.SortableListItems axis="xy" useDragHandle={true} sectionIndex={props.idx} items={this.state.sections[props.idx].items} onSortEnd={(payload) => this.onItemsSortEnd(payload, props.idx) } />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    );    

    componentWillMount() {
        this.props.retrieveGallery(this.props.match.params.id, () => {
            this.props.broadcastMenuInfo(<div>::: <Link to="/app">My Widgets</Link> > { this.props.gallery.name }</div>);
        });
    }
    
    componentWillReceiveProps(nextProps) {        
        if (nextProps.gallery && _.isArray(nextProps.gallery.sections)) {
            this.hasReceivedProps = true;
            this.setState({
                sections: nextProps.gallery.sections,
                gap: nextProps.gallery.gap || 1,
                menuPosition: nextProps.gallery.menuPosition,
                menuColor: nextProps.gallery.menuColor,
                menuSelectedColor: nextProps.gallery.menuSelectedColor
            });
        }
    }

    // create section
    createSection(e, sectionName) {
        if (e) {
            e.preventDefault();
        }
        this.setState({newSectionOpen: false});        
        this.setState({
            sections: [{
                name: sectionName,
                ids: Utils.uid(),
                isOpen: true,
                items: []
            }, ...this.state.sections]
        });
        setTimeout(() => {
            this.sectionOpen(0, 'open');
        }, 800);
    }

    // section name change
    onSectionNameChange(e, idx) {
        let sectionsClone = _.cloneDeep(this.state.sections);
        sectionsClone[idx].name = e.currentTarget.value;
        this.setState({
            sections: sectionsClone
        });
    }    

    // remove section
    removeSection(e, sectionIndex) {
        e.stopPropagation();
        if (confirm('Are you sure you want to remove the current section?')) {
            let sectionsClone = _.cloneDeep(this.state.sections);
            sectionsClone.splice(sectionIndex, 1);
            this.setState({
                sections: sectionsClone
            });
        }
    }

    // open/close section
    sectionOpen(sectionIndex, what) {
        let sectionsClone = _.cloneDeep(this.state.sections);
        for (let i = 0; i < sectionsClone.length; i++) {            
            if (i !== sectionIndex) {
                sectionsClone[i].isOpen = false;
            } else {
                if (what === 'close') {
                    sectionsClone[i].isOpen = false;
                } else if (what === 'open'){
                    sectionsClone[i].isOpen = true;
                }
            }
        }
        this.setState({
            sections: sectionsClone
        });
    }

    // save changes
    saveChanges() {
        this.setState({ isSaving: true });
        this.props.updateGallery(this.props.match.params.id, {
            sections: this.state.sections,
            gap: this.state.gap,
            menuPosition: this.state.menuPosition,
            menuColor: this.state.menuColor,
            menuSelectedColor: this.state.menuSelectedColor
        }, () => {
            setTimeout(() => {
                this.setState({ isSaving: false });
                if (this.notification) {
                    this.notification.showNotification(`Saved!`, 2000);
                }
            }, 300);    
        });
    }

    renderNewSectionModal() {
		if (this.state.newSectionOpen) {
			return <NewSectionModal minw="450px" onAccept={ (e, data) => this.createSection(e, data) } onCancel={ () => this.setState({newSectionOpen: false}) } title="New section" />
		}
    }
    
    // render sections
    renderSections() {
        return this.state.sections.map((s, indx) => {
            return <p key={indx}>Sec: { s.name }</p>
        })
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
          sections: arrayMove(this.state.sections, oldIndex, newIndex),
        });
    };

    onSortSectionsBeforeStart() {
        this.sectionOpen(-1, 'close');
    }

    addNewItem(e, sectionIndex) {
        this.setState({ currentSelectedItemSectionIndex: sectionIndex, currentSelectedItem: null, editItemModal: true });
    }

    editExistingItem(item, sectionIndex) {
        this.setState({ currentSelectedItemSectionIndex: sectionIndex, currentSelectedItem: item, editItemModal: true });
    }

    removeExistingItem(item, sectionIndex) {
        if (confirm('Are you sure you want to remove this item?')) {
            let sectionsClone = _.cloneDeep(this.state.sections);
            for (let i = 0; i < sectionsClone[sectionIndex].items.length; i++) {
                if (sectionsClone[sectionIndex].items[i].ids === item.ids) {
                    sectionsClone[sectionIndex].items.splice(i, 1);
                }
            }            
            this.setState({
                sections: sectionsClone
            });
        }        
    }

    // render edit item modal
    renderEditItemModal() {
        if (this.state.editItemModal) {
            return (
                <ItemEditModal 
                    item={ this.state.currentSelectedItem }
                    sectionIndex={ this.state.currentSelectedItemSectionIndex }
                    minw="750px"
                    smallNav={true}
                    hasCancel={true}
                    onAccept={ (e, data) => this.editItemComplete(e, data) } 
                    onCancel={ () => this.setState({editItemModal: false}) } 
                    title="Edit item" />
            )
        }
    }

    // edit item complete
    editItemComplete(item, sectionIndex) {
        this.setState({editItemModal: false});
        this.replaceOrAddItem(sectionIndex, item);
    }

    // find item in section
    replaceOrAddItem(sectionIndex, item) {
        let sectionsClone = _.cloneDeep(this.state.sections);
        let updated = false;
        for (let i = 0; i < sectionsClone[sectionIndex].items.length; i++) {
            if (sectionsClone[sectionIndex].items[i].ids === item.ids) {
                // edit mode
                updated = true;
                sectionsClone[sectionIndex].items[i] = item;
            }
        }
        if (!updated) {
            // add new item to section
            sectionsClone[sectionIndex].items.push(item);
        }
        this.setState({ sections: sectionsClone});
        return item;
    }

    changeGap(e) {
        this.setState({gap: e.currentTarget.value});
    }

	handleMenuPosition(event, value) {
		this.setState({
			menuPosition: value
		});			
    }

    menuColorChange(color) {
		this.setState({
			menuColor: color
		});	        
    }

    menuColorSelectedChange(color) {
		this.setState({
			menuSelectedColor: color
		});	         
    }

    renderColorPickerHack(type = 'menuColor') {
        if (this.hasReceivedProps) {
            if (type === 'menuColor') {
                return(
                    <div style={{ width: '100px', overflowX: 'hidden' }}>
                        <ColorPicker id="cp-23747322" ref={ colorInput => this.colorInput = colorInput }
                            defaultValue={this.state.menuColor}
                            fullWidth={true}
                            onChange={this.menuColorChange.bind(this)}
                        />
                    </div>    
                )
            } else if (type === 'menuSelectedColor') {
                return(
                    <div style={{ width: '100px', overflowX: 'hidden' }}>
                        <ColorPicker id="cp-23747322"
                            defaultValue={this.state.menuSelectedColor}
                            fullWidth={true}
                            onChange={this.menuColorSelectedChange.bind(this)}
                        />                                
                    </div> 
                )
            }
        }
    }

	render() {
		return(
			<div className="row">			
				<div className="col-md-8">
					<Card title={`Widget block: ${ this.props.gallery.name }`} className="card-display" sectioned>
						<Banner
							status="info"
							>
							<p>Below you can create sections, than add items to each section. Find out more within the "FAQ/Documentation" section.</p>
						</Banner><br />
                        <RaisedButton label="Create new section" primary={true} onClick={ e => this.setState({newSectionOpen: true}) } />
                        <div className="sections">
                            <this.SortableList useDragHandle={true} axis="y" items={this.state.sections} pressDelay={50} onSortEnd={this.onSortEnd}  />                            
                        </div>
					</Card>
				</div>
				<div className="col-md-4">
					<Card title="Save data" className="card-display" sectioned>
                        <SaveLoaderButton 
                            onClick={ () => this.saveChanges() } 
                            isSaving={ this.state.isSaving } 
                            label="Save changes" primary={true} /><br />
					</Card>
					<Card title="Shortcode" className="card-display" sectioned>
                        <div className="shortcode-display">
                            { `<div id="${this.props.gallery.galleryId}" class="metro"></div>` }
                        </div>
						<Banner
							status="info"
							>
							<p>Paste the shortcode above within one of your pages or your store's homepage. Find out more within the "FAQ/Documentation" section.</p>
						</Banner>
					</Card>
					<Card title="Settings" className="card-display" sectioned>
                        <div className="row space-bottom-medium">
                            <div className="col-md-6">
                                <p className="card-subtitle">Menu color</p>
                                { this.renderColorPickerHack('menuColor') }                                               
                            </div>
                            <div className="col-md-6">
                                <p className="card-subtitle">Menu selected color</p>
                                { this.renderColorPickerHack('menuSelectedColor') }                                                     
                            </div>                            
                        </div>
                        <div className="row space-bottom-medium">
                            <div className="col-md-6">
                                <p className="card-subtitle">Menu position</p>
                                <RadioButtonGroup onChange={this.handleMenuPosition.bind(this)} name="shipSpeedo" valueSelected={this.state.menuPosition}>
                                    <RadioButton
                                    value="right"
                                    label="Right"
                                    />
                                    <RadioButton
                                    value="left"
                                    label="Left"
                                    />
                                    <RadioButton
                                    value="center"
                                    label="Center"
                                    />                    
                                </RadioButtonGroup>                              
                            </div>  
                            <div className="col-md-6">
                                <p className="card-subtitle">Items gap</p>
                                <TextField
                                    fullWidth={true}
                                    hintText="Items distance"
                                    floatingLabelText="Distance"
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={this.state.gap}
                                    onChange={ this.changeGap.bind(this) }
                                />                            
                            </div>
                        </div>
					</Card>                                                                              
				</div>
                <Notifications ref={ n => { this.notification = n } } />
                { this.renderNewSectionModal() }
                { this.renderEditItemModal() }
			</div>
		);
	}
}

const mapStateToProps = ({ gallery }) => {
    return {
        gallery
    }
}


export default connect(mapStateToProps, { broadcastMenuInfo, retrieveGallery, updateGallery })(AdvancedEditor);
