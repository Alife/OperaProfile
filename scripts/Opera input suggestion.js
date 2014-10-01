// ==UserScript==
// @exclude http://*mail*
// @exclude http://tieba.baidu.com/*
// @name OpS - Opera input suggestion
// @author Maxim Volkov 
// @namespace http://userjs.org/ 
// @version 1.0
// @description  Provides autocomplete feature for text input fields,
//			to all web sites.
// @ujs:category browser: enhancements
// @ujs:published 2006-01-28 18:27
// @ujs:modified 2006-01-28 18:28
// @ujs:documentation http://userjs.org/scripts/browser/enhancements/ops 
// @ujs:download http://userjs.org/scripts/download/browser/enhancements/ops.js 

// ==/UserScript==


/* 
 * This script is granted to the Public Domain.
 */

/*
	Notes:

	To display suggestion list just click inside input or press Ctrl+Shift+Down.
	To add current input value to list you should "blur" the input or submit the form.
	To see and change list style - search "Style" (be careful about scrolling and so on).
	
	Keyboard shortcuts while editing an text input field:

	Show Suggestion List
		Ctrl+Shift+Down Arrow
	Hide Suggestion List
		Escape
	Show All Suggestions
		Ctrl+\
	Select Next Suggestion
		Ctrl+Shift+Down arrow
	Select Previous Suggestion
		Ctrl+Shift+Up arrow
	Accept Selected Suggestion
		Ctrl+Enter
	Delete Selected Suggestion
		Ctrl+Delete
*/

