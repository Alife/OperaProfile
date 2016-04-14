// ==UserScript==
// @name adblock+
// @author Lex1
// @description add a classname to HTML element.
// ==/UserScript==

(function(){
	function setclassname(){
		var d=document.documentElement;
		//alert(d);
		if(!d){return true};
		var hclassname=location.hostname.replace(/^www\./, '');
		if(d instanceof HTMLHtmlElement){
			var dcn=d.className;
			d.className += (dcn ? ' ' : '') + hclassname;
			while(hclassname.split('.').length>2){
				hclassname=hclassname.substring(hclassname.indexOf('.')+1,hclassname.length);
				d.className += ' ' + hclassname;
			}
		};
	};
	if (setclassname()){document.addEventListener('DOMContentLoaded',setclassname,false);}
})();