// ==UserScript==
// @name 	google translate
// @description 
// @exclude	http*://mail.google.com/*
// @exclude	http*
// @author	lk
// ==/UserScript==

/*<div id="topToolContainer">
 <div id="topopt">
 <div id="languageContainer"> <span></span> </div>
 </div>
 <div id="searchContainer">
 <div id="ctl00_baSearchBar_SearchBarWrapper" class="SearchBar">
 <div id="google_translate_element"></div>
 <script type="text/javascript">
 function googleTranslateElementInit() {
 new google.translate.TranslateElement({
 pageLanguage: 'zh-CN',
 layout: google.translate.TranslateElement.InlineLayout.SIMPLE
 }, 'google_translate_element');
 }
 </script>
 <script type="text/javascript" src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
 </div>
 </div>
</div> */

//Button9, "google翻译：自动翻译成中文"="Go to page, "javascript:(function(){d=document;b=d.body;if(d.getElementById('google_translate_element')){o=d.createElement('script');o.setAttribute('src','http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');o.setAttribute('type','text/javascript');b.appendChild(o);v=b.insertBefore(d.createElement('div'),b.firstChild);v.id='google_translate_element';v.style.display='none';p=d.createElement('script');p.text='function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'+'\'\''+'},\'google_translate_element\');}';p.setAttribute('type','text/javascript');	d.cookie='googtrans=/auto/zh-CN;path=/';b.appendChild(p);}else{d.frame[0].:1.close.click();}})();", , "google翻译：自动翻译成中文", "Account Irc""

/*
<div id="google_translate_element"></div><script type="text/javascript">
function googleTranslateElementInit() {
	new google.translate.TranslateElement({pageLanguage: 'en',, autoDisplay: false, includedLanguages:'de,en,es,fr,ru,zh-TW',layout: google.translate.TranslateElement.InlineLayout.SIMPLE},'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
 */

