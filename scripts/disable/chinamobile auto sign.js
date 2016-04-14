// ==UserScript==
// @name all jquery user js
// @description 
// @depends jquery.js like 0jquery-1.8.3.js
// @include	http://weixin.qh.chinamobile.com/*
// @include	http://wxpool/imss/*
// @include	http://bbs.oupeng.com/*
// @author	lk
// ==/UserScript==

if(typeof(jQuery)!='undefined'){
	function TimeCounter(){
		var timeLi=jQuery("#signTimeCounter");
		var Interval_Time=localStorage.getItem("Interval_Time");
		Interval_Time=Interval_Time==null?0:parseInt(Interval_Time);
		if(timeLi.length==0){
			var timeLi=jQuery(document.createElement("div"));
			timeLi.attr("id","signTimeCounter");
			timeLi.attr("style","text-align:center;position:absolute;right:10%");
			timeLi.text(31);
			jQuery("body").prepend(timeLi);
		}
		var time=timeLi.text();
		if(time==0){
			jQuery.get(location.href,function(data, textStatus, jqXHR){
				jQuery(".blockUI").hide();
				var ms=new RegExp("用户积分：(\\d*)分").exec(data);
				if(ms&&ms.length>0&&parseInt(ms[1])>0){
					Interval_Time=Interval_Time+1;
					localStorage.setItem("Interval_Time",Interval_Time);
					document.title=document.title.split(" ")[0]+" "+Interval_Time+" "+new Date().getSeconds()+"s";
				}
				else location.reload();
			});
			time=31;
		}
		timeLi.text(time-1);
		var now=new Date();
		if(now.getHours()==0&&now.getMinutes()==0&&now.getSeconds()==10){
			location.reload();
		}
		var signed=$('#signed').val();
		if(signed!=0){
			var J_sign=jQuery("#J_sign");
			J_sign.click();
		}
	}
	jQuery(document).ready(function () {
		if(location.host=="wxpool")location="http://weixin.qh.chinamobile.com/imss/app?service=page/SignIn&listener=initPage&code=0019a5d896e0f6c1eff94c644b04e7d0&state=1";
		if(jQuery("#IDNUM").length>0){
			var ls=localStorage.getItem("aftakampl0").split("^");
			for(var i=0;i<ls.length;i++){var vs=ls[i].split("#");
				if(!(ls[i].indexOf("IDNUM#")>-1&&vs.length==2))continue;
				jQuery("#IDNUM").val(vs[1]);
				var TIP_Time = localStorage.getItem("TIP_Time");
				if(TIP_Time){
					TIP_Time=new Date(TIP_Time);TIP_Time.setMinutes(TIP_Time.getMinutes()+10);
				}
				if(!TIP_Time||TIP_Time<=new Date()){
					jQuery("#sendSmsbtn").click();
					localStorage.setItem("TIP_Time",new Date());
					localStorage.setItem("Interval_Time",0);
				}break;
			}
		}
		if(jQuery("#J_sign").length>0){
			var IntervalId=self.setInterval("TimeCounter()",1000);
		}
		if(location.host=="http://bbs.oupeng.com/misc.php?mod=patch&action=ipnotice&_r=0.6256427522676054&inajax=1&ajaxtarget=ip_notice"){
			var IntervalId=self.setInterval("TimeCounter()",1000);
		}
	});
	
}

