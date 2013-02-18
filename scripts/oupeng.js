// ==UserScript==
// @include http://*.oupeng.com/*
// @include http://59.151.113.239:8801/*
// @include http://*.taobao.com/*
// ==/UserScript==
function findStar(){
	return;
	if (!(location.href===("http://shop.oupeng.com/pages/index.do")||location.href.indexOf("s.m.taobao.com")>-1))return;
	var isFindStar = localStorage.getItem("isFindStar") ==null?false:localStorage.getItem("isFindStar");
	localStorage.setItem("isFindStar", false);
	var links = jQuery('a');
	jQueryGet(links,0);
}
function jQueryGet(links,i){
	if(links[i]||localStorage.getItem("isFindStar")==='true'){
		var link = jQuery(links[i]);
		jQuery.get(link.attr("href"),{},function(data){
			//console.log(i);
			if (typeof(data)=="string"){
				while(data.indexOf(" ")>-1||data.indexOf("\n")>-1){
					data=data.replace(/<(?:.|\n)*?>/gm,"").replace(" ","").replace("\n","");
				}
				if(data.indexOf("你是幸运星")>-1){
					localStorage.setItem("isFindStar", true);
					localStorage.setItem("answer", true);
					console.log("answer: " + link.html().replace(/<(?:.|\n)*?>/gm,""));
				}
			}else if (data.readyState === 4 && data.status === 302) {
					jQueryGet(links,i++);
			}else{
				if(data.responseText.indexOf("你是幸运星")>-1){
					localStorage.setItem("isFindStar", true);
					localStorage.setItem("answer", true);
					console.log("answer: " + link.html().replace(/<(?:.|\n)*?>/gm,""));
				}else if(data.indexOf("你是幸运星")>-1){
					localStorage.setItem("isFindStar", true);
					localStorage.setItem("answer", true);
					console.log("answer: " + link.html().replace(/<(?:.|\n)*?>/gm,""));
				}else{
					i=i+1;
					jQueryGet(links,i);
				}
			}
		})
		.success(function(){})
		.error(function(){})
		.complete(function(){i=i+1;jQueryGet(links,i);});
	}
}

function pagetest() {
	var floor = jQuery("div.pi>strong>a>em:last").html() / 1;
	if ((floor + 1) % 10 == 0 || (floor + 0) % 10 == 0) {
		//var content ="抢个 " + (floor / 1 + 1) + " 楼";
		jQuery('#fastpostmessage').val(content);
		autopost();
	} else {
		window.location = locationurl;
	}
}

function autopost() {
	document.forms['fastpostform'].replysubmit.click();
	window.location = locationurl;
}

// 添加删除按钮
function addDeleteButton() {
	// 删除帖子
	jQuery("a[class='editp']").each(function(){
		jQuery(this).after("<span class='delete'>删除</span>").addClass("deleteAdded");
		jQuery(this).next().click(function(){
			var table = jQuery(this);
			while(table[0].tagName!="TABLE"){table=table.parent();if(table.length<=0)break;}
			var tid=GetUrlPara("tid");
			var pid = table.attr("id").replace("pid","");
			jQuery.post("/forum.php?mod=post&action=edit&extra=&editsubmit=yes", 
			{formhash:"9d4ea3fb",tid:tid,pid:pid,usesig:1,delete:1},
			function(data){
				postData(data);
			});
			table.remove();
		});
	});
	// 删除记录
	jQuery("a[id*='_doing_delete_']").each(function(){
		jQuery(this).click(function(){
			var id=this.id.split('_')[this.id.split('_').length-2];
			jQuery.post("/home.php?mod=spacecp&ac=doing&op=delete&doid="+id+"&id=0", 
			{formhash:"9d4ea3fb",deletesubmit:true,handlekey:this.id},
			function(data){
				var table=jQuery(this);
				while(table[0].tagName!="DL"){table=table.parent();if(table.length<=0)break;}
				table.remove();
				postData(data);
			});
			jQuery(this).parent().parent().remove();
		});
	});
}
jQuery(window).scroll( function() {addDeleteButton();} );

function analyze() {
	jQuery(".authi>a.xw1").each(function () {
		var name = jQuery(this).html();
		//console.log(name);
		if (name == null) {
			//continue;
		}
		var nameValue = localStorage.getItem(name);
		if (nameValue == null) {
			nameValue = 0;
		}
		nameValue = nameValue / 1 + 1;
		//console.log(name + " " + nameValue);
		localStorage.setItem(name, nameValue);
		jQuery(this).removeClass("xw1");
	});
	
}

