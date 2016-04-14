// ==UserScript==
// @name discuz user js
// @description 
// @exclude	http://*.js
// @author	lk
// ==/UserScript==

(function() {
	document.addEventListener('DOMContentLoaded', function(){
		// disable md5 password
		for(var i=0;i<document.forms.length;i++){
			var f=document.forms[i];
			if(f.onsubmit&&f.onsubmit.toString().indexOf("pwmd5")>-1){
				pwmd5=function(){};
			}
		}
	});
})();
