import * as React from 'react';
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {IRenderFunction} from '@fluentui/react/lib/Utilities';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import {Selection} from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';

import { GridFooter } from './GridFooter';
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IGridOPverlayProps{
    isSubgrid: Boolean;
    isFullScreen: Boolean; 
    toggleFullScreen: (event: any) => void | undefined;
    selection:Selection;
    containerHeight: number | null | undefined;
    dataset: DataSet;
    selectedCount: number;
    children: JSX.Element;
}

export const GridOverlay = ({isSubgrid, isFullScreen, toggleFullScreen , selection, dataset, selectedCount, children, containerHeight}: IGridOPverlayProps): JSX.Element  => {
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