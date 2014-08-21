// ==UserScript==
// @name edit cookie
// @description 
// @depends none
// @author	lk
// @include	https://www.google.com/
// ==/UserScript==

function setCookie(c_name,c_value,keepday,c_path,c_domain,c_secure){
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
function getCookie(c_name){
	var sre="(?:;)?"+c_name+"=([^;]*);?";var ore=new RegExp(sre);
	if(ore.test(document.cookie)){return decodeURIComponent(RegExp['$1']);}
	else{return '';}
};
function delCookie(name) {
    setCookie(name,"",-1);
}

	var ccs=new Array();;
function createTable() {
	var cs=document.cookie.split(";");
    for(var i = 0, l = cs.length; i < l; i++){
		var c=cs[i].replace(" ","").split("=");
		if(c.length==0){}
		else {var name=c[0],value;
			if(c.length==1)delCookie(name);
			else {var cc=new Object();value=c[1];
				cc.name=name;cc.value=value;ccs.push(cc);
		var div=document.createElement('tr');
		div.id=name;
		div.innerHTML='\
		<td class=name>'+name+'</td>\<td class=value>'+value+'</td>\
		<td class=edit>edit</td>\<td class=del>del</td>\
		';
		document.getElementById("table").appendChild(div);
			}
		}
	}
}
var HTML="";
window.addEventListener('DOMContentLoaded', function(e) {
	if(window.name&&window.name=="cookieditor")return;
	var w = window.open('');w.name="cookieditor";
	w.document.open();
	w.document.write('<html><head><title></title><meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\' /><style type=\'text/css\'></style></head><body><table colSpan=0 rowSpan=0 width=100% id=table></table></body></html>');
	w.document.close();
	var style=document.createElement('style');
	style.type='text/css';
	style.textContent='\
		#googtrans-rect{z-index:999999!important;Color:#fff}\
	';
	document.getElementsByTagName('head')[0].appendChild(style);
	var div=document.createElement('div');
	div.id='cookieditor';
	div.innerHTML='';
	document.body.appendChild(div);
	createTable();
}, false);
