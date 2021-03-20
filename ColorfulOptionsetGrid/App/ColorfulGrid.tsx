import * as React from 'react';

import {DetailsList, IColumn, DetailsListLayoutMode, IDetailsHeaderProps, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {mergeStyles, DefaultFontStyles } from '@fluentui/react/lib/Styling';
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {IRenderFunction} from '@fluentui/react/lib/Utilities';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import { Stack } from '@fluentui/react/lib/Stack';


import { ColumnWidthCallback, useColumns } from './Generic/Hooks/useColumns';
import { useSelection } from './Generic/Hooks/useSelection';


import { ColorfulCell } from './Controls/ColorfulCell';
import { GridFooter } from './Generic/Components/GridFooter';
import { useConfig } from './Hooks/useConfig';
import { Icon } from '@fluentui/react/lib/Icon';
import { useZoom } from './Generic/Hooks/useZoom';
import { GridOverlay } from './Generic/Components/GridOverlay';






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
    const {selection, selectedCount, onItemInvoked} = useSelection(dataset);
  
    
    const onColumnHeaderClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        const name = column?.fieldName ?? "";
        onColumnClick(name);       
    }    
    
    const columns = gridColumns.map((column) : IColumn => {        
        const isOptionSetRenderer : boolean = metadataAttributes?.has(column.original.name);
        const sortNode = dataset.sorting.find((sort) => sort.name===column.original.name);                     
        const columnDefaultIcon = displayIconType==="NAME" ? defaultIconNames.get(column.original.name)??defaultIcon : defaultIcon; 
        return {
            key: column.original.name,
            name : column.original.displayName,             
            fieldName: column.original.name,
            minWidth : column.minWidth,
            maxWidth : column.maxWidth,
            isResizable: true, 
            isSorted: sortNode?.sortDirection===0 || sortNode?.sortDirection===1,
            isSortedDescending: sortNode?.sortDirection === 1,                                 
            sortAscendingAriaLabel: "A-Z",
            sortDescendingAriaLabel: "Z-A",
           // columnActionsMode: 2,         
            onRender: isOptionSetRenderer===true  ? (item : any) => {      
              return <ColorfulCell 
                item={item} 
                column={column} 
                metadataOptions={metadataAttributes.get(column.original.name)} 
                displayTextType ={displayTextType} 
                displayIconType={displayIconType}
                defaultIcon = {columnDefaultIcon}
                ></ColorfulCell>
              } : undefined,                  
        };
    });    
    //bworkaround bug: search while on page >1, has 25 records, but totalResultCount is right
    const items = dataset.sortedRecordIds.slice(0, Math.min(dataset.sortedRecordIds.length, dataset.paging.totalResultCount)).map((id) => {                
        const entityIn = dataset.records[id];
        const attributes = dataset.columns.map((column) => ({[column.name]: entityIn.getFormattedValue(column.name)}));
        return Object.assign({
                key: entityIn.getRecordId(),
                raw : entityIn
            },
            ...attributes)
    });      
    
      
    const _onRenderDetailsHeader = (props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element => {
        return (            
          <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true} >                        
            {defaultRender!({...props!, onColumnClick : onColumnHeaderClick })}                
          </Sticky>
        );
      }
           
    const {isFullScreen, toggleFullScreen } = useZoom({setFullScreen, updatedProperties});
   
    return (<GridOverlay 
                containerHeight={containerHeight} dataset={dataset} isFullScreen={isFullScreen} isSubgrid={isSubgrid} 
                selectedCount={selectedCount} selection={selection} toggleFullScreen={toggleFullScreen}>
                <DetailsList       
                        setKey="items"                
                        onRenderDetailsHeader={_onRenderDetailsHeader}
                        items={items} 
                        columns={columns}                          
                        selection={selection}
                        selectionPreservedOnEmptyClick={true}
                        selectionMode={SelectionMode.multiple}     
                        layoutMode={DetailsListLayoutMode.justified}       
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