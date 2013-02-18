// ==UserScript==
// @name           fanfou Thread Status
// @namespace      http://www.paopao.name
// @description    预览饭否的“给xx的回复”的原消息以及之前的消息，并以会话的方式显示
// @version        0.1
// @author         paopao
// @include        http://fanfou.com*
// ==/UserScript==

(function(){
    // 等待 DOM 载入
    document.addEventListener("DOMContentLoaded",function () {
        // 添加 CSS 样式
        var style = document.createElement("style");
        style.innerHTML = "div#statustip{z-index:999;position:absolute;top:0px;left:100px;display:none;width:388px;border:1px solid black;background-color:white;opacity:0.9;padding:10px;}div#statustip img.avatar{display:block;width:48px;height:48px;margin:3px 0 3px  -59px;float:left;clear:none;}div#statustip span.author{color:#0066CC;}div#statustip img.loading{margin-left:150px;}div#statustip div.thread{min-height:52px;width:320px;margin-bottom:5px;padding:0px 3px 3px 62px;border:1px dashed silver;}";
        document.getElementsByTagName("head")[0].appendChild(style);
        
        // 消息缓存
        var statuscache = {};
        // 准备提示框
        var tip = document.createElement("div");
        tip.setAttribute("id","statustip");
        tip.innerHTML = '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
        document.getElementsByTagName("body")[0].appendChild(tip);
        // 查找和遍历消息
        var spans = document.getElementsByTagName("span");
        for(var i=0; i < spans.length; i++) {
            if(spans[i].className == "reply") {
                var alink = spans[i].getElementsByTagName("a")[0];
                alink.addEventListener("mouseover",function(e){
                    if(tip.alink) {
                        tip.alink.addEventListener("mouseout",hideTip,false);
                    }
                    tip.alink = this;
                    // 获取消息id
                    var sid = this.href.substring((this.href.lastIndexOf("/")+1),this.href.lastIndexOf("?"));
                    // 显示载入框
                    tip.innerHTML = '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
                    tip.style.top = e.pageY + 20 + "px";
                    tip.style.left = e.pageX + "px";
                    tip.style.display = "block";
                    // 如果缓存中存在则在缓存中读取
                    if(statuscache[sid]) {
                        if (tip.style.display == "block"){
                            var output = statuscache[sid];
                            var mydate = new Date(output.created_at);
                            tip.innerHTML = '<div class="thread"><img class="avatar" src="'+output.user.profile_image_url+'" alt="'+output.user.screen_name+'" /><span class="author">'+output.user.screen_name+'</span> <span class="content">'+output.text+'</span> <span class="stamp">'+mydate.toLocaleString()+' <span class="method">通过 '+output.source+'</span></span></div>';
                            if(output.in_reply_to_status_id != "") {
                                tip.innerHTML += '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
                                threadFanfou(output.in_reply_to_status_id);
                            }
                        }
                    // 否则就通过JSONP载入
                    } else {
                        getFanfou("http://api2.fanfou.com/statuses/show/"+sid+".json?callback=", function(output){
                            statuscache[sid] = output;
                            if (tip.style.display == "block"){
                                var mydate = new Date(output.created_at);
                                tip.innerHTML = '<div class="thread"><img class="avatar" src="'+output.user.profile_image_url+'" alt="'+output.user.screen_name+'" /><span class="author">'+output.user.screen_name+'</span> <span class="content">'+output.text+'</span> <span class="stamp">'+mydate.toLocaleString()+' <span class="method">通过 '+output.source+'</span></span></div>';
                                if(output.in_reply_to_status_id != "") {
                                    tip.innerHTML += '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
                                    threadFanfou(output.in_reply_to_status_id);
                                }
                            }
                        });
                    }
                },false);
                // 保持消息框跟随鼠标
                alink.addEventListener("mousemove",function(e){
                    tip.style.top = e.pageY + 20 + "px";
                    tip.style.left = e.pageX + "px";
                },false);
                // 鼠标移出时隐藏消息框
                alink.addEventListener("mouseout",hideTip,false);
                // 鼠标点击链接时不隐藏消息框
                alink.addEventListener("click",function(e){
                    this.removeEventListener("mouseout",hideTip,false);
                    e.preventDefault();
                },false);
                // 鼠标双击时访问链接
                alink.addEventListener("dblclick",function(e){
                    location.href = this.href;
                    e.preventDefault();
                },false);
                // 鼠标点击消息框时隐藏消息框
                tip.addEventListener("click",function(){
                    hideTip();
                    tip.alink.addEventListener("mouseout",hideTip,false);
                },false);
            }
        }

        function hideTip(){
            tip.style.display = "none";
            tip.innerHTML = '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
        }

        // 获取之前的消息
        function threadFanfou(sid) {
            if(statuscache[sid]) {
                if (tip.style.display == "block"){
                    var output = statuscache[sid];
                    var mydate = new Date(output.created_at);
                    tip.innerHTML = tip.innerHTML.replace(/<img class="loading"[^>]*>/ig,'<div class="thread"><img class="avatar" src="'+output.user.profile_image_url+'" alt="'+output.user.screen_name+'" /><span class="author">'+output.user.screen_name+'</span> <span class="content">'+output.text+'</span> <span class="stamp">'+mydate.toLocaleString()+' <span class="method">通过 '+output.source+'</span></span></div>');
                    if(output.in_reply_to_status_id != "") {
                        tip.innerHTML += '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
                        threadFanfou(output.in_reply_to_status_id);
                    }
                }
            } else {
                getFanfou("http://api2.fanfou.com/statuses/show/"+sid+".json?callback=", function(output){
                    statuscache[sid] = output;
                    if (tip.style.display == "block"){
                        var mydate = new Date(output.created_at);
                        tip.innerHTML = tip.innerHTML.replace(/<img class="loading"[^>]*>/ig,'<div class="thread"><img class="avatar" src="'+output.user.profile_image_url+'" alt="'+output.user.screen_name+'" /><span class="author">'+output.user.screen_name+'</span> <span class="content">'+output.text+'</span> <span class="stamp">'+mydate.toLocaleString()+' <span class="method">通过 '+output.source+'</span></span></div>');
                        if(output.in_reply_to_status_id != "") {
                            tip.innerHTML += '<img class="loading" src="http://static.fanfou.com/img/ajax-indicator.gif" />';
                            threadFanfou(output.in_reply_to_status_id);
                        }
                    }
                });
            }
        }

    },false);

    // JSONP方式载入饭否消息
    function getFanfou(longURL, success) {
 
        // 创建一个不重复的回调函数名
        var ud = 'json'+(Math.random()*100).toString().replace(/\./g,'');
 
        // 定义一个全局函数来运行 success 回调函数
        window[ud]= function(o){ success&&success(o); };
 
        // 添加新的 SCRIPT 元素至页面中
        document.getElementsByTagName('body')[0].appendChild((function(){
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = longURL + ud;
            return s;
        })());
    }
})();