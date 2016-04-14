// ==UserScript==
// @name easy copy table
// @description format the table to easy export mysql
// @include	http://web2.facs.org/cstage0205/breast/Breast_*.html
// @author	lk
// ==/UserScript==

(function(){
	if(window.location.href.indexOf("web2.facs.org/cstage0205/breast")!=-1)
window.addEventListener('DOMContentLoaded', function (e) {
	var table = $('table');
	var h2 = "<td>" + $("h2").text() + "</td>";
	var td_split = "$";
	$('tr', table).each(function (index, tr) {
		$(tr).prepend(h2);var td_len=$('td', tr).length;
		$('td', tr).each(function (index, td) {
			if (index!=td_len-1)$(td).append(td_split);
			$(td).html($(td).html().replace("<br>", "\\r\\n"))
		});
		$(tr).html($(tr).text());
		if (index == 0) {
			$(tr).html($(tr).text().replace($(h2).text(), "Lable"));
			$(tr).html($(tr).text().replace(/\$/g, ",").replace(/\s/g, "_").replace(/-/g, "_"));
		}
	});
}, false);
})();