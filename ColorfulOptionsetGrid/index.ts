import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import ReactDOM = require("react-dom");
import React = require("react");
import { ColorfulGrid, IOptionSetParam } from "./App/ColorfulGrid";
import { TooltipHost } from "@fluentui/react";
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class ColorfulOptionsetGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container : HTMLDivElement;
	private _setup : Map<string, IOptionSetParam>;
	private _defaultSetup : IOptionSetParam;

	constructor()
	{

	}

	private extractGridParameters(context: ComponentFramework.Context<IInputs>){
		const params : Map<string, IOptionSetParam> = new Map([
			["optionset1",{
				columnAlias: "optionset1", 
				setup: context.parameters.optionset1Setup.raw,
				setupValue: context.parameters.optionset1SetupValue?.raw ?? "CircleShapeSolid"
			 }],
			 ["optionset2",{
				columnAlias: "optionset2", 
				setup: context.parameters.optionset2Setup.raw,
				setupValue: context.parameters.optionset2SetupValue?.raw ?? "CircleShapeSolid"
			 }],
			 ["optionset3",{
				columnAlias: "optionset3", 
				setup: context.parameters.optionset3Setup.raw,
				setupValue: context.parameters.optionset3SetupValue?.raw ?? "CircleShapeSolid"
		 	}]
		]);

		this._defaultSetup = {
				columnAlias: "optionset1", 
			setup: context.parameters.optionset1Setup.raw,
			setupValue: context.parameters.optionset1SetupValue?.raw ?? "CircleShapeSolid"
		};
		const columns = context.parameters.dataset.columns.filter((column) => params.has(column.alias));
		const setup :  [string, IOptionSetParam][] = columns.map((column) => [column.name, params.get(column.alias) ?? this._defaultSetup] );
/*
		const setup : Array<[string, IOptionSetParam]> = params.map((param : IOptionSetParam) => {		
			const col = context.parameters.dataset.columns.find((column) => column.alias===param.columnAlias);
			return [col?.name, param];
		}).filter( ([name]) => name!== undefined);
				
		*/
		this._setup = new Map(setup);

		

	}

	private renderGrid(context : ComponentFramework.Context<IInputs>){
		const props = {
			dataset : context.parameters.dataset, 
			utils : context.utils, 
			setup: this._setup, 
			defaultSetup : this._defaultSetup
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
		this.extractGridParameters(context);	
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
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
		// Add code to cleanup control if necessary
	}

}