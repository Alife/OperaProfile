//修正发改委及其子站页面显示效果
// ==UserScript==
// @include      http://*.ndrc.gov.cn/*
// ==/UserScript==

window.opera.addEventListener("BeforeScript", function (oEvent) {
   if (oEvent.element.src.indexOf("xml_page_func") !== -1) {
     var oElement = oEvent.element;
     oElement.text = oElement.text.replace("DocumentsDataSrc.XMLDocument.selectNodes(sPath);", "document.selectNodes(sPath);").
                     replace('document.createElement("<tr style=\\"display=\'\'\\" >");', 'document.createElement("tr");').
                     replace(/objContent1\.insertCell\(\);/g, "objContent1.insertCell(0);").
                     replace("var sFieldName = arAllField[j].FieldName;", "var sFieldName = arAllField[j].getAttribute('FieldName');").
                     replace("arAllField[j].href = sValue;", "arAllField[j].href = xmlNode.selectSingleNode('L').firstChild.nodeValue.replace('[CDATA[','').replace(']]','');arAllField[j].text = xmlNode.selectSingleNode('T').firstChild.nodeValue.replace('[CDATA[','').replace(']]','');//console.log(xmlNode.selectSingleNode('T').firstChild.nodeValue.replace('[CDATA[','').replace(']]',''));").
                     replace("xmlNodeTemp.text", "xmlNodeTemp.textContent");
     window.opera.removeEventListener("BeforeScript", arguments.callee, false);
   }
}, false);