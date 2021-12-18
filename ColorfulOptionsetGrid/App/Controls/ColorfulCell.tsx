import { getItemClassNames } from '@fluentui/react/lib/components/ContextualMenu/ContextualMenu.classNames';
import { Icon } from '@fluentui/react/lib/Icon';
import * as React  from 'react';
import { render } from 'react-dom';
import internal = require('stream');
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
    
    if(item.raw.getValue(column.original.name) ==null){
        return <div></div>;
    }
    const onClick = (value:number) => {         
           if(onChange!=null) {
                onChange(item.raw.getRecordId(), column.original.name, value);        
           }
    };
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
               onChange={undefined}
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
                onChange={onClick}
                />);

    
};