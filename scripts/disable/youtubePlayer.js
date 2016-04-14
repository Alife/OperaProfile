// ==UserScript==
// @name youtube player replace
// @version 1
// @author lk
// @include *
// @depends jquery
// ==/UserScript==

function replaceYoutubePlayer(){
	jQuery("a[href*='youtube.com/watch?v=']").each(function(){
		// http://www.youtube.com/watch?v=u8nQa1cJyX8&a=GxdCwVVULXctT2lYDEPllDR0LRTutYfW
		// http://www.youtube.com/watch?v=u8nQa1cJyX8
		this.href="http://av3.feng80.com/player.swf?ID="+getYouTubeVideoId(this.href);
	});
	jQuery("iframe[src*='youtube.com']").each(function(){
		// www.youtube.com/embed/3OfYi1-PD7A?autoplay=1
		var video_id=this.src.substring(this.src.indexOf("embed/")+"embed/".length,this.src.indexOf("?"));
		this.src="http://av3.feng80.com/player.swf?ID="+video_id;
	});
		var player=document.getElementById("movie_player");
		if(player&&!player.hasAttribute("replaced")){
			player.src="http://av3.feng80.com/player.swf?ID="+getYouTubeVideoId(location.href);
			player.setAttribute("replaced",1);
		}
}
if(location.href.indexOf('watch?v=')>-1){
	function getYouTubeVideoId(url){
		var video_id = url.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition != -1)video_id = video_id.substring(0, ampersandPosition);
		return video_id;
	}
	document.addEventListener('DOMContentLoaded',function(e) {replaceYoutubePlayer();}, false);
	window.addEventListener("scroll", function() { replaceYoutubePlayer(); }, true);
}
