// ==UserScript==
// @name 特殊下载链修复及转换 js 
// @author Magickey
// @description 转换迅雷，flashget专用链
// @update http://bbs.operachina.com/viewtopic.php?f=41&t=23734&p=23927
// @date 2008-4-29
// @version 1.0.5
// ==/UserScript==

(function(){
if (document.selectNodes)return;
	
document.addEventListener('DOMContentLoaded',getdownlinks,false);

if (typeof opera != 'undefined')
window.opera.addEventListener('BeforeExternalScript',function(e){
   var lurl=location.href;
   if (lurl.search('5qzone.net/gotohtml.php?')>-1 || lurl.search('5qzone.net/download.php?')>-1)
       e.preventDefault();
},false);

var specialsiteinfo=[
	{name:'onegreen.net',hurl:'Soft_Down.asp?flag='},
	//{name:'97sky.cn',hurl:'&fid=2'},
	{name:'lvdown.com',hurl:['&downid=10','&downid=15']},
	{name:'rsdown.cn',hurl:'&sID=0'},
	{name:'orsoon.com',hurl:'&flag=1'}
];

function getdownlinks(){
	var lurl=location.href;
	//for specialsite
	for (var i=0,info;info=specialsiteinfo[i];i++ ){
		if (info.name && lurl.search(info.name)>-1){
			showDL(info.hurl);
			return;
		}
	}

	//thunder
	var tulinks=document.selectNodes('//a[@thunderHref]');
	var ltu=tulinks.length;
	if (ltu){
		for (var i=0;i<ltu ;i++ ){
			var url=tulinks[i].attributes['thunderHref'].nodeValue;
            tulinks[i].onclick='';
			tulinks[i].href=url;
		}
	}
	//xuanfeng
    var xfLinks=document.selectNodes('//a[@QHref or @THref]');
	var lxf=xfLinks.length;
	if (lxf){
		for (var i=0;i<lxf ;i++ ){
			var url;
			xfLinks[i].attributes['QHref']?url=xfLinks[i].attributes['QHref'].nodeValue:url=xfLinks[i].attributes['THref'].nodeValue;
            xfLinks[i].onclick='';
			xfLinks[i].href=url;
		}
	}
	//flashget
	var slnks=document.selectNodes('//a[contains(@onclick,"convertFgURL") or contains(@onclick,"ConvertURL2FG")]');
	if (slnks&&!slnks[0]){
		getAddLinkDL();
		return;
	}
    if (window.fUrl){
		for (var i=0,l=slnks.length;i<l ;i++ ){
		            slnks[i].href=window.fUrl;
			        slnks[i].onclick='';
		}
	}else{
		for (var i=0,l=slnks.length;i<l ;i++ ){
			var fun=slnks[i].outerHTML;
			var fglnk=fun.match(/Flashget:\/\/[^\'\"]*/gi);
			if (fglnk){
				slnks[i].onclick='';
                slnks[i].href=fglnk[0];
			}else{
                var fun=slnks[i].onclick.toString();
				var f=fun.match(/convertFgURL\([^\)]*\)/gi);
			    if (f){
					var url=f[0].match(/[\'\"][^\'\"]*[\'\"]/);
					if (url){
						url=url[0].replace(/[\'\"]/g,'');
					    slnks[i].onclick='';
				        slnks[i].href=url;
				    }
				}
			}
		}
	}
}

function getAddLinkDL(){
	var lnks=document.selectNodes('//a[contains(@href,"javascript:download()") or contains(@onclick,"download()") or contains(@onclick,"AddLink")]');
	if (!lnks[0])
		return;
	for (var i=0,l=lnks.length;i<l ;i++ ){
		var fun;
        window.download?fun=window.download.toString():fun=lnks[i].onclick.toString();
		var url=fun.match(/AddLink\(\'[^\']*/g)[0];
		url=url.replace("AddLink('","");
		lnks[i].href=url;
		lnks[i].onclick='';
	}
}

function showDL(hurl){
	var sxp='';
	if (hurl.constructor==window.Array){
		sxp+='//a[contains(@href,"'+hurl[0]+'")';
		for (i=1;i<hurl.length ;i++ )
		    sxp+=' or contains(@href,"'+hurl[i]+'")';
		sxp+=']';
	}else
        sxp='//a[contains(@href,"'+hurl+'")]';
	var slnks=document.selectNodes(sxp);;
    if (slnks&&slnks[0])
	for (var i=0,l=slnks.length;i<l ;i++ ){
        var url=slnks[i].href.replace(/(http:\/\/[^\/]+\/)*/,'');
		showXMLhttpDL(url,slnks[i]);
	}
}

function showXMLhttpDL(url,obj){
	var xmlhttp=new XMLHttpRequest();
	var lurl=location.href.replace(/(http:\/\/[^\/]+\/)*/,'');
	lurl=lurl.match(/\//g);
	if (lurl){
		for (var i=0,l=lurl.length;i<l ;i++ )
			url='../'+url;
	}
	url+="&randnum="+Math.random();
	xmlhttp.open('GET', url, true);
	xmlhttp.send(null);
	xmlhttp.onreadystatechange = function (){
		if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 304)){
			var s=xmlhttp.responseText;
			var u=s.match(/flashget:\/\/[^\'\"]+/gim);
			if (u){
			    obj.href=u[0];
			}
            else{ 
				var u=s.match(/thunder:\/\/[^\'\"]+/gim);
			    if (u)
				    obj.href=u[0];
				else
					return;
			}
			obj.onclick='';
		}
		else if (xmlhttp.readyState == 4 && xmlhttp.status==404){
			alert("URL doesn't exist!");
		}
	}
}
})();