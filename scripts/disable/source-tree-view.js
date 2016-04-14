// ==UserScript==
// @name Source Tree View script
// @author João Eiras 
// @namespace
// @version 1.0
// @description  Display current page source code in tree view (configurable)
//               This applies to any file that Opera renders: html,xhtml,xml,plain text.
// ==/UserScript==

/*
Copyright © 2005 by João Eiras 

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
USA
*/

/*

	Instructions:
	
		This scripts allow you to view the html source of the entire document or sections of it
		in tree view mode. To view the tree you need to call ujs_SourceTreeView (see below) function from javascript
		explicitly, or allow the script to run automaticly if CheckUrl variable is set to true (see below).		
		This works for any html, xhtml document. XML documents currently only display in Opera 8.
		If you choose to see the source in the current windown, you may go back in history to the original document.
		
		Add this button to Opera
			opera:/button/Go%20to%20page%2C%20%22javascript:ujs_SourceTreeView();%22%2C%20%2C%20%20%22Source%20Tree%20View%22
		Or in html:
			<a title="Source Tree View"  href="opera:/button/Go%20to%20page%2C%20%22javascript:ujs_SourceTreeView();%22%2C%20%2C%20%20%22Source%20Tree%20View%22">click here</a>
			
		Or add this line to your toolbar.ini file, under [Customize Toolbar Custom.content]
			"Source Tree View"="Go to page, "javascript:ujs_SourceTreeView();", , "Source Tree View""
		then drag the button to any toolbar
			
		Or call javascript:ujs_SourceTreeView(); from anywhere, like the address bar or inside one of your scripts.
		
		The ujs_SourceTreeView function accepts any number of parameters which can be (the order doesn't matter, nor if they're there)
			- a string representing a title (only the first is used):
				use this when spaning several windows and you
				want to keep track of the order
				The default title is "Source@" + current url.
			- document elements:
				use this is you have a big source file and only want
				to view the source of some sections.
				All elements are displayed sequentially.
				By default the entire document is used.
				
		For more details and configuration read the lower comments near each configuration variable.
		Feel free to change the styles applied. Look for variable the_css.
		
    ---//---
    
	IMPORTANT NOTES:
	    - the scripts parses the entire document tree node by node, which can take some time
	    on big pages. If you go back in the page history while the script is running, the document
	    tree it's parsing becomes invalid and Opera crashes. This is a Opera 8 (9 too?)issue.
	    - several user scripts add html code the document, so the source may look different
	    from what you're expecting, or from the original source. Disable these scripts before if you want to.
	    
    ---//---
	    
	Changelog:
	 - 1.0 - initial release
	         presents a big title
	         pops up a new window at will
	         displays code in tree view
	         checks for url
	         displays document source in tree view
	         	issues: document.write doesn't exist for xml documents in Opera 9, so I'll
	         	have to find a way to write the html to the document
	
*/

