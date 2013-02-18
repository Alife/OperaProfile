// ==UserScript==
// @name Translator
// @author NLF
// @version 1.6.5
// @create 2010.3.27
// @last mod 2010.11.26
// @description 这样调用 javascript:N_google_translate('auto','zh-cn')
// ==/UserScript==

var N_t_set={
Dicn_enable:true										,//是否启用 <<海词>>;
zdic_enable:false									,//是否启用 <<汉典>>;
////////////////////////////////////////
ctrl_s_enable:[true,'ctrl']							,//按住ctrl/alt键划词翻译,如果使用alt键,请改 ctrl 为 alt
		C_FT:['auto','zh-cn']								,//ctrl键划词翻译模式启动时翻译状态;
///////////////////////////
bgc:'#8BBFED'												,//UI界面颜色
};

//选中文字后,鼠标的位置
document.addEventListener('mouseup',function(e){
	N_t_set.lastClientX = e.clientX;
	N_t_set.lastClientY = e.clientY;
	N_t_set.lastPageX = e.pageX;
	N_t_set.lastPageY = e.pageY;
	N_t_set.lastClickE = e.target;
	N_t_set.lastClick_ta=null;
	var etnn=N_t_set.lastClickE.nodeName.toLowerCase();
	//找到最后一次点击的文本编辑区
	if(etnn=='textarea' || (etnn=='input' && N_t_set.lastClickE.type=='text')){
		N_t_set.lastClick_ta=N_t_set.lastClickE
		//alert(N_t_set.lastClick_ta)
	};
},false);


//右键命令调用函数
function N_google_translate(from,target){
	if(arguments.length<2){return;};
	var s_text=N_t_getsel();
	if (!s_text){return;};
	from.toLowerCase();
	target.toLowerCase();
	//创建用户界面
	N_translate_box();
	var options=document.getElementById('N_t_tl').options;
	for(var i=0,ii=options.length;i<ii;i++){
		if(options[i].value.toLowerCase()==target){options[i].selected=true;break;}
	};
	var options=document.getElementById('N_t_ol').options;
	for(var i=0,ii=options.length;i<ii;i++){
		if(options[i].value.toLowerCase()==from){options[i].selected=true;break;}
	};
	N_t_translation_request(from,target,s_text)
};

//谷歌翻译请求
function N_google_request(from,target,s_text){
	if (from=='auto'){var from=''};
	if (!window.opera){N_google_request_FX(from,target,s_text);return;};
	if(N_t_set.script){
		document.getElementsByTagName('head')[0].removeChild(N_t_set.script);
		N_t_set.script=null;
	};
	N_t_set.script=document.createElement('script');
	N_t_set.script.setAttribute('type','text/javascript');
	document.getElementsByTagName('head')[0].appendChild(N_t_set.script);
	var src="http://ajax.googleapis.com/ajax/services/language/translate?q=" + s_text + "&langpair=" + from + "|" + target + "&v=1.0&callback=N_google_callback"
	//alert(src)
	N_t_set.script.src=src;
};

function N_google_request_FX(from,target,s_text){
	GM_xmlhttpRequest({
		method: 'GET',
		url: "http://ajax.googleapis.com/ajax/services/language/translate?q=" + s_text + "&langpair=" + from + "|" + target + "&v=1.0",
		onload: function(resp) {
				//alert(resp.responseText);
				//eval.call(window,resp.responseText);
				eval('var Fxjson='+resp.responseText);
				N_google_callback(Fxjson);
				//N_google_callback(resp.responseText.match(/"translatedtext":"(.*?)"(?:,"detectedSourceLanguage"|}, "responseDetails")/i)[1]);
			}
	});
};

//谷歌翻译结果回调
function N_google_callback(json){
	var result;
	if (json.responseStatus!=200){
		result='<b>错误:</b>'+json.responseStatus +' ' + json.responseDetails;
	}else{
		result=json.responseData.translatedText;
		//result+=json.responseData.detectedSourceLanguage? '<br /><br />>>当前检测语言为:<b>'+json.responseData.detectedSourceLanguage+'</b>':'';
		result+=N_t_set.overflow? '<br /><b>>>字数太多部分被省略...</b>':''
	};
	document.getElementById("N_t_g_ajax").innerHTML = result;
	N_t_set.overflow=false;
};

