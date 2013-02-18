/*
Description:将网页语言不是中文的自动翻译成中文
Version:V1.0 2010-05-29 17:49
Author:	alife <alife@bbs.operachina.com>
说明:	自动翻页网页语言设置为空和含“zh”以外的网页。
		翻译脚本截自：http://bbs.operachina.com/viewtopic.php?f=41&t=59511
*/
if (window == window.parent && location.hostname.indexOf('.cn') == -1 && location.hostname.indexOf('cn.') == -1) { //if frame
   document.addEventListener("DOMContentLoaded", function() {
      if (document.documentElement.lang !=''&&document.documentElement.lang.indexOf('zh') ==-1) {
         if(location.href.indexOf('#googtrans/') == -1){
            location.href+='#googtrans/auto/zh-CN';
         }
         d=document;b=d.body;o=d.createElement('script');
         o.setAttribute('src','http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
         o.setAttribute('type','text/javascript');
         b.appendChild(o);
         v=b.insertBefore(d.createElement('div'),b.firstChild);
         v.id='google_translate_element';
         v.style.display='none';
         p=d.createElement('script');
         p.text='function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'+'\'\''+'},\'google_translate_element\');}';
         p.setAttribute('type','text/javascript');
         b.appendChild(p);
      }
   }, false);
}