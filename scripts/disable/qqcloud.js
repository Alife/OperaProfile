/**
 * QQ云输入法
 * @url *
 * @description 在页面的input、textarea等可点击区域开启QQ云输入法 此脚本制作人JYS.QQ:97021250
 */

document.addEventListener(
	'DOMContentLoaded',
	function() {
		var arr = [],
	   		inputs = document.getElementsByTagName('input'),
			textareas = document.getElementsByTagName('textarea');
		if(inputs.length == 0 && textareas.length == 0) return;
		//合并数组
		for(var i=0,j=Math.max(inputs.length,textareas.length); i<j; i++) {
			inputs[i] && arr.push(inputs[i]);
			textareas[i] && arr.push(textareas[i]);
		}
		//加载输入法
		for(var k=0; k<arr.length; k++) {
			arr[k].addEventListener(
				'focus',
				function(e) {
					var target = e.target;
					if(document.getElementById('SG_Shurufa') || (target.tagName.toLowerCase() == 'input' && target.type != 'text')) return;
					var script = document.createElement('script');
					script.setAttribute('src','http://s.pc.qq.com/webime/js/ime.js?v=17');
                    script.id = 'SG_Shurufa';
					document.body.appendChild(script);

				},false
			);
		}
	},false
);