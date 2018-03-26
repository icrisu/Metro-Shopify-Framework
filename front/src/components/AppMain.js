// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes, { number } from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import _ from 'lodash';

import MainMenu from './menu/MainMenu';
import MenuInfo from './menu/MenuInfo';
import WidgetBlocks from './WidgetBlocks';
import CustomData from './CustomData';
import AddvancedEditor from './editor/AdvancedEditor';
import SimpleEditor from './editor/SimpleEditor';
import FAQ from './FAQ';

type Props = {
	propCount: number
}

type State = {
	count: number
}

class AppMain extends Component<Props, State> {
	
	static defaultProps = {
		propCounts: ''
	}

	constructor(props) {
		super(props);
		this.state = { 
			count: 0
		};
	}	

	render() {
		return(
			<BrowserRouter>
				<div>
					<div className="app-main-menu">
						<MainMenu />
						<MenuInfo />
					</div>
					
					<div className="app-ui-content container-fluid">
						<Switch>
							<Route path="/app/docs" component={ FAQ } />
							<Route path="/app/custom-data" component={ CustomData } />
							<Route path="/app/widgets/advanced/:id" component={ AddvancedEditor } />
							<Route path="/app/widgets/simple/:id" component={ SimpleEditor } />
							<Route path="/app" component={ WidgetBlocks } />	
							<Route component={ WidgetBlocks } />							
						</Switch>
					</div>
				</div>
			</BrowserRouter>				
		);
	}
}

const mapStateToProps = ({ statusData }, ownProps) => {
	// console.log('ownProps', ownProps);
	return { statusData };
}



export default connect(mapStateToProps)(AppMain);

