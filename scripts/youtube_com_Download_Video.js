// ==UserScript==
// @name        Download video from http://youtube.com/
// @version     2.07
// @date        2010-04-23
// @author      Mike Samokhvalov <mikivanch@gmail.com>
// @download    http://www.puzzleclub.ru/files/youtube_com.js
// @include     http://youtube.com/watch*
// @include     http://*.youtube.com/watch*
// ==/UserScript==

(function(){   
  function getTitle()
  {
    if(window.yt && yt.config_ && yt.config_['VIDEO_TITLE'])
      return decodeURIComponent(yt.config_['VIDEO_TITLE']);
    
    var t = document.getElementById('watch-headline-title');    
    if(t)
    {
      return t.innerText;
    }
    
    var meta = document.getElementsByTagName('meta');
    for(var i = 0; i < meta.length; i++)
    {
      var name = meta[i].getAttribute('name', false);
      if(name && name.toLowerCase() == 'title')
        return meta[i].getAttribute('content', false);
    }

    return '';  
  }
  
  function getSwfArgs()
  {
    if(window.yt && yt.config_ && yt.config_['SWF_CONFIG'])
      return yt.config_['SWF_CONFIG'].args;
      
    var t = document.body.innerHTML.match(/[\"\']swf_args[\"\']\s*:\s*(\{[^\}]+\})/i);
    if(t && t.length > 1)
      return eval('(' + t[1] + ')');
      
    var e = document.getElementsByTagName('embed');
    for(var i = 0; i < e.length; i++)
    {
      var f = e[i].getAttribute('flashvars', false);
      if(f && f.search(/fmt_map=/i) != -1)
      {
        var swfargs = [];
        f = f.split('&');
        for(var j = 0; j < f.length; j++)
        {
          var p = f[j].split('=', 2);
          if(p.length == 2)
            swfargs[p[0]] = p[1];
          else if(p.length == 1)
            swfargs[p[0]] = '';
        }
        
        return swfargs;
      }
    }
  }
  
  function modifyTitle(t)
  {
    t = t.replace(/[\x2F\x5C\x3A\x7C]/g, '-');
    t = t.replace(/[\x2A\x3F]/g, '');
    t = t.replace(/\x22/g, '\'');
    t = t.replace(/\x3C/g, '(');
    t = t.replace(/\x3E/g, ')');
    t = t.replace(/(?:^\s+)|(?:\s+$)/g, '');
    return t;
  }
  
  function getDownloadLink(video_id, token, fmt)
  {
    return 'http://' + location.host + '/get_video?video_id=' + video_id + '&t=' + token + '&fmt=' + fmt;
  }
  
  function showLinks(l)
  {
    var title = getTitle(), titleAttr = '';
    if(title)
    {
      title = modifyTitle(title);        
      titleAttr = '&title=' + encodeURIComponent(title);
    }

    var p = document.createElement('div');
    p.setAttribute('style', 'display:  block; color: #000; background-color: #e7eefa; border: 1px solid #c3d0ec; padding: 5px 0; text-align: center;', false);
    var html = '';
    
    var fmt_params = {
      flv: {
        '5': 'FLV',
        '34': 'FLV',
        '35': 'FLV HQ'
      },
      
      mp4: {        
        '18': 'MP4',
        '22': 'MP4 HD 720p',
        '37': 'MP4 HD 1080p'
      }
    };
    
    var sep = '';
    for(var i in fmt_params.flv)
    {
      if(l[i])
      {
        html += sep + '<a href="' + l[i] + titleAttr + '" style="font-weight:bold;">' + fmt_params.flv[i] + '</a>';
        sep = '&nbsp|&nbsp;';
      }
    }    
    
    for(var i in fmt_params.mp4)
    {
      if(l[i])
      {
        html += sep + '<a href="' + l[i] + titleAttr + '" style="font-weight:bold;">' + fmt_params.mp4[i] + '</a>';
        sep = '&nbsp|&nbsp;';
      }
    }
      
    p.innerHTML = html;
    document.body.insertBefore(p, document.body.firstChild);
  }
  
  function onLoad()
  {
    var swfargs = getSwfArgs();
    if(!swfargs)
      return;

    var token = swfargs.t ? swfargs.t : swfargs.token;
    if(!token)
      return;
      
    var video_id = swfargs.video_id;
    if(!video_id)
    {
      var m = location.href.match(/\/watch\?(?:.+&)?v=([\w\-]+)/i);
      if(m && m.length > 1)
        video_id = m[1];
    }    
    
    if(!video_id)
      return;    
    
    var u = swfargs['fmt_url_map'];
    if(!u)
    {
      return;
    }  
    
    var mp4 = false;
    
    var l = [];  
    u = decodeURIComponent(u);
    u = u.replace(/,(\d+\|)/g, '~$1');
    u = u.split('~');
    if(u && u.length > 0)
    {
      for(var i = 0; i < u.length; i++)
      {
        var t = u[i].split('|');
        if(t && t.length == 2)
        {
          l[t[0]] = t[1];
          if(t[0] == '18')
            mp4 = true;
        }
      }
    }
    
    
    if(l['5'] && l['34'])
      delete l['5'];
      
    
    if(mp4)
    {
      showLinks(l);
      return;
    }
    
    sendRequest(getDownloadLink(video_id, token, '18'), function(r){
      if(r.status < 400)
      {
        var loc = r.getResponseHeader('Location');
        if(loc && loc.search(/\/videoplayback\?/i) != -1)
          l['18'] = loc;
        else
          l['18'] = getDownloadLink(video_id, token, '18');
      }  
        
      showLinks(l);
    }, 'HEAD');
  }
  
  function sendRequest(url, callback, method, referer, post, cookie, user_agent, header)
  {
    var req = new XMLHttpRequest();
    if (!req)
      return;

    method = method ? method : ((post) ? 'POST' : 'GET');
    user_agent = user_agent ? user_agent : navigator.userAgent;
    
    req.open(method, url, true);
    
    req.setRequestHeader('User-Agent', user_agent);
    if(referer)
    {
      req.setRequestHeader('Referer', referer);
    }
    if(cookie)
    {
      req.setRequestHeader('Cookie', cookie);
    }
    if (post)
    {
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.setRequestHeader("Content-Length", post.length);
    }
    if(header)
    {
      for(var i = 0; i < header.length; i++)
      {
        req.setRequestHeader(header[i][0], header[i][1]);
      }
    }
    
    req.onreadystatechange = function ()
    {
      if (req.readyState != 4)
        return;
      
      callback(req);
    };
    
    if (req.readyState == 4)
    {
      return;
    }  
    
    if(post)
      req.send(post);
    else
      req.send();
  }

  if(typeof(opera.version) == 'function' && opera.version() >= 9)
    document.addEventListener('DOMContentLoaded', onLoad, false);  
  else
    document.addEventListener('load', onLoad, false);
})();