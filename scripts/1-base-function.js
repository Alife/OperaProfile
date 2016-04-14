// ==UserScript==
// @name define some prototype methord
// @description 
// @depends none
// @author	lk
// ==/UserScript==

if(!String.prototype.startWith)String.prototype.startWith=function(suffix) {return this.indexOf(suffix) == 0;};
if(!String.prototype.endsWith)String.prototype.endsWith=function(suffix) {return this.indexOf(suffix, this.length - suffix.length) !== -1;};
if(!Array.prototype.last)Array.prototype.last = function() {return this[this.length-1];}

// stop js on svg
if(document.URL.endsWith(".svg"))
window.opera.addEventListener("BeforeScript",function (e){
	e.preventDefault();
	log(e);
}, false);

/* support qSelectorAll for UserJs that replaced querySelectorAll for 9.64   */
if(typeof(jQuery)!='undefined'){
	if(!document.qSelectorAll){
		HTMLDocument.prototype.qSelectorAll = function(str) {
			if(this.querySelectorAll) return this.querySelectorAll(str);
			else return jQuery.makeArray(jQuery(str));
		}
	}
}


// 说明：Javascript 获取链接(url)参数的方法
function getQueryString(name, href) {
	// 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
	if (!href&&(href.indexOf("?") == -1 || href.indexOf(name + '=') == -1)) {
		return '';
	}
	// 获取链接中参数部分
	var queryString = href.substring(href.indexOf("?") + 1);
	// 分离参数对 ?key=value&key2=value2
	var parameters = queryString.split("&");
	var pos,
	paraName,
	paraValue;
	for (var i = 0; i < parameters.length; i++) {
		// 获取等号位置
		pos = parameters[i].indexOf('=');
		if (pos == -1) {
			continue;
		}
		// 获取name 和 value
		paraName = parameters[i].substring(0, pos);
		paraValue = parameters[i].substring(pos + 1);
		// 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
		if (paraName == name) {
			return unescape(paraValue.replace(/\+/g, " "));
		}
	}
	return '';
};

/*
* url 目标url(http://www.phpernote.com/javascript-function/603.html)
* arg 需要替换的参数名称
* arg_val 替换后的参数的值
* return url 参数替换后的url
*/
function changeURLArg(url, arg, arg_val) {
    url = url.replace("?", "?1=1&");
    var pattern = "&"+arg + '=([^&]*)';
    if (url.match(pattern)) {
        var tmp = '/(&' + arg + '=)([^&]*)/gi';
        var replaceText = "&" + arg + '=' + arg_val;
        tmp = url.replace(eval(tmp), replaceText);
        return tmp.replace("?1=1&", "?");
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
    return url + '\n' + arg + '\n' + arg_val;
}

function getURLArg(url, arg) {
    url = url.replace("?", "?1=1&");
    var pattern = "&" + arg + '=([^&]*)';
    if (url.match(pattern)) {
        return url.match(pattern)[1];
    } else return "";
}

//写cookie函数
if(!HTMLDocument.prototype.setCookie)
HTMLDocument.prototype.setCookie = function(c_name,c_value,keepday,c_path,c_domain,c_secure){
	//var scookie=c_name+'='+encodeURIComponent(c_value);
	var scookie=c_name+'='+(c_value);
	if (keepday){
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+Number(keepday));
		scookie+=';expires='+exdate.toGMTString();
	};
	if (c_path){scookie+=';path='+c_path;};
	if (c_domain){scookie+=';domain='+c_domain;};
	if (c_secure){scookie+=';secure='+c_secure;};
	document.cookie=scookie;
};
//写cookie函数
if(!HTMLDocument.prototype.setAllCookies)
HTMLDocument.prototype.setAllCookies = function(cookies){
	var keys=cookies.match(/[^;]+/g);
	for (var i = keys.length; i--;){
		var values=keys[i].split("=");
		if (values.length==2)
			document.setCookie(values[0],values[1],365*100,"/");
	}
}

//取cookie函数
if(!HTMLDocument.prototype.getCookie)
HTMLDocument.prototype.getCookie = function(c_name){
	var sre="(?:;)?"+c_name+"=([^;]*);?";var ore=new RegExp(sre);
	if(ore.test(document.cookie)){return decodeURIComponent(RegExp['$1']);}
	else{return '';}
};
function getCookie(objName, arg) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        var url = arrStr[i].substring(arrStr[i].indexOf("=")+1);
        if (temp[0] == objName) {
        if (arg) {
            if (url.indexOf("&") > -1) url = "1=1&" + url;
            var pattern = "&" + arg + '=([^&]*)';
            if (url.match(pattern)) {
                return url.match(pattern)[1];
            }
        } else return url;
        }
    }
    return "";
}

