/* eslint-disable no-unused-vars */
import * as React  from 'react';
import { IGridColumn } from '../Generic/Hooks/useColumns';
import { ISetupSchemaValue } from '../Utils/interfaces';
import { ColorfulCellItem } from './ColorfulCellItem';

export interface IColorfulCellProps {
    item: any;
    column: IGridColumn;
    metadataOptions :   Map<string, ISetupSchemaValue> | undefined;
    displayTextType: "SIMPLE" | "BOX" | "BORDER" | "NOTEXT";    
    displayIconType : "NONE" | "NAME";//| "ENVIRONMENT";
    defaultIcon: string;       
    onChange: ((id : string, columnName: string, value: number) => void) | undefined
}

export const ColorfulCell = function ColorfulCell({item, column, metadataOptions, displayTextType, displayIconType, defaultIcon, onChange} : IColorfulCellProps) : JSX.Element{    
    
   /* if(item.raw.getValue(column.original.name) ==null){
        return <div></div>; 
    }*/
    const onClick = onChange!=null ? (value:number) => {         
           if(onChange!=null) {
                onChange(item.raw.getRecordId(), column.original.name, value);        
           }
    } : undefined;
    if(column.original.dataType==="MultiSelectOptionSet"  || column.original.dataType==="MultiSelectPicklist"){
        const currentValues = (item.raw.getValue(column.original.name) as string ?? "").split(",");        
        const currentDisplayNames = (item.raw.getFormattedValue(column.original.name) as string ?? "").split(";");
        return (<div className="ColorfulCell_MultiSelectOptionSet">
            {currentValues.map((currentValue, index) => {
               return (<ColorfulCellItem className='ColorfulCellItem' key={currentValue}
               currentValue={currentValue=="" || currentValue == null ? undefined : parseInt(currentValue)} 
               currentDisplayName={currentDisplayNames[index] ?? ""} 
               defaultIcon={defaultIcon}
               displayIconType={displayIconType}
               displayTextType={displayTextType}
               metadataOptions={metadataOptions}
               onChange={undefined}
               />) 
            })}
        </div>)
    }
    const currentOptionSetValue=  item.raw.getValue(column.original.name) as number;    
    return(<div className={onChange!=undefined ? "ColorfulCellEditable" : undefined }> 
            <ColorfulCellItem className='ColorfulCell' 
                currentValue={currentOptionSetValue} 
                currentDisplayName={item[column.original.name]} 
                defaultIcon={defaultIcon}
                displayIconType={displayIconType}
                displayTextType={displayTextType}
                metadataOptions={metadataOptions}
                onChange={onClick}
                /></div>);

    
};