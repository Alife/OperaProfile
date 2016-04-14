// ==UserScript==
// @include     *.txt
// @include     *.log
// ==/UserScript==

(function(){
	var exts=".txt,.log";
	if(exts.indexOf(window.location.href.substring(window.location.href.length-4))==-1)return;

	document.addEventListener("DOMContentLoaded", function () {
		var data=document.body.innerText;
		// 判断是否是 cvs data
		var lines=data.split("\n");
		if(lines.length<1||lines[0].split("\t").length<1)return;
		// 添加新的 SCRIPT 元素至页面中
		document.body.innerText="";
		//document.body.addStyle("table{border-collapse: collapse;border: 2px black solid;font: 12px sans-serif;}td,th {border: 1px black solid;padding: 5px;white-space: nowrap;}");
		document.body.addStyle("table {font-family:arial;background-color:#CDCDCD;margin:10px 0pt 15px;font-size: 8pt;width: 100%;text-align: left;}"+
			"table thead tr th, table tfoot tr th {background-color: #e6EEEE;border: 1px solid #FFF;font-size: 8pt;padding: 4px;}"+
			"table thead tr .header {background-image: url(http://tablesorter.com/themes/blue/bg.gif);background-repeat: no-repeat;background-position: center right;cursor: pointer;padding-right:15px}"+
			"table tbody td {color: #3D3D3D;padding: 4px;background-color: #FFF;vertical-align: top;white-space: nowrap}"+
			"table tbody tr.odd td {background-color:#F0F0F6;} "+
			"table thead tr .headerSortUp {background-image: url(http://tablesorter.com/themes/blue/asc.gif);}"+
			"table thead tr .headerSortDown {background-image: url(http://tablesorter.com/themes/blue/desc.gif);}"+
			"table thead tr .headerSortDown, table thead tr .headerSortUp { background-color: #8dbdd8;}");
		document.getElementsByTagName('body')[0].appendChild((function(){
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = "http://tablesorter.com/__jquery.tablesorter.min.js";
			return s;
		})());
		document.getElementsByTagName('body')[0].appendChild((function(){
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = "http://tablefilter.free.fr/TableFilter/tablefilter_all_min.js";
			return s;
		})());	
		document.getElementsByTagName('body')[0].appendChild((function(){
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = "http://d3js.org/d3.v3.js";
			jQuery(s).on("load",function(){
				var table=d3.select("body").append("table");
				table[0].id="table";
				var parsedCSV = d3.tsv.parseRows(lines[0]);
				table.append("thead").selectAll("tr").data(parsedCSV)
					.enter().append("tr").selectAll("th").data(function(d) { return d; })
					.enter().append("th").text(function(d) { return d; });
				var tbody=table.append("tbody").selectAll("tr");
				for(var i=1,len=lines.length;i<len;i++){
					var parsedCSV = d3.tsv.parseRows(lines[i]);
					tbody.data(parsedCSV)
						.enter().append("tr").selectAll("td").data(function(d) { return d; })
						.enter().append("td").text(function(d) { return d; });
				}
				jQuery("table").tablesorter();
				var table2_Props = {
				    col_0: "select",
				    col_4: "none",
				    display_all_text: " [ Show all ] ",
				    sort_select: true
				};
				var tf2 = setFilterGrid("table");
			});
			return s;
		})());
		

	}, false);

})();