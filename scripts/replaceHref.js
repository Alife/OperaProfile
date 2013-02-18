// ==UserScript==
// @include http://*.google.*/search?*
// @ujs:modified 2009年3月2日17:22:27
// ==/UserScript==

document.addEventListener('load',ReURL, true);
function ReURL()
{
  var res = ["http://webcache.googleusercontent.com","http://twitter.com","http://t.sina.com.cn"];
  var repl = ["https://webcache.googleusercontent.com","https://twitter.com","http://t.sina.cn"];

var atag = document.getElementsByTagName("a");
  for(var i=0,l=atag.length;i<l;i++)
  {
    if(atag[i].href){
      for(var j=0;j<res.length;j++)
      {
        if(atag[i].href.indexOf(res[j])>-1)
        {
          atag[i].href = atag[i].href.replace(res[j],repl[j]);
					break;
        }
      }
		}
	}
}