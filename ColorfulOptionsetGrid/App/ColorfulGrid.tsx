import * as React from 'react';
import {DetailsList, IColumn} from '@fluentui/react/lib/DetailsList';
import {mergeStyles } from '@fluentui/react/lib/Styling';
type DataSet = ComponentFramework.PropertyTypes.DataSet;


export interface IColorfulGridProps{
    dataset: DataSet;    
}

export const ColorfulGrid = ({dataset} : IColorfulGridProps) : JSX.Element => {
    const columns = dataset.columns.map((column) : IColumn => {
        return {
            key: column.name,
            name : column.displayName,             
            fieldName: column.name,
            minWidth : column.visualSizeFactor,
            maxWidth: 300,            
            isResizable: true
        };
    });   
    const items = dataset.sortedRecordIds.map((id) => {                
        const entityIn = dataset.records[id];
        const attributes = dataset.columns.map((column) => ({[column.name]: entityIn.getFormattedValue(column.name)}));
        return Object.assign({
            key: entityIn.getRecordId()},
            ...attributes)
    });        
    return (<DetailsList items={items}></DetailsList>);
}