// Ultimate Highlight Bookmarklet 2.1
// nontroppo.org/wiki/UHB
//  Guide for scripting:
//   UltimateHighlight();                 -> Prompts for keywords to highlight
//   UltimateHighlightKeywords('keywords'); -> Highlights the 'keywords' string

// Options: 
var p000_UHOption_AutoHighlight= 1, // 1=Automatically highlight pages from google results
    p000_UHOption_AlwaysAsk    = 0, // 1=Always prompt for keywords
    p000_UHOption_ShowFollowUp = 1, // 1=Show results pane when possible
    p000_UHOption_UseCookies   = 1, // 1=Store search terms for each website using cookies
    p000_UHOption_ShowStats    = 1; // 1=Always show result tallies in javascript alert on framed pages

var p000_UHVar_colors=new Array('#ffff66','#A0FFFF','#99ff99','#ff9999','#ff66ff','coral','lime','chartreuse','deepskyblue','fuchsia','gold','indianred','silver','lightsteelblue','olive','orange','lightblue');
var p000_UHVar_gCount,p000_UHVar_gText,p000_UHVar_gKeywords,p000_UHVar_gRE,p000_UHVar_framed;
var p000_UHVar_d1=new Array(),p000_UHVar_d2=new Array(),p000_UHVar_d3=new Array();

// Constructs the results pane
function p000_UHFunc_CreateDiv() {
	if(p000_UHOption_ShowFollowUp) {
		var divel=document.createElement('div');
		var bza='';
		var br='<br style=\'display:inline\'/>';
		divel.id='divz7rx8v';
		divel.style.position='fixed !important';
		divel.style.top='0 !important';
		divel.style.right='0 !important';
		divel.style.margin='0 !important';
		divel.style.padding='5px !important';
		divel.style.backgroundColor='#fff';
		divel.style.border='1px solid #aaa';
		divel.style.zIndex=9000;
		divel.style.lineHeight='18px !important';
		// "+ _ x" buttons
		bza+='<SPAN STYLE=\'padding:5px; margin:0px;\'><a href=\'javascript:UltimateHighlight();UltimateHighlight();\' onmouseover=\'this.style.color=\"#AAA\";this.style.backgroundColor=\"#fff\";\' onmouseout=\'this.style.color=\"#333\";\' style=\'color:#333; font-family:verdana; text-decoration:none; border:none; font-size:12pt; line-height:18px;\'>+</a></SPAN>';
		bza+='<SPAN STYLE=\'position:fixed !important; right:10px; top:5px;\'><a href=\'javascript:p000_UHFunc_CloseDiv();\' onmouseover=\'this.style.color=\"#AAA\";this.style.backgroundColor=\"#fff\";\' onmouseout=\'this.style.color=\"#333\";\' style=\'color:#333; font-family:verdana; text-decoration:none; border:none; font-size:12pt; line-height:18px;\'>_</a> ';
		bza+='<a href=\'javascript:UltimateHighlight();\' onmouseover=\'this.style.color=\"#AAA\";this.style.backgroundColor=\"#fff\";\' onmouseout=\'this.style.color=\"#333\";\' style=\'color:#333; font-family:verdana; text-decoration:none; border:none; font-size:12pt; line-height:18px;\'>x</a></SPAN>'+br;
		// Results
		for(var i=0;i<p000_UHVar_d1.length;i++) {
			if (p000_UHVar_d2[i]==0){
				bza += '<SPAN STYLE=\'padding:5px; color:#000; font-family:verdana; text-decoration:none; border:none; font-size:10pt; line-height:18px;\'>'
					+ p000_UHVar_d1[i]+' : '+'not found'+'<span> </span></SPAN>'+br;
			} else {
				bza += '<SPAN STYLE=\'padding:5px;\'>'
					+ '<a href=\'#\' id=\'anch'+p000_UHVar_d1[i].replace(/\ /g,'_')+'\' onclick=p000_UHFunc_Goto(\''+i+'\') onmouseover=\'this.style.color=\"#e22\";this.style.backgroundColor=\"#fff\";\' onmouseout=\'this.style.color=\"#000\";\' style=\'color:#000; font-family:verdana; text-decoration:none; border:none; font-weight:bold; font-size:10pt; line-height:18px;\'>'
					+ p000_UHVar_d1[i]+' : '+p000_UHVar_d2[i]+'<span> </span></a></SPAN>'+br;
			}
		}
		divel.innerHTML=bza;
		document.body.appendChild(divel);
	}
}

