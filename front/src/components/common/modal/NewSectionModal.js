import React from "react";
import SimpleModal from './SimpleModal';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class NewSectionModal extends SimpleModal {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            name: '',
            type: 'simple',
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
            this.props.onAccept(event, this.state.name);
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
                        floatingLabelText="Section name"
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

export default NewSectionModal;
