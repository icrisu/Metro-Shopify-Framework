import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';

const DragContainer = props => {
    return(
        <div>:::</div>
    )
}

export const DragHandle = SortableHandle(() => <DragContainer />); // This can be any component you want