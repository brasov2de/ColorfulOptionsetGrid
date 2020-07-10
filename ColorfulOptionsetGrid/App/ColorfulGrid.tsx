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
type DataSet = ComponentFramework.PropertyTypes.DataSet;

initializeIcons();



export interface IColorfulGridProps{
    dataset: DataSet;    
    utils : ComponentFramework.Utility;    
    displayType: "BOX" | "BORDER" | "ICON";    
    displayTypeValue ?: string;
}

export const ColorfulGrid = ({dataset, utils, displayType, displayTypeValue} : IColorfulGridProps) : JSX.Element => {
    const customizedColors = dataset.columns.filter((column) => ["optionset1", "optionset2", "optionset3"].includes(column.alias));    
    //found customized, or take all optionset columns otherwise
    const optionSetColumns = (customizedColors.length >0 ? customizedColors : dataset.columns.filter((column) => column.dataType==="OptionSet")).map((column) => column.name);    

    const metadataAttributes = useGetAttributes(dataset.getTargetEntityType(), optionSetColumns, utils );
    const columns = dataset.columns.sort((c1, c2) => c1.order - c2.order).map((column) : IColumn => {
        const meta = metadataAttributes?.options.get(column.name);
        const isOptionSetRenderer : boolean = metadataAttributes?.options.has(column.name);
        return {
            key: column.name,
            name : column.displayName,             
            fieldName: column.name,
            minWidth : column.visualSizeFactor,
            maxWidth: column.visualSizeFactor,
            isResizable: true, 
            onRender: isOptionSetRenderer===true  ? (item : any) => {                            
                switch(displayType){
                    case "BORDER":
                        return  <div style={{ overflow: "hidden", borderWidth: "1px", borderStyle: "solid", borderColor: meta?.get(item.raw.getValue(column.name)) ?? "black", color: meta?.get(item.raw.getValue(column.name)) ?? "black", paddingLeft: "5px", paddingTop: "3px", paddingBottom: "3px", borderRadius: "5px"}}>{item[column.name]}</div>;
                    case "BOX":                    
                        return <div style={{overflow: "hidden", backgroundColor: meta?.get(item.raw.getValue(column.name)) ?? "black", color: "white", paddingLeft: "5px", paddingTop: "3px", paddingBottom: "3px", borderRadius: "5px"}}>{item[column.name]}</div>;
                    case "ICON":
                        return <div> <Icon className="colorIcon" style={{color: meta?.get(item.raw.getValue(column.name)) ?? "white", marginRight: "5px"}} iconName="CircleShapeSolid" aria-hidden="true" /><span>{item[column.name]}</span></div>;
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