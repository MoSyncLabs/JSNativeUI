/**
 * @file main.cpp
 * @author Ali Sarraf, Iraklis Rosis
 *
 * Template application for developing NativeUI Apps in JavaScript
 * Do not Modify this file unless you know what you are doing
 */

// Include Moblet for web applications.
#include <Wormhole/WebAppMoblet.h>
#include "NativeUIMessageHandler.h"
#include "ResourceMessageHandler.h"

// Namespaces we want to access.
using namespace MAUtil; // Class Moblet
using namespace NativeUI; // WebView widget.
using namespace Wormhole; // Class WebAppMoblet

/**
 * The application class.
 */
class MyMoblet : public WebAppMoblet
{
public:
	MyMoblet()
	{
		// Create message handler for NativeUI.
		mNativeUIMessageHandler = new NativeUIMessageHandler(getWebView());
		// Create message handler for Resources.
		mResourceMessageHandler = new ResourceMessageHandler(getWebView());


		// Enable message sending from JavaScript to C++.
		enableWebViewMessages();

		//The webview that processes our Javascript code it hidden
		// users can create other webviews from html
		getWebView()->disableZoom();
		getWebView()->setVisible(false);


		// The page in the "LocalFiles" folder to
		// show when the application starts.
		//The page contains calls into the Native UI System
		showPage("index.html");

		//We have added this class as a custom event listener so it
		//can forward all of the custom events to JavaScript
		Environment::getEnvironment().addCustomEventListener(this);
	}

	/**
	 * This method handles messages sent from the WebView.
	 * @param webView The WebView that sent the message.
	 * @param urlData Data object that holds message content.
	 * Note that the data object will be valid only during
	 * the life-time of the call of this method, then it
	 * will be deallocated.
	 */
	void handleWebViewMessage(WebView* webView, MAHandle urlData)
	{
		// Create message object. This parses the message.
		WebViewMessage message(webView, urlData);
		char buffer[128];
		if(message.is("NativeUI"))
		{
			//Forward NativeUI messages to the respective message handler
			mNativeUIMessageHandler->handleMessage(message);
		}
		if(message.is("Resource"))
		{
			//Forward Resource messages to the respective message handler
			mResourceMessageHandler->handleMessage(message);
		}
		else if (message.is("close"))
		{
			//Close the App by request from JavaScript
			close();
		}

		// Tell the WebView that we have processed the message, so that
		// it can send the next one.
		callJS("bridge.messagehandler.processedMessage()");
	}

	/**
	 * This method is called when a key is pressed. It closes
	 * the application when the back key (on Android) is pressed.
	 * Forwards the event to JavaScript by Calling the same function
	 * Implement the function to handle events in JavaScript
	 */
	void keyPressEvent(int keyCode, int nativeCode)
	{
		char buffer[256];
		// forward the event to application
		sprintf(buffer,
				"keyPressEvent(%d, %d)",
				keyCode,
				nativeCode);

		callJS(buffer);
	}

	/**
	 * This method is called whenever a custom
	 * event is fired.
	 * It is used to forward events to the JavaScript side.
	 */
	void customEvent (const MAEvent &event)
	{
		//Do nothing yet
	}

private:
	MAHandle mFileData;
	NativeUIMessageHandler* mNativeUIMessageHandler;
	ResourceMessageHandler* mResourceMessageHandler;
};

/**
 * Main function that is called when the program starts.
 * Here an instance of the MyMoblet class is created and
 * the program enters the main event loop.
 */
extern "C" int MAMain()
{
	Moblet::run(new MyMoblet());
	return 0;
}
