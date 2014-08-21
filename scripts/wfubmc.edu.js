// ==UserScript==
// @name wfubmc.edu helper
// @description auto login and auto check in/out
// @include http://psappprd1.is.wfubmc.edu:8001/*
// @author	lk
// ==/UserScript==


document.addEventListener('DOMContentLoaded', function(){
	var getPath=function(){
		var href=location.href;
		if(href.indexOf("?")>-1)href=href.substring(0,href.indexOf("?"));
		var dirs=href.split("/");
		return dirs[dirs.length-1];
	}
	
	// auto login when page is login page
	var url = location.href;
	var body_onload_fn=document.body.onload;
	document.body.onload= function() {
		if(body_onload_fn)eval(body_onload_fn)();
		var _sS_errorTime = "autoLoginErrorTome";
		var errorTimeV=sessionStorage.getItem(_sS_errorTime)||0;
		var form = document.getElementById("login");
		if(form&&form.nodeName=="FORM"&&form.getAttribute("action")=="?cmd=login&languageCd=ENG"){
			if(form.userid&&form.pwd&&form.userid.value!=""&&form.pwd.value!=""){
				if(errorTimeV==0){form.submit();sessionStorage.setItem(_sS_errorTime,1);}
			}
			form.pwd.addEventListener('change', function(){
				if(form.userid&&form.pwd&&form.userid.value!=""&&form.pwd.value!=""){
					if(errorTimeV==0){form.submit();sessionStorage.setItem(_sS_errorTime,1);}
				}
			},false);
		}
	};
	
	// go to the first day of week when Timesheet page
if(url.indexOf("/psp/hrpro/EMPLOYEE/HRMS/h/?tab=DEFAULT")>-1){	
	location.href="/psp/hrpro/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_SS_JOB_SRCH_CLK.GBL?NAVSTACK=Clear&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HC_TIME_REPORTING.HC_RECORD_TIME.HC_TL_SS_JOB_SRCH_CLK_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder";
}
if(getPath()==("ROLE_EMPLOYEE.TL_MSS_EE_SRCH_PRD.GBL")){
	var DATE_DAY1=document.getElementById("DATE_DAY1");
	var _sS_TL_LINK_WRK = "TL_LINK_WRK_REFRESH_ICN";
	var _TL_LINK_WRK_V=sessionStorage.getItem(_sS_TL_LINK_WRK)||0;
	if(DATE_DAY1){
		var nowTime=new Date();
		nowTime=nowTime.getFullYear()+"/"+(nowTime.getMonth()+1)+"/"+(nowTime.getDate()-nowTime.getDay());
		if(new Date(DATE_DAY1.value)-new Date(nowTime)!=7*24*60*60*1000&&_TL_LINK_WRK_V==0){
			DATE_DAY1.value=nowTime;
			document.getElementById("TL_LINK_WRK_REFRESH_ICN").click();
			sessionStorage.setItem(_sS_TL_LINK_WRK,1);
		}
	}
}
	// auto check in/out
if(getPath()==("ROLE_EMPLOYEE.TL_WEBCLK_ESS.GBL")){
	//if(window.parent!=window)return;
	var minute=10;
	var time=0;var inTime=new Date(),outTime=new Date();
	inTime.setHours(9);outTime.setHours(13);
	var _sS_lastAutoCheckIn= "lastAutoCheckIn",_sS_lastAutoCheckOut= "lastAutoCheckOut";
	var myVar = setInterval(function(){
		var d=new Date();
		if(d.getDay()>=1||d.getDay()<=5){
			var type=document.getElementById("TL_RPTD_TIME_PUNCH_TYPE$0");
			var save=document.getElementById("TL_LINK_WRK_TL_SAVE_PB$0");
			if(!type||!save)return;
			if(d.getHours()==inTime.getHours()&&d.getMinutes()==minute
				&&(new Date(localStorage.getItem(_sS_lastAutoCheckIn))-new Date(new Date().toLocaleDateString())<0)){
				type.selectedIndex=1;log("type.click.in");
				//type.click();
				localStorage.setItem(_sS_lastAutoCheckIn,new Date().toLocaleDateString());
			}else if(d.getHours()==outTime.getHours()&&d.getMinutes()==minute
				&&(new Date(localStorage.getItem(_sS_lastAutoCheckOut))-new Date(new Date().toLocaleDateString())<0)){
				type.selectedIndex=3;log("type.click.out");
				//type.click();
				localStorage.setItem(_sS_lastAutoCheckOut,new Date().toLocaleDateString());
			}
		}
		//alert("Hello");
		//if(time==0)clearInterval(myVar);
		time=time+1;
	}, 1000*30);
	// auto reload page pre 20 minutes avoid timeOut
	var _Interval_Refresh = setInterval(function(){
		location.reload();
	}, 1000*60*20);
}
	
}, false);



		