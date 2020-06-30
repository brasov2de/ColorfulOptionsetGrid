import * as React from 'react';
import {DetailsList, IColumn} from '@fluentui/react/lib/DetailsList';
import {mergeStyles } from '@fluentui/react/lib/Styling';
import { useGetAttributes } from './Hooks/useGetMetadata';
import {Icon} from '@fluentui/react/lib/Icon';
import {initializeIcons} from '@fluentui/react/lib/Icons';
type DataSet = ComponentFramework.PropertyTypes.DataSet;

initializeIcons();

export interface IColorfulGridProps{
    dataset: DataSet;    
    utils : ComponentFramework.Utility;
}

export const ColorfulGrid = ({dataset, utils} : IColorfulGridProps) : JSX.Element => {
    const optionSetColumns = ["column1", "column2", "column3", "column4"].map((alias) => dataset.columns.find((column) => column.alias===alias)?.name ?? alias); 
    const metadataAttributes = useGetAttributes(dataset.getTargetEntityType(), optionSetColumns, utils );
    const columns = dataset.columns.map((column) : IColumn => {
        return {
            key: column.name,
            name : column.displayName,             
            fieldName: column.name,
            minWidth : column.visualSizeFactor,
            maxWidth: 300,            
            isResizable: true, 
            onRender: (item : any) => {
                return  <div> <Icon className="colorIcon" style={{color: "red"}} iconName="CircleShapeSolid" aria-hidden="true" /><span>{item[column.name]}</span></div>  
              },                  
        };
    });   
    const items = dataset.sortedRecordIds.map((id) => {                
        const entityIn = dataset.records[id];
        const attributes = dataset.columns.map((column) => ({[column.name]: entityIn.getFormattedValue(column.name)}));
        return Object.assign({
            key: entityIn.getRecordId()},
            ...attributes)
    });        
    return (<DetailsList items={items} columns={columns}></DetailsList>);
}