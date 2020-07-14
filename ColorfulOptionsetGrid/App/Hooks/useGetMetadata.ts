import * as React from 'react';


export const useGetAttributes = (entityName : string, attributeNames : string[], utils: ComponentFramework.Utility) => {
    const [options, setOptions] = React.useState<Map<string, Map<string, string>>>(new Map());
    

    React.useEffect(() => {
        if(utils==null || typeof((window as any).Xrm) ==="undefined"){
            console.log("could not find utils. It's a canvas app");
            setOptions(new Map(attributeNames.map((attributeName) => [attributeName, new Map<string, string>()])));  
            return;       
        }
        utils.getEntityMetadata(entityName, attributeNames)
        .then((entityMetadata) => {
            const opts = attributeNames.map((attributeName) => {                
                const thisOptions : []= (entityMetadata.Attributes.get(attributeName)?.attributeDescriptor.OptionSet ?? []).map((option : any) => [option.Value.toString(), option.Color] );
                return [attributeName, new Map(thisOptions)] as [string,  Map<string, string>];
            } )
            console.log(opts);
            //todo implement fallback per webapi
            setOptions(new Map(opts));
        })
        .catch(console.error);

    }, [entityName, ...attributeNames]);

    return {
        options
    };

}