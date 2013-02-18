// ==UserScript==
// @name Embed tag fixer
// @author Somh
// @email ahmore@gmail.com
// @include *
// @ujs:modified 23:13 2008-7-4
// ==/UserScript==

document.addEventListener('DOMContentLoaded',iEmbed,false);

function iEmbed(){
	var es = document.selectNodes('//object[@classid]');
	for(var i=0, o; o=es[i]; i++){
			var oType=o.getAttribute('type')?o.getAttribute('type').toLowerCase():'';
			var eType=o.selectSingleNode('embed[@type]')?o.selectSingleNode('embed[@type]').getAttribute('type').toLowerCase():'';
			eType=(eType.indexOf('oleobject')>0)?'':eType;
			if(o.selectNodes('embed').length==0 || eType=='' || oType.indexOf('oleobject')>0){
				var t=o.getAttribute("classid")?o.getAttribute("classid").replace(/clsid:/i,'').toLowerCase():'';
				if(t==''){break;}
				// def code mod from ezibo's media.js
				switch (t) {
					case '05589fa1-c356-11ce-bf01-00aa0055595a':  // wmp6
					case '22d6f312-b0f6-11d0-94ab-0080c74c7e95':  // wmp6.4
					case '6bf52a52-394a-11d3-b153-00c04f79faa6':  // wmp7&9&10
						t = 'application/x-mplayer2';
						break;
					case 'cfcdaa03-8be4-11cf-b84b-0020afbbccfa':  // real player
						t = 'audio/x-pn-realaudio-plugin';
						break;
					case '02bf25d5-8c17-4b23-bc80-d3488abddc6b':  // quicktime player
						t = 'video/quicktime';
						break;
					case 'd27cdb6e-ae6d-11cf-96b8-444553540000':  // shockwave flash player
						t = 'application/x-shockwave-flash';
						break;
					case '166b1bca-3f9c-11cf-8075-444553540000':  // shockwave Director player
						t = 'application/x-director';
						break;
					default:
						t='';
				}
				
				if(t!=''){
					var ps=o.selectNodes("param");
					var ns='urlmoviefilenamesrc';
					var n;
					var u='';
					for(var j=0, p; p=ps[j]; j++){
						n=p.getAttribute('name')?p.getAttribute('name').toLowerCase():'';
						if(n!=''&&ns.indexOf(n)>-1){u=p.getAttribute('value')};
						var v=(n=='flashvars')?p.getAttribute('value'):'';
						var a=(n=='autostart')?p.getAttribute('value'):true;
					}
					
					// cctv live
					if(u=='' && location.host.replace(/www\./i,'')=='cctv.com'){u=getLiveUrl();}
					
					if(u!=''){
						if(v!=''){u=(u.indexOf('?')<0)?u+'?'+v:u+'&'+v;}
						var id=o.id?o.id:'';
						var w=o.width?o.width:o.style.width?o.style.width:300;
						var h=o.height?o.height:o.style.height?o.style.height:240;
						//h=h<5?64:h;
						//w=w<5?384:w;
						var t=setEmbedTag(id,t,w,h,a,u);
						
						//it's fine with v9.24 but not with v9.5b, weird diff...
						//o.innerHTML+=t;
						o.outerHTML=t;
					}
				}
			}
	}
}

function setEmbedTag(id,t,w,h,a,u,s){
	s=document.getElementById('somh_media_holder')?document.getElementById('somh_media_holder').getAttribute('style'):s?s:'';
	var et="<div id='somh_media_holder' style='"+s+"'><embed id='"+id+"' name='"+id+"' type='"+t+"' width='"+w+"' height='"+h+"' autostart='"+a+"' src='"+u+"'></embed></div>";
	return et;
}

