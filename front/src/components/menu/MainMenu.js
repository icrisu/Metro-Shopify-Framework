// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import MenuItem from './MenuItem';
import { connect } from 'react-redux';

type Props = {
	test: number
}


class MainMenu extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static defaultProps = {
        test: 1
    }

    componentWillMount() {
    }

    render() {
        return(
            <ul className="main-menu-list">
                <MenuItem to={'/app'} label={'Widgets'} />
                <MenuItem to={'/app/custom-data'} label={'Custom CSS'} />
                <MenuItem to={'/app/docs'} label={'FAQ / Documentation'} />
            </ul>
        )
    }
}

export default MainMenu;