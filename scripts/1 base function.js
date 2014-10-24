// ==UserScript==
// @name define some prototype methord
// @description 
// @depends none
// @author	lk
// ==/UserScript==

/* support qSelectorAll for UserJs that replaced querySelectorAll for 9.64   */
if(typeof(jQuery)!='undefined'){
	if(!document.qSelectorAll){
		HTMLDocument.prototype.qSelectorAll = function(str) {
			if(this.querySelectorAll) return this.querySelectorAll(str);
			else return jQuery.makeArray(jQuery(str));
		}
	}
}

if(new Array().last)Array.prototype.last = function() {return this[this.length-1];}

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

(function(){

//写cookie函数
HTMLDocument.prototype.setCookie = function setCookie(c_name,c_value,keepday,c_path,c_domain,c_secure){
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

//取cookie函数
HTMLDocument.prototype.getCookie = function getCookie(c_name){
	var sre="(?:;)?"+c_name+"=([^;]*);?";var ore=new RegExp(sre);
	if(ore.test(document.cookie)){return decodeURIComponent(RegExp['$1']);}
	else{return '';}
};
//取cookie函数
HTMLDocument.prototype.delCookie = function delCookie(name) {
    document.setCookie(name,"",-1);
}
//写cookie函数
HTMLDocument.prototype.setCookies = function setCookies(cookies){
	var arrCookies = cookies.split("; ");
	for (var sCookie, i = 0; sCookie = arrCookies[i]; ++i) {
		var nCookieNameEnd = sCookie.indexOf("=");
		var sCookieName = sCookie.substr(0, nCookieNameEnd);
		var sCookieValue = sCookie.substr(nCookieNameEnd + 1);
		document.setCookie(sCookieName,sCookieValue,365*10);
	}
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

var hasClassName = function(className){  
    var eN = this.className;  
    if (eN.length == 0) return false;  
    //用正则表达式判断多个class之间是否存在真正的class（前后空格的处理）  
    if (eN == className || eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))  
      return true;return false;  
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
HTMLBodyElement.prototype.addStyle = function(css){
	var s = document.createElement('style');
	s.setAttribute('type', 'text/css');
	s.setAttribute('style', 'display: none !important;');
	s.appendChild(document.createTextNode(css));
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};
HTMLBodyElement.prototype.addScript = function(script){
	var d=document;var b=d.body;var s=d.createElement('script');
	s.setAttribute('src',script);
	s.setAttribute('type','text/javascript');
	b.appendChild(s);
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};
HTMLBodyElement.prototype.addCss = function(src){
	var d=document;var b=d.body;var s=d.createElement('link');
	s.setAttribute('src',src);
	s.setAttribute('type','text/css');
	b.appendChild(s);
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};

if (!window.log) {
	window.log = console.log;
}

})();

 window.opera.addEventListener('BeforeJavascriptURL', function (e)
  {
    if (e.source.indexOf('window.open') != -1)
    {
      //rewrite the script to confirm before opening windows
      e.source = e.source.replace(/window\.open/g, 'if( confirm(\'Allow window to open?\') ) window.open');
    }
  }, false);
 window.opera.addEventListener('BeforeJavascriptURL', function (e)
  {
    if (e.source.indexOf('window.open') != -1)
    {
      //rewrite the script to confirm before opening windows
      e.source = e.source.replace(/window\.open/g, 'if( confirm(\'Allow window to open?\') ) window.open');
    }
  }, false);
// stop facebook certificate warning
window.opera.addEventListener("BeforeScript",function (e) {
	if(e.element.innerHTML.indexOf("static.ak.facebook.com")>-1){
		e.preventDefault();
	}
}, false);



		