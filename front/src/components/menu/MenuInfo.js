import React, { PureComponent } from "react";
import { withRouter } from 'react-router';
import { connect } from "react-redux";


class MenuInfo extends PureComponent {

    renderInfo() {
        if (React.isValidElement(this.props.menuInfo)) {
            return this.props.menuInfo;
        }
    }

    render() {
        return(
            <div className="menu-location-info">{ this.renderInfo() }</div>  
        );
    }
}

const mapStateToProps = ({ menuInfo }, ownProps) => {
    return {
        menuInfo
    }
}

export default withRouter(connect(mapStateToProps)(MenuInfo))