document.addEventListener('DOMContentLoaded', function ()
{
var OpSparent = this;

function addEventHandler(domElement, sEvent, fnHandler) {
	if (domElement && sEvent && fnHandler)
		domElement.addEventListener(sEvent, fnHandler, false);
}

function OpS(domInput, sInputName, arrValues) {
	this._domInput = domInput;
	this._sInputName = sInputName;
	this._sCurrentInputValue = Utils_String.trim(domInput.value);
	this._arrValues = arrValues || [];
	this._mapActions = [];

	this.setupActions();
	this.setupInput();
}

var Style = {
	ListBox: "position:absolute; z-index:7000; min-width:180px; /*max-width:260px;*/ max-height:162px; padding:0 0 18px 0; border:1px solid #000; background:#fff; color:#000",
	ScrollBox: "position:relative; overflow:auto; left:0; top:0; width:100%; height:100%; max-height:inherit; margin:0; padding:0",
	List: "position:relative; overflow:hidden; width:100%; height:auto; margin:0; padding:0; list-style:none; font:11px Verdana, Tahoma, sans-serif",
	ListItem: "display:block; position:relative; white-space:nowrap; height:18px; line-height:18px; margin:0; padding:0 3px; cursor:pointer",
	Menu: "position:absolute; overflow:hidden; height:18px; margin:0; padding:0; background:#e6e6f2; color:#000; font:10px Verdana, Tahoma, sans-serif",
	MenuButton: "float:right; width:auto; height:18px; line-height:18px; margin:0; padding:0 6px; cursor:pointer; text-align:center"
}
with (Style) {
	Style.SelectedListItem = ListItem + "; background:#0a246a; color:#fff";
	Style.ItemMenu = Menu + "; width:auto";
	Style.ListMenu = Menu + "; width:100%";
	Style.MenuButtonOver = MenuButton + "; background:#c8c8e0";
}

var Actions = {
	ShowSuggestionList: 1,
	HideSuggestionList: 2,
	ShowAllSuggestions: 3,
	SelectNextSuggestion: 4,
	SelectPrevSuggestion: 5,
	AcceptSelectedSuggestion: 6,
	DeleteSelectedSuggestion: 7,
	SaveNewSuggestion: 8
}

var Info = {};
with (Actions) {
	Info[HideSuggestionList] = ["关闭", "Close suggestion list (Esc)"];
	Info[ShowAllSuggestions] = ["显示所有", "Show all suggestions (Ctrl+\\)"];
	Info[AcceptSelectedSuggestion] = [null, "Accept suggestion (Ctrl+Enter)"];
	Info[DeleteSelectedSuggestion] = ["删除", "Delete suggestion (Ctrl+Del)"];
}

var Keys = {};
with (Actions) {
	Keys[ShowSuggestionList] = function(e) {
		// Ctrl+Shift+DownArrow
		return e.ctrlKey && e.shiftKey && e.keyCode == 40;
	};

	Keys[HideSuggestionList] = function(e) {
		// Escape
		return e.keyCode == 27;
	};

	Keys[ShowAllSuggestions] = function(e) {
		// Ctrl+\
		return e.ctrlKey && e.keyCode == 92;
	};

	Keys[SelectNextSuggestion] = function(e) {
		// Ctrl+Shift+DownArrow
		return e.ctrlKey && e.shiftKey && e.keyCode == 40;
	};

	Keys[SelectPrevSuggestion] = function(e) {
		// Ctrl+Shift+UpArrow
		return e.ctrlKey && e.shiftKey && e.keyCode == 38;
	};

	Keys[AcceptSelectedSuggestion] = function(e) {
		// Ctrl+Enter
		return e.ctrlKey && e.keyCode == 13;
	};

	Keys[DeleteSelectedSuggestion] = function(e) {
		// Ctrl+Delete
		return e.ctrlKey && e.keyCode == 0;
	};
}

var Cfg = {
	CookieBaseName: "aftakampl",
	CookieMaxBytes: 4000,

	// Cookie value format:
	// (<input_id>|<input_name>'+'<input_form_name>)'#'<value>'|'<value2>'^'(<another_input_id...
	//
	InputGlue: "^",
	InputNameGlue: "+",
	InputNameValueGlue: "#",
	InputMultivalueGlue: "|",

	CheckForNewInputPeriod: 300 // msecs
}

OpS.mapInputMultivalue = null;
OpS.activeCookie = null;
OpS.arrInputs = [];
OpS.mapInstances = [];

OpS.load = function() {
	var mapInputMultivalue = null;

	var nLastCookieNumber = -1;
	var sLastCookieValue = "";

	for(var i=0,ii=localStorage.length;i<ii;i++){
		var sCookieName = localStorage.key(i);
		if (sCookieName.indexOf(Cfg.CookieBaseName) != 0)
			continue;

		var nCookieNumber = parseInt(sCookieName.substr(Cfg.CookieBaseName.length));
		if (isNaN(nCookieNumber))
			continue;

		var sCookieValue = localStorage.getItem(sCookieName);
		if (!sCookieValue) {
			Utils_Cookie.deleteCookie(sCookieName);
			continue;
		}

		if (nCookieNumber > nLastCookieNumber) {
			nLastCookieNumber = nCookieNumber;
			sLastCookieValue = sCookieValue;
		}

		mapInputMultivalue = Cookie.parseCookieValue(sCookieValue, mapInputMultivalue);
		document.delCookie(sCookieName);
	}

	OpS.mapInputMultivalue = mapInputMultivalue || [];
	OpS.activeCookie = new Cookie(nLastCookieNumber, sLastCookieValue);

	OpS.setupInputs();
}

OpS.setupInputs = function() {
	var domInputs = null;

	domInputs = document.getElementsByTagName("INPUT");

	if (!domInputs || !domInputs.length)
		return;

	var arrInputs = OpS.arrInputs;

	var bOldInputFound = false;
	var arrNewInputs = [];

	for (var domInput, i = 0; domInput = domInputs[i]; ++i) {
		if (domInput.type == "text"||domInput.type == "password") {
			var sName = Cookie.getInputUniqueName(domInput);
			if (sName) {
				arrInputs[arrInputs.length] = domInput;
				var arrValues = Cookie.parseInputMultivalue(OpS.mapInputMultivalue[sName]);
				OpS.mapInstances[sName] = new OpS(domInput, sName, arrValues);
			}
		}
	}

	OpS.view.init();
}

OpS.prototype.setupInput = function() { with (this) {
	var that = this;

	addEventHandler(_domInput, "keyup",
		function() {
			if (!Keys[Actions.AcceptSelectedSuggestion](window.event) &&
				that.askValueChanged())
				that._mapActions[Actions.ShowSuggestionList]();
		});

	addEventHandler(_domInput.form, "submit",
		function() {
			that.askValueChanged();
			that._mapActions[Actions.SaveNewSuggestion]();
		});

	addEventHandler(_domInput, "blur",
		function() {
			// Delay input onblur handler to provide user ability to click inside listbox.
			window.setTimeout(
				function() {
					if (OpS.bCancelInputBlur)
					    OpS.bCancelInputBlur = false;
					else {
						that.askValueChanged();
						that._mapActions[Actions.SaveNewSuggestion]();
					}
				},
				100);
		});

	addEventHandler(_domInput, "keypress",
		function() {
    		var e = window.event;
			var mapActions = that._mapActions;

			for (eId in mapActions) {
        		var fnAction = mapActions[eId];
        		if (!fnAction&&!fnAction.enabled())
        			continue;

            	var fnIsKeys = Keys[eId];
            	if (fnIsKeys && fnIsKeys(e))
					return fnAction();
        	}
    	});

	addEventHandler(_domInput, "click",
		function() {
			that.askValueChanged();
			that._mapActions[OpS.view.visible() ?
				Actions.HideSuggestionList : Actions.ShowSuggestionList]();
		});
}}

OpS.prototype.setupActions = function() {
	var that = this;

	function addAction(eActionId, fnAction, fnEnabled) {
		fnAction.enabled = fnEnabled || alwaysEnabled;
		that._mapActions[eActionId] = fnAction;
	}

	function alwaysEnabled() { return true; }

	function viewIsVisible() { return OpS.view.visible(); }

	function updateView(arrValues) {
		OpS.view.update(that._domInput, that._mapActions, arrValues);
	}

	function showView() {
		var sValue = that._sCurrentInputValue;
		updateView(sValue ?	that.findMatchedValues(sValue) : that._arrValues);
	}

    function hideView() { updateView(); }

	addAction(Actions.ShowSuggestionList,
		showView,
		function() { return !viewIsVisible(); });

	addAction(Actions.HideSuggestionList,
		hideView,
		viewIsVisible);

	addAction(Actions.ShowAllSuggestions,
	    function() {
			updateView(that._arrValues);
			return showView;
    	},
    	function() { return viewIsVisible() && that._sCurrentInputValue; });

	addAction(Actions.SelectNextSuggestion,
		function() { OpS.view.selectNextItem(); },
		viewIsVisible);

	addAction(Actions.SelectPrevSuggestion,
		function() { OpS.view.selectPrevItem(); },
		viewIsVisible);

	addAction(Actions.AcceptSelectedSuggestion,
		function() {
			var sValue = OpS.view.getSelectedValue();
			if (sValue)	{
				that._domInput.value = sValue;
				that._sCurrentInputValue = sValue;

				hideView();
			}
		},
		viewIsVisible);

	addAction(Actions.DeleteSelectedSuggestion,
		function() {
			var sValue = OpS.view.getSelectedValue();
			if (that.discardValue(sValue)) {
				var fnShowView = that._mapActions[Actions.ShowAllSuggestions].redo;
				if (fnShowView)
					fnShowView();
				else
					showView();

				that.deleteValueFromCookie(escape(sValue));
			}
		},
		viewIsVisible);

	addAction(Actions.SaveNewSuggestion,
		function() {
			var sValue = that._sCurrentInputValue;
			if (sValue) {
			    var sEscValue = escape(sValue);
			    var nBaseLength = sEscValue.length;

				var sEscValue = Cookie.trimInputValueForSave(that._sInputName, sEscValue);
				if (sEscValue && sEscValue.length < nBaseLength)
					sValue = Utils_String.trim(unescape(sEscValue));

				if (that.collectValue(sValue))
					that.saveValueToCookie(sEscValue);
			}

			hideView();
		});
}

OpS.prototype.askValueChanged = function() {
	var sValue = Utils_String.trim(this._domInput.value);
	if (sValue != this._sCurrentInputValue) {
		this._sCurrentInputValue = sValue;
		return true;
	}

	return false;
}

OpS.prototype.findMatchedValues = function(sPattern) {
	if (!sPattern)
		return;

	var arrMatches = [];
	var arrValues = this._arrValues;

	for (var sValue, i = 0; sValue = arrValues[i]; ++i)
		if (sValue.indexOf(sPattern) == 0)
			arrMatches[arrMatches.length] = sValue;
		else if (arrMatches.length)
			break;

	return arrMatches;
}

OpS.prototype.collectValue = function(sValue) {
	if (!sValue)
		return;

	var arrValues = this._arrValues;
	for (i in arrValues)
		if (sValue == arrValues[i])
			return false;

	arrValues[arrValues.length] = sValue;
	arrValues.sort();

	return true;
}

OpS.prototype.discardValue = function(sValue) {
	var arrValues = this._arrValues;

	for (i in arrValues)
		if (sValue == arrValues[i])
			return arrValues.splice(i, 1);

	return false;
}

OpS.prototype.saveValueToCookie = function(sValue) {
	var bAdditionDone = false;

	if (OpS.activeCookie)
		bAdditionDone = OpS.activeCookie.addInputValue(this._sInputName, sValue);

	if (!bAdditionDone)	{
		OpS.activeCookie = new Cookie();
		bAdditionDone = OpS.activeCookie.addInputValue(this._sInputName, sValue);
	}

	if (bAdditionDone)
		OpS.activeCookie.save();
}

OpS.prototype.deleteValueFromCookie = function(sValue) {
	if (OpS.activeCookie.deleteInputValue(this._sInputName, sValue)) {
		OpS.activeCookie.save();
		return;
	}

	var sCookies = document.cookie;
	var nActiveCookieNumber = Cookie.nSystemNumber;

	for (var i = nActiveCookieNumber - 1; i >= 0; --i)	{
		var sCookieName = Cfg.CookieBaseName + i;

		var nCookiePos = sCookies.indexOf(sCookieName + "=");
		if (nCookiePos == -1)
			continue;

		var nCookieValuePos = nCookiePos + sCookieName.length + 1;

		var nCookieEndPos = sCookies.indexOf(";", nCookieValuePos);
		if (nCookieEndPos == -1)
			nCookieEndPos = sCookies.length;

		var sCookieValue = sCookies.substr(nCookieValuePos, nCookieEndPos - nCookieValuePos);

		var cookie = new Cookie(i, sCookieValue);

		if (cookie.deleteInputValue(this._sInputName, sValue)) {
			cookie.save();
			break;
		}
	}

	Cookie.nSystemNumber = nActiveCookieNumber;
}

OpS.view = {
	init: function() {
		var that = this;

		this._domInput = null;
		this._mapActions = null;
		this._arrSuggestions = null;
		this._arrListItems = null;
		this._nSelectedIndex = -1;
		this._arrMenuButtons = [];

		var domListBox = document.createElement("DIV");
		domListBox.style = Style.ListBox;
		domListBox.style.display = "none";

		domListBox.onmousedown = function() {
			OpS.bCancelInputBlur = true;
			Utils_Dom.focusTextInput(that._domInput);
		};

		var domScrollBox = document.createElement("DIV");
		domScrollBox.style = Style.ScrollBox;

		var domList = document.createElement("UL");
		domList.style = Style.List;

		var domListItem = document.createElement("LI");
		domListItem.title = Info[Actions.AcceptSelectedSuggestion][1];
		domListItem.style = Style.ListItem;

		// Used as marker to determine if item is too long.
		var domListItemEnd = document.createElement("SPAN");
		domListItemEnd.innerText = " ";
		domListItemEnd.style = "margin:0; padding:0";

		var domListMenu = document.createElement("DIV");
		domListMenu.style = Style.ListMenu;

		domListMenu.appendChild(this.createMenuButton(Actions.HideSuggestionList));
		domListMenu.appendChild(this.createMenuButton(Actions.ShowAllSuggestions, true));

		var domItemMenu = document.createElement("DIV");
		domItemMenu.style = Style.ItemMenu;
		domItemMenu.style.display = "none";

		domItemMenu.appendChild(this.createMenuButton(Actions.DeleteSelectedSuggestion));

		domItemMenu.onmouseout = function()	{
			var target = window.event.toElement;
			if (!target || target.parentElement != that._domListBox)
				that.selectItemByIndex(-1);
		};

		this._domListItem = domListItem;
		this._domListItemEnd = domListItemEnd;
		this._domItemMenu = domListItem.appendChild(domItemMenu);
		this._domList = domScrollBox.appendChild(domList);
		this._domScrollBox = domListBox.appendChild(domScrollBox);
		this._domListMenu = domListBox.appendChild(domListMenu);
		this._domListBox = document.documentElement.appendChild(domListBox);
	},

	createMenuButton: function(eActionId, bUndoable) {
		var that = this;

		var fnDo = null;
		var fnUndo = null;
		var bUndo = false;

		function doAction() {
	    	var fnAction = bUndo ? fnUndo : fnDo;

	    	if (typeof fnAction == "function") {
				if (bUndoable) {
					bUndo = !bUndo;
					doAction.redo = fnAction;
				}

				fnUndo = fnAction();
			}
    	}

		var domButton = document.createElement("DIV");

		domButton.innerText = Info[eActionId][0];
		domButton.title = Info[eActionId][1];

		if (bUndoable) {
			domButton.onReset = function() {
				bUndo = false;
				doAction.redo = null;

				var fnAction = that._mapActions && that._mapActions[eActionId];
				if (fnAction && fnAction.fnOriginalAction)
					that._mapActions[eActionId] = fnAction.fnOriginalAction;
			};
    	}

		domButton.onUpdate = function() {
        	fnDo = that._mapActions[eActionId];

        	var bEnabled = fnDo && fnDo.enabled();
        	if (bEnabled) {
        		if (bUndoable) {
	        		if (fnDo.fnOriginalAction)
						fnDo = fnDo.fnOriginalAction;
					else {
        				doAction.enabled = fnDo.enabled;
        				doAction.fnOriginalAction = fnDo;
						that._mapActions[eActionId] = doAction;
					}
        		}

				this.style = bUndo ? Style.MenuButtonOver : Style.MenuButton;
			}
			else if (bUndoable)
				this.onReset();

			this.style.display = bEnabled ? "block" : "none";
		};

		domButton.onmouseover = function() {
			if (!bUndo)
				this.style = Style.MenuButtonOver;
		};

		domButton.onmouseout = function() {
			if (!bUndo)
				this.style = Style.MenuButton;
		};

		domButton.onmousedown = function() {
			OpS.bCancelInputBlur = true;
			//A straight call to this method doesn't seem to
			//work
			setTimeout(function(){
				Utils_Dom.focusTextInput(that._domInput);
			},1);

			window.event.stopPropagation();

			doAction();
		}

		this._arrMenuButtons[this._arrMenuButtons.length] = domButton;

		return domButton;
	},

	addListItem: function(sItemText, nItemIndex) {
		var that = this;

		var domItem = this._domListItem.cloneNode(false);
		domItem.innerText = sItemText;
		domItem.value = nItemIndex;

		var mapHandlers = this._mapItemHandlers = this._mapItemHandlers || {
			onmouseover: function() {
				that.selectItemByIndex(parseInt(this.value));
			},

            onmouseout: function() {
				var target = window.event.toElement;
				if (!target || target.parentElement != that._domItemMenu)
					that.selectItemByIndex(-1);
			},

			onmousedown: function() {
				that._mapActions[Actions.AcceptSelectedSuggestion]();
			}
		};

		for (i in mapHandlers)
			domItem[i] = mapHandlers[i];

		this._arrListItems[this._arrListItems.length] = this._domList.appendChild(domItem);
	},

	visible: function() { return this._domListBox.style.display != "none"; },

	update: function(domInput, mapActions, arrSuggestions) { with (this) {
		var domListBoxStyle = _domListBox.style;

		domListBoxStyle.display = "none";

		if (!domInput || !mapActions || !arrSuggestions || !arrSuggestions.length) {
			for (var domButton, i = 0; domButton = _arrMenuButtons[i]; ++i)
				if (domButton.onReset)
					domButton.onReset();
			return;
		}

		_domInput = domInput;
		_mapActions = mapActions;
		_arrSuggestions = arrSuggestions;

		_nSelectedIndex = -1;
		_arrListItems = [];
		_domList.innerHTML = "";

		for (i in _arrSuggestions)
			addListItem(_arrSuggestions[i], i);

		_domScrollBox.scrollTop = 0;

		var inputOffset = Utils_Dom.findGlobalOffset(_domInput);
		var nInputHeight = _domInput.offsetHeight;

		// Fix input extra large height in Opera9 tp1.
		//
		if (Utils_Dom.AgentIsOp9)
			nInputHeight -= 6;

		domListBoxStyle.top = (inputOffset.nTop + nInputHeight)+"px";
		domListBoxStyle.left = inputOffset.nLeft+"px";
		domListBoxStyle.width = domInput.clientWidth+"px";
		domListBoxStyle.display = "block";

		var domListMenuStyle = _domListMenu.style;

		_domItemMenu.style.display = "none";
		domListMenuStyle.display = "none";

		for (var domButton, i = 0; domButton = _arrMenuButtons[i]; ++i)
			if (domButton.onUpdate)
				domButton.onUpdate();

		domListMenuStyle.display = "block";
	}},

	selectNextItem: function() { with (this) {
		if (_nSelectedIndex < _arrListItems.length - 1)
			selectItemByIndex(_nSelectedIndex + 1);
	}},

	selectPrevItem: function() { with (this) {
		if (_nSelectedIndex > 0)
			selectItemByIndex(_nSelectedIndex - 1);
	}},

	selectItemByIndex: function(nIndex) { with (this) {
		if (nIndex == _nSelectedIndex)
			return;

		var domMenuStyle = _domItemMenu.style;
		domMenuStyle.display = "none";

		var domSelectedItem = _arrListItems[_nSelectedIndex];
		if (domSelectedItem)
			domSelectedItem.style = Style.ListItem;

		var domItem = _arrListItems[nIndex];
		if (domItem) {
    		domItem.style = Style.SelectedListItem;

    		var nOverlap = _domList.offsetTop + domItem.offsetTop - _domScrollBox.scrollTop;
    		var nOverlapTo = 0;

			if (nOverlap <= 0)
				nOverlapTo = -1;

			if (!nOverlapTo) {
            	nOverlap += domItem.offsetHeight - _domScrollBox.offsetHeight;

            	if (nOverlap >= 0)
            		nOverlapTo = 1;
        	}

			if (nOverlapTo)
				_domScrollBox.scrollTop += nOverlap;

			domItem.appendChild(_domItemMenu);

			domMenuStyle.top = 0;
			domMenuStyle.right = 0;
			domMenuStyle.display = "block";

			if (!domItem._bTooLong) {
				domItem.appendChild(_domListItemEnd);
				if (_domListItemEnd.offsetLeft > domItem.offsetWidth - _domItemMenu.offsetWidth) {
					domItem.title = _arrSuggestions[nIndex];
					domItem._bTooLong = true;
				}
			}
    	}

		_nSelectedIndex = nIndex;
	}},

	getSelectedValue: function() { with (this) {
		if (_arrSuggestions && _nSelectedIndex >= 0)
			return _arrSuggestions[_nSelectedIndex];
	}}
}
//~ OpS.view object

function Cookie(nSystemNumber, sValue) {
	if (!isNaN(nSystemNumber) && nSystemNumber >= 0)
		Cookie.nSystemNumber = nSystemNumber;
	else
		Cookie.nSystemNumber += 1;

	var mapInputMultivalue = null;
	var nFreeBytes = Cfg.CookieMaxBytes;

	if (sValue && sValue.length) {
		mapInputMultivalue = Cookie.parseCookieValue(sValue);
		nFreeBytes -= sValue.length;
	}

	this._sName = Cfg.CookieBaseName + Cookie.nSystemNumber;
	this._mapInputMultivalue = mapInputMultivalue || [];
	this._nFreeBytes = nFreeBytes;
}

Cookie.nSystemNumber = -1;

Cookie.getInputUniqueName = function(domInput) {
	var sName = domInput.id;
	if (sName)
		return sName;

	sName = domInput.name + Cfg.InputNameGlue;

	var form = domInput.form;
	if (form)
		sName += form.name;

	return sName;
}

Cookie.parseCookieValue = function(sValue, mapInputMultivalue) {
	mapInputMultivalue = mapInputMultivalue || [];

	var arrInputs = sValue.split(Cfg.InputGlue);

	for (var sInput, i = 0; sInput = arrInputs[i]; ++i)	{
		var nInputNameEnd = sInput.indexOf(Cfg.InputNameValueGlue);

		var sInputName = sInput.substr(0, nInputNameEnd);
		var sMultivalue = sInput.substr(nInputNameEnd + 1);

		var sOldMultivalue = mapInputMultivalue[sInputName];

		mapInputMultivalue[sInputName] = sOldMultivalue ?
			sOldMultivalue + Cfg.InputMultivalueGlue + sMultivalue : sMultivalue;
	}

	return mapInputMultivalue;
}

Cookie.parseInputMultivalue = function(sMultivalue) {
	if (!sMultivalue || !sMultivalue.length)
		return [];

	var arrValues = sMultivalue.split(Cfg.InputMultivalueGlue);

	for (i in arrValues)
		arrValues[i] = unescape(arrValues[i]);

	arrValues.sort();

	return arrValues;
}

Cookie.trimInputValueForSave = function(sInputName, sInputValue) {
	if (!sInputName || !sInputValue)
		return;

	var nInputLength = sInputName.length + Cfg.InputNameValueGlue.length + sInputValue.length;
	if (nInputLength <= Cfg.CookieMaxBytes)
		return sInputValue;

	var nTruncatedLength = nInputLength - Cfg.CookieMaxBytes;
	if (nTruncatedLength >= sInputValue.length)
		return "";

	sInputValue = sInputValue.substr(0, sInputValue.length - nTruncatedLength);

	// Discard last broken %uXXXX or %XX character code.
	//
	var nBrokenCodePos = sInputValue.indexOf("%", sInputValue.length - 5);
	if (nBrokenCodePos != -1)
		sInputValue = sInputValue.substr(0, nBrokenCodePos);

	return sInputValue;
}

Cookie.prototype.addInputValue = function(sInputName, sInputValue) { with (this) {
	var sMultivalue = _mapInputMultivalue[sInputName];
	if (sMultivalue) {
		var nValueLength = Cfg.InputMultivalueGlue.length + sInputValue.length;
		if (nValueLength > _nFreeBytes)
			return false;

		_mapInputMultivalue[sInputName] = sMultivalue + Cfg.InputMultivalueGlue + sInputValue;
		_nFreeBytes -= nValueLength;
	}
	else {
		var nInputLength = sInputName.length + Cfg.InputNameValueGlue.length + sInputValue.length;
		if (_nFreeBytes >= Cfg.CookieMaxBytes) {
			if (nInputLength > _nFreeBytes)
				return false;
		}
		else {
			nInputLength += Cfg.InputGlue.length;
			if (nInputLength > _nFreeBytes)
				return false;
		}

		_mapInputMultivalue[sInputName] = sInputValue;
		_nFreeBytes -= nInputLength;
	}

	return true;
}}

Cookie.prototype.deleteInputValue = function(sInputName, sInputValue) {
	if (!sInputName || !sInputValue)
		return;

	var mapInputMultivalue = this._mapInputMultivalue;

	var sMultivalue = mapInputMultivalue[sInputName];
	if (!sMultivalue)
		return false;

	if (sMultivalue == sInputValue)	{
		delete mapInputMultivalue[sInputName];
		return true;
	}

	var sNewMultivalue = sMultivalue.replace(sInputValue + Cfg.InputMultivalueGlue, "");
	if (sNewMultivalue.length != sMultivalue.length) {
		mapInputMultivalue[sInputName] = sNewMultivalue;
		return true;
	}

	sNewMultivalue = sMultivalue.replace(Cfg.InputMultivalueGlue + sInputValue, "");
	if (sNewMultivalue.length != sMultivalue.length) {
		mapInputMultivalue[sInputName] = sNewMultivalue;
		return true;
	}

	return false;
}

Cookie.prototype.save = function() {
	var mapInputMultivalue = this._mapInputMultivalue;
	var sCookieValue = "";

	for (i in mapInputMultivalue) {
		if (sCookieValue)
			sCookieValue += Cfg.InputGlue;

		sCookieValue += i + Cfg.InputNameValueGlue + mapInputMultivalue[i];
	}

	Utils_Cookie.setCookie(this._sName, sCookieValue, true);
}
//~ Cookie class
//~ OpS class

var Utils_Dom = {
	AgentIsOp9: opera.version() >= 9,

	newOffset: function(nTop, nLeft) { return { nTop: nTop || 0, nLeft: nLeft || 0 }; },

	findGlobalOffset: function(domElement) {
		if (!domElement || !domElement.tagName)
			return;

    	var globalOffset = this.newOffset();

		while (domElement) {
			var domParent = domElement;
			var maxOffset = this.newOffset();

			while (domParent && domParent != domElement.offsetParent) {
   				var offset = this.newOffset(domParent.offsetTop, domParent.offsetLeft);

   				// Fix text input negative left offset in Opera9 tp1.
   				//
   				if (this.AgentIsOp9 &&
   					domParent.tagName == "INPUT" && domParent.type == "text")
             		offset.nLeft += 3;

   				if (offset.nTop > maxOffset.nTop)
   					maxOffset.nTop = offset.nTop;

   				if (offset.nLeft > maxOffset.nLeft)
   					maxOffset.nLeft = offset.nLeft;

        		domParent = domParent.parentElement;
        	}

        	globalOffset.nTop += maxOffset.nTop;
			globalOffset.nLeft += maxOffset.nLeft;

			domElement = domElement.offsetParent;
		}

		return globalOffset;
	},

	focusTextInput: function(domInput, sNewValue) {
		if (!domInput)
			return;

		var sValue = sNewValue || domInput.value;

		domInput.value = "";
		domInput.focus();
		domInput.value = sValue;
		domInput.setSelectionRange(sValue.length, sValue.length);
	}
}
//~ Utils_Dom lib

var Utils_String = {
	TrimRegExp: /^\s+|\s+$/g,

	trim: function(sValue) { return sValue.replace(this.TrimRegExp, ""); }
}
//~ Utils_String lib

var Utils_Cookie = {
	FarPast: new Date(1970, 0, 2).toGMTString(),
	FarFuture: new Date(2050, 0, 2).toGMTString(),
	ExpiredValue: "EXPIRED",

	setCookie: function(sName, sValue, bForever) {
		//document.cookie = sName + "=" + sValue + (bForever ? "; expires=" + this.FarFuture : "");
		localStorage.setItem(sName,sValue);
	},

	deleteCookie: function(sName) {
		//document.cookie = sName + "=" + this.ExpiredValue + "; expires=" + this.FarPast;
		localStorage.removeItem(sName);
	}
}
//~ Utils_Cookie lib

// Set 1 sec delay to let browser setup document.cookie.
// setTimeout(OpS.load, 1000);

OpS.load();
}, false);
