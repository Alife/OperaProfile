// ==UserScript==
// @ Created by Min Zhang
// @ Mail: hi@live.com
// @ Web Page: http://www.belemview.com
// @ Web Page: http://belemview.spaces.live.com
// @ Fixed the layout truncation issue of Windows Live Spaces permalink page, the comments area can be displayed. 
// @ Unable to publish comments -> This is a bug of Windows Live Spaces. 
// @ Unable to sign in in "Add a comment" area. -> This is a bug of Windows Live Spaces.
// @ First/Previous/Next/Last comments navigator arrows are disabled. -> This is a bug of Windows Live Spaces. Windows Live Spaces says: Opera? No.
// @ Modified 15:45 2008-2-29
// @ For Opera 9.2X
// ==/UserScript==

// ==UserScript==
// @ Updated by Min Zhang
// @ Mail: hi@live.com
// @ Web Page: http://www.belemview.com
// @ Web Page: http://belemview.spaces.live.com
// @ Disabled the Top Super Banner of Windows Live Spaces.
// @ Modified 14:01 2008-3-03
// @ For Opera 9.2X, Opera 9.5
// ==/UserScript==

// ==UserScript==
// @ Updated by Min Zhang
// @ Mail: hi@live.com
// @ Web Page: http://www.belemview.com
// @ Web Page: http://belemview.spaces.live.com
// @ Enabled the Windows Media Player of Windows Live Spaces.
// @ Modified 16:18 2008-3-04
// @ For Opera 9.2X, Opera 9.5
// ==/UserScript==

 

if( location.hostname.indexOf('spaces.live.com') != -1 || location.hostname.indexOf('spaces.start.com') != -1 ) {
document.addEventListener(
  'DOMContentLoaded',
  function () {
  	
  	function ShowBlogComments() {
	    if( !document.body ) { return; }
	    var tables = document.getElementsByTagName('table');
		for (var i = 0; i < tables.length; i++) {
			var table = tables[i];
			if (table.getAttribute('class') == 'FullView') 
				{
				table.style.height = "auto";
				}
			}
    }
    
    function DisableTopAds() {
	    if( !document.body ) { return; }
	    var iAds = document.getElementById('AdContainer');
		iAds.style.display = "none";
 	}
 	
 	function ShowWMP() {
 		if( !document.body ) { return; }
 		var iParam = null;
 		iParam = document.getElementsByTagName('param')[0];
 		if(iParam != null)
 		{
	 		var iPUrl = document.getElementsByTagName('param')[0];
	 		var iPCount = document.getElementsByTagName('param')[1];
	 		var iPautoS = document.getElementsByTagName('param')[2];
	 		var iPuiMode = document.getElementsByTagName('param')[3];
	 		var iPstretchToFit = document.getElementsByTagName('param')[4];
	 		var iwindowlessVideo = document.getElementsByTagName('param')[5];
	
	 		var iUrl = iPUrl.getAttribute("value");
	 		var iCount = iPCount.getAttribute("value");
			var iAutoS = iPautoS.getAttribute("value");
			var iUiMode = iPuiMode.getAttribute("value");
	 		var istretchToFit = iPstretchToFit.getAttribute("value");
			var iwindowlessVideo = iwindowlessVideo.getAttribute("value");
	 		
   			var iV = "-1";
   			var iVs = "true";
   			var iH = null;
   			if(iUiMode == "none" || iUiMode == "invisible")
   			{
   				iV = "0";
   				iVs = "false";
   				iH = 'height = "0px"';
   			}
   			else if(iUiMode == "mini" || iUiMode == "full")
			{
				iV = "-1";
				iVs = "true";
				iH = "";
			}
						
			//var sC = '<param name="controller" value="'+ iVs +'" />';
				 		
	 		var iT = //Standard <object> works on gb2312/belemview.spaces.live.com but doesn't work at some other spaces.
	 				//'<object type="video/x-ms-wmv" data="'+ iUrl +'" width="100%">'
	 		 		//+ '<param name="src" value="' + iUrl + '" />'
	 		 		//+ '<param name="playCount" value="'+ iCount +'" />'
	 		 		//+ '<param name="autoStart" value="'+ iAutoS +'" />' 
	 		 		//+ sC
	 		 		////+ '<param name="stretchToFit" value="' + istretchToFit + '" />'
	 		 		////+ '<param name="windowlessVideo" value="' + iwindowlessVideo + '" />'
	 		 		// '</object>' 
	 		 		
	 		 		//Replaced by nonstandard <embed> to implement this feature.
	 		 		 '<embed type="application/x-mplayer2" '
	 		 		+ 'pluginspage="http://www.microsoft.com/windows/mediaplayer/download/default.asp" Name="Player" enablecontextmenu="1" '
	 		 		+ 'visiable ="' + iUiMode + '" autostart="' + iAutoS + '" '
	 		 		+ 'showcontrols="'+ iV +'" width="100%" loop="'+ iCount +'" '
	 		 		+ 'src="' + iUrl + '"' + iH + '">'
	 		 		+ '</embed>';

			/* 
			//It's a better solution in some spaces for UI of WMP module but doesn't work at gb2312/belemview...
	 		var iWMP = document.getElementsByTagName('div');
	 		for(var i = 0; i < iWMP.length; i++)
	 		{
	 			if(iWMP[i].getAttribute("class") == "MPBody")
	 			{	
	 				iWMP[i].innerHTML = iT;
	 				iWMP[i].setAttribute('style','display:block;');
	 			}
	 		}
	 		*/
	 		
	 		var displayWMP = document.getElementById('WMP');
	 		displayWMP.innerHTML = iT;
	 		//displayWMP.setAttribute('style','display:block;');
 		}
 	}
 	
 	try {
 	ShowWMP();
 	}
    catch(Err) {
    	;
    }
    
    try {
     		ShowBlogComments();
    }
    catch(Err) {
    	;
    }

    
    try {
    		DisableTopAds();
    }
    catch(Err) {
    	;
    }
    
  },
  false
);
 
}