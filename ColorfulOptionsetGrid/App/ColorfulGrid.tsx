import * as React from 'react';

import {DetailsList, IColumn, DetailsListLayoutMode, Selection, IDetailsHeaderProps, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {mergeStyles, DefaultFontStyles } from '@fluentui/react/lib/Styling';
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {IRenderFunction} from '@fluentui/react/lib/Utilities';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import { Stack } from '@fluentui/react/lib/Stack';


import { useGetAttributes } from './Hooks/useGetMetadata';
import { useColumns } from './Hooks/useColumns';
import { useSelection } from './Hooks/useSelection';

import {  ISetupSchema } from './Model/interfaces';
import { ColorfulCell } from './Controls/ColorfulCell';
import { GridFooter } from './Controls/GridFooter';



type DataSet = ComponentFramework.PropertyTypes.DataSet;

initializeIcons();




export interface IColorfulGridProps{
    dataset: DataSet;    
    utils : ComponentFramework.Utility;    
    displayTextType: "SIMPLE" | "BOX" | "BORDER";    
    displayIconType : "NONE" | "NAME";// | "ENVIRONMENT";
    defaultIcon : string;
    iconConfig1 ?: string;
    iconConfig2 ?: string;
    iconConfig3 ?: string;
    containerWidth ?: number;
    containerHeight ?: number;    
}



function parseIconConfig(defaultIcon : string, iconConfig ?: string){
    const isJSON = iconConfig && iconConfig.includes("{");
    return { 
        jsonConfig : isJSON === true ? JSON.parse(iconConfig as string) as ISetupSchema : undefined,
        defaultIconName : isJSON===false ? iconConfig : defaultIcon
    }
}


export const ColorfulGrid = React.memo(function ColorfulGridApp({dataset, utils, displayTextType, displayIconType, defaultIcon, iconConfig1, iconConfig2, iconConfig3, containerWidth, containerHeight} : IColorfulGridProps) : JSX.Element{    
    const customizedColumns = {
        "optionset1": {
                column: dataset.columns.find((column) => column.alias ==="optionset1"),
                ...parseIconConfig(defaultIcon, iconConfig1)
        },
        "optionset2": {
            column: dataset.columns.find((column) => column.alias ==="optionset2"),
            ...parseIconConfig(defaultIcon, iconConfig2)
        },
        "optionset3": {
            column: dataset.columns.find((column) => column.alias ==="optionset3"),
            ...parseIconConfig(defaultIcon, iconConfig3)
        }
    }
     const customizedColumnsArray  = Object.values(customizedColumns).filter((setup) => setup.column !== undefined);
     const configs : [string, ISetupSchema | undefined][] = customizedColumnsArray.map((setup) => [setup.column?.name ?? "", setup.jsonConfig ])

    //found customized, or take all optionset columns otherwise
    const optionSetColumns : string[] = customizedColumnsArray.length >0 
        ? customizedColumnsArray.map((setup) => setup.column?.name ?? "")
        : dataset.columns.filter((column) => column.dataType==="OptionSet").map((column) => column.name);    
    const metadataAttributes = useGetAttributes(dataset.getTargetEntityType(), optionSetColumns, utils , new Map(configs));    

    const {columns: gridColumns, onColumnClick} = useColumns(dataset, containerWidth);
    const {selection} = useSelection(dataset);
  
    
    const onColumnHeaderClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        const name = column?.fieldName ?? "";
        onColumnClick(name);       
    }    
    
    const columns = gridColumns.map((column) : IColumn => {        
        const isOptionSetRenderer : boolean = metadataAttributes?.options.has(column.original.name);       
        const sortNode = dataset.sorting.find((sort) => sort.name===column.original.name);        
        const def = Object.entries(customizedColumns).find(([key, value]) => key===column.original.alias) ?? [];
        const columnDefaultIcon = displayIconType==="NAME" ? (def[1]?.defaultIconName??defaultIcon) : defaultIcon; 
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
                metadataOptions={metadataAttributes.options.get(column.original.name)} 
                displayTextType ={displayTextType} 
                displayIconType={displayIconType}
                defaultIcon = {columnDefaultIcon}
                ></ColorfulCell>
              } : undefined,                  
        };
    });    
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
          <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
            {defaultRender!({...props!, onColumnClick : onColumnHeaderClick })}
          </Sticky>
        );
      }

     
  
    const myItemInvoked = React.useCallback((item : any) : void => {
        console.log("item invoked");
        const record = dataset.records[item.key];
        dataset.openDatasetItem(record.getNamedReference());
    }, [dataset]); 
                   
    const height = (containerHeight != null && containerHeight!==-1) ? `${containerHeight}px` : "100%";
   

    return (      
        <Stack grow verticalFill className="container" style={{height, width: "100%"}}>             
            <Stack.Item grow className="gridContainer" >
                <ScrollablePane scrollbarVisibility={"auto"} >                 
                    <MarqueeSelection selection={selection}>
                        <DetailsList       
                            setKey="items"                
                            onRenderDetailsHeader={_onRenderDetailsHeader}
                            items={items} 
                            columns={columns}                          
                            selection={selection}
                            selectionPreservedOnEmptyClick={true}
                            selectionMode={SelectionMode.multiple}     
                            layoutMode={DetailsListLayoutMode.justified}       
                            onItemInvoked={myItemInvoked}
                            
                            ariaLabelForSelectionColumn="Toggle selection"
                            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                            checkButtonAriaLabel="Row checkbox"
                            >
                        </DetailsList>
                    </MarqueeSelection>                    
                </ScrollablePane>
            </Stack.Item>
            
            <Stack.Item>                
                <GridFooter dataset={dataset}></GridFooter>                
            </Stack.Item>

        </Stack>         
        
    );
},(prevProps, newProps) => {
    return prevProps.dataset === newProps.dataset 
        && prevProps.containerWidth === newProps.containerWidth
        && prevProps.containerHeight === newProps.containerHeight
});