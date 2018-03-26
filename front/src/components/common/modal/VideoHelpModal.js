import React, { PureComponent } from "react";
import SimpleModal from './SimpleModal';
import _ from 'lodash';
import Utils from '../../../utils';

class VideoHelpModal extends SimpleModal {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    onAccept() {
        if (this.props.onAccept) {
            this.props.onAccept();
        }
    }     


    renderContent() {
        return(
            <div>
                <iframe width="100%" height="350" src={`https://www.youtube.com/embed/${this.props.videoId}`} frameBorder="0" allowFullScreen></iframe>
            </div>
        )
    }
}

export default VideoHelpModal;
