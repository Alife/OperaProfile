// ==UserScript==
// @name disable js on iframe
// @description Block external scripts (and js-advertising).
// @oc	http://bbs.operachina.com/viewtopic.php?f=41&t=86126
// ==/UserScript==
// 禁止执行 iframe 内的所有 js
if(window != window.parent){
	window.opera.addEventListener(
		"BeforeScript",
		function (e) {
			console.log(e);
			//console.log(e.element.text);
			e.preventDefault();
		}, false
	);
}

