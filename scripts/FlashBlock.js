// ==UserScript==
// @name Flash Block
// @author Lex1
// @version 1.3.15
// @description Blocks Flash and shows images instead. For Opera 9.5+. Press Ctrl+Shift+F or Ctrl+Alt+F for permanent unblocking on the site.
// @ujs:documentation http://ruzanow.ru/index/0-5
// @ujs:download http://ruzanow.ru/userjs/FlashBlock.js
// @exclude file://*
// @exclude http://mail.google.com/*
// @exclude http*://translate.google*.c*/*
// @exclude http://files.mail.ru/*
// @exclude http://*megaupload.com/*
// @exclude http://*blizzard.com/*
// @exclude http://*.operaunite.com/media_player/*
// @exclude http://v.yinyuetai.com/*
// @exclude http://dict.cn/*
// ==/UserScript==


(function(){
	//var flash = 'data:image/png;base64,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';
	//var play = 'data:image/png;base64,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';
	var flash = 'data:image/png;base64,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%3D%3D';
	var play = 'data:image/png;base64,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%3D%3D';
	var prefix = 'ujs_flashblock', cName = prefix+'_disabled';
	var css = 'object[classid$=":D27CDB6E-AE6D-11cf-96B8-444553540000"]:not(.'+cName+'),object[classid$=":d27cdb6e-ae6d-11cf-96b8-444553540000"]:not(.'+cName+'),object[codebase*="swflash.cab"]:not(.'+cName+'),object[data*=".swf"]:not(.'+cName+'),object[type="application/x-shockwave-flash"]:not(.'+cName+'),object[src*=".swf"]:not(.'+cName+'),object[codetype="application/x-shockwave-flash"]:not(.'+cName+'),embed[type="application/x-shockwave-flash"]:not(.'+cName+'),embed[src*=".swf"]:not(.'+cName+'),embed[allowscriptaccess]:not(.'+cName+'),embed[flashvars]:not(.'+cName+'),embed[wmode]:not(.'+cName+'),'
	// + 'object[classid$=":166B1BCA-3F9C-11CF-8075-444553540000"]:not(.'+cName+'),object[codebase*="sw.cab"]:not(.'+cName+'),object[data*=".dcr"]:not(.'+cName+'),object[type="application/x-director"]:not(.'+cName+'),object[src*=".dcr"]:not(.'+cName+'),embed[type="application/x-director"]:not(.'+cName+'),embed[src*=".dcr"]:not(.'+cName+'),'
	// + 'object[classid$=":15B782AF-55D8-11D1-B477-006097098764"]:not(.'+cName+'),object[codebase*="awswaxf.cab"]:not(.'+cName+'),object[data*=".aam"]:not(.'+cName+'),object[type="application/x-authorware-map"]:not(.'+cName+'),object[src*=".aam"]:not(.'+cName+'),embed[type="application/x-authorware-map"]:not(.'+cName+'),embed[src*=".aam"]:not(.'+cName+'),'
	+ 'object[classid$="32C73088-76AE-40F7-AC40-81F62CB2C1DA"]:not(.'+cName+'),object[type="application/ag-plugin"]:not(.'+cName+'),object[type="application/x-silverlight"]:not(.'+cName+'),object[type="application/x-silverlight-2"]:not(.'+cName+'),object[source*=".xaml"]:not(.'+cName+'),object[sourceelement*="xaml"]:not(.'+cName+'),embed[type="application/ag-plugin"]:not(.'+cName+'),embed[source*=".xaml"]:not(.'+cName+'),'
	+ 'applet:not(.'+cName+'),object[classid*=":8AD9C840-044E-11D1-B3E9-00805F499D93"]:not(.'+cName+'),object[classid^="clsid:CAFEEFAC-"]:not(.'+cName+'),object[classid^="java:"]:not(.'+cName+'),object[type="application/x-java-applet"]:not(.'+cName+'),embed[classid*=":8AD9C840-044E-11D1-B3E9-00805F499D93"]:not(.'+cName+'),embed[classid^="clsid:CAFEEFAC-"]:not(.'+cName+'),embed[classid^="java:"]:not(.'+cName+'),embed[type="application/x-java-applet"]:not(.'+cName+')'
	+ '{content: "" !important; display: inline-block !important; outline: 1px dotted #bbbbbb !important; min-width: 33px !important; min-height: 33px !important; cursor: pointer !important; background: url("'+flash+'") no-repeat center !important;}'
	+ 'object[classid$=":D27CDB6E-AE6D-11cf-96B8-444553540000"]:not(.'+cName+'):hover,object[classid$=":d27cdb6e-ae6d-11cf-96b8-444553540000"]:not(.'+cName+'):hover,object[codebase*="swflash.cab"]:not(.'+cName+'):hover,object[data*=".swf"]:not(.'+cName+'):hover,object[type="application/x-shockwave-flash"]:not(.'+cName+'):hover,object[src*=".swf"]:not(.'+cName+'):hover,object[codetype="application/x-shockwave-flash"]:not(.'+cName+'):hover,embed[type="application/x-shockwave-flash"]:not(.'+cName+'):hover,embed[src*=".swf"]:not(.'+cName+'):hover,embed[allowscriptaccess]:not(.'+cName+'):hover,embed[flashvars]:not(.'+cName+'):hover,embed[wmode]:not(.'+cName+'):hover,'
	// + 'object[classid$=":166B1BCA-3F9C-11CF-8075-444553540000"]:not(.'+cName+'):hover,object[codebase*="sw.cab"]:not(.'+cName+'):hover,object[data*=".dcr"]:not(.'+cName+'):hover,object[type="application/x-director"]:not(.'+cName+'):hover,object[src*=".dcr"]:not(.'+cName+'):hover,embed[type="application/x-director"]:not(.'+cName+'):hover,embed[src*=".dcr"]:not(.'+cName+'):hover,'
	// + 'object[classid$=":15B782AF-55D8-11D1-B477-006097098764"]:not(.'+cName+'):hover,object[codebase*="awswaxf.cab"]:not(.'+cName+'):hover,object[data*=".aam"]:not(.'+cName+'):hover,object[type="application/x-authorware-map"]:not(.'+cName+'):hover,object[src*=".aam"]:not(.'+cName+'):hover,embed[type="application/x-authorware-map"]:not(.'+cName+'):hover,embed[src*=".aam"]:not(.'+cName+'):hover,'
	+ 'object[classid$="32C73088-76AE-40F7-AC40-81F62CB2C1DA"]:not(.'+cName+'):hover,object[type="application/ag-plugin"]:not(.'+cName+'):hover,object[type="application/x-silverlight"]:not(.'+cName+'):hover,object[type="application/x-silverlight-2"]:not(.'+cName+'):hover,object[source*=".xaml"]:not(.'+cName+'):hover,object[sourceelement*="xaml"]:not(.'+cName+'):hover,embed[type="application/ag-plugin"]:not(.'+cName+'):hover,embed[source*=".xaml"]:not(.'+cName+'):hover,'
	+ 'applet:not(.'+cName+'):hover,object[classid*=":8AD9C840-044E-11D1-B3E9-00805F499D93"]:not(.'+cName+'):hover,object[classid^="clsid:CAFEEFAC-"]:not(.'+cName+'):hover,object[classid^="java:"]:not(.'+cName+'):hover,object[type="application/x-java-applet"]:not(.'+cName+'):hover,embed[classid*=":8AD9C840-044E-11D1-B3E9-00805F499D93"]:not(.'+cName+'):hover,embed[classid^="clsid:CAFEEFAC-"]:not(.'+cName+'):hover,embed[classid^="java:"]:not(.'+cName+'):hover,embed[type="application/x-java-applet"]:not(.'+cName+'):hover'
	+ '{background-image: url("'+play+'") !important;}';

	var addStyle = function(css){
		var s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		s.setAttribute('style', 'display: none !important;');
		s.appendChild(document.createTextNode(css));
		return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
	};

	var getValue = function(name){
		if(window.localStorage){
			return window.localStorage.getItem(name) || '';
		}
		else{
			var eq = name+'=', ca = document.cookie.split(';');
			for(var i = ca.length; i--;){
				var c = ca[i];
				while(c.charAt(0) == ' ')c = c.slice(1);
				if(c.indexOf(eq) == 0)return unescape(c.slice(eq.length));
			};
			return '';
		}
	};

	var setValue = function(name, value, del){
		if(window.localStorage){
			if(del){window.localStorage.removeItem(name)}else{window.localStorage.setItem(name, value)};
		}
		else{
			if(document.cookie.split(';').length < 30 && document.cookie.length-escape(getValue(name)).length+escape(value).length < 4000){
				var date = new Date();
				date.setTime(date.getTime()+((del ? -1 : 10*365)*24*60*60*1000));
				document.cookie = name+'='+escape(value)+'; expires='+date.toGMTString()+'; path=/';
			}
			else{
				alert('Cookies is full!');
			}
		}
	};

	var getVideo = function(flashvars, src){
		var getLink = function(s){var rez = s.match(/[^\s\x22=&?]+\.[^\s\x22=&?\/]*(flv|mp4)/i); return rez ? rez[0] : ''};
		var getQuery = function(s, q){var rez = s.match(new RegExp('[&?]'+q+'=([^&]+)')); return rez ? rez[1] : ''};
		var getJson = function(s, q){var rez = s.match(new RegExp('\x22'+q+'\x22:\\s*(\x22.+?\x22)')); return rez ? eval(rez[1]) : ''};
		var getURL = function(f, s){return f.match(/^(\w+:\/\/|\/|$)/) ? f : s.replace(/[#?].*$/, '').replace(/[^\/]*$/, f)};
		var decodeURL = function(s){try{return decodeURIComponent(s)}catch(e){return unescape(s)}};

		var q = '', url = location.href, flv = decodeURL(flashvars);

		if( url.indexOf('youtube.com/watch?') != -1 && (q = getQuery(flv, 'video_id')) )return 'http://www.youtube.com/get_video?video_id='+q+'&t='+getQuery(flv, 't')+'&fmt=18';
		if( url.indexOf('video.google.com/videoplay?') != -1 && (q = getQuery(src, 'videoUrl')) )return decodeURL(q);
		if( url.indexOf('metacafe.com/watch/') != -1 && (q = getQuery(flv, 'mediaURL')) )return q+'?__gda__='+getQuery(flv, 'gdaKey');
		if( url.indexOf('dailymotion.com/') != -1 && (q = getJson(flv,'hqURL') || getJson(flv,'sdURL')) )return q;
		if( url.indexOf('my-hit.ru/film/') != -1 && (q = getLink(flv)) )return q+'?start=0&id='+getQuery(flv, 'id');

		return getURL(getLink(flv) || decodeURL(getLink(src)), src);
	};

	var getParam = function(e, n){
		var v = '', r = new RegExp('^('+n+')$', 'i');
		var param = e.getElementsByTagName('param');
		for(var i = 0, p; p = param[i]; i++){
			if(p.hasAttribute('name') && p.getAttribute('name').match(r)){v = p.getAttribute('value'); break};
		};
		return v;
	};

	var qualifyURL=function(url){
		if(!url)return '';
		var a = document.createElement('a');
		a.href = url;
		return a.href;
	};

	var addClassName = function(ele, cName){
		ele.className += (ele.className ? ' ' : '')+cName;
	};

	var delClassName = function(ele, cName){
		var a = ele.className.split(' ');
		for(var i = a.length; i--;){
			if(a[i] == cName)a.splice(i, 1);
		};
		ele.className = a.join(' ');
	};

	var isBlocked = function(ele){
		var tag = ele && ele.nodeName.toLowerCase();
		return (tag == 'embed' || tag == 'object' || tag == 'applet') && (ele.currentStyle.content || getComputedStyle(ele, null).content) == '""';
	};

	var setStatus = function(value){
		if(top == self){
			window.status = value;
			window.defaultStatus = value;
			window.setTimeout(function(){window.defaultStatus = ''}, 4000);
		}
	};

	var delStyle = function(css){
		var styles = document.getElementsByTagName('style');
		for(var i = styles.length; i--;){
			if(styles[i].innerHTML == css)styles[i].parentNode.removeChild(styles[i]);
		}
	};

	var getLng = function(){
		switch(window.navigator.language){
			case 'ru': return {
				fEnabled: 'FlashBlock \u0432\u043A\u043B\u044E\u0447\u0435\u043D',
				fDisabled: 'FlashBlock \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D'
			};
			default: return {
				fEnabled: 'FlashBlock enabled',
				fDisabled: 'FlashBlock disabled'
			}
		}
	};

	var unblockFlash = function(e){
		var ele = e && e.target; if(!ele)return;
		var embed = ele.getElementsByTagName('embed')[0];
		if(isBlocked(ele) && !e.shiftKey && !e.altKey){
			e.preventDefault();
			e.stopPropagation();

			var src = ele.getAttribute('src') || ele.getAttribute('source') || ele.getAttribute('data') || getParam(ele, 'movie|data|src|code|filename|url|source') || (embed && embed.getAttribute('src')) || '';
			if(e.ctrlKey){
				// Save video with Ctrl+Click
				if(src)location.href = getVideo(ele.getAttribute('flashvars') || getParam(ele, 'flashvars'), src) || src;
			}
			else{
				// Unblock flash
				addClassName(ele, cName);
				if(isBlocked(embed))addClassName(embed, cName);
				if(ele.getAttribute('title') == qualifyURL(src))ele.removeAttribute('title');
			}
		}
	};

	var showAddress = function(e){
		var ele = e && e.target; if(!ele)return;
		if(!ele.title && isBlocked(ele)){
			var src = ele.getAttribute('src') || ele.getAttribute('source') || ele.getAttribute('data') || getParam(ele, 'movie|data|src|code|filename|url|source');
			if(src)ele.setAttribute('title', qualifyURL(src));
		}
	};

	var toggle = function(block){
		var postMsg = function(msg){for(var i = 0, f = window.frames, l = f.length; i < l; i++)f[i].postMessage(msg)};
		var lng = getLng();
		if(arguments.length ? !block : getValue(prefix) != 'unblocked'){
			delStyle(css);
			setValue(prefix, 'unblocked');
			postMsg(prefix+'_disable');
			document.removeEventListener('click', unblockFlash, true);
			document.removeEventListener('mouseover', showAddress, false);
			setStatus(lng.fDisabled);
		}
		else{
			addStyle(css);
			setValue(prefix, '', true);
			postMsg(prefix+'_enable');
			document.addEventListener('click', unblockFlash, true);
			document.addEventListener('mouseover', showAddress, false);
			setStatus(lng.fEnabled);
		};
		var unblockedEle = document.getElementsByClassName(cName);
		for(var i = unblockedEle.length; i--;){
			delClassName(unblockedEle[i], cName);
		}
	};

	var loadImages = function(){
		var embed = document.getElementsByTagName('embed');
		var obj = document.getElementsByTagName('object');
		var isShowImagesMode = function(){
			var imgs = document.images;
			var l = imgs && imgs.length;
			return l && imgs[0].complete && imgs[l-1].complete;
		};
		if((embed.length == 0 && obj.length == 0) || isShowImagesMode())return;

		var reloadImage = function(s){
			var f = document.createElement('iframe');
			f.src = s;
			f.width = 0;
			f.height = 0;
			f.frameBorder = 'no';
			f.scrolling = 'no';
			f.onload = function(){
				this.parentNode.removeChild(this);
			};
			document.documentElement.appendChild(f);
		};

		reloadImage(flash);
		reloadImage(play);
	};


	// Non html
	if(!(document.documentElement instanceof HTMLHtmlElement))return;

	// Blocking
	if(getValue(prefix) != 'unblocked'){
		addStyle(css);
		// unblock flash
		document.addEventListener('click', unblockFlash, true);
		// show title
		document.addEventListener('mouseover', showAddress, false);
		// load flashblock images in "cached images" mode
		window.addEventListener('load', loadImages, false);
	};

	// Unblock for the site with Ctrl+Shift+F or Ctrl+Alt+F
	document.addEventListener('keypress', function(e){
		if(e.keyCode == 70 && e.ctrlKey && (e.shiftKey != e.altKey))toggle();
	}, false);

	// For buttons
	window.addEventListener('message', function(e){
		if(e.data == prefix+'_disable')toggle(false);
		if(e.data == prefix+'_enable')toggle(true);
	}, false);
})();
