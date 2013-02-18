// ==UserScript==
// @name BBCode
// @author Lex1
// @version 1.6.10
// @description Inserts any BBCode and HTML tags. Use the button with a similar code: "javascript:ujs_bbcode_tag('[b]')"
// @ujs:documentation http://ruzanow.ru/index/0-5
// @ujs:download http://ruzanow.ru/userjs/bbcode.js
// ==/UserScript==

document.addEventListener('mouseup', function(e){navigator.lastClicked=e.target}, true);
document.addEventListener('focus', function(e){
	var et=e.target;
	var tag=et.tagName && et.tagName.toLowerCase();
	if(tag=='textarea' || (tag=='input' && et.type=='text')){navigator.lastFocusedTextArea=et};
}, true);

function ujs_bbcode_tag(tag){
	var ts=document.getSelection();
	var ta=navigator.lastFocusedTextArea;
	if(!ta)for(var t=document.getElementsByTagName('textarea'), i=t.length; i--;){ta=t[i]; if(ta.rows>4 && ta.offsetHeight>0)break};
	if(!ta || ta.offsetHeight==0)return;

	var s, e_tag;
	var s_tag=tag;
	var nStart=ta.selectionStart;
	var nEnd=ta.selectionEnd;
	var txt=ta.value.substring(nStart, nEnd);
	var s_txt=ta.value.substring(0, nStart);
	var e_txt=ta.value.substring(nEnd, ta.value.length);

	var al=arguments.length;
	if(al==0)return ts || txt;
	if(al==1 && typeof arguments[0]=='function'){
		var sel={text: txt, start: 0, end: nEnd-nStart};
		arguments[0](sel);
		ta.value=s_txt+sel.text+e_txt;
		var len=ta.value.length-s_txt.length-e_txt.length+1;
		ta.setSelectionRange(nStart+sel.start+(sel.start<0 ? len : 0), nStart+sel.end+(sel.end<0 ? len : 0));
		ta.focus();
		return;
	};
	if(al==2 && arguments[1]!=''){
		e_tag=arguments[1];
	}
	else{
		e_tag=tag.replace(/(^.)([^= ]*)(.*)(.$)/, '$1/$2$4');
	};

	var stl=s_tag.length;
	var etl=e_tag.length;
	var lt=stl+etl;

	if(txt.indexOf(s_tag)==0 && txt.lastIndexOf(e_tag)==(txt.length-etl)){
		s=s_txt+txt.slice(stl, -etl)+e_txt;
		nEnd-=lt;
	}
	else{
		if(nStart==nEnd && s_txt.lastIndexOf(s_tag)==s_txt.length-stl && e_txt.indexOf(e_tag)==0){
			s=s_txt.slice(0, -stl)+e_txt.slice(etl);
			nStart-=stl;
			nEnd=nStart;
		}
		else{
			if(ts && ta!=navigator.lastClicked){
				s=s_txt+txt+s_tag+ts+e_tag+e_txt;
				nStart=nEnd;
				nEnd+=ts.length;
				txt=ts;
			}
			else{
				s=s_txt+s_tag+txt+e_tag+e_txt;
			};

			if(txt.length==0 && s_tag!=''){
				nStart+=stl;
				nEnd=nStart;
			}
			else{
				if(s_tag.slice(-4, -1)=='=""' || s_tag.slice(-2, -1)=='=' && s_tag.slice(-1)!='"'){
					nStart=nStart+stl-(s_tag.slice(-3, -1)=='""' ? 2 : 1);
					nEnd=nStart;
				}
				else{
					nEnd+=lt;
					if(s_tag=='' || s_tag.slice(-1)=='"' || (al==2 && arguments[1]==''))nStart=nEnd;
				}
			}
		}
	};

	ta.value=s;
	ta.setSelectionRange(nStart, nEnd);
	ta.focus();
};