// ==UserScript==
// @name Gougou Link Revealer
// @author somh
// @email ahmore@gmail.com
// @include http://*/dload1.html?cid=*
// @include http://pub.xunlei.com/fcg-bin/cgi_download.fcg?cid=*
// @include http://*down?cid=*
// @include http://*down1?cid=*
// @include http://www.gougou.com/search*
// @ujs:modified 20:45 2010-7-7
// ==/UserScript==

window.opera.addEventListener('BeforeScript',function (e) {
		if(g_downUrl){e.preventDefault();}
},false);

window.addEventListener('DOMContentLoaded',function (e) {
	e.preventDefault();
	var u=g_downUrl;
	if(u){
		var dWrap=document.createElement("div");
		var dText=document.createElement("div");
		dWrap.id="thunder";
		dWrap.style="margin:10% 15% 5px; padding:16px;overflow:hidden;text-align:center;background:-o-skin(\"Secure Popup Header Skin\")";
		dWrap.innerHTML="<a style='height:-o-skin;display:inline-block;font:bold 13.5pt tahoma;' href='" + u + "'>" + g_title + "</a>";
		dText.style="margin:0 15% 0; border:1px solid #eee;padding:5px;background:#fafafa;text-align:center;display:block;";
		dText.id="dText";dText.innerText=u;
		with(top.document.body){
			innerHTML="";
			appendChild(dWrap);
			style="overflow:hidden";
			appendChild(dText);
		}
	}
},false);





