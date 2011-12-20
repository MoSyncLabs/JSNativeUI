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
ResourceHandler = {};


/**
 * A Hash containing all registered callback functions for 
 * loadImage function.
 */
ResourceHandler.imageCallBackTable = {};

ResourceHandler.imageIDTable = {};

ResourceHandler.imageDownloadQueue = [];

/**
 * Loads images into image handles for use in MoSync UI systems.
 * 
 *  @param imagePath relative path to the image file.
 *  @param imageID a custom ID used for refering to the image in JavaScript
 *  @param callBackFunction a function that will be called when the image is ready.
 */
ResourceHandler.loadImage = function(imagePath, imageID, successCallback) {
	ResourceHandler.imageCallBackTable[imageID] = successCallback;
	bridge.messagehandler.send(
			{
				"messageName": "Resource",
				"action": "loadImage",
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
ResourceHandler.imageLoaded = function(imageID, imageHandle) {
	var callbackFun = ResourceHandler.imageCallBackTable[imageID];
	if (undefined != callbackFun)
	{
		var args = Array.prototype.slice.call(arguments);

		// Call the function.
		callbackFun.apply(null, args);
	}
};

/**
 * Loads images into image handles from a remote URL for use in MoSync UI systems.
 * 
 *  @param imageURL URL to the image file.
 *  @param imageID a custom ID used for refering to the image in JavaScript
 *  @param callBackFunction a function that will be called when the image is ready.
 */
ResourceHandler.loadRemoteImage = function(imageURL, imageID, callBackFunction) {
	ResourceHandler.imageCallBackTable[imageID] = callBackFunction;
	var message = {
		"messageName": "Resource",
		"action": "loadRemoteImage",
		"imageURL": imageURL,
		"imageID": imageID
	};
	// Add message to queue.
	ResourceHandler.imageDownloadQueue.push(message);
	
	if (1 == ResourceHandler.imageDownloadQueue.length)
	{
		bridge.messagehandler.send(message, null);
	}

};

ResourceHandler.imageDownloadStarted = function(imageID, imageHandle)
{
	ResourceHandler.imageIDTable[imageHandle] = imageID;
};

ResourceHandler.imageDownloadFinished = function(imageHandle)
{
	var imageID = ResourceHandler.imageIDTable[imageHandle];
	var callbackFun = ResourceHandler.imageCallBackTable[imageID];
	if (undefined != callbackFun)
	{
		// Call the function.
		callbackFun(imageID, imageHandle);
	}
	// Remove first message.
	if (ResourceHandler.imageDownloadQueue.length > 0)
	{
		ResourceHandler.imageDownloadQueue.shift();
	}
	
	// If there are more messages, send the next
	// message in the queue.
	if (ResourceHandler.imageDownloadQueue.length > 0)
	{
		bridge.messagehandler.send(
				ResourceHandler.imageDownloadQueue[0],
				null);
	}
};