// Jumps to the next result
function p000_UHFunc_Goto(here) {
	var a = document.getElementById('anch' + p000_UHVar_d1[here].replace(/\ /g,'_'));
	a.href = '#g7z' + p000_UHVar_d1[here].replace(/\ /g,'_') + p000_UHVar_d3[here];
	a.childNodes[1].firstChild.data = ' / ' + (p000_UHVar_d3[here]+1);

	p000_UHVar_d3[here]++;
	if(p000_UHVar_d3[here] >= p000_UHVar_d2[here])
		p000_UHVar_d3[here] = 0;
}

// Closes the results pane
function p000_UHFunc_CloseDiv() {
	var ar;
	if(ar=document.getElementById('divz7rx8v')) {
		if(window.opera) {
			ar.removeNode(true);
		} else {
			var arL=ar.childNodes.length;
			for(var i=0;i<arL;i++) {
				ar.removeChild(ar.childNodes[0]);
			}
			ar.parentNode.removeChild(ar);
		}
	}
}

// Loads the last saved highlight query used on the current domain
function p000_UHFunc_GetCookie() {
	if(p000_UHOption_UseCookies) {
		// Don't load cookie for google domain, because we will use the google search query instead
		if(document.URL.indexOf('.google.')==-1) {
			var search='xz7rx8vUltimateHighlight=';
			if(document.cookie.length>0) {
				var offset=document.cookie.indexOf(search);
				if(offset!=-1) {
					offset+=search.length;
					var end=document.cookie.indexOf(';',offset);
					if(end==-1) {
						end=document.cookie.length;
					}
					p000_UHVar_gText=decodeURIComponent(document.cookie.substring(offset,end));
				}
			}
		}
	}
}

// Saves the highlight query in a cookie
function p000_UHFunc_SetCookie() {
	if(p000_UHOption_UseCookies) {
		document.cookie='xz7rx8vUltimateHighlight='+encodeURIComponent(p000_UHVar_gText)+';path=/;';
	}
}

// Constructs the gKeywords, gCount, gRE, gText, d1, d2 and d3 objects
// using the highlight search query "text"
function p000_UHFunc_CheckSearchString(text) {
	var x=text;
	var i;
	var er;
	if(text==null) return;
	if(text.length==0) return;
	
	// Separate search terms with "|" character
	var insidedblquotes=false;
	var textpart=text.split('"');
	text='';
	for (i=0; i<textpart.length; i++) {
		if (insidedblquotes) {
			text=text+textpart[i].replace(/([\x00-\x19\x28-\x29\x7B-\xBF])+/g,'|').replace(/\+/g,' ');
		} else {
			text=text+textpart[i].replace(/([\x00-\x20\x28-\x29\x7B-\xBF\+])+/g,'|');
		}
		insidedblquotes=!insidedblquotes;
	}
	text='|'+text+'|';
	text=text.replace(/\|+/g,'|');
	if(text.length<=1) return;
	p000_UHVar_gKeywords=null;
	p000_UHVar_gRE=null;
	p000_UHVar_gText=x;
	p000_UHFunc_SetCookie();

	// Construct global vars
	p000_UHVar_gCount=null;
	p000_UHVar_d1.length=0;
	p000_UHVar_d2.length=0;
	p000_UHVar_d3.length=0;
	text=text.substring(1,text.length-1).toLowerCase();
	p000_UHVar_gCount=text.split('|');
	var len=text.replace(/[^\|]/g, '').length;
	p000_UHVar_gKeywords=text.split('|');
	for (i=len;i>=0;i--) {
		p000_UHVar_d1[i]=p000_UHVar_gKeywords[i];
		p000_UHVar_d2[i]=0;
		p000_UHVar_d3[i]=0;
		p000_UHVar_gKeywords[p000_UHVar_gKeywords[i]]=i;
		p000_UHVar_gCount[p000_UHVar_gCount[i]]=0;
	}

	// Construct regular expression from text query
	try {
		// Join search terms
		var temp='(('+p000_UHVar_d1.join(')|(')+'))';

		// Escape special characters inside regexp
		temp=temp.replace(/\\/g,'\\\\');
		temp=temp.replace(/\-/g,'\\-');
		temp=temp.replace(/\*/g,'\\/');
		temp=temp.replace(/\$/g,'\\$');
		temp=temp.replace(/\^/g,'\\^');
		temp=temp.replace(/\./g,'\\.');

		// Remove useless "|()" from regexp
		temp=temp.replace(/\|\(\)/g,'');

		p000_UHVar_gRE=new RegExp(temp,'i');
	}
	catch(er) {
		alert('Unable to make regular expression with: '+text+'.\n\n'+er);
		return;
	}
	return true;
}

