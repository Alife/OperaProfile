// ==UserScript==
// @include      *bbs.operachina.com/viewtopic.php?*
// @include      *bbs.operachina.com/search.php?*
// @include		 http://oc.ls.tl/*
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function () {
	var oTDs = document.selectNodes("//td[@class='tposts' and (number(substring-before(text(),' ')) mod 20=19 or starts-with(text(),'0'))]");
	for (var i = 0, oTD; oTD = oTDs[i]; i++) {
		oTD.style.color = "red";
	}
	
	//var cat1 = document.body;
	//for(var prop in cat1) { alert("cat1["+prop+"]="+cat1[prop]); }
	
}, false);

window.opera.addEventListener("BeforeScript", function (e) {
	if (e.element.text.indexOf("-->") != -1) {
		e.element.text = e.element.text.replace(/(^\s*)-->/gm, "$1//-->");
	}
}, false);

/*--------------------------------------bbs.operachina.com自定义css，建议用css加载------------------------------------------*/
/*
styleStr = '#headerspace,.title{font-size: 14px !important;}' + 'ul > li{font-size: 13px !important;}' + '.statrow{font-size: 13px !important;}' + 'object[width="290"]{display:none !important;}' + '#page-body > div[class="panel panelbg"]{display:none !important;}';
styleObj = document.createElement('style');
styleObj.innerHTML = styleStr;
document.selectNodes('//head')[0].appendChild(styleObj);
 */

/*-------------------------------------------------------------播放器css----------------------------------------------------------------------*/
musicObjStyle = document.createElement('style');
musicObjStyle.innerHTML = 'object[width="290"]{display:none !important;}' + '#myMusicSwitch:hover,#myMusicDown:hover{background:#33cc00;}' + '#myMusicSwitch,#myMusicDown{margin-right:1em;margin-top:2px;margin-bottom:2px;padding-left:.2em;padding-right:.2em;padding-top:.2em;padding-bottom:.2em;width:auto;cursor:pointer;border:1px solid;background:white;font-size:12px;}' + '#myPlayerSpan,#myPlayer{width:380px;height:45px;opacity:.5;background:white;margin-right:.5em;}';
document.selectNodes('//head')[0].appendChild(musicObjStyle);