(function(){
	/*
		variables:
	*/	
	
	//Title - set it if you want to display the title as a big fat header
	var BigTitle = true;
	
	//ShowPopUpWindow - set it if you want to popup a new window with the code. if false the current window is used
	//                  beware of popup blocking if the tree loads in a new window.
	var ShowPopUpWindow = false;
	
	//IdentSource - set if you want indented code (note: html engine hides non-html code like css, javascript)
	//              displays in tree-view. If false, the available source is shown, unprocessed.
	var IdentSource = true;
	
	//The variable CheckUrl when set to true allows to:
	//	 - if the url ends with #sourcetreeview - the document is automaticly rendered in tree view
	//	 - if the document is a xml document (extension check) and doesn't have a stylesheet, the
	//	   document is displayed in tree mode.
	var CheckUrl = true;
	
	//Show display options for collapse/expands nodes
	var DisplayViewOptions = true;
	
	//these are the styles to be applied
	//'atag' is the class given to any html tag
	//'codeblock' wraps all childs of a node
	//'switch' is the the +/- click switch to expand/collapse nodes
	//'comment' is commented source
	//'value' is a value from a attribute
	var the_css = 
		"pre{margin-left:1em;font-size:95%;}"+
		".atag{font-weight:normal;color:#aa0000;}"+
		".codeblock{font-weight:bold;padding-left:1.74em;border:thin solid #d0ead0;border-right:none;}"+
		".codeblock:hover{border:thin solid #a0aba0;border-right:none;}"+
		".switch{margin-left:-0.6em;background-color:#eeeeee;}"+
		".switch:hover{cursor:hand;background-color:#aaaaaa;}"+
		".comment,.comment>span{color:#777777;font-style:italic;font-size:.95em;line-height:1.1em;letter-spacing:0.1em;border:none;}"+
		".value{color:#0000aa;}";
	
	/*
		function ujs_SourceTreeView
		 - the 'do it all' function
		function isSourceTreeView
		 - return true is the current page is already a tree view generated by this script
	*/
	//don't change this variable
	window.ujs_SourceTreeView = function (){
		//check if this is already a tree view
		if(isSourceTreeView())
			return;
		
		var i,a=arguments;
		var stitle, roots;
		
		stitle = "Source@"+location.href;
		for(i=0;i<a.length;i++)
			if( typeof(a[i]) == 'string' )
			{ stitle = a[i];break; }
			
		roots = [];
		for(i=0;i<a.length;i++){
			if( a[i].nodeType ){
			//if( a[i] instanceof Node ){//doesn't work in Opera 8
				roots.push(a[i]);
			}
		}
		if( !roots.length )
			roots=document.childNodes;
			
		var new_win = ShowPopUpWindow?window.open():window;	
		var new_doc = new_win.document;
		var html_src='';
		
		if(IdentSource){
			for(var i=0;i<roots.length;i++){
				html_src += parse_tree(roots[i],0);
			}
		}else{
			for(var i=0;i<roots.length;i++){
				html_src += lit_str(xmlser(roots[i]))+'\n';
			}
		}
		var h1title='';
		if(BigTitle)
			h1title='<h1 style="white-space:nowrap;"><a href="'+window.location.href+'">'+stitle+'</a></h1>';		
		var the_js = 'function toggle_block(i){var s=document.getElementById("switchblock"+i);var b=document.getElementById("codeblock"+i);'+
			'if(!(!b||!s)){var n=s.firstChild;if(n.alt=="+"){n.src="'+imglesssrc+'";n.alt="-";}else{n.src="'+imgplussrc+'";n.alt="+";}'+
			'if(b.style.display)b.style.display="";else b.style.display="none";}}function expandall(str){if(!str)str="";for(var idx=1;;idx++){'+
			'var ss=document.getElementById("codeblock"+idx);if(!ss)break;if(ss.style.display!=str)toggle_block(idx);}}function collapseall(){expandall("none");}';
		
		var html_buttons='';
		if(DisplayViewOptions&&IdentSource)
			html_buttons='<button onclick="expandall();">expand all</button><button onclick="collapseall();">collapse all</button><br/>';
	
		var the_html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>'+stitle+'</title><meta name="generator" content="userscripts.sourcetreeview"/><style type="text/css">'+
			the_css+'</style><script type="text/javascript">//<![CDATA[\n'+the_js+'\n//]]></script></head><body><pre>'+h1title+html_buttons+'<div class="codeblock">'+html_src+'</div></pre></body></html>';

		if( new_doc.write ) 
			new_doc.write(the_html);
		else{
			var html = new DOMParser().parseFromString(
				'<?xml version="1.0" ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtm'+
				'l1/DTD/xhtml1-strict.dtd">'+the_html, 'application/xhtml+xml');  
			while ( document.hasChildNodes() )
				document.removeChild( document.lastChild );
			document.appendChild( document.importNode( html.documentElement, true) );
		}
	}
	var xmlser = function(node){
		return (xmlser.ser?xmlser.ser:xmlser.ser=new XMLSerializer()).serializeToString(node);
	}
	function isSourceTreeView(){
		var metas = document.getElementsByTagName('meta');
		for(var k=0;k<metas.length;k++)
			if(	metas[k].getAttribute('name') && metas[k].getAttribute('name').toLowerCase() == 'generator' &&
				metas[k].getAttribute('content') && metas[k].getAttribute('content').toLowerCase() == 'userscripts.sourcetreeview')
				return true;
		return false;
	}
	
	var imgplussrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAMAAADTuiYfAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURU1Mdv///8VIzGcAAAACdFJOU/8A5bcwSgAAABdJREFUeNpiYEQABuJIBgggWj0cAAQYABKQAFc7IMbiAAAAAElFTkSuQmCC";
	var imglesssrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAMAAADTuiYfAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURU1Mdv///8VIzGcAAAACdFJOU/8A5bcwSgAAABdJREFUeNpiYEQABuLYDBBAtHo4AAgwABPUAF3wOWutAAAAAElFTkSuQmCC";
	imgplus = '<img src="'+imgplussrc+'" alt="+"/>';
	imgless = '<img src="'+imglesssrc+'" alt="-"/>';
	
	var nodenumberid=0;
	function parse_tree(node){
		if( node.nodeType ==  Node.ELEMENT_NODE && node.tagName)
		{
			var htr='';
			if( node.hasChildNodes() || node instanceof HTMLTextAreaElement ){
			
				//non-empty tags	
				var oh, i;
				oh = tag_str(node,false);
				
				if( node instanceof HTMLTextAreaElement )
					htr += lit_str(node.value);
				else				
					for(i=0;i<node.childNodes.length;i++)
						htr += parse_tree(node.childNodes[i]);
				if(htr){
					nodenumberid++;
					htr = '<span class="switch" id="switchblock'+nodenumberid+'" onclick="toggle_block('+nodenumberid
						+');">'+imgless+'</span><span class="atag">'+oh+'</span><div class="codeblock" id="codeblock'+nodenumberid+'">'+
						htr +'</div><span class="atag">&lt;/'+node.tagName+'&gt;</span>\n';
				}else{
					htr = '<span class="atag">'+oh+'&lt;/'+node.tagName+'&gt;</span>\n';
				}
			}else{
				htr = '<span class="atag">'+tag_str(node,true)+'</span>\n';
			}
			return htr;
		}
		else if( node.nodeType == Node.PROCESSING_INSTRUCTION_NODE )
		{//xml header
			return "<span class='atag'>&lt;?"+node.target+" "+hival(lit_str(node.data))+"?&gt;</span>\n";
		}
		else if( node.nodeType == Node.COMMENT_NODE )
		{//comment
			if(node.data.indexOf('\n') != -1){//several lines
				nodenumberid++;
				return '<span class="switch" id="switchblock'+nodenumberid+'" onclick="toggle_block('+nodenumberid
					+');">'+imgless+'</span><span class="comment">&lt;!--<span class="codeblock" id="codeblock'+nodenumberid
					+'">'+lit_str(node.data)+'</span> --&gt;</span>\n';
			}else{
				return '<span class="comment">&lt;!--'+lit_str(node.data)+'--&gt;</span>\n';
			}			
		}
		else if( node.nodeType == Node.TEXT_NODE || node.nodeType == Node.CDATA_SECTION_NODE )
		{//regular textnode
			var txt = lit_str(node.data).replace(/^(\s*)/,'').replace(/(\s*)$/,'').replace(/(\s*)\n(\s*)/,'\n').replace(/&/g,"&amp;");
			if(txt) txt += '\n';
			return node.nodeType == Node.CDATA_SECTION_NODE ? '<![CDATA['+txt+']]>':txt;
		}
		return '';
	}
	
	function tag_str(node,toclose){
		var html_str="&lt;"+node.tagName, a=node.attributes;
		for(var i=0;i<a.length;i++){
			if(a[i]) html_str += " "+a.item(i).nodeName+"=\"<span class='value'>"+a.item(i).nodeValue+"</span>\"";	
		}
		return html_str+=(toclose ? "/&gt;" : "&gt;");
	}
	function hival(s){return s.replace(/("|')([^"]*)\1/g,"&quot;<span class='value'>$2</span>&quot;");}
	function lit_str(s){return s.replace(/>/g,"&gt;").replace(/</g,"&lt;");}	
	function addarr(a,b){var k,r=Array();for(k=0;k<a.length;k++)r[r.length]=a[k];for(k=0;k<b.length;k++)r[r.length]=b[k];return r;}
		
	function check_url(){
		if( location.hash == '#sourcetreeview' ){
			ujs_SourceTreeView();
			
		}else if(location.href.match(/\.(xml|rss|rdf)$/) ){
		
			if( document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml','html')[0] ||
				document.getElementsByTagName('html')[0] )
				return;
				
			//check if there's no style sheet
			if( parseInt(navigator.appVersion)==8 ){
				//Opera 8 converts <?xml-stylesheet ?> to <link/> tag
				
				for(var k=0,ln,lns=document.getElementsByTagName("link");ln=lns[k];k++)
					if(ln.type=='text/css'&&ln.rel=='stylesheet')
						return;
				ujs_SourceTreeView();
				
			}else{//Opera 9 and above
				//search for xml processing directives
				var ni = document.createNodeIterator(document, NodeFilter.FILTER_ACCEPT|NodeFilter.SHOW_PROCESSING_INSTRUCTION, null, true), n;
				while( n=ni.nextNode() )
					if( n.target.toLowerCase()=='xml-stylesheet' )
						return;
				ujs_SourceTreeView();
			}
		}
	}
	if(CheckUrl)
		addEventListener('load',check_url,false);
	
})();


