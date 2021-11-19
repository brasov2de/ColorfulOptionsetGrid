import { Icon } from '@fluentui/react/lib/Icon';
import * as React  from 'react';
import { render } from 'react-dom';
import { IGridColumn } from '../Generic/Hooks/useColumns';
import { ISetupSchemaValue } from '../Utils/interfaces';

export interface IColorfulCellItemProps {
    currentValue ?: number;
    currentDisplayName ?: string;
    metadataOptions :   Map<string, ISetupSchemaValue> | undefined;
    displayTextType: "SIMPLE" | "BOX" | "BORDER" | "NOTEXT";    
    displayIconType : "NONE" | "NAME";//| "ENVIRONMENT";
    defaultIcon: string;    
    className ?: string;   
}

export const ColorfulCellItem = function ColorfulCellItem({currentValue, currentDisplayName, metadataOptions, displayTextType, displayIconType, defaultIcon, className} : IColorfulCellItemProps) : JSX.Element{        
    if(currentValue==null){
        return <div></div>;
    }
    let color = metadataOptions?.get(currentValue?.toString() ?? "")?.color ?? "gray";  
    if(color==="white"){
        color = "gray"
    }
    const icon  = metadataOptions?.get(currentValue?.toString() ?? "")?.icon ?? defaultIcon;  
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
    const content = currentDisplayName;    
    const renderText = displayTextType!=="NOTEXT" ? <span className="cell">{content}</span> : ""    
    return(<div className={className} style={style} title={content}>            
            {renderIcon}         
            {renderText}
        </div>);

    
};