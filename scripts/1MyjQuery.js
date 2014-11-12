// ==UserScript==
// @name all jquery user js
// @description 
// @depends jquery.js like 0jquery-1.8.3.js
// @exclude	http://*.js
// @author	lk
// ==/UserScript==

(function(){
// remove google redirect url
if(typeof(jQuery)!='undefined'){
	jQuery(document).ready(function () {
		// remove google redirect
		var removeGRU=function(e) {
			if(!(this.href.indexOf("url=")>-1||this.href.indexOf("q=")>-1))return;
			if(jQuery(this).attr("onmousedown")){jQuery(this).removeAttr("onmousedown").append(" √").unbind("mouseover",removeGRU);}
			var ori_hreh=getQueryString("url", this.href);
			if(ori_hreh=="")ori_hreh=getQueryString("q", this.href);
			//if(ori_hreh!="")jQuery(this).attr("href",ori_hreh).append(" √")
			if(!jQuery(this).attr("removeurl"))jQuery(this).attr("href",ori_hreh).attr("removeurl","1").append(" √").unbind("mouseover",removeGRU);
		};
		// #ires h3 a,.osl>a,#ires a for no js web style 
		// https://www.google.com/search?hl=en&source=hp&q=java+randou&gbv=2&oq=java+randou&gs_l=heirloom-hp.3..0i13l10.10243.12557.0.12954.11.10.0.0.0.0.199.800.5j3.8.0....0...1ac.1.34.heirloom-hp..3.8.800.6mB0GMiRLzI
		var ires_h3=jQuery("#ires h3 a,.osl>a,#ires a,a[onmousedown*='rwt']");
		if(ires_h3.length>0){
			ires_h3.live('mouseover',removeGRU);
		}
		jQuery(".action-menu li a").each(function() {
			jQuery(this).parents(".action-menu:first").before(this).empty();
		});
	});
}
// add dom load time and body load time to title
if(window == window.parent){
	function showInfo(msg){
		if(document.body.innerHTML==""||document.body.innerText==""||document.contentType!="text/html")return;
		var _pageInfo =document.getElementById("_userJs_pageInfo")
		if(!_pageInfo){
			_pageInfo = document.createElement('div');
			_pageInfo.id = '_userJs_pageInfo';
			_pageInfo.setAttribute("style","background-color:#eee; float: right; padding:5px 10px; position: fixed; bottom: 0; right: 0px;z-index:10000;font-size:10px;line-height:100%")
			document.body.appendChild(_pageInfo);
		}
		_pageInfo.innerHTML = _pageInfo.innerHTML+"<font color=#356AA0>"+msg+"</font><br/>";
		
	};
	
	var startTime=new Date();
	var documentLoadTime;
	document.addEventListener('DOMContentLoaded', function(){
		var dom="Dom:";
		if(typeof(documentLoadTime)=='undefined')documentLoadTime = new Date() - startTime;
		//if(document.title.indexOf(dom)==-1)document.title += " "+dom+documentLoadTime/1000 +"s";
		var body_onload_fn=document.body.onload;
		document.body.onload= function() {var bodyStr="Body:";
			if(body_onload_fn)eval(body_onload_fn)();
			var loadTime = new Date() - startTime;
			showInfo(dom+documentLoadTime/1000 +"s  " +bodyStr+loadTime/1000 +"s");
			//if(document.title.indexOf(dom)==-1)document.title += " "+dom+documentLoadTime/1000 +"s";
			//if(document.title.indexOf(bodyStr)==-1)document.title += " "+bodyStr+loadTime/1000 +"s";
		};
		if(document.referrer!="")showInfo("referrer: "+document.referrer);

		// display document.referrer
		var ref = document.referrer;
		if(ref!=""){
			var refLinks = jQuery("a[href='"+ref+"']");
			refLinks.each(function(){
				var refLink = this;
				refLink.style.textDecoration="underline";
				refLink.style.backgroundColor="#3F4C6C";
				refLink.style.color="red";
				if(!refLink.id)refLink.id="referrer";
				if(!refLink.title)refLink.title="referrer";
				//location.href = "#referrer";
			});
		}
		}, false);
}
})()