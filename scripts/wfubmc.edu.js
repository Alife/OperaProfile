// ==UserScript==
// @name wfubmc.edu helper
// @description auto login and auto check in/out
// @include http://psappprd1.is.wfubmc.edu:8001/*
// @todo show check in/out time pick up control on web
// @todo show check in/out status on web
// @todo check out time should after 4 fours the time of check in
// @author	lk
// ==/UserScript==


var wfubmcTools={
	url:location.href,
	body_onload_fn:null,
	typeSelect:null,
	saveButton:null,
	AutoCheckInTime:"9:17",
	AutoCheckHour:4,	// hours check out time = checkInTime.addHours(AutoCheckHour)
	_sS_lastAutoCheckIn:"lastAutoCheckIn",
	_sS_lastAutoCheckOut:"lastAutoCheckOut",

	getPath:function(){
		var href=location.href;
		if(href.indexOf("?")>-1)href=href.substring(0,href.indexOf("?"));
		var dirs=href.split("/");
		return dirs[dirs.length-1];
	},
	// auto login when page is login page
	init:function(){
		this.body_onload_fn=document.body.onload,
		document.body.onload= function() {
			if(this.body_onload_fn)eval(this.body_onload_fn)();
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
		if(this.url.indexOf("/psp/hrpro/EMPLOYEE/HRMS/h/?tab=DEFAULT")>-1){	
			location.href="/psp/hrpro/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_SS_JOB_SRCH_CLK.GBL?NAVSTACK=Clear&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HC_TIME_REPORTING.HC_RECORD_TIME.HC_TL_SS_JOB_SRCH_CLK_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder";
		}
		if(this.getPath()==("ROLE_EMPLOYEE.TL_MSS_EE_SRCH_PRD.GBL")){
			var DATE_DAY1=document.getElementById("DATE_DAY1");
			var _sS_TL_LINK_WRK = "TL_LINK_WRK_REFRESH_ICN";
			var _TL_LINK_WRK_V=sessionStorage.getItem(_sS_TL_LINK_WRK)||0;
			if(DATE_DAY1){
				var nowTime=new Date();
				var day=(nowTime.getDate()-nowTime.getDay());day=day==0?1:day;
				nowTime=nowTime.getFullYear()+"/"+(nowTime.getMonth()+1)+"/"+day;
				if(new Date(DATE_DAY1.value)-new Date(nowTime)!=7*24*60*60*1000&&_TL_LINK_WRK_V==0){
					DATE_DAY1.value=nowTime;
					document.getElementById("TL_LINK_WRK_REFRESH_ICN").click();
					sessionStorage.setItem(_sS_TL_LINK_WRK,1);
				}
			}
		}
			// auto check in/out
		this.typeSelect=document.getElementById("TL_RPTD_TIME_PUNCH_TYPE$0");
		this.saveButton=document.getElementById("TL_LINK_WRK_TL_SAVE_PB$0");
		if(this.getPath()==("ROLE_EMPLOYEE.TL_WEBCLK_ESS.GBL")){
			//if(window.parent!=window)return;
			var minute=5;
			var time=0;var inTime=new Date(),outTime=new Date();
			inTime.setHours(9);outTime.setHours(13);
			var myVar = setInterval(function(){
				var d=new Date();
				if(d.getDate()>=1||d.getDate()<=5){
					if(!wfubmcTools.typeSelect||!wfubmcTools.saveButton)return;
					if(wfubmcTools.isCheckInTime()){
						wfubmcTools.typeSelect.selectedIndex=1;log("this.typeSelect.click.in");
						wfubmcTools.saveButton.click();
						wfubmcTools.updateStorage();
					}else if(wfubmcTools.isCheckOutTime()){
						wfubmcTools.typeSelect.selectedIndex=3;log("this.typeSelect.click.out");
						//this.saveButton.click();
						wfubmcTools.updateStorage();
					}
				}
				//alert("Hello");
				//if(time==0)clearInterval(myVar);
				time=time+1;
			}, 1000*10);
			// auto reload page pre 20 minutes avoid timeOut
			var _Interval_Refresh = setInterval(function(){
				location.reload();
			}, 1000*60*20);
		
			if(!this.typeSelect||!this.saveButton)return;
			this.saveButton.addEventListener('click', function(){
				wfubmcTools.updateStorage();
			}, false);
		}

		// show info
		this.showInfo("lastIn :"+new Date(localStorage.getItem(this._sS_lastAutoCheckIn)).toLocaleString());
		this.showInfo("lastOut:"+new Date(localStorage.getItem(this._sS_lastAutoCheckOut)).toLocaleString());
	},
	showInfo:function(msg){
		var id="_userJs_Info";
		var _pageInfo =document.getElementById(id)
		if(!_pageInfo){
			_pageInfo = document.createElement('div');
			_pageInfo.id = id;
			_pageInfo.setAttribute("style","background-color:#eee; float: right; padding:5px 10px; position: fixed; bottom: 0; right: 0px;z-index:10000")
			document.body.appendChild(_pageInfo);
		}
		_pageInfo.innerHTML = _pageInfo.innerHTML+"<font color=yellor>"+msg+"</font><br/>";
		
	},
	updateStorage:function(){
		if(!this.typeSelect||!this.saveButton)return;
		if(this.typeSelect.selectedIndex==1){
			localStorage.setItem(this._sS_lastAutoCheckIn,new Date());
		}else if(this.typeSelect.selectedIndex==3){
			localStorage.setItem(this._sS_lastAutoCheckOut,new Date());
		} 
	},
	isCheckInTime:function(){
		var d=new Date();
		if(d.getDay()<1||d.getDay()>5)return false;
		var inTime = new Date(d.getFullYear()+" "+(d.getMonth()+1)+" "+d.getDate()+" "+this.AutoCheckInTime);
		var mins=new Date()-inTime;// check if approach the time of check in 1 minutes
		if(mins<0||mins>1000*60)return false;
		var lastInTime = new Date(localStorage.getItem(this._sS_lastAutoCheckIn));// check if already check in today
		return new Date(lastInTime.toDateString())-new Date(new Date().toDateString())!=0;
	},
	isCheckOutTime:function(){
		var d=new Date();
		if(d.getDay()<1||d.getDay()>5)return false;
		var outTime = new Date(localStorage.getItem(this._sS_lastAutoCheckIn));
		outTime.setHours(outTime.getHours()+this.AutoCheckHour);
		var mins=outTime-d;
		if(mins<0||mins>1000*60)return false;
		return true;
	},

};
	
document.addEventListener('DOMContentLoaded', function(){
	wfubmcTools.init();
}, false);



		