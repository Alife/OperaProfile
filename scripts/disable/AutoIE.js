// ==UserScript==
// @include http://update.microsoft.com/*
// @include http://www.windowsupdate.com/*
// @include http://author.skycn.com/*
// @include http://xueli.upol.cn/*
// @include http://*.ys168.com/*
// @include http://*.ccb.com/*
// @include http://kankan.xunlei.com/*
// @include http://www.yaoyuan.com/live.php
//
// @exclude *.wmv
// @exclude *.mp3
// @exclude *.avi
// ==/UserScript==

document.write(
	'<html>' +
		'<head>' +
			'<title>' + (document.title ? document.title : location.href).replace(/</g, '&lt;') + ' - view in ie</title>' +
			'<style type="text/css">' +
				'body {' +
					'margin: 0; padding: 0;' +
				'}' +
				'embed {' +
					'width: 100%; height: 100%;' +
				'}' +
			'</style>' +
		'</head>' +
		'<body>' +
			'<script type="text/javascript"' + 'src="data:text/javascript,' + encodeURIComponent('document.write(\'<embed type="application/viewinie" param-location="' + location.href +'\x22  cookies=\x22'+document.cookie+ '"></embed>\');') + '">' + '</script>' +
		'</body>' +
	'</html>'
);
