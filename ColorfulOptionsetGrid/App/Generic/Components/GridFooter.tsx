import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { IconButton } from '@fluentui/react/lib/Button';
import { usePaging } from '../Hooks/usePaging';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IGridFooterProps {
    dataset: DataSet;
    selectedCount: number;
}

export const GridFooter = ({dataset, selectedCount} : IGridFooterProps) => {
    const {             
        currentPage,
        firstItemNumber, 
        lastItemNumber, 
        totalRecords, 
        moveToFirst, 
        movePrevious,
        moveNext
    } = usePaging(dataset);
    
    return (<Stack grow horizontal horizontalAlign="space-between" >
    <Stack.Item className="Footer">
        <Stack grow horizontal horizontalAlign="space-between" >
            <Stack.Item grow={1} align="center" >{firstItemNumber} - {lastItemNumber} of {totalRecords} ({selectedCount} selected)</Stack.Item>
            <Stack.Item grow={1} align="center" className="FooterRight">
                <IconButton className="FooterIcon" iconProps={{ iconName: "Previous"}} onClick={moveToFirst} disabled={!dataset.paging.hasPreviousPage}/>
                <IconButton className="FooterIcon" iconProps={{ iconName: "ReplyAlt"}} onClick={movePrevious} disabled={!dataset.paging.hasPreviousPage}/>
                <span >Page {currentPage}</span>
                <IconButton className="FooterIcon ArrowRight" iconProps={{ iconName: "ReplyAlt" }} onClick={moveNext} disabled={!dataset.paging.hasNextPage}/>
            </Stack.Item>
        </Stack>
    </Stack.Item>
</Stack>)
}

//FlickRight <