// ==UserScript==
// @name 优酷屏幕宽/普屏切换
// @author NLF
// @description ...........
// @date 2009-1-13
// @version 1.2
// @include http://v.youku.com/*
// ==/UserScript==

youku={

wideScreen:true ,//初始化为宽屏
HD:true  ,  //初始化为高清模式


//定义youku宽CSS属性
ws:'#col3,'+
'*[id*="preAd"],*[id^="ab_"]{display:none !important;}'+
'#col2{float:right !important;}'+
'div[class="left"],#content{width:688px !important;}'+
'div[class="player"]{width:688px !important;height:430px !important;}'+
'div[class^="s_main col"],div[class="footerBox"]{width:1010px !important;}',

//普通CSS属性,去广告
ns:'#col3,*[id*="preAd"],*[id^="ab_"]{display:none !important;}'+
'#col2{float:right !important;}'+
'div[class="player"]{width:615px !important;height:500px !important;}'+
'div[class="left"],#content{width:610px !important;}',


gaoqing:function(){
if (youku.HD){setTimeout(yuhd,2222)}
  function yuhd(){
   var xx=document.getElementById('videoPlayMode');
      if (xx && xx.style.display!='none') {
        // alert('存在高清MP4');
          playModeSet('mp4')
         }
    }
youku.init()
},


//创建装入CSS的函数
init:function(){
  var ykStyle = document.createElement('style');
  ykStyle.setAttribute('type','text/css');
    if (youku.wideScreen){
         ykStyle.innerHTML = youku.ws;
         ykStyle.setAttribute('id','wstyle');
       }else{
          ykStyle.innerHTML = youku.ns;
          ykStyle.setAttribute('id','nstyle');
  }
document.getElementsByTagName('head')[0].appendChild(ykStyle);
youku.qiehuan();
},

//插入切换显示链接
qiehuan:function(){
 var ekg=document.getElementById('kaiguan');
 if(ekg){
 ekg.parentNode.removeChild(ekg);
 }
 
 var kaiguan=document.createElement('a');
 kaiguan.setAttribute('href',"javascript:youku.check()")
 if(document.getElementById('wstyle')){
  kaiguan.setAttribute('title',"切换成4:3普屏");
  kaiguan.appendChild(document.createTextNode("【4:3】"));
 }else{
   kaiguan.setAttribute('title',"切换成16:9宽屏");
   kaiguan.appendChild(document.createTextNode("【16:9】"));
 }
 kaiguan.setAttribute('id','kaiguan');
 //var position=document.selectNodes('/html/body/div[2]/div/div[3]/div[2]')[0];
  var position1 =document.evaluate('/html/body/div[2]/div/div[3]/div[2]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
  var position2 =document.evaluate('/html/body/div[2]/div[2]/div/div',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
 //为了兼容更多的位置
 if (position1){
  var position=position1
 }else{
 var position=position2
 }

 position.parentNode.insertBefore(kaiguan,position);
 kaiguan.setAttribute('style',"margin-left:10px;color:red;border:1px solid red;width:60px;background-image:none!important;")

},

check:function(){

if(document.getElementById('wstyle')) //对象或者null会被自动转成布尔值
    {
      document.getElementById('wstyle').parentNode.removeChild(document.getElementById('wstyle'));
    youku.wideScreen=false;
    }else{
      document.getElementById('nstyle').parentNode.removeChild(document.getElementById('nstyle'));
    youku.wideScreen=true;
     }

youku.init();

}
}
document.addEventListener('DOMContentLoaded', youku.gaoqing, false);

