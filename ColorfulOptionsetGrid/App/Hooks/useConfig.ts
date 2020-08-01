import * as React from 'react';
import { ISetupSchema, ISetupSchemaValue } from '../Utils/interfaces';
import { getAttributes } from '../Utils/getMetadata';

type DataSet = ComponentFramework.PropertyTypes.DataSet;


function parseIconConfig(defaultIcon : string, iconConfig ?: string){
    const isJSON = iconConfig && iconConfig.includes("{");
    return { 
        jsonConfig : isJSON === true ? JSON.parse(iconConfig as string) as ISetupSchema : undefined,
        defaultIconName : isJSON===false ? iconConfig : defaultIcon
    }
}

export const useConfig= (dataset: DataSet, defaultIcon: string, utils: ComponentFramework.Utility, iconConfig1?:string, iconConfig2?:string, iconConfig3?:string) => {

    const [configs, setConfigs] = React.useState<[string, ISetupSchema | undefined][]>([]);
    const [optionSetColumns, setOptionSetColumns ] = React.useState<string[]>([]);
    const [defaultIconNames, setDefaultIconNames] = React.useState<Map<string |undefined, string |undefined>>(new Map());
    const [metadataAttributes, setMetadataAttributes] = React.useState<Map<string, Map<string, ISetupSchemaValue>>>(new Map()); 

    React.useEffect(() => {
        const customizedColumns = {
            "optionset1": {
                    column: dataset.columns.find((column) => column.alias ==="optionset1"),
                    ...parseIconConfig(defaultIcon, iconConfig1)
            },
            "optionset2": {
                column: dataset.columns.find((column) => column.alias ==="optionset2"),
                ...parseIconConfig(defaultIcon, iconConfig2)
            },
            "optionset3": {
                column: dataset.columns.find((column) => column.alias ==="optionset3"),
                ...parseIconConfig(defaultIcon, iconConfig3)
            }
        }
         const customizedColumnsArray  = Object.values(customizedColumns).filter((setup) => setup.column !== undefined);         
         setDefaultIconNames(new Map((customizedColumnsArray).map((setup) => [setup.column?.name, setup.defaultIconName ] )))
         const myConfigs : [string, ISetupSchema | undefined][]= customizedColumnsArray.map((setup) => [setup.column?.name ?? "", setup.jsonConfig ]);
         setConfigs(myConfigs);
         const myOptionSetColumns = customizedColumnsArray.length >0  //found customized, or take all optionset columns otherwise
            ? customizedColumnsArray.map((setup) => setup.column?.name ?? "")
            : dataset.columns.filter((column) => column.dataType==="OptionSet").map((column) => column.name);
         setOptionSetColumns(myOptionSetColumns);   
         getAttributes(dataset.getTargetEntityType(), myOptionSetColumns, utils , new Map(myConfigs))
            .then(setMetadataAttributes);
    }, [dataset]);
    

        return {
            configs, 
            optionSetColumns, 
            defaultIconNames, 
            metadataAttributes
        }

} 