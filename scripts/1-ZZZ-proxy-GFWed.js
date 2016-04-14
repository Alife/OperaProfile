// ==UserScript==
// @name 	
// @description 
// @author	lk
// ==/UserScript==

// 自动代理被墙的网址，其中Google会自动跳转到自己的https服务
(function() {

if (!(["localhost","127.0.0.1"].indexOf(location.host)>-1 || 
	location.host.startWith('192.168')||location.host.startWith('10.')||
	location.host.startWith('proxy.piratenpartij.nl'))){
	document.addEventListener("DOMContentLoaded", function () {
		var url_https,url_cache,url_proxy;
		var proxy = "https://proxy.piratenpartij.nl/%url";
		var url=decodeURI(location.href);
		var H1 = document.getElementsByTagName("H1");
		if(["错误!","503 Service Unavailable"].indexOf(document.title)==-1)return;
		if(H1.length==0)return;
		if(["无法连接代理服务器。访问被拒绝"].indexOf(H1[0].innerHTML)>-1)return;
		//if(["","<PRE>"].indexOf(document.body.innerHTML)==-1)return;
		//if(["连接被远程服务器关闭","无法连接远程服务器","网络故障","无法完成安全事务","Connection closed by remote server","ERROR"].indexOf(H1[0].innerHTML)==-1)return;
		url=decodeURI(url);
		// https <==> http
		url_https=url.indexOf("http:")==0?url.replace(/^http:/, 'https:'):url.replace(/^https:/, 'http:');
		jQuery("<li><a href='"+url_https+"'>"+url_https+"</a></li>").insertBefore("ul>li:first");
		// Cache
		url_cache="https://webcache.googleusercontent.com/search?q=cache:"+url;
		jQuery("<li><a href='"+url_cache+"'>"+url_cache+"</a></li>").insertAfter("ul>li:first");
		// proxy			
		if (["webcache.googleusercontent.com","www.google.com"].indexOf(location.host)> -1)
			url_cache= url.replace(/^http:/, 'https:');
		else url_proxy = url.replace(/^https?:\/\/(www\.)?(.*\.*)/, proxy.replace("%url","$2"));
		jQuery("<li><a href='"+url+"'>"+url+"</a></li>").insertAfter("ul>li:first");
		
		debugger;return;
		jQuery.get(url_https)
		.success(function() {
			location.href=url_https;
		})
		.error(function() {
			location.href=url_cache;
		});

	}, false);
} 

// Google 图片搜索中显示原网站图片
if (/^https?:\/\/\w{2,6}\.google(?:\.[^\.]{1,4}){1,2}\/search\?/i.test(location.href)) {
	document.addEventListener("DOMContentLoaded",function (e) {
		var imgAs = document.querySelectorAll("#rg a");
		for (var i = imgAs.length - 1; i >= 0; i--) {
			imgAs[i].addEventListener("mouseover",function (e) {
				var imgA = this;var img = imgA.getElementsByTagName("img");
				if (img.length > 0) {img=img[0];var imgsrc = getQueryString("imgurl", imgA.href);
					if(imgsrc=="")imgsrc=getQueryString("imgurl", imgA.getAttribute("oldhref"));
					if(img.src!=imgsrc){
						img.removeAttribute("onload");img.onload="";
						img.src = imgsrc;img.style.border="1px solid red";
							img.style.width=(imgA.clientWidth-2)+"px";
							img.style.height=(imgA.clientHeight-2)+"px";
							img.style.margin=0;
						imgA.setAttribute("oldhref", imgA.href);
						imgA.href=getQueryString("imgrefurl", imgA.href);
						/* var oXHR = new XMLHttpRequest();oXHR.open('GET', imgsrc, true);
						oXHR.setRequestHeader('Referer',imgsrc);
						oXHR.onreadystatechange = function() {if (this.readyState === 4 && this.status === 200) {
							console.log("onreadystatechange");img.src = imgsrc;
							img.style.border="1px solid green";
						}};
						oXHR.onerror = function() {
							img.style.border="1px solid red";
							img.style.width=(imgA.clientWidth-2)+"px";
							img.style.height=(imgA.clientHeight-2)+"px";
							img.style.margin=0;
						};
						oXHR.send(null); */
					}
				}
			},false);
		}
	},false);
};

// delete default value from operaprefs.ini
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

})();
