// ==UserScript==
// @author yansyrs
// @version v1.0.0
// @date 2013-02-16
// @description Disable the lazy-load function of images for Dz-forums.
// @namespace http://opera.im/archives/disable-dz-image-lazyload/
// @include http://*/thread*.html
// @include http://*/forum.php?*mod=viewthread*
// ==/UserScript==

(function(){
	if(window.opera){
		/* for opera */
		window.opera.addEventListener(
			'BeforeScript',
			function (e) {
				var resource = e.element.getAttribute('src');
				if( resource && resource.match(/forum_viewthread\.js/) ) {
					var condition = 'if(this.getOffset(imgs[j]) > document.documentElement.clientHeight)';
					if( e.element.text.indexOf(condition) != -1 ){
						e.element.text = e.element.text.replace(condition, 'if (false)');
					}
				}
			}, false
		);
	}
	else{
		function $$(str){
			return document.querySelectorAll(str);
		}
		
		function loadLazyImage(img){
			img.style.width = img.style.height = '';
			img.setAttribute('src', img.getAttribute('file') ? img.getAttribute('file') : img.getAttribute('src'));
			img.setAttribute('lazyloaded', true);
		}
		
		function _antiDzLazyload(){
			var w = unsafeWindow || window;
			if(w.lazyload && w.lazyload.imgs.length > 0){
				/* for firefox */
				for(var i = 0; i < w.lazyload.imgs.length; i++){
					var img = w.lazyload.imgs.shift();
					loadLazyImage(img);
				}
			}
			else{
				/* for chrome */
				var imgs = $$('img[src*="static/image/common/none.gif"][file]');
				if(imgs && imgs.length > 0){
					for(var i = 0; i < imgs.length; i++){
						loadLazyImage(imgs[i]);
					}
				}
			}
		}
		_antiDzLazyload();
		window.addEventListener('DOMNodeInserted', _antiDzLazyload, false);
	}
})();