import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import * as ReactDOM  from "react-dom";
import * as React from "react";
import { ColorfulGrid, IColorfulGridProps } from "./App/ColorfulGrid";
import { ContextualMenuBase } from "@fluentui/react";

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class ColorfulOptionsetGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container : HTMLDivElement;
	private fullScreenUpdatedProperties = ["fullscreen_open", "fullscreen_close"];
   
	constructor()
	{

	}
	


	private renderGrid(context : ComponentFramework.Context<IInputs>){				
		console.log(context.parameters.dataset.sortedRecordIds.length);				
		const props : IColorfulGridProps = {
			dataset : context.parameters.dataset, 
			utils : context.utils, 
			displayTextType: context.parameters.displayTextType?.raw ?? "SIMPLE",
			displayIconType : context.parameters.displayTextType?.raw!=="NOTEXT" ? context.parameters.displayIconType?.raw ?? "NAME" : "NAME",
			defaultIcon: context.parameters.defaultIcon?.raw ?? "CircleShapeSolid",
			iconConfig1 : context.parameters.iconConfig1?.raw ?? undefined, 
			iconConfig2 : context.parameters.iconConfig2?.raw ?? undefined, 
			iconConfig3 : context.parameters.iconConfig3?.raw ?? undefined, 
			containerWidth : context.mode.allocatedWidth,
			containerHeight: context.mode.allocatedHeight, 
			isSubgrid : (context.parameters as any).autoExpand!= null, 
			setFullScreen : context.mode.setFullScreen, 
			isEditable : context.parameters.isEditable.raw==="Editable",
			//updatedProperties : context.updatedProperties.filter((val) => this.fullScreenUpdatedProperties.includes(val))
			updatedProperties : context.updatedProperties
		};
		ReactDOM.render(React.createElement(ColorfulGrid, props ), this._container);
	}
 
	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;			
		context.mode.trackContainerResize(true);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{	console.log(context.updatedProperties);
		this.renderGrid(context);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this._container);
	}

}