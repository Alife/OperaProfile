// link alert by TarquinWJ 
// version 1.1.9
// see http://www.howtocreate.co.uk/operaStuff/userJavaScript.html for details
// ==UserScript==
// @exclude http://www.frontbase.com/*
// ==/UserScript==

opera.addEventListener('AfterEvent.load',function (e) {
	if( !( e.event.target instanceof Document ) ) { return; }
	e.target.removeEventListener('AfterEvent.load',arguments.callee,false);
	if( !document.body || document.body.getElementsByTagName('*').length == 1 ) { return; }
	var hed = document.getElementsByTagName('head')[0];
	if( !hed ) { var oTitle = document.getElementsByTagName('title')[0]; if( !oTitle ) { return; } }

/*********************
Configure options here
*********************/

//true = option is enabled, false = option is disabled

//show icons only when the link is hovered, instead of at the end of the link -
//this option is recommended, as it helps to avoid conflicts with sites
var showOnHover = true;

//do not add the icon if the link already contains an image
var notIfExistingImage = true;

//do not add the icon if the link does not contain any text
var notWithoutText = true;

//use text only instead of images
var useTextOnly = false;

//hide icons after this number of seconds (0 for never) - only used when hovering
var hideIconsAfter = 0;

//Opera 9tp1 sometimes makes the page content jump when hovering links - this script has a workaround, but it might
//cause some sites to look different (it should not have a bad effect, but please report pages where this causes
//problems; http://my.opera.com/userjs/forums/) - you can disable it here to check if this is what causes a problem -
//this fix will only be applied in the Opera 9tp1 release, and only on pages where it is needed
var addCenterTagFix = true;

/****************************************
Configure file extensions and images here
****************************************/

var MatchList = [

	//comment out lines you do not want
//	['alt text','href pattern','image src'],

	/*** Protocols first - try to keep this list as short as possible ***/

	//JavaScript links
	['Script','javascript:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwAAAAAzJ3zzAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH1QkJCjAsHjbVAQAAAHNJREFUeNq1k9EJwCAMRHM1Y9T9B7NjCPajtoQmsaL2IBAiPsh5EmmVWl3C%2B3KuVxnmudJGk%2FodIP0w%2ByYgl6tub6yeBXF4BUlc54EEev2SV4AMj6eA7yQ2IQFER0pqvsf4rADGvIlDEFYD2HHs%2Fo1enj2djNcx5SNS9nQAAAAASUVORK5CYII%3D'],
	//Email links
	['Mail','mailto:*,sms:*,smsto:*,mmsto:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADRJREFUKFNjYCAD%2FCcIGBj%2BgxEUEFQPUU0NDTCD4CaCGMiAaCfBNKFroL0NBIOLXD%2BQFNcA58NKxEWp89MAAAAASUVORK5CYII%3D'],
	//Streaming links
	['Stream','mms:*,rtsp:*,pnm:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAvElEQVR4nJ2TwbHEIAxDXYpLUSkuRaXkRB06Uw0d6B%2FIJiF7%2BewwGtDYfoAZIiK8K8c9IiJs21vzEwBwa3eAK6BKzoQBukqukgE6E4v%2FFFdpBZA3gJTJWfD28cj5AgDw7lUutT6uo%2F3S0LWJJ%2BTfmvk3DZQj4QBnsDTXiW9PzfyFeOgKxnGKZ9HTJ27%2FHJCcgPOQoamgnMXFfwDQC9D6cAKm5NaHWx8TVlx8YgJaHyvgpya%2BPsb%2BM74Bu%2FoDfC636egQFQ8AAAAASUVORK5CYII%3D'],
	//IRC
	['IRC','irc:*,ircs:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwD%2FAP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QoIEAkqF3zGnQAAAzdJREFUeNpNkltoXGUUhb%2F%2FXOfMmU7mormYNE2a9JJEeiHFh9BAiQ9FGosKFppQUypFiCJNoShY1BdRAkEfDGqtUi8PbSkSFYSW2EaS0rRWkfSSqKE1oSZNrZNMZjIzmTP%2F+X2IU7pgPe2911osNkoplFLsixjBfRFj2+eHDw7kMmlfKaUufPVm4ccTdenJkeqfpwYivRffqdhc3C9S43%2FUbq532g7WvtLQ2tBuO64AGL3j6F+evuVaIbkt3hI90tShjUydrX7vVE%2FUKd4ZAF%2F0tNvth8w+013umpu8WZzR399PLmVwNJvFMP9BaDIUrgm85qRLdOAIsJJg7RNzr6%2Fdmu8qXb0Fy%2FqL2T%2FHAHi5u5u9z7YgCwso4WHGfM70xrh%2Fv76jaKLXy2%2FWb2pJnIhUbLcDVh26Pc%2FExZO40U3s3L2HSvsHVsXHWZwXvN9ZRljVEI+WHG14puMygPFYTbIzXGasssL%2FonImpVUSXU8xM9HO32MJQnGfs18LRk9HaFpXQTxSctu2jP4HHYSjqSeNQBWaGkQEWnG0NOXOItHyNNcu+XzULUjO2qxbEyUei2Db5oFdxwbkAwFT5BoVAvw8aIMYZj1LyRTH38hx%2FiQIoXBdgROwsE3jxtOffjvEQ9DIK2Teo1AAfEDd5lRviuEzOpZlEAvoVLsGpYaHm7gzOtQkrIcFxNWPA8Ord0a3O+497IBE0wRSwu9X4Ps+k%2FKJPKaAuANBQMBvwAs7bqhrAFpySpwvzC+SzQRYWoR0ErJLGlXrFd3HPNa8KxiOwa9LkFCQhy15uDrUJBoB9K3R4MzGSGa%2FqPRsX4DvCaSvkAXwfSithB27YDYIl4chLcFT6PgsN7769jnt0HfJP8Yv2H1qTKGWwfdXftwvgC9B5gAPnmqDng8Edx+N8ZMXGpzM8xmAUErxUnNJ4LmypQ8bO+WLZjMgQQnwcqALEGngLqhbIGc1JrMtI22fDLey0gkGEIzZ2iOHN7D%2F+Vq%2FJ7SbELVQyIAQIKZBjIN3T8jriyWXuoZSbyUy8iaQEEAccAEH0OrC+uMHNqrmDbbf1mjRYElEymB6NC2uH58WE7%2FM+FeABWAOWPgPZo5Lm3GH7XwAAAAASUVORK5CYII%3D'],
	//News
	['News','news:*,nntp:*,feed:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEX9%2FdTfmqMjbs2xrHEfICH%2F%2F%2FDO0pRsbGvOzrafqKvg4HCztIXd3c0jm%2Buqqlb9%2FbYikR5VVVEcXBiYmJtpaSvE7Oz%2Bza5ra1bo7IUi5iIaQXeUlVtKwyNQa0a4vaAAAAB90ysKAAAAIHRSTlP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FAFxcG%2B0AAAChSURBVCgVLc9ZEoQgDATQyCoim4jjNnr%2FW04Shh%2FoV01B4KWlaPHpBY5CBCE6ISgRQmtCtEYl4Hwc2bVbZhSEEPKR%2FWe57ptABWwsj9bmu2SsAN4Q55OGQQNSh9OMcdqYisLGaaLTfgemC6HCun7MfJm0bVDwlTRFGaF6VyEVgjLOUrro6wzFKvqpskR13DH%2FZyHak8XMwNPap5Q%2BC0tH2n5HIg%2BWYaSufgAAAABJRU5ErkJggg%3D%3D'],
	//Opera URLs
	['Opera','opera:*,about:*','data:image\/gif;base64,R0lGODdhEAAQAPf%2FAPjBvvGyrOyhmfycm%2FCWlO6dmueDgvZ7evF2ce1uZ+liYuVaWt52dddvYNdlYdlrX91MSs1PT8NPR8dDRNg+P9U7PM46O8wyM4tAPL4vML8lJrcoKa4nKbMZG7IXGa8YGpoiI4I5N4kfIZ0bHZMdH3t7e2MnKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACcALAAAAAAQABAABwiEAE8IHEiwoEGBJkBo8OChwkGEHByeMDFCYkGKFgia6EDBIIkICzQ2vEigwAGRIweaYADgpEqGFidKMOASIcwTJXKa2DCBQomXGRTkRPjBg8+hJiQ4QJDzpwmGHZuaaCAgQdOfIlLmDBFggMCrFC8MLIHhgYKxUkeIlQnBYFqGHtY+nBsQADs%3D'],
	//eD2k
	['eD2k','ed2k:*','data:image\/gif;base64,R0lGODdhEAAQAPcAAP%2F%2F%2F2QpCdOLS9yjbNGISc6CQK5iJ8d2MbdpKuvJmeS4htOOUppVInc4D+GvfNeZWoZGGo5KGtSNTq5jJ5VPHbhrLHk5EJtXJKZdJMZ1MF0tDt6qfe3PtbVvNsBxL9ifbtzW0QAAAI5NHkUxKjI3PnAyDs+HSvbn2pyWkUFAQadgKtS1leXc0vLy8b29tpVOHdyiXNeUU8p7ONSSWcJ3OcaDOM2ugGtsbxcWFLOzsKtgJtSOT+%2FVp+GxfrRoLK1iKL59P7a2sKqqp6Cgn+Pj4M2BP9maYduga71vLrZxOdTNwunp5vf39vn5+e7u7G4xDLVoKticR8d3MbpsLKFYIbaLZ8nCudzc2unp5+%2Fv7ufn5aVcJaZdJZxUIHxNLaCgnsrKxmRna8zMx9%2Ff24eIiZdRHoM%2FFGgrCWUpCVctFj8zMG1wcpeXl7Ozsk5SV5FMG8N6MeScP9SMOKxjKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAHQALAAAAAAQABAABwjhAOkIDEBwIMGDAQTSCSAgIcEBBAoUMJBw4AEEBBMoWFCAQUGFARA0KODgAQEIH0EGiFBAQoEJFRXKDEChwoQJFi7EnBkAQ4UMGjZw6LATZAUPGT4AABFCRIARJEgMLHGgwAETJ1CkULGCRQsXUgO8kAAjhgwTM2jUsHEDR4scJALo2MGjhwQZPn4ACSJkSAsicSkUMXLkLpIfSZQsYdLESdwnUIoUiSJlCpUqVq5gyaIlroUAW7Zw2dLFyxcwYcSMIUPiSYQyZs6gSaOGxBo2bdxEpfPkDZw4cuagERh1t8CAADs%3D'],
	//dchub
	['dchub','dchub:*','data:image\/gif;base64,R0lGODdhEAAQAPf%2FAAAAADc3Nzk5OTw8PE5PR01NTVJSUlVVVXN4SmlpaXt7e3x8fICNHaSwQ7C6Xay3Z73HabvDc8TbEcrfGsngE8vhFszjFs7kGs7kHNDlIdHmJtToK9bpNtfoPtjqOsDMWcDNXs%2FeT83YZtjoR9ztS9nmVd%2FuVuLvcuPwb+TwauXxdoCAgIuLi42NjbK5jKWlpampqaysrLGxsbW1tbm5ub6+vs%2FTstLZqNbZtdvfud3ljtjhk+DqjePtmujwoe%2F2pu72qPH3scHBwcbGxsjIyM3NzdPT09TU1NnZ2d%2Ff3+DjxODh0ufo2OLi4ubm5unp6ezs7PHx8fb29vj4+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAABwi0AAEIHEiwoEEAMxLOODiQhhMoEKEgWWhQCBMdPJQgQeLESZGCM5aE+BEEBQ4hM4QcoSjwSIQKGGI2MLBiRQIaA2EcgTBBg08GAQQIXUHxRREbHVKUGIFA6FAYAl8IKZJDBJAfIAgUKGCABlQAMIoUcaHBA4cNDlq0oHHkK4AiRx5IqED3g9gjHwfOcHKDgwkTJHYc4chSoBApPVCo8NERipCDNKBImSJFChScDBHSoFE4c+aAADs%3D'],
	//magnet
	['Magnet','magnet:*','data:image\/gif;base64,R0lGODdhEAAQAPf%2FAAAAABgYGCYmJi0tLTIyMjg4OD09PUFBQUZGRkhISFRUVFxcXGZWV3FbXHJcXWFhYWtra3hlZqQQD7USFLgSFb0TFr4UF6goJqotK6A4NqI9OqwzMbc6O4lbW415eq1UUrdmablnZ7FxcLh9fMEUF8YUGdQvNt8vN+EZIeUZIukaI+obJOImLuMoMOAvNeQuNe4nMO8qMvAuN%2FAyO%2FM1Pd5ES+BfZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAABwiSAAEIHEiwoEEACgwcNOghQYEBCwfOeOGggAEIEWOsWOHCQQAECzVuXMEBIoAFBWeMXDFhg8AHBgoMtDEyxYQMAmtEMCBAJgCRKyxoEOhCxQkGBkzC2JjCJQAWI00gUAjAxUgQT2tO6DAwRAqmX0dauFCQxEqmE8gWFGEh7Aqbag2KkGChhAUJGCIK%2FHBhw4iFAQEAOw%3D%3D'],
	//Jabber
	['Jabber','jabber:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAQCAYAAADAvYV%2BAAAAB3RJTUUH1wsMCik0lozmFgAAAAlwSFlzAAALEgAACxIB0t1%2B%2FAAAAARnQU1BAACxjwv8YQUAAAFsSURBVHjajZLPK0RRFMe%2F782UH8OKmaIsjZKVjNmhJlnZKbJlJ%2F8ACzaklOUUG8pGbMTM1GShNE0ySFYsZLK2sZkhP67Pu2Omaahx6%2FT9vnO%2B93vPPfc5OWlE0owjDYEdRnqD58EsuDkgXetnOYgLKhV3wUcERXgbGCUm4BsRacWqL6VMRmrVH4taO2Yn4Kx1Vp11IwU%2BMGyUYnXF3sJ9Hmh2%2FyP%2BktLAVEVskgqbfQUtr2kvJD0BfTZp0groXTuovDGFiYIzrrmymGTkU9orOb%2FIj%2FAZlsJzGV4sC08lP22s4xqvHGWOFLOYUNwcqtPjWamJsR0QKVrzebPsv6CfyqZjdXtIrofaLZPYSkkNtnjF%2FEjk6au3vGFJchHmiLHqizo4LID3ND%2FKUa%2F05t0jAR%2FmmRerxS7NJ6lOe%2BN07QvrnFwI8V3tvF2ftAaeIdw0pX8kCD6A%2Fl9i5jdJsQW3Vb6jRBcb3UFpu1b8DT9laUbOQ57nAAAAAElFTkSuQmCC'],
	//Phone or fax
	['Phone','tel:*,fax:*,wtai:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAQCAYAAAG3urXoAAAALHRFWHRDcmVhdGlvbiBUaW1lAE1vbiAxMiBOb3YgMjAwNyAxMDoxNzowOSAtMDAwMI8zPckAAAAHdElNRQfXCwwKGCkz1419AAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC%2FxhBQAAARRJREFUeNpjYIAAYxBhBuUwhDIBCRBm8AVibiDeBpPaAGOIAXEsEDPCBF4BsRxIkzRUVh4kWsqABMSQ2H5A%2FB%2BIV4C0%2BEAFXwDxMaihe2EqF0FVgoArsnFGDGiAGUoHAHEEEP8BYnGQgDeSos9IxoHBDqj%2F%2FWAC6kB8FVkFPxDfQuKLMEDDB2ROPMjfQMzDAiT%2BAfESIH4OxI%2BwOQ0FaACxOxCzoYknAPE3qPFzQAL%2BQMyKpsgAGub%2FofgpKOhBjtIB4t9QRSB%2BERCfB%2BKFUGcwQuMIFLcMLkgKu4H4LRBbY3GqC8wTUlDngIKxA4iFkBSxQsOehQHJ1H4kNy6ABp4KA1LCQQZeDAQAcjj%2BZIBE71tcigFLBy1WM1Mf8wAAAABJRU5ErkJggg%3D%3D'],

	/*** file extensions - try to keep this list short too, and put the most common ones at the top ***/

	//Known web files (to speed things up, try to keep it as high on the list as possible):
	['','data:text*,*.htm,*.html,*.php,*.asp,*.jsp,*.esp,*.pl,*.cgi,*.php3,*.xhtml,*.cfm,*.cfml,*.shtml,*.xht,*.xhtm,*.dml,*.stm,*\/',''],
	//Images:
	['Image','*.jpg,*.jpe,*.jpeg,*.gif,*.png,*.bmp,*.ico,*.svg,*.svgz,*.xbm,data:image*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA3UlEQVR42mNgoBAwMjAwMGzMYfhPjmb%2FKQyMLDAOj7IbSZo5VQMZGKZkMrAgC9oX7IKzTz%2F5Amc%2FvuLOIKuzE87%2FvKMMzmYiZNPjK%2B4MDAwMDK0nErHKYzUAZjtM86IvUjgNYcGmkRSA1wswf2tcvMfAwMDAUG0xH78LYGDiGic4Oz9kH8Opo%2FZYNWO4YOIaJwx%2FwvjIhuJ1Ac%2BThwwMDAwMX2TkGXiePITzkQ1J4jHBHQZfZOQxbHkizIxTjgmXC5BdguwivF5AdhocfGBgYOARRdC4DOBUDWQYEAAAv21Eaoaa5QMAAAAASUVORK5CYII%3D'],
	//Flash:
	['Flash','*.swf,*.aam,*.dcr,*.fla','data:image\/gif;base64,R0lGODlhEAAQAOYAAFtvgxJbgnuLmcLIzcfL0oGQnmR3iGJ2icHI1Ojr7pumsAMvUZmmsqq1xKi0w2l8j7zDyaavuVBlesjM0dvf5ImXpoqYpXaHl7a%2FzWp8jY%2BcqN7e5ODg5vHy9dzg5Kq1wezu8ePj593d3QI6XQQ2WR9QcN7i5snN1AIrR%2Fj5%2BuPm6gMzVe%2Fx883T2dvb4Vt4jwU4W%2Fb3%2BGh%2BkgMsTM%2FS2wY5W%2FDy9AQ1VwQ0V%2FT199ba4Ovt8MLL1c%2FT3MrQ1lxwhAs%2FYrC7xcTM1sfN12h%2FkwMuTtnd4tPV3f39%2FZCeqMbM17rCyWp7iQRIbOXo7AMyU%2Fb3%2BQMwUWuLoRU3VcjP2NfY393g5W5%2BjP7%2B%2Fs7S22%2BBku7u7gAmSZCcqNXX2tzc4unp6f%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAQABAAAAfegGCCYBAaGRISGRoQg4NeXQBaFQ0NFVoAXV6OBQcOCEYeFC0ODAcFmmBdB1QUTiAsPlxcARgHXWADAEJWO1BINlNNAQEbCAADCg86CSlhYUkjAVIbX1UPCgI8Jh1YzrMlQSdfXxgCBj0qMc5LXEAwOAnjSgYGRxw53jUkKwvxX0MGBGTJ8oUDAS43XjgLMQ6BAAUIBh58suCDvy8uGijIReAKiihFiIQhOI7GjwGpGDBZMEPGFpJftmi5BcZLAQYEtogYF1PmKUddtMR0tuXLTFSNJkSwcOGChQgTGgUCADs%3D'],
	//Movies:
	['Movie','*.mov,*.mpg,*.avi,*.wmv,*.mpe,*.mpeg,*.rm,*.ram,*.asf','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAvElEQVR4nJ2TwbHEIAxDXYpLUSkuRaXkRB06Uw0d6B%2FIJiF7%2BewwGtDYfoAZIiK8K8c9IiJs21vzEwBwa3eAK6BKzoQBukqukgE6E4v%2FFFdpBZA3gJTJWfD28cj5AgDw7lUutT6uo%2F3S0LWJJ%2BTfmvk3DZQj4QBnsDTXiW9PzfyFeOgKxnGKZ9HTJ27%2FHJCcgPOQoamgnMXFfwDQC9D6cAKm5NaHWx8TVlx8YgJaHyvgpya%2BPsb%2BM74Bu%2FoDfC636egQFQ8AAAAASUVORK5CYII%3D'],
	//Audio:
	['Audio','*.mp3,*.wav,*.wma,*.au,*.snd,*.ra,*.mid,*.au,*.m3u,*.asx,*.ogg','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAtUlEQVR4nI3SwQ3DMAgFUEZjFEb5o3CwOgfnTJN7D78HFxK7thohFEfKg4AslDHMQFWtNFPO32QIhaIK9hxRT2wLiCoIBCPiBlEQ6GmGnwKiCvJ9FiTJiCjg3ujelt1FFdUV6Gf39sVa71sMoPA9%2F%2BLcsJkOBRJmbnEv0BeUs7u3aYS%2BsNdx1nPAAAolnLsucRbI7e4gEGt8%2Ff51QXYQiN3FG2MFh4Xt0Arm3I86r%2BAjPHe%2FxwcEjQbu0iXJdgAAAABJRU5ErkJggg%3D%3D'],
	//Archive:
	['Zip','*.zip,*.rar,*.tar,*.tgz,*.gz,*.bz2,*.tbz2,*.gzip,*.z,*.sit,*.dmg,*.cab,*.7z,*.lzh,*.pkg','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAxUlEQVQ4jc2TsQ2DMBRELxGDZAdTIKo%2FTdjEO3xGoaKk4A%2FDBJciItjGKDiiyDWWz9bzs2QDF%2BeWFqpg2nXdft%2BpqILLspBUeu9JKkll7pCvhqqgc08AwDA80LYtRATz%2FO7M%2Biwgta%2FCyQYc0DRN1K3jFoOZAegZilXYxQAA0zRF84Ntu9xz5XrdcRzzEAPgCoAiAu89RCRecAGsxHA1%2BximZr8YhuPO7BLDE7A80BLDAhhw8LBLUtd9xEn%2F6OkvdiT2%2F3kBn8BaKKL8%2BTkAAAAASUVORK5CYII%3D'],
	//Text:
	['Text','*.txt,*.rtf,*.css,*.readme,*\/read.me','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAByElEQVQ4jaWTv2tTURTHP%2B%2B%2B5JH3wnuStEhtEESjvElcLTaYIG7i4Og%2FEHAJFO3qkkkcHd0cBV0bxAylg0RaUtEpaa2KBkLqC7Fp8%2BseB82jpSFE%2FMIZzuHcz%2F1w4RpMSbu5I1prtNZ0Wp9JLl7FducwTROllAFgjJe11lJ%2Bfpezl0a8efmd%2BUWXa0su5bcLZHMNXr%2B6yLn5gJv3H5NKpbBt2wBQY8DmZoNSbYUXa48AWLh8j7VSmivXC3ysplm6fQeASqVCEASndVdXy7K%2BsSfFfFYanbYU81lpHnSkmM9Kt9%2BTYj4rWmspFApSr9dlIqD0fksanXZYzYOOBIdd6fZ7MhgOQ0CtVgsB6jjEUta0N52YyPFGyx%2FwsydPw9lyJsONzPJsAP6KPXi4AoCpFFFlzm4g5vCUwdjiVi43g8HInGhgmSYjrTGVmg4wRpH%2FM1AR458NTkwGehAabL%2BrTLxxqkFf90MDZRgg8KFa5eiox49vX%2FnZ2sf3faLRaHgm%2FExBEMjWdp2dvU982d1lv9VCD4c4joPneXieRzKZJJ1O4%2Fs%2BiUTCOGEQj8e5cD7J4a85ztg2ruvieR6O42DbNpZlEYvFwn6c350SyCzTnE%2F5AAAAAElFTkSuQmCC'],
	//Torrent
	['Torrent','*.torrent','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAfElEQVR42u1SQQ6AIAxrDa%2FRv8hb8S%2F6nXmACDgmGq424bCtW7oyAhBoEG0orgMAkZwnrd404cZ1V7AtkHWPQZil2e0PxWUcqhTQFlBzOepBRiE7NIhVruC65qrQyryhauo5Xu78ecAbuKdi7yZMBckwli8YP8D%2FlMc9OAEIzEgxMSHbTAAAAABJRU5ErkJggg%3D%3D'],
	//PDF:
	['PDF','*.pdf','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABp1BMVEX%2F%2FwC8vLweHh4lJSVAQEDCwsLFxcXs7Oz29vb%2B%2Fv7S0tK%2Fv7%2FQ0NDb29vkcHDgb3DMzMzq6urkjI7hXV%2Fu4eTSZGjXtbjj7O%2Fv%2Fv7u7%2FHu2dvpu73iWlry8vLx8fHw8PDag4XsUlLmR0fmSEnoqanoS0zq0tXp6eno6Oj19fXpqarljo%2Fo7PDpfHv09PSxsbHm5ubt7e3nmZzcOzrn2trZ2dnj4%2BO2trbg4ODNzc3k5OTi4eLeTk3z8%2FPc3NzU1NS7u7vR0dHX19ff39%2Fb2trSUVLd3d3Pz8%2FLy8vT09PGxsbBwcHHx8e6urrExMTKysrl5eWABAbWGRzY2NiLi41%2BfoBycnR0dHeJiYyKAALaAAPtAAP5AAP%2BBAj%2BCw%2F%2BEhf%2BGh7%2BJyr%2BYWPr6%2Buurq5xcXOqAQToAAT0AAP%2BAAT%2BBgr%2BDBH%2BFRn%2BIST%2BNjn%2BdHarq6v6%2BvqAgITaGR36LjL%2BMTT%2BNzr%2BPT%2F%2BQUT%2BSEz%2BU1b%2Bamz9fH%2Fh4eHe3t6Hh4ynp6uxsbe5ub%2B7u8G9vcXCwsrDw8Pn5%2BeysrKvr6%2BwsLC0tLTa2tqQTo13AAAAAXRSTlMAQObYZgAAAOVJREFUGJVjYGBg6Onu6uzq7OzsaGeAgLbWluamxob6us5aIK%2BmuqqyorystKS4qLCuACiSn5ebk52VmZGellpYWJeSzJCUmBAfFxsTHRUZER4WGhLMEBQJBYEB%2Fn6%2BPt4gQ708PdzdXF2cnRy9gh3AAs72drY21slWPZYW5mABM9NkE2MjW0MrTwN9sICBhZ6ujraWZrupBkQgWV1NVUVFWUlRQR4iICcrIy0lKSEuJqoOERARFpIVNLByNhWwgwjw88mbWfA68bhzc4EF%2FDg52NUDanmdHNm4OkECrCzMUMDEwggA5uo65lIWsBgAAAAASUVORK5CYII%3D'],
	//RSS:
	['RSS','*.rss,*.rdf,*rss.xml,*feed.xml,*atom.xml','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAALHRFWHRDcmVhdGlvbiBUaW1lAFR1ZSAyMSBNYXIgMjAwNiAxNzo1Nzo1OCArMDEwMHFgjUMAAAAHdElNRQfWAxUQOh%2BcU%2FgTAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC%2FxhBQAAAmxJREFUeNp1U0tLG2EUPfNIJuZRY4ja2FZd%2BFYMKISACxeirpo%2FILq17uIPkNq9UF2LO%2F9BEV87dVMo%2BEARQYmoMBHMaDDvZGY696ZTYkovXL75Pu6599xz7wjh8A%2B%2FooS%2B%2BnxSXBAEiCJgn2T1d%2Fo2TRPJZGm1WFS%2FyQQOhZR4NqtzkMMhcJAkVUH1p50sGHTGz89DECYmjk16bGtzYmoqwAEXF1lcXmb%2FC6ZT1028vFQg248WC8zMtMK2TMbA9nYKOzsaikX9H3C5bHKc1NX1Zdmmnc8beHoqw%2BOR0NQkY3DQg8nJAFS1hMfH0htwpWJYbkKYnj41KUE93aEhL%2Bbm3qOjQ%2BFK6%2BsqDg5easBAqWRA6ulZsBiICIc9WFnpxsiIDz6fjLOzDPb2NDQ3O60kLoyO%2BpBIFHB3V2AwMdF1a0q1o%2FJ6RQwMuDE724q1tW50drqwsaHi8DDNLObnP8DlEv%2BATR6n1Nu7sOx0ikilyjg6SuP%2Bvoj2dhf8fhnRaCNOTjLY3dUwPu5nXQoFE6enGU5gGFZxW13qnZJQtaWlBJ9ut4h4%2FCMURWAmZLFY8A0DuVa4xcVPPAECb24m0dfntjRwcP%2F7%2B888WmqTWru6yjPmrwb9%2FR4OJNDYWCPSaR1bWymuGom844okLNnwsPdtC%2BSaVkEuZ3DA7W2BR3Vzk%2Bd7S4uTAdfXOb43NEhMn1yIxc5MEoySBAIyi0eV7FHRVKjS8fEr7T%2B3pKpFPDyUeCJCJPLru7U0cVqK2iWxhbLdfqOq9E2Fnp%2FLq1Iw%2BPmnpikuS8hoNUHVaUkMo9qnbdV26Y8V8fpa4d%2F5N%2BjsSdtt5P1PAAAAAElFTkSuQmCC'],
	//Word document:
	['Word','*.doc,*.dot,*.rtf,*.psw','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAG9JREFUOE9jYACB%2FySRpKkGG83wnxgAdwXIBuI0QNxCoR%2BAVsHDAJmNZC7Yhpa2Fog6sCJouOFkI6vDagPQOCRxWCjhiY1jx4%2Bh2IbmEkydkDCEiWPYgOZXiHvw2YAsBzQV4h4SbIDH6UDFNMGUAgBo9iREr7%2B8vwAAAABJRU5ErkJggg%3D%3D'],
	//OpenOffice.org document:
	['OOo','*.odt,*.ott,*.sxw,*.stw,*.sor,*.sxc,*.stc,*.sxi,*.sti,*.sxd,*.std,*.sxg,*.sdw','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAC5ElEQVR42m3SX2hbZRjH8e%2FJOT057TFdkqVJTBra2JbpbBV0oGSZM5Nhwd0NBRVkxWvplRREEDv1YjjQmyIFQYdYr7x3tmvdisw1Di%2B6MrVMTtN2Nctp0ibxnOX8eb3o1lLr7%2FL98%2BF9nveRAOZ%2BKYoLX3%2FPyvoGlfIGrS2T8XfeRvJdqltbCNfFsiyCwSC6rvN8Lkc%2Bl5MAFIAXnzsmvffZpKhVNym37nM0240sB%2BjvG2BoaIhIJIKqqhSLRZLJJDduLDA7OysKhYKk8CDRkM4jwTZmvvmCwSP9eJ6HLMtMTk5Sq9WIRqOsra0xMjLCmTOv8OH5j%2Fh2akoEHgKy5BHWNT7%2F8hKhzACPHX2KsbExDMNAVVXy%2BTypVOrhcT4%2BP87i4uJOCT9euSIuX7vOH7dvs7K6iu86IBRGR0dJpVK0Wi0ajQbLy8sUi0Vcz%2BelUwWq1SrSzNycMAwDX5I59%2BbryIHdRwEwMTFBJpMhkUgQi8WwbRvTNJmenibd3Y3SbDY5cfw4%2FX19%2FPTzdUqr6%2Fx68yYXPxnn3fELJFNpKn47Vl2w4dQ59cwR0uk08%2FPz9GazKD2ZDNv1OoVX32K9bFKpVGjVqyzds0hlB7Btlbv3bAKmA8Czj2eJd3YQDod5%2BfRpSaltb7N0x6DjUAyp6aI0Lbo6O%2Fju0%2FfRNI22tjYURdlXlmmaIEkAKCfzeeniV1NC0tpxdnrKE4NPs%2FBXZd%2BlE4NZ2tWdfcMwiHV1sTtI1bpFy%2FVwHAffdWkIlcu%2FLe8DnuxJkD7cCUCpVELX9T2gad%2FHcVyE7yF8j3PDOd44O8x%2FI4QAoNFokE0m9wDX9RDCByFACG6tlPmh%2BPsBICDLnBzs3Z3SXaA9qOz8vwRIEgtLf%2FKPnjgAhLQgx%2FqSxONxNk1zDzgcPoSsKCAgoCj0dsp88NoL%2FG98l0gkwkqptAd0x6OU765hb%2F6NazeZmbvKpZ5HCYVCaJp2wLAsi%2BCD9X8BU0om2NCyDrIAAAAASUVORK5CYII%3D'],
	//Excel spreadsheet:
	['Excel','*.xls,*.xlt','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAHJJREFUOE%2B1klEOABEMRHt4ce1dm5FR0wb7wYdEM7w%2BWKnFqp3P9iv9nYuzn4OBZCe0vEdxO1sdARJEoyV8hcuJIBxh9qV3gEy8BnSoDqjGPfTJCQQKJ3cQy41DfGzvsyfE3hIHeW5h5re0%2BCIT4eJvfQH6QoeeQrXgXwAAAABJRU5ErkJggg%3D%3D'],
	//Powerpoint presentation:
	['PPT','*.ppt,*.pps','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAHBJREFUOE%2B1UksSgCAI5fBNR7NjEUqMlA%2FFRS4cF%2B8r0HESE%2BXvPbToPtqcOJrCHIQwD2aA7jDW6K6iyxw6VNzoFjmoqoqtHTzimxA7GAP2AR3KVcD3ap%2Bog%2BfUtxvUD3PwTdAcltvR4m3s6btDmnkDueGOYn8qPh0AAAAASUVORK5CYII%3D'],
	//JavaScript:
	['JS','*.js','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAIhJREFUOE%2BtUlsOwCAIczf3aNxsA%2BoQGSF8jOgytbxarjnnaJuAed%2Bn8Y03eyQiiRwc9DgUJF%2BA4JM4wFnTygICNScOLtV%2B5ktLEjOE8J6IvKSi%2BrqH1YD18DdLUEDJkeWZzZsOVLIaOUsvpybl0q4SDpSzoST8m8y50t8h9FO2e0CwjrXH2gEf6kuuBl00BtIAAAAASUVORK5CYII%3D'],
	//Dangerous files - mostly executables (not .com ;):
	['EXE','*.exe,*.pif,*.lnk,*.scr,*.msi,*.vb,*.vbs,*.vba,*.wsh,*.ref,*.cmd,*.bat,*.reg,*.app,*.sh,*.bin,*.ini,chrome:*,jar:*','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABdFBMVEX%2FAAAaHWovLmExMGAyMF8yMGAxL2CmpraLi6tQR1HvwADgtADitgD8ywDlugDfswDasQDozWdYTk71yAD%2F4Az%2F1QG4nU8XBWNNOhj%2F2QH%2F1gH%2F2QTrwADq0V8tMof%2F7hv%2F1wB5XSEAABkkGRH%2F1gD%2F1QD%2F4xDmwACeiSn91AD%2F8hn%2F2gD%2F7AD%2F2wD%2F2QD%2F4wn30ALqxwUuNIj%2F%2BR3%2F3AAdEEP%2F5QD%2F3gD%2F3QD%2F7RHoyQDd3OGWiS351wD%2F9xb%2F4QD%2F%2BQAAAGr%2F%2FgD%2F4wD%2F6gjy1QDr0g8kKoT%2F7wD%2F%2Fx7%2F5AD%2F9QBpW7r%2F6AD%2F5gD%2F9RDmzgDX1tyflCn%2F5wD%2F9wzjzAI3IWi0owH45QTp1AQcH4T%2F9wD%2F%2FyRtVSIVAD4QCgbo2ADR0NmyqCD%2F8wBcTS4KADAAAAb%2F8APp3QATF37%2F%2FyPDuAL%2F%2FxPp4ADf3t%2FKyda%2Fuhj%2B%2BAD%2F%2Fwn59ATp4wAREnr%2F%2F2jr6QDg39XKySP%2F%2FwDz8wAmqcQtAAAAAXRSTlMAQObYZgAAAL5JREFUGJVjYACD6qpKBmRQUV5WVYosUFJcVFiQj%2BDn5eZkZ1VlIgQy0tNSU5KTEuECCTnxcbEx0VEwfmREenhYaEhwUCBUIMDfz9fH28vTwx3Cd3N1cXZydLC3s7WxBgtYWVqYm5n6WpgY%2BxqB%2BIYG%2Bnq6Ot6%2B2npamhogJepqqiraykqKCqqq8vZyDAyyMtJSUpIS4mIKUqIiwkIMDIIC%2FEDAx8sDJLm5ODkYGNjZWFlZWVhYgCQzEyMDBgAArlAi6Kl9YD8AAAAASUVORK5CYII%3D'],
	//PostScript
	['PostScript','*.ps,*.eps','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACuElEQVR42o2S0UtTcRTHj7%2F9brt3u8zLNi%2B7G8PrRYPy4kIcjPQhig0pCPVhPUQv1rPg04SInoTwD1CQvShRQSAEGRi96MIGGQwsw4cxiKVz66LbvNc5d%2B%2FppcTVjA6cl8M53%2FM5X44N%2FjMWFhaey7KsptPp1bN1W6vmUCjUeXx8PIqINxDxajAYfCDL8jVRFG9rmvZyd3e31HJLJBJxut3uRUrpCcuyODIygvPz85jNZq1cLoeqqqIkSffPxfR6vYuEEHQ4HLi2toamaWGxVMFUKoVerxcJIcgwzJGiKFd%2Bz9CzArqujwIAhMNhGBiIwOr7bWhrI1A%2FMqBarQIAgGmabKFQiAJA5i8CjuM%2BEUJQFEX8oWmo6zX8vrOPpmni8vIychyHNpsNFUW52fIEu91%2BmWXZb4QQDIVCuLm5iR8%2B5jC9kcNGo4F9fX2mIAgzExMTbS0F%2Bvv7L0iSdI%2Fn%2BTLLsjg5OYmWZeHh4WFtdnZ2QZblyLkGdnZ2SjzPfyGE4Pj4OBaLRbQsC39F8ry5UxS%2F358oFApPAABsNht0d3eD3%2B8Hl8sF1Wr18%2Fr6%2BhtBEHKiKL6LxWLZmZkZ%2FJMgzDCMQQjBfyWlFNvb218riuJp%2BsRyubyjquqLSqWSHx4e7g0EAg5JkojL5Tra39%2FPU0odpmlSRIR6vX6RENJrGMazU4KOjo5HlNL09PR0utFonFQqFdza2ioj4h0AgMHBQa6rq%2Bs6pVQnhGAgENhoOoFSihzH4cHBASIiTk1Noc%2FnexiNRofi8fhQT0%2F3kCAIjxmGMYPBIC4tLW03mejz%2BZ6WSqW7sVgMEokEqKoKKysrkMlkYG9vDyzLArfbDU6nE3ie387n86Nzc3Nfmx5CkqRbuq7Ha7Va2OPxXOJ5HjiOA7vdDoZhZDVNS9Xr9bdjY2OvksmkAQDwE2UbPIlSQKJoAAAAAElFTkSuQmCC'],
	//TeX
	['TeX','*.tex,*.dvi','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAC%2BklEQVR42n3ST2jbdRjH8Xe%2Bv39Jm1%2FSJnVJFrOssdjNdXNd0apjYxUnyg7bwUPHjgrCwApjethJL3oY6EDUk%2BDByxAUKziZ4J%2FYKaXQUWlt1zZNl63t2pnmX5vkl98vv68nG%2BbQ5%2FTw8DwvPofHw%2F%2FUxBfvydzcNKl4iNVCjVOXPvP8e%2BehwcxXH0h7q8jyzCxObonUIwbxkM707RL3fXsZ%2FuRrz38C195%2FQ7p%2F%2FMTBbhPLsWk2Bfl7ZYJ%2BhYYtWKsp6AMnOXnx8s6d%2BKeZvHpZZtNjtBsuPq9DxHSJBBtEoiZFW6HWbFKs25Qq1QcS7wDpa7%2FRdMo0HY2pmSolqw0bg0LdRghJIhGgL%2BXFuznLj59ekg8Aox9ekJvzN%2Blsh3hAomowNbdGvqowOZcnGdHpDMJitkH21n2W0z%2Fw3ZW35Q5QKuTZ5dOxtpsYisZGuYrjUfl%2BcgURNdlouKz%2F5ZCMSWxrCweBL6C3EmTmboGikW%2FA6MwagUAb%2B8IuQ4%2BF6X%2F5df7sPI48cZ7fFxskehOsV%2BssZhZawL07GwQVi6dTBvvjYaKmhw5h0KlYBHx1ar4uunr70cJ%2BcmqC8x99ie7raAF7YhGCfg3FVjCEC1IgtxoYZRvtxigv9XipZ37m7PAQ%2BwMFZseu03%2FwAAAqQM%2BRIyyN%2FUrlbpFUzKTDryJciaprGMkY7T0JlPiTSMXLsfgNirks295drQT7%2Bh5HNdrwt2tYqo9cQ8c4dADtuQHK0V6c0BNII4nUHuWOtZvx%2BRoNYbaAQ2fe9CQGn6GgxhifKjK%2FaDFrmbjPnqXe%2FSIVuw0pBLZtE03s5flzr7GeLz78ylffHZG%2FfP4tSV1gBlXCx4cYfHWESqWIqnoor6wzPTHB4aMD1AtLHB2%2B6FEArl95Sx6Lh99Jf5PGkC6mUBGWZDWzTD6zwOALJ4j19hHa083a7QW6vCWeeuWCB0D5%2BNxpuT02zu7NbUKqhu1YmLqGT5EIReNuNstKZgHpVRE0MZxVDp8e2Un%2BN0JPK9Xs8gPRAAAAAElFTkSuQmCC'],
	//C/C++ source files
	['Cpp','*.cpp,*.c,*.cc,*.cxx','data:image\/gif;base64,R0lGODdhEAAQALMPAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwICAgP8AAAD%2FAP%2F%2FAAAA%2F%2F8A%2FwD%2F%2F%2F%2F%2F%2FyH5BAEAAAEALAAAAAAQABAAAwRFMKBJa7gYvc33QdilddwhhSP5ACyQqd3hihthc8Qjv3dv7zRfTTeTPG4qoFF4JPJyPoJyZMsNp7BSMQWbHr7gsLJFLs8iADs%3D'],
	//C/C++ header files
	['H','*.h,*.hpp,*.hh,*.hxx','data:image\/gif;base64,R0lGODdhEAAQALMPAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwICAgP8AAAD%2FAP%2F%2FAAAA%2F%2F8A%2FwD%2F%2F%2F%2F%2F%2FyH5BAEAAAEALAAAAAAQABAAAwREMKBJa7gYvc33QdilddzxgBnJASyQPgShHq64xXMt3THu6SOfj%2FYSyh5EG+w4BPKeSOcSmtypStJrNHPoer%2FVlnhciwAAOw%3D%3D'],
	//Java:
	['Java','*.java,*.jar,*.jad','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAuUlEQVQ4jZ1SQQ7DIAwz1V7T456wY4%2B8J0fva%2BFZ6WEFpaHQapYiIQN2YgDuYUddYnlwGSQf%2BASQrM7TDtKd%2B935yxEO98hNvK7djaTxPMZwlE5AVc0AMyCKjOGDM1f0HYXxfAZtw6w38pwXeVVCRJDz1g59SUAEAPBRbXzOG9b1XQ1TXbQWZ0AfqCESM6hqJ7CQ%2FO%2BrHlhEpPtdpRSklE7lAvSG3V3%2FVP4pWkaBP3%2Flqiy%2F9L36aI0d80KynYgLq8EAAAAASUVORK5CYII%3D'],
	//Python:
	['Python','*.py','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABKUlEQVQ4jZWT642EMAyEv6DrA1MJ6QQ6IalkuUoIlZy3ktwPm2V5nFY3EooVeTxjOwTeIEL1E1VQJfABzVtchwHaFvoeYrS7%2FxQAJmKEnCuqn6i3BTKqME0BEWvFXfzpJAA1xpflA0oFeXpc7mcSYqS60qaItlAiqAAJktNSeonuLWgL9PZpC%2FMAs4COIHpUu3P5pWpqG3T05ARl9BOI65UM0LAStINHB21nbcgMJQGrtbE5udtMA7AAaYHnjxG0s%2BHJA2Kx2B%2FWBWHyFeVTr2WBcd7J82z5J34NAD3UFYIIVQabw%2Fi923byVuD1JkSOFSsLECHlY8%2Fbv1EKjON%2Br3oqEBebwaZ%2BB1VbN0DJpwLycDXxyRePxTOyuXhDuAyFyciqwHX3l6f8C6FNfiz73B%2FdAAAAAElFTkSuQmCC'],

null], linktypes = {};

/**************************************
Configure other options and images here
**************************************/

	//comment out lines you do not want
//	linktypes['feature name'] = ['alt text','image src'],

	//Fake links that point to one site but claim to point to another (often used in phishing scams):
	linktypes['phishing'] = ['Fake','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwAAAAAzJ3zzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAUklEQVQ4y2P8z4ABsAjBASOGwH%2FiNOI0iIkMzSjqmRgoBExk2I7iCopdwIIwjwSHMDIyUDUMqOQFRsaBcQETtuRJSmqkWiAykmM7emaiODeSBQC6GQ0fAcvT0AAAAABJRU5ErkJggg%3D%3D'];
	//Links to other websites:
//	linktypes['external'] = ['Ext','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAgUlEQVQ4jdWSwQ2AIAxFf42jOBtO0CXoBDqbu%2BDBQKQUKUf%2FqSG8l9ICOHMAyTpfvIKehJjZNOtsIqXeAcr16oV0J1lSBDHG6tJJhK9kiTmDEfyWNAIvDDyzmNqChgHHGkNKCKlelGsLGrLgbgc9%2BGJuztwzsGBg4ifmiMj4Cf%2FKDXtEJE9FLbd2AAAAAElFTkSuQmCC'];
	//Internal links within the same page:
//	linktypes['internal'] = ['#','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAEJJREFUOE9jbGhoYCAJADWQBBggqv8TASAqERpmMjDgQUADqaQB02kQa3HaMCI14IoKasQDwcSBEtPEpz9oWiJeAwCT6abhEwvS8AAAAABJRU5ErkJggg%3D%3D'];
	//Links with JavaScript onclick attributes:
	linktypes['onclick'] = ['Script','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwAAAAAzJ3zzAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH1QkJCjAsHjbVAQAAAHNJREFUeNq1k9EJwCAMRHM1Y9T9B7NjCPajtoQmsaL2IBAiPsh5EmmVWl3C%2B3KuVxnmudJGk%2FodIP0w%2ByYgl6tub6yeBXF4BUlc54EEev2SV4AMj6eA7yQ2IQFER0pqvsf4rADGvIlDEFYD2HHs%2Fo1enj2djNcx5SNS9nQAAAAASUVORK5CYII%3D'];
	//Links that open in new windows (note; if you disable this, they will show as links that open in other frames or windows):
	linktypes['blank'] = ['Blank','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAALHRFWHRDcmVhdGlvbiBUaW1lAFdlZCAyNSBBdWcgMjAwNCAxMzoxMzo1MyAtMDYwMAxWF1cAAAAHdElNRQfUCBkSDxTa%2BhjhAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC%2FxhBQAAAFxJREFUeNpjYKAQMGITnMnA8J8YzelA%2FUyUuoCFkA2EXEgdFzQ0NKD6uaGBAZs4kI%2FhIuqGAcwGmB9hfAwX0swF6AAe2tAwwZY%2BaOMC9PiHhQFdYoGoPEBVF1AMABE5HddSGZY7AAAAAElFTkSuQmCC'];
	//Links that open in other frames or windows:
	linktypes['target'] = ['Target','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAcElEQVR42rVSUQqAIBR7K8%2FaNdRrBB411oegoo4Saj%2BCb%2FONOYQQbAWbLcLlw3v%2FSI0xVkGHE%2BhuDlJaAlDG0tKoIXkZzCxhJsDgodW8TQnAblwQTDe4MmsfVmy5geSYrEypsBM%2BrIb6VynIPfmlrTemWipmyQuMfwAAAABJRU5ErkJggg%3D%3D'];
	//Links that search engines are not allowed to index:
//	linktypes['nofollow'] = ['Nofollow','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAlklEQVQ4ja1TUQ7FIAhrzQ603f8Q7ka8j6kPm0aXl0dCMiktDJEwVoHQ2AXQ5U5BR9wJjYOSNTHjGeOqsmk7qmBlQ3Cik5VV666ziMCVsEOU3a9YEfKpU3Kw%2BxlfThUs5wOIIUBy8mwu3r45BNp02V1mMVUn2fNRVpPP2N2qd7K9xjebWOVsr2y1hYr%2F7y3shN5s6U%2F2AfYvRe9W5oCvAAAAAElFTkSuQmCC'];
	//Links on insecure sites that point to secure sites:
	linktypes['secure'] = ['Secure','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABy0lEQVQokZ2RvWuTURTGf%2FfNm4SaNw5JcRMdFAQnwSEiFBdB6CCIq7g4113q1P4Duro4uIkggkOgiwU%2F%2BkGtDlELxmrExHyUJLRJ3tz3nuPQJE1aXTzLOffhPPc5Dw%2F8Z5nDwNLyqvZsRO13nXjCJ0inMapcvzZzZHdUL%2FLLWixVtFJv6V6np9ulitZ22vr1R0UfPXmuf1VcerWiqSCg2Wyxtv4BL2ZQUax15HIXODGdZfNjgTu3bhgAf0gsfCly%2FtwZ3rxdZ2F%2BbuKs%2BYUHemXmEvWd1gjzhoO1jpW1zSMkgMX7d8271ff43mj9QLFWbdALe%2F%2F0%2F227RDaTmfT48uFxdbaNCIiADrq4%2Fe7GMLyA24u7xgdwts3sXB7Pvzj4SwEB3NgsiPvM43tXD04VAVwZ%2FArSfw1RGRVBESDAP5YDLwvRL8QxSRRbxEueBfmJShmJLBJ2UYmIJQMMp%2Bm3N1AZI6qAC7fwU5fRfp2oU8KFIeIcmDiJ%2FhZMxQibn3BySLFT%2FU4iI3hTp4gnU8Q1ArWgEWgIUsP1Gvu2RkQHzrZA9zD%2BSYxOA12gi2oHtAtaJQobkx5NLE3%2BWQF9enMUyTAOHcQxfBMLgF3%2BAPKIBLDNSR1EAAAAAElFTkSuQmCC'];
	//Links on secure sites that point to insecure sites:
	linktypes['insecure'] = ['Insecure','data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAPCAYAAAALWoRrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB2ElEQVQ4jbWSvWtTURjGf%2FfmJqHmxiEpbqKDguAkOESE4iIIHQRxFRfnukud2n9AVxcHNxFEcAh0sWC1H9jqELVgrEZMzEdJQpvk5tzzvg651YrY3gye5T0fnN%2F7nOc88B%2BGM%2B6FhcUVHZiQxo8myZSHn83iqHL1ytTYLACeFRe1XKlprdnR3d5Atyo1bWx39dPXmj549FTHVrrwYlkzvk%2B73WF17S1uwkFFMcZSKJzj2GSejXclbt245nhxoaWPZc6eOcXSqzXmZmf%2BEDM7d08vTV2gud0BwI0LNcayvLrxFxBg%2Fu5t5%2FXKOp47wsVW2qi3GASDf55%2F3qqQz%2BWAyNPn94%2BqNV1EQAQ0qmJH1e7bw%2FW5Ob9z4F94ANZ0mZ4p4nrnoz4KCGD3zQWxH3h45%2FKhr%2FIgUmCr4NWQ4UsIq6gIigA%2B3pECuHkIvyP2UOZvqJgybvo0yDdUqkhokKCPSkgi7eNwkmH3DSoxoSpgg028zEV02CTsVbBBgFgLTpLUcBMmEgTt99i4UBHo1b%2BQygnuxAmS6QxJDUENaAgagDSwg9bIqlhQC9Z0QHdxvOM4Ogn0gT6qPdA%2BaJ0waMX31ElkKT4poY%2Bv%2F4rVXqQ0itTemoQP7BwI%2FQlgKQSw6bxnzwAAAABJRU5ErkJggg%3D%3D'];

/****************************************
***********   Stop editing!   ***********
****************************************/

var theStyle = document.createElement('link');
theStyle.setAttribute('rel','stylesheet');
theStyle.setAttribute('type','text\/css');
theStyle.setAttribute('href','data:text\/css,'+escape(

// this is the CSS being used
'fakespanltyp, fakespanltyp img {\n'+
'	position: static !important;\n'+
'	float: none !important;\n'+
'	width: auto !important;\n'+
'	height: auto !important;\n'+
'	padding: 0px !important;\n'+
'	margin: 0px !important;\n'+
'	background: transparent !important;\n'+
'	border: 0px !important;\n'+
'	vertical-align: middle !important;\n'+
'	text-decoration: none !important;\n'+
'}\n'+
'fakespanltyp.span-for-type-icons {\n'+
'	padding-left: 5px !important;\n'+
'}\n'+

//this section does the hover effect only
'fakespanltyp.span-should-hide-type-until {\n'+
'	position: absolute !important;\n'+
'	white-space: nowrap !important;\n'+
'	z-index: 1000001 !important;\n'+
'	top: 0px !important;\n'+
'	left: 0px !important;\n'+
(useTextOnly?
'	border: 1px solid #000 !important;\n'+
'	font-size: smaller !important;\n'+
'	color: #000 !important;\n'+
'	background-color: #ffffe1 !important;\n'+
'	padding: 1px !important;\n'
:'')+
'}\n'+
( ( addCenterTagFix && document.evaluate && ( (0.1).toPrecision(1) == '.1' ) && document.getElementsByTagName('center').length && document.getElementsByTagName('table').length ) ?
'center {\n'+
'	display: table !important;\n'+
'	width: 100% !important;\n'+
'}\n'
:'')+
'fakespanltyp.span-should-fix-type {\n'+
'	position: fixed !important;\n'+
'	top: auto !important;\n'+
'	bottom: 0px !important;\n'+
'	left: 0px !important;\n'+
'}'+
'@media print {\nfakespanltyp {\n'+
'display: none !important;\n'+
'}\n}'

));
if( hed ) {
	hed.appendChild(theStyle);
} else {
	oTitle.parentNode.insertBefore(theStyle,oTitle);
}

for( var i = 0, j; j = MatchList[i]; i++ ) {
	j[1] = new RegExp('^('+j[1].replace(/,/g,'|').replace(/\//g,'\\\/').replace(/\./g,'\\.').replace(/\*/g,'.*').replace(/\s+/g,'')+')$','i');
}

var oAtchEl = ( window.getComputedStyle(document.body,null).position == 'static' ) ? document.body : document.documentElement;

function showInRightPlace(e) {
	if( ( e.target == this.hasASpanForTypeIcons ) || ( e.target.parentNode == this.hasASpanForTypeIcons ) ) { return; }
	if( e.type != 'mousemove' && !this.wasTypeIsAlreadyThere ) {
		this.wasTypeIsAlreadyThere = e.type;
		oAtchEl.appendChild(this.hasASpanForTypeIcons);
		if( e.type == 'focus' ) {
			this.hasASpanForTypeIcons.className = 'span-for-type-icons span-should-hide-type-until span-should-fix-type';
		}
		if( hideIconsAfter ) { this.hasIconTimeout = window.setTimeout( function ( oThis ) {
			hideInRightPlace.call(oThis);
		}, hideIconsAfter * 1000, this ); }
	}
	if( this.wasTypeIsAlreadyThere == 'focus' && e.type != 'focus' ) {
		this.wasTypeIsAlreadyThere = e.type;
		//spatnav fires focus then mousemove then mouseover - revert to absolute position
		this.hasASpanForTypeIcons.className = 'span-for-type-icons span-should-hide-type-until';
	}
	if( e.type == 'focus' || this.parentNode == e.target ) { return; }
	this.hasASpanForTypeIcons.style.left = e.pageX + ( useTextOnly ? 13 : 10 ) + 'px !important';
	this.hasASpanForTypeIcons.style.top = e.pageY + ( useTextOnly ? 1 : 3 ) + 'px !important';
}

function hideInRightPlace() {
	if( this.hasTimeout ) { window.clearTimeout(this.hasIconTimeout); }
	if( !this.hasASpanForTypeIcons.parentNode ) { return; }
	this.hasASpanForTypeIcons.style.left = '';
	this.hasASpanForTypeIcons.style.top = '';
	this.hasASpanForTypeIcons.parentNode.removeChild(this.hasASpanForTypeIcons);
	this.hasASpanForTypeIcons.className = 'span-for-type-icons span-should-hide-type-until';
	this.wasTypeIsAlreadyThere = false;
}

function addToLink(oLink,oAlt,oSrc) {
	if( !oLink.hasASpanForTypeIcons ) {
		oLink.hasASpanForTypeIcons = document.createElement('fakespanltyp');
		oLink.hasASpanForTypeIcons.className = 'span-for-type-icons'+(showOnHover?' span-should-hide-type-until':'');
		if( showOnHover ) {
			oLink.addEventListener('mouseover',showInRightPlace,false);
			oLink.addEventListener('mousemove',showInRightPlace,false);
			oLink.addEventListener('focus',showInRightPlace,false);
			oLink.addEventListener('mouseout',hideInRightPlace,false);
			oLink.addEventListener('blur',hideInRightPlace,false);
		} else {
			oLink.appendChild(oLink.hasASpanForTypeIcons);
		}
	}
	if( useTextOnly ) {
		var foo = document.createTextNode((showOnHover?'':'[')+oAlt+(showOnHover?' ':']'));
	} else {
		var foo = document.createElement('img');
		foo.setAttribute('alt',oAlt);
		foo.setAttribute('title',oAlt);
		foo.setAttribute('src',oSrc);
	}
	oLink.hasASpanForTypeIcons.appendChild(foo);
}

//for every link
for( var i = 0, j; j = document.links[i]; i++ ) {
	//check special conditions
	if( ( notIfExistingImage && j.getElementsByTagName('img').length ) || ( notWithoutText && !j.innerText.replace(/\s+/,'') ) ) { continue; }
	if( linktypes['phishing'] && j.innerText.match(/\b((https?|ftp):\/\/[^\s\/]+)/) && j.href.indexOf(RegExp.$1) != 0 ) {
		addToLink(j,linktypes['phishing'][0],linktypes['phishing'][1]);
	}
	if( linktypes['external'] && j.hostname && ( j.hostname != location.hostname ) ) {
		addToLink(j,linktypes['external'][0],linktypes['external'][1]);
	} else if( linktypes['internal'] && j.hash && ( j.href.replace(/#.*$/,'') == location.href.replace(/#.*$/,'') ) ) {
		addToLink(j,linktypes['internal'][0],linktypes['internal'][1]);
	}
	if( linktypes['onclick'] && j.getAttribute('onclick') ) {
		addToLink(j,linktypes['onclick'][0],linktypes['onclick'][1]);
	}
	if( linktypes['blank'] && j.getAttribute('target') && ( j.getAttribute('target').match(/^_blank$/i) ) ) {
		addToLink(j,linktypes['blank'][0],linktypes['blank'][1]);
	} else if( linktypes['target'] && j.getAttribute('target') && !j.getAttribute('target').match(/^_self$/i) ) {
		addToLink(j,linktypes['target'][0],linktypes['target'][1]);
	}
	if( linktypes['nofollow'] && j.getAttribute('rel') && j.getAttribute('rel').match(/\bnofollow\b/i) ) {
		addToLink(j,linktypes['nofollow'][0],linktypes['nofollow'][1]);
	}
	if( linktypes['secure'] && ( j.protocol == 'https:' ) && ( location.protocol != 'https:' ) ) {
		addToLink(j,linktypes['secure'][0],linktypes['secure'][1]);
	} else if( linktypes['insecure'] && ( j.protocol != 'https:' ) && ( location.protocol == 'https:' ) ) {
		addToLink(j,linktypes['insecure'][0],linktypes['insecure'][1]);
	}
	//check every item to see if it matches (use the resolved href)
	for( var n = 0, m; m = MatchList[n]; n++ ) {
		if( j.href.match(m[1]) ) {
			//positive match!
			if( m[0] ) {
				addToLink(j,m[0],m[2]);
			}
			break; //don't waste time looking for more
		}
	}
}

},false);