import React from "react";
import SimpleModal from './SimpleModal';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const radioButtonsStyle = {
    marginBottom: 16
}

class CloneGalleryModal extends SimpleModal {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            name: '',
            nameError: null
        }
    }

    onAccept(event) {
        if (event) {
            event.preventDefault();
        }
        this.setState({ nameError: null });
        if (this.state.name === '') {
            this.setState({ nameError: 'This field is required' });
            return;
        }
        if (this.props.onAccept) {
            const r = { name: this.state.name }
            this.props.onAccept(event, r);
        }
    }      

    renderContent() {
        if (this.props.children) {
            return this.props.children;
        }        
        return(
            <div className="content-override">
                <form onSubmit={ (e) => this.onAccept(e) }>
                    <TextField
                        hintText="Name"
                        floatingLabelText="Cloned widget name"
                        fullWidth={ true }
                        value={ this.state.name }
                        errorText={ this.state.nameError }
                        onChange={ e => { this.setState({ name: e.currentTarget.value }) } }
                    /><br /><br />                
                </form>
            </div>                
        )
    }

}

export default CloneGalleryModal;
