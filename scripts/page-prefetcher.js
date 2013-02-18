// ==UserScript==
// @name Page prefetcher
// @author Jo?o Eiras,ezibo
// @version 1.0
// @description  Prefetches page linked to the current one with
// rel="next","prefetech" or "prev". This
// behaviour is similar to Gecko's.
// @ujs:category browser: enhancements
// @ujs:published 2006-01-24 09:43
// @ujs:modified 2009-03-11
//
// Add URLs to exclude here:
// @exclude file://*
// @exclude https://*
// @exclude http://*mail*/*
//
// ==/UserScript==


(function(){
	//switch for show prefetched url in title
	var ChangeTitle=false
	var ShowDebug=false

	var siteDefineArr=new Array();
	var genDefineArr=new Array();
	var sdi=0;
	var gdi=0;
	var siteBehavior,siteFileName,siteKeyword,sitePostfix,siteIncrease;
	var siteWithDomain=false;
	var siteWithPrefix=false;
	var siteWithKeyWord=false;
	var adr=location.href;
	var useJsNext=false;
	var eznexturl="";

	// 8 values include (INC,ULINC,COMPINC,NEXT,NEXTINC,NEXTCOMPINC,PIC,JSNEXT)
	// domain name---------Behavior---------url prefix---------comp keyword---------url postfix---------inc
	//http://bbs.operachina.com/viewtopic.php?f=15&t=33216&st=0&sk=t&sd=a&start=20
	siteDefineArr[sdi++]=[/.+\.qq\.com/,"ULINC",/\/a/,/_\d+\.(\D)?htm(l)?$/,/\.(\D)?htm(l)?$/,"_1"];
	siteDefineArr[sdi++]=[/www\.dream2008\.cn/,"INC",/\/thread/,"",/-\d\.html$/,""];
	siteDefineArr[sdi++]=[/news\.feelcars\.com/,"PIC","","upload/img177/next.gif","",""];
	siteDefineArr[sdi++]=[/photo\.feelcars\.com/,"PIC","","images/down.gif","",""];
	siteDefineArr[sdi++]=[/bbs\.pcbeta\.com/,"INC",/\/thread/,"",/-\d\.html$/,""];

	siteDefineArr[sdi++]=[/bbs\.dmzj\.com/,"COMPINC",/\/viewthread\.php/,"&page=","",""];
	siteDefineArr[sdi++]=[/www\.520dx\.com/,"COMPINC",/\/viewthread\.php/,"&page=","",""];

	siteDefineArr[sdi++]=[/bbs\.mumayi\.net/,"INC",/\/thread/,"",/-\d\.html$/,""];
	siteDefineArr[sdi++]=[/bbs\.bt5156\.com/,"INC",/\/thread/,"",/-\d\.html$/,""];
	siteDefineArr[sdi++]=[/opda\.net\.cn/,"INC",/\/thread/,"",/-\d\.html$/,""];
	siteDefineArr[sdi++]=[/opda\.net\.cn/,"COMPINC",/\/viewthread\.php/,"&page=","",""];
	siteDefineArr[sdi++]=[/www\.minisoyo\.com/,"INC",/\/thread/,"",/-\d\.html$/,""];

	siteDefineArr[sdi++]=[/bbs\.hoopchina\.com/,"COMPINC",/\/read\.php/,"&page=","",""];
	siteDefineArr[sdi++]=[/bbs\.imp3\.net/,"COMPINC",/\/viewthread\.php/,"&page=","",""];

	siteDefineArr[sdi++]=[/www\.tektalk\.cn/,"INC",/\/page/,"","",""];

	siteDefineArr[sdi++]=[/bbs\.operachina\.com/,"NEXT",/\/viewtopic\.php/,"&start=","","20"];

	siteDefineArr[sdi++]=[/deepin\.org/,"COMPINC",/\/read\.php/,"&page=","",""];
	//~ siteDefineArr[sdi++]=[/deepin\.org/,"INC",/\/read-htm/,/-fpage-\d?-toread-\d?-page-/,/\.html$/,""];
	siteDefineArr[sdi++]=[/deepin\.org/,"COMPINC",/\/read-htm/,"-toread--page-",/\.html$/,""];

	//http://bbs.kafan.cn/thread-388668-2-1.html
	siteDefineArr[sdi++]=[/bbs\.kafan\.cn/,"INC",/\/thread/,"",/-\d\.html$/,""];
	siteDefineArr[sdi++]=[/bbs\.winzheng\.com/,"COMPINC",/\/viewthread\.php/,"&page=","",""];

	siteDefineArr[sdi++]=[/forum\.xitek\.com/,"COMPINC",/\/showthread\.php/,"&pagenumber=","",""];
	siteDefineArr[sdi++]=[/bbs\.btchina\.net/,"COMPINC",/\/showthread\.php/,"&pagenumber=","",""];
	siteDefineArr[sdi++]=[/bbs.+163\.com/,"NEXT","","","",""];
	siteDefineArr[sdi++]=[/dzh\.mop\.com/,"NEXT",/\/topic\/readSub/,"","",""];
	siteDefineArr[sdi++]=[/bookba\.net/,"NEXT",/\/html\/book/i,"","",""];
	siteDefineArr[sdi++]=[/ngzw\.com/,"NEXT",/\/html\/book/i,"","",""];
	siteDefineArr[sdi++]=[/qidian\.com/,"NEXT",/\/bookreader/i,"","",""];
	siteDefineArr[sdi++]=[/publish\.it168\.com/,"INC","","","",""];
	siteDefineArr[sdi++]=[/ifeng\.com/,"NEXT","","","",""];
	siteDefineArr[sdi++]=[/pic\.xinmin\.cn/,"PIC","","","",""];
	siteDefineArr[sdi++]=[/.+\.daqi\.com/,"ULINC",/\/article/,/_\d+\.(\D)?htm(l)?$/,/\.(\D)?htm(l)?$/,"_2"];
	siteDefineArr[sdi++]=[/daqi\.com/,"PIC","","slide\/.*next.*\.gif","",""];
	siteDefineArr[sdi++]=[/news\.xinhuanet\.com/,"PIC","","icon/newscenter/news_xy.gif","",""];

	siteDefineArr[sdi++]=[/www\.77shu\.com/,"JSNEXT",/\/html\/book/i,"","",""];

	siteDefineArr[sdi++]=[/verycd\.com/,"COMPINC",/\/sto/,"page","",""];

	genDefineArr[gdi++]=["","NEXTINC",/\/thread/,"",/-\d\.html$/,""];
	genDefineArr[gdi++]=["","NEXTCOMPINC",/\/dispbbs\.(asp|php)|\/(read|viewthread|showthread)\.php|\/viewtopic\.php/,"&page=","",""];

	var links=document.links;
	var hasNext=false;
	var reg="^(>|\u003E|\u00BB|\u203A|\u2192|\u21D2){0,2}(\u3010|\\[)?(((\u70B9\u51FB|\u6D4F\u89C8|\u7EE7\u7EED).*)?(\u4E0B|\u540E|\u7FFB)(\u4E00|\u4E0B|\u540E|\uFF11|1)?(\u9875|\u9801|\u7BC7|\u5F20|\u7AE0|\u8282|\u4E2A|\u5E45)|next|NEXT|Next)(\u00A0|\u0020)*(]|\u3011|>|\u003E|\u00BB|\u203A|\u2192|\u21D2){0,2}$";

	for(var i=0;i<sdi;i++){
		if(adr.match(siteDefineArr[i][0])){
			siteBehavior=siteDefineArr[i][1].toUpperCase();
			siteFileName=siteDefineArr[i][2];
			siteWithDomain=true;
			if(adr.match(siteFileName)){
				siteWithPrefix=true;
				siteKeyword=siteDefineArr[i][3];
				sitePostfix=siteDefineArr[i][4];
				siteIncrease=siteDefineArr[i][5];
				if(siteIncrease=="") siteIncrease="2";
				if(siteKeyword!=null&&siteKeyword!=""&&adr.match(siteKeyword)){
					siteWithKeyWord=true;
				}
				break;
			}
		}
	}

	if(!siteWithDomain){ //not in custom sitedefine,so general define
		for(var i=0;i<gdi;i++){
			siteBehavior=genDefineArr[i][1].toUpperCase();
			siteFileName=genDefineArr[i][2];
			if(adr.match(siteFileName)){
				siteWithDomain=true;
				siteWithPrefix=true;
				siteKeyword=genDefineArr[i][3];
				sitePostfix=genDefineArr[i][4];
				siteIncrease=genDefineArr[i][5];
				if(siteIncrease=="") siteIncrease="2";
				if(siteKeyword!=null&&siteKeyword!=""&&adr.indexOf(siteKeyword)>-1){
					siteWithKeyWord=true;
				}
				break;
			}
		}
	}

	var resolveurl=function(url){var link=document.createElement("a");link.href=url;url=link.href;delete link;return url;}
	window.addEventListener("DOMContentLoaded",function(){
	//~ window.addEventListener("load",function(){
		var html = document.getElementsByTagName("body");
		if(html.length<1)
			html = document.getElementsByTagName("html");
		if(html.length<1)
			return;
		html = html[0];

		var prefetchdiv;
		var writeiframe=function(url){
			//check it is a external url - quit
			//I don't want cross domain scriptting errors, nor can the script control the page later...
			//This also considers ports appended to the hostname -> 80 is the default port for http so
			// hostname:80 == hostname :)
			if( url.match(/^\w+:\/\/?([^\/]+)/) && window.location.hostname != RegExp.$1.replace(/:80$/,""))
				return;
			prefetchdiv=document.createElement("div");
			prefetchdiv.setAttribute("id","ujs_link_prefetcher_iframe_placeholder")
			if(ShowDebug){
				prefetchdiv.setAttribute("style","width:100%;border: dashed;");
			}
			else{
				prefetchdiv.setAttribute("style","display:none;");
			}
			html.appendChild(prefetchdiv);
			var xmlhttp = new XMLHttpRequest();
			var arr;
			var str;
			var regimg = /<img/ig
			var picreg = /<img(.+?)src=('|\")?([^\s]+?)('|\")?(\/?>|( .*)(\/?>))/ig
			//~ var picreg = /<img(.+?)src=('|\")?([^\s]+?)('|\")?(\/?>|( (?!<img).*)(\/?>))/ig
			//~ http://tech.ddvip.com/2008/05/121006245244222_3.html
			var picpat = "$3"
			var a;
			xmlhttp.onreadystatechange = function(){
				//~ alert("333" + xmlhttp.readyState);
				var xState=xmlhttp.readyState;
				if (xState == 4) {
					str = xmlhttp.responseText
					str=str.replace(regimg,"\n<img")
					while ((arr = picreg.exec(str)) != null){
						var p = document.createElement("img");
						prefetchdiv.appendChild(p);
						p.src=arr[3];
					}
				}
			}

			xmlhttp.open("GET",url,true);
			//xmlhttp.setRequestHeader( "Content-Type", "text/html;charset=gb2312" );
			xmlhttp.send(null);
		}

		var doPrefetchUL1 = function(){
			var u,pf
			if(!siteWithKeyWord){ //do add _1
				pf=adr.match(sitePostfix)[0];
				if(pf&&pf.length>0){
					u=adr.substring(0,(adr.length-pf.length));
				}
				else{
					u=adr;
					pf="";
				}
				u=adr.substring(0,(adr.length-pf.length));
				eznexturl=resolveurl(u+siteIncrease+pf);
				if(ChangeTitle)document.title=document.title+'-PU';
			}
			else if(siteWithPrefix&&sitePostfix!=""){
				pf=adr.match(sitePostfix)[0];
				if(pf&&pf.length>0){
					pf=pf[pf.length-1]
					u=adr.substring(0,(adr.length-pf.length));
				}
				else{
					pf="";
				}
				re=u.match(/\d+/g);
				re=re[re.length-1];
				re2=(parseInt(re)+1)+'';
				while(re2.length<re.length){re2='0'+re2;};
				j=u.lastIndexOf(re);
				h=u.substring(0,j)+u.substring(j,u.length).replace(re,re2)+pf;
				eznexturl=resolveurl(h);
				if(ChangeTitle)document.title=document.title+'-PI';
			}
			else{
				//normal url,not in sitedefine,
				re=adr.match("(http://)(.*/+)+.*\\d+.*");
				if(re){
					re=adr.match(/\d+/g);
					re=re[re.length-1];
					re2=(parseInt(re)+1)+'';
					while(re2.length<re.length){re2='0'+re2;};
					j=adr.lastIndexOf(re);
					h=adr.substring(0,j)+adr.substring(j,adr.length).replace(re,re2);
					eznexturl=resolveurl(h);
					if(ChangeTitle)document.title=document.title+'-PI';
				}
			}
		}

		var doPrefetchCompKey = function(){
			var u,pf
			pf=adr.match(sitePostfix);
			if(pf&&pf.length>0){
				pf=pf[pf.length-1]
				u=adr.substring(0,(adr.length-pf.length));
			}
			else{
				u=adr;
				pf=""; //if do match method, the result maybe null
			}
			u=adr.substring(0,(adr.length-pf.length));
			eznexturl=resolveurl(u+siteKeyword+siteIncrease+pf);
			if(ChangeTitle)document.title=document.title+'-PC';
		}

		var doPrefetchInc = function(){
			var re,re2,j,h;
			var u,pf
			if(siteWithPrefix){
				u=adr;
				pf="";
				if(siteWithKeyWord){
					//such as http://soft.deepin.org/read.php?tid=896861&page=e&#a ,don't do inc
					var n;
					n=adr.substr(adr.indexOf(siteKeyword)+siteKeyword.length,1);
					if(isNaN(n)) return;
				}
				else if(sitePostfix!=""){
					pf=adr.match(sitePostfix);
					if(pf&&pf.length>0){
						pf=pf[pf.length-1]
						u=adr.substring(0,(adr.length-pf.length));
					}
					else{
						pf="";
					}
				}
				re=u.match(/\d+/g);
				re=re[re.length-1];
				re2=(parseInt(re)+1)+'';
				while(re2.length<re.length){re2='0'+re2;};
				j=u.lastIndexOf(re);
				h=u.substring(0,j)+u.substring(j,u.length).replace(re,re2)+pf;
				eznexturl=resolveurl(h);
				if(ChangeTitle)document.title=document.title+'-PI';
			}
			else{
				//normal url,not in sitedefine,
				re=adr.match("(http://)(.*/+)+.*\\d+.*");
				if(re){
					re=adr.match(/\d+/g);
					re=re[re.length-1];
					re2=(parseInt(re)+1)+'';
					while(re2.length<re.length){re2='0'+re2;};
					j=adr.lastIndexOf(re);
					h=adr.substring(0,j)+adr.substring(j,adr.length).replace(re,re2);
					eznexturl=resolveurl(h);
					if(ChangeTitle)document.title=document.title+'-PI';
				}
			}
		}

		var doPrefetchNext = function(){
			var k,t,h;
			for(k=0;k<links.length;k++)
			{
				try{
					t=links[k].innerText;
					if(t.match(reg))
					{
						h=links[k].getAttribute("href");
						if(h=="#" || h.indexOf("javascript")!=-1) {
							if(useJsNext){
								//js method to next ,such as javascript:document.location=nextpage
								h=eval(h.replace(/javascript.*=/,""));
							}
							else{
								continue;
							}
						}
						eznexturl=resolveurl(h);
						hasNext=true;
						if(ChangeTitle)document.title=document.title+'-PN';
						return;
					}
				}
				catch(e){
					continue;
				}
			}
		}

		var doPrefetchPic = function(){
			var t;
			var ia=document.getElementsByTagName("img");
			for (i=0;i<ia.length;i++)
			{
				try{
					if (siteKeyword!=""){
						t=ia[i].getAttribute('src');
						if(t.match(siteKeyword))
						{
							h=ia[i].parentNode.getAttribute("href");
							if(h=="#" || h.indexOf("javascript")!=-1) {
								continue;
							}
							eznexturl=resolveurl(h);
							hasNext=true;
							if(ChangeTitle)document.title=document.title+'-PP';
							return;
						}
					}
					else {
						t=ia[i].getAttribute('alt');
						if(t=="" || t == null) continue;
						if(t.match(reg))
						{
							h=ia[i].parentNode.getAttribute("href");
							if(h=="#" || h.indexOf("javascript")!=-1) {
								continue;
							}
							eznexturl=resolveurl(h);
							hasNext=true;
							if(ChangeTitle)document.title=document.title+'-PP';
							return;
						}
					}
				}
				catch(e){
					continue;
				}
			}
		}

		ezjsfastforward=function(){
			if(eznexturl==""){
				doPrefetchInc();
			}
			if(eznexturl!=""){
				window.location.href=eznexturl;
			}
		}

		if(siteWithDomain){
			if(siteWithPrefix){
				if(siteBehavior=="INC"){
					doPrefetchInc();
				}
				else if(siteBehavior=="ULINC"){
					doPrefetchUL1();
				}
				else if(siteBehavior=="COMPINC"){
					if(!siteWithKeyWord){
						doPrefetchCompKey();
					}
					else if(siteWithKeyWord){
						doPrefetchInc();
					}
				}
				else if(siteBehavior=="NEXT"){
					doPrefetchNext();
				}
				else if(siteBehavior=="NEXTINC"){
					doPrefetchNext();
					if(!hasNext){
						doPrefetchInc();
					}
				}
				else if(siteBehavior=="NEXTCOMPINC"){
					doPrefetchNext();
					if(!hasNext){
						if(!siteWithKeyWord){
							doPrefetchCompKey();
						}
						else if(siteWithKeyWord){
							doPrefetchInc();
						}
					}
				}
				else if(siteBehavior=="JSNEXT"){
					useJsNext=true;
					doPrefetchNext();
				}
				else if(siteBehavior=="PIC"){
					doPrefetchPic();
				}
			}
		}
		else{
			//to general page,just do next
			doPrefetchNext();
			if(!hasNext){
					doPrefetchPic();
			}
		}
		if(eznexturl&&eznexturl.length>0){
			window.ez_beginprefetch=true;
			writeiframe(eznexturl);
		}
	},false);
})();