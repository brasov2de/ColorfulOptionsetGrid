import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IDetailsFooterProps, Selection } from '@fluentui/react/lib/DetailsList';
import { Label } from '@fluentui/react/lib/Label';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import * as React from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;


export const usePaging = (dataset: DataSet) => {    
    const [selectedIds, setSelectedIds] = React.useState<string[]>();      
               
    function onSelectionIdsChanged(selectionIds: string[]){
        setSelectedIds(selectionIds);      
    }

   
    return {       
        selectedIds,   
        onSelectionIdsChanged
    }
}