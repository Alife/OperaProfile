
// 说明：Javascript 获取链接(url)参数的方法
function getQueryString(name, href) {
	// 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
	if (href.indexOf("?") == -1 || href.indexOf(name + '=') == -1) {
		return '';
	}
	// 获取链接中参数部分
	var queryString = href.substring(href.indexOf("?") + 1);
	// 分离参数对 ?key=value&key2=value2
	var parameters = queryString.split("&");
	var pos,
	paraName,
	paraValue;
	for (var i = 0; i < parameters.length; i++) {
		// 获取等号位置
		pos = parameters[i].indexOf('=');
		if (pos == -1) {
			continue;
		}
		// 获取name 和 value
		paraName = parameters[i].substring(0, pos);
		paraValue = parameters[i].substring(pos + 1);
		// 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
		if (paraName == name) {
			return unescape(paraValue.replace(/\+/g, " "));
		}
	}
	return '';
};

if(typeof(jQuery)!='undefined'){
	if(!document.querySelector){
		HTMLDocument.prototype.querySelector = function(str) {
			return jQuery(str)[0];
		}
		HTMLElement.prototype.querySelector = function(str) {
			return jQuery(str)[0];
		}
	}
	// qSelectorAll 重命名,否则与 jQuery 会发生循环调用
	HTMLDocument.prototype.qSelectorAll = function(str) {
		if(document.querySelectorAll) return document.querySelectorAll(str);
		else return jQuery.makeArray(jQuery(str));
	}
	HTMLElement.prototype.qSelectorAll = function(str) {
		if(HTMLElement.querySelectorAll) return HTMLElement.querySelectorAll(str);
		else return jQuery.makeArray(jQuery(str));
	}
	window.opera.addEventListener("BeforeScript",function (e) {
		if(e.element.text){// 不替换 jquery
			if(e.element.text.indexOf(".fn.init")>-1||e.element.text.indexOf("(jQuery)")>-1)return;
			e.element.text = e.element.text.replace(new RegExp("querySelectorAll","gm"),"qSelectorAll");
		}
	}, false);
}
