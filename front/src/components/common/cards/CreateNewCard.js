// @flow
import React, { PureComponent } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default (props: any) => {
    return(
        <div className="gallery-ui-list-item card-new">
            <FloatingActionButton className="plus" onClick={ (e) => { (props.click) ? props.click(e) : null } }>
                <ContentAdd />
            </FloatingActionButton>
            <p className="card-info">{ props.cardTitle }</p>
        </div>        
    )
}