// Remove highlights in window w
function p000_UHFunc_ClearWindowHighlights(w) {
	var i;
	var result=false;
	if(p000_UHVar_framed) {
		for (i=0;i<w.frames.length;i++) {
			if(w.frames[i])result=p000_UHFunc_ClearWindowHighlights(w.frames[i])||result;
		}
	} else {
		result=p000_UHFunc_ClearNodeHighlights(w.document.body);
	}
	return result;
}

// Removes highlights created by ShowNodeHighlights
function p000_UHFunc_ClearNodeHighlights(node) {
	var child,result=false,r;
	if(node.nodeType==1) {
		if(node.agohighlight) {
			// Spannode
			result=true;
			node.parentNode.replaceChild(node.firstChild,node);
		} else if(node.class_gz5rt7vw) {
			// Anchor
			result=true;
			node.parentNode.removeChild(node);
		} else if(node.childNodes&&node.tagName.toUpperCase()!='SCRIPT'&&node.tagName.toUpperCase!='STYLE') {
			// Child nodes
			for (child=node.childNodes.length-1;child>=0;child--) {
				r=p000_UHFunc_ClearNodeHighlights(node.childNodes[child]);
				result=result||r;
			}
		}
	}
	return result;
}

// Highlights all search terms in window w
function p000_UHFunc_ShowWindowHighlights(w) {
	var j=0;
	if(p000_UHVar_framed) {
		for (j=0;j<w.frames.length;j++) {
			p000_UHFunc_ShowWindowHighlights(w.frames[j],j);
		}
	} else {
		p000_UHFunc_ShowNodeHighlights(w.document.body,w.document);
	}
	return true;
}

// Find and highlight search terms in a node
// Returns: the number of nodes that were added by this script
function p000_UHFunc_ShowNodeHighlights(node,mydoc) {
	var nkeyw,match,pos=0,skip=0,spannode,middlebit,endbit,middleclone;
	if(node.nodeType==3&&node.data) {
		tmpdata=node.data.replace(/(\<SELECT.+\<\/SELECT.?\>|\<TEXTAREA.+\<\/TEXTAREA.?\>)/gi,'');
		pos=tmpdata.search(p000_UHVar_gRE);
		if(pos>=0) {
			// Search term found -> Highlight the word(s)
			match=RegExp.$1.toLowerCase();
			nkeyw=p000_UHVar_gKeywords[match];
			p000_UHVar_gCount[match]++;
			spannode=mydoc.createElement('SPAN');
			spannode.agohighlight=true;
			spannode.style.border='dashed black 1px';
			spannode.style.fontWeight='bold';
			spannode.style.color='black';
			spannode.style.backgroundColor=p000_UHVar_colors[nkeyw];
			middlebit=node.splitText(pos);
			endbit=middlebit.splitText(match.length);
			middleclone=middlebit.cloneNode(true);
			spannode.appendChild(middleclone);
			middlebit.parentNode.replaceChild(spannode,middlebit);
			skip=1;
			if(p000_UHOption_ShowFollowUp) {
				// Create an anchor to jump to this search term
				anch=mydoc.createElement('a');
				anch.class_gz5rt7vw=true;
				anch.id='g7z'+p000_UHVar_d1[nkeyw].replace(/\ /g,'_')+p000_UHVar_d2[nkeyw];
				spannode.parentNode.insertBefore(anch,spannode);
				p000_UHVar_d2[nkeyw]++;
				skip=2;
			}
		}
	} else {
		if(node.nodeType==1 && node.childNodes && node.tagName.toUpperCase()!='SCRIPT' && node.tagName.toUpperCase!='STYLE') {
			// Visit all child nodes
			for (var child=0; child<node.childNodes.length; ++child) {
				child = child + p000_UHFunc_ShowNodeHighlights(node.childNodes[child],mydoc);
			}
		}
	}
	return skip;  
}

