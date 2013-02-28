// ==UserScript==
// @include http://www.stardaily.com.cn/*
// ==/UserScript==
window.opera.defineMagicFunction(
    "getthedate",
    function() {
			var mydate=new Date();
			var year=mydate.getYear();
			var day=mydate.getDay();
			var month=mydate.getMonth()+1;
			var daym=mydate.getDate();
			var hours=mydate.getHours();
			var minutes=mydate.getMinutes();
			var seconds=mydate.getSeconds();
			var dn="AM";
			if (year < 1000) year+=1900;
			if (minutes<=9) minutes="0"+minutes;
			if (seconds<=9) seconds="0"+seconds;
			var cdate="<span >2010年"+montharray[month-1]+"月"+dayarray[daym-1]+"日 星期"+weekarray[day]+"</span>";
			clock.innerHTML = cdate;
    }
);
