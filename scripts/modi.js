/*************************************

	Mouseover DOM Inspector 
	v1.5
	last revision: 11.29.2004
	steve@slayeroffice.com

	Modified by Aaron Barker (v1.5)
	 - Added ability to stop on an element and look at details of it's parents
	 - Modified existing code to be reused for the above
	 - Bugfix from v1
	 - added code to flip the data container to the left of the mouse if it's left+offsetWidth exceeds the browsers width
	   and vice versa for the top. (steve@slayeroffice)

	Modified by steve@slayeroffice (v1.4)
	- removed all instances of object creation with innerHTML to allow application/xhtml+xml use

	Modified by Aaron Barker (v1.3)
	 - Added element height/width, X/Y and parent structure
	 - http://www.zelph.com
	
	
*************************************/

function modiEnable()
{
	d=document;
	da=d.getElementsByTagName("*");
	dg=d.getElementById;
	d.onmousemove=cm;
	dci=1;
	d.onkeydown=ck;
	var ob;
	var useBorder=1;

	for(i=0;i<da.length;i++){
		if(da[i].tagName!="HTML"&&da[i].tagName!="BODY"&&da[i].tagName!="!"){
			da[i].onmouseover=si;
			da[i].onmouseout=hi;
		}
	}
	css = d.body.appendChild(d.createElement("link"));
	css.id = "modiStyleSheet";
	css.rel="stylesheet";
	css.href="http://slayeroffice.com/tools/modi/modi.css";
	css.type="text/css";

	m=d.body.appendChild(d.createElement("div"));
	m.id="mData";
	dm=m;


	var activeObj=null; var editObj=null; var txtFocus=0;

	var htmlView = d.body.appendChild(d.createElement("div"));
	htmlView.style.display="none";
	htmlView.id="hView";


	function cm(e){
		x=d.all?window.event.clientX+returnScrollDimensions(0):e.clientX;
		y=d.all?window.event.clientY+returnScrollDimensions(1):e.pageY;

		if(x+dm.offsetWidth > d.body.offsetWidth) {
			dm.style.left= (x - dm.offsetWidth)+"px";
		} else {
			dm.style.left=(x+15)+"px";
		}

		yOffset1 = d.body.scrollTop;
		yOffset2 = d.documentElement.scrollTop;
		if(yOffset1) {
			yOffset = yOffset1;
		} else if (yOffset2) {
			yOffset = yOffset2;
		} else {
			yOffset = 0;
		}
		if(y-dm.offsetHeight<=0 || (y-dm.offsetHeight)<yOffset) {
			dm.style.top=(y+15)+"px";
		} else {
			dm.style.top = (y-dm.offsetHeight) + "px";
		}

	}

	function ck(e){
		k=document.all?window.event.keyCode:e.keyCode;
		if(k==27) {
			// start new in v1.5
			if(walkParentOn){
				hideWalkParents();
				walkParentOn = false;
				activeObj.style.backgroundColor=ob;
				d.onmousemove=cm;
				for(i=0;i<da.length;i++){
					if(da[i].tagName!="HTML" && da[i].tagName!="BODY" && da[i].tagName!="!" && da[i].id!="mData"){
						da[i].onmouseover=si;
						da[i].onmouseout=hi;
					}
				}
			// end new in v1.5
			} else {
				if(htmlView.style.display == "none") {
					activeObj.style.backgroundColor=ob;
					d.body.removeChild(document.getElementById("mData"));
					d.body.removeChild(document.getElementById("modiStyleSheet"));
					d.body.removeChild(htmlView);
					d.onmousemove="";
					d.onkeypress="";
					d.onkeydown=""; // bugfix from v1
					for(z=0;z<da.length;z++){ 
						da[z].onmouseover=null;
						da[z].onmouseout=null;
					}
					clearWalkParents();
				} else {
					txtFocus=0;
					htmlView.style.display="none";
				}
			}
		}  else if(k==66) {
			if(txtFocus)return;
			if(useBorder)if(activeObj)activeObj.style.backgroundColor = ob;
			useBorder=useBorder?0:1;
		} else if (k == 86 || k == 83) {
			if(txtFocus)return;
			editObj=activeObj;
			showInnerHTML();
		}
		// start new in v3
		else if (k == 38) {
			d.onmousemove=null;
			walkParentOn = true;
			for(z=0;z<da.length;z++){ 
				da[z].onmouseover=null;
				da[z].onmouseout=null;
			}
			walkParents();
		}
		// end new in v3
	}

	function showInnerHTML() {
		innerHTML = editObj.innerHTML;

		htmlView.style.top = y+"px";
		htmlView.style.left = x+"px";
		htmlView.innerHTML = "<textarea onfocus=\"txtFocus=1;\" onblur=\"txtFocus=0;\" id=\"zHTML\" style=\"font:9px verdana;\" rows=\"20\" cols=\"40\">" + innerHTML + "</textarea>";
		htmlView.innerHTML += "<br /><span>innerHTML for " + activeObj.tagName + "| <a href=\"javascript:applyChange();\">Apply Changes</a></span>";
		htmlView.style.display="block";
	}

	function applyChange() {
		editObj.innerHTML = d.getElementById("zHTML").value;
	}

	function returnScrollDimensions(which) {
		if(which) {
			if(document.body.scrollTop != 0)return document.body.scrollTop;
			if(document.documentElement.scrollTop != 0)return document.documentElement.scrollTop;
		} else {
			if(document.body.scrollLeft != 0)return document.body.scrollTop;
			if(document.documentElement.scrollLeft != 0)return document.documentElement.scrollLeft;
		}
		return 0;
	}

	function hi(){
		try {
			if(useBorder)this.style.backgroundColor=ob;
		} catch(err) { }
		dci=1;
	}

	function si(){
		if(!dci)return;
		ta=this.attributes;
		activeObj=this;
		ob=this.style.backgroundColor;
		dci=0;

		if(d.getElementById("so_infoDiv")) dm.removeChild(d.getElementById("so_infoDiv"));
		infoDiv = dm.appendChild(d.createElement("div"));
		infoDiv.id = "so_infoDiv";
		
		writeElemInfo(infoDiv,this); // v1.5 update
		
		infoDiv.appendChild(d.createElement("br"));
		infoDiv.appendChild(d.createElement("br"));

		str = infoDiv.appendChild(d.createElement("strong"));
		str.appendChild(d.createTextNode("Parent Structure:"));

		infoDiv.appendChild(d.createElement("br"));
		getParents(this,infoDiv);
		if(useBorder)this.style.backgroundColor="#C0C0C0";
		hiNode = this; // v3 addition
	}

	function removeData(obj) {
		for(i=0;i<obj.childNodes.length;i++) {
			obj.removeChild(obj.childNodes[i]);
		}
	}

	curNumParents = 0; // v3 update
	function getParents(curNode,dataContainer){
		parents = parents2 = thisOne = "";
		spaces = 0;
		x= 0;
		parents = new Array();
		while(curNode.parentNode){
			parents[x] = d.createElement("div");
			parents[x].appendChild(d.createTextNode("<" + curNode.tagName.toLowerCase() ));
			if(curNode.id){
				str = parents[x].appendChild(d.createElement("strong"));
				str.style.color = "blue";
				str.appendChild(d.createTextNode(" id"));
				parents[x].appendChild(d.createTextNode("=\""+curNode.id+"\""));
			}
			if(curNode.className){
				str = parents[x].appendChild(d.createElement("strong"));
				str.style.color = "red";
				str.appendChild(d.createTextNode(" class"));
				parents[x].appendChild(d.createTextNode("=\""+curNode.className+"\""));
			}
			parents[x].appendChild(d.createTextNode(">"));
			curNode = curNode.parentNode;
			x++;
		}
		// v3 update
		curNumParents = parents.length;
		for(x=parents.length-1; x>0; x--){
			nData = dataContainer.appendChild(parents[x]);
			nData.style.marginLeft = spaces+"px";
			nData.id = "modiParent"+x;
			spaces += 4;
		}
		// end v3 update
	}

	function findPosX(obj){
		var curleft = 0;
		if (obj.offsetParent){
			while (obj.offsetParent){
				curleft += obj.offsetLeft
				obj = obj.offsetParent;
			}
		}
		return curleft;
	}

	function findPosY(obj){
		var curtop = 0;
		if (obj.offsetParent){
			while (obj.offsetParent){
				curtop += obj.offsetTop
				obj = obj.offsetParent;
			}
		}
		return curtop;
	}

	// Aaron's v1.5 Additions
	walkParentOn = false;

	function writeElemInfo(writeIn,writeAbout){ // reuse element info code
		writeIn.appendChild(d.createTextNode("Element Type: "));
		b = writeIn.appendChild(d.createElement("b"));
		b.appendChild(d.createTextNode("<"+writeAbout.tagName+">"));
		writeIn.appendChild(d.createElement("br"));
		
		for(i=0;i<ta.length;i++) {
			if(ta[i].specified && (ta[i].value!="" && ta[i].value!="null")) {
				b = writeIn.appendChild(d.createElement("b"));
				b.appendChild(d.createTextNode(ta[i].name));
				writeIn.appendChild(d.createTextNode("=\""+ta[i].value+"\""));
				writeIn.appendChild(d.createElement("br"));
			}
		}
		writeIn.appendChild(d.createTextNode("Height: "));
		str = writeIn.appendChild(d.createElement("strong"));
		str.appendChild(d.createTextNode(writeAbout.offsetHeight+"px"));

		writeIn.appendChild(d.createElement("br"));

		writeIn.appendChild(d.createTextNode("Width: "));
		str = writeIn.appendChild(d.createElement("strong"));
		str.appendChild(d.createTextNode(writeAbout.offsetWidth+"px"));

		writeIn.appendChild(d.createElement("br"));

		writeIn.appendChild(d.createTextNode("X,Y: "));
		str = writeIn.appendChild(d.createElement("strong"));
		str.appendChild(d.createTextNode(findPosX(writeAbout)+"px, " + findPosY(writeAbout) + "px"));
	}

	m2=d.body.appendChild(d.createElement("div"));
	m2.id="mData2";
	dm2=d.getElementById("mData2");
	dms2=dm2.style;
	dms2.border="2px solid #330099"
	dms2.font="10px verdana,sans seriff"
	dms2.position="absolute";
	dms2.color="#000000";
	dms2.padding="4px";
	dms2.backgroundColor="#CCCCFF";
	dms2.textAlign="left";
	dms2.zIndex = "10001";/**/
	m2.style.display = "none";

	hiNode = "";
	dd2 = "";
	function si2(){
		if(dd2 != "") activeObj2.style.backgroundColor=ob2;
		
		curNode = hiNode;
		parentNum = this.id.replace("modiParent",""); // get how many parents up it is

		for(x=0; x<parentNum; x++){ // get to that parent
			curNode = curNode.parentNode;
		}
		curParent = curNode;
		
		dms2.top = findPosY(this)+"px";
		dms2.left= (findPosX(this) + this.offsetWidth)+"px";
		
		ta=curParent.attributes;
		activeObj2=curParent;
		ob2=curParent.style.backgroundColor;
		dci=0;
		
		if(d.getElementById("so_infoDiv2")) dm2.removeChild(d.getElementById("so_infoDiv2"));
		infoDiv2 = dm2.appendChild(d.createElement("div"));
		infoDiv2.id = "so_infoDiv2";
		
		writeElemInfo(infoDiv2,activeObj2);
		
		dms2.display = "block";
		if(useBorder)curParent.style.backgroundColor="#eee";
	}

	function walkParents(){
		for(x=curNumParents-1; x>0; x--){
			curParent2 = d.getElementById('modiParent'+x);
			curParent2.onmouseover=si2;
			curParent2.onmouseout=hideWalkParents;
		}
		walkParentOn = true;
	}

	function hideWalkParents(){
		// hide 2nd box
		try {
			activeObj2.style.backgroundColor=ob2;
			document.getElementById("mData2").style.display = "none";
		} catch(err) { }
		//walkParentOn = false;
	}

	function clearWalkParents(){
		// remove 2nd box
		try {
			activeObj2.style.backgroundColor=ob2;
			d.body.removeChild(document.getElementById("mData2"));
			walkParentOn = false;
		} catch(err) { }
	}
}