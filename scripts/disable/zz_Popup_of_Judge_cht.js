// ==UserScript==
// Popup of Judge ( Popup 判官 >_* )
// 20110515 初版
//
// @include *
//
// ==/UserScript==

/*
紀錄:
		20110617 SE
			新增* 介面化
			修正* 增強阻擋狀況
		
		20110521 v1.72
			修正* 繞過疑似 Opera 的 "DOMNodeInserted" 監聽器的bug
			修正* 效能小幅改進
		
		20110521 v1.71
			新增* 圖示提示功能(目前只有基礎提醒功能)
			新增* 增加阻擋彈出視窗種類 : 1.模擬點擊
			
		20110520 v1.7
			新增* 增加阻擋彈出視窗種類 : 1.模擬表單提交型 2.無網址型 3.程式碼加密A型
			更動* 設定項目獨立檔案
				( 注意: 1.兩個JS檔名皆不可更動 2.有些設定項目名稱有變,若要複製舊設定值,請複製值就好不要複製設定項目名稱(var ...) )
			更動* 強制黑名單將會影響本地JS (我承認有些狀況實在太難阻擋...只好改成這樣 , 黑名單...應該沒差吧?)
			修正* 滑鼠事件判斷
		
		20110517 v1.61
			新增* 簡易"強制黑名單"功能 , 欲使用請詳閱說明部份
			修正* 微幅判斷精度調整
			
			PS.喵了個咪...我想我真的不太會寫說明,徵求善心人士協助(建議我怎麼寫),再徵求"更善心"人士幫我將說明翻譯成英文= =
		
		20110516 v1.6
			新增* 白名單允許使用萬用字元"*" , 欲使用請詳閱說明部份
			修正* 與snap-links.js等等部分的本地JS衝突
			修正* 彈出視窗網址為"/"開頭的誤判
			
		20110515 v1.0
			第一版釋出
*/

