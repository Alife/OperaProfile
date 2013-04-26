// ==UserScript==
// @name disable js on iframe
// @description disable js on iframe
// @exclude	http*://mail.google.com/*
// ==/UserScript==
// 禁止执行 iframe 内的所有 js
if(window != window.parent){
	window.opera.addEventListener("BeforeScript",function (e) {
			e.preventDefault();
		}, false
	);
}