window.addEventListener(
	'DOMContentLoaded',
	//'DOMNodeInserted',
	function () {
	/*-----------------------------功能1：替换flash播放器为播放按钮及下载地址-----------------------------*/
	/*此为转化为链接，已过时 =,=!!
	musicFlash = document.selectNodes('//object');
	if(musicFlash != null){
	for(i=0;i<musicFlash.length;i++){
	if(musicFlash[i].width == 290 && musicFlash[i].height == 24){
	musicLink = musicFlash[i].getElementsByTagName('param')[1].value.split('soundFile=')[1];
	//alert(musicLink);
	link = document.createElement('a');
	link.setAttribute("style",
	"background:url(http://i0.sinaimg.cn/bb/index/tech_zty_003.gif)"
	);
	link.href = musicLink;
	link.innerHTML = musicLink;
	//musicLink = '<a href="' + musicLink + '">' + musicLink + '</a>' + '<br />';
	musicFlash[i].parentNode.replaceChild(link,musicFlash[i]);
	}
	}
	}*/
	musicObj = document.selectNodes('//object');
	if (musicObj != null) {
		for (i = 0; i < musicObj.length; i++) {
			if (musicObj[i].width == 290 && musicObj[i].height == 24) {
				musicLink = musicObj[i].getElementsByTagName('param')[1].value.split('soundFile=')[1];
				
				musicDiv = document.createElement('div');
				musicDiv.setAttribute('style', 'margin-top:4px;');
				
				musicSwitch = document.createElement('span');
				musicSwitch.innerHTML = '点击试听';
				musicSwitch.id = 'myMusicSwitch';
				musicDiv.appendChild(musicSwitch);
				
				musicDown = document.createElement('a');
				
				musicDown.href = musicLink;
				musicDown.innerHTML = '下载';
				musicDown.id = 'myMusicDown';
				musicDiv.appendChild(musicDown);
				
				musicSwitch.onclick = 'showPlayer(this)';
				
				musicObj[i].parentNode.replaceChild(musicDiv, musicObj[i]);
			}
		}
	}
	/*--------------------------------------功能2：搜索结果显示为主题--------------------------------------------*/
	showTopicRslt = document.getElementById('show_results2');
	if (showTopicRslt != null)
		showTopicRslt.checked = 'checked';
	/*---------------------------------功能3：快速回复加入猫猫表情选择---------------------------------------*/
	previewBtn = document.selectNodes('//input[@name="preview"]');
	if (previewBtn != null&&previewBtn.length>0) {
		faceBtn = document.createElement('input');
		faceBtn.setAttribute('type', 'button');
		faceBtn.setAttribute('name', 'face');
		faceBtn.setAttribute('class', 'button1');
		faceBtn.setAttribute('value', '表情');
		faceBtn.setAttribute('style', 'width:65px;margin-right:8px;');
		faceBtn.addEventListener('click', function () {
			showFace(this);
		}, false);
		//previewBtn[0].parentNode.insertBefore(faceBtn, previewBtn[0]);
	}
	/*---------------------------功能4：帖子数量后面添加“查看用户发表的主题”-----------------------*/
	profile = document.selectNodes('//dl[@class="postprofile"]');
	if (profile != null) {
		for (i = 0; i < profile.length; i++) {
			post = profile[i].childNodes[6].getElementsByTagName('a')[0];
			postCheck = document.createElement('a');
			postCheck.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIASURBVDjLpVPPaxNREJ6Vt01caH4oWk1T0ZKlGIo9RG+BUsEK4kEP/Q8qPXnpqRdPBf8A8Wahhx7FQ0GF9FJ6UksqwfTSBDGyB5HkkphC9tfb7jfbtyQQTx142byZ75v5ZnZWC4KALmICPy+2DkvKIX2f/POz83LxCL7nrz+WPNcll49DrhM9v7xdO9JW330DuXrrqkFSgig5iR2Cfv3t3gNxOnv5BwU+eZ5HuON5/PMPJZKJ+yKQfpW0S7TxdC6WJaWkyvff1LDaFRAeLZj05MHsiPTS6hua0PUqtwC5sHq9zv9RYWl+nu5cETcnJ1M0M5WlWq3GsX6/T+VymRzHDluZiGYAAsw0TQahV8uyyGq1qFgskm0bHIO/1+sx1rFtchJhArwEyIQ1Gg2WD2A6nWawHQJVDIWgIJfLhQowTIeE9D0mKAU8qPC0220afsWFQoH93W6X7yCDJ+DEBeBmsxnPIJVKxWQVUwry+XyUwBlKMKwA8jqdDhOVCqVAzQDVvXAXhOdGBFgymYwrGoZBmUyGjxCCdF0fSahaFdgoTHRxfTveMCXvWfkuE3Y+f40qhgT/nMitupzApdvT18bu+YeDQwY9Xl4aG9/d/URiMBhQq/dvZMeVghtT17lSZW9/rAKsvPa/r9Fc2dw+Pe0/xI6kM9mT5vtXy+Nw2kU/5zOGRpvuMIu0YAAAAABJRU5ErkJggg==" width="16" height="16" style="margin-left:5px;">';
			postCheck.href = post.href + '&sc=1&sf=firstpost&sr=topics';
			profile[i].childNodes[6].appendChild(postCheck);
		}
	}
	document.forms["postform"].getElementsByTagName("fieldset")[1].insertBefore(document.forms["postform"].all.post, document.forms["postform"].all.face);
}, false);

