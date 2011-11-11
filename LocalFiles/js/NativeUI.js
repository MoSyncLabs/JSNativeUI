/**
 * @file NativeUI.js
 * @author Ali Sarrafi
 * 
 * The library for supporting Native widgets in Javascript and Web applications.
 * Provides support for designing UI both programatically and declaratively.  
 * Should be used together with resourceHandler.js
 */


/**
 * The NativeUI module
 */
NativeUI = {};

/**
 * A hash containing all callback functions that are registered 
 * for getting response of creating a widget
 */
NativeUI.createCallBackTable = {};

/**
 * A Hash containing all registered callback functions for 
 * maWidgetGetProperty that are used for returning the property value
 */
NativeUI.propertyCallBackTable = {};

/**
 * List of registered callback functions for WidgetEvents
 */
NativeUI.eventCallBackTable = {};

/**
 * Creates a NativeUI Widget and registers it callback for return of the handle 
 * 
 * @param widgetType A string that includes type of the widget defined in MoSync Api reference 
 * @param widgetID An ID set by the user for high level access to the widget
 * @param callBackFunction The function that would be called when the widget is created 
 */
NativeUI.maWidgetCreate = function(widgetType, widgetID, callBackFunction){
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetCreate",
				"widgetType": widgetType,
				"widgetID": widgetID
			}, null);
	NativeUI.createCallBackTable[widgetID] = callBackFunction;
};

/**
 * Destroys a widget
 * 
 * @param widgetID ID for the widget in Question
 * See NativeUI.getElementById for getting handles
 */
NativeUI.maWidgetDestroy = function(widgetID){
	var mosyncWidgetHandle = NativeUI.widgetIDList[widgetID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetDestroy",
				"widget": mosyncWidgetHandle,
			}, null);	
};

/**
 * Adds a widget to the given parent as a child. 
 * Letting the parent widget layout the child.
 * 
 * @param widgetID ID of the widget assigned by the user
 * @param childID ID of the widget to be added as a child
 */
NativeUI.maWidgetAddChild = function(widgetID, childID){
	var mosyncWidgetHandle = NativeUI.widgetIDList[widgetID];
	var mosyncChildHandle = NativeUI.widgetIDList[childID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetAddChild",
				"parent": mosyncWidgetHandle,
				"child" : mosyncChildHandle
			}, null);	
};


/**
 * Inserts a widget to the given parent as a child at an index. 
 * Letting the parent widget layout the child.
 * 
 * @param widgetID ID of the parent widget 
 * @param childID ID of the child widget
 * @param index place for the child widget, -1 means last
 */
NativeUI.maWidgetInsertChild = function(widgetID, childID, index){
	var mosyncWidgetHandle = NativeUI.widgetIDList[widgetID];
	var mosyncChildHandle = NativeUI.widgetIDList[childID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetInsertChild",
				"parent": mosyncWidgetHandle,
				"child" : mosyncChildHandle,
				"index" : index
			}, null);	
};

/**
 * Removes a child widget from its parent (but does not destroy it).
 * Removing a currently visible top-level widget causes the MoSync view to become visible.
 * 
 * @param childID ID for the child widget
 */
NativeUI.maWidgetRemoveChild = function(childID){
	var mosyncChildHandle = NativeUI.widgetIDList[childID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetRemoveChild",
				"child" : mosyncChildHandle
			}, null);	
};

/**
 * Shows a screen. If native UI hasn't been initialized, 
 * it is also initialized and disables regular MoSync drawing.
 * 
 * @param childID Id of the screen that should be shown
 */
NativeUI.maWidgetScreenShow = function(screenID){
	var mosyncScreenHandle = NativeUI.widgetIDList[screenID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetScreenShow",
				"screenHandle": mosyncScreenHandle
			}, null);	
};

/**
 * Pushes a screen to the given screen stack, 
 * hides the current screen and shows the pushed screen it. 
 * Pushing it to the stack will make it automatically go back 
 * to the previous screen when popped.
 * 
 * @param stackScreenID Javascript ID of the stackscreen widget
 * @param screenID Javascript ID of the screen widget
 */
NativeUI.maWidgetStackScreenPush = function(stackScreenID, screenID){
	var mosyncStackScreenHandle = NativeUI.widgetIDList[stackScreenID];
	var mosyncScreenHandle = NativeUI.widgetIDList[screenID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetStackScreenPush",
				"stackScreen": mosyncStackScreenHandle,
				"newScreen":mosyncScreenHandle
			}, null);	
};

