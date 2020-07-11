import * as React from 'react';

import {DetailsList, IColumn, DetailsListLayoutMode, IDetailsFooterProps, ISelection, IDetailsHeaderProps} from '@fluentui/react/lib/DetailsList';
import {mergeStyles, DefaultFontStyles } from '@fluentui/react/lib/Styling';
import { useGetAttributes } from './Hooks/useGetMetadata';
import {Icon} from '@fluentui/react/lib/Icon';
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {IRenderFunction} from '@fluentui/react/lib/Utilities';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {Label} from '@fluentui/react/lib/Label';
import {CommandBar, ICommandBarItemProps} from '@fluentui/react/lib/CommandBar';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import {Example_Env_Var_Ampel} from '../Data/EnvVarSchema';
import { IGridColumn, useColumns } from './Hooks/useColumns';
type DataSet = ComponentFramework.PropertyTypes.DataSet;

initializeIcons();

export interface ISetupSchemaValue{
    icon ?: string;
    color ?: string;
}

export interface ISetupSchema{
    [value:number] : ISetupSchemaValue;    
}

export interface IColorfulGridProps{
    dataset: DataSet;    
    utils : ComponentFramework.Utility;    
    displayType: "BOX" | "BORDER" | "ICON";    
    displayTypeValue ?: string;
    containerWidth ?: number;
}

export const ColorfulGrid = ({dataset, utils, displayType, displayTypeValue, containerWidth} : IColorfulGridProps) : JSX.Element => {
     const customizedColors = dataset.columns.filter((column) => ["optionset1", "optionset2", "optionset3"].includes(column.alias));    
    //found customized, or take all optionset columns otherwise
    const optionSetColumns = (customizedColors.length >0 ? customizedColors : dataset.columns.filter((column) => column.dataType==="OptionSet")).map((column) => column.name);    
    const metadataAttributes = useGetAttributes(dataset.getTargetEntityType(), optionSetColumns, utils );

    const gridColumns = useColumns(dataset, containerWidth);

    const columns = gridColumns.columns.map((column) : IColumn => {
        const meta = metadataAttributes?.options.get(column.original.name);
        const isOptionSetRenderer : boolean = metadataAttributes?.options.has(column.original.name);
        const schema = column.original.alias==="optionset3" ? Example_Env_Var_Ampel : undefined;   
        return {
            key: column.original.name,
            name : column.original.displayName,             
            fieldName: column.original.name,
            minWidth : column.minWidth,
            maxWidth : column.maxWidth,
            isResizable: true, 
            onRender: isOptionSetRenderer===true  ? (item : any) => {      
                const currentOptionSetValue=  item.raw.getValue(column.original.name) as number;
                const color = schema?.[currentOptionSetValue]?.color ?? meta?.get(currentOptionSetValue?.toString() ?? "") ?? "black";
                const icon  = schema?.[currentOptionSetValue]?.icon ?? displayTypeValue;
                switch(displayType){
                    case "BORDER":
                        return  <div  className="ColorfulCell" style={{ borderWidth: "1px", borderStyle: "solid", borderColor: color, color: color,  borderRadius: "5px"}}><span  className="cell">{item[column.original.name]}</span></div>;
                    case "BOX":                    
                        return <div  className="ColorfulCell"style={{ backgroundColor: color, color: "white", borderRadius: "5px"}}><span className="cell">{item[column.original.name]}</span></div>;
                    case "ICON":
                        return <div className="ColorfulCell"> <Icon className="colorIcon" style={{color: color , marginRight: "5px"}} iconName={icon} aria-hidden="true" /><span className="cell">{item[column.original.name]}</span></div>;
                    default:
                        break;
                }
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
    
   
    const cmdBarItems: ICommandBarItemProps[] = [];
    const totalRecords: number = 500;

    const _onRenderDetailsHeader = (props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element => {
        return (
          <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
            {defaultRender!({...props!})}
          </Sticky>
        );
      }

   

    const renderCommandBarFarItem = (recordsLoaded: number): ICommandBarItemProps[] =>
    {
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

    const _onRenderDetailsFooter = (props: IDetailsFooterProps | undefined, defaultRender?: IRenderFunction<IDetailsFooterProps>): JSX.Element => {
        const cmdBarFarItems: ICommandBarItemProps[] = renderCommandBarFarItem(dataset.sortedRecordIds.length);
        return (
            <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true}>
                <div> 
                    <Label className={"listFooterLabel"}>{`25 selected`}</Label>
                    <CommandBar className={"cmdbar"} farItems={cmdBarFarItems} items={cmdBarItems} />                    
                </div>
            </Sticky>
        );
    }
   

    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>
            <ScrollablePane scrollbarVisibility={"auto"} >
          
                <DetailsList 
                    onRenderDetailsFooter={_onRenderDetailsFooter}
                    onRenderDetailsHeader={_onRenderDetailsHeader}
                    items={items} 
                    columns={columns}           
                    layoutMode={DetailsListLayoutMode.justified}>        
                    
                </DetailsList>
          
            </ScrollablePane>
            </div>
        
    );
}