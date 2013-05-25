// ==UserScript==
// @name disable js on iframe
// @description disable js on iframe
// @exclude	http*://mail.google.com/*
// ==/UserScript==

if(typeof(jQuery)!='undefined'){
	jQuery(document).ready(function () {
		// remove google redirect
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
		jQuery(".action-menu li a").each(function() {
			jQuery(this).parents(".action-menu:first").before(this).empty();
		});
	});
}
if(window == window.parent){
	var startTime=new Date();
	var documentLoadTime;
	document.addEventListener('DOMContentLoaded', function(){
		var dom="DOM:";
		if(documentLoadTime==undefined)documentLoadTime = new Date() - startTime;
		if(document.title.indexOf(dom)==-1)document.title += " - "+dom+documentLoadTime/1000 +"s";
		log(documentLoadTime);
		document.body.onload= function() {var bodyStr="Body:";
			var loadTime = new Date() - startTime;
			if(document.title.indexOf(dom)==-1)document.title += " - "+dom+documentLoadTime/1000 +"s";
			if(document.title.indexOf(bodyStr)==-1)document.title += " - "+bodyStr+loadTime/1000 +"s";
		};
	}, false);
}