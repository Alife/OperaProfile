// ==UserScript==
// @name BBCode
// @description 自动下载 video 
// @include		 http://8video.tv/*
// @include		 http://8drama.com/*
// ==/UserScript==

// 首先进入列表页面,如 http://8drama.com/108442/ 会在集数上方添加 下载全部 按钮.
// 点击此按钮,首先找到 第一集, 标识全局下载状态为 1 . 自动打开第一集链接
// 第一集页面打开后,将当前集数文件名添加到 iframe.src 后面, iframe 自动重载.
// iframe 加载的时候判断地址后面有否有集数文件名,如果有则查找 video 下载地址,添加到 aria2 中查找不到元素
// 添加完成后后退两下(iframe 加载一次,重载一次),回到列表页面,进入循环

document.addEventListener('DOMContentLoaded', function(e){
	var aria2 = new ARIA2("http://localhost:6800/jsonrpc");
	var dir="F:\\大美青海\\ZRTour.Web\\upload";
	var ls_downloadState="downloadState";
	var ls_Id_name="Id_name";
	var ls_Id_names="Id_names";
	if(location.host==("8video.tv")&&typeof(ap_)!="undefined"){
		var link=ap_ + fff + '\u003f\u0073\u0069\u0067\u006e\u003d' + tuima_(ssn) + ssn + '&id=cq$$' + pur + '&type=html5';
		jQuery("#daojs").html("<a id='download' href='"+link+"'>下载</a>");
		jQuery("#download").click(function(){
			var ls_Id_value=localStorage.getItem(ls_Id_name) || "01";
			aria2.addUri(link, {dir:dir,out:name });
			history.back();
			return false;
		});
		// get name then auto download and back
		if(location.hash!=""){
			var name=location.hash.replace("#","")+".mp4";
			console.log(dir+"\\"+name+" "+link);
			aria2.addUri(link, {dir:dir,out:name });
			history.go(-2);
		}
	}

	jQuery("iframe[src^='http://8video.tv/']").on("load", function(){
		if(localStorage.getItem(ls_downloadState)=="1"&&this.src.indexOf("&1=1")==-1){
			var title=jQuery("h1.entry-title");
			if(title.length==0)title=jQuery("h2.post-title");
			if(title.length==1)this.src=this.src+"&downloadState=1&1=1#"+title.text();
			else alert("title not found");
			// 已下载列表
			var Id_names=localStorage.getItem(ls_Id_names)||",";
			localStorage.setItem(ls_Id_names,Id_names+location.href+",");
		}
	});
	
	if(location.host==("8drama.com")){
		var links=jQuery(".entry-content tr[align='center'] a");
		if(links.length>0){
			links.click(function(){localStorage.setItem(ls_Id_name,jQuery(this)[0].href);});
			
			// 去重
			//var texts = array.map(function(obj) { return jQuery(obj).text(); });
			//texts = texts.filter(function(v,i) { return texts.indexOf(v) = i; });

			jQuery(".entry-content b").after("<a id='download'>下载全部</a>");
			jQuery("#download").click(function(){
				localStorage.setItem(ls_downloadState,1);
				// localStorage 无值,默认第一个
				if(localStorage.getItem(ls_Id_name)==null)localStorage.setItem(ls_Id_name,links.filter("a:first")[0].href);
				var nexta=links.filter("a[href='"+localStorage.getItem(ls_Id_name)+"']");
				// 从 localStorage 中查找不到元素,停止
				if(nexta.length==0)localStorage.setItem(ls_downloadState,0);
				else nexta[0].click();
			});
			// auto download 
			if(localStorage.getItem(ls_downloadState)=="1"){
				// 获取上一个任务
				var last=links.filter("a[href='"+localStorage.getItem(ls_Id_name)+"']");
				// 从 localStorage 中查找不到元素,停止
				if(last.length==0)localStorage.setItem(ls_downloadState,0);
				// 上一任务是最后一集,停止
				if(links.index(last)==links.length-1){
					localStorage.setItem(ls_downloadState,0);
					alert("download finished!");
				}
				var nexta=links.eq(links.index(last)+1);
				var Id_names=localStorage.getItem(ls_Id_names)||",";
				while(nexta.length==1&&Id_names.indexOf(","+nexta[0].href+",")>-1){
					nexta=links.eq(links.index(nexta)+1);
				}
				if(nexta.length==1)nexta[0].click();
			}
		}
	}
}, true);

var ARIA2 = (function() {
  var jsonrpc_version = '2.0';

  function get_auth(url) {
    return url.match(/^(?:(?![^:@]+:[^:@\/]*@)[^:\/?#.]+:)?(?:\/\/)?(?:([^:@]*(?::[^:@]*)?)?@)?/)[1];
  };

  function request(jsonrpc_path, method, params) {
    var xhr = new XMLHttpRequest();
    var auth = get_auth(jsonrpc_path);
    jsonrpc_path = jsonrpc_path.replace(/^((?![^:@]+:[^:@\/]*@)[^:\/?#.]+:)?(\/\/)?(?:(?:[^:@]*(?::[^:@]*)?)?@)?(.*)/, '$1$2$3'); // auth string not allowed in url for firefox

    var request_obj = {
      jsonrpc: jsonrpc_version,
      method: method,
      id: (new Date()).getTime().toString(),
    };
    if (params) request_obj['params'] = params;
    if (auth && auth.indexOf('token:') == 0) params.unshift(auth);

    xhr.open("POST", jsonrpc_path+"?tm="+(new Date()).getTime().toString(), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    if (auth && auth.indexOf('token:') != 0) {
      xhr.setRequestHeader("Authorization", "Basic "+btoa(auth));
    }
    xhr.send(JSON.stringify(request_obj));
  };

  return function(jsonrpc_path) {
    this.jsonrpc_path = jsonrpc_path;
    this.addUri = function (uri, options) {
      request(this.jsonrpc_path, 'aria2.addUri', [[uri, ], options]);
    };
    return this;
  }
})();

