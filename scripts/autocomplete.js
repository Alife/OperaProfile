// ==UserScript==
// @name Input autocomplete for Opera
// @version 1.3
// @depends Opera (>= 10.5)
// @author Molnar Daniel, modified by Crio
// @contact adrenalin3 () gmail / criobot () gmail
// @include *
// ==/UserScript==

/*
 * disable it from 12.12. this will make opera busy but for what???
 */

/*
 * version 1.1: autocomplete="off" support.
 *
 * version 1.2 /Crio/:
 * - Base64 removed, now non-ASCII characters can be used (separated with \1).
 * - Added option to execute on specific domains only;
 *
 * version 1.3 /Crio/:
 * - Added different style to matched text in result list.
 *
 */

(function(opera) {

   // Domain blocking
   /*
   var Domains = ['zamunda.net', 'arenabg.com', 'isohunt.com', 'thepiratebay.org', 'purebasic.fr', 'softvisia.com'];

   var ContinueExecution = false;
   for(var Domain = 0; Domain < Domains.length; Domain++){
      if (window.location.host.indexOf(Domains[Domain]) > -1) {
         ContinueExecution = true;
      }
   }

   if(!ContinueExecution)
      return;
   // End Domain blocking
   */

   var PREFIX = 'autocomplete_';


   function findPos(obj) {
      var curleft = curtop = 0;
      if (obj.offsetParent) {
         curleft = obj.offsetLeft
         curtop = obj.offsetTop
         while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
         }
      }
      return [curleft,curtop];
   }


   function $(elem) {
      return document.getElementById(elem);
   }


   function saveData(name, source) {
      var data = localStorage.getItem(PREFIX + name);
      if (data) {
         var Array = [];
         var splitedData = data.split("\1");
         for (var i = 0; i < splitedData.length; i++) {
            Array.push(splitedData[i])
         }
         if (Array.indexOf(source) == -1) {
            Array.push(source);
            Array.sort();
            var value = Array.join("\1");
         } else {
            return;
         }
      } else {
         var value = source;
      }
      localStorage.setItem(PREFIX + name, value);
   }


   function getData(e) {
      /*var data = localStorage.getItem(PREFIX + e.target.name);
      if (data) {
         var results = [];
         var splitedData = data.split("\1");
         for (var i = 0; i < splitedData.length; i++) {
            results.push(splitedData[i]);
         }
         if (results.length) {
            showResults(e, results);
            return true;
         }
      }
      return false;*/
      search(e);
   }


   function deleteData(e, value) {
      var data = localStorage.getItem(PREFIX + e.target.name);
      if (data) {
         var splitedData = data.split("\1");
         splitedData.splice(splitedData.indexOf(value), 1);
         localStorage.setItem(PREFIX + e.target.name, splitedData.join("\1"));
      }
   }


   function search(e) {
      var data = localStorage.getItem(PREFIX + e.target.name);
      if (data) {
         var results = [];

         var splitedData = data.split("\1");

         for (var i = 0; i < splitedData.length; i++) {
            if (splitedData[i].match(new RegExp(e.target.value, "i"))) {
               results.push('<span onmouseover="this.parentNode.className=\'selected\'">' + splitedData[i].replace(new RegExp('(' + e.target.value + ')', "i"), '<span onmouseover="this.parentNode.className=\'selected\'">$1</span>') + '</strong>');
            }
         }
         if (results.length) {
            showResults(e, results);
         } else if ($('autocomplete')) {
            document.body.removeChild($('autocomplete'));
         }
      }
   }


   function showResults(e, results) {
      if ($('autocomplete')) {
         document.body.removeChild($('autocomplete'));
      }

      selected = -1;

      pos = findPos(e.target);
      var div = document.createElement('div');
      div.style.top = pos[1] + e.target.offsetHeight + 'px';
      div.style.left = pos[0] + 'px';
      div.style.width = e.target.offsetWidth + 'px';
      div.id = 'autocomplete';
      document.body.appendChild(div);

      for (var i = 0; i < results.length; i++) {
         var result = results[i];
         var resultLength = checkStringWidth(result);

         var inner = document.createElement('div');
         inner.addEventListener('mouseover', function (e) {
            var autocomplete = $('autocomplete');

            for (var i = 0; i < autocomplete.getElementsByTagName("div").length; i++) {
               if (autocomplete.getElementsByTagName("div")[i] == e.target) {
                  autocomplete.getElementsByTagName("div")[i].className = 'selected';
                  selected = i;
               } else {
                  autocomplete.getElementsByTagName("div")[i].className = '';
               }
            }
         }, true);
         inner.style.height = '15px';
         inner.style.display = 'block';
         inner.style.padding = '1px 1px 1px 5px';
         if (resultLength > e.target.offsetWidth) {
            divWidth = e.target.offsetWidth;
            // we found a scrollbar
            if ($('autocomplete').scrollHeight > $('autocomplete').clientHeight) {
               divWidth = e.target.offsetWidth - 34;
            }

            inner.title = result;
            while (resultLength > divWidth) {
               result = result.substr(0, result.length - 1);
               resultLength = checkStringWidth(result + '...');
            }
            result += '...';
         }
         inner.innerHTML = result;
         inner.addEventListener("click", function(a) {
            if (a.target.title > '') {
               e.target.value = a.target.title;
            } else {
               e.target.value = a.target.innerText;
            }
            e.target.focus();
         }, true);

         $('autocomplete').appendChild(inner);
      }
      return true;
   }


   function checkStringWidth(str) {
      var helperDiv = document.createElement('div');
      helperDiv.id = 'helperDiv';
      helperDiv.innerHTML = str;
      document.body.appendChild(helperDiv);
      var width = $('helperDiv').clientWidth + 1;
      document.body.removeChild($('helperDiv'));
      return width;
   }

   var selected = -1;

   function selectItem(e, type) {
      var autocomplete = $('autocomplete');
      if (!autocomplete) {
         if (!getData(e)) {
            return false;
         }
      }

      var num = (type == 'next') ? selected + 1 : selected - 1;
      if (num == -2) {
         num = autocomplete.getElementsByTagName("div").length - 1;
      } else if (num == autocomplete.getElementsByTagName("div").length) {
         num = -1;
      }

      for (var i = 0; i < autocomplete.getElementsByTagName("div").length; i++) {
         if (i == num) {
            var row = autocomplete.getElementsByTagName("div")[num];
            if (row.offsetTop < autocomplete.scrollTop) {
               autocomplete.scrollTop = row.offsetTop;
            } else {
               if (row.offsetTop + row.offsetHeight > autocomplete.scrollTop + autocomplete.offsetHeight) {
                  autocomplete.scrollTop = row.offsetTop + row.offsetHeight - autocomplete.offsetHeight;
               }
            }
         }
         autocomplete.getElementsByTagName("div")[i].className = ((i == num) ? 'selected' : '');
      }
      selected = num;
   }


   function getSelectedItem() {
      var autocomplete = $('autocomplete');
      if (autocomplete) {
         for (var i = 0; i < autocomplete.getElementsByTagName("div").length; i++) {
            if (autocomplete.getElementsByTagName("div")[i].className == 'selected') {
               return autocomplete.getElementsByTagName("div")[i];
            }
         }
      }
      return false;
   }


   window.addEventListener('submit', function(e) {
      inputArray = e.target.getElementsByTagName('input');
      for (var index = 0; index < inputArray.length; index++) {
         if ((inputArray[index].type == 'text'||inputArray[index].type == 'password') 
				&& inputArray[index].value > '') {
            saveData(inputArray[index].name, inputArray[index].value);
         }
      }
   }, true);

   window.addEventListener('click', function(e) {
      if (e.target.tagName.toLowerCase() != 'input' && $('autocomplete')) {
         document.body.removeChild($('autocomplete'));
      }
   }, true);

   window.addEventListener('DOMContentLoaded', function(e) {
	if(document.body.innerHTML==""||document.body.innerText=="")return;
	if(document.querySelectorAll("input").length==0)return;
      var style = document.createElement('style');
      style.innerHTML = '#autocomplete {font-family: arial,sans-serif; font-size: 13px; font-weight: normal; line-height: normal; color: #000; text-align: left; position: absolute; overflow: auto; max-height: 90px; background-color: #fff; border: solid 1px; z-index: 100;} div#autocomplete div.selected {background-color: #627aad; color: #fff;} #helperDiv {position: absolute; visibility: hidden; width: auto;}';
      if(document.getElementsByTagName('head').length>0)document.getElementsByTagName('head')[0].appendChild(style);
      var inputs = document.getElementsByTagName("input");
      for (var index = 0; index < inputs.length; index++) {
         if (inputs[index].type != 'text' 
			|| inputs[index].type != 'password'	) {		
			//|| inputs[index].autocomplete == 'off') {
            continue;
         }
         inputs[index].addEventListener('click', function(e) {
            getData(e);
         }, true);
         inputs[index].addEventListener('keypress', function(e) {
            switch (e.keyCode) {
               case 38: // up
                  selectItem(e, 'prev');
                  e.preventDefault();
                  break;
               case 40: // down
                  selectItem(e, 'next');
                  e.preventDefault();
                  break;
               case 37: // left arrow
               case 39: // right arrow
                  if ($('autocomplete') && selected > -1) {
                     if (getSelectedItem().title > '') {
                        e.target.value = getSelectedItem().title;
                     } else {
                        e.target.value = getSelectedItem().innerText;
                     }
                     e.target.focus();
                     document.body.removeChild($('autocomplete'));
                     e.preventDefault();
                  }
                  break;
               case 13: // enter
                  if ($('autocomplete') && selected > -1) {
                     if (getSelectedItem().title > '') {
                        e.target.value = getSelectedItem().title;
                     } else {
                        e.target.value = getSelectedItem().innerText;
                     }
                     e.target.focus();
                     document.body.removeChild($('autocomplete'));
                     e.preventDefault();
                  } else if (e.target.value > '') {
                     saveData(e.target.name, e.target.value);
                  }
                  break;
               case 9: // tab
               case 27: // esc
                  if ($('autocomplete')) {
                     document.body.removeChild($('autocomplete'));
                     if (e.keyCode == 27) {
                        e.preventDefault();
                     }
                  }
                  break;
               case 46: //delete
                  if (getSelectedItem().title > '') {
                     var value = getSelectedItem().title;
                  } else {
                     var value = getSelectedItem().innerText;
                  }
                  deleteData(e, value);
                  break;
            }
         }, true);
         inputs[index].addEventListener("keyup", function(e) {
            if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 27) {
               if (e.target.value.trim != "") {
                  search(e);
               }else{
                  getData(e);
               }
            }
         }, true);
      }
   }, false);

})(window.opera);