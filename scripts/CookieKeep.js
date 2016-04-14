// ==UserScript==
// @name CookieKeep 
// @description do not expire cookies
// @include http*://*.co.cc/*
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function(e){
	var cookies=document.cookie.split(";");
	for(var i=0,length=cookies.length;i<length;i++)
	{
		var cookie=cookies[i].split("=");
		if(cookie.length==2){
			delCookie(cookie[0]);
			setCookie(cookie[0],cookie[1]);
			//console.log(cookie[0]);
		}
	}
}, false);
function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}
//写cookies
function setCookie(name,value){
	var Days = 30*12;
	var exp = new Date(); 
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//删除cookies
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}