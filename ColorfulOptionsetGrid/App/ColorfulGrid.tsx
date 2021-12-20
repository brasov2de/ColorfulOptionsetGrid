import * as React from 'react';

import {DetailsList, IColumn, DetailsListLayoutMode, IDetailsHeaderProps, SelectionMode, ConstrainMode} from '@fluentui/react/lib/DetailsList';
import {mergeStyles, DefaultFontStyles } from '@fluentui/react/lib/Styling';
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {IRenderFunction} from '@fluentui/react/lib/Utilities';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import { Stack } from '@fluentui/react/lib/Stack';


import { ColumnWidthCallback, getDefaultColumnSetup, IGridColumn, useColumns } from './Generic/Hooks/useColumns';
import { useSelection } from './Generic/Hooks/useSelection';


import { ColorfulCell } from './Controls/ColorfulCell';
import { GridFooter } from './Generic/Components/GridFooter';
import { useConfig } from './Hooks/useConfig';
import { Icon } from '@fluentui/react/lib/Icon';
import { GridOverlay } from './Generic/Components/GridOverlay';
import { useItems } from './Generic/Hooks/useItems';
import { gridHeader } from './Generic/Components/GridHeader';






type DataSet = ComponentFramework.PropertyTypes.DataSet;

initializeIcons();


export interface IColorfulGridProps{
    dataset: DataSet;    
    utils : ComponentFramework.Utility;    
    displayTextType: "SIMPLE" | "BOX" | "BORDER" | "NOTEXT";    
    displayIconType : "NONE" | "NAME";// | "ENVIRONMENT";
    defaultIcon : string;
    iconConfig1 ?: string;
    iconConfig2 ?: string;
    iconConfig3 ?: string;
    containerWidth ?: number;
    containerHeight ?: number;    
    isSubgrid : boolean;
    setFullScreen: (value : boolean) => void;     
    updatedProperties : string[];
}



export const ColorfulGrid = React.memo(function ColorfulGridApp({
    dataset, 
    utils, 
    displayTextType, 
    displayIconType, 
    defaultIcon, 
    iconConfig1, 
    iconConfig2, 
    iconConfig3, 
    containerWidth, 
    containerHeight, 
    isSubgrid, 
    setFullScreen, 
    updatedProperties
} : IColorfulGridProps) : JSX.Element{    
    
    const {defaultIconNames, metadataAttributes } = useConfig(dataset, defaultIcon, utils, iconConfig1, iconConfig2, iconConfig3);
    const columnWidthCalculator: ColumnWidthCallback = (column: ComponentFramework.PropertyHelper.DataSetApi.Column, preCalculatedWidth: number) => {
            const isOptionSetRenderer : boolean = metadataAttributes?.has(column.name)
            if(isOptionSetRenderer===false){
                return preCalculatedWidth;
            }
            return (displayTextType==="NOTEXT") 
                ? 30
                :  preCalculatedWidth + 30                    
    }
    const {columns: gridColumns, onColumnClick} = useColumns(dataset, containerWidth, columnWidthCalculator);
    const {items} = useItems(dataset);
    const {selection, selectedCount, onItemInvoked} = useSelection(dataset);
    
    const onChange= (id: string, columnName: string, value: number) => {
        console.log(`changing to ${value}`);
        const record = dataset.records[id];
        if(record){ //@ts-ignore
            record.setValue(columnName, value);  
            //@ts-ignore
            record.save().then(()=> {console.log(`record ${id} was saved`)}).catch(console.error);         
        }
    }

    const columns = gridColumns.map((column: IGridColumn) : IColumn => {        
        const isOptionSetRenderer : boolean = metadataAttributes?.has(column.original.name);      
        const columnDefaultIcon = displayIconType==="NAME" ? defaultIconNames.get(column.original.name)??defaultIcon : defaultIcon; 
        return {
            ...getDefaultColumnSetup(column, dataset),            
            onRender: isOptionSetRenderer===true  ? (item : any) => {      
              return <ColorfulCell 
                            item={item} 
                            column={column} 
                            metadataOptions={metadataAttributes.get(column.original.name)} 
                            displayTextType ={displayTextType} 
                            displayIconType={displayIconType}
                            defaultIcon = {columnDefaultIcon}
                            onChange={onChange}                            
                ></ColorfulCell>
              } : undefined,                  
        };
    });    
      
   
    return (<GridOverlay 
                containerHeight={containerHeight} dataset={dataset} isSubgrid={isSubgrid} 
                selectedCount={selectedCount} selection={selection} 
                setFullScreen={setFullScreen} updatedProperties={updatedProperties}>
                <DetailsList       
                        setKey="items"                
                        onRenderDetailsHeader={gridHeader(onColumnClick)}
                        items={items} 
                        columns={columns}                          
                        selection={selection}
                        selectionPreservedOnEmptyClick={true}
                        selectionMode={SelectionMode.multiple}     
                        layoutMode={DetailsListLayoutMode.justified}       
                        constrainMode={ConstrainMode.unconstrained}
                        onItemInvoked={onItemInvoked}                        
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="Row checkbox"
                        >
                </DetailsList>
        </GridOverlay>);                          
},(prevProps, newProps) => {
    return prevProps.dataset === newProps.dataset 
        && prevProps.containerWidth === newProps.containerWidth
        && prevProps.containerHeight === newProps.containerHeight
});


/*
//create
dataset.newRecord().then((rec) => {
    rec.setValue("diana_name","testdummy"); 
    rec.save().then( () => console.log("Saved")).catch(console.error) }
)
*/