//删除 cookie
if(!HTMLDocument.prototype.delCookie)
HTMLDocument.prototype.delCookie = function(name) {
	document.setCookie(name,"",-1);
}
//删除所有 cookie
if(!HTMLDocument.prototype.delAllCookies)
HTMLDocument.prototype.delAllCookies = function(name) {
	var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
	if (keys)
		for (var i = keys.length; i--;)
			document.delCookie(keys[i]);
}
//删除所有 cookie
if(!HTMLDocument.prototype.hasFocus)HTMLDocument.prototype.hasFocus = function() {
	return !document["hidden"];
}

var hasClassName = function(className){  
	var eN = this.className;  
	//用正则表达式判断多个class之间是否存在真正的class（前后空格的处理）  
	return (eN.length != 0 || eN == className || eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)")));
}  
var addClass = function(className){  
	var eN = this.className;  
	if(eN.length == 0){this.className = eN;}
	else if (eN == className || eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))   
		return;  
	this.className = eN + " " + className;  
}  
var removeClass= function(className){  
	var eN = this.className;  
	if (eN.length == 0) return;  
	if(eN == className){this.className = "";return;}  
	if (eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))){
		this.className = eN.replace((new RegExp("(^|\\s)" + className + "(\\s|$)"))," ");}  
}
if(!HTMLBodyElement.prototype.addStyle)
HTMLBodyElement.prototype.addStyle = function(css){
	var s = document.createElement('style');
	s.setAttribute('type', 'text/css');
	s.setAttribute('style', 'display: none !important;');
	s.appendChild(document.createTextNode(css));
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};
if(!HTMLBodyElement.prototype.addScript)
HTMLBodyElement.prototype.addScript = function(script){
	var d=document;var b=d.body;var s=d.createElement('script');
	s.setAttribute('src',script);
	s.setAttribute('type','text/javascript');
	b.appendChild(s);
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};
if(!HTMLBodyElement.prototype.addCss)
HTMLBodyElement.prototype.addCss = function(src){
	var d=document;var b=d.body;var s=d.createElement('link');
	s.setAttribute('src',src);
	s.setAttribute('type','text/css');
	b.appendChild(s);
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};

// firefox
// if(!document.selectNodes)
// HTMLDocument.prototype.selectNodes = function(selector){
	// // document.selectNodes('//a[@title="引用"]') == document.querySelectorAll('a[title="引用"]')
	// selector=selector.replace("//","").replace("[@","[");
	// try{return document.querySelector(selector)}
	// catch(e){console.log(e);}
// };
if(!HTMLDocument.prototype.selectSingleNode)
HTMLDocument.prototype.selectSingleNode = function(selector){
	// document.selectNodes('//a[@title="引用"]') == document.querySelectorAll('a[title="引用"]')
	selector=selector.replace(/\/\//g," ").replace(/@/g,"").replace(/"/g,"'");
	return document.querySelector(selector);
	//try{return document.querySelector(selector)}
	//catch(e){console.log(e);}
};
	
/* 实现元素的动态固定 */
function gss(){
	var scrolly=window.scrollY;
	var scrollx=window.scrollX;
	var FW_position=2,vertical=20,horiz=40;
	switch(FW_position){
		case 1:{
			div.style.top=vertical+scrolly+'px';
			div.style.left=horiz+scrollx+'px';
		}break;
		case 2:{
			div.style.top=vertical+scrolly+'px';
			div.style.right=horiz-scrollx+'px';
		}break;
		case 3:{
			div.style.bottom=vertical-scrolly+'px';
			div.style.right=horiz-scrollx+'px';
		}break;
		case 4:{
			div.style.bottom=vertical-scrolly+'px';
			div.style.left=horiz+scrollx+'px';
		}break;
		default:break;
	};
};

//div.style.position='absolute';
var timeout;
function gs(){
	clearTimeout(timeout);
	timeout=setTimeout(gss,200);
};
//gss();
//window.addEventListener('scroll',gs,false);

if (!window.log) {
	window.log = console.log;
}

if (typeof opera != 'undefined') {
 window.opera.addEventListener('BeforeJavascriptURL', function (e){
    if (e.source.indexOf('window.open') != -1){
      //rewrite the script to confirm before opening windows
      //e.source = e.source.replace(/window\.open/g, 'if( confirm(\'Allow window to open?\') ) window.open');
    }
  }, false);
 window.opera.addEventListener('BeforeJavascriptURL', function (e){
    if (e.source.indexOf('window.open') != -1){
      //rewrite the script to confirm before opening windows
      //e.source = e.source.replace(/window\.open/g, 'if( confirm(\'Allow window to open?\') ) window.open');
    }
  }, false);
// stop facebook certificate warning
window.opera.addEventListener("BeforeScript",function (e) {
	if(e.element.innerHTML.indexOf("static.ak.facebook.com")>-1){
		//e.preventDefault();
	}
}, false);
}

		