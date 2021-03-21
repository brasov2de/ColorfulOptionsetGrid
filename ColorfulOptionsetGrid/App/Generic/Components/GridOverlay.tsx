import * as React from 'react';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import {Selection} from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';

import { GridFooter } from './GridFooter';
import { useZoom } from '../Hooks/useZoom';
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IGridOPverlayProps{
    isSubgrid: Boolean;
    updatedProperties: string[];
    setFullScreen: (value:boolean) => void | undefined;
    selection:Selection;
    containerHeight: number | null | undefined;
    dataset: DataSet;
    selectedCount: number;
    children: JSX.Element;
}

export const GridOverlay = ({isSubgrid, updatedProperties, setFullScreen, selection, dataset, selectedCount, children, containerHeight}: IGridOPverlayProps): JSX.Element  => {
    const {isFullScreen, toggleFullScreen } = useZoom({setFullScreen, updatedProperties});
    if(isSubgrid===true && isFullScreen===false ){
        return (                 
            <>
                {toggleFullScreen &&  <div className="actionBar">
                    <Icon iconName="MiniExpand" style={{height: "30px", width: "30px", cursor: "pointer"}} onClick={toggleFullScreen} /> 
                </div>}
                <MarqueeSelection selection={selection}>
                    {children}
                </MarqueeSelection>                    
                
                <GridFooter dataset={dataset} selectedCount={selectedCount}></GridFooter>                                    
            </>            
        )
    }

    const height = (containerHeight != null && containerHeight!==-1) ? `${containerHeight}px` : "100%";
    return (      
        <Stack grow verticalFill className="container" style={{height, width: "100%"}}>             
            <Stack.Item grow className="gridContainer" >
                <ScrollablePane scrollbarVisibility={"auto"} >                 
                    <MarqueeSelection selection={selection}>
                       {children}
                    </MarqueeSelection>                    
                </ScrollablePane>
            </Stack.Item>
            
            <Stack.Item>                
                <GridFooter dataset={dataset} selectedCount={selectedCount}></GridFooter>                
            </Stack.Item>

        </Stack>         
        
    );
}