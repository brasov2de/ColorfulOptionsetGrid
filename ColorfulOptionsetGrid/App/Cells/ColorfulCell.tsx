import { Icon } from '@fluentui/react/lib/Icon';
import * as React  from 'react';
import { IGridColumn } from '../Hooks/useColumns';
import { ISetupSchema, ISetupSchemaValue } from '../Model/interfaces';

export interface IColorfulCellProps {
    item: any;
    column: IGridColumn;
    metadataOptions :   Map<string, ISetupSchemaValue> | undefined;
    displayTextType: "SIMPLE" | "BOX" | "BORDER" | "NONE";    
    displayIconType : "NONE" | "NAME" | "CONFIG" | "ENVIRONMENT";
    defaultIcon: string;       
}

export const ColorfulCell = function ColorfulCell({item, column, metadataOptions, displayTextType, displayIconType, defaultIcon} : IColorfulCellProps) : JSX.Element{    
    const currentOptionSetValue=  item.raw.getValue(column.original.name) as number;    
    const color = metadataOptions?.get(currentOptionSetValue?.toString() ?? "")?.color ?? "black";  
    const icon  = metadataOptions?.get(currentOptionSetValue?.toString() ?? "")?.icon ?? defaultIcon;  
    const iconColor = displayTextType==="BOX" ? "white" : color;
    const renderIcon = displayIconType!=="NONE" ? <Icon className="colorIcon" style={{color: iconColor , marginRight: "5px"}} iconName={icon} aria-hidden="true" /> : "";
    const style = {
        "BORDER" : {
            borderWidth: "1px", 
            borderStyle: "solid", 
            borderColor: color, 
            color: color,  
            borderRadius: "5px"
        },
        "BOX" : {
            backgroundColor: color, color: iconColor, borderRadius: "5px"
        }, 
        "SIMPLE" : {
        }, 
        "NONE": {
        }
    }[displayTextType];   
    return(<div className="ColorfulCell" style={style}>            
            {renderIcon}
           
                <span  className="cell">{item[column.original.name]}</span>
           
        </div>);

    
};