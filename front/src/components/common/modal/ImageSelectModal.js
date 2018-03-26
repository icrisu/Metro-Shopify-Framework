import React, { PureComponent } from "react";
import SimpleModal from './SimpleModal';
import _ from 'lodash';
import Utils from '../../../utils';

class SingleImageSelect extends PureComponent {

}

class ImageSelectModal extends SimpleModal {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    choose(selected) {
        this.setState({selected});
    }

    onAccept(e: any) {
        if (this.props.onAccept) {
            this.props.onAccept(this.props.images[this.state.selected]);
        }
    }     

    renderImages() {
        return this.props.images.map((img, indx) => {
            const selectedClass = (this.state.selected === indx) ? ' thumb-selected' : '';
            return (
                <div onClick={() => { this.choose(indx) }} className={`select-image-thumb${selectedClass}`} key={indx} style={{
                    backgroundImage: `url("${Utils.getImagePreferedSize('_250x', img)}")`
                }}>
                </div>
            );
        })
    }

    renderContent() {
        return(
            <div className="select-image-content">
                { this.renderImages() }
            </div>
        )
    }
}

export default ImageSelectModal;
