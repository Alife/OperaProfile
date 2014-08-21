// ==UserScript==
// @name        Power-drag
// @author      João Eiras
// @description resize anything you like
// @version     1.1
// @encoding    utf-8
// ==/UserScript==

/*
* Copyright (c) 2008, João Eiras
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of João Eiras nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY JOÃO EIRAS ''AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL JOÃO EIRAS BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**

This script is based on a similar one made by Mike Samokhvalov <mikivanch [at] gmail.com>
called Textarea Resizer (by motive of forum.ru-board.com scripts)
downloadble at http://www.puzzleclub.ru/files/textarea_resizer.js

Instructions:
 - press shift and hover textareas, select boxes, iframes, objects, images or
 inputs, and drag the lower right corner to resize at will

History:
 1.1
	- added canvas and video support
	- replaced old knob from skin with new one, because the former went missing
	- added version check, only on my.opera.com, to prevent too many checks since cookies aren't shared

 1.0.7
	- fixed problem of big select boxes showing only one option after the first click

 1.0.6
	- fixed problem with stuff jumping on hover (probably :p)
	- typo in anchor title fixed

 1.0.5
	- performance fix - draging stuff now is much snapier (use of timeouts to prevent excessive reflows)

 1.0.4
	- Better heuristic (Opera bug workaround) to guess the element's box model
	- Better support for select boxes
	- overrides min/max-height/width

 1.0.3
	- Code cleanups and some refactoring so it'll be easier to add new resizing targets.
	  Now you can easily enable resizing of iframes, images and other replaced elements.
	  Now you can enable the drag anchor when pressing a modifier key like shift

 1.0.2
	- Override kestrel bug, where computed box-sizing is empty string

 1.0.1
	- Bug fixes calculating the anchor position

 1.0
	- initial version. Drag textarea's or input's lower right corner to resize, and double click it to restore.
**/

