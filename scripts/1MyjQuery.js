// ==UserScript==
// @name all jquery user js
// @description 
// @depends jquery.js like 0jquery-1.8.3.js
// @exclude	http://*.js
// @author	lk
// ==/UserScript==

(function(){
// remove google redirect url
if(typeof(jQuery)!='undefined'){
	var removeGoogleDomain=function(){
		// Google Site include google mirror
		if(jQuery("[id*='logo'][title*='Google']").length>0){
			// remove google redirect on mouseover
			var removeGoogleRedirectUrl=function(e) {
				if(jQuery(this).attr("removeurl"))return;
				if(!(this.href.indexOf("url=")>-1||this.href.indexOf("q=")>-1))return;
				if(jQuery(this).attr("onmousedown")){jQuery(this).removeAttr("onmousedown").append(" √").unbind("mouseover",removeGoogleRedirectUrl);}
				var ori_hreh=getQueryString("url", this.href);
				if(ori_hreh=="")ori_hreh=getQueryString("q", this.href);
				//if(ori_hreh!="")jQuery(this).attr("href",ori_hreh).append(" √")
				if(!jQuery(this).attr("removeurl"))jQuery(this).attr("href",ori_hreh).attr("removeurl","1").append(" √").unbind("mouseover",removeGoogleRedirectUrl);
			};

			// #ires h3 a,.osl>a,#ires a for no js web style 
			// https://www.google.com/search?hl=en&source=hp&q=java+randou&gbv=2&oq=java+randou
			jQuery("#ires h3 a,.osl>a,#ires a,a[onmousedown*='rwt']").live('mouseover',removeGoogleRedirectUrl);
			
			// remove google form action for ip site
			jQuery("form[action^='//www.google.com']").each(function(){
				jQuery(this).attr("action",jQuery(this).attr("action").replace("//www.google.com",""));
			});
			
			//jQuery("a[href*='google.com']").live('mouseover',function(){
			//	if(this.hasAttribute("removehost")||this.host.indexOf("google.com")==-1)return;
			//	this.href = this.href.replace(this.protocol+"//"+this.host,"");
			//	this.setAttribute("removehost","1");
			//});
			
			//jQuery("#ires img[src^='http']").not(".google-preview").each(function(){
			//	var src = this.src;
			//	src = src.replace(src.substring(0,src.indexOf('//')+2),"");
			//	this.src = src.replace(src.substring(0,src.indexOf('/')+1),"");
			//});
		}
	}
	
	jQuery(document).ready(function () {
		// 自动删除 Google Calendar 中的事件
		//var delAct = function(){
		//    var item = jQuery("div.st-c-pos:contains('月'):last");
		//    if(item.length>0){
		//        item[0].click();jQuery(".bubble a[id*='delete']")[0].click();
		//    }
		//    else jQuery("div[id^='navBack']")[0].click();
		//}
		//interval = setInterval("delAct()", 1500);
		//clearInterval(interval)
		//delAct=null;
		
		jQuery(".action-menu li a").each(function() {
			jQuery(this).parents(".action-menu:first").before(this).empty();
		});
		
		// 移动流量0元秒
		if(location.href.indexOf("http://shop.10086.cn")>-1){
			//var time = $(".countdown").text().replace(/\r|\n|\s+/g, "");
		}
		
		removeGoogleDomain();
	});
	window.addEventListener('scroll',removeGoogleDomain,false);
	
	//复选框
	jQuery.fn.ruleSingleCheckbox = function () {
		var singleCheckbox = function (parentObj) {
			//查找复选框
			var checkObj = parentObj.children('input:checkbox').eq(0);
			parentObj.children().hide();
			//添加元素及样式
			var newObj = jQuery('<a href="javascript:;">'
			+ '<i class="off">否</i>'
			+ '<i class="on">是</i>'
			+ '</a>').prependTo(parentObj);
			parentObj.addClass("single-checkbox");
			//判断是否选中
			if (checkObj.prop("checked") == true) {
				newObj.addClass("selected");
			}
			//检查控件是否启用
			if(checkObj.prop("disabled") == true){
				newObj.css("cursor","default");
				return;
			}
			//绑定事件
			jQuery(newObj).click(function () {
				if (jQuery(this).hasClass("selected")) {
					jQuery(this).removeClass("selected");
					//checkObj.prop("checked", false);
				} else {
					jQuery(this).addClass("selected");
					//checkObj.prop("checked", true);
				}
				checkObj.trigger("click"); //触发对应的checkbox的click事件
			});
		};
		return jQuery(this).each(function () {
			singleCheckbox(jQuery(this));
		});
	};

	//多项复选框
	jQuery.fn.ruleMultiCheckbox = function() {
		var multiCheckbox = function(parentObj){
			parentObj.addClass("multi-checkbox"); //添加样式
			parentObj.children().hide(); //隐藏内容
			var divObj = jQuery('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
			parentObj.find(":checkbox").each(function(){
				var indexNum = parentObj.find(":checkbox").index(this); //当前索引
				var newObj = jQuery('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
				if(jQuery(this).prop("checked") == true){
					newObj.addClass("selected"); //默认选中
				}
				//检查控件是否启用
				if(jQuery(this).prop("disabled") == true){
					newObj.css("cursor","default");
					return;
				}
				//绑定事件
				jQuery(newObj).click(function(){
					if(jQuery(this).hasClass("selected")){
						jQuery(this).removeClass("selected");
						//parentObj.find(':checkbox').eq(indexNum).prop("checked",false);
					}else{
						jQuery(this).addClass("selected");
						//parentObj.find(':checkbox').eq(indexNum).prop("checked",true);
					}
					parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
					//alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
				});
			});
		};
		return jQuery(this).each(function() {
			multiCheckbox(jQuery(this));						 
		});
	}

	//多项选项PROP
	jQuery.fn.ruleMultiPorp = function() {
		var multiPorp = function(parentObj){
			parentObj.addClass("multi-porp"); //添加样式
			parentObj.children().hide(); //隐藏内容
			var divObj = jQuery('<ul></ul>').prependTo(parentObj); //前插入一个DIV
			parentObj.find(":checkbox").each(function(){
				var indexNum = parentObj.find(":checkbox").index(this); //当前索引
				var liObj = jQuery('<li></li>').appendTo(divObj)
				var newObj = jQuery('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a><i></i>').appendTo(liObj); //查找对应Label创建选项
				if(jQuery(this).prop("checked") == true){
					liObj.addClass("selected"); //默认选中
				}
				//检查控件是否启用
				if(jQuery(this).prop("disabled") == true){
					newObj.css("cursor","default");
					return;
				}
				//绑定事件
				jQuery(newObj).click(function(){
					if(jQuery(this).parent().hasClass("selected")){
						jQuery(this).parent().removeClass("selected");
					}else{
						jQuery(this).parent().addClass("selected");
					}
					parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
					//alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
				});
			});
		};
		return jQuery(this).each(function() {
			multiPorp(jQuery(this));						 
		});
	}

	//多项单选
	jQuery.fn.ruleMultiRadio = function() {
		var multiRadio = function(parentObj){
			parentObj.addClass("multi-radio"); //添加样式
			parentObj.children().hide(); //隐藏内容
			var divObj = jQuery('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
			parentObj.find('input[type="radio"]').each(function(){
				var indexNum = parentObj.find('input[type="radio"]').index(this); //当前索引
				var newObj = jQuery('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
				if(jQuery(this).prop("checked") == true){
					newObj.addClass("selected"); //默认选中
				}
				//检查控件是否启用
				if(jQuery(this).prop("disabled") == true){
					newObj.css("cursor","default");
					return;
				}
				//绑定事件
				jQuery(newObj).click(function(){
					jQuery(this).siblings().removeClass("selected");
					jQuery(this).addClass("selected");
					parentObj.find('input[type="radio"]').prop("checked",false);
					parentObj.find('input[type="radio"]').eq(indexNum).prop("checked",true);
					parentObj.find('input[type="radio"]').eq(indexNum).trigger("click"); //触发对应的radio的click事件
					//alert(parentObj.find('input[type="radio"]').eq(indexNum).prop("checked"));
				});
			});
		};
		return jQuery(this).each(function() {
			multiRadio(jQuery(this));						 
		});
	}

	//单选下拉框
	jQuery.fn.ruleSingleSelect = function () {
		var singleSelect = function (parentObj) {
			parentObj.addClass("single-select"); //添加样式
			parentObj.children().hide(); //隐藏内容
			var divObj = jQuery('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
			//创建元素
			var titObj = jQuery('<a class="select-tit" href="javascript:;"><span></span><i></i></a>').appendTo(divObj);
			var itemObj = jQuery('<div class="select-items"><ul></ul></div>').appendTo(divObj);
			var arrowObj = jQuery('<i class="arrow"></i>').appendTo(divObj);
			var selectObj = parentObj.find("select").eq(0); //取得select对象
			//遍历option选项
			selectObj.find("option").each(function (i) {
				var indexNum = selectObj.find("option").index(this); //当前索引
				var liObj = jQuery('<li>' + jQuery(this).text() + '</li>').appendTo(itemObj.find("ul")); //创建LI
				if (jQuery(this).prop("selected") == true) {
					liObj.addClass("selected");
					titObj.find("span").text(jQuery(this).text());
				}
				//检查控件是否启用
				if (jQuery(this).prop("disabled") == true) {
					liObj.css("cursor", "default");
					return;
				}
				//绑定事件
				liObj.click(function () {
					jQuery(this).siblings().removeClass("selected");
					jQuery(this).addClass("selected"); //添加选中样式
					selectObj.find("option").prop("selected", false);
					selectObj.find("option").eq(indexNum).prop("selected", true); //赋值给对应的option
					titObj.find("span").text(jQuery(this).text()); //赋值选中值
					arrowObj.hide();
					itemObj.hide(); //隐藏下拉框
					selectObj.trigger("change"); //触发select的onchange事件
					//alert(selectObj.find("option:selected").text());
				});
			});
			//设置样式
			//titObj.css({ "width": titObj.innerWidth(), "overflow": "hidden" });
			//itemObj.children("ul").css({ "max-height": jQuery(document).height() - titObj.offset().top - 62 });
			
			//检查控件是否启用
			if (selectObj.prop("disabled") == true) {
				titObj.css("cursor", "default");
				return;
			}
			//绑定单击事件
			titObj.click(function (e) {
				e.stopPropagation();
				if (itemObj.is(":hidden")) {
					//隐藏其它的下位框菜单
					jQuery(".single-select .select-items").hide();
					jQuery(".single-select .arrow").hide();
					//位于其它无素的上面
					arrowObj.css("z-index", "1");
					itemObj.css("z-index", "1");
					//显示下拉框
					arrowObj.show();
					itemObj.show();
				} else {
					//位于其它无素的上面
					arrowObj.css("z-index", "");
					itemObj.css("z-index", "");
					//隐藏下拉框
					arrowObj.hide();
					itemObj.hide();
				}
			});
			//绑定页面点击事件
			jQuery(document).click(function (e) {
				selectObj.trigger("blur"); //触发select的onblure事件
				arrowObj.hide();
				itemObj.hide(); //隐藏下拉框
			});
		};
		return jQuery(this).each(function () {
			singleSelect(jQuery(this));
		});
	}

	jQuery(function(){
		jQuery("input:checkbox").each(function(){
		//	jQuery(this).wrap('<div class="rule-single-checkbox" />');
		});
		jQuery("select").each(function(){
		//	jQuery(this).wrap('<div class="rule-single-select" />');
		});
		
		if(jQuery(".rule-single-checkbox,.rule-multi-checkbox,.rule-multi-radio,.rule-single-select,.rule-multi-porp").length>0){
			document.body.addStyle('/*多项单选*/\
	.multi-radio{ display:inline-block; vertical-align:middle; *display:inline; }\
		.multi-radio:after{ clear:both; content:"."; display:block; height:0; visibility:hidden; }\
		.multi-radio .boxwrap{ display:inline-block; vertical-align:middle; *display:inline;}\
		.multi-radio a{ display:inline-block; margin-right:-1px; float:left; padding:5px 15px; height:20px; line-height:20px; border:1px solid #d4d4d4; vertical-align:middle; color:#333; font-size:100%; cursor:pointer; }\
		.multi-radio a:hover{ background:#C9E1EF; text-decoration:none; }\
		.multi-radio a:active{ text-decoration:none; }\
		.multi-radio a.selected{ background:#16a0d3; border-color:#1096c7; color:#fff; }\
	/*单项选择*/\
	.single-checkbox{ display:inline-block; vertical-align:middle; cursor:pointer; *display:inline; }\
		.single-checkbox a,.single-checkbox a:visited{ display:inline-block; border:1px solid #d4d4d4; background:#d4d4d4; width:80px; vertical-align:middle; text-decoration:none; }\
		.single-checkbox a i{ display:block; width:50%; height:28px; line-height:28px; font-style:normal; background:#fff; color:#333; text-align:center; }\
		.single-checkbox a i.on{ float:right; display:none; }\
		.single-checkbox a i.off{ float:left; display:block; }\
		.single-checkbox a.selected{ border:1px solid #16a0d3; background:#16a0d3; }\
		.single-checkbox a.selected i.on{ display:block; }\
		.single-checkbox a.selected i.off{ display:none; }\
	/*多项选择*/\
	.multi-checkbox{ display:inline-block; vertical-align:middle; }\
		.multi-checkbox:after{ clear:both; content:"."; display:block; height:0; visibility:hidden; }\
		.multi-checkbox .boxwrap{ display:inline-block; vertical-align:middle; }\
		.multi-checkbox a{ display:inline-block; float:left; margin-right:-1px; padding:5px 15px; height:20px; line-height:20px; border:1px solid #d4d4d4; vertical-align:middle; color:#333; font-size:100%; cursor:pointer; }\
		.multi-checkbox a:hover{ background:#C9E1EF; text-decoration:none; }\
		.multi-checkbox a:active{ text-decoration:none; }\
		.multi-checkbox a.selected{ background:#16a0d3; border-color:#1096c7; color:#fff; }\
		.multi-checkbox a:last-child{ /*border-right:1px solid #d4d4d4;*/ }\
	/*多项选择PORP*/\
	.multi-porp{ }\
		.multi-porp ul li{ float:left; position:relative; margin:0 8px 8px 0; padding:1px; line-height:20px; vertical-align:middle; }\
		.multi-porp ul li a{ display:block; padding:4px 10px; color:#666; min-width:10px; width:auto !important;  text-align:center; text-decoration:none; white-space:nowrap; border:1px solid #ccc; cursor:pointer; }\
		.multi-porp ul li i{ display:none; position:absolute; right:0; bottom:0; width:12px; height:12px; text-indent:-99em; background:url(skin_icons.png) -169px -85px no-repeat; overflow:hidden; }\
		.multi-porp ul li.sys{ background:#FFFFD0; }\
		.multi-porp ul li.selected a{ margin:-1px; color:#333; border:2px solid #1e99c7; }\
		.multi-porp ul li.selected i{ display:block; background-position:-169px -113px; }\
	/*下拉菜单*/\
	.single-select{ position:relative; display:inline-block; margin-right:5px; vertical-align:middle; cursor:pointer; *float:left; }\
		.single-select .boxwrap{ display:inline-block; vertical-align:middle; }\
		.single-select .select-tit{ position:relative; display:block; padding:5px 38px 5px 10px; min-width:40px; line-height:20px; height:20px; border:solid 1px #dbdbdb; text-decoration:none; background:#fff; white-space:nowrap; word-break:break-all; }\
		.single-select .select-tit span{ display:inline-block; color:#333; font-size:12px; vertical-align:middle; }\
		.single-select .select-tit i{ position:absolute; right:0; top:0; display:block; width:28px; height:100%; border-left:1px solid #dbdbdb; background:url(skin_icons.png)  -49px -160px no-repeat #fafafa; }\
		.single-select .select-items{ display:none; position:absolute; left:0; top:45px; /*overflow:hidden;*/ }\
		.single-select .select-items ul{ position:relative; padding:5px; min-width:120px; max-height:280px; border:1px solid #dbdbdb; background:#fff; overflow-y:auto; overflow-x:hidden; }\
		.single-select .select-items ul li{ display:block; padding:4px 10px; line-height:20px; font-size:12px; color:#666; white-space:nowrap; cursor:pointer; }\
		.single-select .select-items ul li:hover{ color:#fff; text-decoration:none; background:#16a0d3; }\
		.single-select .select-items ul li.selected{ color:#FFF; background:#16a0d3; }\
		.single-select .arrow{ display:none; position:absolute; left:15px; top:35px; width:21px; height:11px; text-indent:-9999px; background:url(skin_icons.png) -40px -356px no-repeat; }');
	}

		//jQuery(".rule-single-checkbox").ruleSingleCheckbox();
		//jQuery(".rule-multi-checkbox").ruleMultiCheckbox();
		//jQuery(".rule-multi-radio").ruleMultiRadio();
		//jQuery(".rule-single-select").ruleSingleSelect();
		//jQuery(".rule-multi-porp").ruleMultiPorp();
	});

}
	// add dom load time and body load time to title
	var startTime=new Date();
	var documentLoadTime;
	function showInfo(msg){
		if(document.body.innerHTML==""||document.body.innerText==""||document.contentType!="text/html")return;
		var _pageInfo =document.getElementById("_userJs_pageInfo")
		if(!_pageInfo){
			_pageInfo = document.createElement('div');
			_pageInfo.id = '_userJs_pageInfo';
			_pageInfo.setAttribute("style","background-color:#eee; float: right; padding:5px 10px; position: fixed; bottom: 0; right: 0px;z-index:10000;font-size:10px;line-height:100%")
			document.body.appendChild(_pageInfo);
		}
		_pageInfo.innerHTML = _pageInfo.innerHTML+"<font color=#356AA0>"+msg+"</font><br/>";
		
	};
	
	function ShowDomBodyLoadTime(){
		var dom="Dom:";
		if(typeof(documentLoadTime)=='undefined')documentLoadTime = new Date() - startTime;
		//if(document.title.indexOf(dom)==-1)document.title += " "+dom+documentLoadTime/1000 +"s";
		var body_onload_fn=document.body.onload;
		document.body.onload= function() {var bodyStr="Body:";
			if(body_onload_fn)eval(body_onload_fn)();
			var loadTime = new Date() - startTime;
			showInfo(dom+documentLoadTime/1000 +"s  " +bodyStr+loadTime/1000 +"s");
			//if(document.title.indexOf(dom)==-1)document.title += " "+dom+documentLoadTime/1000 +"s";
			//if(document.title.indexOf(bodyStr)==-1)document.title += " "+bodyStr+loadTime/1000 +"s";
		};
	};

	function ShowReferrer(){
		var ref = document.referrer;
		if(ref=="")return;
		showInfo("referrer: "+document.referrer);
		// locate document.referrer
		var refLinks = jQuery("a[href='"+ref+"']");
		refLinks.each(function(){
			var refLink = this;
			refLink.style.textDecoration="underline";
			refLink.style.backgroundColor="#3F4C6C";
			refLink.style.color="red";
			if(!refLink.id)refLink.id="referrer";
			if(!refLink.title)refLink.title="referrer";
			//location.href = "#referrer";
		});
	};

	// https://bandwagonhost.com/clientarea.php?action=products
	function RemoveFormTarget(){
		if(location.href!="https://bandwagonhost.com/clientarea.php?action=products")return;
		jQuery("form[action*='kiwivm.it7.net/?mode=login']").attr("target","");
	};

	function OnlineForever(){
		/* jQuery.post("http://bbs.oupeng.com/member.php?mod=logging&action=login&loginsubmit=yes&handlekey=login&loginhash=qq&inajax=1", 
            {username:'alife',password:'99opera..'},
			function (data) {console.log(data);}
		) */
		jQuery.get("https://kiwivm.it7.net/main.php")
		setTimeout("OnlineForever()", 1000*60);
	};

	document.addEventListener('DOMContentLoaded', function(){
		if(window == window.parent){
			ShowDomBodyLoadTime();
			ShowReferrer();
		}
		RemoveFormTarget();
		//setTimeout("OnlineForever()", 1000*60);
	}, false);

})();