/**
 * Pops a screen from a screen stack, 
 * hides the current screen and shows the popped screen before 
 * the If there is no previous screen in the screen stack, 
 * an empty screen will be shown.
 * 
 * @param stackScreenID JavaScript ID of the StackScreen
 */
NativeUI.maWidgetStackScreenPop = function(stackScreenID){
	var mosyncStackScreenHandle = NativeUI.widgetIDList[stackScreenID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetStackScreenPop",
				"stackScreen": mosyncStackScreenHandle
			}, null);	
};

/**
 * Sets a specified property on the given widget.
 * 
 * @param widgetID JavaScript ID of the widget 
 * @param property name of the property
 * @param value value of the property
 */
NativeUI.maWidgetSetProperty = function(widgetID, property, value){
	var widgetHandle = NativeUI.widgetIDList[widgetID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetSetProperty",
				"widget": widgetHandle,
				"property": property,
				"value": value
			}, null);	
};

/**
 * Retrieves a specified property from the given widget.
 * 
 * @param widgetID JavaScript ID of the widget
 * @param property name of the property that should be retrived
 * @param callBackFunction the function that will be called when the property is retrived
 */
NativeUI.maWidgetGetProperty = function(widgetID, property, callBackFunction){
	var widgetHandle = NativeUI.widgetIDList[widgetID];
	bridge.messagehandler.send(
			{
				"messageName": "maWidgetGetProperty",
				"widget": widgetHandle,
				"property": property
			}, null);	
	NativeUI.propertyCallBackTable[widgetHandle] = callBackFunction;
};

/**
 * This function is called by C++ to inform creation of a widget
 * If a creation callback is registered it will be called
 * 
 * @param widgetID Javascript Id of the widget
 * @param handle C++ ID of the widget(MoSync Handle)
 */
NativeUI.widgetCreated = function(widgetID, handle) {
	var callBackFunction = NativeUI.createCallBackTable[widgetID];
	NativeUI.widgetIDList[widgetID] = handle;
	if(callBackFunction != null){
		var args = Array.prototype.slice.call(arguments);
		callBackFunction.apply(null, args);
	}
};

/**
 * The callback function for getting the widgetProperty. 
 * If a property callback is registered it will be called
 * 
 * @param widgetHandle C++ ID of the widget sent from C++
 * @param property retrieved property's name
 * @param value value for the retrieved property
 */
NativeUI.widgetProperty = function(widgetHandle, property, value) {
	var callBackFunction = NativeUI.propertyCallBackTable[widgetHandle];
	var args = Array.prototype.slice.call(arguments);
	callBackFunction.apply(null, args);
};

/**
 * Is called by C++ when receiving a widget event. 
 * It in turn calls the registered listener for the specific Widget.
 * 
 * @param widgetHandle C++ ID (MoSync Handle) of the widget that has triggered the event
 * @param eventType Type of the event (maybe followed by at most 3 event data variables)
 * 
 */
NativeUI.event = function(widgetHandle, eventType) {
	var callbackFun = NativeUI.eventCallBackTable[widgetHandle];
	if (undefined != callbackFun)
	{
		var args = Array.prototype.slice.call(arguments);

		// Call the function.
		callbackFun.apply(null, args);
	}
};

/**
 * Registers a callback function for receiving widget events.
 * @param widgetID JavaScript ID of the widget
 * @param callBackFunction function that will be called when the widget sends an event
 */
NativeUI.registerEventListener = function(widgetID, callBackFunction) {
	var widgetHandle = NativeUI.widgetIDList[widgetID];

	NativeUI.eventCallBackTable[widgetHandle] = callBackFunction;
};



/**
 * Stores the number of widgets that are waiting to be created.
 * Used when parsing the XML based input
 */
NativeUI.numWidgetsRequested = 0;

/**
 * Stores the number of widgets that are created.
 * Used when parsing the XML based input
 */
NativeUI.numWidgetsCreated = 0;

/**
 * The interval for checking the availability of all widgets
 * Used when parsing the XML based input
 */
NativeUI.showInterval;


/**
 * List of WidetIDs and handles.
 * Used for accessign widgets through their IDs
 */
NativeUI.widgetIDList = {};

/**
 * Looks up the widget Type in the widgetType Table
 * 
 * @param widgetTagName lower case conversion of the tag name returned by the browser 
 * @returns The MoSync value for that widget
 */
NativeUI.getWidgetType = function(widgetTagName) {
  		return NativeUI.widgetList[widgetTagName.toLowerCase()];
};

