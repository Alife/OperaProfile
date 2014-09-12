// ==UserScript==
// @name wfubmc.edu helper
// @description auto login and auto check in/out
// @include http://psappprd1.is.wfubmc.edu:8001/*
// @todo √ show check in/out time pick up control on web
// @todo √ show check in/out status on web
// @todo √ check out time should after 4 fours the time of check in
// @todo show countdown of check time 
// @todo calculate the whole week hours 
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
		href= dirs[dirs.length-1];
		dirs=href.split("#");
		return dirs[0];
	},
	// auto login when page is login page
	init:function(){
		this.syncPref();
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
		// go to Timesheet page after check in/out
		var _SAVE_MSG=document.getElementById("DERIVED_ETEO_SAVE_MSG_CUSTOM");
		if(_SAVE_MSG&&_SAVE_MSG.innerHTML.indexOf("sucessfully")>-1)
			this.gotohref("/psp/hrpro/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_MSS_EE_SRCH_PRD.GBL");
		// go to Web check  page after login
		if(this.url.indexOf("/psp/hrpro/EMPLOYEE/HRMS/h/?tab=DEFAULT")>-1){	
			this.gotohref("/psp/hrpro/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_SS_JOB_SRCH_CLK.GBL");
		}
		// go to the first day of week when Timesheet page
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
				wfubmcTools.syncPref();
				var d=new Date();
				if(d.getDate()>=1||d.getDate()<=5){
					if(!wfubmcTools.typeSelect||!wfubmcTools.saveButton)return;
					if(wfubmcTools.isCheckInTime()){
						wfubmcTools.typeSelect.selectedIndex=1;log("this.typeSelect.click.in");
						wfubmcTools.saveButton.click();
						wfubmcTools.updateStorage();
					}else if(wfubmcTools.isCheckOutTime()){
						wfubmcTools.typeSelect.selectedIndex=3;log("this.typeSelect.click.out");
						wfubmcTools.saveButton.click();
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
			
		if(window.parent!=window)return;
		// show info
		this.showInfo("last<span style='display:inline-block;width:10px;'></span>In:"+this.getHumenDate(new Date(localStorage.getItem(this._sS_lastAutoCheckIn))));
		this.showInfo("lastOut:"+this.getHumenDate(new Date(localStorage.getItem(this._sS_lastAutoCheckOut))));
		var WillOut=new Date(localStorage.getItem(this._sS_lastAutoCheckIn));
		WillOut.setMinutes(WillOut.getMinutes()+(this.AutoCheckHour/1*60));
		this.showInfo("WillOut:"+this.getHumenDate(WillOut));
		this.addHtml();
		this.setPref();
	},
	addHtml:function(){
		var id="_userJs_Info";
		var _pageInfo =document.getElementById(id)
		document.body.addStyle("._userJs_Info{background-color:#eee; float: right; padding:5px 10px; position: fixed; bottom: 0; right: 0px;z-index:10000;font-size:10px;line-height:100%}\
			._userJs_Info .hide1{text-indent: -9999px;}\
			._userJs_Info ul{margin:0;padding:0}\
			._userJs_Info input{height:10px}\
			._userJs_Info li{list-style:none}");
		if(!_pageInfo){
			_pageInfo = document.createElement('div');
			_pageInfo.id = id;_pageInfo.className = id;
			document.body.appendChild(_pageInfo);
		}
		_pageInfo.innerHTML=_pageInfo.innerHTML+'\
			<fieldset><legend title="相关设置">设置</legend><ul>\
				<li>AutoCheckInTime:<input type="text" maxlength=5 size="5" title="time like 9:00" name="AutoCheckInTime"/></li>\
				<li>AutoCheckHour:<input type="text" maxlength=2 size="2" title="AutoCheckHour" name="AutoCheckHour"/></li>\
			</ul></fieldset>';
	},
	gotohref:function(href){
		location.href=href;
	},
	setPref:function(date){
		jQuery("._userJs_Info input").each(function(){
			this.value=localStorage.getItem("pref_"+this.name)||eval("wfubmcTools."+this.name);
			jQuery(this).change(function(){
				localStorage.setItem("pref_"+this.name,this.value);
				wfubmcTools[this.name]=this.value;
			});
		})
	},
	// sync variables from localStorage
	// need execute it when each thread start like DOMContentLoaded, setInterval
	syncPref:function(){
		for(var i=0,ii=localStorage.length;i<ii;i++){
			lname=localStorage.key(i);
			if(!lname || !/^pref_/i.test(lname))continue;
			var name=lname.replace(/^pref_/i,"");
			wfubmcTools[name]=localStorage.getItem(lname)||eval("wfubmcTools."+name);
		};
	},
	getHumenDate:function(date){
		var d=new Date();
		var day=new Date(new Date().toLocaleDateString())-new Date(date.toLocaleDateString());
		if(day==0)return "Today "+date.toLocaleTimeString();
		else if(day==24*60*60*1000)return "Yesterday "+date.toLocaleTimeString();
		else return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.toLocaleTimeString();
	},
	showInfo:function(msg){
		var id="_userJs_Info";
		var _pageInfo =document.getElementById(id)
		if(!_pageInfo){
			_pageInfo = document.createElement('div');
			_pageInfo.id = id;_pageInfo.className = id;
			document.body.appendChild(_pageInfo);
		}
		_pageInfo.innerHTML = _pageInfo.innerHTML+"<font color=yellor>"+msg+"</font><br/>";
		return _pageInfo;
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
		if(mins>1000*60)return false;
		var lastTime = new Date(localStorage.getItem(this._sS_lastAutoCheckIn));// check if already check in today
		return new Date(lastTime.toDateString())-new Date(new Date().toDateString())!=0;
	},
	isCheckOutTime:function(){
		var d=new Date();
		if(d.getDay()<1||d.getDay()>5)return false;
		var outTime = new Date(localStorage.getItem(this._sS_lastAutoCheckIn));
		outTime.setHours(outTime.getHours()+this.AutoCheckHour);
		var mins=outTime-d;
		if(mins>1000*60)return false;
		var lastTime = new Date(localStorage.getItem(this._sS_lastAutoCheckOut));// check if already check in today
		return new Date(lastTime.toDateString())-new Date(new Date().toDateString())!=0;
	},

};
	
document.addEventListener('DOMContentLoaded', function(){
	wfubmcTools.init();
}, false);



		