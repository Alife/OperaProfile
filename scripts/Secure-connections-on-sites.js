// ==UserScript==
// @name           Secure connections on sites
// @namespace      http://userscripts.org/users/23652
// @description    Forces known sites to use a secure connection
// @include        http://*paypal.com/*
// @include        http://www.google.com/accounts/ServiceLogin?service=mail*
// @include        http://addons.mozilla.org/*
// @include        http://*isohunt.com/*
// @include        http://*evernote.com/*
// @include        http://*binsearch.info/*
// @include        http://*binsearch.net/*
// @include        http://mail.google.com/*
// @include        http://www.google.com/calendar/*
// @include        http://docs.google.com/*
// @include        http://spreadsheets.google.com/*
// @include        http://www.google.com/reader/*
// @include        http://www.google.com/bookmarks/*
// @include        http://www.google.com/history/*
// @include        http://www.google.com/notebook/*
// @include        http://groups.google.com/*
// @include        http://sites.google.com/*
// @include        http://*amazon.com/*
// @include        https://*amazon.com/*
// @include        http://*amazon.co.uk/*
// @include        https://*amazon.co.uk/*
// @include        http://*.facebook.com/*
// @include        http://www.opendns.com/*
// @include        http://eztv.it/*
// @include        http://orkut.com/*
// @include        http://www.orkut.co.in/*
// @include        http://*twitter.com/*
// @include        http://thepiratebay.org/*
// @include        http://*.zoho.com/*
// @include        http://*.wikileaks.org/*
// @include        http://alipay.com/*
// @include        http://*.xmarks.com/*
// @include        http://*.appspot.com/*
// @include        http://www.kenengba.com/*
// @include        http://fanfou.im/*
// @include        http://webcache.googleusercontent.com/*
// @include        http://*.dropbox.com/*
// @copyright      JoeSimmons
// @version        1.0.3
// @license        Creative Commons Attribution-Noncommercial 3.0 United States License
// ==/UserScript==

(function(){
var url = window.location.href;

var testHttps=function(url){
	var oXHR = new XMLHttpRequest();
	var url_https=url.replace(url.substring(0,7), 'https://')
	oXHR.open("HEAD", url_https, true);
	oXHR.onreadystatechange = function () {
			var returnMessage='';
		if(this.readyState == 4){
			if(this.status == 200){
				returnMessage = this.responseText;
			}else if(this.status == 404){
				returnMessage = "请求路径错误";
			}else if(this.status == 500){
				returnMessage = "服务器内部错误";
			}else if(this.status === 302) {
				//alert(this.getAllResponseHeaders());
				var Headers = this.getAllResponseHeaders();
				var isfind = "$".split(":");
				Headers = Headers.replace("\n", "$");
				isfind = Headers.split('$')[0].split(":");
				while (isfind[0] != "Location") {
					Headers = Headers.split('$')[1].replace("\n", "$");
					isfind = Headers.split('$')[0].split(":");
				}
				var realUrl = isfind[1]+":"+isfind[2];
				//console.log(baidulink+"  "+realUrl);
				jQuery("a[href='"+baidulink+"']").attr("href",realUrl).attr("title",realUrl).append("<span>^_^</span>");;
				window.location.replace(url_https);
			} else {
				returnMessage = "异常";
			}
			console.log(returnMessage+"  "+this.status+" "+this.readyState +" "+url_https);
			//console.log(this);
		} 
	};
	oXHR.send(null);
	void(0);
}

if(url.indexOf('http://')==0) {
	testHttps(url);
}

if(url.indexOf('https://www.amazon.com')==0) {
for(var i=0; (link=document.links[i]); i++) {
if(link.href.indexOf('http://')==0) link.href = link.href.replace(link.href.substring(0,7), 'https://');
}
}

})();

