/**
 * @file main.cpp
 * @author Ali Sarraf, Iraklis Rosis
 *
 * Template application for developing NativeUI Apps in JavaScript
 * Do not Modify this file unless you know what you are doing
 */

// Include Moblet for web applications.
#include <Wormhole/WebAppMoblet.h>

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


		if (message.is("close"))
		{
			//Close the App by request from JavaScript
			close();
		}
		// Widget Handling Calls
		else if(message.is("maWidgetCreate"))
		{
			//This also expects an "id" that will identify
			//the returned handle to javascript
			MAWidgetHandle widget =
					maWidgetCreate(message.getParam("widgetType").c_str());
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			const char* widgetID = message.getParam("widgetID").c_str();
			if(widget <= 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, widget);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"NativeUI.createCallback('%s', '%s', %d)", callbackID, widgetID, widget);
				callJS(buffer);
			}

		}
		else if(message.is("maWidgetDestroy"))
		{
			MAWidgetHandle widget = stringToInteger(message.getParam("widget"));
			int res = maWidgetDestroy(widget);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}

		}
		else if(message.is("maWidgetAddChild"))
		{
			MAWidgetHandle parent = stringToInteger(message.getParam("parent"));
			MAWidgetHandle child = stringToInteger(message.getParam("child"));
			int res = maWidgetAddChild(parent, child);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetInsertChild"))
		{
			MAWidgetHandle parent = stringToInteger(message.getParam("parent"));
			MAWidgetHandle child = stringToInteger(message.getParam("child"));
			int index = stringToInteger(message.getParam("index"));
			int res = maWidgetInsertChild(parent, child, index);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetRemoveChild"))
		{
			MAWidgetHandle child = stringToInteger(message.getParam("child"));
			int res = maWidgetRemoveChild(child);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetModalDialogShow"))
		{
			MAWidgetHandle dialogHandle =
					stringToInteger(message.getParam("dialogHandle"));
			int res = maWidgetModalDialogShow(dialogHandle);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetModalDialogHide"))
		{
			MAWidgetHandle dialogHandle =
					stringToInteger(message.getParam("dialogHandle"));
			int res = maWidgetModalDialogHide(dialogHandle);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetScreenShow"))
		{
			MAWidgetHandle screenHandle =
					stringToInteger(message.getParam("screenHandle"));
			int res = maWidgetScreenShow(screenHandle);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetStackScreenPush"))
		{
			MAWidgetHandle stackScreen =
					stringToInteger(message.getParam("stackScreen"));
			MAWidgetHandle newScreen =
					stringToInteger(message.getParam("newScreen"));
			int res = maWidgetStackScreenPush(stackScreen, newScreen);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetStackScreenPop"))
		{
			MAWidgetHandle stackScreen =
					stringToInteger(message.getParam("stackScreen"));
			int res = maWidgetStackScreenPop(stackScreen);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetSetProperty"))
		{
			MAWidgetHandle widget =
					stringToInteger(message.getParam("widget"));
			const char *property = message.getParam("property").c_str();
			const char *value = message.getParam("value").c_str();
			int res = maWidgetSetProperty(widget, property, value);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUISuccess(buffer);
			}
		}
		else if(message.is("maWidgetGetProperty"))
		{
			char value[64];
			MAWidgetHandle widget =
					stringToInteger(message.getParam("widget"));
			const char *property = message.getParam("property").c_str();

			int res = maWidgetGetProperty(widget, property, value, 64);
			const char* callbackID = message.getParam("NativeUICallbackID").c_str();
			if(res < 0)
			{
				sprintf(buffer,"'%s', %d", callbackID, res);
				sendNativeUIError(buffer);
			}
			else
			{
				sprintf(buffer,"'%s', %s", callbackID, property);
				sendNativeUISuccess(buffer);
			}
		}
		//Call for loading an Image resource
		else if(message.is("loadImage"))
		{
			MAHandle imageHandle =
					loadImageResource(message.getParam("imagePath").c_str());

			const char* imageID = message.getParam("imageID").c_str();
			sprintf(buffer,
					"bridge.ResourceHandler.imageLoaded(\"%s\", %d)",
					imageID,
					imageHandle);
			callJS(buffer);
		}

		// Tell the WebView that we have processed the message, so that
		// it can send the next one.
		callJS("bridge.messagehandler.processedMessage()");
	}

	MAHandle loadImageResource(const char *imagePath)
	{

		int bufferSize = 1024;
		char buffer[bufferSize];

		//Get the local path which is the same path as the root of HTML apps
		int size = maGetSystemProperty(
			"mosync.path.local",
			buffer,
			bufferSize);

		//Construct a full path by concatenating the relative path and local path
		char completePath[2048];

		sprintf(completePath,
				"%s%s",
				buffer,
				imagePath);

		//Load the image and create a data handle from it
		MAHandle imageFile = maFileOpen(completePath, MA_ACCESS_READ);

		int fileSize = maFileSize(imageFile);

		MAHandle fileData = maCreatePlaceholder();

		int res = maCreateData(fileData, fileSize);

		res = maFileReadToData(imageFile, fileData, 0, fileSize);
		maFileClose(imageFile);

		MAHandle imageHandle = maCreatePlaceholder();

		res = maCreateImageFromData(
				imageHandle,
				fileData,
				0,
				maGetDataSize(fileData));
		maDestroyObject(fileData);
		//return the handle to the loaded image
		return imageHandle;
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
		char buffer[128];

		if(event.type == EVENT_TYPE_WIDGET)
		{
			MAWidgetEventData *data = (MAWidgetEventData*)event.data;
			MAWidgetHandle widget = data->widgetHandle;

			if((widget == getWebView()->getWidgetHandle()))
			{
				return;
			}
			int firstParameter = data->dayOfMonth;
			int secondParameter = data->month;
			int thirdParameter = data->year;

			char *eventType;
			switch(data->eventType)
			{
				case MAW_EVENT_POINTER_PRESSED:
					eventType = "PointerPressed";
					break;
				case MAW_EVENT_POINTER_RELEASED:
					eventType = "PointerReleased";
					break;
				case MAW_EVENT_CONTENT_LOADED:
					eventType = "ContentLoaded";
					break;
				case MAW_EVENT_CLICKED:
					eventType = "Clicked";
					break;
				case MAW_EVENT_ITEM_CLICKED:
					eventType = "ItemClicked";
					break;
				case MAW_EVENT_TAB_CHANGED:
					eventType = "TabChanged";
					break;
				case MAW_EVENT_GL_VIEW_READY:
					eventType = "GLViewReady";
					break;
				case MAW_EVENT_WEB_VIEW_URL_CHANGED:
					eventType = "WebViewURLChanged";
					break;
				case MAW_EVENT_STACK_SCREEN_POPPED:
					eventType = "StackScreenPopped";
					break;
				case MAW_EVENT_SLIDER_VALUE_CHANGED:
					eventType = "SliderValueChanged";
					break;
				case MAW_EVENT_DATE_PICKER_VALUE_CHANGED:
					eventType = "DatePickerValueChanged";
					break;
				case MAW_EVENT_NUMBER_PICKER_VALUE_CHANGED:
					eventType = "NumberPickerValueChanged";
					break;
				case MAW_EVENT_VIDEO_STATE_CHANGED:
					eventType = "VideoStateChanged";
					break;
				case MAW_EVENT_EDIT_BOX_EDITING_DID_BEGIN:
					eventType = "EditBoxEditingDidBegin";
					break;
				case MAW_EVENT_EDIT_BOX_EDITING_DID_END:
					eventType = "EditBoxEditingDidEnd";
					break;
				case MAW_EVENT_EDIT_BOX_TEXT_CHANGED:
					eventType = "EditBoxTextChanged";
					break;
				case MAW_EVENT_EDIT_BOX_RETURN:
					eventType = "EditBoxReturn";
					break;
				case MAW_EVENT_WEB_VIEW_CONTENT_LOADING:
					eventType = "WebViewContentLoading";
					break;
				case MAW_EVENT_WEB_VIEW_HOOK_INVOKED:
					eventType = "WebViewHookInvoked";
					break;
				case MAW_EVENT_DIALOG_DISMISSED:
					eventType = "DialogDismissed";
					break;
			}
			sprintf(buffer,
					"NativeUI.event(%d, \"%s\", %d, %d, %d)",
					widget,
					eventType,
					firstParameter,
					secondParameter,
					thirdParameter);
			callJS(buffer);
		}
	}

private:
	MAHandle mFileData;

	void sendNativeUIError(const char *data)
	{
		char script[1024];
		sprintf(script, "NativeUI.error(%s)", data);
		callJS(script);
	}
	void sendNativeUISuccess(const char *data)
	{
		char script[1024];
		sprintf(script, "NativeUI.success(%s)", data);
		callJS(script);
	}

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