// MAIN highlighting function (Call UltimateHighlight(); with no parameters for normal behavior)
function UltimateHighlight(NoPopup,ReferrerOnly) {
	var text,i;
	try {
		var f=window.top.frames;
	}
	catch (e) {
		var f=window.frames;	
	}
	// Don't show results pane on framed page
	if(p000_UHVar_framed=(f.length>document.getElementsByTagName('iframe').length))
		p000_UHOption_ShowFollowUp=0;

	// If second execution -> Clear results and exit
	if(p000_UHFunc_ClearWindowHighlights(window) || document.getElementById('divz7rx8v')) {
		p000_UHFunc_CloseDiv();
		return;
	}

	// Reload the last used search query
	if(!ReferrerOnly && (p000_UHVar_gText==null))
		p000_UHFunc_GetCookie();

	// Check if google is the last page in history, and if so, use the search string from it
	if(ReferrerOnly||(p000_UHVar_gText==null)) {
		if((document.referrer.match(/(^|\.)google\.([^\.]+|[^\.]{2,3}\.[^\.]{2})$/) 
			&& document.referrer.indexOf('q=')!=-1)
			|| document.referrer.indexOf('q=')!=-1) {
			var queryTermsRegExp=new RegExp('q=([^&]+)');
			if(queryTermsRegExp.test(document.referrer)) {
				text=RegExp.$1.replace(/\+/g,' ');
				text=decodeURI(text);
			}
		}
		if(location.hostname.match(/(^|\.)google\.([^\.]+|[^\.]{2,3}\.[^\.]{2})$/) && document.URL.indexOf('q=')!=-1) {
			var queryTermsRegExp=new RegExp('q=([^&]+)');
			if(queryTermsRegExp.test(document.URL)) {
				text=RegExp.$1.replace(/\+/g,' ');
				text=decodeURI(text);
			}
		}
	}

	// Show a javascript popup asking for search string if necessary
	if(!ReferrerOnly) {
		if(NoPopup) {
			text=p000_UHVar_gText;
		} else {
			text=(p000_UHOption_AlwaysAsk||!text)?prompt('Highlight keywords:',(p000_UHVar_gText==null?((text==null)?'':text):p000_UHVar_gText)):text;
		}
	}

	// Validate search string and create global vars
	if(!p000_UHFunc_CheckSearchString(text))
		return;

	// Make the magic happen
	p000_UHFunc_ShowWindowHighlights(window);

	if(p000_UHOption_ShowFollowUp) {
		// Show results pane
		p000_UHFunc_CreateDiv();
	} else {
		if(p000_UHOption_ShowStats&&!NoPopup) {
			// Show results in a javascript alert
			text='';
			for (i=0;i < p000_UHVar_gCount.length;i++) {
				text+=p000_UHVar_gCount[i]+': '+p000_UHVar_gCount[p000_UHVar_gCount[i]]+'\n';
			}
			text='Items found:\n'+text+'';
			alert(text);
		}
	}
}

// Highlight search keywords
function UltimateHighlightKeywords(findtext) {
	// Sometimes Opera sends the current URL to the script when the Opera search field is empty.
	// If this is the case, it must be ignored.
	tmp=findtext;
	if(tmp.indexOf('#')>-1)
		tmp=tmp.substr(0,tmp.indexOf('#'));
	if(document.URL!=tmp){
		p000_UHVar_gText=findtext;
		UltimateHighlight(!p000_UHOption_AlwaysAsk,false);
	} else {
		UltimateHighlight();
	}
}

// Auto-highlighting of search terms when google is referrer
if(p000_UHOption_AutoHighlight){
	if( ! location.hostname.match(/(^|\.)google\.([^\.]+|[^\.]{2,3}\.[^\.]{2})$/) ) {
		document.addEventListener('DOMContentLoaded',function(e) {UltimateHighlight(true,true);}, false);
	}
}


// IF YOU ARE USING A BUTTON IN YOUR TOOLBAR THAT CAME WITH AN OLD VERSION, YOU EITHER HAVE
// TO UPDATE IT OR TO UNCOMMENT THE FOLLOWING LINE FOR COMPATIBILITY:
// function Highlight() {UltimateHighlight();} function HighlightKeywords(keys) {UltimateHighlightKeywords(keys);}
