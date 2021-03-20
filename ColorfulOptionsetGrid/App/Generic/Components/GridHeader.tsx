import * as React from 'react';

import { IColumn, IDetailsHeaderProps } from "@fluentui/react/lib/DetailsList";
import { IRenderFunction } from "@fluentui/react/lib/Utilities";
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';


export function gridHeader(onColumnClick : Function) : ((props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>) => JSX.Element ){
    const onColumnHeaderClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        const name = column?.fieldName ?? "";
        onColumnClick(name);       
    }   
    return ((props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>) => (
        <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true} >                        
        {defaultRender!({...props!, onColumnClick : onColumnHeaderClick })}                
        </Sticky>)
    );
}
           


