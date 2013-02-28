// ==UserScript==
// @name		快速引用 OperaChina 专用版
// @description	快速引用框选的内容或整个回复
// @date		2010.01.24
// @include		http://bbs.operachina.com/viewtopic.php?*
// @include		http://oc.ls.tl/viewtopic.php?*
// ==/UserScript==

/*
----------------------- 使用方法 -----------------------
两种方式：
	1. 点击 OC 回复上的引用按钮。

	2. 在 Opera 里调用以下命令，推荐设置为快捷键。
	Go to Page, "javascript:void(document['$UserJS'].quickQuote())"

执行以上的动作，将会快速引用选中的内容或整个帖子（引用按钮所在的帖子或鼠标上次点击的帖子）
----------------------- 使用方法 -----------------------
*/

(function() {

	// ------------------------ 设置项（true 代表启用，false 代表关闭） ------------------------
	var bReplace = true,		// 是否替换原引用按钮的功能为快速引用
		bUserName = true,		// 是否添加用户名
		bTitle = true,			// 是否添加标题
		bPostTime = true;		// 是否添加发表时间
	// ------------------------ 设置项 ------------------------


	document["$UserJS"] = {};

	document["$UserJS"].quickQuote = function () {
		var oDivPost = document["$UserJS"].lastClicked.selectSingleNode("ancestor-or-self::div[@class='post postbg']");

		if (!oDivPost) {
			alert("请框选一些内容或点击相应帖子后，再使用快速引用");
			return;
		}

		/* 获取内容 */
		var txt = getContent(oDivPost);

		/* 获得附加信息 */
		var oPreQuote = preQuote(oDivPost);

		/* 将内容写入回复框 */
		setTextarea(txt, oPreQuote);
	}

	/* ------------------------ 以下是函数 ------------------------ */
	function preQuote(oDivPost) {
		var oPreQuote = {
			"userName": "",
			"titleLink": "",
			"postTime": ""
		};
		if (bUserName) {
			oPreQuote.userName = getUserName(oDivPost);
		}
		if (bTitle) {
			oPreQuote.titleLink = getAnchor(oDivPost);
		}
		if (bPostTime) {
			oPreQuote.postTime = getPostTime(oDivPost);
		}
		return oPreQuote;
	}

	function getAnchor(oDivPost) {
		var titleLink = oDivPost.selectSingleNode("div[@class='postbody']/h3/a");
		if (!titleLink) {
			return;
		}
		titleLink = titleLink.cloneNode(true);
		var aArg = titleLink.href.match(/^(http:\/\/.*php)(\?f=\d+)(&t=\d+)(&start=\d+)?.*(#p\d+)$/);
		if (aArg) {
			var sHref = "";
			if (!aArg[4]) {
				aArg[4] = "&start=" + Math.floor(titleLink.textContent.match(/#(\d+)/)[1] / 20)*20;
				if (aArg[4] === "&start=0") {
					aArg[4] = "";
				}
			}
			for (var i = 1, iLength=aArg.length; i < iLength; i++) {
				if (aArg[i]) {
					sHref+= "" + aArg[i];
				}
			}
			titleLink.href = sHref;
		}
		return titleLink;
	}

	function getPostTime(oDivPost) {
		var oPostProfile = oDivPost.selectNodes("dl[@class='postprofile']/dd");
		if (!oPostProfile) {
			return;
		}
		for (var i = oPostProfile.length - 1; i >= 0; i--) {
			if (!oPostProfile[i]) {
				continue;
			}
			if (oPostProfile[i].textContent.indexOf("发表时间") !== -1) {
				var postTime = oPostProfile[i].textContent;
				break;
			}
		}
		return postTime;
	}

	function getUserName(oDivPost) {
		var userLink = oDivPost.selectSingleNode("dl[@class='postprofile']//a[contains(@href,'/memberlist.php?mode=viewprofile&u=')]");
		if(!userLink) {
			return;
		}
		var userName = userLink.textContent;
		return userName;
	}

	/* 获取内容 */
	function getContent(oDivPost) {
		var oSel = document.createElement("div");
		if (document.getSelection()) {
			oSel.appendChild(window.getSelection().getRangeAt(0).cloneContents());
		} else {
			oSel.appendChild(oDivPost.selectSingleNode("div/div[@class='content']").cloneNode(true));
		}

		var oElements = oSel.getElementsByTagName("*");
		for (var i = 0, oE; oE = oElements[i]; i++)
		{
			switch (oE.nodeName) {
				case "A":
					var sHRef = oE.href;
					if (sHRef) {
						if (oE.className && /\bbml\b/.test(oE.className)) {
							oE.parentNode.insertBefore(document.createTextNode("[bml=" + sHRef.replace(/\[/g, "%5B").replace(/\]/g, "%5D") + "]"), oE);
							insertAfter(document.createTextNode("[/bml]"), oE);
						} else if (sHRef.indexOf("opera:") === 0) {
							if (sHRef.indexOf("opera:/button/") === 0) {
								oE.innerHTML = "[opbut=" + decodeURIComponent(sHRef.match(/^opera:\/button\/(.*)$/)[1]).replace(/\[/g, "%5B").replace(/\]/g, "%5D") + "]" + oE.innerHTML + "[/opbut]";
							} else if (sHRef.indexOf("opera:illegal-url-") === 0) {
								oE.innerHTML = "[url]" + oE.innerHTML + "[/url]";
							} else if (sHRef.indexOf("opera:config") === 0 && sHRef.indexOf("#") !== -1 && sHRef.split("#")[1] === oE.innerText) {
								oE.innerHTML = "[cfg]" + oE.innerHTML + "[/cfg]";
							} else if (sHRef === oE.textContent){
								oE.innerHTML = "[config]" + oE.innerHTML + "[/config]";
							} else {
								oE.innerHTML = "[config=" + sHRef + "]" + oE.innerHTML + "[/config]";
							}
						} else if (oE.getAttribute("href").indexOf("#") === 0) {
							oE.innerHTML = "[ab=" + oE.getAttribute("href").slice(1) + "]" + oE.innerHTML + "[/ab]";
						} else if (/^http:\/\/bbs\.operachina\.com\/memberlist\.php\?mode=viewprofile&un=[^&]+$/.test(sHRef)) {
							oE.innerHTML = "[username]" + oE.innerHTML + "[/username]";
						} else if (/^ftp|https?:\/\//.test(sHRef)){
							oE.innerHTML = "[url=" + sHRef + "]" + oE.innerHTML + "[/url]";
						} else {
							oE.innerHTML = "[config=" + sHRef + "]" + oE.innerHTML + "[/config]";
						}
					} else if (oE.name && oE.id && oE.name === oE.id ) {
						oE.innerHTML = "[aa=" + oE.name + "]" + oE.innerHTML + "[/aa]";
					}
					break;
				case "ACRONYM":
					oE.innerHTML = "[acronym=" + oE.title + "]" + oE.innerHTML + "[/acronym]";
					break;
				case "BR":
					oE.innerHTML = "\n";
					break;
				case "SPAN":
					if (oE.hasAttribute("style")) {
						if (oE.style.color) {
							oE.innerHTML = "[color=" + oE.style.getPropertyValue("color") + "]" + oE.innerHTML + "[/color]";
						} else if (oE.style.fontSize) {
							oE.innerHTML = "[size=" + oE.style.getPropertyValue("font-size").split("%")[0] + "]" + oE.innerHTML + "[/size]";
						} else if (oE.style.fontFamily) {
							oE.innerHTML = "[font=" + oE.style.getPropertyValue("font-family") + "]" + oE.innerHTML + "[/font]";
						} else if (oE.style.fontWeight === 700) {
							oE.innerHTML = "[b]" + oE.innerHTML + "[/b]";
						} else if (oE.style.fontStyle === "italic") {
							oE.innerHTML = "[i]" + oE.innerHTML + "[/i]";
						} else if (oE.style.textDecoration === "underline") {
							oE.innerHTML = "[u]" + oE.innerHTML + "[/u]";
						} else if (oE.style.textDecoration === "blink") {
							oE.innerHTML = "[blink]" + oE.innerHTML + "[/blink]";
						} else if (oE.style.backgroundImage && oE.style.backgroundImage.indexOf("-o-skin(") !== -1) {
							oE.innerHTML = "[icon]" + oE.style.backgroundImage.match(/-o-skin\(\x22(.*)\x22\)/)[1] + "[/icon]";
						} else if (oE.style.textShadow) {
							oE.innerHTML = "[shadow=" + oE.style.cssText.split(":")[1].replace(/ /g, ",").replace(/px/g, "") + "]" + oE.innerHTML + "[/shadow]";
						}
					}
					break;
				case "DIV":
					if (oE.className === "oc_label") {
						var oLegend = oE.selectSingleNode("fieldset/legend");
						oLegend.parentNode.removeChild(oLegend);
						oE.innerHTML = "[label=" + oLegend.textContent + "]" + oE.innerHTML + "[/label]";
					} else if (oE.className === "syntax") {
						var sSyntax = oE.selectSingleNode("div/b") && oE.selectSingleNode("div/b").textContent;
						var sContent = oE.selectSingleNode("div/div|div/ol");
						if (sContent) {
							sContent.innerHTML = sContent.innerHTML.replace(/<BR>/ig, "");
							sContent = sContent.textContent.slice(0, -2);
						}
						oE.innerHTML = "[syntax=\x22" + sSyntax + "\x22]\n" + sContent + "\n[/syntax]";
					} else if (oE.className === "inline-attachment") {
						oE.innerHTML = oE.innerHTML.replace(/\t+|\n/g, "");
					} else if (oE.className === "shell") {
						oE.innerHTML = "[shell]" + oE.innerHTML + "[/shell]";
					} else if (oE.className === "sign") {
						oE.innerHTML = "[sign]" + oE.innerHTML + "[/sign]";
					} else if (oE.className === "rules") {
						oE.innerHTML = "[important]" + oE.innerHTML.match(/<\/SPAN>([\s\S]+)<SPAN class="corners-bottom"/, "")[1].replace(/\s+$/, "") + "[/important]";
					} else if (oE.hasAttribute("style")) {
						if (oE.style.background === "#ffffee") {
							oE.innerHTML = "[acode]" + oE.innerHTML + "[/acode]";
						} else if (oE.style.border === "1px solid #eeeeee") {
							oE.innerHTML = "[ibox=" + oE.style.background.slice(5, -2) + "]" + oE.innerHTML + "[/ibox]";
						} else if (oE.style.textAlign) {
							oE.innerHTML = "[" + oE.style.textAlign + "]" + oE.innerHTML + "[/" + oE.style.textAlign + "]";
						} else {
						oE.innerHTML = "[divstyle=" + oE.getAttribute("style") + "]\n" + oE.innerHTML + "\n[/divstyle]";
						}
					}
					break;
				case "DT":
					oE.innerHTML += "\n";
					break;
				case "DD":
					oE.innerHTML = "[color=#666666]" + oE.innerHTML + "[/color]\n";
					break;
				case "UL":
					oE.innerHTML = "[list]\n" + oE.innerHTML + "\n[/list]\n";
					break;
				case "OL":
					var sType = "";
					switch (oE.style.listStyleType) {
						case "decimal":
							sType = "1";
							break;
						case "lower-alpha":
							sType = "a";
							break;
						case "upper-alpha":
							sType = "A";
							break;
						case "lower-roman":
							sType = "i";
							break;
						case "upper-roman":
							sType = "I";
							break;
					}
					oE.innerHTML = '[list=' + sType + ']\n' + oE.innerHTML + '\n[/list]\n';
					break;
				case "LI":
					oE.innerHTML = "[*]" + oE.innerHTML;
					if (oE.nextSibling.nodeType === Node.ELEMENT_NODE && oE.nextSibling.nodeName === "LI") {
						oE.innerHTML += "\r\n";
					}
					break;
				case "BLOCKQUOTE":
					if (oE.className === "uncited") {
						oE.innerHTML = "[quote]" + oE.innerHTML + "[/quote]";
					} else if (oE.style && oE.style.background === "#ffffee") {
						oE.innerHTML = "[aquote]" + oE.innerHTML + "[/aquote]";
					} else {
						oE.innerHTML = "[quote=\x22" + oE.getElementsByTagName("cite")[0].textContent.split(" ")[0] + "\x22]" + oE.firstElementChild.innerHTML.replace(/^<CITE>.+?<\/CITE>/, "") + "[/quote]";
					}
					break;
				case "B":
				case "I":
				case "U":
				case "CODE":
				case "DEL":
				case "TH":
				case "TD":
				case "PRE":
				case "SUB":
				case "SUP":
					var sTagNameL = oE.nodeName.toLowerCase();
					oE.innerHTML = "[" + sTagNameL + "]" + oE.innerHTML + "[/" + sTagNameL + "]";
					break;
				case "TABLE":
					var sTagNameL = oE.nodeName.toLowerCase();
					oE.innerHTML = "\n[" + sTagNameL + "]" + oE.innerHTML + "\n[/" + sTagNameL + "]";
					break;
				case "TR":
					var sTagNameL = oE.nodeName.toLowerCase();
					oE.innerHTML = "\n[" + sTagNameL + "]" + oE.innerHTML + "[/" + sTagNameL + "]";
					break;
				case "EM":
					oE.innerHTML = "[i]" + oE.innerHTML + "[/i]";
					break;
				case "STRONG":
					oE.innerHTML = "[b]" + oE.innerHTML + "[/b]";
					break;
				case "HR":
					oE.innerHTML = "[hr][/hr]";
					break;
				case "IMG":
					if (oE.alt && oE.alt.search(/:.+:/) === 0) {
						oE.innerHTML = oE.alt;
					} else {
						oE.innerHTML = "[img]" + oE.src + "[/img]";
					}
					break;
				case "EMBED":
					if (/wmv$/.test(oE.src)) {
						oE.innerHTML = "[wmv]" + oE.src + "[/wmv]"
					} else if (/player\.swf$/.test(oE.src)) {
						oE.innerHTML = "[video=" + oE.width + "," + oE.height + "," + oE.parentNode.id.replace("preview", "") + "]" + oE.getAttribute("flashvars").split(/=|&/)[1] + "[/video]"
					}
					break;
				case "OBJECT":
					if (oE.data) {
						if (oE.data.indexOf("http://bbs.operachina.com/") === 0) {
							oE.innerHTML = "[audio]" + oE.children[1].value.split("soundFile=")[1] + "[/audio]";
						}
						else if (oE.data.indexOf("http://player.youku.com/") === 0) {
							oE.innerHTML = "[youku]" + oE.data.match(/\/sid\/(.*)\/v.swf$/i)[1] + "[/youku]";
						}
						else if (oE.data.indexOf("http://www.youtube.com/") === 0) {
							oE.innerHTML = "[youtube]" + oE.data.split("/v/")[1] + "[/youtube]";
						}
						else if (oE.data.indexOf("http://video.google.com/") === 0) {
							oE.innerHTML = "[googlevideo]" + oE.data.split("docId=-")[1] + "[/googlevideo]";
						}
						else if (oE.data.indexOf("http://vhead.blog.sina.com.cn/") === 0) {
							oE.innerHTML = "[sinavideo]" + oE.data.replace(/.*&vid=(\d+)&uid=(\d+).*/, "$1-$2") + "[/sinavideo]";
						}
						else if (oE.data.indexOf("http://www.tudou.com/") === 0) {
							oE.innerHTML = "[tudou]" + oE.data.split("/v/")[1] + "[/tudou]";
						}
					}
					break;
				case "SCRIPT":
					oE.innerHTML = "";
					break;
			}
		}
		return oSel.textContent.replace(/\r|\n$/g, "");
	}

	function setTextarea(sText, oPreQuote) {
		if (!sText || !oPreQuote) {
			return;
		}
		var oTextArea = document.getElementById("message");
		if (!oTextArea) {
			alert("找不到回复框。");
			return;
		}

		var sUserName = oPreQuote.userName ? "=\"" + oPreQuote.userName + "\"" : "";
		var sPre = "";
		if ( oPreQuote.titleLink && oPreQuote.postTime ) {
			var sPre = "[size=85][url=" + oPreQuote.titleLink.href + "][color=#666666]" + oPreQuote.titleLink.textContent + " —— " + oPreQuote.postTime + "[/color][/url][/size]\n\n";
		} else if (oPreQuote.titleLink) {
			var sPre = "[size=85][url=" + oPreQuote.titleLink.href + "][color=#666666]"  + oPreQuote.titleLink.textContent + "[/color][/url][/size]\n\n";
		} else if (oPreQuote.postTime) {
			var sPre = "[size=85][color=#666666]" + oPreQuote.postTime + "[/color][/size]\n\n";
		}

		sText = "[quote" + sUserName + "]\n" +
				sPre +
				sText + "\n" +
				"[/quote]\n";
		var iRows = sText.split("\n").length;

		if (oTextArea.rows < 25) {
			oTextArea.rows + iRows <= 25 ? oTextArea.rows += iRows : oTextArea.rows = 25;
		};

		oTextArea.focus();

		var iStart = oTextArea.selectionStart,
			iEnd = oTextArea.selectionEnd;

		oTextArea.value = oTextArea.value.slice(0, iStart) + sText + oTextArea.value.slice(iEnd);
		oTextArea.setSelectionRange(iEnd + sText.length + iRows, iEnd + sText.length + iRows);
	}

	function insertAfter(oNew, oTarget)
	{
		var oParent = oTarget.parentNode;
		oTarget = oTarget.nextSibling;
		if (oTarget) {
			oParent.insertBefore(oNew, oTarget);
		} else {
			oParent.appendChild(oNew);
		}
	}

	// ------------------------------ 点击引用按钮则快速引用 ------------------------------
	if (bReplace) {
		document.addEventListener("click", function (oEvent) {
			var oClicked = oEvent.target;
			if (oClicked.nodeName === "A" && oClicked.title === "引用回复") {
				document["$UserJS"].quickQuote();
				oEvent.preventDefault();
			}
		}, false);
	}
	// ------------------------------ 点击引用按钮则快速引用 ------------------------------

	// ------------------------------ 记录上次点击的元素 ------------------------------
	document["$UserJS"].lastClicked = document.body;
	window.opera.addEventListener("BeforeEvent.mousedown", function (oEvent) {
		document["$UserJS"].lastClicked = oEvent.event.target;
	}, false);
})();

window.addEventListener(
	'DOMContentLoaded',
	function(){
	/*---------------------------------功能：在引用按钮后面添加快速引用（直接提交）---------------------------------------*/
		var quoteuls = document.selectNodes('//ul[@class="profile-icons"]');
		for(var i=0,quoteul;quoteul = quoteuls[i];i++){
			var autoquote = document.createElement('li');
			autoquote.setAttribute('class', 'quote-icon');
			autoquote.setAttribute('title', '直接引用并提交');
			autoquote.innerHTML = "<span>直接引用并提交</span>";
			autoquote.addEventListener('click', function(){document['$UserJS'].quickQuote();document.postform.submit();},false);
			quoteul.appendChild(autoquote);
		}
	},false
);

