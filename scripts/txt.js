// ==UserScript==
// @include     *.txt
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function () {
   var oH1 = document.createElement("h1");
   var sTitle = location.pathname.match(/\/([^\/]*)\.txt$/i)[1];
   oH1.setAttribute("style",
      "text-align: center;" +
      "font-family: 楷体_GB2312;" +
      "font-weight: 600;" +
      "color: #990000;" +
      "margin: 20px auto;"
   );
   oH1.innerText = decodeURIComponent(sTitle);
   document.body.insertBefore(oH1, document.body.firstChild);

   document.body.setAttribute("style",
      "background-color: rgb(231,244,254);" +
      "font-size: 10.5pt;" +
      "line-height: 2em;"
   );

   document.getElementsByTagName("pre")[0].setAttribute("style",
      "white-space: pre-wrap;" +
      "margin: 20px auto;" +
      "width: 75%;"
   );
}, false);