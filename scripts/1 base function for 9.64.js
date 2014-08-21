// ==UserScript==
// @name define some prototype methord
// @description 
// @depends none
// @author	lk
// ==/UserScript==

(function(){if(opera.version() < 10.50){
		
/* support querySelector and querySelectorAll for 9.64   */
if(typeof(jQuery)!='undefined'){
	if(!document.querySelector){
		HTMLDocument.prototype.querySelector = function(str) {
			return jQuery(str)[0];
		}
		HTMLElement.prototype.querySelector = function(str) {
			return jQuery(str)[0];
		}
	}
	// qSelectorAll 重命名,否则与 jQuery 会发生循环调用
	HTMLDocument.prototype.qSelectorAll = function(str) {
		if(this.querySelectorAll) return this.querySelectorAll(str);
		else return jQuery.makeArray(jQuery(str));
	}
	HTMLElement.prototype.qSelectorAll = function(str) {
		if(this.querySelectorAll) return this.querySelectorAll(str);
		else return jQuery.makeArray(jQuery(str));
	}
	/*替换作者脚本中的 querySelectorAll 为 qSelectorAll*/
	window.opera.addEventListener("BeforeScript",function (e) {
		if(e.element.text){// 不替换 jquery
			if(e.element.text.indexOf(".fn.init")>-1||e.element.text.indexOf("(jQuery)")>-1)return;
			e.element.text = e.element.text.replace(new RegExp("querySelectorAll","gm"),"qSelectorAll");
		}
	}, false);
}
/* support window.log for 9.64 */
if (!window.console) {
	window.console = {};
	var methods = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
		"group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"],
	noop = function () {}
	for (var i = 0, method; method = methods[i++]; )
		window.console[method] = noop;
	if (window.opera && opera.postError) {window.console.log=opera.postError;}
}

}})();


		