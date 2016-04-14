// ==UserScript==
// @name Tab2Textarea
// @version 1.0
// @description insert tab to Textarea
// ==/UserScript==

/*以下代码实现在textarea中按tab键功能*/
function editTab() {
	var code,
	sel,
	tmp,
	r;
	var tabs = "";
	//event.returnValue = false
	sel = event.srcElement.document.selection.createRange();
	r = event.srcElement.createTextRange();
	
	switch (event.keyCode) {
	case (8):
		if (!(sel.getClientRects().length > 1)) {
			event.returnValue = true;
			return;
		}
		code = sel.text;
		tmp = sel.duplicate();
		tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top);
		sel.setEndPoint("startToStart", tmp);
		sel.text = sel.text.replace(/^\t/gm, "");
		code = code.replace(/^\t/gm,"").replace(//r/n/g,"/r");
		r.findText(code);
		r.select();
		break;
	case (9):
		if (sel.getClientRects().length > 1) {
			code = sel.text;
			tmp = sel.duplicate();
			tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top);
			sel.setEndPoint("startToStart", tmp);
			sel.text = "/t" + sel.text.replace(//r/n/g, "/r/t");
					code = code.replace(//r/n/g, "/r/t");
							r.findText(code);
							r.select();
		} else {
		sel.text = "/t";
		sel.select();
	}
		break;
	case (13):
		tmp = sel.duplicate();
		tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top);
		tmp.setEndPoint("endToEnd", sel);
		
		for (var i = 0; tmp.text.match(/^[/t] + /g) && i < tmp.text.match(/^[/t]+/g)[0].length;
					i++)tabs += "/t";
					sel.text = "/r/n" + tabs;
					sel.select();
					break;
				default:
					event.returnValue = true;
					break;
	}
}
				
function testTab() {
	var sel = document.selection.createRange();
	if (event.shiftKey && event.keyCode == 9) {
		sel.move("character", -4);
		sel.select();
		event.returnValue = false;
		return;
	}
	if (event.keyCode == 9) {
		sel.text = "/u0020/u0020/u0020/u0020";
		//sel.move("character",4);
		sel.select();
		event.returnValue = false;
	}
}

function testTab() {
	var sel = document.selection.createRange();
	var mytext = sel.text;
	var i,
	j,
	k;
	if (event.shiftKey && event.keyCode == 9) {
		arr = mytext.split(String.fromCharCode(13, 10))
			mytext = ""
			
			for (k = 0; k < arr.length; k++) {
				
				for (j = 1; j <= 4; j++) {
					if (arr[k].substr(0, 1) == "/u0020") {
						arr[k] = arr[k].slice(1)
					}
				}
				
				mytext += arr[k] + ((k == (arr.length - 1)) ? "" : String.fromCharCode(13, 10));
			}
			with (sel) {
			sel.text = mytext;
			collapse(true)
			moveEnd("character", 0)
			moveStart("character", (mytext.length) * -1)
			select()
		}
		
		window.event.cancelBubble = true;
		event.returnValue = false;
		return;
	}
	if (event.keyCode == 9) {
		arr = mytext.split(String.fromCharCode(13, 10))
			mytext = ""
			for (j = 0; j < arr.length; j++) {
				
				mytext += "/u0020/u0020/u0020/u0020" + arr[j] + ((j == (arr.length - 1)) ? "" : String.fromCharCode(13, 10));
			}
			
			with (sel) {
			sel.text = mytext;
			collapse(true)
			moveEnd("character", 0)
			moveStart("character", (mytext.length - 4) * -1)
			select()
		}
		
		window.event.cancelBubble = true;
		event.returnValue = false;
		return;
	}
}