(function() {
if(window == window.parent){
    function googleTranslateElementInit() {
	 d=document;b=d.body;o=d.createElement('script');
	 o.setAttribute('src','http://www.google.com/jsapi');
	 o.setAttribute('type','text/javascript');
	 b.appendChild(o);
	 o=d.createElement('script');
	 o.setAttribute('src','http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
	 o.setAttribute('type','text/javascript');
	 b.appendChild(o);
	 v=b.insertBefore(d.createElement('div'),b.firstChild);
	 v.id='google_translate_element';
	 v.style.display='none';
	 p=d.createElement('script');
	 p.text='function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'+'\'\''+'},\'google_translate_element\');}';
	 //p.text='new google.translate.TranslateElement({pageLanguage: \'en\', layout: google.translate.TranslateElement.InlineLayout.VERTICAL}, \'google_translate_element\');';
	 p.setAttribute('type','text/javascript');
	 //b.appendChild(p);
   }
	function addgoogtransDiv(){
		var style=document.createElement('style');
		style.type='text/css';
		style.textContent='\
			#googtrans-rect{z-index:999999!important;Color:#fff}\
		';
		document.getElementsByTagName('head')[0].appendChild(style);
		var div=document.createElement('div');
		div.id='googtransDiv';

		div.innerHTML='\
			<div id="googtrans-rect" style="background-color:#000; cursor:pointer;">\
				<B class="enButton" style="display:none;" title="translate to english">En</B>\
				<B id="chButton" style="display:;" title="translate to chinese">Zh</B>\
			</div>\
		';
		//document.body.appendChild(div);

		function gss(){
			var scrolly=window.scrollY;
			var scrollx=window.scrollX;
			var FW_position=2,vertical=20,horiz=40;
			switch(FW_position){
				case 1:{
					div.style.top=vertical+scrolly+'px';
					div.style.left=horiz+scrollx+'px';
				}break;
				case 2:{
					div.style.top=vertical+scrolly+'px';
					div.style.right=horiz-scrollx+'px';
				}break;
				case 3:{
					div.style.bottom=vertical-scrolly+'px';
					div.style.right=horiz-scrollx+'px';
				}break;
				case 4:{
					div.style.bottom=vertical-scrolly+'px';
					div.style.left=horiz+scrollx+'px';
				}break;
				default:break;
			};
		};

		div.style.position='absolute';
		var timeout;
		function gs(){
			clearTimeout(timeout);
			timeout=setTimeout(gss,200);
		};
		gss();
		window.addEventListener('scroll',gs,false);
	};


   window.addEventListener('DOMContentLoaded', function(e) {
		//document.body.addStyle("div.skiptranslate>iframe.skiptranslate{float:left;width:550px;height:2.5em;width:0;height:0}");
		document.body.addStyle("#google_translate_element{display:block !important;position:fixed;right:10px;top:20px}");
		addgoogtransDiv();
		var isT = false;
		// 文档语言不是中文
		isT = document.documentElement.lang !=''
			&& document.documentElement.lang.indexOf('zh') == -1;
		// 页面中不包含中文
		isT = !/[\u4E00-\u9FA5]/g.test(document.body.innerText);
		if(isT){
			if(!document._dict_status){_load_dict();}
		}		
			if(document.getCookie("googtrans")==="")document.setCookie("googtrans","\/auto\/zh-CN",365,'/',document.domain);
			googleTranslateElementInit();
		jQuery("select[class=goog-te-combo]>option").each(function(){if(this.value==="zh-CN"||this.value==="en"){}else jQuery(this).remove();});
   }, false);
}
})();

// http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit
//(function () {
	var d = window,
	e = document,
	f = "text/javascript",
	g = "text/css",
	h = "stylesheet",
	k = "script",
	l = "link",
	m = "head",
	n = "complete",
	p = "UTF-8",
	q = ".";
	function r(b) {
		var a = e.getElementsByTagName(m)[0];
		a || (a = e.body.parentNode.appendChild(e.createElement(m)));
		a.appendChild(b)
	}
	function _loadJs(b) {
		var a = e.createElement(k);
		a.type = f;
		a.charset = p;
		a.src = b;
		r(a)
	}
	function _loadCss(b) {
		var a = e.createElement(l);
		a.type = g;
		a.rel = h;
		a.charset = p;
		a.href = b;
		r(a)
	}
	function _isNS(b) {
		b = b.split(q);
		for (var a = d, c = 0; c < b.length; ++c)
			if (!(a = a[b[c]]))
				return !1;
		return !0
	}
	function _setupNS(b) {
		b = b.split(q);
		for (var a = d, c = 0; c < b.length; ++c)
			a = a[b[c]] || (a[b[c]] = {});
		return a
	}
	d.addEventListener && "undefined" == typeof e.readyState && d.addEventListener("DOMContentLoaded", function () {
		e.readyState = n
	}, !1);
	if (!_isNS('google.translate.Element')) {
	(function () {
		var c = _setupNS('google.translate._const');
		c._cl = 'en';
		c._cuc = 'googleTranslateElementInit';
		c._cac = '';
		c._cam = '';
		var h = 'translate.googleapis.com';
		var s = (false ? 'https' : window.location.protocol == 'https:' ? 'https' : 'http') + '://';
		var b = s + h;
		c._pah = h;
		c._pas = s;
		c._pbi = b + '/translate_static/img/te_bk.gif';
		c._pci = b + '/translate_static/img/te_ctrl3.gif';
		c._phf = h + '/translate_static/js/element/hrs.swf';
		c._pli = b + '/translate_static/img/loading.gif';
		c._plla = h + '/translate_a/l';
		c._pmi = b + '/translate_static/img/mini_google.png';
		c._ps = b + '/translate_static/css/translateelement.css';
		c._puh = 'translate.google.com';
		_loadCss(c._ps);
		_loadJs(b + '/translate_static/js/element/main.js');
	})();
	}
//})()

// http://translate.googleapis.com/translate_static/js/element/main.js
(function () {
	var c = document,
	d = "length",
	e = " translation",
	f = " using Google Translate?",
	k = ".",
	l = "Google has automatically translated this page to: ",
	m = "Powered by ",
	n = "Translate",
	p = "Translate everything to ",
	q = "Translate this page to: ",
	r = "Translated to: ",
	s = "Turn off ",
	t = "Turn off for: ",
	u = "View this page in: ",
	v = "var ",
	w = this;
	function x(a, y) {
		var g = a.split(k),
		b = w;
		g[0]in b || !b.execScript || b.execScript(v + g[0]);
		for (var h; g[d] && (h = g.shift()); )
			g[d] || void 0 === y ? b[h] ? b = b[h] : b = b[h] = {}

		 : b[h] = y
	};
	var z = {
		0 : n,
		1 : "Cancel",
		2 : "Close",
		3 : function (a) {return l + a},
		4 : function (a) {return r + a},
		5 : "Error: The server could not complete your request. Try again later.",
		6 : "Learn more",
		7 : function (a) {return m + a},
		8 : n,
		9 : "Translation in progress",
		10 : function (a) {return q + (a + f)},
		11 : function (a) {return u + a},
		12 : "Show original",
		13 : "The content of this local file will be sent to Google for translation using a secure connection.",
		14 : "The content of this secure page will be sent to Google for translation using a secure connection.",
		15 : "The content of this intranet page will be sent to Google for translation using a secure connection.",
		16 : "Select Language",
		17 : function (a) {return s + (a + e)},
		18 : function (a) {return t + a},
		19 : "Always hide",
		20 : "Original text:",
		21 : "Contribute a better translation",
		22 : "Contribute",
		23 : "Translate all",
		24 : "Restore all",
		25 : "Cancel all",
		26 : "Translate sections to my language",
		27 : function (a) {return p + a},
		28 : "Show original languages",
		29 : "Options",
		30 : "Turn off translation for this site",
		31 : null,
		32 : "Show alternative translations",
		33 : "Click on words above to get alternative translations",
		34 : "Use",
		35 : "Drag with shift key to reorder",
		36 : "Click for alternative translations",
		37 : "Hold down the shift key, click, and drag the words above to reorder.",
		38 : "Thank you for contributing your translation suggestion to Google Translate.",
		39 : "Manage translation for this site",
		40 : "Click a word for alternative translations, or double-click to edit directly",
		41 : "Original text",
		42 : n,
		43 : n,
		44 : "Your correction has been submitted.",
		45 : "Error: The language of the webpage is not supported."
	};
	var A = window.google && google.translate && google.translate._const;
	if (A) {
		var B;
		t : {
			for (var C = [], D = ["20,0.01,20140601"], E = 0; E < D[d]; ++E) {
				var F = D[E].split(","),
				G = F[0];
				if (G) {
					var H = Number(F[1]);
					if (H && !(0.1 < H || 0 > H)) {
						var I = Number(F[2]),
						J = new Date,
						K = 1E4 * J.getFullYear() + 100 * (J.getMonth() + 1) + J.getDate();
						!I || I < K || C.push({
							version : G,
							a : H,
							b : I
						})
					}
				}
			}
			for (var L = 0, M = window.location.href.match(/google\.translate\.element\.random=([\d\.]+)/), N = Number(M && M[1]) || Math.random(), E = 0; E < C[d]; ++E) {
				var O = C[E],
				L = L + O.a;
				if (1 <= L)
					break;
				if (N < L) {
					B = O.version;
					break t
				}
			}
			B = "23"
		}
		var P = "/translate_static/js/element/%s/element_main.js".replace("%s",B);
		if ("0" == B) {
			var Q = " translate_static js element %s element_main.js".split(" ");
			Q[Q[d] - 1] = "main.js";
			P = Q.join("/").replace("%s", B)
		}
		if (A._cjlc)
			A._cjlc(A._pas + A._pah + P);
		else {
			var R = A._pas + A._pah + P,
			S = c.createElement("script");
			S.type = "text/javascript";
			S.charset = "UTF-8";
			S.src = R;
			var T = c.getElementsByTagName("head")[0];
			T || (T = c.body.parentNode.appendChild(c.createElement("head")));
			T.appendChild(S)
		}
		x("google.translate.m", z);
		x("google.translate.v", B)
	};
})()

function _load_dict() {log("_load_dict()");
	var element = document.createElement('script');
	element.setAttribute('src', 'http://dict.cn/hc/init.php');
	document.body.appendChild(element);
}