// ==UserScript==
// @name LinkHints
// @author AVIKF<qjavikf@126.com>
// @description 给链接添加编号导航(support opera 11.01+).
//				使用大部分（超过90%）Phil Crosby, Ilya Sukhar
//				-- Chrome Vimium的代码.
// @date 2011-03-19 18:47:59
// @modifydate 2011/04/05 13:40:42
// @version 0.0.2.6
// @include http*
// @exclude http*://*.google.com/*
// @exclude http*://reader.youdao.com/*
// @exclude http://web*.qq.com/*
// ==/UserScript==

(function () {
	var opera = window.opera;
	var fixedDivWidth = false;
	if(opera) {
		var iSite = ["youku", "me.qidian.com", "hi.baidu.com"];
		for (var i = 0; i < iSite.length; i++) {
			if (document.URL.search(iSite[i]) >= 0) {
				fixedDivWidth = true;
				break;
			}
		}
		document.addEventListener("keyup", gKeyUp, false);
	}

//=================Settings===================================================================
	//指定引导键，小写字母a-z
	var linkHintsKey = "f";

	//再次按引导键后功能；1.重新编号, 2.取消编号
	var linkHintsKeySecond = 1;

	//项目编号使用的字母，小写字母a-z 0－9，但不能加入引导键
	var linkHintCharacters = "ausidowjekl";

	//项目编号外其它键行为；1.忽略，2.取消编号，与linkHintsKeySecond = 2 功能相同
	var otherKeyBehaviour = 2;

	//在新标签打开的引导键，如果是字母，用大写，按住Shift
	var openInNewTabKey= ";"; 

	//颜色、字体设置
	var linkHintsCssSetting = {
		backgroundColor: "#0000A8",			//背景颜色
		fontColor: "#FFFFFF",				//前景颜色
		borderColor: "#E3FE03",				//边框颜色
		matchingColor: "#FF0000",			//激活编号序列颜色
		fontName: "Inconsolata",					//字体名称
		//fontName: "Arial",					//字体名称
		fontSize: "14",						//字体大小
		opacity: "0.85"						//透明度
	};
	
//=================Start======================================================================
	var keyCodes = { ESC: 27, backspace: 8, deletekey: 46, enter: 13,
		commma: 44, semicolon: 59, f1: 112, f12: 123};
	var currentZoomLevel = 100;
	var linkHintActivaved = false;
	var shouldOpenInNewTab = true;
	var notSecondActivated = false;
	var linkHintsCssAdded = false;
	var linkHintsNext = false;
	var hintMarkers = [];
	var hintKeystrokeQueue = [];
	var hintlist = [];
	var hintedlinks = [];
	var hintMarkerContainingDiv = null;
	var linkHintCss =
		".internalHintMarker {" +
		"position:absolute;" +
		"background-color:" +
		linkHintsCssSetting.backgroundColor + ";" +
		"color:" +
		linkHintsCssSetting.fontColor + ";" +
		"font-size:" +
		linkHintsCssSetting.fontSize + "px;" +
		"font-weight:bold;" +
		"padding:0 1px;" +
		"line-height:100%;" +
		"text-align:center;" +
		"display:block;" +
		"border:1px solid " +
		linkHintsCssSetting.borderColor + ";" +
		"z-index:99999999;" +
		"font-family:" +
		linkHintsCssSetting.fontName + ";" +
		"top:-1px;" +
		"left:-1px;" +
		"width:auto;" +
		"opacity:" +
		linkHintsCssSetting.opacity + ";"  +
		"} " +
		".internalHintMarker > .matchingCharacter {" +
		"color:" +
		linkHintsCssSetting.matchingColor + ";" +
		"}";
	/* 
	* Generate an XPath describing what a clickable element is.
	* The final expression will be something like "//button | //xhtml:button | ..."
	*/
	var clickableElementsXPath = (function() {
		var clickableElements = ["a", "textarea", "button", "select",
							"input[not(@type='hidden')]",
							"*[@onclick or @tabindex or @role='link' or @role='button']"];
		var xpath = [];
		for (var i in clickableElements)
			xpath.push("//" + clickableElements[i], "//xhtml:" + clickableElements[i]);
			return xpath.join(" | ")
		})();

	//document.addEventListener("keypress", gKeyPress, false);

//=================Functions==================================================================

	function gKeyUp (event) {
		outLog(event, "up");
		if (isEscape(event)) return;
		if(isSelectable(whichElement(event))) return;
		if (event.ctrlKey || event.altKey || event.metaKey) return;

			var keychar = String.fromCharCode(event.keyCode).toLowerCase();
			if (keychar == openInNewTabKey) {
				shouldOpenInNewTab = true;
			} else {
				shouldOpenInNewTab = false;
			}
			if (linkHintsNext) {
				linkHintsNext = false;
				return;
			}
			if (keychar == linkHintsKey || shouldOpenInNewTab) {
				activateLinkHintsMode();
				document.removeEventListener("keyup", gKeyUp, false);
				event.preventDefault();
				event.stopPropagation();
				document.addEventListener("keypress", gKeyPress, false);
			}
	}

	function gKeyPress (event) {
		var keychar = outLog(event, "press");
		if (isEscape(event)) {
			deactivateLinkHintsMode();
			return;
		}
		if (event.keyCode == keyCodes.backspace ||
				event.keyCode == keyCodes.deletekey) {
			if (hintKeystrokeQueue.length == 0) {
				deactivateLinkHintsMode();
			} else {
				hintKeystrokeQueue.pop();
				updateLinkHints();
			}
		} else if (keychar == linkHintsKey || keychar == openInNewTabKey) {
			switch (linkHintsKeySecond) {
				case 2:
					deactivateLinkHintsMode();
					linkHintsNext = true;
					break;
				case 1:
					deactivateLinkHintsMode();
					activateLinkHintsMode();
					document.removeEventListener("keyup", gKeyUp, false);
					document.addEventListener("keypress", gKeyPress, false);
					break;
			}
		} else if (linkHintCharacters.indexOf(keychar) >= 0) {
			hintKeystrokeQueue.push(keychar);
			updateLinkHints();
		} else if (otherKeyBehaviour == 2) {
			deactivateLinkHintsMode();
		}
		event.preventDefault();
		event.stopPropagation();
	}

	function outLog (event, sau) {
		var keycode = event.keyCode;
		var keychar = String.fromCharCode(keycode);
		console.log(sau + ",键值:" + keycode + " 键符:" + keychar);
		return keychar;
	}

	function isEscape(event) {
		/*
		 * 检测是否ESC键
		 */
		return event.keyCode == keyCodes.ESC;
	}

	function isSelectable (element) {
		/*
		 * Selectable指输入框
		 */
		var selectableTypes = ["search", "text", "password"];
		return (element.tagName == "INPUT" && selectableTypes.indexOf(element.type) >= 0) ||
			element.tagName == "TEXTAREA";
	}

	function whichElement (event) {
		/*
		 * 返回引发事件的元素类型,如"INPUT","BODY"
		 */
		var targ
		if (!evt) var evt = window.event
		if (evt.target) targ = evt.target
		else if (evt.srcElement) targ = evt.srcElement
		if (targ.nodeType == 3) // defeat Safari bug
			targ = targ.parentNode
		return targ;
	}

	function activateLinkHintsMode () {
		/*
		 * 进入LinkHints模式
		 */
		if (!linkHintsCssAdded) {
			addCssToPage(linkHintCss);
		}
		linkHintActivaved = true;
		buildsLinkMarkers();
	}

	function addCssToPage (css) {
		/*
		* Adds the given CSS to the page.
		*/
		var head = document.getElementsByTagName("head")[0];
		if (!head) {
			head = document.createElement("head");
			document.documentElement.appendChild(head);
		}
		var style = document.createElement("style");
		style.type = "text/css";
		style.id = "linkHintsCSS";
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
		linkHintsCssAdded = true;
	}

	function buildsLinkMarkers () {
		/*
		 * Builds and displays link hints for every visible clickable item on the page.
		 */
		var visibleElements = getVisibleClickableElements();
		var digitsNeeded = Math.ceil(logXOfBase(visibleElements.length, linkHintCharacters.length));
		hintMarkers = createMarkerFor(visibleElements, digitsNeeded);
		hintMarkerContainingDiv = document.createElement("div");
		//hintMarkerContainingDiv.id = "linkHints";
		hintMarkerContainingDiv.className = "internalHintMarker";
		for (var i = 0; i < hintMarkers.length; i++)
			hintMarkerContainingDiv.appendChild(hintMarkers[i]);
		document.getElementsByTagName("body")[0].appendChild(hintMarkerContainingDiv);
	}

	function logXOfBase (x, base) {
		/*
		 * 计算编号位数
		 */
		if (base == 0) {
			linkHintCharacters = "12345";
			base = 5;
		}
		return Math.ceil( Math.log(x) / Math.log(base) );
	}

	function getVisibleClickableElements () {
		/*
		 * Returns all clickable elements that are not hidden and are in the current viewport.
		 * We prune invisible elements partly for performance reasons, but moreso it's to decrease the number
		 * of digits needed to enumerate all of the links on screen.
		 */
		var resultSet = document.evaluate(clickableElementsXPath, document.body,
			function (namespace) {
				return namespace == "xhtml" ? "http://www.w3.org/1999/xhtml" : null;
			},
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		var visibleElements = [];

		// Find all visible clickable elements.
		for (var i = 0, count = resultSet.snapshotLength; i < count; i++) {
			var element = resultSet.snapshotItem(i);
			var clientRect = element.getClientRects()[0];

			if (isVisible(element, clientRect))
				visibleElements.push({element: element, rect: clientRect});

			// If the link has zero dimensions, it may be wrapping visible
			// but floated elements. Check for this.
			if (clientRect && (clientRect.width == 0 || clientRect.height == 0)) {
				for (var j = 0, childrenCount = element.children.length; j < childrenCount; j++) {
					if (window.getComputedStyle(element.children[j], null).getPropertyValue('float') != 'none') {
						var childClientRect = element.children[j].getClientRects()[0];
						if (isVisible(element.children[j], childClientRect)) {
							visibleElements.push({element: element.children[j], rect: childClientRect});
							break;
						}
					}
				}
			}
		}
		return visibleElements;
	}

	function isVisible (element, clientRect) {
		/*
		 * Returns true if element is visible.
		 */
		// Exclude links which have just a few pixels on screen, because the link hints won't show for them anyway.
		var zoomFactor = currentZoomLevel / 100.0;
		if (!clientRect || clientRect.top * zoomFactor >= window.innerHeight - 4 ||
			clientRect.top < 0 || clientRect.left * zoomFactor >= window.innerWidth - 4 ||
			clientRect.left < 0 )
			return false;

		if (clientRect.width < 3 || clientRect.height < 3)
			return false;

		// eliminate invisible elements (see test_harnesses/visibility_test.html)
		var computedStyle = window.getComputedStyle(element, null);
		if (computedStyle.getPropertyValue('visibility') != 'visible' ||
			computedStyle.getPropertyValue('display') == 'none')
			return false;

		return true;
	}

	function createMarkerFor (link, linkHintDigits) {
		/*
		* Creates link markers for the links.
		*/
		var nwidth = getDivWidth(linkHintDigits);
		var prevLeft = 0;
		var prevTop = 0;
		for (var i = 0, count = link.length; i < count; i++) {
			var hintString = numberToHintString(i, linkHintDigits);
			var marker = document.createElement("div");
			var innerHTML = [];
			var zoomFactor = currentZoomLevel / 100.0;
			var clientRect = link[i].rect;
			var thisLeft = 0;
			var thisTop = 0;
			for (var j = 0; j < hintString.length; j++)
				innerHTML.push("<span>" + hintString[j].toUpperCase() + "</span>");
			marker.innerHTML = innerHTML.join("");
			thisLeft = clientRect.left + window.scrollX / zoomFactor;
			thisTop = clientRect.top + window.scrollY / zoomFactor;
			if (i == 0) {
				prevLeft = thisLeft;
				prevTop = thisTop;
			} else {
				if (thisTop == prevTop && clientRect.left > link[i-1].rect.left) {
					thisLeft = thisLeft < (prevLeft + nwidth) ? prevLeft + nwidth + 2 : thisLeft;
				}
				prevLeft = thisLeft;
				prevTop = thisTop;
			}
			with (marker) {
				className = "internalHintMarker HintMarker";
				setAttribute("hintString", hintString);
				style.left = thisLeft + "px";
				style.top = thisTop + "px";
			}
			if (fixedDivWidth) {
				marker.style.width = nwidth - 4 + "px";
			}
			marker.clickableItem = link[i].element;
			hintMarkers.push(marker);
		}
		return hintMarkers;
	}

	function getDivWidth (number) {
		/*
		 * 计算DIV的宽度
		 */
		var nWidth;
		switch (linkHintsCssSetting.fontSize) {
			case "10":
			case "11":
				nWidth = 7;
				break;
			case "12":
			case "13":
				nWidth = 8;
				break;
			case "14":
			case "15":
				nWidth = 9;
				break;
			case "16":
				nWidth = 10;
				break;
		}
		return nWidth * number + 4;
	}

	function numberToHintString (number, numHintDigits) {
		/*
		* Converts a number like "8" into a hint string like "JK". This is used to sequentially generate all of
		* the hint text. The hint string will be "padded with zeroes" to ensure its length is equal to numHintDigits.
		*/
		var base = linkHintCharacters.length;
		var hintString = [];
		var remainder = 0;
		do {
			remainder = number % base;
			hintString.unshift(linkHintCharacters[remainder]);
			number -= remainder;
			number /= Math.floor(base);
		} while (number > 0);

		// Pad the hint string we're returning so that it matches numHintDigits.
		for (var i = 0; i < numHintDigits - hintString.length; i++)
			hintString.unshift(linkHintCharacters[0]);

		if (numHintDigits > 2 && hintString.length < numHintDigits)
			hintString.unshift(linkHintCharacters[0]);

		return hintString.join("");
	}

	function deactivateLinkHintsMode () {
		/*
		 * 还原为默认状态
		 */
		if (hintMarkerContainingDiv)
			hintMarkerContainingDiv.parentNode.removeChild(hintMarkerContainingDiv);
		hintMarkerContainingDiv = null;
		hintMarkers = [];
		hintKeystrokeQueue = [];
		linkHintActivaved = false;
		shouldOpenInNewTab = false;
		linkHintsNext = false;
		document.removeEventListener("keypress", gKeyPress, false);
		document.addEventListener("keyup", gKeyUp, false);
	}

	function updateLinkHints () {
		/*
		 * Updates the visibility of link hints on screen based on the keystrokes typed thus far.
		 * If only one link hint remains, click on that link and exit link hints mode.
		 */
		var matchString = hintKeystrokeQueue.join("");
		var linksMatched = highlightLinkMatches(matchString);
		if (linksMatched.length == 0) {
			deactivateLinkHintsMode();
		} else if (linksMatched.length == 1) {
			var matchedLink = linksMatched[0];
			if (isSelectable(matchedLink)) {
				matchedLink.focus();
				matchedLink.select();
				deactivateLinkHintsMode();
			} else if(matchedLink.tagName == "SELECT") {
				matchedLink.focus();
				deactivateLinkHintsMode();
			} else {
				if (shouldOpenInNewTab) {
					window.open(matchedLink.href);
				} else {
					simulateClick(matchedLink);
				}
				deactivateLinkHintsMode();
			}
		}
	}

	function highlightLinkMatches(searchString) {
		/*
		* Hides link hints which do not match the given search string. To allow the backspace key to work, this
		* will also show link hints which do match but were previously hidden.
		*/
		var linksMatched = [];
		for (var i = 0; i < hintMarkers.length; i++) {
			var linkMarker = hintMarkers[i];
			if (linkMarker.getAttribute("hintString").indexOf(searchString) == 0) {
				if (linkMarker.style.display == "none")
					linkMarker.style.display = "";
				var childNodes = linkMarker.childNodes;
				for (var j = 0, childNodesCount = childNodes.length; j < childNodesCount; j++)
					childNodes[j].className = (j >= searchString.length) ? "" : "matchingCharacter";
				linksMatched.push(linkMarker.clickableItem);
			} else {
				linkMarker.style.display = "none";
			}
		}
		return linksMatched;
	}

	function simulateClick(link) {
		var event = document.createEvent("MouseEvents");
		// When "clicking" on a link, dispatch the event with the appropriate meta key
		// (CMD on Mac, CTRL on windows) to open it in a new tab if necessary.
		event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0,
				 false, false, false, false, 0, null);

		// Debugging note: Firefox will not execute the link's default action if we dispatch this click event,
		// but Webkit will. Dispatching a click on an input box does not seem to focus it; we do that separately
		link.dispatchEvent(event);
	}
})();
