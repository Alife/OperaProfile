// ==UserScript==
// @name urldecode
// @author Magickey
// @description 使迅雷，flashget专用链在 opera 下可使用
// @date 2009-10-13
// @version 1.2
// ==/UserScript==

(function(D,W){

	function getdownlinks(D,W){

		var i, obj, slnks, lurl=W.location.href,
			specialsiteinfo=[
				{name:'rsdown.cn',hurl:'&union=thunder'},
				{name:'orsoon.com',hurl:'&flag=1'},
				{name:'66game.cn',hurl:'&DownID=1'}
	        ];

		//for specialsite
		for (i=0;obj=specialsiteinfo[i];i++ ){
			if (lurl.indexOf(obj.name)>-1){
				showDL(obj.hurl,lurl,D,W);
				return;
			}
		}

		//thunder
		fixUrl(D.selectNodes('//a[@thunderHref]'),'thunderHref',true);

		//xuanfeng
		fixUrl(D.selectNodes('//a[@QHref]'),'QHref',true);
		fixUrl(D.selectNodes('//a[@THref]'),'THref',true);

		//flashget
		slnks=D.selectNodes('//a[contains(@onclick,"convertFgURL") or contains(@onclick,"ConvertURL2FG")]');
		if (!slnks[0])
			fixUrl(D.selectNodes('//a[contains(@href,"javascript:download()") or contains(@onclick,"download()") or contains(@onclick,"AddLink")]'),function(o){
				var url=(window.download?window.download+'':o.getAttribute('onclick')).match(/AddLink\(\s*([\"\'])(.*?)\1/);
				return url&&url[2];
			});
		else if (W.fUrl) fixUrl(slnks,W.fUrl);
		else fixUrl(slnks,function(o){
				var url=o.outerHTML.match(/Flashget:\/\/[^\'\"]*/i);
				return url&&url[0];
			 });
	}

	function fixUrl(links,downlink,istype){
		for (var obj, i=0; obj=links[i]; i++){
			obj.onclick=null;
			obj.href=istype?obj.getAttribute(downlink):typeof downlink==="string"?downlink:downlink(obj);
		}
	}

	function showDL(hurl,lurl,D,W){
		var sxp='', i, o, slnks, url;
		if (hurl.constructor===W.Array){
			sxp+='//a[contains(@href,"'+hurl[0]+'")';
			for (i=1; o=hurl[i]; i++)
				sxp+=' or contains(@href,"'+o+'")';
			sxp+=']';
		}else
			sxp='//a[contains(@href,"'+hurl+'")]';
		slnks=D.selectNodes(sxp);
		for (i=0; o=slnks[i]; i++)
			showXMLhttpDL(o.href.replace(/(http:\/\/[^\/]+\/)*/,''),o,lurl);
	}

	function showXMLhttpDL(url,obj,lurl){
		var xmlhttp=new XMLHttpRequest(), i, lurl=lurl.replace(/^http:\/\/.+?\//,'').match(/\//g);
		if (lurl)
			for (var i=0,l=lurl.length; i<l; i++)
				url='../'+url;
		url+="&randnum="+Math.random();
		xmlhttp.open('GET', url, true);
		xmlhttp.send(null);
		xmlhttp.onreadystatechange = function (){
			if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 304)){
				var u=xmlhttp.responseText.match(/(?:flashget:\/\/[^\'\"]+)|(?:thunder:\/\/[^\'\"]+)/im);
				if (!u) return;
				obj.href=u[0];
				obj.onclick=null;
			}
		}
	}

	function urldecode(){
		getdownlinks(D,W);
		D.removeEventListener('DOMContentLoaded',urldecode,false);
	}

	D.addEventListener('DOMContentLoaded',urldecode,false);

})(document,window)