//翻译UI界面创建
function N_translate_box(){
	if (N_t_set.box){
		return;
	};
	var divstyle=document.createElement('style');
	divstyle.setAttribute('type','text/css');
	divstyle.innerHTML='\
								#N_t_rq {\
								background-color:'+N_t_set.bgc+';\
								border:1px solid white;\
								border-radius:5px 5px 2px 2px;\
								-moz-border-radius:5px 5px 2px 2px;\
								padding:2px;\
								max-width:333px;\
								font-size:13px;\
								/*box-shadow:0 0 3px;*/\
							}\
							#N_t_title {\
								text-align:right;\
								cursor:move;\
							}\
							#N_t_otext {\
								width:100%;\
								height:60px;\
								border:none;\
								margin:0;\
								padding:0;\
								outline:1px solid #6DBDF8;\
								font-size:13px;\
							}\
							#N_t_otext:hover {\
								outline:1px solid #06F;\
							}\
							#N_t_tool {\
								border-top:1px solid #FFF;\
								border-bottom:1px solid #FFF;\
								text-align:right;\
							}\
							#N_t_g_ajax {\
								color:#000;\
								text-align:left;\
								border-top:1px solid '+N_t_set.bgc+';\
								padding:0 5px;\
							}\
							#N_t_z_iframe,#N_t_D_iframe{\
								padding-left:5px;\
								border-top:1px solid '+N_t_set.bgc+';\
							}\
							#N_t_gglogo,#N_t_zlogo,#N_t_Dlogo{\
								cursor:pointer;\
								background-color:'+N_t_set.bgc+';\
								padding-left:3px;\
								width:88px;\
								text-align:left;\
								border:1px solid #ccc;\
								border-bottom:none;\
								border-left:none;\
							}\
							#N_t_gglogo>img,#N_t_zlogo>img,#N_t_Dlogo>img{\
								width:16px;\
								height:16px;\
								border:none;\
								display:inline;\
							}\
							#N_t_gglogo_d,#N_t_zlogo_d,#N_t_Dlogo_d{\
								float:right;\
							}\
							#N_t_gglogo:hover,#N_t_zlogo:hover,#N_t_Dlogo:hover{\
								color:white;\
								text-shadow:0 0 5px #000;\
							}\
							#N_t_otext_CE{\
								float:left;\
								cursor:pointer;\
								padding:0 2px;\
								font-size:16px;\
							}\
							#N_t_otext_CE:hover{\
								text-shadow:0 0 3px #000;\
							}'
	var div=document.createElement('div');
	div.style.cssText='position:absolute;font-size:13px;z-index:99999;top:-9999px;left:20px;'
	div.id='N_t_rq';
	div.innerHTML='\
						<div id="N_t_title" title="双击展开源文字">\
							<span id="N_t_otext_CE" title="单击展开源文字" >＞</span>\
							<input title="位置固定" type="checkbox" id="N_t_fixed" style="vertical-align:top;width:18px;height:18px;margin-right:6px;cursor:pointer;" />\
							<input title="划词模式" type="checkbox" id="N_t_selectedT" style="vertical-align:top;width:18px;height:18px;margin-right:10px;cursor:pointer;" />\
							<img title="关闭" id="N_t_close" style="width:18px;height:18px;padding:0;margin:0;border:none;cursor:pointer;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA  IGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHWSURBVHjanJTNbtNQ  EIW/uXaE5ThIUWkRvASCBd2BhBAsuiuoD4AE5Y1apxFxkxUIxIoFP1IXLJAoQjxDlwgoyk9TV/Ed  FrdOHcdZhNlYnnvPseecmRFVBSB+9UlP0xGoUAwBlOoIgpDtrfsCIKpK5+2B3l2/xeVGhOd5hasW  EUGn5BYwAEwmE4ajEw6+fOPJ5j2R3Zcf9eGddcKowVqEsET8HFo9GQx4//kQk6ZjonqwNAnAWmQk  DEMEi1FVxNT43/D8GkEQ4Fcdbjx6rk4PePemJRf5Z5qheMhMXkScclKypdvboQjOn1bAQ+j24rmP  G4BJKbkSinT2d+fIjMJ+r8VKKNO/yRSyLMOIyEIhk26MFLoo6cZcCatNMRYl0+qWW62LaAG3WpeF  zhrRxY7kJeUiTt8LkalirXUaqcpiEgx7Sasi70JVLlwrV7bx+KnmtraTHa5HIi+S+ByoM2SWDFV1  fVSuvN3ZOx9V4VrDiXS1IdJOWjp33zpOHyBNU+DS9MyB58vNSWc0OlNOx2eYIIjo94ccHaPLjsfR  Mfp30Mer+W6NxK8/6O0bN2k2m/h+YWpcdagq5X6z1vL71x++/vjO9tYDkeJiG49HU0AZXEVWXGz/  BgCqaMnGV1Cc2AAAAABJRU5ErkJggg==" />\
						</div>\
						<textarea wrap="on" name="N_t_otext" id="N_t_otext" style="display:none"></textarea>\
						<div id="N_t_tool">\
							<select id="N_t_ol" title="源语言" size="1">\
								<option value="auto">自动检测</option>\
								<option value="separator" disabled="">---</option>\
								<option value="zh-cn">简体中文</option>\
								<option value="en">英语</option>\
								<option value="ja">日语</option>\
								<option value="zh-tw">繁体中文</option>\
								<option value="ru">俄语</option>\
								<option value="fr">法语</option>\
								<option value="ko">韩语</option>\
							</select>\
							<span id="N_t_otswitch" title="切换 源/目标 语言" style="cursor:pointer;font-size:18px;">≒</span>\
							<select id="N_t_tl" title="目标语言" size="1">\
								<option value="zh-cn">简体中文</option>\
								<option value="en">英语</option>\
								<option value="ja">日语</option>\
								<option value="zh-tw">繁体中文</option>\
								<option value="ru">俄语</option>\
								<option value="fr">法语</option>\
								<option value="ko">韩语</option>\
							</select>\
							<input id="N_t_tbutton" type="button" value="翻译" />\
						</div>\
						<div style="background-color:#fff">\
							<div id="N_t_ggfy">\
								<div id="N_t_gglogo">\
									<img alt="" style="" src="http://www.google.cn/favicon.ico" />\
									<span>google</span>\
									<span id="N_t_gglogo_d">∨</span>\
								</div>\
								<div id="N_t_g_ajax" >\
									<b>...请稍后...</b>\
								</div>\
							</div>\
							<div id="N_t_Dict" style="display:none;margin-top:10px;">\
								<div id="N_t_Dlogo">\
									<img alt="" src="http://dict.cn/favicon.ico" />\
									<span>海词</span>\
									<span id="N_t_Dlogo_d">＞</span>\
								</div>\
								<div id="N_t_D_iframe" style="display:none;">\
								</div>\
							</div>\
							<div id="N_t_zdic" style="display:none;margin-top:10px;">\
								<div id="N_t_zlogo">\
									<img alt="" src="http://www.zdic.net/favicon.ico" />\
									<span>汉典<span>\
									<span id="N_t_zlogo_d">＞</span>\
								</div>\
								<div id="N_t_z_iframe" style="display:none;">\
								</div>\
							</div>\
						</div>';
	document.getElementsByTagName('head')[0].appendChild(divstyle);
	document.body.appendChild(div);
	//关闭UI
	document.getElementById('N_t_close').addEventListener('click',function(){
		document.getElementById('N_t_rq').style.display='none';
		document.removeEventListener('mouseup',N_t_huaci,false);
	},false);

	//左键点击界面时,取消选取...
	document.getElementById('N_t_rq').addEventListener('mousedown',function(e){
		//阻止冒泡是必要的..原因不告诉你.
		e.stopPropagation();
		if(e.button!=0){return;};
		window.getSelection().removeAllRanges();
	},false);

	//移动UI
	document.getElementById('N_t_title').addEventListener('mousedown',function(e){
		e.preventDefault();
		var grabX = e.clientX;
		var grabY = e.clientY;
		var rq=document.getElementById('N_t_rq');
		var origX = parseInt(rq.style.left) || parseInt(rq.style.right);
		var origY = parseInt(rq.style.top) || parseInt(rq.style.bottom);
		function dndm(e){
			if(rq.style.left){
				rq.style.left = origX+e.clientX-grabX+'px';
			}else{
				rq.style.right = origX-(e.clientX-grabX)+'px';
			};
			if(rq.style.top){
				rq.style.top=origY+e.clientY-grabY+'px';
			}else{
				rq.style.bottom=origY-(e.clientY-grabY)+'px';
			};
		};
		document.addEventListener('mousemove',dndm, false);
		document.addEventListener('mouseup',function(){
			document.removeEventListener('mousemove', dndm, false);
			document.removeEventListener('mouseup', arguments.callee, false);
		},false);
	},false);

	//显隐 源文字
	document.getElementById('N_t_title').addEventListener('dblclick',function(e){
		e.stopPropagation();
		e.preventDefault();
		var textarea=document.getElementById('N_t_otext');
		textarea.style.display=textarea.style.display=='none'? '':'none';
		document.getElementById('N_t_otext_CE').innerHTML=textarea.style.display=='none'? '＞':'∨';
	},false);

	//单击按钮显隐 源文字
	document.getElementById('N_t_otext_CE').addEventListener('click',function(e){
		var textarea=document.getElementById('N_t_otext');
		textarea.style.display=textarea.style.display=='none'? '':'none';
		this.innerHTML=textarea.style.display=='none'? '＞':'∨';
	},false);

	//切换 源和目标语言
	document.getElementById('N_t_otswitch').addEventListener('click',function (){
		var fromselect=document.getElementById('N_t_ol');
		var from=fromselect.options[fromselect.selectedIndex].value.toLowerCase();
		if (from=='auto'){return;};
		var targetselect=document.getElementById('N_t_tl');
		var target=targetselect.options[targetselect.selectedIndex].value.toLowerCase();
		if (from==target){return;};
		for(var i=0,ii=fromselect.options.length;i<ii;i++){
			if(fromselect.options[i].value.toLowerCase()==target){fromselect.options[i].selected=true;break;}
		};
		for(var i=0,ii=targetselect.options.length;i<ii;i++){
			if(targetselect.options[i].value.toLowerCase()==from){targetselect.options[i].selected=true;break;}
		};
	},false);

	//翻译按钮
	document.getElementById('N_t_tbutton').addEventListener('click',function (){
		var s_text=document.getElementById('N_t_otext').value;
		if (s_text==''){return;};
		//alert(s_text);
		var fromselect=document.getElementById('N_t_ol');
		var from=fromselect.options[fromselect.selectedIndex].value.toLowerCase();
		//alert(from);
		var targetselect=document.getElementById('N_t_tl');
		var target=targetselect.options[targetselect.selectedIndex].value.toLowerCase();
		//alert(target);
		N_t_translation_request(from,target,s_text);
	},false);

	//显隐谷歌词典
	document.getElementById('N_t_gglogo').addEventListener('click',function(){
		var google=document.getElementById('N_t_g_ajax');
		google.style.display=google.style.display=='none'? '':'none';
		document.getElementById('N_t_gglogo_d').innerHTML=google.style.display=='none'? '＞':'∨';
	},false);

	//显隐海词词典
	document.getElementById('N_t_Dlogo').addEventListener('click',function(){
		var D=document.getElementById('N_t_D_iframe');
		D.style.display=D.style.display=='none'? '':'none';
		document.getElementById('N_t_Dlogo_d').innerHTML=D.style.display=='none'? '＞':'∨';
	},false);

	//显隐汉典词典
	document.getElementById('N_t_zlogo').addEventListener('click',function(){
		var z=document.getElementById('N_t_z_iframe');
		z.style.display=z.style.display=='none'? '':'none';
		document.getElementById('N_t_zlogo_d').innerHTML=z.style.display=='none'? '＞':'∨';
	},false);

	//划词模式
	document.getElementById('N_t_selectedT').addEventListener('change',function(){
		if(this.checked){
			document.addEventListener('mouseup',N_t_huaci,false);
		}else{
			document.removeEventListener('mouseup',N_t_huaci,false);
		};
	},false);

	//固定窗口
	document.getElementById('N_t_fixed').addEventListener('change',function(){
		var rq=document.getElementById('N_t_rq');
		//窗口固定
		if(this.checked){
			//是相对于底还是顶
			if (rq.style.bottom==''){
				var rqtop=parseInt(rq.style.top) - window.scrollY+'px';
				rq.style.top=rqtop;
			}else{
				var rqbottom=parseInt(rq.style.bottom) + window.scrollY+'px';
				rq.style.bottom=rqbottom;
			};
			//是相对于右还是左
			if(rq.style.right==''){
				var rqleft=parseInt(rq.style.left) - window.scrollX+'px';
				rq.style.left=rqleft;
			}else{
				var rqright=parseInt(rq.style.right) + window.scrollX+'px';
				rq.style.right=rqright;
			};
			document.getElementById('N_t_rq').style.position='fixed';
			N_t_set.fixedW=true;
		//取消窗口固定
		}else{
			if (rq.style.bottom==''){
				var rqtop=parseInt(rq.style.top) + window.scrollY+'px';
				rq.style.top=rqtop;
			}else{
				var rqbottom=parseInt(rq.style.bottom) - window.scrollY+'px';
				rq.style.bottom=rqbottom;
			};
			if(rq.style.right==''){
				var rqleft=parseInt(rq.style.left) + window.scrollX+'px';
				rq.style.left=rqleft;
			}else{
				var rqright=parseInt(rq.style.right) - window.scrollX+'px';
				rq.style.right=rqright;
			};
			document.getElementById('N_t_rq').style.position='absolute';
			N_t_set.fixedW=false;
		};
	},false);

	//判断最后一次的mouseup是否在界面上触发.如果是的话,那么翻译的时候不要去移动窗口
	document.getElementById('N_t_rq').addEventListener('mouseup',function(){
		if(!N_t_set.l_click_onUI){
			document.addEventListener('mousedown',function(){
				N_t_set.l_click_onUI=false;
				//alert('取消了');
				document.removeEventListener('mousedown',arguments.callee,false);
			},false);
		};
		N_t_set.l_click_onUI=true;
	},false);

	//表示已创建了UI;
	N_t_set.box=true;
};

