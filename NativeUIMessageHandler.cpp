/*
Copyright (C) 2011 MoSync AB

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License,
version 2, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
MA 02110-1301, USA.
*/

/**
 * @file NativeUIMessageHandler.cpp
 * @author Ali Sarrafi
 *
 * Implementation of PhoneGap calls made from JavaScript.
 */


#include <mastdlib.h> // C string conversion functions
#include <conprint.h>
#include "NativeUIMessageHandler.h"
#include "MAHeaders.h"

// NameSpaces we want to access.
using namespace MAUtil; // Class Moblet, String
using namespace NativeUI; // WebView widget
using namespace Wormhole; // Class WebAppMoblet

/**
 * Constructor.
 */
NativeUIMessageHandler::NativeUIMessageHandler(NativeUI::WebView* webView) :
	mWebView(webView)
{
	//We have added this class as a custom event listener so it
	//can forward all of the custom events to JavaScript
	Environment::getEnvironment().addCustomEventListener(this);}

/**
 * Destructor.
 */
NativeUIMessageHandler::~NativeUIMessageHandler()
{
	// Nothing needs to be explicitly destroyed.
}

/**
 * Implementation of standard API exposed to JavaScript
 * This function is used to detect different messages from JavaScript
 * and call the respective function in MoSync.
 *
 * @return true if message was handled, false if not.
 */
bool NativeUIMessageHandler::handleMessage(WebViewMessage& message)
{

	char buffer[128];

	// Widget Handling Calls
	if(message.getParam("action") == "maWidgetCreate")
	{
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
			//We use a special callback for widget creation
			sprintf(
					buffer,
					"NativeUI.createCallback('%s', '%s', %d)",
					callbackID,
					widgetID,
					widget);
			mWebView->callJS(buffer);
		}

	}
	else if(message.getParam("action") == "maWidgetDestroy")
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
	else if(message.getParam("action") == "maWidgetAddChild")
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
	else if(message.getParam("action") == "maWidgetInsertChild")
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
	else if(message.getParam("action") == "maWidgetRemoveChild")
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
	else if(message.getParam("action") == "maWidgetModalDialogShow")
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
	else if(message.getParam("action") == "maWidgetModalDialogHide")
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
	else if(message.getParam("action") == "maWidgetScreenShow")
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
	else if(message.getParam("action") == "maWidgetStackScreenPush")
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
	else if(message.getParam("action") == "maWidgetStackScreenPop")
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
	else if(message.getParam("action") == "maWidgetSetProperty")
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
	else if(message.getParam("action") == "maWidgetGetProperty")
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

	// Tell the WebView that we have processed the message, so that
	// it can send the next one.
	char replyScript[256];
	sprintf(
			replyScript,
			"bridge.messagehandler.reply(%s)",
			message.getParam("callbackId").c_str());
	mWebView->callJS(replyScript);

}


/**
 * Handles custom events generated by NativeUI Widgets.
 */
void NativeUIMessageHandler::customEvent(const MAEvent& event)
{
	char buffer[128];

	if(event.type == EVENT_TYPE_WIDGET)
	{
		MAWidgetEventData *data = (MAWidgetEventData*)event.data;
		MAWidgetHandle widget = data->widgetHandle;

		if((widget == mWebView->getWidgetHandle()))
		{
			return;
		}
		int firstParameter = data->dayOfMonth;
		int secondParameter = data->month;
		int thirdParameter = data->year;

		char *eventType;
		// Translate the event type to JavaScript eventTypes
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
		mWebView->callJS(buffer);
	}
}


void NativeUIMessageHandler::sendNativeUIError(const char *data)
{
	char script[1024];
	sprintf(script, "NativeUI.error(%s)", data);
	mWebView->callJS(script);
}

void NativeUIMessageHandler::sendNativeUISuccess(const char *data)
{
	char script[1024];
	sprintf(script, "NativeUI.success(%s)", data);
	mWebView->callJS(script);
}

