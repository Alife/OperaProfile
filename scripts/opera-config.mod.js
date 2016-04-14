// ==UserScript==
// @name opera config mod
// @description 
// @include opera:config
// @depends none
// @author	lk
// ==/UserScript==

(function(){
if(window.location.href.indexOf("opera:config")==-1)return;

HTMLElement.prototype.hasClassName = function(className){  
    var eN = this.className;  
    if (eN.length == 0) return false;  
    //用正则表达式判断多个class之间是否存在真正的class（前后空格的处理）  
    if (eN == className || eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))  
      return true;return false;  
}  
HTMLElement.prototype.addClass = function(className){  
    var eN = this.className;  
    if(eN.length == 0){this.className = eN;}
	else if (eN == className || eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))   
        return;  
    this.className = eN + " " + className;  
}  
HTMLElement.prototype.removeClass= function(className){  
    var eN = this.className;  
    if (eN.length == 0) return;  
    if(eN == className){this.className = "";return;}  
    if (eN.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))){
        this.className = eN.replace((new RegExp("(^|\\s)" + className + "(\\s|$)"))," ");}  
}
HTMLBodyElement.prototype.addStyle = function(css){
	var s = document.createElement('style');
	s.setAttribute('type', 'text/css');
	s.setAttribute('style', 'display: none !important;');
	s.appendChild(document.createTextNode(css));
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};
HTMLBodyElement.prototype.addScript = function(script){
	var d=document;var b=d.body;var s=d.createElement('script');
	s.setAttribute('src',script);
	s.setAttribute('type','text/javascript');
	b.appendChild(s);
	return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};

document.body.addStyle("tr.change{background-color:yellow;}tr.unsave{background-color:red;}.dv{position:absolute;margin-top: 2em;}");
document.body.addScript("http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");

var s=document.createElement('style'); s.setAttribute('type', 'text/css'); s.setAttribute('style', 'display:none !important;'); 
s.appendChild(document.createTextNode('small {font-family: sans-serif; color: rgb(80,85,90); display: block;}')); 
document.documentElement.appendChild(s);
var ips = document.querySelectorAll("TD>input");
for (var i = 1, m; m = ips[i]; i ++) {
	var f = m.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('legend')[0].firstChild.nodeValue;
	var k = m.parentNode.parentNode.getElementsByTagName('label')[0].firstChild.nodeValue;
	var v = (m.type == 'checkbox') ? (m.checked ? '1' : '0') : m.value;
	var tr=m.parentNode.parentNode;
	var dv=opera.getPreferenceDefault(f, k);
	var cv=opera.getPreference(f, k);
	if (dv!=v) {tr.addClass("change");}
	if (cv!=v) {tr.addClass("unsave");}
	var title="默认为: "+(dv==""?"空":dv);
	m.title=title;
	if(m.type="checkbox"){m.outerHTML="<span class=dv>"+title+"</span>"+m.outerHTML;}
	//console.log("id="+m.id+" cv="+cv+" dv="+dv+" v="+v);
}

var ul = document.createElement("ul");
ul.innerHTML="<li id=all>显示全部</li><li id=change>显示更改</li><li id=unsave>未保存</li>";
ul.style.cssText = "position:fixed;top:10%;left:15%";ul.id="group";
document.body.appendChild(ul);
var ols=document.getElementsByTagName("li");
for (var i = 1, li; li = ols[i]; i ++) {
	li.addEventListener("click", function () {jQuery("fieldset").show();
		var trs=jQuery("tr[class*="+this.id+"]");
		if(this.id=="all"){jQuery("tr").show();}
		else{jQuery("tr").hide();trs.show();}
		jQuery("span",this).remove();
		if(trs.length>0){jQuery(this).append("<span>("+trs.length+")</span>")}
		jQuery("fieldset").each(function(){jQuery("tr:visible",this).length==0?jQuery(this).hide():jQuery(this).show();})
	},false);
}

})();