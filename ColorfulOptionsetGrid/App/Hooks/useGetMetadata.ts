import React = require("react");


export const useGetAttributes = (entityName : string, attributeNames : string[], utils: ComponentFramework.Utility) => {
    const [options, setOptions] = React.useState<Map<string, ComponentFramework.PropertyHelper.OptionMetadata[]>>(new Map());
    

    React.useEffect(() => {
        utils.getEntityMetadata(entityName, attributeNames)
        .then((entityMetadata) => {
            const opts = attributeNames.map((attributeName) => {
                const thisOptions : ComponentFramework.PropertyHelper.OptionMetadata[]= entityMetadata.Attributes.get(attributeName)?.attributeDescriptor.OptionSet ?? [];
                return [attributeName, thisOptions] as [string,  ComponentFramework.PropertyHelper.OptionMetadata[]];
            } )
            console.log(opts);
            //todo implement fallback per webapi
            setOptions(new Map(opts));
        })

    }, [entityName, ...attributeNames]);

    return 
    {
        options
    };

}