(function(){

var logo = "background:url('data:image/png;base64,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') no-repeat 2px 3px;";

var close_img = 
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAElBMVEX///9/f39	/f3+goKD///9/f3/lJutKAAAAA3RSTlMAMC+O4c90AAAAPElEQVR4Xn3LMREAIAxDUeCOHQmIiINGAEv9WyHAU	Kb+6d2lLVnV1RA61TowEheE8cEQiCmOv/fmapakDcwVDZ40rktBAAAAAElFTkSuQmCC";

var background = 
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAACYCAIAAABIwg8sAAAACXBIWXMAAAsTAAALEwEA	mpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEKSURBVHja7NJby0RQFAZg50h	ESWTwz/02xyRSIhrHuf7eVs1OX3Mz4/Lp3a+1V5tPkoT7+0lRFCHlec6QStP037o+n8qy7MN/JPYVxzHDXETq9u7DML	y3CSLF1nU7RUwfBMG9LmJfRBeRejweDCnf95HKskTyPI9heiJVFAWS67pIVVUhOY6DVNc1km3bSE3TIFmWhdS2LZJpm	khd1yEZhoHU9z2SrutIwzAgaZqGNI4jQ2qaJiRVVRm6FEVBmucZSZZlpGVZkCRJQno+n0iiKDKkiK51XZEEQUDa9x2J	5/l7qeM4GA4ScxEXIg5u24Z0nud7wjtzHCdd1/U+9aMvJ+KR/zbx5XO9BgATYZsZEfzysAAAAABJRU5ErkJggg==";
			
var erase_img = 
			"data:image/gif;base64,R0lGODlhEAAQAOZcAHF6hf///664w5KeqfHz9JqksMTL1Nbc4rjE0eTr8bnEzyw3QvD1	/Ovx+O/0+2BqdFlha/X4+e71+rG7xig0P1xlbys2QeDo8Sk0QNXd5pGdqsHN2bjEz7/K1Fhha56lrLjE0LrF0JGdp5q	iqXF7hoeRm6Krtio1QH+Klaayvtrb3VZfabLAzvDz9JymsnF8h15mb3J+ioyZpcfR2cHM14GMl9zk62pzfGlyfmx2gm	VueCYyPrC7x1xkbXuGkejv9cfP146Xn5iirpSgq5uotPj9/6OnrbnF0MLK011lbm53grnE0EZOWOPq8GFqc0FLVc/U2	rjDztDa5M/X4JWcpbC9ynaBi7vH1NXb4tnf5i04Q2RueP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	AAAAAACH5BAEAAFwALAAAAAAQABAAAAeggFyCgwCFAIOIiAAMDQ0Mh4lchpOUhAGXmJkBUJAADjYZUzMdCjwpRBoynT	EqRh8jVEElNSgmPpBcLwFAET8uWVdDEwpWiDkBBgQJBQcIAwJRJIg4yMrMzgIcSohb1cvNzwo3iA/e1+E6iBXm4AJLT	oge7NhHMIgrAUgtTUJYICICQvRABOFSEQkXpGxgUYVGkkRPdlDAcMLCAi0LmAwKBAA7";
			
var type_img_a = 
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAACXBIWXMAAAsSAAALEgHS	3X78AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACNSURBVHjaYvz//z/Dqt2vz8u	Iseq9/fCN4fLtz5eqUtQNGVfuenXu6MWPhvvPfGRgYGBgUJdlYhDk/nmeSUaMVR8myMDAwHDz8T+G37++6DPdevjpHw	MaePHm1z+mZ6++X1aXZYIL8rJ/ZXj74ddlxv///zOkNZw49+XrN933H38wvP3w6/KpVQFGgAEAGnBCOz9gFiUAAAAASUVORK5CYII=";
			
var type_img_b = 
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAACXBIWXMAAAsSAAALEgHS	3X78AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACMSURBVHjaYvz//z/DGkuf8zx	ionpPPn1ieP3s2aXKm8cNGVdbeJ97/uiJ4YeXrxgYGBgYfvHyMHziZDvPxCMmqg8TZGBgYGD7/IXhw/9/+kz3nj35x4	AG/n77/o/p46cvl3/x8sAFX7IyM/z+9esy4////xnypXTOffnzR/fnz58Mv3/9urzy+1MjwAD5WUK0HcBR+QAAAABJRU5ErkJggg==";
			

var Open = window.open;
var addEvl = addEventListener;
var AtEvl = attachEvent;
var Old_Submit = HTMLFormElement.prototype.submit;
var Old_aClick = HTMLAnchorElement.prototype.click;
var Jsa = [],Pre_Eva = [];
var Pre_HJE = false;
var Ev = "" , JS_link = "";
var ls = localStorage;
var host_spl = window.location.host.split(".");
var fixed_host = PoJ_Cfg.host_Level==1 && host_spl.length>2?host_spl[1]+"."+host_spl[2]+(host_spl[3]?"."+host_spl[3]:""):window.location.host;
var click_elm = null;
var newAddEvl = function(){ if(arguments[0].match(/click|mouseup|mousedown/i)){ Pre_Eva.push(arguments[1]) }; return addEvl.apply(this,arguments); };
var newAtEvl = function(){ if(arguments[0].match(/click|mouseup|mousedown/i)){ Pre_Eva.push(arguments[1]) }; return AtEvl.apply(this,arguments); };
var HiJack_Evl = [window,document,document.documentElement,HTMLCollection,HTMLElement,HTMLBodyElement,HTMLImageElement,
				HTMLDivElement,HTMLAnchorElement,HTMLTableElement,HTMLObjectElement,HTMLEmbedElement,HTMLUnknownElement];
var loaded = false , sts_ico_ins = false , ico_sw = false , timeout , u_tmp = [] , list_h_length = 0 ;
var tm = function(){ return Date.now() } , t_tmp = 0;
var sa = PoJ_Cfg.show_allow;
var PoJ_act = false , PoJ_ui = false ;
var pos = PoJ_Cfg.i_pos , pos = pos==2?["top","right"]:pos==3?["bottom","right"]:pos==4?["bottom","left"]:["top","left"];

PoJ_Cfg.Switch = Switch;
PoJ_Cfg.click_func = click_func;
PoJ_Cfg.rule_listing = rule_listing;
PoJ_Cfg.close_func = close_func;
Switch();


window.opera.addEventListener('BeforeScript',BF_JS,false);
window.opera.addEventListener('BeforeJavascriptURL',JS_url,false);
window.opera.addEventListener('AfterJavascriptURL',C_Ev,false);
window.opera.addEventListener('BeforeEventListener.click',Event,false);
window.opera.addEventListener('BeforeEventListener.mousedown',Event,false);
window.opera.addEventListener('BeforeEventListener.mouseup',Event,false);
window.opera.addEventListener('AfterEvent.mouseup',C_Ev,false);
window.opera.addEventListener('AfterEvent.click',C_Ev,false);
document.addEventListener('DOMContentLoaded',function(e){ loaded = true; },false);
document.addEventListener('mousedown',function(e){ click_elm = e.target; },false);


function JS_url(e){ JS_link = true; };

function Event(e){
	
	if( PoJ_act ){ e.preventDefault(); return };
	
	Ev = document.getSelection()?false:true;
};

function C_Ev(e){
	Ev = JS_link = PoJ_act = null;
};

function BF_JS(e){

	if( !Pre_HJE ){
		for(var i=0,di;di=HiJack_Evl[i];i++){
			if(di.prototype){
				di.prototype.addEventListener = newAddEvl;
				di.prototype.attachEvent = newAtEvl;
			}else{
				di.addEventListener = newAddEvl;
				di.attachEvent = newAtEvl;
			}
		};
		Pre_HJE = true;
	};

	if( !e.element.src || !PoJ_Cfg.Js_src_wList.test(e.element.src) ){
		Jsa.push(e.element.text);
	};
	
};


function Anchor_click(){
	var url = this.href;
	var f = filter(url);
	// var f_rs = f=="$" || ( f && filter_Host(url) );
	if( this.target.toLowerCase()=="_blank" && f ){
		call_ico(url);
		console.log("Popup of Judge : "+url+"\n"+
					"這是預設封鎖來自模擬點擊連結的彈出視窗,若需要的話,你可以使用白名單解鎖! \n ");
					// This Popup is Call From Simulate Click Action & Blocked By Default,You Can Use whiteList To Unblock If Needed!
		return
	}else{ sa?call_ico(url,true):false; return Old_aClick.apply(this) };
};


function Submit_Pop(e){
	var c = click_elm;
	var url = this.action;
	
	if( this.target.toLowerCase()=="_blank" && c &&
	( ( c.nodeName !== "INPUT" && c.nodeName !== "OPTION" ) || ( c.type!=="submit" && c.type!=="button" ) ) ){
		click_elm = null;
		var f = filter(url);
		var f_rs = f=="$" || ( f && filter_Host(url) );
		if( f_rs ){
			call_ico(url);
			console.log("Popup of Judge : "+url+"\n"+
						"這是預設封鎖來自模擬表單提交模式的彈出視窗,若需要的話,你可以使用白名單解鎖! \n ");
						// This Popup is Call From Simulate Submit Action & Blocked By Default,You Can Use whiteList To Unblock If Needed!
			return
		};
		
		sa?call_ico(url,true):false;
		return Old_Submit.apply(this);
	};
	return Old_Submit.apply(this);
};


function Switch(sw){

	if( sw == 1 || !sw && ls.PoJ_sw ){
		ls.PoJ_sw = 1;
		window.open = Open;
		HTMLAnchorElement.prototype.click = Old_aClick;
		HTMLFormElement.prototype.submit = Old_Submit;
	}else{
		ls.removeItem("PoJ_sw");
		window.open = New_open;
		HTMLAnchorElement.prototype.click = Anchor_click; //HTMLInputElement.prototype.click =
		HTMLFormElement.prototype.submit = Submit_Pop;
	};
	
	try{
		if(PoJ_pause){
			PoJ_act = true;
			PoJ_pause.style.background = ls.PoJ_sw?"darkred":"";
			PoJ_pause.onclick = 'void(PoJ_Cfg.Switch('+(ls.PoJ_sw?2:1)+'))';
		};
	}catch(e){};
};



//-------------------------------------------------------------------------------------------





function call_ico(val,type){

	var val = val || "( No URL! )";
	var n_val = String(val instanceof Array?arguments[0][0]:val);
	var now = tm();
	
	function push_v(l){
		type ? u_tmp[ l % 2 == 1?l:l+1 ] = val : u_tmp[ l % 2 == 0?l:l+1 ] = val;
	};
	
	if( u_tmp.length ){
		var i = 0;
		while( i<u_tmp.length && String( u_tmp[i] instanceof Array?u_tmp[i][0]:u_tmp[i] ).replace(/^!/,"") !== n_val ){
			if( i == u_tmp.length-1 ){ push_v(i+1); break; };
			i++;
		};
	}else{ push_v(0); };
	
	if( ico_sw || now-t_tmp<=2000 || !PoJ_Cfg.show_ico ){return};
	
	t_tmp = now;
	
	if( type ){ return };
	
	if(loaded){
		ico_proc();
	}else{
		document.addEventListener('DOMContentLoaded',ico_proc,false)
	};
};


function ico_proc(val){
	
	ico_sw = true;
	var s = function(){return document.getElementById("PoJ_ico_div")};
	
	if(!sts_ico_ins){
		var stats = document.createElement("div");
		stats.id = "PoJ_ico";
		stats.innerHTML = '<div id="PoJ_ico_div" style="position:fixed; z-index:999999; padding:3px; cursor:pointer;'+
						'-o-transition:opacity 0.2s ease-out,'+
						pos[0]+' 0.25s cubic-bezier(.9,.5,0,.9),'+pos[1]+' 0.25s cubic-bezier(.9,.5,0,.9);'+
						pos[0]+':-20px; '+pos[1]+':-20px;">'+'<img id="PoJ_ico_img" style="" src="'+PoJ_Cfg.icon+'"></img>'+'</div>';
		document.documentElement.appendChild(stats);
		s().addEventListener("click",click_func,false);
		sts_ico_ins = true;
	};
	
	ico_out( s(),pos[0],pos[1],"0px","1" );
	clearTimeout(timeout);
	timeout = setTimeout(ico_out,PoJ_Cfg.timeout*1000,s(),pos[0],pos[1],"-20px","0");
};


function ico_out(tg,pos0,pos1,p_val,opc){
	var tg = tg.style;
	tg.opacity = opc;
	eval("tg." + pos0 + "= \""+p_val+"\"; tg." + pos1 + "= \""+p_val+"\";");
	ico_sw = false;
};


function click_func(o){
	var D = document;
	var func_div = D.getElementById('PoJ_innerFunc');
	var clr_sel_tg = null;
	PoJ_act = true;
	
	if( !func_div ){
		var style = D.createElement("style");
		style.type = "text/css";
		style.innerText = "#PoJ_innerShell , #PoJ_innerShell *{ height:auto; width:auto; box-shadow:none; box-sizing:content-box; float:none; position:static;\
								line-height:normal; }\
							#PoJ_innerShell{ position:fixed; z-index:999999; border:3px solid #555; border-radius:8px; \
								background:#181818 url('"+background+"')repeat-x; }\
							#PoJ_innerShell>#poj_close{ display:block; position:absolute; top:4px; right:4px; border-radius:3px;}\
							#PoJ_innerShell>#poj_close:hover{background:#444;}\
							#PoJ_innerShell>#poj_close:active{background:#000;}\
							#PoJ_NoI{ text-align:center!important; color:#fff; }\
							#PoJ_innerFunc{ min-width:450px; max-width:"+(PoJ_Cfg.max_w)+"px; "+logo+" padding:15px 10px; text-align:right; }\
							#PoJ_innerFunc *{ font-family:arial,tahoma; font-size:1em; text-align:left; vertical-align:middle; }\
							#PoJ_opts *{ -o-transition:background-color .25s ease; }\
							#PoJ_opts{ display:inline-block; position:relative; margin:30px auto 2px 0px; \
								background-color:transparent; max-width:"+(PoJ_Cfg.max_w-155)+"px; }\
							.PoJ_opt{ display:inline-block; position:relative; width:auto; margin:0px 0px 0px 0px; padding:1px 5px; border-radius:5px;\
								background:rgba(0,0,0,0.075); color:#ddd; }\
							.PoJ_opt:hover{ background:rgba(0,0,0,0.5); }\
							.PoJ_opt:active{ background:#111; color:#fff; }\
							.PoJ_opt::selection , #PoJ_opts::selection{ color:#ccc; }\
							#PoJ_list_shell{ max-height:"+(PoJ_Cfg.max_h-75)+"px; border:1px inset #999;\
								border-radius:5px; background:#222; padding:10px 12px; overflow-y:auto; }\
							#PoJ_list_shell *{ overflow-x:hidden; }\
							#PoJ_list_shell *::selection{ background:#660016; color:#fff; }\
							#PoJ_edit{ position:relative; right:0p; }\
							#PoJ_edit_subOption{ position:absolute; background:rgba(190,190,190,0.9); min-width:70px; padding:0px 6px; border:0px solid #ccc; }\
							#PoJ_edit_subOption>*{ text-align:center; padding:0px; margin:5px 0px; border-radius:0px; border:0px; \
								border-bottom:0px solid #000; border-left:5px solid #666; font-weight:bold; color:#333; }\
							#PoJ_edit_wl , #PoJ_edit_bl{ background:rgba(222,222,222,0); }\
							#PoJ_edit_wl:hover{ border-color:#237BD7; background:rgba(222,222,222,0.8); }\
							#PoJ_edit_bl:hover{ border-color:#BE0200; background:rgba(222,222,222,0.8); }\
							.PoJ_u_item{ display:block; white-space:nowrap; padding:4px 0px; }\
							.PoJ_u_item>*{ white-space: nowrap; margin:0px 6px; }\
							.PoJ_a{ display:inline-block; max-width:"+(PoJ_Cfg.max_w-85)+"px; -o-text-overflow:ellipsis; color:#ccc !important; }\
							[class*=\"PoJ_Rule_Class_\"]{ margin:0px 0px 8px 0px; padding:4px 4px; }\
							[class*=\"PoJ_Rule_Class_\"]:last-child{ margin:0; }\
							.PoJ_Rules{ display:inline; padding:0px 0px 0px 10px; color:#ccc; }\
							.PoJ_Rule_Class_a , .PoJ_Rule_Class_b{ border-radius:3px; }\
							.PoJ_Rule_Class_a{ background:rgba(45,87,204,0.5); }\
							.PoJ_Rule_Class_b{ background:rgba(102,0,22,0.5); }\
							#PoJ_Erase{ padding:2.5px; background:#222; border-radius:3px; cursor:pointer; }\
							";
		D.getElementsByTagName("head")[0].appendChild(style);
		var func = D.createElement("div");
		func.id = "PoJ_innerShell" ;
		func.style.top = PoJ_Cfg.top + "px" ;
		func.style.left = PoJ_Cfg.left + "px" ;
		func.innerHTML = '<img id="poj_close" src="'+close_img+'" onclick="void(PoJ_Cfg.close_func())"/>\
						<div id="PoJ_innerFunc"><div id="PoJ_opts">\
						<div id="PoJ_pause" class="PoJ_opt" onclick="void(PoJ_Cfg.Switch('+(ls.PoJ_sw?2:1)+'))"\
						style="'+(ls.PoJ_sw?"background:darkred;":"")+'">Pause</div>\
						<div id="PoJ_stg" class="PoJ_opt">Storage</div>\
						<div id="PoJ_clr" class="PoJ_opt">Clear</div>\
						<div id="PoJ_edit" class="PoJ_opt">+ Rule\
						<div id="PoJ_edit_subOption" class="PoJ_opt" style="display:none;">\
						<div id="PoJ_edit_wl">Allow</div><div id="PoJ_edit_bl">Block</div></div></div></div>\
						<div id="PoJ_list_shell"><div id="PoJ_u_items"><div id=\"PoJ_NoI\">No Pop-up Has Been Handled!</div></div></div>';
						
		D.documentElement.insertBefore(func,document.documentElement.firstChild);
		
		D.addEventListener('click',close_func,false);
		
		func.addEventListener('dblclick',function(e){ e.preventDefault(); },false);
		
		func.addEventListener('mousedown',
			function(e){
				var cTarget = e.target;
				PoJ_act = true;
				if( cTarget instanceof HTMLAnchorElement ){ return };
				e.preventDefault();
				
				switch(cTarget){
					case PoJ_edit_wl :
					break
					case PoJ_edit_bl :
					break
					case PoJ_edit : 
					break
					case PoJ_innerFunc : move_func(e.clientY,e.clientX)
					default : click_rule_subMenu(1)
				};
			}
		,false);
		
		func.addEventListener('click',
			function(e){
				var cTarget = e.target;
				var subject = cTarget.id || cTarget.className;
				PoJ_act = true;
				
				switch(subject){
					case "poj_close" :
					break
					case "PoJ_a" : e.preventDefault()
					break
					case "PoJ_cb" : RuleSet(cTarget)
					break
					case "PoJ_type_img" : try{ alert( cTarget.parentNode.getAttribute("val") ) }catch(e){};
					break
					case "PoJ_edit" : click_rule_subMenu()
					break
					case "PoJ_edit_wl" : 
						RuleSet(false,2);
						click_rule_subMenu(1);
					break
					case "PoJ_edit_bl" : 
						RuleSet(false,1)
						click_rule_subMenu(1);
					break
					case "PoJ_stg" : rule_listing()
					break
					case "PoJ_clr" : 
						if( confirm("Del All Rule ? ( And Also Clear All History )") ){
							ls.removeItem("PoJ_stg_filter");
							if( PoJ_list_shell.firstChild.id == "PoJ_rule_stg_shell" ){ rule_listing() };
							common_renew_inner(PoJ_list_shell.firstChild,"<div id=\"PoJ_NoI\">No Pop-up Has Been Handled!</div>",1);
							list_h_length = 0
							u_tmp = [];
						};
						
					default : window.getSelection().removeAllRanges();
				};
			}
		,false);
	};
	
	PoJ_innerShell.style.display = "block" ;
	window.PoJ_ui_act = true;
	common_listing(u_tmp);
};


function close_func(e){
	var e = e ? e.target : false;
	if( !e || ( window.PoJ_ui_act && !(/^PoJ_/.test(e.id||e.className)) ) ){
		PoJ_innerShell.style.display = "none";
		click_rule_subMenu(1);
		window.PoJ_tmp_Node ? rule_listing(0,0,1) : false;
		window.PoJ_ui_act = null;
	};
};


function move_func(ey,ex){

	var elm_sty = PoJ_innerShell.style;
	var ct = elm_sty.pixelTop;
	var cl = elm_sty.pixelLeft;
	PoJ_act = false;
	elm_sty.cursor = "move";
	
	function move(e){
		elm_sty.pixelTop = ct + ( e.clientY - ey );
		elm_sty.pixelLeft = cl + ( e.clientX - ex );
	};
	
	document.addEventListener("mousemove",move,false);
	
	document.addEventListener("mouseup",
		function up(e){
			elm_sty.cursor = "default";
			document.removeEventListener("mousemove",move,false);
			document.removeEventListener("mouseup",up,false);
		}
	,false);
	
};


function rule_listing( del_val , renew , ToMain ){

	if( renew && del_val ){ ls.PoJ_stg_filter = ls.PoJ_stg_filter.replace(del_val,""); };
	
	var target = PoJ_list_shell.firstChild , htm_str , reprocNd;
	var data = ls.PoJ_stg_filter;
	var rule_html = document.createElement('div');
	rule_html.id = "PoJ_rule_stg_shell";
	data ? eval("data = {"+ls.PoJ_stg_filter+"}") : data = "<div id=\"PoJ_NoI\">Empty!</div>";
	
	if( target.id !== "PoJ_rule_stg_shell" && !ToMain ){
		PoJ_stg.style.background = "#000";
		window.PoJ_tmp_Node = target.cloneNode(true);
	}else if( !renew ){
		PoJ_stg.style.background = "";
		PoJ_list_shell.replaceChild(PoJ_tmp_Node,target);
		common_renew_item(0,0,true);
		window.PoJ_tmp_Node = null;
		return
	};
	
	if( typeof data == "object" ){
		var tmp = "";
		for( var i in data ){
			var type = i.indexOf("$")==0 ;
			tmp += "<div class=\"PoJ_Rule_Class_"+ ( type ? "b" : "a" ) +"\">\
						<img id=\"PoJ_Erase\" val=\""+i+":\'"+data[i]+"\',"+"\" \
						onclick=void(PoJ_Cfg.rule_listing(this.getAttribute(\"val\"),true)) src=\""+erase_img+"\"/>\
						<div class=\"PoJ_Rules\">"+data[i]+"</div></div>";
		};
		data = tmp;
	};
	
	rule_html.innerHTML = data ;
	PoJ_list_shell.replaceChild(rule_html,target);
};


function click_rule_subMenu( hide ){
	
	if( hide || PoJ_edit_subOption.style.display == "inline" ){
		PoJ_edit_subOption.style.display = "none";
		PoJ_edit.style.background = "";
		return
	};
	
	PoJ_edit.style.background = "#111";
	PoJ_edit_subOption.style.display = "inline";
	PoJ_edit_subOption.style.top = PoJ_edit.clientHeight*0.7+"px";
	PoJ_edit_subOption.style.left = PoJ_edit.clientWidth+3+"px";
};


function RuleSet(elm,enterMode){
	
	if( enterMode ){
		var url = prompt( ( enterMode == 1 ? "Block" : "Allow" ) , "" ) ;
		if(!url){ return };
	};
	
	var ep = elm ? elm.parentNode : false , data , rs , type;
	var type = elm ? ep.getAttribute("type") : false;
	var url = url ? url : fix_Url( ep.getAttribute("val") );
	
	ls.PoJ_stg_filter ? false : ls.PoJ_stg_filter = "";
	eval("data = {"+ls.PoJ_stg_filter+"}");
		
	rs = common_renew_item(data,url,false);
	
	if( !rs || enterMode ){
		ls.PoJ_stg_filter = ( ( enterMode == 1 || ( !enterMode && type == "allowed" ) ) ?"$___":"A___")+tm()+":\'"+url+"\'," + ls.PoJ_stg_filter ;
	}else{
		
		if( enterMode ){
			ls.PoJ_stg_filter = ( rs.indexOf("A") == 0 ? rs.replace( /^A/,"$" ) : rs.replace( /^\$/,"A" ) ) + ls.PoJ_stg_filter ;
		};
		
		ls.PoJ_stg_filter = ls.PoJ_stg_filter.replace(rs,"") ;
	};
	
	window.PoJ_tmp_Node ? rule_listing(0,1) : common_renew_item(0,0,1); // window.PoJ_tmp_Node 是狀態檢測(網址列表or規則列表)
	
	// console.log(ls.PoJ_stg_filter);
};
	

function common_renew_item(filter_obj,str,renew){
	
	var collect = document.getElementsByClassName('PoJ_u_item');
	var dup = false;
	
	if( filter_obj && str ){
		for(var i in filter_obj){
			if( filter_obj[i] == str ){ dup = i+":\'"+filter_obj[i]+"\',"; break };
		};
	};
	
	if( renew ){
	
		for(var i=0,ci;ci=collect[i];i++){
		
			var target_str = ci.getAttribute("val");
			var cb = ci.getElementsByClassName('PoJ_cb')[0];
			var img = ci.getElementsByTagName('img')[0];
			var type = ci.getAttribute("type");
			var rs = filter(target_str);
			// alert(filter(target_str));
			if( ( rs && !target_str.indexOf("/") == 0 ) || rs == "$" ){
				ci.setAttribute("type","blocked");
				img.src = type_img_b;
				cb.checked = false;
			}else{
				ci.setAttribute("type","allowed");
				img.src = type_img_a;
				cb.checked = true;
			};
		};
	};
	
	return dup;
};


function common_renew_inner(outerElm,inner,mode){

	var reprocNd = outerElm.cloneNode(true);
	
	mode == 1 ? reprocNd.innerHTML = String(inner) : 
			( reprocNd.innerHTML = PoJ_Cfg.sort ? String(inner) + reprocNd.innerHTML : reprocNd.innerHTML + String(inner) ) ;
	outerElm.parentNode.replaceChild(reprocNd,outerElm);
	
};


function common_listing( o_arr ){

	var ul = o_arr.length;
	
	if( list_h_length !== ul ){
		
		PoJ_NoI.style.display = "none";
		
		for(var i=0;i<ul;i++){
		
			if( !u_tmp[i] || u_tmp[i].toString().indexOf("!")==0 ){ continue };
			
			var u = u_tmp[i];
			var type = u instanceof Array?0:1;
			var open_str = type==0 ? String(fix_ar_for_open(u)) : "\'"+String(u)+"\'";
			
			type == 0 ? u_tmp[i][0] = "!" + String(u_tmp[i][0]) : u_tmp[i] = "!" + String(u_tmp[i]);
			
			var ui = type == 0 ? u[0] : u ;
			var handle_type = i % 2 == 0 ? false : true ;
			ui = ui.replace(/^!/,"");
			
			var uhtml = '<div class="PoJ_u_item" type="'+(handle_type?"allowed":"blocked")+'" val="'+ui+'">\
			<input class="PoJ_cb" type="checkbox" '+(handle_type?"checked=\"true\"":"")+'>\
			<img class="PoJ_type_img" src="'+(handle_type?type_img_a:type_img_b)+'"/>\
			<a class="PoJ_a" target="_blank" href="'+ui+'" onclick="(function PoJ_open(){window.open('+open_str+')})();">'+ui+ '</a><br/></div>';
			
			common_renew_inner(PoJ_u_items,uhtml,2);
		};
		
		list_h_length = ul;
		common_renew_item(0,0,true); // ??
	};
	
	function fix_ar_for_open(o){
		var str = [];
		for(var i=0,si;si=o[i];i++){ str.push("\'"+String(si)+"\'") };
		return str 
	};
	
};


function fix_Url(str){ return ( str && str.indexOf("/") == 0 ) ? str : str ? str.replace(/^https?:\/\//i,"").replace(/\/.+/i,"") : "" };


function filter(url){

	if(!url){return false};
	
	var stg_filter = ls.PoJ_stg_filter , stg_l , all_l;
	var js_l = PoJ_Cfg.whiteList;
	stg_filter ? eval("stg_l = {"+ls.PoJ_stg_filter+"}") : false;
	
	if( stg_l ){
	
		for(var i in js_l){
			stg_l[i] = js_l[i];
		};
		
		all_l = stg_l;
	}else{
		all_l = js_l;
	};
	
	for(var i in all_l){
		var ai = all_l[i];
		var filter_pre_spl = ( ai.indexOf(".") == -1 || /[\*\/]/g.test(ai) ) ? String(ai.split("*")) : false;
		var new_url = filter_pre_spl ? url : fix_Url(url);
		var all_l_reg = filter_pre_spl?
					new RegExp( "^" + filter_pre_spl.replace(/\./g,"\\.").replace(/,/g,".*") , "i" ):
					new RegExp( ai.replace(/\./g,"\\.") , "i" );
					// alert(all_l_reg);
		if( all_l_reg.test(new_url) ){return i.indexOf("$")==0?"$":false};
	};

return true;
};


function filter_Host(url){
	var url = url.indexOf("/")==0?false:fix_Url(url);
	
	if( PoJ_Cfg.block_ALL || ( url && url.indexOf(fixed_host)==-1 ) ){
		return true
	};
	return false
};


function New_open(URL,n,f,r){
					var caller = window.open.caller?window.open.caller:false;
					var call_from_poj = caller && window.open.caller.name == "PoJ_open";
					var agar = [];
					var sts_chk = false;

					if( !URL ){
						if( !PoJ_Cfg.NoHref_Block || (!Ev && JS_link) ){
							JS_link = null;
							return Open();
						}else{ console.log("Popup of Judge : No URL! \n "); JS_link = null; call_ico(); return }; 
					};
					
					var URL = String(URL);
					var f_result = filter(URL);
					
					for(var i in arguments){ agar.push(arguments[i]) };
					
					if( f_result == "$" && !call_from_poj ){ console.log("Popup of Judge : "+URL+"\n "); Ev = JS_link = null; call_ico(agar); return; };
								
					if( Ev && caller ){
						while( caller.caller ){ caller = caller.caller };
						if( String(Pre_Eva).indexOf(String(caller))>-1 || JS_link ){ sts_chk = true; };
					};

					if( !sts_chk && caller && ( String(caller).indexOf("anonymous(event)") == 9 || String(Jsa).indexOf(String(caller))>-1 ) ){
						sts_chk = true; 
					};
				
					if( !sts_chk || call_from_poj ){
						Ev = JS_link = null; return Open.apply(this,arguments);
					};
					
					if( f_result && filter_Host(URL) ) {
						console.log("Popup of Judge : "+URL+"\n ");
						Ev = JS_link = null;
						call_ico(agar);
						return;
					};
				
					Ev = JS_link = null;
					sa?call_ico(agar,true):false;
					return Open.apply(this,arguments);
					
			};

})()