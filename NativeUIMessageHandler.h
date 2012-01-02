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
 * @file NativeUIMessageHandler.h
 * @author Ali Sarrafi
 *
 * Implementation of NativeUI calls made from JavaScript.
 */

#ifndef NATIVEUI_MESSAGE_HANDLER_H_
#define NATIVEUI_MESSAGE_HANDLER_H_

#include <Wormhole/WebViewMessage.h>
#include <NativeUI/WebView.h>
#include <MAUtil/String.h>

/**
 * Class that implements JavaScript calls.
 *
 * The JavaScript side is in file extendedbridge.js.
 */
class NativeUIMessageHandler:
	public MAUtil::CustomEventListener
{
public:
	/**
	 * Constructor.
	 */
	NativeUIMessageHandler(NativeUI::WebView* webView);

	/**
	 * Destructor.
	 */
	virtual ~NativeUIMessageHandler();

	/**
	 * Implementation of standard API exposed to JavaScript.
	 * @return true if message was handled, false if not.
	 */
	bool handleMessage(Wormhole::WebViewMessage& message);

	/**
	 * Handles custom events generated by NativeUI Widgets.
	 */
	virtual void customEvent(const MAEvent&);



private:
	/**
	 * A Pointer to the main webview
	 * Used for communicating with NativeUI
	 */
	NativeUI::WebView* mWebView;

	/**
	 * General wrapper for NativeUI success callback.
	 * If an operation is successful this function should be called.
	 *
	 * @param data the data that should be passed to the callback function
	 */
	void sendNativeUISuccess(const char* data);

	/**
	 * General wrapper for NativeUI error callback.
	 * If an operation is successful this function should be called.
	 *
	 * @param data the data that should be passed to the callback function
	 */
	void sendNativeUIError(const char* data);

};

#endif