import React from "react";
import SimpleModal from './SimpleModal';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const radioButtonsStyle = {
    marginBottom: 16
}

class CustomAlert extends SimpleModal {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            name: '',
            type: 'simple',
            nameError: null
        }
    }
}

export default CustomAlert;
