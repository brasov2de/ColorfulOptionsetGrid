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
type DataSet = ComponentFramework.PropertyTypes.DataSet;

initializeIcons();




export interface IColorfulGridProps{
    dataset: DataSet;    
    utils : ComponentFramework.Utility;    
    displayTextType: "SIMPLE" | "BOX" | "BORDER" | "NONE";    
    displayIconType : "NONE" | "NAME" | "CONFIG" | "ENVIRONMENT";
    defaultIcon : string;
    iconConfig1 ?: string;
    iconConfig2 ?: string;
    iconConfig3 ?: string;
    containerWidth ?: number;
    containerHeight ?: number;
}





export const ColorfulGrid = React.memo(function ColorfulGridApp({dataset, utils, displayTextType, displayIconType, defaultIcon, iconConfig1, iconConfig2, iconConfig3, containerWidth, containerHeight} : IColorfulGridProps) : JSX.Element{    
    const customizedColumns = {
        "optionset1": {
                column: dataset.columns.find((column) => column.alias ==="optionset1"),
                config : iconConfig1
        },
        "optionset2": {
            column: dataset.columns.find((column) => column.alias ==="optionset2"),
            config : iconConfig2
        },
        "optionset3": {
            column: dataset.columns.find((column) => column.alias ==="optionset3"),
            config : iconConfig3
        }
    }
     const customizedColumnsArray  = Object.values(customizedColumns).filter((setup) => setup.column !== undefined && setup.config!==undefined);
     const configs : [string, ISetupSchema | undefined][] =  (displayIconType==="CONFIG" 
            ?  customizedColumnsArray.map((setup) => [setup.column?.name ?? "", setup.config!== undefined ? (JSON.parse(setup.config) as ISetupSchema) : undefined] )
            : []);
    //found customized, or take all optionset columns otherwise
    const optionSetColumns : string[] = customizedColumnsArray.length >0 
        ? customizedColumnsArray.map((setup) => setup.column?.name ?? "")
        : dataset.columns.filter((column) => column.dataType==="OptionSet").map((column) => column.name);    
    const metadataAttributes = useGetAttributes(dataset.getTargetEntityType(), optionSetColumns, utils , new Map(configs));    

    const {columns: gridColumns, onColumnClick} = useColumns(dataset, containerWidth);
    
    const onColumnHeaderClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        const name = column?.fieldName ?? "";
        onColumnClick(name);
    }    
    
    const columns = gridColumns.map((column) : IColumn => {
        const meta = metadataAttributes?.options.get(column.original.name);
        const isOptionSetRenderer : boolean = metadataAttributes?.options.has(column.original.name);
        const schema = column.original.alias==="optionset3" ? Example_Env_Var_Ampel : undefined;   
        const sortNode = dataset.sorting.find((sort) => sort.name===column.original.name);
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
            onRender: isOptionSetRenderer===true  ? (item : any) => {      
              return <ColorfulCell 
                item={item} 
                column={column} 
                metadataOptions={metadataAttributes.options.get(column.original.name)} 
                displayTextType ={displayTextType} 
                displayIconType={displayIconType}
                defaultIcon = {defaultIcon}
                ></ColorfulCell>
              } : undefined,                  
        };
    });    
    const items = dataset.sortedRecordIds.map((id) => {                
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

      const renderCommandBarFarItem = (recordsLoaded: number): ICommandBarItemProps[] =>
      {
          const totalRecords = dataset.paging.totalResultCount;
          return [
              {
                  key: 'next',
                  text: (recordsLoaded === totalRecords) 
                          ? `${recordsLoaded} of ${totalRecords}` 
                          : `Load more (${recordsLoaded} of ${totalRecords})`,
                  ariaLabel: 'Next',
                  iconProps: { iconName: 'ChevronRight' },
                  disabled: recordsLoaded == totalRecords,
                 // className: classNames.cmdBarFarItems,
                  /*onClick: () => {
                      if (this.state._triggerPaging) {
                          this.state._triggerPaging("next");
                      }
                  }*/
              }  
          ];
      }  
  
      const cmdBarItems: ICommandBarItemProps[] = [];    
     const [selectedCount, setSelectedCount] = React.useState<number>(0);
     const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
      //const {onSelectionIdsChanged, selectedIds } = usePaging(dataset);
     
  
      const selection =new Selection({
        onSelectionChanged: () => {
           
          //  setSelectedCount(selection.getSelectedCount());
          // setSelectedIds(selection.getSelection().map((item) => item.key as string));      
            
        }
    });

   
   
  
      const onRenderDetailsFooter = (props: IDetailsFooterProps | undefined, defaultRender?: IRenderFunction<IDetailsFooterProps>): JSX.Element => {
          const cmdBarFarItems: ICommandBarItemProps[] = renderCommandBarFarItem(dataset.sortedRecordIds.length);
          const selectionDetails = `${selectedCount} selected`;
          return (
              <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true}>
                  <div> 
                      <Label className={"listFooterLabel"}>{selectionDetails}</Label>
                      <CommandBar className={"cmdbar"} farItems={cmdBarFarItems} items={cmdBarItems} />                    
                  </div>
              </Sticky>
          );  
      }

   
   
    const height = (containerHeight != null && containerHeight!==-1) ? `${containerHeight}px` : "100%";

    return (
        <div className="container" style={{height}}>
            <ScrollablePane scrollbarVisibility={"auto"} >
          
                <DetailsList 
                    onRenderDetailsFooter={onRenderDetailsFooter}
                    onRenderDetailsHeader={_onRenderDetailsHeader}
                    items={items} 
                    columns={columns}                          
                    selection={selection}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.multiple}     
                    layoutMode={DetailsListLayoutMode.justified}>                       
                    
                </DetailsList>
          
            </ScrollablePane>
            </div>
        
    );
},(prevProps, newProps) => {
    return prevProps.dataset === newProps.dataset 
        && prevProps.containerWidth === newProps.containerWidth
        && prevProps.containerHeight === newProps.containerHeight
});