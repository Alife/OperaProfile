var Squid = "PROXY 127.0.0.1:3128;DIRECT";
var PROXY = "PROXY 127.0.0.1:8000";
var localhost = "PROXY 127.0.0.1:80";
var googleHttp = "PROXY 203.208.46.180:80";
//var googleIPHttps = "PROXY 203.208.46.180:443";
var googleIPHttps = "PROXY 74.125.128.106:443";
//var http_proxy = 'SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080; DIRECT';
var http_proxy = 'PROXY 127.0.0.1:8123; DIRECT';
var direct = 'DIRECT';

var gfwed_list = [
	"akamai.net",
	"akamaihd.net",
	"amazon.com",
	"appspot.com",
	"archive.org",
	"bitly.com",
	"blogger.com",
	"blogspot.com",
	"cl.ly",
	"facebook.com",
	"fbcdn.net",
	"feedburner.com",
	"feedsportal.com",
	"gmail.com",
	"goo.gl",
	"google.com",
	"j.mp",
	"mediafire.com",
	"openvpn.net",
	"osfoora.com",
	"posterous.com",
	"rapidshare.com",
	"t.co",
	"twimg.com",
	"twitpic.com",
	"twitter.com",
	"vimeo.com",
	"wordpress.com",
	"yfrog.com",
	"youtube.com",
	"ytimg.com"
];
var gfwed = {};
for (var i = 0; i < gfwed_list.length; i += 1) {gfwed[gfwed_list[i]] = true;}
function host2domain(host) {
	var dotpos = host.lastIndexOf(".");
	if (dotpos === -1)
		return host;
	// Find the second last dot
	dotpos = host.lastIndexOf(".", dotpos - 1);
	if (dotpos === -1)
		return host;
	return host.substring(dotpos + 1);
};
function FindProxyForURL(url, host) {
    debugPAC ="PAC Debug Information\n";
    debugPAC +="-----------------------------------\n";
    debugPAC +="Machine IP: " + myIpAddress() + "\n";
    debugPAC +="Hostname: " + host + "\n";
    if (isResolvable(host)) {resolvableHost = "True"} else {resolvableHost = "False"};
    debugPAC +="Host Resolvable: " + resolvableHost + "\n";
    debugPAC +="Hostname IP: " + dnsResolve(host) + "\n";
    if (isPlainHostName(host)) {plainHost = "True"} else {plainHost = "False"};
    debugPAC +="Plain Hostname: " + plainHost + "\n";
    debugPAC +="Domain Levels: " + dnsDomainLevels(host) + "\n";
    debugPAC +="URL: " + url + "\n";
    // Protocol can only be determined by reading the entire URL.
    if (url.substring(0,5)=="http:") {protocol="HTTP";} else
        if (url.substring(0,6)=="https:") {protocol="HTTPS";} else
            if (url.substring(0,4)=="ftp:") {protocol="FTP";}
                else {protocol="Unknown";}
    debugPAC +="Protocol: " + protocol + "\n";
    // Reduce volume of alerts to a useable level, e.g. only alert on static text pages.
    if (!shExpMatch(url,"*.(js|xml|ico|gif|png|jpg|jpeg|css|swf)*")) {
		//alert(debugPAC);
	}
	
	if (shExpMatch(host,"*.operachina.com*")){alert("operachina");return "PROXY 59.151.106.253:80";}
	if (shExpMatch(host,"*.google.com")||shExpMatch(host,"*.google.cn")||shExpMatch(host,"*.appspot.com")||shExpMatch(host,"*.googleusercontent.com")){
		if (url.substring(0,5)=="http:") {alert("googleHttp");return Squid;}
		else{alert("googleIPHttps");return Squid;}
	}

	return gfwed[host2domain(host)] ? http_proxy : direct;
}

