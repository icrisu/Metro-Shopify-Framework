// @flow
import React, { PureComponent } from "react";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { store, muiTheme } from '../../../index';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

export type Props = {
    children: any,
    hasCancel: boolean,
    onCancel?: any,
    onAccept?: any,
    title?: ?string,
    smallNav?: boolean,
    zindex: any
}
type State = {
    modalIsOpen: boolean
}

class SimpleModal extends PureComponent<Props, State> {

    modalTarget: any;
    style: any = {};

    static defaultProps = {
        hasCancel: false,
        smallNav: false,
        zindex: '999999'
    }

    constructor(props: Props) {
        super(props);
        this.style = {
            width: this.props.minw || '400px',
            maxWidth: this.props.minw || '400px'
        }
    }

    componentDidMount() {
        this.modalTarget = document.createElement('div');
        this.modalTarget.className = 'simple-modal-body';
        this.modalTarget.style.zIndex = this.props.zindex;
        if (document.body) {
            document.body.appendChild(this.modalTarget);
        }
        this._render();     
    }

    componentDidUpdate() {
        this._render();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.modalTarget);
        if (document.body) {
            document.body.removeChild(this.modalTarget);
        }
    }

    onCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    onAccept(e: any) {
        if (this.props.onAccept) {
            this.props.onAccept(e);
        }
    }    

    // render small action buttons
    renderActionsSmall() {
        let cancelBtn = <noscript />
        if (this.props.hasCancel === true) {
            cancelBtn = <RaisedButton label="Cancel" onClick={ (e) => { this.onCancel() }} style={{marginLeft: '10px'}} />
        }        
        return(
            <div>
                <div className="pull-right">                    
                    { cancelBtn }
                    <RaisedButton type="submit" label="OK" primary={true} onClick={ (e) => { this.onAccept(e) }} style={{marginLeft: '10px'}} />
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }

    renderActions() {
        if (this.props.smallNav === true) {
            return this.renderActionsSmall();
        }        
        if (this.props.hasCancel === false) {
            return <RaisedButton type="submit" label="OK" primary={true} onClick={ (e) => { this.onAccept(e) }} style={{width: '100%'}} />;
        }
        
        return(
            <div className="row">
                <div className="col-md-6">
                    <RaisedButton label="Cancel" onClick={ (e) => { this.onCancel() }} style={{width: '100%'}} />
                </div>
                <div className="col-md-6">
                    <RaisedButton type="submit" label="OK" primary={true} onClick={ (e) => { this.onAccept(e) }} style={{width: '100%'}} />
                </div>                
            </div>
        )
    }

    renderContent() {
        if (this.props.children) {
            return this.props.children;
        }
    }

    _render() {
        ReactDOM.render(
            <MuiThemeProvider muiTheme={muiTheme}>
                <Provider store={ store }>
                    <div className="simple-modal-ui" style={ this.style }>
                        <div className="modal-title-ui">
                            <p className="title">{ this.props.title }</p>
                            <div className="modal-close" onClick={ (e) => { this.onCancel() }}><span className="icon-close"></span></div>
                            <div className="clearfix"></div>
                        </div>
                        <div className="hr-line"></div>
                        <div className="simple-modal-content">
                            { this.renderContent() }
                            <div className="modal-actions">
                                { this.renderActions() }
                            </div>
                        </div>
                    </div>
                </Provider>
            </MuiThemeProvider>,
            this.modalTarget
        )
    }


    render() {
        return(
            <noscript />
        )
    }
}

export default SimpleModal;