// cctv live2
function getLiveUrl(){
	var es = document.selectNodes('//script');
	var url='';
	for(var i=0, o; o=es[i]; i++){
		if(o.innerText.indexOf('mms://live.cctv.com')>-1){url=o.innerText.replace(/.*VP\.playV\(\"/,'').replace(/".*/,'').replace(/\n|\r/g,'');break;}
	}
	return url;
}
if(location.href.replace(/www\./i,'').indexOf('http://cctv.com/live')>-1){
	window.opera.defineMagicFunction('playMedia',function (r, t, u){liveSwitch(u);});
	function liveSwitch(u){
		var lv=document.getElementById('video_obj_id')?document.getElementById('video_obj_id'):document.getElementById('video_player_id')?document.getElementById('video_player_id').parentNode:document.getElementById('somh_media_holder').parentNode;
		var lc=document.getElementById('video_controlbar_id')?document.getElementById('video_controlbar_id'):null;
		if(lc){lc.parentNode.removeChild(lc);}
		lv.innerHTML=setEmbedTag('video_player_id','application/x-mplayer2',352,340,true,u);
		lv.parentNode.appendChild(lv);
	}
}

// enable ppstream protocol
if(location.href.indexOf('http://so.pps.tv')>-1){
	document.addEventListener("DOMContentLoaded",function(){
		var es=document.selectNodes("//td[@class='preview']/a | //a[@class='playingTxt']");
		for(var i=0;i<es.length;i++){
			try{
				es[i].href=(es[i].hreflang)?es[i].hreflang.replace(/@.*/,""):es[i].title.replace(/@.*/,"");
				es[i].parentNode.previousSibling.firstChild.href=es[i].href;
			}catch(e){}
		}
	},false)
}

function flvSniffer(l) {
	l=l.replace(/^\s*|\s*$/g, '').replace(/\n|\r/ig,"");
	if(l!=''){
		if(!document.getElementById("flvSnifferBox")){
			var flvSnifferBoxHolder=document.createElement("div");
			flvSnifferBoxHolder.setAttribute("style","font:8pt Candara !important;position:fixed;bottom:5px;left:5px;z-index:99999;background:-o-skin(\"Secure Popup Header Skin\");padding:5px;max-height:75%;opacity:0.8;overflow:auto;text-align:left;padding:5px;min-width:-o-skin;min-height:-o-skin;")
			var flvSnifferBoxCap=document.createElement("div");
			flvSnifferBoxCap.setAttribute("style","float:right;height:-o-skin;width:-o-skin;background:-o-skin(\"Caption Restore\");cursor:hand")
			flvSnifferBoxCap.setAttribute("onclick","this.nextSibling.style.display=(this.nextSibling.style.display=='none')?'block':'none';this.style.background=this.style.background=='-o-skin(\"Caption Restore\")'?'-o-skin(\"Caption Minimize\")':'-o-skin(\"Caption Restore\")';")
			var flvSnifferBox=document.createElement("div");
			flvSnifferBox.id="flvSnifferBox";
			flvSnifferBox.setAttribute("style","display:none")
			flvSnifferBoxHolder.appendChild(flvSnifferBoxCap);
			flvSnifferBoxHolder.appendChild(flvSnifferBox);
			document.body.appendChild(flvSnifferBoxHolder);
		}
		var flvSnifferBox=document.getElementById("flvSnifferBox");
		if(flvSnifferBox.innerHTML.indexOf(l)<0){
			var lTitle=l.replace(/.*\//ig,"");
			lTitle=lTitle.length>50?"..."+lTitle.substring(lTitle.length-48,lTitle.length):lTitle;
			lTitle=l.match(/\.flv|\.swf|\.mp3|video_id|movie_id|\/flv\//)?"<span style='font:8pt Candara !important;color:red'>"+lTitle+"</span>":lTitle!=""?lTitle:l;
			flvSnifferBox.innerHTML+="<a style='font:8pt Candara !important;display:block;' href='"+l+"' target='_blank'><div style='background:-o-skin(\"Right Arrow\");width:-o-skin;height:-o-skin;display:inline-block;margin-right:3px;'></div>"+lTitle+"</a>";
		}
	}
}