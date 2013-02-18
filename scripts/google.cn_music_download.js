// ==UserScript==
// @description	direct download google music
// @include		http://www.google.cn/music/artist?id=*
// @include		http://www.google.cn/music/album?id=*
// @include		http://www.google.cn/music/top100/musicdownload?id=*
// @include		http://g.top100.cn/*/html/download.html?id=*
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function () {
	if (location.pathname.match(/\/artist|\/album/)) {
		var oIFrame = document.createElement("iframe");
		oIFrame.width = "0";
		oIFrame.height = "0";
		oIFrame.frameBorder = "no";
		document.body.appendChild(oIFrame);

		document.addEventListener("click", function (oEvent) {
			var sID = "";
			var oLink = oEvent.target.selectSingleNode("ancestor-or-self::a[@title='下载']");
			if (oLink) {
				sID = oLink.getAttribute("onclick").match(/id%3D([^\\]+)/)[1];
				oIFrame.src = "./top100/musicdownload?id=" + sID;
				oEvent.stopPropagation();
			}
		}, true);

	} else if (location.hostname == "g.top100.cn") {
		setTimeout(function () {
			location.replace(document.getElementById("download-iframe").src);
		}, 1);
	} else if (location.pathname.indexOf("/top100") !== -1) {
		document.body.onload = null;
		var sHRef = document.selectSingleNode("//div[@class='download']/a").href;
		location.replace(sHRef);
	}
}, false);