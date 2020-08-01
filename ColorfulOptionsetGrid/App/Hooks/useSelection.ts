import * as React from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import {Selection} from '@fluentui/react/lib/DetailsList';

export const useSelection = (dataset: DataSet) => {    
    const [selection, setSelection] = React.useState(new Selection({
        onSelectionChanged: () => {
            const ids = selection.getSelection().map((item :any) => item.key);
            dataset.setSelectedRecordIds(ids);
        }
    }));

    return {
        selection
    };

  
}