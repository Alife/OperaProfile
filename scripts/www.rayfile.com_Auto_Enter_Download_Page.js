// ==UserScript==
// @name        RayFile 自动进入下载页面
// @description 读取下载页的链接与文件信息，将文件信息保存到 cookie 里，然后自动跳转到下载页面，且添加文件信息
// @include     http://www.rayfile.com/*/files/*
// ==/UserScript==

// 读取下载页的链接与文件信息，将文件的信息保存到 cookie 里
(function() {
	var bAddFileInfo = true;	// 是否添加文件信息

	if (location.href.search(/\/files\/[^\/\n\r]+\/?$/) != -1) {
		document.addEventListener("DOMContentLoaded", function() {
			var oDownloadPageLink = document.selectSingleNode("//div[contains(@class, 'btn_indown_')]/a");
			if (!oDownloadPageLink) {
				return;
			}

			if (bAddFileInfo) {
				var oFileInfo = document.selectNodes("//div[@id = 'divinfo_1']/div[@class='ndFileinfo_list'][position()<=3]");
				if (!oFileInfo) {
					return;
				}

				var oDiv = document.createElement("div");
				for (var i = 0, sFileInfo = "", iLength = oFileInfo.length; i < iLength; i++) {
					oDiv.appendChild(oFileInfo[i].cloneNode(true));
				}
				document.cookie = "ujs_FileInfo=" + encodeURIComponent(oDiv.innerHTML) + "; max-age=" + 60;
			}

			location.href = oDownloadPageLink.href;
		}, false);
	}

	// 读取 cookie 里的文件信息，添加到下载页面的顶部
	if (bAddFileInfo && location.href.search(/\/files\/[^\/\n\r]+\/[^\/\n\r]+\/?$/) != -1) {
		document.addEventListener("DOMContentLoaded", function() {
			var oDivDownNow = document.getElementById("divdownnow");
			if (!oDivDownNow) {
				return;
			}

			var sFileInfo = document.cookie.match(/(?:; )?ujs_FileInfo=([^;]*);?/);
			if(!sFileInfo) {
				return;
			}

			document.cookie = "ujs_FileInfo=Delete; max-age=0";
			sFileInfo = decodeURIComponent(sFileInfo[1]);

			var oDiv = document.createElement("div");
			oDiv.innerHTML = sFileInfo;

			var oFragment = document.createDocumentFragment();
			for (var i = 0; i < 3; i++) {
				oFragment.appendChild(oDiv.children[0]);
			}
			oDivDownNow.parentNode.insertBefore(oFragment, oDivDownNow);

			var oDiv_nD_fileinfo = document.getElementById("nD_fileinfo");
			var oDiv_ndFileinfo = document.getElementById("ndFileinfo");
			if (!oDiv_nD_fileinfo || !oDiv_ndFileinfo) {
				return;
			}

			oDiv_nD_fileinfo.style.height = oDiv_nD_fileinfo.clientHeight + 80 + "px";
			oDiv_ndFileinfo.style.height = oDiv_ndFileinfo.clientHeight + 90 + "px";

		}, false);
	}
})();
