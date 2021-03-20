import { ContextualMenu } from '@fluentui/react';
import * as React from 'react';

export interface IUseZoomProps{
    setFullScreen: (value : boolean) => void;     
    updatedProperties : string[];
}

export const useZoom = ( {setFullScreen, updatedProperties} : IUseZoomProps ) => {
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    
    const toggleFullScreen = ()=>{
		setFullScreen(!isFullScreen);
    }
    
    React.useEffect(() => {
        if(updatedProperties.includes("fullscreen_open")){
            setIsFullScreen(true);
        }
        else if(updatedProperties.includes("fullscreen_close")){
            setIsFullScreen(false);
        }
    }, [updatedProperties])


    return {
        isFullScreen,
        toggleFullScreen        
    }
    
}