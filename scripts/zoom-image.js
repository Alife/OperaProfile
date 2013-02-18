document.addEventListener('mousewheel', function (ev) {
	if (ev.altKey && (ev.target instanceof HTMLImageElement)) {
		ev.preventDefault();
		var obj = ev.target;
		var zoom = parseInt(obj.style.zoom, 10) || 100;
		zoom -= ev.wheelDelta / 12;//zoom -= 10 * ev.detail / 3;
		if (zoom > 0)obj.style.zoom = zoom + "%";
		if (!obj.origWidth) {
		obj.origWidth  = obj.clientWidth;
		obj.origHeight = obj.clientHeight;
		}
		obj.style.width  = obj.origWidth  * zoom / 100;
		obj.style.height = obj.origHeight * zoom / 100;
	} else {

	}
}, false);