//消息监听
window.addEventListener('message', function(e){
	//alert(e.data);
	//alert(e.origin);
	try{
		//alert(window.top.document.body.innerHTML);
	}catch(error){
		//alert(error.message)
	};

	//alert(window.document.body.innerHTML);
	switch(e.data){
		case 'Dict_loaded':{
			var unfind=document.evaluate('//div[@id="g"]',document,null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
			//alert(e.origin);
			//alert(e.source.document.body.innerHTML);
			//alert(e.source.postMessage);
			if(unfind){
				e.source.postMessage('Dict_collapse','*');
				//window.parent.postMessage('Dict_collapse','*');
			}else{
				e.source.postMessage('Dict_expand','*');
				//window.parent.postMessage('Dict_expand','*');
			};
		};break;
		case 'Dict_collapse':{
			var D=document.getElementById('N_t_D_iframe');
			D.style.display='none';
			document.getElementById('N_t_Dlogo_d').innerHTML=D.style.display=='none'? '＞':'∨';
		};break;
		case 'Dict_expand':{
			var D=document.getElementById('N_t_D_iframe');
			D.style.display='';
			document.getElementById('N_t_Dlogo_d').innerHTML=D.style.display=='none'? '＞':'∨';
		};break;
	///////////////////
		case 'zdic_loaded':{
			var unfind=document.body.textContent.length<100;
			if(unfind){
				e.source.postMessage('zdic_collapse','*');
			}else{
				e.source.postMessage('zdic_expand','*');
			}
		};break;
		case 'zdic_collapse' :{
			var z=document.getElementById('N_t_z_iframe');
			z.style.display='none';
			document.getElementById('N_t_zlogo_d').innerHTML=z.style.display=='none'? '＞':'∨';
		};break;
		case 'zdic_expand' :{
			var z=document.getElementById('N_t_z_iframe');
			z.style.display='';
			document.getElementById('N_t_zlogo_d').innerHTML=z.style.display=='none'? '＞':'∨';
		};break;
		default:break;
	}
},false)

//海词请求释义
function N_Dict_request(s_text){
	if(!N_t_set.Dicn_enable){return;};
	if(!N_t_set.iframe){
		N_t_set.iframe=document.createElement('iframe');
		N_t_set.iframe.width='100%';
		N_t_set.iframe.frameBorder="0";
		document.getElementById('N_t_D_iframe').appendChild(N_t_set.iframe);
		document.getElementById('N_t_Dict').style.display='';
		//读取完成后,发生消息
		N_t_set.iframe.addEventListener('load',function(){
			//alert(this.contentWindow.top.postMessage)
			//this.contentWindow.top.postMessage('wo a a a ','http://www.google.com.hk/')
			//this.contentWindow.top.postMessage('Dict_loaded','http://dict.cn/');
			this.contentWindow.postMessage('Dict_loaded','*');
		},false);
	};
	var src="http://dict.cn/mini.php?utf8=1&q="+s_text;
	N_t_set.iframe.src=src;
};

//汉典请求
function N_zdic_request(s_text){
	if(!N_t_set.zdic_enable){return;};
	if(!N_t_set.ziframe){
		N_t_set.ziframe=document.createElement('iframe');
		N_t_set.ziframe.width='100%';
		N_t_set.ziframe.frameBorder="0";
		document.getElementById('N_t_z_iframe').appendChild(N_t_set.ziframe);
	};
	var src="http://www.zdic.net/search/?c=3&q="+s_text;
	N_t_set.ziframe.src=src;
	document.getElementById('N_t_zdic').style.display='';
		//读取完成后,发生消息
	N_t_set.ziframe.addEventListener('load',function(){
		this.contentWindow.postMessage('zdic_loaded','*');
	},false);
};

//获取所选
function N_t_getsel(){
	var t=N_t_set.lastClick_ta;
	//ORZ..document.getSelection()返回的是string ..window.getSelection()返回了是object;
	var s_text=window.getSelection();
	if (s_text=='' && t){s_text=t.value.substring(t.selectionStart, t.selectionEnd);};
	//转成字符串
	s_text+='';
	//alert(s_text)
	//没有被选择的文字,那么返回false;
	return s_text? s_text:false;
}

//划词
function N_t_huaci(e){
	//只接受左键的触发;
	if(e.button!=0){return;};
	var s_text=N_t_getsel();
	if (!s_text){return;}
	//来个延时.
	if(N_t_set.timeout){clearTimeout(N_t_set.timeout)};
	N_t_set.timeout=setTimeout(huaci,300);
	function huaci(){
		var fromselect=document.getElementById('N_t_ol');
		//火狐,第一次启动时,需要创建UI
		if(!fromselect){
			N_google_translate(N_t_set.C_FT[0],N_t_set.C_FT[1]);
			return;
		};
		var from=fromselect.options[fromselect.selectedIndex].value.toLowerCase();
		var targetselect=document.getElementById('N_t_tl');
		var target=targetselect.options[targetselect.selectedIndex].value.toLowerCase();
		N_t_translation_request(from,target,s_text);
	};
};

//请求翻译
function N_t_translation_request(from,target,s_text){
	//如果窗口隐藏了,就唤醒它.
	if(document.getElementById('N_t_rq').style.display=='none'){
		document.getElementById('N_t_rq').style.display='';
		if(document.getElementById('N_t_selectedT').checked){
			document.addEventListener('mouseup',N_t_huaci,false);
		};
	};
	document.getElementById('N_t_otext').value=s_text;
	s_text=encodeURIComponent(s_text);
	//在界面上点击 翻译 按钮和 固定窗口 和 在界面上取词时,不要调整窗口位置;
	if(!N_t_set.fixedW && !N_t_set.l_click_onUI){
		//如果在接近底部的地方取词
		if (N_t_set.lastClientY/window.innerHeight>=4/7){
			document.getElementById('N_t_rq').style.removeProperty('top');
			document.getElementById('N_t_rq').style.bottom=window.innerHeight - N_t_set.lastPageY + 16 +'px';
		}else{
			document.getElementById('N_t_rq').style.removeProperty('bottom');
			document.getElementById('N_t_rq').style.top=N_t_set.lastPageY + 16 +'px';
		};
		//如果在接近右边距的地方取词
		if(N_t_set.lastClientX/window.innerWidth>=4/7){
			document.getElementById('N_t_rq').style.removeProperty('left');
			document.getElementById('N_t_rq').style.right=window.innerWidth- N_t_set.lastPageX + 16 + 'px';
		}else{
			document.getElementById('N_t_rq').style.removeProperty('right');
			document.getElementById('N_t_rq').style.left=N_t_set.lastPageX + 16 + 'px';
		}
	}else{
		N_t_set.l_click_onUI=false;
	};
	//如果超过的最大的字符数,那么尝试截取
	if(s_text.length>1963){
		s_text = s_text.slice(0, 1963);
		while(true){
			try{
				decodeURIComponent(s_text);
				break;
			}catch(e){
				var last_p = s_text.lastIndexOf('%');
				if(last_p!=-1)s_text = s_text.slice(0,last_p);
			};
		};
		N_t_set.overflow=true;
	};
	//document.getElementById("N_t_g_ajax").innerHTML ='<b>...请稍后...</b>';
	N_google_request(from,target,s_text);
	N_Dict_request(s_text);
	N_zdic_request(s_text);
};

// ctrl/alt +左键mouseup划词翻译
if(!window.opera || N_t_set.ctrl_s_enable[0]){
	document.addEventListener('mouseup',
		function(e){
			if(N_t_set.ctrl_s_enable[1].toLowerCase()=='alt'){
					if(e.altKey==true){
						N_t_huaci(e);
					}
			}else{
				if(e.ctrlKey==true){
					N_t_huaci(e);
				};
			};
		}
	,false);
};

