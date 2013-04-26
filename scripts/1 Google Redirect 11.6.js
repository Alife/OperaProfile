// ==UserScript==
// @name           禁止google结果跳转
// @namespace      http://whosemind.net
// @description    去掉google搜索结果的跳转(http://www.google.com/url?), 而直接用原始链接
// @version        0.0.5
// @include			*
// ==/UserScript==
var eles, timer, s,
parse, url,
loop = function () {
	var a = document.getElementsByTagName("a");
	if (!(window==window.parent&&a&&a.length>0&&a[0].host&&a[0].host.indexOf("google.com")>-1))
		{return;}
	var fn = function () {
		var v = document.getElementById('lst-ib');
		var resid = document.getElementById('res');
		if (!v)return;
		if (!resid)return;
		console.log('clear google redirect looping... '+a[0].host);
		if(document.title.indexOf("Redirect Clear")==-1)document.title = document.title + " Redirect Clear \\(^o^)/ ";
		var res = document.getElementsByClassName('l'),
		eid = document.getElementById('rso'),
		l = res.length,
		end = function () {
			setTimeout(function () {
				eles = eid;
				s = v;
				//console.log(l);
				for (var i = 0; i < l; i++) {
					res[i].setAttribute('onmousedown', '');
				}
				console.log('cleared');
				clearInterval(timer);
			}, 10);
		},
		sf = document.getElementById('tsf'),
		ofn = sf.onsubmit;
		
		if (!_flag) {
			_flag = true;
			sf.onsubmit = function () {
				console.log('11');
				return ofn.apply(this, arguments);
			};
		}
		eid = eid ? eid.getAttribute('eid') : '';
		//l && console.log(eid);
		if (l && (eid !== eles || v == s)) {
			end();
		}
	};
	clearInterval(timer);
	timer = setInterval(fn, 2000);
	fn();
}, _flag;

//unsafeWindow.addEventListener('hashchange', loop, false);
//document.addEventListener('DOMContentLoaded', loop, false);
//window.addEventListener('load', function(){document.title = document.title + " Redirect Clear \\(^o^)/ ";}, false);
if(typeof(jQuery)!='undefined'){
	jQuery(document).ready(function () {
		if(jQuery("a[onmousedown*='rwt']").length>0){
			jQuery("a[onmousedown*='rwt']").live('mouseover', function() {
				if(jQuery(this).attr("onmousedown")){
					jQuery(this).removeAttr("onmousedown").append(" √")
				}
			});
		}
		// no js web style
		jQuery("#ires h3 a,.osl>a").live('mouseover', function() {
			if(getQueryString("q", this.href)!="")jQuery(this).attr("href",getQueryString("q", this.href)).append(" √")
		});
	});
}

	