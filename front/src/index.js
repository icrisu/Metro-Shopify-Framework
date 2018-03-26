// @flow

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import ReduxThunk from 'redux-thunk';

//import { I18n } from 'react-i18nify';
import reducers from './reducers';
// import Translation from './translation';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { deepPurple900, grey400 } from 'material-ui/styles/colors';

import AppMain from './components/AppMain';

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepPurple900
  },
  appBar: {
    height: 50,
  },
});

const createStoreWithMiddleware = applyMiddleware(promise, ReduxThunk)(createStore);

export const store = createStoreWithMiddleware(reducers);

const mainEl: any = document.getElementById('container');

// I18n.setTranslations(Translation);
// I18n.setLocale(window.blocksSettings.lang);

ReactDom.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Provider store={store}>
			<AppMain />
		</Provider>
	</MuiThemeProvider>
, mainEl);
