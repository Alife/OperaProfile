// ==UserScript==
// @name Mozilla like "Get selection source"
// @author Jakub Roztocil aka Oswald <j.roztocil@gmail.com>; http://www.webkitchen.cz/
// @version 0.5
// @ujs:download http://www.webkitchen.cz/lab/opera/get-selection-source.js
// @ujs:documentation [english] http://my.opera.com/community/forums/topic.dml?id=140523
// @ujs:documentation [czech] http://www.operacesky.net/forum/viewtopic.php?t=1366
// ==/UserScript==


/** Copyright (C) 2006 Jakub Roztocil
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

/* 
	TODO: if is start or end of selection inside
	CDATA, the CDATA section is after insertion of 
	mark (see below) converted to Text and is not highlighted as
	CDATA (bug in Opera?).
*/

opera.Selection2ubb = function() {


	/* ********************************************************************** */

	/* color schemes */

	/*
	 *	schemes.<scheme name> = {
	 *		background:		'White',	// background color
	 * 		fontFamily:		'monospace',  // font family for whole source
	 * 		fontSize:			'12px',	// font size for whole source
	 * 		stringColor:		'Black', 	// color for whole source
	 * 		bracketColor:		'Black',	// color for brackets (<>)
	 * 		tagNameColor: 		'Purple',	// color for names of tags (p, div, table, ...)
	 * 		tagNameBold:		'bold',	// font weight for names of tags
	 * 		attrNameColor:		'Black',	// color for names of attributes (class, href, action, ...)
	 * 		attrNameBold:		'bold',	// font weight for names of attributes
	 * 		attrValueColor:	'Blue',	// color for values of attributes
	 * 		attrValueBold:		'normal',	// font weight for values of attributes
	 * 		quoteColor:		'Blue',	// color for quotes around values of attributes (" or ')
	 * 		quoteBold:		'bold',	// font weight for quotes around values of attributes
	 * 		commentColor:		'Green',	// color for comments
	 * 		commentBold:		'normal'	// font weight for comments
	 * 	}
	 *
	 */

	 
	/* if (!window.log) {
	 	var log = function () {}
	} */
	 
	var schemes = {};

	// mozilla like
	schemes.mozilla = {
		background:		'White',
		fontFamily:		'monospace',
		fontSize:			'12px',
		stringColor:		'Black',
		bracketColor:		'Black',
		tagNameColor: 		'Purple',
		tagNameBold:		'bold',
		attrNameColor:		'Black',
		attrNameBold:		'bold',
		attrValueColor:	'Blue',
		attrValueBold:		'normal',
		quoteColor:		'Blue',
		quoteBold:		'bold',
		commentColor:		'Green',
		commentBold:		'normal',
		cdataMarkColor: '#ff6600',
		cdataMarkBold: 'bold',
		cdataContentColor: '#ff6600',
		cdataContentBold: 'normal'
	}
	// Opera source viewer scheme
	schemes.opera = {
		background:		'White',
		fontFamily:		'monospace',
		fontSize:			'12px',
		stringColor:		'Black',
		bracketColor:		'#0000CC',
		tagNameColor: 		'#0000CC',
		tagNameBold:		'normal',
		attrNameColor:		'#0000CC',
		attrNameBold:		'normal',
		attrValueColor:	'#0000CC',
		attrValueBold:		'normal',
		quoteColor:		'#0000CC',
		quoteBold:		'normal',
		commentColor:		'#296F28',
		commentBold:		'normal',
		cdataMarkColor: '#ff6600',
		cdataMarkBold: 'bold',
		cdataContentColor: '#ff6600',
		cdataContentBold: 'normal'
	}
	// Desert
	schemes.desert = {
		background:		'#333',
		fontFamily:		'monospace',
		fontSize:			'12px',
		stringColor:		'White',
		bracketColor:		'#BDB76B',
		tagNameColor: 		'#BDB76B',
		tagNameBold:		'normal',
		attrNameColor:		'#BDB76B',
		attrNameBold:		'normal',
		attrValueColor:	'#FFA0A0',
		attrValueBold:		'normal',
		quoteColor:		'#FFA0A0',
		quoteBold:		'normal',
		commentColor:		'#87CEEB',
		commentBold:		'normal',
		cdataMarkColor: '#ff6600',
		cdataMarkBold: 'bold',
		cdataContentColor: '#ff6600',
		cdataContentBold: 'normal'
	}

	/* configuration */

	var conf = {

		// window settings

		wWidth: 	700, // window width
		wHeight: 	300, // window height
		wTop:	100	,
		wLeft:	50,
		closeOnKeystroke: true,
		closeKeyCode: 27,	// ESC = 27, ENTER = 13, ...

		// syntax highligthing settings

		scheme:	schemes.desert // your prefered color scheme

	}


	/* ********************************************************************** */

	var sel = findSelection(window);
	
	if (!sel) {
		return;
	}
	
	var marks = {
		start: '\u25b7', // white right-pointing triangle
		end: '\u25c1' // white left-pointing triangle 
	}
	
	
	var range = sel.getRangeAt(0);
	var node = range.commonAncestorContainer;
	var justOneNode = range.startContainer == range.endContainer;
	var orig = {
		startOffset: range.startOffset,
		endOffset: range.endOffset
	}
	switch (node.nodeType) {
		case Node.TEXT_NODE:
		case Node.CDATA_SECTION_NODE:
			node = node.parentNode;
		break;
	}
	
	
	range.endContainer.insertData(range.endOffset, marks.end);
	range.startContainer.insertData(range.startOffset, marks.start);
	
	
	var params =
		'width=' + conf.wWidth +
		',height=' + conf.wHeight +
		',scrollbars=yes,' +
		'top=' + conf.wTop +
		',left=' + conf.wLeft;
	var win = window.open('', '_blank', params);
	win.document.open('text/html');
	win.document.write(createOutputHtml(node));
	win.document.close();
	
	range.startContainer.deleteData(orig.startOffset, marks.start.length);
	range.endContainer.deleteData(orig.endOffset, marks.end.length);
	sel.removeAllRanges();
	sel.addRange(range);
	range.detach();
	
	var set = {
		startContainer: null,
		startOffset: null,
		endContainer: null,
		endOffset: null
	}
	
	// start
	set.startContainer = win.document.evaluate("//text()[contains(.,'" + marks.start + "')]", win.document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	set.startOffset = set.startContainer.data.indexOf(marks.start);
	set.startContainer.deleteData(set.startOffset, marks.start.length);
	// end
	set.endContainer = win.document.evaluate("//text()[contains(.,'" + marks.end + "')]", win.document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
	set.endOffset = set.endContainer.data.indexOf(marks.end);
	set.endContainer.deleteData(set.endOffset, marks.end.length);
	// select it
	var newRange = win.document.createRange();
	newRange.setStart(set.startContainer, set.startOffset);
	newRange.setEnd(set.endContainer, set.endOffset);
	win.getSelection().addRange(newRange);
	newRange.detach();
	

	/* ********************************************************************** */
	
	if (conf.closeOnKeystroke) {
		win.addEventListener('keypress', function(e) {
			if (e.keyCode == conf.closeKeyCode) {
				win.close();
			}
		}, false)
	}
	

	function html_trans(str) {
	
		str = str.replace(/\r/g,"");
		str = str.replace(/on(load|click|dbclick|mouseover|mousedown|mouseup)="[^"]+"/ig,"");
		str = str.replace(/<script[^>]*?>([\w\W]*?)<\/script>/ig,"");
		
		str = str.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/ig,"\n[url=$1]$2[/url]\n");
		
		str = str.replace(/<font[^>]+color=([^ >]+)[^>]*>(.*?)<\/font>/ig,"\n[color=$1]$2[/color]\n");
		
		str = str.replace(/<img[^>]+src="([^"]+)"[^>]*>/ig,"\n[img]$1[/img]\n");
		
		str = str.replace(/<([\/]?)b>/ig,"[$1b]");
		str = str.replace(/<([\/]?)strong>/ig,"[$1b]");
		str = str.replace(/<([\/]?)u>/ig,"[$1u]");
		str = str.replace(/<([\/]?)i>/ig,"[$1i]");
		
		str = str.replace(/&nbsp;/g," ");
		str = str.replace(/&amp;/g,"&");
		str = str.replace(/&quot;/g,"\"");
		str = str.replace(/&lt;/g,"<");
		str = str.replace(/&gt;/g,">");
		
		str = str.replace(/<br>/ig,"\n");
		str = str.replace(/<[^>]*?>/g,"");
		str = str.replace(/\[url=([^\]]+)\]\n(\[img\]\1\[\/img\])\n\[\/url\]/g,"$2");
		str = str.replace(/\n+/g,"\n");
		
		return str;
	}
	
	function findSelection(view) {
		var i, sel = view.getSelection();
		if (sel.toString().length == 0) {
			sel = null;
			for (i = 0; i < view.frames.length; i++) {
				sel = arguments.callee(view.frames[i]);
				if (sel == null) {
					continue;
				}
				if (sel.toString().length > 0) {
					break;
				}
			}
		}
		return sel;
	}


	function createOutputHtml(node) {
		var html = '', css = '', code = '', title = 'Selection source';

		code = html_trans((new XMLSerializer()).serializeToString(node));
    	
		if (document.title) {
			 title += ' for "' + document.title.substring(0, 20).replace(/</g, '&lt +') + (document.title.length > 20 ? '\u2026' : '') + '"';
		}
	
		css += 'body {' +
				'	background:' + conf.scheme.background + ' ;' +
				'}' +
				'pre {' +
				'	font-size:' + conf.scheme.fontSize + ' ;' +
				'	font-family:' + conf.scheme.fontFamily + ' ;' +
				'	color:' + conf.scheme.stringColor + ' ;' +
				'}' +
				'.tag {' +
				'	color:' + conf.scheme.bracketColor + ' ;' +
				'}' +
				'.entity {' +
				'	font-weight: bold ;' +
				'}' +
				'.tagName {' +
				'	color:' + conf.scheme.tagNameColor + ' ;' +
				'	font-weight: ' + conf.scheme.tagNameBold + ' ;' +
				'}' +
				'.attrName {' +
				'	color:' + conf.scheme.attrNameColor + ' ;' +
				'	font-weight:' + conf.scheme.attrNameBold + ' ;' +
				'}' +
				'.attrValue {' +
				'	color:' + conf.scheme.attrValueColor + ' ;' +
				'	font-weight:' + conf.scheme.attrValueBold + ' ;' +
				'}' +
				'.quote {' +
				'	color:' + conf.scheme.quoteColor + ' ;' +
				'	font-weight:' + conf.scheme.quoteBold + ' ;' +
				'}' +
				'.comment, .comment * {' +
				'	color:' + conf.scheme.commentColor + ' !important ;' +
				'	font-weight:' + conf.scheme.commentBold + ' !important ;' +
				'}' +
				'.cdataMark {' +
				'	color:' + conf.scheme.cdataMarkColor + ' ;' +
				'	font-weight:' + conf.scheme.cdataMarkBold + ' ;' +
				'}' +
				'.cdataContent, .cdataContent * {' +
				'	color:' + conf.scheme.cdataContentColor + '!important ;' +
				'	font-weight:' + conf.scheme.cdataContentBold + '!important ;' +
				'}';

		html = '<html><head>' +
			'<title>' +  title + '</title>' +
			'<style type="text/css">' + css + '</style>' +
			'</head><body>\n\n\n<pre>' + code + '</pre>\n\n\n</body></html>';

		return html;
	}

}
