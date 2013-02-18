var lingoes_plugin_x = 0;
var lingoes_plugin_y = 0;

function lingoes_plugin_update_pos(e)
{
	lingoes_plugin_x = e.clientX;
	lingoes_plugin_y = e.clientY;
	lingoes_plugin_object.setToCurObject();
	//console.log("x=%d, y=%d\n", lingoes_plugin_x, lingoes_plugin_y);
}

function lingoes_plugin_get_capture_text()
{
	//console.log("x=%d, y=%d\n", lingoes_plugin_x, lingoes_plugin_y);
	var x = lingoes_plugin_x;
	var y = lingoes_plugin_y;
	var a = document.caretRangeFromPoint(x, y);

	if(a)
	{
		var so=a.startOffset;
		var eo=a.endOffset;
		var g=a.cloneRange();
		var maxchar = 100;
		var pos = so;
		
		// 防止TEXTAREA,INPUT,SELECT下无效
		if(!a.startContainer.data)
			return "";
			
		//console.log(a.startContainer.data);
		if(so<=0 || eo>=a.endContainer.data.length)
			return "";
		
		var n1 = 0;
		if(a.startContainer.data)
		{
			for(;so>0 && n1<maxchar;)
			{
				so--;
				n1++;
			}
			g.setStart(a.startContainer, so);
		}

		pos -= (so+1);
		//console.log("pos=%d, n=%d, d=%n\n", pos, n1, d);

		var n2 = 0;
		if(a.endContainer.data)
		{
			for(;eo<a.endContainer.data.length && n2<maxchar;)
			{
				eo++;
				n2++;
			}
			g.setEnd(a.endContainer, eo);
		}

		if(n1 > 0 || n2 > 0)
		{	
			var str = g.toString();
			if(str.length >= 0)
			{
				//console.log("pos=%d, str=%s\n", pos, str);
				return pos + ":" + str;
			}
		}
	}

	return "";
}

function lingoes_plusin_get_select_text()
{
  var str = String(window.getSelection());
  if(str)
  {
	  str = str.replace(/^\s*/, "").replace(/\s*$/, "");
	 
	  if(str != "")
	  	return str;
	}
  
  return "";
}

//lingoes_plugin_object.setJSGetTextFunc(lingoes_plugin_get_capture_text, lingoes_plusin_get_select_text);
document.addEventListener("mousemove", lingoes_plugin_update_pos, true);
document.addEventListener("mousemove", function（）{
	var lingoes_plugin_elediv  = window.document.createElement("div");
lingoes_plugin_elediv.innerHTML = "<embed id='lingoes_plugin_object' type='application/lingoes-npruntime-capture-word-plugin' hidden='true' width='0' height='0'>";
window.document.body.appendChild(lingoes_plugin_elediv);
}, true);
