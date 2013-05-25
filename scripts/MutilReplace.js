// ==UserScript==
// @ujs:modified 2009年3月2日17:22:27
// ==/UserScript==

// @include http://*.googleusercontent.com/*
// @include http://*.twitter.com/*
// @include http://t.sina.com.cn/*
// @include http://*.smallcat.co.cc/*

//window.opera.addEventListener(
//    "BeforeEvent.load",
//    function (e) {
//        console.log(e.event.srcElement.outerHTML);
//    }, false
//);

document.addEventListener('DOMContentLoaded', ReURL, true);
window.opera.addEventListener('BeforeExternalScript', function (e) {
	if (e.element.src) {
		for (var j = 0; j < res.length; j++) {
			if (e.element.src.indexOf(res[j]) > -1) {
				e.element.src = e.element.src.replace(res[j], repl[j]);
			}
		}
	}
}, false);
	var res = ["http://webcache.googleusercontent.com"];
	var repl = ["https://webcache.googleusercontent.com"];
	res.push("http://twitter.com");repl.push("https://twitter.com");
	res.push("http://t.sina.com.cn");repl.push("http://t.sina.cn");
	res.push("weibo.com");repl.push("weibo.cn");
	res.push("http://igfw.net");repl.push("");
function ReURL() {
	var atag = document.getElementsByTagName("a");
	for (var i = 0, l = atag.length; i < l; i++) {
		if (atag[i].href) {
			for (var j = 0; j < res.length; j++) {
				if (atag[i].href.indexOf(res[j]) > -1) {
					atag[i].href = atag[i].href.replace(res[j], repl[j]);
				}
			}
		}
	}
	var atag = document.getElementsByTagName("img");
	for (var i = 0, l = atag.length; i < l; i++) {
		if (atag[i].src) {
			for (var j = 0; j < res.length; j++) {
				if (atag[i].src.indexOf(res[j]) > -1) {
					atag[i].src = atag[i].src.replace(res[j], repl[j]);
				}
			}
		}
	}
	var atag = document.getElementsByTagName("link");
	for (var i = 0, l = atag.length; i < l; i++) {
		if (atag[i].href) {
			for (var j = 0; j < res.length; j++) {
				if (atag[i].href.indexOf(res[j]) > -1) {
					atag[i].href = atag[i].href.replace(res[j], repl[j]);
				}
			}
		}
	}
}

