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
    onChange: ((value: number) => void) | undefined
}

export const ColorfulCellItem = function ColorfulCellItem({currentValue, currentDisplayName, metadataOptions, displayTextType, displayIconType, defaultIcon, className, onChange} : IColorfulCellItemProps) : JSX.Element{        
    if(currentValue==null){
        return <div></div>;
    }
    let color = metadataOptions?.get(currentValue?.toString() ?? "")?.color ?? "gray";  
    if(color==="white"){
        color = "gray"
    }
    const onClick = React.useCallback((elm: any) => {
        if(onChange!= undefined){ //@ts-ignore
            if(currentValue===true || currentValue===false){
                //@ts-ignore
                onChange({Id: !currentValue})
                return;
            }
            if(currentValue==1 || currentValue==0){
                onChange(currentValue == 0 ? 1 : 0)
                return;
            }//@ts-ignore
            
        }
    }, [currentValue])
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
    return(<div className={`${className}${onChange!=undefined ? " ColorfulCellEditable" : "" } ` } style={style} title={content} onClick={onChange ? onClick : undefined}>            
            {renderIcon}         
            {renderText}
        </div>);

    
};