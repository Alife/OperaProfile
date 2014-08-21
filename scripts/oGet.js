// ==UserScript==
// @name oGet
// @author Lex1
// @version 1.5.2
// ==/UserScript==


(function(){

var blockFilter = /\.(?:exe|com|dll|bin|scr|msi|dmg|7z|zip|rar|arj|ace|lzh|xpi|iso|gz|gzip|tgz|bz2|tar|rpm|deb|avi|mpeg|mpg|mp4|wmv|asf|mov|rv|mp3|flac|ape|wma|ra|ram|qt|ogg|doc|pdf|rtf|xls|ppt|chm|djvu)$/i;

// Copyright (c) 2006, Opera Software ASA
function encodeBase64(string)
{
  var out='', charCode=0, i=0, endBytes='', length=string.length;
  var puffer=[];
  var base64EncodeChars ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  while(charCode=string.charCodeAt(i++))
  {
    if(charCode<0x80)
    {
      puffer[puffer.length]=charCode;
    }
    else if(charCode<0x800)
    {
      puffer[puffer.length]=0xc0|(charCode>>6);
      puffer[puffer.length]=0x80|(charCode&0x3f);
    }
    else if(charCode<0x10000)
    {
      puffer[puffer.length]=0xe0|(charCode>>12);
      puffer[puffer.length]=0x80|((charCode>>6)&0x3f);
      puffer[puffer.length]=0x80|(charCode&0x3f);
    }
    else
    {
      puffer[puffer.length]=0xf0|(charCode>>18);
      puffer[puffer.length]=0x80|((charCode>>12)&0x3f);
      puffer[puffer.length]=0x80|((charCode>>6)&0x3f);
      puffer[puffer.length]=0x80|(charCode&0x3f);
    }
    if(i==length)
    {
      while(puffer.length%3)
      {
        puffer[puffer.length]=0;
        endBytes+='=';
      }
    }
    if(puffer.length>2)
    {
      out+=base64EncodeChars.charAt(puffer[0]>>2);
      out+=base64EncodeChars.charAt(((puffer.shift()&3)<<4)|(puffer[0]>>4));
      out+=base64EncodeChars.charAt(((puffer.shift()&0xf)<<2)|(puffer[0]>>6));
      out+=base64EncodeChars.charAt(puffer.shift()&0x3f);
    }
  }
  return (out+endBytes);
};

// Code by Mikivanch
function getFormParams(f)
{
  var params = '', sep = '';
  for(var i = 0, element; element = f.elements[i]; i++)
  {
    if(element.name)
    {
      if(element.nodeName.toLowerCase() == 'input' && element.type == 'checkbox')
      {
        if(element.checked)
        {
          params += sep + element.name + '=on';
          sep = '&';
        }
      }
      else if(element.nodeName.toLowerCase() == 'input' && element.type == 'radio')
      {
        if(element.checked)
        {
          params += sep + element.name + '=' + escape(element.value);
          sep = '&';
        }
      }
      else
      {
        params += sep + element.name + '=';
        if(element.value)
        {
          params += escape(element.value);
        }
        sep = '&';
      }
    }
  }

  var inputs = f.getElementsByTagName('input');
  for(var i = 0, input; input = inputs[i]; i++)
  {
    if(input.type == 'image' && input.name)
    {
      params += sep + input.name + '.x=0&' + input.name + '.y=0';
      sep = '&';
    }
  }

  return params;
};

function removeMetaRefresh()
{
  var bRedirect = false;
  var meta = document.getElementsByTagName('meta');
  if(meta.length > 0)
  {
	var url = '', protocol = '', host = '';

	for(var i = 0; i < meta.length; i++)
	{
	  var a = meta[i].getAttribute('http-equiv', false);
	  if(a)
	  {
		a = a.toLowerCase();
		if(a == 'refresh')
		{
		  var c = meta[i].getAttribute('content', false);
		  if(c)
		  {
			c = c.replace(/^[\w\s;.]*url=/i, '');
			var block = false;

			var anchor = document.createElement('a');
			anchor.setAttribute('style', 'display:none !important;');
			anchor.href = c;
			document.documentElement.appendChild(anchor);

			if(anchor.pathname.search(blockFilter) != -1){block = true};

			if(block)
			{
			  bRedirect = true;
			  if(!url){url = anchor.href};
			  meta[i].setAttribute('http-equiv', '', false);
			  meta[i].setAttribute('content', '', false);
			}

			anchor.parentNode.removeChild(anchor);
		  }
		}
	  }
	}

	if(bRedirect)
	{ 
	  var html = document.documentElement.outerHTML;
	  document.open();
	  document.write(html + '</html>');
	  saveFile(url);
	}	
  }
};
// End code by Mikivanch


function topLevelDomain(domain){
	if(!domain)return;
	if(/^(?:\d{1,3}\.){3}\d{1,3}$/.test(domain))return domain;
	var a = domain.split('.');
	var l = a.length;
	return (l < 3) ? domain : (a[l - 2] + '.' + a[l - 1]);
};

function isReplyForm(f){
	for(var i = 0, fi; fi = f.elements[i]; i++){
		if(fi.name && fi.nodeName.toLowerCase() == 'textarea' || fi.nodeName.toLowerCase() == 'iframe')return true;
	}
};

function saveFile(link){
	var hostName = function(link){var a = document.createElement('a'); a.href = link; return a.host};
	var s = (document.getSelection && document.getSelection()) || (window.getSelection && window.getSelection().toString());
	var post = (arguments.length == 3) ? arguments[2] : '';
	var cookies = (document.cookie && topLevelDomain(hostName(link)) == topLevelDomain(location.hostname)) ? document.cookie + '; ' : '';
	var txt = s ? s : ((arguments.length > 1) ? arguments[1] : '');
	txt = txt.replace(/\s+/g, ' ').replace(/\x22/g, '\x27').replace(/^\s+|\s+$/g, '');
	var src = 'data:text/ogt;charset=UTF-8;base64,';
	src += encodeBase64('1;My_Download_Manager;0;;'+'\r\n'+location.href+'\r\n'+link+'\r\n'+txt+'\r\n'+cookies+'\r\n'+post+'\r\n');
	if(window.getSelection){
		var f = document.createElement('iframe');
		f.width = 0;
		f.height = 0;
		f.frameBorder = 'no';
		f.scrolling = 'no';
		f.src = src
		document.documentElement.appendChild(f);
		f.parentNode.removeChild(f);
	}
	else location.href = src;
};

function saveFileFrm(f){
	var qualifyURL = function(url){var a = document.createElement('a'); a.href = url; return a.href};
	var fp = getFormParams(f);
	var link = qualifyURL(f.hasAttribute('action') ? f.getAttribute('action') : '');
	var post = (f.hasAttribute('method') && f.getAttribute('method').toLowerCase() == 'post') ? fp : '';
	saveFile(link + '?' + fp, '', post);
};

function formWork(e){
	var f = e.target;
	if(e.ctrlKey && !e.shiftKey && !e.altKey && !isReplyForm(f)){
		e.stopPropagation();
		e.preventDefault();
		saveFileFrm(f);
	}
};

function monitorClick(e){
	if(e && e.button == 0 && !e.shiftKey && !e.altKey){
		var ele = e.target;
		if(e.ctrlKey && ele.nodeName.toLowerCase() == 'input' && /^(submit|button|image)$/i.test(ele.type)){
			while(ele.nodeName.toLowerCase() != 'form' && ele.parentNode){ele = ele.parentNode};
			if(ele.nodeName.toLowerCase() == 'form' && !isReplyForm(ele)){
				e.stopPropagation();
				e.preventDefault();
				saveFileFrm(ele);
			}
		}
		else{
			while(ele.nodeName.toLowerCase() != 'a' && ele.parentNode){ele = ele.parentNode};
			if(!ele.href)return;
			if(e.ctrlKey){
				e.stopPropagation();
				e.preventDefault();
				saveFile(ele.href, ele.innerText);
			}
			else{
				if(ele.getAttribute('target') == '_blank' && blockFilter.test(ele.href))ele.removeAttribute('target');
			}
		}
	}
};

document.addEventListener('click', monitorClick, true);
document.addEventListener('submit', formWork, false);
document.addEventListener('DOMContentLoaded', removeMetaRefresh, false);

})();
