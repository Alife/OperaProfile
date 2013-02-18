// ==UserScript==
// @name show CrSky.com Links
// @author somh
// @e-mail ahmore@gmail.com
// @include http://www.crsky.com/*
// @include http://www1.crsky.com/*
// @include http://wt.crsky.com/*
// @exclude http://bbs.crsky.com/*
// @exclude http://news.crsky.com/*
// @ujs:modified 0:56 2008-7-8
// ==/UserScript==

window.opera.addEventListener('BeforeExternalScript',function (e){e.preventDefault();},false);
window.opera.addEventListener('BeforeScript',function (e){e.preventDefault();},false);
document.addEventListener('load',function(e){
	function getValue(text, start, end) {
		var p1 = text.indexOf(start);
		if(p1 == -1) return '';
			p1 += start.length;
			var p2 = text.indexOf(end, p1);
		if(p2 == -1) return '';
			return text.substring(p1, p2);
	}
	function getLinks(s){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			var xState=xmlhttp.readyState;
			switch (xState) {
				case 0:
					//lInfo.innerHTML="Uninitialized.";
				case 1:
					//lInfo.innerHTML="Loading download links...";
				case 3:
					//lInfo.innerHTML="Target loaded.";
				case 4:
					var t = getValue(xmlhttp.responseText, 'absmiddle', 'adlist');
					if(t!=""){
						var ts=t.split("\"");t="";
						for(var j=0;j<ts.length;j++){
							if(ts[j].indexOf("http://")==0){
								t+="<a style='text-align:center;display:inline-block;margin:2px 16px;padding:2px 10px;border:1px solid #eee;border-bottom:1px solid brown;background:#fcfcfc' href='" + ts[j]+"'>&#28857;&#20987;&#19979;&#36733;</a>";
							}
						}
						s.outerHTML=t+"<br>";
						//s.parentNode.innerHTML=t;
					}
			}
		}
		xmlhttp.open("GET",s.src,true);
		//xmlhttp.setRequestHeader( "Content-Type", "text/html;charset=gb2312" );
		xmlhttp.send(null);
	}
	if(!document.getElementById("tScript")){
		var es = document.getElementsByTagName("script");
		for(var i=0; i<es.length; i++){
			if(es[i].src&&es[i].src.indexOf('view_down.asp')>-1){
				es[i].id="tScript";
				getLinks(es[i]);
			}
		}
	}
},true)