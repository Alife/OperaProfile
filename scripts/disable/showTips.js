// ==UserScript==
// @name 显示工具提示
// @author yansyrs
// @include *
// ==/UserScript==


(function(){
	var firstLink = document.getElementsByTagName('link')[0];
	if(firstLink && firstLink.href == 'opera:style/image.css')
		//如果是“打开图像”出来的页面则退出
		return false;
	else
	{
		var obj;//鼠标悬浮元素
		var clk;//计时器
		var mousePosX;//鼠标x坐标
		var mousePosY;//鼠标y坐标
		
		/*获取元素，如果不是图片和链接，则退出，否则分别创建计时器*/
		function start(e){
			obj = e.target;
			
			while(obj.nodeName.toLowerCase() != 'html' && obj.nodeName.toLowerCase() != 'img' && obj.nodeName.toLowerCase() != 'a')
			{
				obj = obj.parentNode;
			}
			
			if(obj.nodeName.toLowerCase() != 'img' && obj.nodeName.toLowerCase() != 'a')
				return false;
				
			if(obj.nodeName.toLowerCase() == 'img')
				clk = setTimeout(function(){showTip(obj, mousePosX, mousePosY)},1500);
			else if(obj.nodeName.toLowerCase() == 'a')
				clk = setTimeout(function(){showTip(obj, mousePosX, mousePosY)},500);
		}

		/*获取鼠标位置*/
		function getPos(e){
			var ev = e ? e : window.event;
			
			mousePosX = ev.clientX + window.pageXOffset;
			mousePosY = ev.clientY + window.pageYOffset;
		}

		/*显示工具栏提示*/
		function showTip(obj, x, y){
			var str;
			/*悬浮在图片上*/
			
			if(obj.nodeName.toLowerCase() == 'img'){
				str	= (obj.parentNode.nodeName.toLowerCase() == 'a') ? (obj.parentNode.title ? obj.parentNode.title+'<br/>' : '') + obj.parentNode.href+'<br/>' : (obj.title ? obj.title + '<br/>' : '');
				str += decodeURI('%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8: ') + obj.width + ', ' + obj.height;
			}
			/*悬浮在连接上*/
			else if(obj.nodeName.toLowerCase() == 'a')
				str = obj.href;
				
			/*创建工具提示并显示*/
			var tipDiv = document.createElement('div');
			tipDiv.id = 'tipDiv';
			tipDiv.innerHTML = str;
			
			tipDiv.style = 'background: yellow; font-size:12px; color:black; border: 1px black solid; z-index:99999; position:absolute;line-Height:150%;padding:0 0 15px';// left:' + (x+10) + 'px; top:' + (y+10) +'px;';
			
			document.body.appendChild(tipDiv);
			
			tipDiv.style.top = y + 10;
			if(tipDiv.offsetWidth + x > document.body.clientWidth)
				tipDiv.style.left = x - tipDiv.offsetWidth - 10;
			else
				tipDiv.style.left = x + 10;		
		}

		/*移出图片或链接是清楚计时器并去掉工具提示*/
		function stop(){
			var temp = document.getElementById('tipDiv');
			if(temp) document.body.removeChild(temp);
			
			clearTimeout(clk);
		}

		window.addEventListener('mouseover',start,false);
		window.addEventListener('mousemove',getPos,false);
		window.addEventListener('mouseout',stop,false);
	}
})();