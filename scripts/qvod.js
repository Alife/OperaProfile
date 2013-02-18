// ==UserScript==
// @include http://bbs.operachina.com/*
// @name QVOD
// @author yansyrs
// @include http://www.wo318.com/*
// @include http://www.tom365.com/*
// @include http://www.hiqvod.com/*
// @include http://www.qq500.com/*
// @include http://www.163kt.com/*
// ==/UserScript==

(function(){
	var List = '';// for 'url'
	var qurl = '';// for 'VideoInfoList'
	var qUrls = '';// for 'QvodUrls'

	/*------if the qvod url is not in js, then get it from DOM------*/
	window.addEventListener(
		'DOMContentLoaded',
		function(){
			var obj = document.selectSingleNode('//object[@classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF"]/param[@name="URL"]');
			if(obj.value){
				var link = obj.value;
				document.write('<body style="background-color:#DDDDDD;"><center style="margin-top:20%;"><a href="loadqvod:'+link+'">\u70B9\u51FB\u64AD\u653E</a></center></body>');
			}
		},false
	);

	/*-----prevent the no-qvod error-----*/
	window.opera.addEventListener(
		"BeforeEventListener.error",
		function (e) {
			e.preventDefault();
		}, false
	);

	/*-----get the qvod url from js-----*/
	/*begin*/
	window.opera.defineMagicVariable(
		'VideoInfoList',
		function (curVal){
			List = curVal;
		},null
	);

	window.opera.defineMagicVariable(
		'url',
		function (curVal){
			qurl = curVal;
		},null
	);

	window.opera.defineMagicVariable(
		'QvodUrls',
		function (curVal){
			qUrls = curVal;
		},null
	);
	/*end*/
	
	/*-----if the url is in js, then show them(or it)------*/
	window.opera.addEventListener(
		"BeforeScript",
		function (e) {
			/*-----if use the var 'VideoInfoList'-----*/
			if( (List != '') && (List.search(/\$?qvod(\$\$|#)[^$]+\$[^$]+/g) != -1) ){
				var items = List.match(/\$?qvod(\$\$|#)[^$]+\$[^$]+/g);
				var str = '';
				for(x in items){
					str += '<a href="loadqvod:'+items[x].replace(/\$?qvod(\$\$|#)[^$]+\$(.*)/,'$2')+'">part '+(parseInt(x)+1)+'</a><br/>';
				}
				if(str != ''){
					str = '<body style="background-color:#DDDDDD;"><center style="margin-top:50px;">'+str+'</center></body>';
					document.write(str);
				}
				else
					document.write('<body style="background-color:#DDDDDD;"><center style="margin-top:100px;">sorry, can not find qvod video</center></body>');
			}
			
			/*-----if use the var 'url'-----*/
			else if(qurl != ''){
				if(qurl.search(/(qvod:\/\/|http:\/\/).*(rmvb|rm)\|?/) != -1)
					document.write('<body style="background-color:#DDDDDD;"><center style="margin-top:20%;"><a href="loadqvod:'+qurl+'">\u70B9\u51FB\u64AD\u653E</a></center></body>');
			}
			
			/*-----if use the var 'QvodUrls'-----*/
			else if( (qUrls !='') && (qUrls.indexOf('qvod://') != -1) ){
				var arr = qUrls.split("###");
				var temp = '';
				for(x in arr){
					temp += '<a href="loadqvod:'+arr[x]+'">part '+(parseInt(x)+1)+'</a><br/>';
				}
				if(temp != ''){
					temp = '<body style="background-color:#DDDDDD;"><center style="margin-top:50px;">'+temp+'</center></body>';
					document.write(temp);
				}
				else
					document.write('<body style="background-color:#DDDDDD;"><center style="margin-top:100px;">sorry, can not find qvod video</center></body>');
			}
		},false
	);
})();