// ==UserScript==
// @author remove baidu url redirect
// @version v1.0.0
// @date 2013-02-16
// @description Disable the lazy-load function of images for Dz-forums.
// @include *
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(e){
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
	jQuery("a[href*='http://www.baidu.com/link?url='],a[href*='http://jump.bdimg.com/safecheck/index?url=']").each( function () { 
		jQuery(this).bind("mouseover",function(){oXHR_F(this.href)});
	});
});
