import React from "react";
import SimpleModal from './SimpleModal';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const radioButtonsStyle = {
    marginBottom: 16
}

class NewGalleryModal extends SimpleModal {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            name: '',
            type: 'advanced',
            nameError: null
        }
    }

    wigetTypeChange(e: any, val: string) {
        this.setState({ type: val });
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
            const r = { name: this.state.name, type: this.state.type }
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
                        floatingLabelText="Widget name"
                        fullWidth={ true }
                        value={ this.state.name }
                        errorText={ this.state.nameError }
                        onChange={ e => { this.setState({ name: e.currentTarget.value }) } }
                    /><br /><br />
                    <RadioButtonGroup onChange={ (e, v) => { this.wigetTypeChange(e, v) } } name="shipSpeed" defaultSelected={ this.state.type }>
                        <RadioButton
                            value="advanced"
                            label="Advanced (filterable / multiple sections)"
                            style={ radioButtonsStyle }
                        />                
                        <RadioButton
                            value="simple"
                            label="Simple (one section)"
                            style={ radioButtonsStyle }
                        />                    
                    </RadioButtonGroup>                    
                </form>
            </div>                
        )
    }

}

export default NewGalleryModal;
