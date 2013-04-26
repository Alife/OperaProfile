// 自动代理被墙的网址，其中Google会自动跳转到自己的https服务
if (location.hostname == "localhost" ||
	location.hostname == "127.0.0.1" ||
	location.href.indexOf('://192.168') > -1 ||
	location.href.indexOf('://10.') > -1 ||
	location.href.indexOf('webproxy.appspot.com') > -1) {}
else {
	document.addEventListener("DOMContentLoaded", function () {
		var H1 = document.getElementsByTagName("H1");
		var redirectUrl;
		if (document.body.innerHTML == '' ||
			document.body.innerHTML == '<PRE>' ||
			H1.length > 0 && (
				H1[0].innerHTML == '连接被远程服务器关闭' ||
				H1[0].innerHTML == '无法连接远程服务器' ||
				H1[0].innerHTML == 'ERROR' ||
				H1[0].innerHTML == 'Connection closed by remote server' ||
				H1[0].innerHTML == '网络故障')) {
			if (location.hostname == "webcache.googleusercontent.com" ||
			location.hostname.indexOf("www.google.com") > -1) {
				redirectUrl= location.href.replace(/^http:/, 'https:').replace('hl=en', 'hl=zh-cn').replace('www.google', 'encrypted.google');
			} else {
				redirectUrl = location.href.replace(/^https?:\/\/(www\.)?(.*\.*)/, 'https://opera-webproxy.appspot.com/$2');
			}
			location.href = redirectUrl
			//	}
		}
	}, false);
}

// Google 图片搜索中显示原网站图片
if (/^https?:\/\/\w{2,6}\.google(?:\.[^\.]{1,4}){1,2}\/images\?/i.test(location.href)) {
	window.addEventListener(
		"load",
		function (e) {
		var imgAs = document.getElementById("imgtb").getElementsByTagName("a");
		for (var i = imgAs.length - 1; i >= 0; i--) {
			var imgA = imgAs[i];
			var img = imgA.getElementsByTagName("img");
			if (img.length > 0) {
				var imgsrc = getQueryString("imgurl", imgA.href);
				img[0].src = imgsrc;
				//img[0].addEventListener("load",function(){this.style.borderColor ="red";},false);
				
				// var oXHR = new XMLHttpRequest();
				// oXHR.open('GET', imgsrc, true);
				// oXHR.setRequestHeader('Referer',imgsrc);
				// oXHR.onreadystatechange = function() {
				// if (this.readyState === 4 && this.status === 200) {
				// alert(this.getAllResponseHeaders());
				// img[0].src=xmlHttp.responseText;
				// }
				// };
				// oXHR.send(null);
			}
		}
	},
		false);
	
};

function showTextArea() {
	var textarea = document.createElement('textarea');
	textarea.id = 'textarea';
	textarea.style.width = "60%";
	textarea.rows = "20";
	if (document.body) {
		document.body.appendChild(textarea);
	}
	var Button = document.createElement('input');
	Button.id = 'Button';
	Button.value = '减肥';
	Button.type = "Button";
	Button.addEventListener("click", function () {
		deleteDefaultForOpera()
	}, false);
	if (document.body) {
		document.body.appendChild(Button);
	}
};

function deleteDefaultForOpera() {
	var lines = document.getElementById("textarea").value.split("\n");
	var result = "",
	defaultValues = "";
	var section = "",
	sectionLine;
	var resultAddNum = 0;
	for (var i = 0, linesLength = lines.length; i < linesLength; i++) {
		var keyword = "",
		value = "",
		line = lines[i].Trim();
		if (line != "") {
			if (line.indexOf('[') == 0) {
				// 如果某个section下面的keyword全部都被删除则删除该section
				// resultAddNum = 2 是因为 result 拼接了当前section字段和该section最后的换行
				if (resultAddNum == 2) {
					result = result.replace(sectionLine + "\n", "");
				}
				sectionLine = line;
				section = line.substring(1, line.indexOf(']')).Trim();
				resultAddNum = 0;
			} else if (line.split('=').length == 2) {
				keyword = line.split('=')[0].Trim();
				value = line.split('=')[1].Trim();
			}
		}
		
		if (section && keyword && value && opera.getPreferenceDefault(section, keyword) == value) {
			defaultValues += keyword + "=" + value + "\n";
		} else {
			result += line + "\n";
			resultAddNum++;
		}
	}
	// 替换最后一个空 section 。因为已经循环完毕
	if (resultAddNum == 2) {
		result = result.replace(sectionLine + "\n", "");
	}
	alert("以下是被清除的默认字段 \n\n" + defaultValues);
	alert("以下是清除默认字段后新生成的配置\n请拷贝后，先关闭opera然后复制到operaprefs.ini中（注意提前备份您的operaprefs.ini） \n\n" + result);
};
//showTextArea();
//document.addEventListener("DOMContentLoaded",function(e) {showTextArea();},false);


document.addEventListener("DOMContentLoaded",function(e) {
	//alert(document.qSelectorAll('a[href$="9729"][class="xw1"]')[0].parentNode.parentNode.parentNode.querySelector('div>p font').innerHTML);
},false);

