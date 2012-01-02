/**
 * @file NativeUI.js
 * @author Ali Sarrafi
 * 
 * The library for supporting Native widgets in Javascript and Web applications.
 * Provides support for designing UI both programatically and declaratively.  
 * Should be used together with resourceHandler.js
 */


/**
 * @namespace
 * The NativeUI module
 */
NativeUI = {};

/**
 * A hash containing all callback functions that are registered 
 * for getting response of creating a widget
 */
NativeUI.callBackTable = {};

/**
 * List of registered callback functions for WidgetEvents
 */
NativeUI.eventCallBackTable = {};

/**
 * used to generate IDs for widgets that do not have one
 */
NativeUI.widgetCounter = 0;


/**
 * Creates a NativeUI Widget and registers it callback for return of the handle 
 * 
 * @param widgetType A string that includes type of the widget defined in MoSync Api reference 
 * @param widgetID An ID set by the user for high level access to the widget
 * @param successCallback The function that would be called when the widget is created
 * @param errorCallback The function that would be called is an error happens
 * @param processedCallback optional call back for knowing that the message is processed
 *  
 */
NativeUI.maWidgetCreate = function(
		widgetType,
		widgetID,
		successCallback,
		errorCallback,
		processedCallback)
{
	
	callbackID = "create" + widgetID;
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetCreate",
				"widgetType": widgetType,
				"widgetID" : widgetID,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback, 
			error:errorCallback
		};
};

/**
 * Destroys a widget
 * 
 * @param widgetID ID for the widget in Question
 * @param processedCallback optional call back for knowing that the message is processed
 * See NativeUI.getElementById for getting handles
 */
