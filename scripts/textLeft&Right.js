// ==UserScript==
// @include *
// ==/UserScript==
function findStar(){
	var textState = localStorage.getItem("textState");
	if(textState)$("*").css("text-align","left");localStorage.setItem("textState")="left";
	else if(textState=="left")
	
}

