// ==UserScript==
// @name        Brsbox 自动进入下载页面
// @include     http://www.brsbox.com/filebox/down/fc/*
// ==/UserScript==

if (location.href.search(/\/fc\/[^\/\n\r]+\/?$/) != -1) {
	document.addEventListener(
		"DOMContentLoaded",
		function() {
			var oDownloadPageLink = document.selectSingleNode("//div[@id='down_area_0']/a");
			if (!oDownloadPageLink) {
				alert("Can't get oDownloadPageLink");
				return;
			}
			location.href = oDownloadPageLink.href;

		},
		false
	);
}