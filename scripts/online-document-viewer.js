// ==UserScript==
// @name           Document Viewer
// @author         João Eiras, loosely based on work from alexandrius http://userscripts.org/scripts/show/58690
// @version        1.0
// @exclude        file://*
// @description    Web Based Document Viewer
// @encoding	   utf-8
// ==/UserScript==

/*
* Copyright (c) 2009, João Eiras
* All rights reserved.
*/

(function( opera ){

	var ask_before_opening = false;

	function vuzit_viewer( link ){
		return 'http://vuzit.com/view/?oid=1&storefiles=no&url='+link.href;
	}
	function googlecache_viewer( link ){
		return 'http://webcache.googleusercontent.com/search?q=cache:'+link.href;
	}

	function zoho_viewer( link ){
		return 'http://viewer.zoho.com/api/view.do?cache=false&url='+link.href;
	}

	function get_config(link){
		if (!get_config.__cached)
		{
			var config = [];

			config.push({title:'pdf document', exts : ['pdf'], handler: googlecache_viewer});
			config.push({title:'text document', exts : ['doc','docs','docx','odt','sxw','rtf'], handler: vuzit_viewer})
			config.push({title:'spreadsheet document', exts : ['xls','csv','sxc','ods','xlsx'], handler:vuzit_viewer});
			config.push({title:'presentation document', exts : ['ppt','pptx','pps','odp','sxi'], handler:vuzit_viewer});

			config.get_re = function(o){
				if(!o.__regexp)
					o.__regexp = new RegExp('\\.('+o.exts.join('|')+')(#.*)?$');
				return o.__regexp;
			}

			config.find = function( link ){
				for(var k = 0, c; c = this[k]; k++){
					if ((this.get_re(c).test(link.href)) || (this.get_re(c).test(link.textContent)))
						return c;
				}
			}

			get_config.__cached = config;
		}
		return get_config.__cached.find(link);
	}

	function ellipsisize( str , limit){
		if (str.length < limit)
			return str;
		return str.substring(0, limit-3) + '...';
	}

	function listener(e){
		var link = e && e.target && e.target.selectSingleNode('ancestor-or-self::a[@href][1] | ancestor-or-self::area[@href][1]');

		if (!link) return;

		var config = get_config(link);

		if (!config) return;

		if (!ask_before_opening || confirm('Would you like to open this '+config.title+' with an online viewer?\n\n'+
			'This may not work if accessing the document requires authentication, or you are '+
			'accessing a document hosted in your local network.\n\nUrl: ' + ellipsisize(link.href,64)))
		{
			window.open(config.handler(link),'web-document',"gp,height=700,width=800");
			e.preventDefault();
			return false;
		}
	}

	if (opera)
		opera.addEventListener('BeforeEvent.click', function(e){ listener(e.event) === false && e.preventDefault(); }, false);
	else
		addEventListener('click', listener, true);
})( window.opera );