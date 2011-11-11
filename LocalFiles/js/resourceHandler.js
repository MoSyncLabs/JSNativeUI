/**
 * @file resourceHandler.js
 * @author Ali Sarrafi
 * 
 * The library for loading Image resources into Mosync program from Javascript.
 * This library only supports image resources and used  together with the
 * NativeUI library. 
 */


/**
 * The Resource handler submodule of the bridge module.
 */
bridge.ResourceHandler = {};


/**
 * A Hash containing all registered callback functions for 
 * loadImage function.
 */
bridge.ResourceHandler.imageCallBackTable = {};


/**
 * Loads images into image handles for use in MoSync UI systems.
 * 
 *  @param imagePath relative path to the image file.
 *  @param imageID a custom ID used for refering to the image in JavaScript
 *  @param callBackFunction a function that will be called when the image is ready.
 */
bridge.ResourceHandler.loadImage = function(imagePath, imageID, callBackFunction) {
	bridge.ResourceHandler.imageCallBackTable[imageID] = callBackFunction;
	bridge.messagehandler.send(
			{
				"messageName": "loadImage",
				"imagePath": imagePath,
				"imageID": imageID
			}, null);
};

/**
 * A function that is called by C++ to pass the loaded image information.
 * 
 * @param imageID JavaScript ID of the image
 * @param imageHandle C++ handle of the imge which can be used for refering to the loaded image
 */
bridge.ResourceHandler.imageLoaded = function(imageID, imageHandle) {
	var callbackFun = bridge.ResourceHandler.imageCallBackTable[imageID];
	if (undefined != callbackFun)
	{
		var args = Array.prototype.slice.call(arguments);

		// Call the function.
		callbackFun.apply(null, args);
	}
};
