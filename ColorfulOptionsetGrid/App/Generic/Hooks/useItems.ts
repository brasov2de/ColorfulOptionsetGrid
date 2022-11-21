import * as React from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;


export const useItems = (dataset: DataSet) => {       
    const [items, setItems] = React.useState<any[]>([]);
     
    React.useEffect(() => {
        //workaround bug: search while on page >1, has 25 records, but totalResultCount is right   
        setItems(dataset.sortedRecordIds.slice(0, Math.min(dataset.sortedRecordIds.length, dataset.paging.totalResultCount)).map((id) => {                
            const entityIn = dataset.records[id];
            const attributes = dataset.columns.map((column) => ({[column.name]: entityIn.getFormattedValue(column.name)}));
            return Object.assign({
                    key: entityIn.getRecordId(),
                    raw : entityIn
                },
                ...attributes);
            }));
    }, [dataset]);  

    return {      
        items
    };
}