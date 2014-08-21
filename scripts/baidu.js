// ==UserScript==
// @include http://*.baidu.com/*
// ==/UserScript==
jQuery(document).ready(function () {
	var oXHR_F = function (baidulink) {
		var url = baidulink;
		var oXHR = new XMLHttpRequest();
		oXHR.open("HEAD", url, true);
		oXHR.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 302) {
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
			} else {
			}
		};
		oXHR.send(null);
		void(0);
	}
	jQuery("a[href*='http://www.baidu.com/link?url=']").each( function () { 
		oXHR_F(this.href);
	});
});
