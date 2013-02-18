// ==UserScript==
// @name Extra download links
// @author Jo鉶 Eiras 
// @namespace http://userjs.org/ 
// @version 1.1
// @description  Adds links to all images, embeds, objects, applets,
//			and iframes on the page, to make them easier to
//			download using Opera's links panel.
// @ujs:category general: enhancements
// @ujs:published 2006-01-23 23:06
// @ujs:modified 2006-01-24 10:45
// @ujs:documentation http://userjs.org/scripts/general/enhancements/extra-download-links 
// @ujs:download http://userjs.org/scripts/download/general/enhancements/extra-download-links.js
// ==/UserScript==

/*
	Copyright ?2007 by Jo鉶 Eiras 

	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

/*
	  This script adds invisible anchors for every image, embed, object, applet
	and iframe to the page. It works automaticly after the page loads.
	  By default the links are hidden, but they're are accessible through the
	links panel (ctrl+j), where they can easily be quick downloaded (unless you want
	download dialogs for each file), which is the purpouse of this script. Just type 
	"UserJS ExtraLinks" in the quick find box and all links will be automaticly filtered.
	  You may choose to display the links, and which links to add (objects,iframes and/or images).
	
	History:
	1.1
	 - properly handles data uris
	 - fixes for applet handling
	 - several efficiency improvements
	 - better pure XHTML compatibility (use of innerHTML dropped)
	 - fix for error whem iframes url end with a slash
	 - added check for FileName and URL for param's name attribute value for some wmv objects
	1.0
	 - initial release
*/

(function(){

document.addEventListener( 'load' ,function(){

	//indicate whether you want to see the links placeholder
	var showLinks = false;
	//indicate if you want to add image links
	var addImageLinks = true;
	//indicate if you want to add iframe links
	var addIframeLinks = true;
	//indicate if you want to add object, embed and applet links
	var addObjectLinks = true;
	
	if( document.designMode == 'on' )
		return;
	
	//rest of code... don't mess this
	var placeholder_id = 'ujs_extra_links_place_holder';
	var xhtmlNS = 'http://www.w3.org/1999/xhtml';
	var placeholderParent = document.getElementsByTagName('body')[0] || document.getElementsByTagNameNS(xhtmlNS,'body')[0] ||
		document.getElementsByTagName('html')[0] || document.getElementsByTagNameNS(xhtmlNS,'html')[0] || document.documentElement;
	
	if( !placeholderParent || document.getElementById(placeholder_id) )
		return;
		
	var capitalizeString=function(str)
	{return str.substr(0,1).toUpperCase()+str.substr(1).toLowerCase();}
	
	var resolveurl = function(url)
	{var link = document.createElementNS(xhtmlNS,"a");link.href=url;url=link.href;delete link;return url;}
	
	var entitize = function(xml)
	{ return xml.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g, "&apos;"); }
	
	var parseElements = function(store,newones){
		if( newones.snapshotItem )
			newones.item = newones.snapshotItem;
			
		for(var k=0,elem;elem = newones.item(k);k++){
		
			var linktext="", linkurl="";
			if( elem instanceof HTMLObjectElement ){
				linkurl = elem.data || elem.getAttribute("src");
				if(!linkurl){
					for(var j=0,p;p=elem.childNodes[j];j++){
						if( p instanceof HTMLParamElement && p.name &&
							p.name.match(/^(movie|data|src|code|filename|url)$/i) &&
							(linkurl = p.value) )
								break;
					}
				}
			}
			else if( elem instanceof HTMLIFrameElement ){
				try{linkurl = elem.contentWindow.location.href;
				}catch(ex){linkurl = elem.src;}
			}
			else if( elem instanceof HTMLEmbedElement ){
				linkurl = elem.src;
			}
			else if( elem instanceof HTMLAppletElement ){
				//http://java.sun.com/docs/books/tutorial/applet/appletsonly/appletTag.html
				linkurl = (elem.archive||elem.code||'').replace(/^\/+/,"");
				if(linkurl) linkurl = (elem.codeBase||'').replace(/\/*$/,"/")+linkurl;
			}
			else if( elem instanceof HTMLImageElement ){
				linkurl = elem.src;
			}
			else{
				continue;
			}
			if(!linkurl)
				continue;
			
			if( linkurl.substring(0,5)=='data:' ){
				linktext = "[UJS Links "+capitalizeString(elem.tagName)+"] "+linkurl;
			}
			else{
				linkurl = resolveurl(linkurl);
				linktext = "[UJS Links "+capitalizeString(elem.tagName)+"] "+
					(linkurl.match(/([^\\\/]*(\?.*)?)$/)&&RegExp.$1?RegExp.$1:'unknown');
			}
			store.push([linkurl,linktext]);
		}
		return store;
	}
	 
	var elems = [];
	if(addImageLinks)
		elems = parseElements(elems,document.getElementsByTagName('img'));
	if(addIframeLinks)
		elems = parseElements(elems,document.getElementsByTagName('iframe'));
	if(addObjectLinks){
		elems = parseElements(elems,document.getElementsByTagName('applet'));
		elems = parseElements(elems,document.getElementsByTagName('embed'));
		elems = parseElements(elems,document.getElementsByTagName('object'));
	}
	
	var thedivcss, theacss, thedivhtml='';
	if(showLinks){
		thedivcss='border:medium dotted grey!important;overflow:visible!important;'+
			'background-color:white!important;text-align:left!important;display:inline-block!important;'+
			'width:auto!important;height:auto!important;';
		theacss='color:black!important;font-weight:bold!important;background-color:none!important;margin:.2em!important;'+
			'cursor:pointer!important;font-family:Trebuchet MS,Verdana,Arial!important;font-size:10pt!important;';
	}else
		thedivcss=theacss='display:none';
	
	for(var k=0, anchor; anchor = elems[k]; k++)
		thedivhtml += '<a style="'+theacss+'" href="'+entitize(anchor[0])+'">'+entitize(anchor[1])+'</a><br/>\n';
	if(!thedivhtml)
		//no links - goodbye
		return;
	
	if(showLinks)
		placeholderParent.appendChild(document.createElement('br'));
	
	var input = document.implementation.createLSInput();
	var parser = document.implementation.createLSParser(document.implementation.MODE_SYNCHRONOUS,null);
	input.stringData = '<!DOCTYPE html><div xmlns="http://www.w3.org/1999/xhtml" id="'
		+placeholder_id+'" style="'+thedivcss+'">'+thedivhtml+'</div>';
		
	placeholderParent.appendChild((document.adoptNode||document.importNode).call(document,parser.parse(input).documentElement,true));

}, false );

})();


