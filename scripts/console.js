if (opera.version() >= 10.5) {
	window.addEventListener('DOMContentLoaded', function (e) {
		if(document.body.innerHTML==""||document.body.innerText=="")return;
		var css =
			'#consoleOverlay{' +
			'position: fixed;' +
			'background: rgba(0,0,0,0.9);' +
			'bottom: -50px;' +
			'left: 0;' +
			'right: 0;' +
			'color: #69b9e5;' +
			'text-shadow: 0 0 3px #69b9e5;' +
			'padding: 0 20px;' +
			'font: 11px/50px menlo,consolas,monaco,monospace;' +
			'height: 50px;' +
			'overflow: hidden;' +
			'-o-transition: 1s' +
			'transition: 1s' +
			'z-index: 2147483647;' +
			'}' +
			'#consoleOverlay.active{' +
			'bottom: 0;' +
			'-o-transition: 0s;' +
			'transition: 0s;' +
			'}';

		var style = document.createElement('style');
		style.textContent = css;
		(document.head || document.body).appendChild(style);

		var newconsole = document.createElement('div');
		document.body.appendChild(newconsole);
		newconsole.id = 'consoleOverlay';

		var old_log = window.console.log.bind(console);
		var _isShow=false;
		window.Console.prototype.isShow = function (isShow) {_isShow=isShow};
		window.console.log = function () {
			if(!_isShow)return;
			var text = Array.prototype.slice.call(arguments).join(" ");
			document.querySelector("#consoleOverlay").textContent = text;
			old_log.apply(null, arguments);

			newconsole.className = 'active';

			clearInterval(removeOverlay);

			var removeOverlay = setTimeout(function () {
					newconsole.className = '';
				}, 3000);

			return "";
		};
		window.log = console.log;
	}, false);
}
