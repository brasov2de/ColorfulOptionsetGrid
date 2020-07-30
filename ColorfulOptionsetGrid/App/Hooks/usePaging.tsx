import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IDetailsFooterProps, Selection } from '@fluentui/react/lib/DetailsList';
import { Label } from '@fluentui/react/lib/Label';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import * as React from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;


export const usePaging = (dataset: DataSet) => {    
    const [selectedIds, setSelectedIds] = React.useState<string[]>();      
    const [firstItemNumber, setFirstItemNumber] = React.useState<number>(0);
    const [lastItemNumber, setLastItemNumber] = React.useState<number>();
    const [totalRecords, setTotalRecords] = React.useState<number>();
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(0);
               

    React.useEffect(() => {
        if(pageSize===0){
            setPageSize(dataset.sortedRecordIds.length);
            setCurrentPage(1);
            setTotalRecords(dataset.paging.totalResultCount);      
        }               
        setFirstItemNumber((currentPage-1) * pageSize + 1);
        setLastItemNumber((currentPage-1) * pageSize + dataset.sortedRecordIds.length )       
    }, [dataset]);


    function onSelectionIdsChanged(selectionIds: string[]){
        setSelectedIds(selectionIds);      
    } 

    function moveToFirst(){        
        setCurrentPage(1);
        (dataset.paging as any).loadExactPage(1);
    }

    function movePrevious(){        
        const newPage = currentPage-1;
        setCurrentPage(newPage);
        (dataset.paging as any).loadExactPage(newPage);        
    }

    function moveNext(){        
        const newPage = currentPage+1;
        setCurrentPage(newPage);
        (dataset.paging as any).loadExactPage(newPage);        
    }

    return {       
        selectedIds,   
        onSelectionIdsChanged, 
        currentPage,
        firstItemNumber, 
        lastItemNumber, 
        totalRecords, 
        moveToFirst, 
        movePrevious,
        moveNext

    }
}