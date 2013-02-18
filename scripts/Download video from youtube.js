// ==UserScript==
// @name        Download video from http://youtube.com/
// @version     1.14
// @date        2009-08-26
// @author      Mike Samokhvalov <mikivanch@gmail.com>
// @download    http://www.puzzleclub.ru/files/youtube_com.js
// @include     *youtube.com/watch*
// @include     *.youtube.com/watch*
// ==/UserScript==

(function(){
  ///////////////////////////////////////////////////////////////////
  // SETTINGS
  
  var highQualityVideo = false;
  
  ///////////////////////////////////////////////////////////////////
  // DO NOT EDIT
  
  if(highQualityVideo)
  {
    window.opera.addEventListener('BeforeScript', function(e){
      if(e.element.text && !e.element.getAttribute('src', false))
      {
        if(e.element.text.search(/var\s*swfargs\s*=/i) != -1)
        {
          e.element.text = e.element.text.replace(/([\x22\x27]fmt_map[\x22\x27]\s*:\s*[\x22\x27])[^\x22\x27\s]*([\x22\x27])/, '$1' + '18/512000/9/0/115' + '$2');
          e.element.text = e.element.text.replace(/fmt_map=[^&\s]*/, 'fmt_map=18%2F512000%2F9%2F0%2F115');
          e.element.text = e.element.text.replace(/([\x22\x27]vq[\x22\x27]\s*:\s*)null/i, '$1' + '"2"');
          e.element.text = e.element.text.replace(/vq=none/i, 'vq=2');
        }
      }
    }, false);
  }
  
  var url = '';
  window.opera.addEventListener('AfterScript', function(e){
    if(e.element.text)
    {
      if(e.element.text.search(/var\s*swfargs\s*=/i) != -1)
      {
        var site = '';
        if(window.swfArgs)
        {
          url = '', sep = '';
          for(var i in swfArgs)
          {
            if(i.search(/^(plid|fmt_map|video_id|l|sk|t|vq)$/i) != -1)
            {
              url += sep + i + '=' + swfArgs[i];
              sep = '&';
            }
          }
        }  

        if(site)  
          url = site + url;
        
        if(url.indexOf('get_video?') == -1)
          url = 'http://youtube.com/get_video?' + url;
      }
    }  
  }, false);

  function onLoad()
  {
    if(!url)
      return;
      
    var url1 = url;
    var url2 = url;
    if(url2.search(/\bfmt=\d+\b/i) != -1)
      url2 = url2.replace(/\bfmt=\d+\b/i, 'fmt=18');
    else
      url2 += '&fmt=18';    

    var n = '';  
    var t = document.getElementById('watch-vid-title');    
    if(t)
    {
      var h1 = t.getElementsByTagName('h1');
      if(h1 && h1.length > 0)
      {
        n = h1[0].innerText;
        n = n.replace(/[\x2F\x5C\x3A\x7C]/g, '-');
        n = n.replace(/[\x2A\x3F]/g, '');
        n = n.replace(/\x22/g, '\'');
        n = n.replace(/\x3C/g, '(');
        n = n.replace(/\x3E/g, ')');
        n = n.replace(/(?:^\s+)|(?:\s+$)/g, '');
      }  
    }  
    
    var n1 = '', n2 = '';
    if(n)
    {
      n1 = n + '.flv';
      n2 = n + '.mp4';
    }
    
    var size = n1.length + 8;
    if(size > 64)
      size = 64;
      
    var inputAttr = (
      'type="text"  '
      +'onfocus="if(this.value && this.select){this.select()}" '
      +'style="border: 1px solid #c3d0ec; background-color: transparent;"'
    );

    var p = document.createElement('div');
    p.setAttribute('style', 'display:  block; color: #003399; background-color: #e7eefa; border: 1px solid #c3d0ec; padding: 5px 0; text-align: center;', false);
    var html = '<table style="border-collapse: collapse; border: none; margin: 0 auto;"><tr><td><a href="' + url1 + '">FLV</a>:&nbsp;</td><td>';
    if(n1)
    {
      html += '<input size="' + size + '" value="' + n1 + '" ' + inputAttr + '>';
    } 
    html += '</td></tr><tr><td><a href="' + url2 + '">MP4</a>:&nbsp;</td><td>';
    if(n2)
    {
      html += '<input size="' + size + '" value="' + n2 + '" ' + inputAttr + '>';
    }  
    html += '</td></tr></table>';
    p.innerHTML = html;
    document.body.insertBefore(p, document.body.firstChild);
  }

  if(typeof(opera.version) == 'function' && opera.version() >= 9)
    document.addEventListener('DOMContentLoaded', onLoad, false);  
  else
    document.addEventListener('load', onLoad, false);

})();