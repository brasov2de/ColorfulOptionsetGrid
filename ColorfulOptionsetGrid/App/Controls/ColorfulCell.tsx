import { Icon } from '@fluentui/react/lib/Icon';
import * as React  from 'react';
import { render } from 'react-dom';
import { IGridColumn } from '../Hooks/useColumns';
import { ISetupSchemaValue } from '../Utils/interfaces';

export interface IColorfulCellProps {
    item: any;
    column: IGridColumn;
    metadataOptions :   Map<string, ISetupSchemaValue> | undefined;
    displayTextType: "SIMPLE" | "BOX" | "BORDER" | "NOTEXT";    
    displayIconType : "NONE" | "NAME";//| "ENVIRONMENT";
    defaultIcon: string;       
}

export const ColorfulCell = function ColorfulCell({item, column, metadataOptions, displayTextType, displayIconType, defaultIcon} : IColorfulCellProps) : JSX.Element{    
    const currentOptionSetValue=  item.raw.getValue(column.original.name) as number;    
    let color = metadataOptions?.get(currentOptionSetValue?.toString() ?? "")?.color ?? "gray";  
    if(color==="white"){
        color = "gray"
    }
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
            backgroundColor: color==="white" ? "gray" : color, color: iconColor, borderRadius: "5px"
        }, 
        "SIMPLE" : {             
        }, 
        "NOTEXT": {       
            cursor: "pointer"     
        }
    }[displayTextType];   
    const content = item[column.original.name];
    const renderText = displayTextType!=="NOTEXT" ? <span className="cell">{content}</span> : ""    
    return(<div className="ColorfulCell" style={style} title={content}>            
            {renderIcon}         
            {renderText}
        </div>);

    
};