NativeUI.maWidgetDestroy = function(
		widgetID,
		successCallBack,
		errorCallback,
		processedCallback)
{
	callbackID = "destroy" + widgetID;
	var mosyncWidgetHandle = NativeUI.widgetIDList[widgetID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetDestroy",
				"widget": mosyncWidgetHandle,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Adds a widget to the given parent as a child. 
 * Letting the parent widget layout the child.
 * 
 * @param widgetID ID of the widget assigned by the user
 * @param childID ID of the widget to be added as a child
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetAddChild = function(
		widgetID,
		childID,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "addChild" + widgetID + childID;
	var mosyncWidgetHandle = NativeUI.widgetIDList[widgetID];
	var mosyncChildHandle = NativeUI.widgetIDList[childID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetAddChild",
				"parent": mosyncWidgetHandle,
				"child" : mosyncChildHandle,
				"NativeUICallbackID": callbackID
			}, processedCallback);	
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};


/**
 * Inserts a widget to the given parent as a child at an index. 
 * Letting the parent widget layout the child.
 * 
 * @param widgetID ID of the parent widget 
 * @param childID ID of the child widget
 * @param index place for the child widget, -1 means last
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetInsertChild = function(
		widgetID,
		childID,
		index,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "insertChild" + widgetID;
	var mosyncWidgetHandle = NativeUI.widgetIDList[widgetID];
	var mosyncChildHandle = NativeUI.widgetIDList[childID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetInsertChild",
				"parent": mosyncWidgetHandle,
				"child" : mosyncChildHandle,
				"index" : index,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] =
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Removes a child widget from its parent (but does not destroy it).
 * Removing a currently visible top-level widget causes the MoSync view to become visible.
 * 
 * @param childID ID for the child widget
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetRemoveChild = function(
		childID,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "removeChild" + childID;
	var mosyncChildHandle = NativeUI.widgetIDList[childID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetRemoveChild",
				"child" : mosyncChildHandle,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Shows a screen. If native UI hasn't been initialized, 
 * it is also initialized and disables regular MoSync drawing.
 * 
 * @param childID Id of the screen that should be shown
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetScreenShow = function(
		screenID,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "screenShow" + screenID;
	var mosyncScreenHandle = NativeUI.widgetIDList[screenID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetScreenShow",
				"screenHandle": mosyncScreenHandle,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Pushes a screen to the given screen stack, 
 * hides the current screen and shows the pushed screen it. 
 * Pushing it to the stack will make it automatically go back 
 * to the previous screen when popped.
 * 
 * @param stackScreenID Javascript ID of the stackscreen widget
 * @param screenID Javascript ID of the screen widget
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetStackScreenPush = function(
		stackScreenID,
		screenID,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "StackScreenPush" + screenID;
	var mosyncStackScreenHandle = NativeUI.widgetIDList[stackScreenID];
	var mosyncScreenHandle = NativeUI.widgetIDList[screenID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetStackScreenPush",
				"stackScreen": mosyncStackScreenHandle,
				"newScreen":mosyncScreenHandle,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Pops a screen from a screen stack, 
 * hides the current screen and shows the popped screen before 
 * the If there is no previous screen in the screen stack, 
 * an empty screen will be shown.
 * 
 * @param stackScreenID JavaScript ID of the StackScreen
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetStackScreenPop = function(
		stackScreenID,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "StackScreenPop" + 
		stackScreenID + 
		Math.round(Math.random()*100);
	var mosyncStackScreenHandle = NativeUI.widgetIDList[stackScreenID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetStackScreenPop",
				"stackScreen": mosyncStackScreenHandle,
				"NativeUICallbackID": callbackID
			}, processedCallback);
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Sets a specified property on the given widget.
 * 
 * @param widgetID JavaScript ID of the widget 
 * @param property name of the property
 * @param value value of the property
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetSetProperty = function(
		widgetID,
		property,
		value, 
		successCallback,
		errorCallback,
		processedCallback)
{
	
	//make sure the id is unique for this call
	callbackID = "setProperty" + widgetID + property + value; 
	var widgetHandle = NativeUI.widgetIDList[widgetID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetSetProperty",
				"widget": widgetHandle,
				"property": property,
				"value": value,
				"NativeUICallbackID": callbackID
			}, processedCallback);	
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};

/**
 * Retrieves a specified property from the given widget.
 * 
 * @param widgetID JavaScript ID of the widget
 * @param property name of the property that should be retrived
 * @param callBackFunction the function that will be called when the property is retrived
 * @param processedCallback optional call back for knowing that the message is processed
 * 
 */
NativeUI.maWidgetGetProperty = function(
		widgetID,
		property,
		successCallback,
		errorCallback,
		processedCallback)
{
	callbackID = "getProperty" + widgetID + property;
	var widgetHandle = NativeUI.widgetIDList[widgetID];
	bridge.messagehandler.send(
			{
				"messageName" : "NativeUI",
				"action": "maWidgetGetProperty",
				"widget": widgetHandle,
				"property": property,
				"NativeUICallbackID": callbackID
			}, processedCallback);	
	NativeUI.callBackTable[callbackID] = 
		{
			success: successCallback,
			error:errorCallback
		};
};


/**
 * This function is called by C++ to inform creation of a widget
 * If a creation callback is registered it will be called
 * 
 * @param callbackID Javascript Id of the widget
 * 
 */
NativeUI.createCallback = function(callbackID, widgetID, handle)
{
	var callBack = NativeUI.callBackTable[callbackID];
	NativeUI.widgetIDList[widgetID] = handle;
	
	if(callBack.success)
	{
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		callBack.success.apply(null, args);
	}
};

NativeUI.success = function(callbackID) 
{
	var callBack = NativeUI.callBackTable[callbackID];
	
	if(callBack.success)
	{
		var args = Array.prototype.slice.call(arguments);
		//remove the callbakID from the argument list
		args.shift();
		callBack.success.apply(null, args);
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
NativeUI.error = function(callbackID) {
	var callBack = NativeUI.callBackTable[callbackID];
	var args = Array.prototype.slice.call(arguments);
	args.shift();
	if(callBack.error){
		var args = Array.prototype.slice.call(arguments);
		callBack.error.apply(null, args);
	}
};

/**
 * Is called by C++ when receiving a widget event. 
 * It in turn calls the registered listener for the specific Widget.
 * You normally do not use this function is called internally.
 * 
 * @param widgetHandle C++ ID (MoSync Handle) of the widget that has triggered the event
 * @param eventType Type of the event (maybe followed by at most 3 event data variables)
 * 
 */
NativeUI.event = function(widgetHandle, eventType) {

	var callbackID = widgetHandle + eventType;
	console.log("received an event for " + callbackID); 
	var callbackFunctions = NativeUI.eventCallBackTable[callbackID];
	console.log("calling the callback " + callbackFunctions);
	//if we have a listener registered for this combination  call it
	if (callbackFunctions != undefined)
	{
		//extract the function arguments 
		var args = Array.prototype.slice.call(arguments);
		for (key in callbackFunctions) {
			
			var callbackFun = callbackFunctions[key];
			// Call the function.
			callbackFun.apply(null, args);
		}
	}
};

NativeUI.NativeElementsTable = {};

/**
 * Registers a callback function for receiving widget events.
 * 
 * @param widgetID JavaScript ID of the widget.
 * @param eventType Type of the events the users wants to listen to.
 * @param callBackFunction function that will be called when the
 * widget sends an event.
 */
NativeUI.registerEventListener = function(
		widgetID,
		eventType,
		listenerFunction)
{
	var widgetHandle = NativeUI.widgetIDList[widgetID];
	var callbackID = widgetHandle + eventType;
	console.log("registering event listener for " + callbackID + " which is " + listenerFunction);
	if(NativeUI.eventCallBackTable[callbackID])
	{
		NativeUI.eventCallBackTable[callbackID].push(listenerFunction);
	}
	else
	{
		NativeUI.eventCallBackTable[callbackID] = [listenerFunction];
	}
	
};


/**
 * 
 * A widget object that user can interact with instead of using the low 
 * level functions. It is used in 
 * @class represents a widget that can be manipulated
 * @param widgetType Type of the widget that has been created
 * @param widgetID ID of the widget used for identifying the widget(can be ignored by the user)
 * 
 */
NativeUI.NativeWidgetElement = function(
		widgetType,
		widgetID,
		params,
		successCallback,
		errorCallback)
{
	var self = this; 

	self.commandQueue = [];
	
	self.params = params;
	
	self.eventQueue = [];
	
	var type = widgetType;
	/**
	 * Internal function used for synchronizing the widget operations.
	 * It makes sure that the widget is created before calling any other functions.
	 *   
	 */
	this.processedMessage = function()
	{
		if(self.commandQueue.length > 0) 
		{
			self.commandQueue[0].func.apply(
					null,
					self.commandQueue[0].args);
		}
		if(self.commandQueue.length > 0) 
		{
			self.commandQueue.shift();
		}
	};
	
	this.isScreen = ((type == "Screen") ||
			(type == "TabScreen") ||
			(type == "StackScreen"))? true : false;
	/*
	 * if the widgetID is not defined by the user we generate one 
	 */
	if(widgetID)
	{
		self.id = widgetID;
	}
	else
	{
		self.id = "natvieWidget" + widgetType + NativeUI.widgetCounter;
		NativeUI.widgetCounter++;
	}
		
	/**
	 * Internal success function used for creation of the widget 
	 * @private
	 */
	var onSuccess = function(widgetID, widgetHandle) 
	{		
		self.created = true;
		self.handle = widgetHandle;
		if(self.params)
		{
			for(key in self.params)
			{
				var propertyName = NativeUI.getNativeAttrName(key);
				var propertyValue = NativeUI.getNativeAttrValue(self.params[key]);
				self.setProperty(propertyName, propertyValue, null, null);
			}
		}
		if(self.eventQueue)
		{
			for(key in self.eventQueue)
			{
				self.addEventListener(
						self.eventQueue[key].event, 
						self.eventQueue[key].callback);
			}
		}
		if(successCallback)
		{
			
			successCallback.apply(null, [widgetID]);
		}
	};
	/**
	 *  Internal error function used for creation of the widget 
	 * @private
	 */
	var onError = function(errorCode)
	{
		self.latestError = errorCode;
		if(errorCallback)
		{
			errorCallback.apply(null, [errorCode]);
		}
		
	};
	/*
	 * Create the widget in the Native Side
	 */
	NativeUI.maWidgetCreate(
			widgetType,
			self.id,
			onSuccess,
			onError,
			self.processedMessage);
	
	/**
	 * sets a property to the widget in question 
	 */
	this.setProperty = function(
			property,
			value,
			successCallback,
			errorCallback)
	{
		if(self.created)
		{
			NativeUI.maWidgetSetProperty(
					self.id, 
					property,
					value,
					successCallback,
					errorCallback,
					self.processedMessage);			
		}
		else
		{
					self.commandQueue.push(
							{func:self.setProperty,
							args:[property,
							      value,
							      successCallback,
							      errorCallback]});	
		}
	};
	
	/**
	 * retirves a property and call the respective callback
	 * 
	 * @param property name of the property
	 * @param successCallback a function that will be called if the operation is successfull
	 * @param errorCallback a function that will be called if an error occurs
	 */
	this.getProperty = function(
			property,
			successCallback,
			errorCallback)
	{
		if(self.created)
		{
			NativeUI.maWidgetGetProperty(
				self.id,
				property,
				successCallback,
				errorCallback,
				self.processedMessage);
		}
		else
		{
			self.commandQueue.push(
					{func:self.getProperty,
					args:[property,
					successCallback,
					errorCallback]});			
		}
	};
	
	/**
	 * Registers an event listener for this widget
	 * 
	 * @param eventType type of the event that the user wants to listen to
	 * @param listenerFunction a function that will be called when that event is fired.
	 * 
	 */
	this.addEventListener = function(eventType, listenerFunction) 
	{
		if(self.created)
		{
			NativeUI.registerEventListener(
					self.id,
					eventType,
					listenerFunction); 
		}
		else
		{
			self.eventQueue.push(
					{
						event: eventType,
						callback: listenerFunction
					});			
		}

	};
	
	/**
	 * Adds a child widget to the cureent widget
	 * 
	 * @param childID the ID for th echild widget
	 * @param successCallback a function that will be called if the operation is successfull
	 * @param errorCallback a function that will be called if an error occurs
	 *  
	 */
	this.addChild = function(childID, successCallback, errorCallback)
	{
		
		if((self.created) &&(childID != undefined))
		{
			NativeUI.maWidgetAddChild(
					self.id,
					childID,
					successCallback,
					errorCallback,
					self.processedMessage);
		}
		else
		{
			self.commandQueue.push(
					{func:self.addChild,
					args:[childID,
						successCallback,
						errorCallback]});	
		}
	};
	
	/**
	 * Inserts a new child widget in the specifed index
	 * 
	 * @param childID ID of the child widget
	 * @param index the index for the place that the new child should be insterted 
	 * @param successCallback a function that will be called if the operation is successfull
	 * @param errorCallback a function that will be called if an error occurs
	 */
	this.insertChild = function(childID, index, successCallback, errorCallback)
	{		
		if((self.created) &&(childID != undefined))
		{
			NativeUI.maWidgetInsertChild(
					self.id,
					childID,
					index,
					successCallback, 
					errorCallback,
					self.processedMessage); 
		}
		else
		{
			self.commandQueue.push(
					{func:self.insertChild,
					args:[childID,
						index,
						successCallback,
						errorCallback]});
		}
	};
	
	/**
	 * Removes a child widget fro mthe child list of the current widget
	 * 
	 * @param childID Id of the child widget that will be removed
	 * @param successCallback a function that will be called if the operation is successfull
	 * @param errorCallback a function that will be called if an error occurs
	 * 
	 */
	this.removeChild = function(childID, successCallback, errorCallback)
	{
		if((self.created) &&(childID != undefined))
		{
			NativeUI.maWidgetRemoveChild(
					childID,
					successCallback,
					errorCallback,
					self.processedMessage);
		}
		else
		{
			self.commandQueue.push(
					{func:self.removeChild,
					args:[childID,
						successCallback,
						errorCallback]});		
		}
	};
	
	/**
	 * Shows a screen widget on the screen. 
	 * Will call the error callback if the widget is not of type screen.
	 *  
	 * @param successCallback a function that will be called if the operation is successfull
	 * @param errorCallback a function that will be called if an error occurs
	 *
	 */
	this.show = function(successCallback, errorCallback) {
		if(self.created)
		{
			if(self.isScreen) {
				NativeUI.maWidgetScreenShow(self.id,
						successCallback,
						errorCallback, 
						self.processedMessage); 
			}
			else
			{
				if(errorCallback)
				{
					errorCallback.call("Error:Attempt to show a non-screen widget");
				}
			}
		}
		else
		{
			self.commandQueue.push(
					{func:self.show,
					args:[successCallback,
						errorCallback]});		
		}		
	};
	


	/**
	 * Adds the current widget as a child to another widget.
	 * 
	 * @param parentId JavaScript ID of the parent widget.
	 * @param successCallback (optional) a function that will be called when the operation is done successfully
	 * @param errorCallback (optional) a function that will be called when the operation encounters an error
	 * 
	 */
	this.addTo = function(parentId, successCallback, errorCallback) 
	{
		var parent = document.getNativeElementById(parentId);
		if((self.created) &&
				(parent != undefined) && 
				(parent.created) && 
				(self.created != undefined))
		{
			NativeUI.maWidgetAddChild(
					parentId,
					self.id,
					successCallback,
					errorCallback,
					self.processedMessage);
		}
		else
		{
			self.commandQueue.push(
					{func:self.addTo,
					args:[
							parentId,
							successCallback,
							errorCallback
						]
					});			
		}
	};
	// add the current widget to the table
	NativeUI.NativeElementsTable[this.id] = this;
	
};

/**
 * Used to access the nativeWidgetElements created from the HTML markup.
 * It returns the object that can be used to change the properties of 
 * the specified widget.
 * 
 * @param widgetID the ID attribute used for identifying the widget in DOM
 *  
 */
document.getNativeElementById = function(widgetID) {
	return NativeUI.NativeElementsTable[widgetID];
};

/**
 * creates a widget and returns a NativeWidgetElement object.
 * 
 * usage:
 *  var myButton = NativeUI.create("Button", "myButton");
 *  
 * 
 * @param widgetType type of the widet that should be created
 * @param widgetID ID that will be used for refrencing to the widget
 * @param successCallback (optional) a function that will be called when the operation is done successfully
 * @param errorCallback (optional) a function that will be called when the operation encounters an error
 * 
 * @returns {NativeUI.NativeWidgetElement}
 */
NativeUI.create = function(
		widgetType,
		widgetID,
		params,
		successCallback,
		errorCallback)
{
	var widget = new NativeUI.NativeWidgetElement(
			widgetType,
			widgetID,
			params,
			successCallback,
			errorCallback);
	return widget;
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
 * Provides access to C++ handles through IDs.
 * @param elementID ID of the widget in question
 * @returns MoSync handle value for that widget
 */
NativeUI.getElementById = function(elementID) {
	return NativeUI.widgetIDList[elementID];
};

/**
 * An internal function that returns the correct property name 
 * Used to overcome case sensitivity problems in browsers.
 * 
 * @param attributeName name of the attribute used in HTML markup
 * @returns new name for the attribute
 */
NativeUI.getNativeAttrName = function(attributeName)
{
	switch(attributeName.toLowerCase())
	{
	case "fontsize":
		return "fontSize";
		break;
	case "fontcolor":
		return "fontColor";
		break;
	case "backgrouncolor":
		return "backgroundColor";
		break;
	case "backgroundgradient":
		return "backgroundGradient";
		break;
	case "currenttab":
		return "currentTab";
		break;
	case "backbuttonenabled":
		return "backButtonEnabled";
		break;
	case "textverticalalignment":
		return "textVerticalAlignment";
		break;
	case "texthorizontalalignment":
		return "textHorizontalAlignment";
		break;
	case "fonthandle":
		return "fontHandle";
		break;
	case "maxnumberoflines":
		return "maxNumberOfLines";
		break;
	case "backgroundimage":
		return "backgroundImage";
		break;
	case "scalemode":
		return "scaleMode";
		break;
	case "showkeyboard":
		return "showKeyboard";
		break;
	case "editmode":
		return "editMode";
		break;
	case "inputmode":
		return "inputMode";
		break;
	case "inputflag":
		return "inputFlag";
		break;
	case "accessorytype":
		return "accessoryType";
		break;
	case "childverticalalignment":
		return "childVerticalAlignment";
		break;
	case "childhorizontalalignment":
		return "childHorizontalAlignment";
		break;
	case "paddingtop":
		return "paddingTop";
		break;
	case "paddingleft":
		return "paddingLeft";
		break;
	case "paddingright":
		return "paddingRight";
		break;
	case "paddingbottom":
		return "paddingBottom";
		break;
	case "softhook":
		return "softHook";
		break;
	case "hardhook":
		return "hardHook";
		break;
	case "horizontalscrollbarenabled":
		return "horizontalScrollBarEnabled";
		break;
	case "verticalscrollbarenabled":
		return "verticalScrollBarEnabled";
		break;
	case "enablezoom":
		return "enableZoom";
		break;
	case "incrementprogress":
		return "incrementProgress";
		break;
	case "inprogress":
		return "inProgress";
		break;
	case "increasevalue":
		return "increaseValue";
		break;
	case "decreasevalue":
		return "decreaseValue";
		break;
	case "maxdate":
		return "maxDate";
		break;
	case "mindate":
		return "minDate";
		break;
	case "dayofmonth":
		return "dayOfMonth";
		break;
	case "currenthour":
		return "currentHour";
		break;
	case "currentminute":
		return "currentMinute";
		break;
	case "minvalue":
		return "minValue";
		break;
	case "maxvalue":
		return "maxValue";
		break;
		
	default:
		return attributeName;
	}
};

NativeUI.getNativeAttrValue = function(value) 
{
	switch(value.toLowerCase())
	{
	case "100%":
		return "-1";
		break;
	default:
		return value;
	}		
};

/**
 * Creates a widget, sets its property and adds it to its parent.
 * @param widgetID ID of the widget in question
 * @param parentID Id of the parentWidget
 */
NativeUI.createWidget = function(widget, parent) {
	var widgetNode = widget;
	var widgetID = widget.id;
	
	var widgetType = widgetNode.getAttribute("widgetType");
	NativeUI.numWidgetsRequested++;	
	var attributeList = widgetNode.attributes;
	
	NativeUI.create(widgetType, widgetID, null,
			function(widgetID, handle){
				var thisWidget = document.getNativeElementById(widgetID);
				NativeUI.numWidgetsRequested--;
			
				//Set the camera by default, We only support Camera Preview from JavaScript Code
				if(widgetType == "CameraPreview")
				{
					return;
				}
				for(var i = 0; i<attributeList.length; i++) 
				{
					//TODO: Add more event types and translate the attributes.
					if(attributeList[i].specified)
					{
						var attrName = NativeUI.getNativeAttrName(attributeList[i].name);
						var attrValue = NativeUI.getNativeAttrValue(attributeList[i].value);
						console.log("setting " + attrName + " for " + thisWidget.id);
						if((attrName != "id")  &&
								(attrName != "widgettype") && 
								(attrValue != null))
						{
			  				if(attrName == "onevent")
			  				{
			  					var functionData =   attrValue;
			  					thisWidget.addEventListener("Clicked",
			 							function(widgetHandle, eventType){
					  						//TODO: Improve event function parsing mechanism
					  						eval(functionData);
			  							});
			  				}
			  				else if((attrName == "image") || (attrName == "icon"))
			  				{
			  					ResourceHandler.loadImage(
			  							attrValue,
			  							widgetID + "image",
			  							function(imageID, imageHandle) {
			  								thisWidget.setProperty(attrName, imageHandle, null, null);
			  					});
			  				}
			  				else
			  				{
			  					thisWidget.setProperty(attrName, attrValue, null, null);
			   				}
						}
					}
				}
				if(parent != null)
				{
					var currentParent = document.getNativeElementById(parent.id);
					currentParent.addChild(widgetID, null, null);
				}
				//End of Closure
	}, null);
};

/**
 * A function that is called when the UI is ready.
 * By default it loads the element with ID "mainScreen"
 * Override this function to add extra functionality. 
 * See NativeUI.initUI for more information
 */
NativeUI.UIReady = function() {
	// This is the low level way of showing the default screen 
	// If you want to override this fucntion,
	// use document.getNativeElementById instead
	NativeUI.maWidgetScreenShow("mainScreen");
};

/**
 * Recursively creates the UI from the HTML5 markup.
 * 
 * @param parentid ID of the parent Widget
 * @param id ID of the currewnt widget
 */
NativeUI.createChilds = function(parent, widget) {
	if(widget != undefined)
	{
  		var node = widget;
  		var nodeChilds = node.childNodes;
  		NativeUI.createWidget(node, parent);
  		if(nodeChilds !=null)
  		{
	  		for(var i=0; i<nodeChilds.length;i++)
	  		{
	  			
	  			if((nodeChilds[i] != null) &&
	  					(nodeChilds[i].tagName != undefined))
	  			{
	  				if((nodeChilds[i].id == null) 
	  						|| (nodeChilds[i].id == undefined)
	  						|| (nodeChilds[i].id == "")) 
	  				{
	  					nodeChilds[i].id = "widget" + NativeUI.widgetCounter;
	  					NativeUI.widgetCounter++;
	  				}
		  			NativeUI.createChilds(node, nodeChilds[i]);
	  			}
  			}
  		}
		
	}
};

/**
 * Checks the status of UI and calls UIReady when it is ready.
 * @internal
 */
NativeUI.CheckUIStatus = function()
{
	if(0 == NativeUI.numWidgetsRequested)
	{
		window.clearInterval(NativeUI.showInterval);
		NativeUI.UIReady();
	}
};

/**
 * Shows a MoSync Screen, can be used to change the current screen.
 * 
 * usage example:
 *  NativeUI.showScreen("myNewScreen");
 * 
 * @param screenID
 */
NativeUI.showScreen = function(screenID)
{
	if(numWidgetsCreated == numWidgetsRequested)
	{
  		NativeUI.maWidgetScreenShow(NativeUI.widgetIDList[screenID]);

	}
};

/**
 * Initializes the UI system and parsing of the XML input.
 * This function should be called when the document body is loaded.
 * 
 * usage:
 *  <body onload="NativeUI.initUI()">
 *  
 *  After finalizing the widgets, the UI system will call the UIReady function.
 *  In order to add your operation you can override the UIReady function as below:
 *  
 *  NativeUI.UIReady = function()
 *  {
 *  //Do something, and show your main screen 
 *  }
 *  
 */
NativeUI.initUI = function()
{
	var MoSyncDiv = document.getElementById("NativeUI");
	MoSyncDiv.style.display = "none"; //hide the Native Container
	var MoSyncNodes = document.getElementById("NativeUI").childNodes;
	for(var i = 1; i<MoSyncNodes.length; i++) 
	{
		if((MoSyncNodes[i] != null) &&(MoSyncNodes[i].tagName != undefined))
		{
			if(MoSyncNodes[i].id == null)
			{
				MoSyncNodes[i].id = "widget" + NativeUI.widgetCounter;
				NativeUI.widgetCounter++;
			}
			NativeUI.createChilds( null, MoSyncNodes[i]);
		}
	}
	NativeUI.showInterval = self.setInterval(
			"NativeUI.CheckUIStatus()", 
			100);
};