function showFace(obj) {
	temp = document.getElementById('faceDiv');
	if (temp) {
		temp.parentNode.removeChild(temp);
		return false;
	}
	faceDiv = document.createElement('div');
	faceDiv.id = 'faceDiv';
	faceDiv.setAttribute('style',
		'position:absolute;' +
		'left:' + obj.offsetLeft + 'px;' +
		'top:' + (obj.offsetTop - 310) + 'px;' +
		'width:450px;' +
		'height:400px;' +
		//	'background:-o-skin("Dialog Page Skin");'
		//	'background:-o-skin("Window Skin"); border:1px solid;'
		'background:#FFFEE4;border:1px solid;');
	faceDiv.innerHTML += "<div><img src=\'data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==\' title=\'Close\' width=\'18\' height=\'18\' style=\'position:relative;display:block;float:right;margin:1px;background:-o-skin(\x22Caption Close Button Skin\x22);cursor:pointer;\' onclick=\'this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)\'></div>";
	
	var imgList = '';
	for (i = 1; i <= 26; i++) {
		imgList += '<img src="http://bbs.operachina.com/images/smilies/face/' + i + '.gif" onclick="addToTextArea(this);"/>';
		//if( i % 4 == 0)
		//	imgList += '<br />';
	}
	faceDiv.innerHTML += '<div style="overflow-y:scroll;height:380px;clear:both;">' + imgList + '</div>';
	
	document.body.appendChild(faceDiv);
	//alert(obj.offsetLeft);
	//alert(obj.offsetTop);
}

function addToTextArea(obj) {
	txt = obj.src.match(/\d+/);
	txt = ' :' + txt + ':';
	textArea = document.getElementById('message');
	cursorStart = textArea.selectionStart;
	cursorEnd = textArea.selectionEnd;
	textArea.value = textArea.value.slice(0, cursorStart) + txt + textArea.value.slice(cursorEnd);
	textArea.focus();
	textArea.selectionStart = cursorStart + txt.length;
	textArea.selectionEnd = cursorEnd + txt.length;
}

function showPlayer(theSwitch) {
	songURL = theSwitch.nextSibling.href;
	//alert(songURL);
	playerSpan = document.createElement('span');
	playerSpan.id = 'myPlayerSpan';
	player = document.createElement('embed');
	player.id = 'myPlayer';
	player.type = "application/x-mplayer2";
	player.src = songURL;
	playerSpan.appendChild(player);
	theSwitch.parentNode.replaceChild(playerSpan, theSwitch);
}

document.addEventListener("DOMContentLoaded", function () {
	AddTitleToList();
}, false);

document.addEventListener("scroll", function () {
	AddTitleToList();
}, false);

function AddTitleToList() {
	var oTDs = document.selectNodes("//td[@class='ttitle icon']");
	for (var i = 0, oTD; oTD = oTDs[i]; i++) {
		if (oTD.style.backgroundImage.indexOf("topic_unread.gif") > -1 && oTD.parentElement.title == "") {
			oTD.parentElement.title += "未读！";
		} else if (oTD.style.backgroundImage.indexOf("sticky_unread.gif") > -1 && oTD.parentElement.title == "") {
			oTD.parentElement.title += "置顶！";
		} else if (oTD.style.backgroundImage.indexOf("topic_unread_hot.gif") > -1 && oTD.parentElement.title == "") {
			oTD.parentElement.title += "热门！";
		} else if (oTD.style.backgroundImage.indexOf("topic_read.gif") > -1 && oTD.parentElement.title == "") {
			oTD.parentElement.title += "已读！";
		} else if (oTD.style.backgroundImage.indexOf("announce_unread.gif") > -1 && oTD.parentElement.title == "") {
			oTD.parentElement.title += "公告！";
		} else if (oTD.style.backgroundImage.indexOf("topic_unread_locked.gif") > -1 && oTD.parentElement.title == "") {
			oTD.parentElement.title += "锁定！";
		}
	}
}
if(typeof(jQuery)!='undefined'){
	jQuery(document).ready(function () {
		jQuery("small.ua").each(function(){if(jQuery(this).html().indexOf("mini")>-1){jQuery(this).css("color","red")}});
	});
}
