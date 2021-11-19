import { Icon } from '@fluentui/react/lib/Icon';
import * as React  from 'react';
import { render } from 'react-dom';
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
}

export const ColorfulCell = function ColorfulCell({item, column, metadataOptions, displayTextType, displayIconType, defaultIcon} : IColorfulCellProps) : JSX.Element{    
    
    if(item.raw.getValue(column.original.name) ==null){
        return <div></div>;
    }
    if(column.original.dataType==="MultiSelectOptionSet"  || column.original.dataType==="MultiSelectPicklist"){
        const currentValues = (item.raw.getValue(column.original.name) as string ?? "").split(",");        
        const currentDisplayNames = (item.raw.getFormattedValue(column.original.name) as string ?? "").split(";");
        return (<div className="ColorfulCell_MultiSelectOptionSet">
            {currentValues.map((currentValue, index) => {
               return (<ColorfulCellItem className='ColorfulCellItem' 
               currentValue={parseInt(currentValue)} 
               currentDisplayName={currentDisplayNames[index] ?? ""} 
               defaultIcon={defaultIcon}
               displayIconType={displayIconType}
               displayTextType={displayTextType}
               metadataOptions={metadataOptions}
               />) 
            })}
        </div>)
    }
    const currentOptionSetValue=  item.raw.getValue(column.original.name) as number;    
    return(<ColorfulCellItem className='ColorfulCell' 
                currentValue={currentOptionSetValue} 
                currentDisplayName={item[column.original.name]} 
                defaultIcon={defaultIcon}
                displayIconType={displayIconType}
                displayTextType={displayTextType}
                metadataOptions={metadataOptions}
                />);

    
};