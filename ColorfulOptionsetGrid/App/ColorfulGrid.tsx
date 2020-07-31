import * as React from 'react';

import {DetailsList, IColumn, DetailsListLayoutMode, IDetailsFooterProps, Selection, IDetailsHeaderProps, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {mergeStyles, DefaultFontStyles } from '@fluentui/react/lib/Styling';
import { useGetAttributes } from './Hooks/useGetMetadata';
import {Icon} from '@fluentui/react/lib/Icon';
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {IRenderFunction} from '@fluentui/react/lib/Utilities';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import {Example_Env_Var_Ampel} from '../Data/EnvVarSchema';
import { IGridColumn, useColumns } from './Hooks/useColumns';
import {usePaging} from './Hooks/usePaging';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Label } from '@fluentui/react/lib/Label';
import { IConfigRawValues, ISetupSchema, ISetupSchemaValue } from './Model/interfaces';
import { ColorfulCell } from './Cells/ColorfulCell';
import { Stack } from '@fluentui/react/lib/Stack';
import { IconButton } from '@fluentui/react/lib/Button';
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
     /* (displayIconType==="CONFIG" 
            ?  customizedColumnsArray.map((setup) => [setup.column?.name ?? "", setup.config!== undefined ? (JSON.parse(setup.config) as ISetupSchema) : {}] )
            : []);*/
    //found customized, or take all optionset columns otherwise
    const optionSetColumns : string[] = customizedColumnsArray.length >0 
        ? customizedColumnsArray.map((setup) => setup.column?.name ?? "")
        : dataset.columns.filter((column) => column.dataType==="OptionSet").map((column) => column.name);    
    const metadataAttributes = useGetAttributes(dataset.getTargetEntityType(), optionSetColumns, utils , new Map(configs));    

    const {columns: gridColumns, onColumnClick} = useColumns(dataset, containerWidth);
    const {       
        selectedIds,   
        onSelectionIdsChanged, 
        currentPage,
        firstItemNumber, 
        lastItemNumber, 
        totalRecords, 
        moveToFirst, 
        movePrevious,
        moveNext, 
        reset
    } = usePaging(dataset);
    
    const onColumnHeaderClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        const name = column?.fieldName ?? "";
        onColumnClick(name);
        reset();
    }    
    
    const columns = gridColumns.map((column) : IColumn => {
        const meta = metadataAttributes?.options.get(column.original.name);
        const isOptionSetRenderer : boolean = metadataAttributes?.options.has(column.original.name);
        const schema = column.original.alias==="optionset3" ? Example_Env_Var_Ampel : undefined;   
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
            //ariaLabel: "Sort by",
            //filterAriaLabel: "Sort by",
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

  
      const selection =new Selection({
        onSelectionChanged: () => {
           
          //  setSelectedCount(selection.getSelectedCount());
          // setSelectedIds(selection.getSelection().map((item) => item.key as string));      
            
        }
    });
                   
    const height = (containerHeight != null && containerHeight!==-1) ? `${containerHeight}px` : "100%";

    return (
        <Stack grow verticalFill className="container" style={{height, width: "100%"}}>             
            <Stack.Item grow className="gridContainer" >
                <ScrollablePane scrollbarVisibility={"auto"} >
            
                    <DetailsList                       
                        onRenderDetailsHeader={_onRenderDetailsHeader}
                        items={items} 
                        columns={columns}                          
                        selection={selection}
                        selectionPreservedOnEmptyClick={true}
                        selectionMode={SelectionMode.multiple}     
                        layoutMode={DetailsListLayoutMode.justified}>                       
                        
                    </DetailsList>
            
                </ScrollablePane>
                </Stack.Item>

                <Stack.Item>                
                <Stack grow horizontal horizontalAlign="space-between" >
                    <Stack.Item className="Footer">
                        <Stack grow horizontal horizontalAlign="space-between" >
                            <Stack.Item grow={1} align="center" >{firstItemNumber} - {lastItemNumber} of {totalRecords} ({selectedIds?.length} selected)</Stack.Item>
                            <Stack.Item grow={1} align="center" className="FooterRight">
                                <IconButton className="FooterIcon" iconProps={{ iconName: "DoubleChevronLeft"}} onClick={moveToFirst} disabled={!dataset.paging.hasPreviousPage}/>
                                <IconButton className="FooterIcon" iconProps={{ iconName: "ChevronLeft"}} onClick={movePrevious} disabled={!dataset.paging.hasPreviousPage}/>
                                <span >Page {currentPage}</span>
                                <IconButton className="FooterIcon" iconProps={{ iconName: "ChevronRight" }} onClick={moveNext} disabled={!dataset.paging.hasNextPage}/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
                
            </Stack.Item>

            </Stack>
        
    );
},(prevProps, newProps) => {
    return prevProps.dataset === newProps.dataset 
        && prevProps.containerWidth === newProps.containerWidth
        && prevProps.containerHeight === newProps.containerHeight
});