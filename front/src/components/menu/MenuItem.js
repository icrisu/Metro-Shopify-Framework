// @flow
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

type Props = {
    to: string,
    label: string,
    match: any,
    location: any
}

class MenuItem extends PureComponent<Props> {

    static defaultProps = {
        to: '',
        label: 'Menu item'
    }

    isActive(): boolean {
        return this.props.to === this.props.location.pathname;
    }

    render() {
        return(
            <li>
                <Link className={ this.isActive() ? 'menu-item-active' : 'menu-item-inactive' } to={ `${this.props.to}${this.props.location.search}` }>{ this.props.label }</Link>
            </li>
        )
    }
}
export default withRouter(connect()(MenuItem))