/**
 * Provides access to handles through IDs.
 * @param elementID ID of the widget in question
 * @returns MoSync handle value for that widget
 */
NativeUI.getElementById = function(elementID) {
	return NativeUI.widgetIDList[elementID];
};

/**
 * Creates a widget, sets its property and adds it to its parent.
 * @param widgetID ID of the widget in question
 * @param parentID Id of the parentWidget
 */
NativeUI.createWidget = function(widgetID, parentID) {
	var widgetNode = document.getElementById(widgetID);
	var widgetType = widgetNode.getAttribute("widgetType");
	NativeUI.numWidgetsRequested++;	
	var attributeList = widgetNode.attributes;
	NativeUI.maWidgetCreate(widgetType, widgetID, function(widgetID, handle){
		
		//Set the camera by default, We ony support one Camera Preview from JavaScript
		if(widgetType == "CameraPreview")
		{
			bridge.Camera.maCameraSetPreview(handle);
		}
		for(var i = 0; i<attributeList.length; i++) {
			var attrName = attributeList[i].name;
			var attrvalue = attributeList[i].value;
			if(attrName != "id") {
  				if(attrName == "onevent") {
  					var functionData =   attrvalue.split(")")[0];
  					NativeUI.registerEventListener(widgetID, function(widgetHandle, eventType){
  						//TODO: Improve event function parsing mechanism and use 
  						// Function object for better performance
  						var newParamPrefix = 
  							(functionData.charAt(functionData.length-1) == "(")? "" : ",";
  						
  						eval(functionData + newParamPrefix + widgetHandle + ",'" + eventType+"')");
  					});
  				}
  				else if((attrName == "image") || (attrName == "icon")){
  					bridge.ResourceHandler.loadImage(
  							attrvalue,
  							widgetID + "image",
  							function(imageID, imageHandle) {  						
		  						NativeUI.maWidgetSetProperty(
		  								widgetID,
		  								attrName,
		  								imageHandle);
  					});
  				}
  				else {
  				NativeUI.maWidgetSetProperty(widgetID, attrName, attrvalue);
  				}
			}
		}
		if(parentID != null) {
  			NativeUI.maWidgetAddChild(parentID, widgetID);
		}
		NativeUI.numWidgetsCreated++;
	});
};

/**
 * A function that is called when the UI is ready.
 * By default it loads the element with ID "mainScreen"
 * Can be overridden by the user
 */
NativeUI.UIReady = function() {
	NativeUI.maWidgetScreenShow("mainScreen");
};

/**
 * Recursively creates the UI
 * @param parentid ID of the parent Widget
 * @param id ID of the currewnt widget
 */
NativeUI.createChilds = function(parentid, id) {
	if(id != undefined) {
  		var node = document.getElementById(id);
  		var nodeChilds = node.childNodes;
  		NativeUI.createWidget(id, parentid);
  		if(nodeChilds !=null) {
	  		for(var i=0; i<nodeChilds.length;i++) {
	  			if((nodeChilds[i].id != null) &&(nodeChilds[i] != undefined)) {
		  			NativeUI.createChilds(node.id, nodeChilds[i].id);
	  			}
  			}
  		}
		
	}
};

/**
 * Checks the status of UI and calls UIReady when it is ready.
 */
NativeUI.CheckUIStatus = function() {
	if(NativeUI.numWidgetsCreated == NativeUI.numWidgetsRequested) {
		window.clearInterval(NativeUI.showInterval);
		NativeUI.UIReady();
	}
};

/**
 * Shows a MoSync Screen, used by users to change the current screen
 * @param screenID
 */
NativeUI.showScreen = function(screenID) {
	if(numWidgetsCreated == numWidgetsRequested) {
  		NativeUI.maWidgetScreenShow(NativeUI.widgetIDList[screenID]);

	}
};

/**
 * Initializes the UI system and parsing of the XML input
 */
NativeUI.initUI = function() {
	var MoSyncDiv = document.getElementById("NativeUI");
	MoSyncDiv.style.display = "none"; //hide the Native Container
	var MoSyncNodes = document.getElementById("NativeUI").childNodes;
	for(var i = 0; i<MoSyncNodes.length; i++) {
		if((MoSyncNodes[i].id != null) &&(MoSyncNodes[i] != undefined)){
			NativeUI.createChilds( null, MoSyncNodes[i].id);
		}
	}
	NativeUI.showInterval = self.setInterval("NativeUI.CheckUIStatus()", 100);
};
