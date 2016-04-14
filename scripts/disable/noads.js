// ==UserScript==
// @name NoAds
// @author Lex1
// @version 0.9.9
// @include http://*
// @description Blocks external scripts and imports Adblock Plus EHH subscriptions.
// @ujs:download http://ruzanow.ru/userjs/noads.js
// ==/UserScript==


(function(){
//storage begin
var storage = [
	[
		"163.com",
		"[class^=\"gg\"]"
	],
	[
		"16kbook.com",
		"#AdsT"
	],
	[
		"17173.com",
		"*[class^=\"banner\"]"
	],
	[
		"3seconds.cn",
		".banner300"
	],
	[
		"56.com",
		".rAd_text"
	],
	[
		"58.251.57.206",
		"A[href^=\"http://click.cm.sandai.net/\"],P.adLink"
	],
	[
		"6.cn",
		"#palyerAdText,.listTextAd,[id$=\"dxPopularize\"],[id=HDad],[id^=\"adText\"]"
	],
	[
		"6park.com",
		"body>table+table+table+table+table[width=\"978\"][bgcolor=\"#ffffff\"]"
	],
	[
		"86zw.com",
		"#Top>#TextSelect+center>table"
	],
	[
		"9553.com",
		"label[style=\"font-size: 12px;\"]"
	],
	[
		"apps.kaixin.com",
		".blank-bar"
	],
	[
		"av199.com,hd199.com",
		"tr.altbg2>TD[width=\"100%\"]"
	],
	[
		"aybook.cn",
		"#welcome2"
	],
	[
		"bbs.fengniao.com",
		"dl.hot_commend_09,td.smallfont>a[style][href],td[align=\"left\"][colspan=\"2\"]"
	],
	[
		"bbs.hdchina.org",
		".home_l_shop,.home_new_ad"
	],
	[
		"bbs.hoopchina.com",
		".plate_03"
	],
	[
		"bbs.pcbeta.com",
		".pcbeta-gg.s_clear"
	],
	[
		"bbs.pdafans.com",
		"table[width=\"980\"][align=\"center\"]"
	],
	[
		"bbs.pspchina.net",
		"[id^=\"ad_\"]"
	],
	[
		"bbs.siluhd.com",
		"[id^=\"ad_\"]"
	],
	[
		"bbs.sjtu.cn,bbs.sjtu.edu.cn,bbs6.sjtu.edu.cn",
		"#ad"
	],
	[
		"bbs.weiphone.com",
		"[id^=\"ads_\"]"
	],
	[
		"bbs.xdxdxd.com",
		"#ad_888"
	],
	[
		"bitauto.com",
		".bt_ad,.con_ad"
	],
	[
		"blog.nownews.com",
		".block_content"
	],
	[
		"blog.sina.com.cn",
		".topbannerAD"
	],
	[
		"book.birdsee.com",
		"div.scriptx>a>font"
	],
	[
		"brsbox.com",
		".downwps_blue,.downwps_p1,.truedownloadwps,a.downwps_blue"
	],
	[
		"campus.wst.cn,house.wst.cn",
		"[id^=\"BannerZoneAD_Div\"]"
	],
	[
		"ce.cn",
		"#toprad"
	],
	[
		"cf8.com.cn",
		"div.Left3Header div[style^=\"font-size\"]"
	],
	[
		"chdtv.net",
		"FIELDSET"
	],
	[
		"china.cn",
		".rowLAd,.topAd"
	],
	[
		"china.com",
		"#BJ,.blueFreeAugurySmall,.egouTxt,.fullClmAT,.homeheadAT,div[class=\"mainBlk01\"]>div[class=\"right\"]"
	],
	[
		"chinanews.sina.com",
		".M_Right,table[cellspacing=\"0\"][width=\"900\"]"
	],
	[
		"chinatimes.com",
		".ad"
	],
	[
		"chinayes.com",
		".banner"
	],
	[
		"chnqiang.com",
		"[class^=\"ad\"]"
	],
	[
		"city8.com",
		"#AdLayer"
	],
	[
		"class.chinaren.com",
		".guanggaoText"
	],
	[
		"cn.yahoo.com",
		".scrolldoorFrame"
	],
	[
		"cnbeta.com",
		"#comad,#fm_r,#userInfo,div.newslist>dl>dd.detail>em"
	],
	[
		"cnmo.com",
		"[id^=\"AD\"]"
	],
	[
		"cnyes.com",
		".cymsge,.etline,.hotxts,[class^=\"cyads\"]"
	],
	[
		"codepub.com",
		".l1,.l2,.r1,.r2"
	],
	[
		"crsky.com",
		".banner,.banner.banner-leader-index"
	],
	[
		"dailynews.sina.com",
		".TopNav+table,.col1,td[width=\"900\"][height=\"100\"]"
	],
	[
		"dayoo.com",
		".adShow,.adVideoS"
	],
	[
		"deskcity.com",
		"[id^=\"tuijian_\"]"
	],
	[
		"dgnet.net",
		".banner"
	],
	[
		"dianping.com",
		"[class^=\"DPAD\"]"
	],
	[
		"dict.cn",
		"#topgg,.gg,[style=\"background: none repeat scroll 0% 0% rgb(231, 247, 247);\"]"
	],
	[
		"duote.com",
		".tuwen.line_green"
	],
	[
		"enet.com.cn",
		"[class^=\"ad\"],div.fra>div.con222"
	],
	[
		"ent.qq.com",
		"[id^=\"adzone\"],div#main_nav_qq+table[width=\"960\"]"
	],
	[
		"fangqq.com",
		"[class^=\"ad\"],[id$=\"Ad\"]"
	],
	[
		"fengniao.com",
		"[id^=\"AD\"]"
	],
	[
		"finance.sina.com.cn",
		"#adSinaHouseHeadLink,.topADs"
	],
	[
		"fj007.com",
		"#wordlink"
	],
	[
		"focus.cn",
		".ad_fp"
	],
	[
		"gamebase.com.tw",
		"span[id^=\"aid_\"]"
	],
	[
		"godic.net,frdic.com",
		"#sidebar1"
	],
	[
		"google.com",
		"[style=\"border-bottom: 2px solid rgb(0, 0, 0); width: 100%; padding-bottom: 10px; margin-bottom: 5px; margin-top: 10px;\"],[style=\"width: 100%; background-color: rgb(238, 238, 238);\"],div.item-body>div>div[style=\"border-top: 1px solid rgb(203, 217, 217); padding-top: 20px; padding-bottom: 10px;\"]"
	],
	[
		"google.com.tw",
		"#tadsb"
	],
	[
		"gougou.com",
		".ggSideBox,A[href^=\"http://click.cm.sandai.net/\"]"
	],
	[
		"greendown.cn",
		".content.ad-b950x50"
	],
	[
		"gxsky.com",
		"#indexad_txt"
	],
	[
		"hdzone.org",
		"table[width=\"740px\"]"
	],
	[
		"hiao.com",
		"[class$=\"Ads\"]"
	],
	[
		"hiao.com,qingdaonews.com",
		".commonrightad"
	],
	[
		"hk.yahoo.com",
		"#mntl1,[id^=\"ad\"],[id^=\"ysm-\"]"
	],
	[
		"huanqiu.com",
		"[id^=\"banner\"]"
	],
	[
		"ifeng.com",
		"#final_head_ad,.areaAd,.maidunbox,[class^=\"adlist\"]"
	],
	[
		"image.baidu.com",
		"#ecomContainer,#relEcom"
	],
	[
		"ipart.cn",
		".topFlash"
	],
	[
		"it168.com",
		".ad,[id^=\"ADV\"],body > div#header2009 + div.w980"
	],
	[
		"ithome.com.tw",
		".ad_title,td.big_ad"
	],
	[
		"javaeye.com",
		"#slides"
	],
	[
		"jcunbbs.cn",
		"[id^=\"ad_\"]"
	],
	[
		"joy666.com",
		"#ad_footerbanner1"
	],
	[
		"jpseek.com",
		".i_table[cellpadding=\"6\"]"
	],
	[
		"kenengba.com",
		"div#sidebar>script[src]+script+div"
	],
	[
		"kkkmh.com",
		"[class^=\"mm-\"]"
	],
	[
		"ku6.com",
		"#swfdiv,.b_ad,.hotSearchArea.cfix,img.adh"
	],
	[
		"laiba.tianya.cn",
		".goog-roundedpanel"
	],
	[
		"mag.sina.com.cn",
		"#guide"
	],
	[
		"mail.126.com,mail.163.com",
		".gWel-gg-2,div.chl>a:last-child"
	],
	[
		"mail.163.com",
		"[id$=\"FakeLetterDiv\"]"
	],
	[
		"mail.google.com",
		".nH.u8"
	],
	[
		"minwt.com",
		"#CoverFlowAd"
	],
	[
		"mobile01.com",
		".forum_sidemenu,.text_ad"
	],
	[
		"mp3.baidu.com",
		"#dMA + script + table[cellspacing][cellpadding]"
	],
	[
		"mydrivers.com",
		"[id^=\"ad\"],div.top + div.hang1"
	],
	[
		"myfiles.com.cn",
		"td[height=\"60\"]"
	],
	[
		"mysilu.com",
		"[id^=\"ad_\"]"
	],
	[
		"nba.tom.com",
		"[id^=\"Float_\"]"
	],
	[
		"net.ithlj.com",
		"[height=\"85\"],table[height=\"70\"]"
	],
	[
		"news.baidu.com",
		"#ecad"
	],
	[
		"news.cn.yahoo.com",
		".aili,.k6,.pah,.shang,.st,.tui"
	],
	[
		"news.cnyes.com,chinayes.com",
		"#tabPage_page_8,[class^=\"ad\"]"
	],
	[
		"news.duowan.com",
		"#Link300,#pageContTop"
	],
	[
		"news.msn.com.tw",
		".right_travel,[class^=\"three\"],[id^=\"ad_\"],[id^=\"fashion_\"],[id^=\"market\"]"
	],
	[
		"news.mydrivers.com",
		"[height=\"210\"],table[border=\"0\"][width=\"980\"][height=\"90\"],table[width=\"923\"][height=\"185\"]"
	],
	[
		"news.pchome.com.tw",
		".lstar,.t1322,table[width=\"316\"][style]"
	],
	[
		"news.qq.com",
		"#News_Rectanglez,.news_ad_box,div#mini_nav_qq+table"
	],
	[
		"news.sohu.com",
		"#adList"
	],
	[
		"news.wenxuecity.com",
		"td[width=\"20\"][bgcolor=\"#f0f0e0\"][rowspan=\"2\"],td[width=\"300\"][valign=\"top\"]"
	],
	[
		"nownews.com",
		"#ad_tab,.push,[id^=\"focus_\"]"
	],
	[
		"pchome.com.tw",
		"#ad_flow,#sixi,.ro1"
	],
	[
		"pchome.net",
		"[class^=\"ad\"],[id^=\"AD\"]"
	],
	[
		"pconline.com.cn",
		".ivy950,table[width=\"950\"][cellspacing=\"0\"][cellpadding=\"0\"]"
	],
	[
		"ph66.com",
		"*[id*=\"ad\"]"
	],
	[
		"pic.sogou.com",
		"#intword,#sidebar1"
	],
	[
		"pixnet.net",
		"#ad-text"
	],
	[
		"qianlong.com",
		".aditem01"
	],
	[
		"qidian.com",
		"#AddMark,[class^=\"gg\"]"
	],
	[
		"qq.com",
		"[class*=\"Ad\"],[class*=\"business-Article-QQ\"],[class*=\"qiye-Article-QQ\"],[id*=\"_F_Up\"],[id*=\"_Width\"],[id^=\"Ad\"]"
	],
	[
		"qqread.com",
		"[class$=\"ad\"]"
	],
	[
		"rayfile.com",
		".nDown_level_0,[class*=\"AD\"]"
	],
	[
		"renren.com",
		"#banner,#home_top_notice,#nostar,.ad-bar,.side-item.template"
	],
	[
		"search.21cn.com",
		"td[height=\"35\"],td[width=\"184\"][align=\"left\"]"
	],
	[
		"sfw.com.cn",
		"[class$=\"Banner1\"]"
	],
	[
		"shooter.cn",
		".rootnav"
	],
	[
		"sina.com.cn",
		".topAD"
	],
	[
		"sina.com.cn,sina.com",
		"#fiWrap,*[class*=\"ads\"],*[id^=\"ads\"],[class^=\"AD\"]"
	],
	[
		"sina.com.hk",
		"div.sidebarItem>h2+div.sidebarItemContent.link1.M0.P0"
	],
	[
		"sohu.com",
		"#ad_TOP,[class^=\"contAD\"],[id^=\"ad_\"]"
	],
	[
		"sohu.com,chinaren.com",
		"sohuadcode"
	],
	[
		"sports.qq.com",
		"[id^=\"ad\"]"
	],
	[
		"stockstar.com",
		"[class*=\"_ad\"]"
	],
	[
		"subpig.net",
		"#ajaxwaitid+div.wrap>#header+table+table[width=\"97%\"][height=\"33\"],div.wrap>table[width=\"97%\"][bgcolor=\"#000000\"][background=\"#ffffff\"]"
	],
	[
		"sun0769.com",
		"#o05rtopad,#outer01,#outer04,#outer06,#outer08"
	],
	[
		"taobao.com",
		"[class^=\"banner\"]"
	],
	[
		"tech.china.com",
		"#GlobalNav+.headbanner"
	],
	[
		"techbang.com.tw",
		".section.last,[class^=\"ad\"],[class^=\"clearfix \"]"
	],
	[
		"thinkpad.cn,51nb.com",
		"div.menu+div.maintable>table.t_rown[width=\"875\"],td.line[style=\"padding: 5px;\"],td[valign=\"middle\"][align=\"left\"]"
	],
	[
		"tianshannet.com.cn",
		".adtxt1.link15"
	],
	[
		"tianya.cn",
		".fence_2_left,.fence_2_rig,.focus_ad"
	],
	[
		"tom.com",
		".tomgame"
	],
	[
		"tompda.com",
		".Advertising"
	],
	[
		"tu.6.cn",
		"#slideShowAd"
	],
	[
		"tw.msn.com",
		"#partner1,[class*=\"shop\"],[id^=\"bslink\"]"
	],
	[
		"tw.news.yahoo.com",
		"#containerktw,#ynwsfture,#ynwsktw,#ynwsmag,#ynwsnw,#ynwspr,[id^=\"ad\"],[id^=\"ynwsad\"]"
	],
	[
		"tw.nextmedia.com",
		".ad300x100,.contentAd_300x250"
	],
	[
		"tw.yahoo.com",
		".admod,.newsad"
	],
	[
		"udn.com",
		"#ad_sash"
	],
	[
		"v.ku6.com",
		".flwin.flwin_min,[id^=\"gg\"]"
	],
	[
		"v.sogou.com",
		".box123"
	],
	[
		"verycd.com",
		"#baidu-cpro-1.banner,#page-body>iframe:first-child,#relatiGood,.banner,.banner_toped2k,.non-topic,iframe.Banner1,iframe.Banner2"
	],
	[
		"vip.cmbchina.com",
		"td[style=\"height: 250px;\"]"
	],
	[
		"vista123.cn",
		"[style=\"width: 260px; height: 260px; float: left;\"]"
	],
	[
		"vista123.com",
		"#adwords,P.w_330,[style=\"width: 260px; height: 260px; float: left; line-height: 18px;\"]"
	],
	[
		"wmzhe.com",
		".Softcontent3"
	],
	[
		"wretch.cc",
		"#ad_word,.admd"
	],
	[
		"www.163.com",
		"[class^=\"colL gg\"]"
	],
	[
		"www.baidu.com",
		".f.EC_PP,table[bgcolor=\"#f5f5f5\"][width=\"65%\"],table[width=\"30%\"][align=\"right\"] div[style|=border]"
	],
	[
		"www.hoopchina.com",
		"[class^=\"ad\"]"
	],
	[
		"www.it168.com",
		"div#header + div[style^=\"border\"]"
	],
	[
		"www.ithlj.com",
		"table[height=\"64\"]"
	],
	[
		"www.pconline.com.cn",
		"#pcHeader+#ivyPC"
	],
	[
		"www.pcpop.com",
		"td[valign=\"top\"]"
	],
	[
		"www.qq.com",
		"#proAd,.adArea,.l_qq_com"
	],
	[
		"www.sina.com.cn",
		".left"
	],
	[
		"www.sogou.com",
		"#sidebar"
	],
	[
		"www.tudou.com",
		"#adex_box"
	],
	[
		"www.wst.cn",
		"[class*=\"ad\"]"
	],
	[
		"xcar.com.cn",
		"[class^=\"adset\"]"
	],
	[
		"xiami.com",
		".play_ad"
	],
	[
		"xici.net",
		"[class*=\" ad\"],a[href^=\"http://xiciafp.allyes.com/main/adfclick\"]"
	],
	[
		"xitek.com",
		"[id^=\"mo\"]"
	],
	[
		"xizi.com",
		".mt5.recommend"
	],
	[
		"xmnn.cn",
		"[class^=\"ad\"]"
	],
	[
		"yam.com",
		".yamfavor_block,[class^=\"yamrightcontent_life\"]"
	],
	[
		"yesky.com",
		"[class^=\"ad\"]"
	],
	[
		"youthwant.com.tw",
		"[class^=\"ad\"]"
	],
	[
		"yule.kugou.com",
		"TD.kuang[style=\"border-color: rgb(255, 245, 96); padding-top: 5px;\"]"
	],
	[
		"zaobao.com",
		"#myMovie"
	],
	[
		"zhidao.baidu.com",
		"#youa,.r,div#center>div[style=\"width: 85%;\"]"
	],
	[
		"zhuaxia.com",
		"#channel_top>div:first-child,[id^=\"pd_sg_\"],[onclick^=\"send_ad_log\"]"
	],
	[
		"zhulang.com",
		"#topAds_chk_show,.hx_newgg,[class^=\"ad\"]"
	],
	[
		"zol.com.cn",
		".banner760_1,.pic_ad,[id^=\"AD\"],[id^=\"Bar\"],[id^=\"Float\"]"
	]
];
//storage end

// whitelist at blocking external scripts
var whiteList = '~youtube.com,~metacafe.com,~lastfm.ru,~livegames.ru,~vkontakte.ru,~eurosport.ru,~imageshack.us,~britannica.com'
+ ',~wikipedia.org,~newegg.com,~yahoo.com,~facebook.com,~deviantart.com,~hotmail.com,~picasaweb.google.com,~playset.ru,~molotok.ru'
+ ',~piter.fm,~kinozal.tv,~tvshack.net,~anonym.to,~twitter.com,~flickr.com,~myspace.com,~bbc.co.uk,~ebay.com,~opera.com';

var skipScripts = '^data:|^http://ajax.googleapis.com/|^http://www.google.com/jsapi|^http://maps.google.com/|^http://[0-9a-z-]+.gstatic.com/'
+ '|^http://yui.yahooapis.com/|^http://script.aculo.us/|^http://api.recaptcha.net/|^http://[0-9a-z-]+.appspot.com/'
+ '|^http://css.yandex.net/|^http://s\\d+.ucoz.net/src/u.js|^http://[0-9a-z-]+.imgsmail.ru/|^http://62.105.135.100/|^http://auth.tbn.ru'
+ '|swfobject.js$|show_afs_search.js$|chart.js$|ajax.js$|widgets.js$|common.js$|jquery[0-9a-z.-]*.js$';

// UserJS
if(typeof window == 'object' && window.location){
	var style, css = '', blocked = '', prefix = 'ujs_noads', none = '{display: none !important;}', domain = location.hostname;

	var getValue = function(name){
		if(window.localStorage){
			return window.localStorage.getItem(name) || '';
		}
		else{
			var eq = name+'=', ca = document.cookie.split(';');
			for(var i = ca.length; i--;){
				var c = ca[i];
				while(c.charAt(0) == ' ')c = c.slice(1);
				if(c.indexOf(eq) == 0)return unescape(c.slice(eq.length));
			};
			return '';
		}
	};

	var setValue = function(name, value, del){
		if(window.localStorage){
			if(del){window.localStorage.removeItem(name)}else{window.localStorage.setItem(name, value)};
		}
		else{
			if(document.cookie.split(';').length < 30 && document.cookie.length-escape(getValue(name)).length+escape(value).length < 4000){
				var date = new Date();
				date.setTime(date.getTime()+((del ? -1 : 10*365)*24*60*60*1000));
				document.cookie = name+'='+escape(value)+'; expires='+date.toGMTString()+'; path=/';
			}
			else{
				alert('Cookies is full!');
			}
		}
	};

	var addStyle = function(css){
		if(document.documentElement instanceof HTMLHtmlElement){
			var s = document.createElement('style');
			s.setAttribute('type', 'text/css');
			s.setAttribute('style', 'display: none !important;');
			s.appendChild(document.createTextNode(css));
			return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
		}
	};

	var isCorrectDomain = function(domain, domains){
		if(!domains)return true;
		var d, a = domains.split(','), rez = false, reTrim = /^\s+|\s+$/g;
		while(domain){
			for(var i = 0, f = true, l = a.length; i < l; i++){
				d = a[i].replace(reTrim, '');
				if(d.charAt(0) != '~'){
					if(d == domain){return true}else{f = false};
				}
				else{
					if(d.slice(1) == domain){return false}else{if(f)rez = true};
				}
			};
			domain = domain.slice(domain.indexOf('.') + 1 || domain.length);
		};
		return rez;
	};

	var getRules = function(){
		var arr = [];
		for(var i = 0, rule; rule = storage[i]; i++){
			if(isCorrectDomain(domain, rule[0]))arr.push(rule[1]);
		};
		return arr.join(',');
	};

	var getTLD = function(domain, full){
		if(!domain)return '';
		var r = domain.match(/^((?:\d{1,3}\.){3})\d{1,3}$/); if(r)return r[1] + '0';
		var a = domain.split('.'); var l = a.length; if(l < 2)return domain;
		return full ? a[l - 2] + '.' + a[l - 1] : a[(l > 2 && /^(co|com|net|org|edu|gov|mil|int)$/i.test(a[l - 2])) ? l - 3 : l - 2];
	};

	var setStatus = function(value){
		window.status = value;
		window.defaultStatus = value;
		window.setTimeout(function(){window.defaultStatus = ''}, 4000);
	};

	var getLng = function(){
		switch(window.navigator.language){
			case 'ru': return {
				_s: function(count){return (count > 4) ? '\u043E\u0432' : ((count > 1) ? '\u0430' : '')},
				unblock: '\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C: ',
				disabled: '\u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E',
				blocked: '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E',
				script: '\u0441\u043A\u0440\u0438\u043F\u0442',
				and: ' \u0438 ',
				element: '\u044D\u043B\u0435\u043C\u0435\u043D\u0442',
				nDisabled: 'NoAds \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D',
				nEnabled: 'NoAds \u0432\u043A\u043B\u044E\u0447\u0435\u043D'
			};
			default: return {
				_s: function(count){return (count > 1) ? 's' : ''},
				unblock: 'Unblock: ',
				disabled: 'Blocking disabled',
				blocked: 'Blocked',
				script: 'script',
				and: ' and ',
				element: 'element',
				nDisabled: 'NoAds disabled',
				nEnabled: 'NoAds enabled'
			}
		}
	};

	var createButton = function(){
		var enabled = getValue(prefix) != 'disabled';
		if(enabled && !blocked && !css)return;
		var sCount = blocked.split('; ').length;
		var eCount = (css.match(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/g) || '').length;
		var lng = getLng();
		var txt = enabled ? lng.blocked + ' ' + (blocked ? sCount + ' ' + lng.script + lng._s(sCount) + (css ? lng.and : '') : '') + (css ? eCount + ' ' + lng.element + lng._s(eCount) : '') : lng.disabled;
		var title = enabled ? lng.unblock + (blocked ? blocked + (css ? '; ' : '') : '') + css : '';

		var b = document.getElementById(prefix);
		if(b){b.value = txt; b.title = title; return};
		b = document.createElement('input');
		b.type = 'button';
		b.value = txt;
		b.title = title;
		b.id = prefix;
		b.setAttribute('style', 'display:inline-block;position:fixed;visibility:hidden;right:0;bottom:0;width:auto;height:auto;margin:0;padding:1px 8px;font:12px Times New Roman;z-index:9999;cursor:pointer;');
		b.addEventListener('click', function(){
			if(enabled){setValue(prefix, 'disabled'); window.status = lng.nDisabled}else{setValue(prefix, '', true); window.status = lng.nEnabled};
			this.parentNode.removeChild(this);
			window.setTimeout(function(){window.location.reload(false)}, 500);
		}, false);
		b.addEventListener('mouseout', function(){b.setAttribute('style', 'visibility:hidden;'); b.parentNode.removeChild(b)}, false);
		(document.body || document.documentElement).appendChild(b);
		var maxWidth = b.offsetWidth;
		b.style.width = 0;
		b.style.visibility = 'visible';
		var timer = window.setInterval(function(){
			var width = parseInt(b.style.width) + 20;
			if(width > maxWidth){clearTimeout(timer); width = maxWidth};
			b.style.width = width + 'px';
		}, 10);
	};

	var toggle = function(block){
		var lng = getLng();
		if(arguments.length ? !block : getValue(prefix) != 'disabled'){
			setValue(prefix, 'disabled');
			if(style)style.parentNode.removeChild(style);
			setStatus(lng.nDisabled);
		}
		else{
			setValue(prefix, '', true);
			css = getRules();
			if(css)style = addStyle(css + none);
			setStatus(lng.nEnabled);
		}
	};

	// create button
	document.addEventListener('mousemove', function(e){
		var docEle = (document.compatMode == 'CSS1Compat' && window.postMessage) ? document.documentElement : document.body;
		if(docEle && docEle.clientHeight - e.clientY < 20 && docEle.clientWidth - e.clientX < 40)createButton();
	}, false);

	// permanent unblock/block for the site with Alt+Shift+D
	document.addEventListener('keydown', function(e){
		if(e.keyCode == 68 && e.shiftKey && !e.ctrlKey && e.altKey)toggle();
	}, false);

	// for buttons
	window.addEventListener('message', function(e){
		if(e.data == prefix+'_disable')toggle(false);
		if(e.data == prefix+'_enable')toggle(true);
	}, false);

	if(getValue(prefix) != 'disabled'){
		// block external scripts
		var reSkip = new RegExp(skipScripts.replace(/[.\/]/g, '\\$&'), 'i');
		if(window.opera && isCorrectDomain(domain, whiteList))window.opera.addEventListener('BeforeExternalScript', function(e){
			var s = e.element.src; if(!s || reSkip.test(s))return;
			var h = window.location.hostname; var n = !/\.(com|[a-z]{2})$/.test(h);
			var a = s.match(/^https?:\/\/([^\/]+@)?([^:\/]+)/i); var d = a ? a[2] : h;
			if(getTLD(d, n) != getTLD(h, n)){
				e.preventDefault();
				if(blocked.indexOf(s) == -1)blocked += blocked ? '; ' + s : s;
				//if(window.opera)window.opera.postError('On <' + h + '> blocked external script: ' + s);
			}
		}, false);

		// add css rules
		css = getRules();
		if(css)style = addStyle(css + none);
	}
};

// WSH
if(typeof WScript == 'object' && WScript.Arguments){
	// work with the adblock plus list
	function convertOldRules(tagName, attrRules){
		var rule, rules, sep, additional = '', id = null, reAttrRules = /\([\w\-]+(?:[$^*]?=[^\(\)"]*)?\)/g;
		if(tagName == '*')tagName = '';
		if(attrRules){
			rules = attrRules.match(reAttrRules);
			for(var i = 0; i < rules.length; i++){
				rule = rules[i].slice(1, -1);
				sep = rule.indexOf('=');
				if(sep > 0){
					rule = rule.slice(0, sep) + '="' + rule.slice(sep + 1) + '"';
					additional += '[' + rule + ']';
				}
				else{
					if(id){return ''}else{id = rule};
				}
			}
		};
		if(id){
			return tagName + '.' + id + additional + ',' + tagName + '#' + id + additional;
		}
		else{
			return (tagName || additional) ? tagName + additional : '';
		}
	};

	function isSiteOnly(domains){
		if(domains){
			var a = domains.split(',');
			for(var i = 0; i < a.length; i++){
				if(a[i].charAt(0) != '~')return true;
			}
		}
	};

	function getHidingRules(list, all){
		var rez = [], reTrim = /^\s+|\s+$/g, reElemHide = /^([^\/\*\|\@"]*?)#(?:([\w\-]+|\*)((?:\([\w\-]+(?:[$^*]?=[^\(\)"]*)?\))*)|#([^{}]+))$/;
		if(list){
			var rule, domains, tagName, attrRules, selector, a = list.split('\n');
			for(var i = 0; i < a.length; i++){
				rule = a[i].replace(reTrim, '');
				if(rule && rule.charAt(0) != '!' && rule.charAt(0) != '[' && rule.charAt(0) != '@' && !(rule.charAt(0) == '/' && rule.charAt(rule.length - 1) == '/')){
					if(reElemHide.test(rule)){
						domains = RegExp.$1;
						tagName = RegExp.$2;
						attrRules = RegExp.$3;
						selector = RegExp.$4 || convertOldRules(tagName, attrRules);
						if(selector && (all || isSiteOnly(domains)))rez.push([domains, selector]);
					}
				}
			}
		};
		return rez;
	};

	function getHidingRulesLength(a){
		var len = 0;
		for(var i = 0; i < a.length; i++){
			if(a[i][1])len += a[i][1].match(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/g).length;
		};
		return len;
	};

	// JSON support
	var jsonStringify = (function(){var g=/[\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff\"\\]/g;var h={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};var j=function(b){return'"'+b.replace(g,function(a){if(!h[a])h[a]='\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);return h[a]})+'"'};var l=function(d){function f(v){return v<10?'0'+v:v}return'"'+d.getUTCFullYear()+'-'+f(d.getUTCMonth()+1)+'-'+f(d.getUTCDate())+'T'+f(d.getUTCHours())+':'+f(d.getUTCMinutes())+':'+f(d.getUTCSeconds())+'Z"'};var m=function(a,b,e){return a.length===0?b+e:b+'\n'+a.join(',\n').replace(/^/gm,'\t')+'\n'+e};var n=function(a,b){var i,k,v,p=[],o=b[a],t=typeof o,c=Object.prototype.toString.call(o);if(c==='[object Date]')return l(o);if(t==='string'||c==='[object String]')return j(o);if(t==='boolean'||c==='[object Boolean]')return String(o);if(t==='number'||c==='[object Number]')return isFinite(o)?String(o):'null';if(t==='object'){if(!o)return'null';if(Object.prototype.toString.apply(o)==='[object Array]'){for(i=0;i<o.length;i++){p[i]=n(i,o)||'null'};return m(p,'[',']')};for(k in o){if(Object.hasOwnProperty.call(o,k)){v=n(k,o);if(v){p.push(j(k)+': '+v)}}};return m(p,'{','}')}};return function(a){return n('',{'':a})}})();

	// read the files
	var f, fso = new ActiveXObject('Scripting.FileSystemObject');
	var scriptPath = WScript.ScriptFullName;
	var startDir = fso.GetParentFolderName(fso.GetFile(scriptPath));
	var defPath = startDir+'\\adblock.txt';
	var subscPath = WScript.Arguments.length > 0 ? WScript.Arguments(0) : defPath;
	var paramIn = function(str){for(var i = WScript.Arguments.length; i--;){if(WScript.Arguments(i) == str)return true}};
	var addRules = paramIn('/add'), allRules = paramIn('/all'), silent = paramIn('/silent');
	var alert = function(str){if(!silent)WScript.Echo(str)};

	if(/^https?:\/\//i.test(subscPath)){
		try{
			var shell = new ActiveXObject('WScript.Shell');
			shell.CurrentDirectory = startDir;
			shell.Run('wget.exe'+' --no-check-certificate -O "'+defPath+'" '+subscPath, 0, 1);
		}
		catch(e){
			var req = new ActiveXObject('WinHTTP.WinHttpRequest.5.1');
			req.Open('GET', subscPath, false);
			req.Option(4) = 0x3300;
			req.Option(6) = true;
			req.Send();
			if(req.Status == 200){
				var stream = new ActiveXObject('ADODB.Stream');
				stream.Type = 1;
				stream.Open();
				stream.Write(req.ResponseBody);
				stream.SaveToFile(defPath, 2);
				stream.Close();
			}
			else{
				alert('Error, cannot download a subscription!');
			}
		};
		subscPath = defPath;
	};

	if(!fso.FileExists(subscPath) || fso.GetFile(subscPath).Size == 0){
		alert('NoAds. Import Adblock Plus subscriptions...\n\nFile "'+subscPath+'" not found!');
		return;
	};
	f = fso.OpenTextFile(subscPath, 1, 0);
	var adblock = f.ReadAll().replace(/\0/g, '');
	f.Close();
	f = fso.OpenTextFile(scriptPath, 1, 0);
	var str = f.ReadAll().replace(/\0/g, '');
	f.Close();

	var startStr = '//storage begin\n', endStr = '\n//storage end', startLen = startStr.length;
	var startPos = str.indexOf(startStr);
	var endPos = str.indexOf(endStr, startPos+startLen);
	if(startPos != -1 && endPos != -1){
		storage = addRules ? storage.concat(getHidingRules(adblock, allRules)) : getHidingRules(adblock, allRules);
		storage.sort();
		for(var i = storage.length; i--;){
			var a = storage[i], b = storage[i-1];
			if(a && b && a[0] == b[0]){
				if(a[1] != b[1])b[1] += ','+a[1];
				storage.splice(i, 1);
			}
		};
		f = fso.OpenTextFile(scriptPath, 2, 0);
		f.Write(str.slice(0, startPos+startLen)+'var storage = '+jsonStringify(storage)+';'+str.slice(endPos));
		f.Close();
		alert(getHidingRulesLength(storage)+' rules for '+storage.length+' sites successfully imported!');
	}
};
})();
