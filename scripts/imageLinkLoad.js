// ==UserScript==
// @name loadLinkImg
// @author lk
// @description auto load img if link is a img link
// @todo load img 1 by 1
// ==/UserScript==

(function(){
	function loadLinkImg(){
		var links=document.links;
		for(var i=0;i<links.length;i++){
			var link = links[i];var h=link.href.toLowerCase();
			if(!(h.endsWith(".jpg")||h.endsWith(".png"))||link.hasAttribute("loadImg"))continue;
			var img = document.createElement('img');
			img.src = loadimg;
			img.className="imgload";
			link.appendChild(img);
			link.setAttribute("loadImg",true);
			
			jQuery.get(link.href).complete(function(){
				img.style.width=link.parentElement.scrollWidth+"px";
				img.src = link.href;
				//jQuery(img).fadeIn();
			}).done(function(data){
			if(console&&console.log){
			  console.log( "Sample of data:", data.slice( 0, 100 ) );
			}
		  });   
		}
	};
	
	var loadimg = 'data:image/gif;base64,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';
	var isloading=false;
	function loadLinkImg1by1(){
		if(isloading)return;
		isloading=true;
		var links=jQuery('a:not([loadImg])[href$="jpg"]');
		if(links.length==0){isloading=false;return;}
		var link = links[0];var h=link.href.toLowerCase();
		//if(!(h.endsWith(".jpg")||h.endsWith(".png"))||link.hasAttribute("loadImg"))continue;
		var img=jQuery("<img />").attr('src',link.href).load(function(){
			if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
				alert('broken image!');
			} else {
				$(link).append(img);
				if(img.length)img=img[0];
				img.style.width=link.parentElement.scrollWidth+"px";
				isloading=false;
				loadLinkImg1by1();
			}
		});
		img.className="imgload";
		link.setAttribute("loadImg",true);
	};

	document.addEventListener('DOMContentLoaded',loadLinkImg,false);
	window.addEventListener('scroll',loadLinkImg,true);
})();