function editTab() {
	
	var code,
	sel,
	tmp,
	r
	var tabs = "";
	event.returnValue = false
		sel = event.srcElement.document.selection.createRange()
		r = event.srcElement.createTextRange()
		
		switch (event.keyCode) {
		case (8):
			if (!(sel.getClientRects().length > 1)) {
				event.returnValue = true
					return
			}
			code = sel.text
				tmp = sel.duplicate()
				tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top)
				sel.setEndPoint("startToStart", tmp)
				sel.text = sel.text.replace(/^/t / gm, "")
				code = code.replace(/^/t / gm, "").replace(//r/n/g, "/r")
					r.findText(code)
					r.select()
					break
				case (9):
					if (sel.getClientRects().length > 1) {
						code = sel.text
							tmp = sel.duplicate()
							tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top)
							sel.setEndPoint("startToStart", tmp)
							sel.text = "/t" + sel.text.replace(//r/n/g, "/r/t")
								code = code.replace(//r/n/g, "/r/t")
										r.findText(code)
										r.select()
					} else {
							sel.text = "/t"
								sel.select()
						}
							break
						case (13):
							tmp = sel.duplicate()
								tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top)
								tmp.setEndPoint("endToEnd", sel)
								
								for (var i = 0; tmp.text.match(/^[/t] + /g) && i < tmp.text.match(/^[/t]+/g)[0].length;
											i++)tabs += "/t"
											sel.text = "/r/n" + tabs
												sel.select()
												break
											default:
												event.returnValue = true
												break
						}
				}
//截获了Tab按键，其他的textarea框不进行此配置
//下面的代码就是为了实现这个功能，原理很简单，采用上一行的缩进就行
//只要在html中插入脚本调用set_tab_indent_for_textareas()函数就可以了
//注1：需要jQuery支持，如果不喜欢jQuery改成裸javascript也很方便的
//兼容firefox和IE！

/*------selection operations-------*/
function insertAtCursor(obj, txt) {
	obj.focus();
	//IE support
	if (document.selection) {
		sel = document.selection.createRange();
		sel.text = txt;
	}
	//MOZILLA/NETSCAPE support
	else {
		var startPos = obj.selectionStart;
		var scrollTop = obj.scrollTop;
		var endPos = obj.selectionEnd;
		obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
		startPos += txt.length;
		obj.setSelectionRange(startPos, startPos);
		obj.scrollTop = scrollTop;
	}
}
function getCaretPos(ctrl) {
	var caretPos = 0;
	if (document.selection) {
		// IE Support
		var range = document.selection.createRange();
		// We'll use this as a 'dummy'
		var stored_range = range.duplicate();
		// Select all text
		stored_range.moveToElementText(ctrl);
		// Now move 'dummy' end point to end point of original range
		stored_range.setEndPoint('EndToEnd', range);
		// Now we can calculate start and end points
		ctrl.selectionStart = stored_range.text.length - range.text.length;
		ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
		caretPos = ctrl.selectionStart;
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		// Firefox support
		caretPos = ctrl.selectionStart;
	return (caretPos);
}

function getCurrentLineBlanks(obj) {
	var pos = getCaretPos(obj);
	var str = obj.value;
	var i = pos - 1;
	while (i >= 0) {
		if (str.charAt(i) == '/n')
			break;
		i--;
	}
	i++;
	var blanks = "";
	while (i < str.length) {
		var c = str.charAt(i);
		if (c == ' ' || c == '/t')
			blanks += c;
		else
			break;
		i++;
	}
	return blanks;
}

function set_tab_indent_for_textareas() {
	/* set all the tab indent for all the text areas */
	$("textarea").each(function () {
		$(this).keydown(function (eve) {
			if (eve.target != this)
				return;
			if (eve.keyCode == 13)
				last_blanks = getCurrentLineBlanks(this);
			else if (eve.keyCode == 9) {
				eve.preventDefault();
				insertAtCursor(this, "  ");
				this.returnValue = false;
			}
		}).keyup(function (eve) {
			if (eve.target == this && eve.keyCode == 13)
				insertAtCursor(this, last_blanks);
			});
		});
	}
