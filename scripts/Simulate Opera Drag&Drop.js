// ==UserScript==
// @description 模拟 Opera 的拖拽功能
// @exclude http://ditu.google.cn/*
// @exclude http://maps.google.com/*
// ==/UserScript==

(function () {
	// 本脚本只运行在 Opera 10.5 及更高的版本上
	if (opera.version() < 10.5) {
		return;
	}

	/* ------------------------ 设置 ------------------------ */
	var bBackground = false,	// 是否后台打开链接
		iThresholdX = 5,		// 在链接上按住鼠标，横向移动超过这个值（像素），则判断为选择文字
		iThresholdY = 5;		// 在链接上按住鼠标，竖向移动超过这个值（像素），则判断为拖拽链接
	/* ------------------------ 设置 ------------------------ */

	var iX, iY, iOffsetX, iOffsetY, oClicked, oClicked_Copy;

	var bDrag = false;

	var oStyle = document.createElement("style");
	oStyle.type = "text/css";

	document.addEventListener("mousedown", startDrag, true);

	// 如果鼠标点击指向的是 Opera 按钮链接或 JS 链接，则暂时取消模拟拖拽，使链接可以拖拽到 Opera 的工具栏上
	document.addEventListener("mouseover", pauseDrag, false);

	function startDrag(oEvent) {
		if (oEvent.button === 0) {
			oClicked = oEvent.target.selectSingleNode("ancestor-or-self::a[@href] | self::img[@src] | ancestor-or-self::area[@href]");
			if (oClicked) {
				// opera.postError("Start");
				iX = oEvent.clientX;
				iY = oEvent.clientY;

				// iOffsetX = oEvent.offsetX;
				iOffsetX = iX - oClicked.offsetLeft;
				iOffsetY = oEvent.offsetY;

				document.addEventListener("mousemove", dragging, true);
				document.addEventListener("mouseup", drop, true);
				window.addEventListener("blur", stopDrag, true);
				// 按 ESC 键取消拖拽
				document.addEventListener("keydown", cancel, true);
			}
		}
	}

	function dragging(oEvent) {
		// opera.postError("X: " + oEvent.pageX + " Y: " + oEvent.pageY);

		if (!bDrag) {
			// 选择文字
			if (Math.abs(oEvent.clientX - iX) > iThresholdX) {
				stopDrag();

			// 拖拽链接
			} else if (Math.abs(oEvent.clientY - iY) > iThresholdY) {
				bDrag = true;

				// 复制链接节点，用于模拟拖拽效果
				oClicked_Copy = oClicked.cloneNode(true);
				oClicked_Copy.removeAttribute("href");
				var oClickedStyle = oClicked_Copy.style;
				oClickedStyle.position = "absolute";
				oClickedStyle.zIndex = "65535";
				oClickedStyle.width = oClicked.scrollWidth +"px";
				oClickedStyle.height = oClicked.scrollHeight + "px";
				oClickedStyle.opacity = 0.5;
				oClickedStyle.left = oEvent.pageX - iOffsetX;
				oClickedStyle.top = oEvent.pageY - iOffsetY;
				oClicked.parentNode.appendChild(oClicked_Copy);

				// 改变鼠标样式
				oStyle.innerText = "* {cursor: move !important;}";
				document.getElementsByTagName("head")[0].appendChild(oStyle);
			}
		} else if (oClicked_Copy) {
			// 链接跟随鼠标移动
			oClicked_Copy.style.left = oEvent.pageX - iOffsetX + "px";
			oClicked_Copy.style.top = oEvent.pageY - iOffsetY + "px";

			// 清除选中的内容（不知如何避免选中内容……）
			var oSelection = window.getSelection();
			if (oSelection.rangeCount) {
				oSelection.removeAllRanges();
			}
		}
	}

	function drop(oEvent) {
		// opera.postError("Drop");
		var sURL = "";
		if (oClicked.href) {
			sURL = oClicked.href;
		} else if (oClicked.src) {
			sURL = oClicked.src;
		}
		if (bDrag && sURL.indexOf("javascript:") !== 0) {
			if (bBackground) {
				window.open(sURL);
				window.focus();
			} else {
				window.open(sURL).focus();
			}
		}
		stopDrag();
	}

	function stopDrag() {
		// opera.postError("Stop");
		document.removeEventListener("mousemove", dragging, true);
		document.removeEventListener("mouseup", drop, true);
		window.removeEventListener("blur", stopDrag, true);
		document.removeEventListener("keydown", cancel, true);

		bDrag = false;

		if (oClicked_Copy) {
			oClicked.parentNode.removeChild(oClicked_Copy);
			oClicked = oClicked_Copy = null;
			oStyle.textContent = "* {cursor: default !important;}";
			setTimeout(function () {document.getElementsByTagName("head")[0].removeChild(oStyle);}, 1);
		}
	}

	function cancel(oEvent) {
		if (oEvent.keyCode === 27) {
			stopDrag();
		}
	}

	function pauseDrag(oEvent) {
		var oA = oEvent.target.selectSingleNode("ancestor-or-self::a[@href]");
		if (oA && /^(?:opera:\/(?:button|edit)|javascript:)/.test(oA.href)) {
			document.removeEventListener("mousedown", startDrag, true);
			oEvent.target.addEventListener("mouseout", function(){
				document.addEventListener("mousedown", startDrag, true);
				oEvent.target.removeEventListener("mouseout", arguments.calee, true);
			}, true);
		}
	}
})();