(function( opera ){
	/**
	 * Configuration
	 */
	var kCheckForNewVersion = true;

	var enableOnModifiersOnly = false;

	var modifiers = {altKey:null,ctrlKey:null,shiftKey:null};

	var validTargets = [
		{nodeName:'textarea',resizeh:true,resizev:true},
		{nodeName:'iframe',resizeh:true,resizev:true},
		{nodeName:'object',resizeh:true,resizev:true},
		{nodeName:'video',resizeh:true,resizev:true},
		{nodeName:'canvas',resizeh:true,resizev:true},
		{nodeName:'img',resizeh:false,resizev:false,
			validate:function(target){return target.offsetWidth>12||target.offsetHeight>12  ? this : null;}},
		{nodeName:'input',resizeh:true,resizev:false,
			validate:function(target){return !(/^(button|reset|submit|radio|checkbox|image)$/i).test(target.type) ? this : null;}},
		{nodeName:'option',resizeh:true,resizev:true,validate:function(nodeName){
			return validTargets.validate({nodeName:'select'});
		}},
		{nodeName:'select',resizeh:true,resizev:true,getTarget:function(target,newheight){
				return target.selectSingleNode('ancestor-or-self::select[1]');
			},handleHeight:function(target,newheight){
				if( ! target.__oneRowHeight ){
					//get select box row height and padding
					var rowsbck = target.size;
					var heightbck = target.style.height;
					var minheightbck = target.style.minHeight;
					var maxheightbck = target.style.maxHeight;

					target.style.height = 'auto!important';
					target.style.minHeight = '0!important';
					target.style.maxHeight = '32000px!important';

					target.size = 1;
					var oneRowHeight = target.offsetHeight;
					target.size = 2;
					var twoRowHeight = target.offsetHeight;

					if( twoRowHeight == oneRowHeight ){
						//something's wrong...
						oneRowHeight = twoRowHeight + 24;
					};
					target.__oneRowHeight = twoRowHeight - oneRowHeight;
					target.__paddingAndBorder = oneRowHeight - target.__oneRowHeight;

					target.size = rowsbck;
					target.style.height = heightbck;
					target.style.minHeight = minheightbck;
					target.style.maxHeight = maxheightbck;
				}
				setHeight(target,newheight);
				target.size = Math.floor((target.offsetHeight - target.__paddingAndBorder) / target.__oneRowHeight);
			}}
	];

	var knob = 'data:image/png;base64,'+
		'iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAO'+
		'xAAADsQBlSsOGwAAAAd0SU1FB9oDBhEnBjP4bvIAAABTSURBVCjPxc/BEQAQDAXRnwJRctREAdwM'+
		'I0hysfd3WOBHtZZGXpiZQV4IwIZnGGIi8kL1swRVzyf4fL7B6/MLHp81UHzWwu3ZApdnKxzPHpiZ'+
		'0QGBrcz9haJxVQAAAABJRU5ErkJggg==';

	/*
		Rest of script
	*/

	var getComputedStyle = window.getComputedStyle;
	var document = window.document;

	validTargets.validate=function(target){
		var nn = target.nodeName.toLowerCase();
		for(var x,k=0,v;v=this[k];k++){
			if( !this[v.nodeName] )
				this[v.nodeName] = v;
			x = null;
			if( v.nodeName == nn && (v.resizeh||v.resizev) && (!v.validate||(x=v.validate(target))) )
				return x||v;
		}
		return null;
	};
	modifiers.validate=function(event){
		for(var p in this){
			if(typeof this[p]!='function' && event[p]==this[p])
				return true;
		};
		return false;
	};


	function isBorderSizing(obj, cstyles){
		if(!cstyles)
			cstyles = getComputedStyle(obj,'');
		//kestrel bug: computed box-sizing is an empty string
		var bsz = cstyles.boxSizing || (obj.currentStyle?obj.currentStyle.boxSizing:'');
		if( (/^(content|border)-box$/).test(bsz) )
			return bsz == 'border-box';

		//cache value for performance, else dragging textareas is choppy
		//will cause problems if box-sizing is changed dinamically, but that's a corner case
		if( !obj.__boxSizingBck ){
			//resort to hack
			var w = obj.style.width;
			var pl = obj.style.paddingLeft;
			var pr = obj.style.paddingRight;
			obj.style.width = '200px';
			obj.style.paddingLeft = '10px';
			obj.style.paddingRight = '10px';
			obj.__boxSizingBck = (obj.offsetWidth==200);
			obj.style.width = w;
			obj.style.paddingLeft = pl;
			obj.style.paddingRight = pr;
		}
		return obj.__boxSizingBck;
	};
	function getYOffset(obj){
		var y = 0;
		do{y += obj.offsetTop;
		}while(obj=obj.offsetParent);
		return y;
	};
	function getXOffset(obj){
		var x = 0;
		do{x += obj.offsetLeft;
		}while(obj=obj.offsetParent);
		return x;
	};
	function getWidth(obj){
		return obj.offsetWidth;
	};
	function getHeight(obj){
		return obj.offsetHeight;
	};
	function setWidth(obj,w){
		var styles=getComputedStyle(obj,'');
		var wc = isBorderSizing(obj,styles) ? w +'px!important':
			(w - parseInt(styles.borderLeftWidth) - parseInt(styles.paddingLeft) -
			parseInt(styles.paddingRight) - parseInt(styles.borderRightWidth)) + 'px!important';
		obj.style.width = wc;
	};
	function setHeight(obj,h){
		var styles=getComputedStyle(obj,'');
		var hc = isBorderSizing(obj,styles) ? h +'px!important':
			(h - parseInt(styles.borderTopWidth) - parseInt(styles.paddingTop) -
			parseInt(styles.paddingBottom) - parseInt(styles.borderBottomWidth)) + 'px!important';
		obj.style.height = hc;
	};

	var imgResizer, resizingTarget, canHide = true, timer;
	var lastClientX, lastClientY;

	function possibleTargetHover(e){
		if( enableOnModifiersOnly && !modifiers.validate(e) )
			return;

		var target = e.target;
		var vt = validTargets.validate(target);
		target = (vt && vt.getTarget ? vt.getTarget(target) : null) || target;

		if( !vt && imgResizer && imgResizer != target && canHide ){
			resizingTarget = null;
			refreshImgResizerPosition();
			return;
		}
		if( !vt || !canHide || imgResizer == target )
			return;

		makeResizeAnchor();
		imgResizer.resizingTargetProps = vt;
		resizingTarget = target;
		refreshImgResizerPosition();
	};
	function possibleTargetOut(e){
		if(e.relatedTarget == imgResizer)
			return;

		if( imgResizer && canHide && validTargets.validate(e.target) ){
			imgResizer.style.display='none';
		}
	};

	function makeResizeAnchor(){
		if(!imgResizer){
			imgResizer = document.createElement('zy');
			imgResizer.style = 'z-index: 9999 !important; position: absolute !important; '+
				'width: 15px!important; height: 15px!important; border: none; cursor: se-resize !important; '+
				' padding: 0 !important; margin: 0 0 0 0 !important; background-image: url("' + knob + '"); ';
			imgResizer.title = 'Drag to resize this element, double-click to reset dimensions';

			function f_onmousemove(e){
				lastClientX = e.clientX;
				lastClientY = e.clientY;
				if(!timer )
					timer = setTimeout(function(){
						var vt = imgResizer.resizingTargetProps
						var styles=getComputedStyle(resizingTarget,'');

						if( !resizingTarget.__origStyles ){
							resizingTarget.__origStyles={
								width:resizingTarget.style.width,
								height:resizingTarget.style.height,
								minWidth:resizingTarget.style.minWidth,
								minHeight:resizingTarget.style.minHeight,
								maxWidth:resizingTarget.style.maxWidth,
								maxHeight:resizingTarget.style.maxHeight
							};
						}

						var w = lastClientX - getXOffset(resizingTarget) + window.pageXOffset + imgResizer.__offsets.width;
						var h = lastClientY - getYOffset(resizingTarget) + window.pageYOffset + imgResizer.__offsets.height;

						w = Math.max(w,resizingTarget.__minDimensions.width);
						h = Math.max(h,resizingTarget.__minDimensions.height);

						if( vt.resizeh )
							vt.handleWidth ? vt.handleWidth(resizingTarget,w) : setWidth(resizingTarget,w);
						if( vt.resizev )
							vt.handleHeight ? vt.handleHeight(resizingTarget,h) : setHeight(resizingTarget,h);

						refreshImgResizerPosition();

						timer = null;

						window.status = w+'x'+h+' px';
					},50);
				return false;
			};
			function f_onmouseup(ev){
				canHide = true;
				window.status = '';
				document.removeEventListener('mousemove',f_onmousemove,true);
				document.removeEventListener('mouseup',f_onmouseup,true);
			};

			imgResizer.onmousedown = function(e){
				canHide = false;

				if(!resizingTarget.__minDimensions)
					resizingTarget.__minDimensions = {width:Math.min(50,getWidth(resizingTarget)),height:Math.min(50,getHeight(resizingTarget))};
				imgResizer.__offsets = {width:this.offsetWidth-e.offsetX,height:this.offsetHeight-e.offsetY};

				resizingTarget.style.minWidth  = (resizingTarget.__minDimensions.width)+'px!important';
				resizingTarget.style.minHeight = (resizingTarget.__minDimensions.height)+'px!important';
				resizingTarget.style.maxWidth  = '32000!important';
				resizingTarget.style.maxHeight = '32000!important';

				document.addEventListener('mousemove',f_onmousemove,true);
				document.addEventListener('mouseup',f_onmouseup,true);
				return false;
			};
			imgResizer.ondblclick = function(){
				if( resizingTarget.__origStyles ){
					for(var st in resizingTarget.__origStyles )
						resizingTarget.style[st] = resizingTarget.__origStyles[st];

					refreshImgResizerPosition();
				}
				return false;
			};

			document.documentElement.appendChild(imgResizer);
		}
	};
	function refreshImgResizerPosition(){
		if( resizingTarget ){
			imgResizer.style.display = 'block';
			imgResizer.style.top = (getYOffset(resizingTarget)+getHeight(resizingTarget)-imgResizer.offsetHeight)+'px !important';
			imgResizer.style.left = (getXOffset(resizingTarget)+getWidth(resizingTarget)-imgResizer.offsetWidth)+'px !important';
		}
		else{
			imgResizer.style.display = 'none';
		}
	};

	if( opera ){
		opera.addEventListener('BeforeEvent.mouseover',function(e){possibleTargetHover(e.event);},false);
		opera.addEventListener('BeforeEvent.mouseout',function(e){possibleTargetOut(e.event);},false);
	}
	else{
		addEventListener('mouseover',possibleTargetHover,true);
		addEventListener('mouseout',possibleTargetOut,true);
	}

	if (location.host == 'my.opera.com')
	(function(){
		/*
		* DoCheckForNewVersion() - name says it all, ripped from myopera-enhancements script
		* http://my.opera.com/community/forums/topic.dml?id=172834
		*/
		var SCRIPT_VERSION = 1.1;
		var scriptCookieName = 'xerath_powerdrag_versioncheck';
		var scriptDownloadLocation = 'http://files.myopera.com/xErath/files/xerath-power-drag.js';
		function DoCheckForNewVersion() {
			var c = document.cookie;
			if( c.indexOf(scriptCookieName) >= 0 )
					return;
			if( c )//one day timeout
				AddCookie(scriptCookieName, '1', new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), '/',
					location.host.indexOf("opera.com")>=0 ? 'opera.com' : '');

			LoadRemoteFile(scriptDownloadLocation, function(scriptContents) {
				if( scriptContents.match(/var SCRIPT_VERSION\s*=\s*([^;]+);/) && (RegExp.$1 > SCRIPT_VERSION ) &&
						confirm('<Power-Drag - User Javascript>\nNew version of script (' + RegExp.$1 + ') is available\nDownload?') ) {
					location.href = scriptDownloadLocation;
				}
			});
		};
		/**
		* AddCookie adds a cookie
		*
		* @param cookieName String cookie name
		* @param mediaStr media for the styles. Optional
		*/
		function AddCookie(cookieName, cookieValue, whenExpires, path, domain, isSecure) {
			if( !cookieName ) return;
			document.cookie = escape(cookieName) + "=" + escape(cookieValue) +
				((whenExpires) ? "; expires=" + (typeof whenExpires == 'string' ? whenExpires : whenExpires.toGMTString()) : "") +
				((path) ? "; path=" + path : "") +
				((domain) ? "; domain=" + domain : "") +
				((isSecure) ? "; secure" : "");
		};
		/*
		* LoadRemoteFile() - reads a file in another domain
		*/
		function LoadRemoteFile(url, callback) {
			var head = document.head || (document['head'] = document.selectSingleNode('//head'));
			if( !head ) { return; }
			var scriptHack = document.createElement('script');
			scriptHack.type = 'text/javascript';
			scriptHack.src = url;
			scriptHack._callback = callback;
			LoadRemoteFile.scriptElementsHacked[scriptHack.src] = 1;
			setTimeout(function() {//assynchronous loading for merlin
				head.appendChild(scriptHack);
			}, 1);

			if( !LoadRemoteFile.scriptListenerAdded ) {
				// Hack for reading remote contents
				//only works from main user js thread
				opera.addEventListener('BeforeScript', function(e) {
					if( LoadRemoteFile.scriptElementsHacked[e.element.src] && e.element._callback ) {
						e.preventDefault();
						if(e.element.parentNode)
							e.element.parentNode.removeChild(e.element);
						e.element._callback.call(e.element,e.element.text);
					};
				}, false);
				LoadRemoteFile.scriptListenerAdded = true;
			};
		};
		LoadRemoteFile.scriptElementsHacked = {};

		/*
		* if preference is set, do check
		*/
		if (kCheckForNewVersion)
			DoCheckForNewVersion();
	})();

})( window.opera );