// 积分:11313	18644
// 积分:12036	19166
var timer = 15;
var timesecond = timer;
var document_title = document.title;
var Process1 = setInterval(function () {
	var time = new Date();
	// 抢楼
	if (jQuery('#fastpostmessage').length > 0) {
		if (location.href.indexOf("&tid=31421") > -1
		//&&",9,10,11,12,16,18,19,20,21,22,".indexOf(","+(time.getHours()-1)+",") > -1 
		&&time.getHours() > 8 
		&&time.getHours() < 23 
		//&&time.getMinutes()%2!=0
		&& (time.getSeconds() ==59||time.getSeconds() ==59-30||time.getSeconds() ==59-0)
		) {
			var content = "现在时刻:北京时间:"+time.toLocaleString();
			content = "HIFI音响                  ";
			jQuery('#fastpostmessage')[0].value=content;
			document.forms['fastpostform'].replysubmit.click();
		}
		
		//var floor = jQuery("div.pi>strong>a>em").html() / 1;
		//if ((floor + 1) % 1000 == 0) {
		//	//document.forms['fastpostform'].replysubmit.click();
		//} else {
		//	var url = location.href.indexOf("&page=5000") == -1? location.href + "&page=5000":location;
		//	//window.navigate(url);
		//}
		//if (timesecond == 0) {//document.forms['fastpostform'].replysubmit.click();
		//}
	}
	// 签到
	if (1==1
	&&time.getHours()==23
	&&time.getMinutes()==59
	&& (time.getSeconds() ==59)
	) {
		jQuery.post("/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1", 
		{fastreply:0,formhash:"9d4ea3fb",qdmode:1,qdxq:"kx",todaysay:time.toLocaleString()},
		function(data){
			postData(data);
		});
	}
	
	//console.log(time.getHours()+":"+time.getSeconds()+":"+time.getMinutes());
	// 个人信息
	if (1==1
	&&time.getHours()==0
	&&time.getMinutes()==1
	&&time.getMinutes()==2
	&&time.getSeconds()%15==0
	) {
		// home.php?mod=space&do=doing
		jQuery.post("/home.php?mod=spacecp&ac=doing&view=we",{formhash:"9d4ea3fb",addsubmit:true,message:"[em:"+((time.getMinutes()%15)/1+1)+":]"},
		function(data){
			postData(data);
		});
		// 红包
		jQuery.get("/home.php?mod=task&do=apply&id=7",{},function(data){
			postData(data);
		});	
		// 打招呼
		jQuery.post("/home.php?mod=spacecp&ac=poke&op=send&uid=8992&inajax=1",
			{formhash:"9d4ea3fb",handlekey:"a_poke_12142",iconid:"3",pokesubmit:true},function(data){
			postData(data);
		});	
	}
	
	timesecond--;
	if (timesecond < 0)timesecond = timer;
	analyze();
}, 1000);

var document_title = document.title;
var IsProcess = false;
var UserJsRun = new Date();
jQuery(document).ready(function () {
	var ready = new Date();
	//console.log("UserJsRun.Time:"+(ready.getTime()/1-UserJsRun.getTime()/1));
	if(document.body.innerHTML.indexOf("你是幸运星") > -1){document.title = "QQQQ";}
	else{
		IsProcess = true;
	}
});
var ProcessTime2Title = setInterval(function () {
	if(IsProcess){var time = new Date();
	if(document_title&&document_title=="")document_title = document.title;
	document.title = document_title+"      "+time.toLocaleTimeString();}
	jQuery("span[class!='fixed'][title^='20']").each(function(){jQuery(this).html(jQuery(this).attr("title")).addClass("fixed");});
}, 1000);


function GetUrlPara(ParaStr) {
	var value = "";
	var UrlParas = location.search.replace("?", "").split("&");
	var UrlParas_Lenght = UrlParas.length;
	for (var i = 0; i < UrlParas_Lenght; i++) {
		var UrlPara = UrlParas[i];
		var Para = UrlPara.split("=");
		if (Para[0] === ParaStr) {
			if (value != "") {
				value += ",";
			}
			value += Para[1];
		}
	}
	return value;
}

function postData(data)
{
	var value;
	if(typeof(data)==="XMLDocument")
		value=data.documentElement.textContent;
	else if(typeof(data)==="object")
		value=data;
	console.log(typeof(data));
	console.log(value);
}

jQuery(document).ready(function () {
	var wtt = 1000 * 1;
	locationurl = location + "";
	if (locationurl.indexOf("&page=3000") == -1)
		locationurl = locationurl + "&page=3000";
	if (locationurl.indexOf("&tid=226211") > -1 && jQuery('#fastpostmessage').length > 0) {
		//pagetest();
	}
	//localStorage.clear();
	var page = localStorage.getItem("page") ==null?1:localStorage.getItem("page")/1+1;
	if(page <= 4){
	analyze();
	localStorage.setItem("page", page);
		//window.navigate("http://bbs.oupeng.com/forum.php?mod=viewthread&tid=22621&extra=&checkrush=1&page="+(page/1+1));
	}
	findStar();
});

