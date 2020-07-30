import * as React from 'react';
import { IConfigRawValues, ISetupSchemaValue } from '../Model/interfaces';




export const useGetAttributes = (entityName : string, attributeNames : string[], utils: ComponentFramework.Utility, configs : IConfigRawValues) => {
    const [options, setOptions] = React.useState<Map<string, Map<string, ISetupSchemaValue>>>(new Map());
    

    React.useEffect(() => {
        if(utils==null || typeof((window as any).Xrm) ==="undefined"){
            console.log("could not find utils. It's a canvas app");
            setOptions(new Map(attributeNames.map((attributeName) => [attributeName, new Map<string, ISetupSchemaValue>()])));  
            return;       
        }
        utils.getEntityMetadata(entityName, attributeNames)
        .then((entityMetadata) => {
            const opts = attributeNames.map((attributeName) => {                
                const config = configs.get(attributeName);
                const thisOptions : []= (entityMetadata.Attributes.get(attributeName)?.attributeDescriptor.OptionSet ?? [])
                    .map((option : any) => {
                        const configOption = config ? config[option.Value.toString()] : undefined;
                        return [
                        option.Value.toString(), 
                        {
                            color : configOption?.color ?? option.Color, 
                            icon: configOption?.icon
                        }];
                    } );
                return [attributeName, new Map(thisOptions)] as [string,  Map<string, ISetupSchemaValue>];
            } )
            const mapped = new Map(opts);
            configs.forEach((value, key) => {
                if(!mapped.has(key) && value !== undefined){
                    mapped.set(key, new Map(Object.entries(value)));
                }
            })            
            console.log(opts);
            //todo implement fallback per webapi
            
            setOptions(mapped);
        })
        .catch(console.error);

    }, [entityName, ...attributeNames]);

    return {
        options
    };

}