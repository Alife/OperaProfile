// isPlainHostName(host) 判断是否是简单域名，例如 localhost 就是一个简单域名
// dnsDomainIs(host, domain) 判断给定的 host 是否属于某个域名
// dnsResolve(host) 做 DNS 解析，返回 host 的 ip，注意：DNS 解析可能会 block 住浏览器
// isInNet(ip, subnet, netmask) 判断 ip 是否属于某个子网
// myIpAddress() 返回本机的 ip (貌似不太可靠，见 wikipedia 的说明)
// shExpMatch(str, pattern) 判断两个字符串是否匹配，
// pattern 中可以包含 shell 使用的通配符

// 在 HTTP 服务器上部署 PAC 文件时，需把文件的 MIME 类型设置成application/x-ns-proxy-autoconfig

var Squid = "PROXY 127.0.0.1:3128;DIRECT";
var PROXY = "PROXY 127.0.0.1:8000";
var localhost = "PROXY 127.0.0.1:80";
//var googleHttp = "PROXY 64.233.162.83:80";
var googleHttp = "PROXY 118.174.27.106:80";
var googleHttps = "PROXY 64.233.162.83:443";
// 同时指定多个方式，从第一种开始，一种无法连接使用下一种，直到成功或最后失败
//var http_proxy = 'PROXY SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080; DIRECT';
var http_proxy = 'PROXY 127.0.0.1:8123; DIRECT';
var direct = 'DIRECT';
var debug = true;
var PROXY = direct;

var google_list = [
	"google.com","www.google.com","google.com.hk","googleapis.com",
	"googleusercontent.com","gstatic.com","appspot.com","blogger.com",
	"blogspot.com","gmail.com","goo.gl","ytimg.com","youtube.com"
];
var blocked_list = [
  "akamai.net","akamaihd.net"
];
//var blocked = {};for (var i = 0; i < blocked_list.length; i += 1) {blocked[blocked_list[i]] = true;}
var gfwed_list = [
	"akamai.net",
	"akamaihd.net",
	"amazon.com",
	"archive.org",
	"bitly.com",
	"cl.ly",
	"facebook.com",
	"fbcdn.net",
	"feedburner.com",
	"feedsportal.com",
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
	"yfrog.com"
];
//var gfwed = {};for (var i = 0; i < gfwed_list.length; i += 1) {gfwed[gfwed_list[i]] = true;}
function host2domain(host) {
	var dotpos = host.lastIndexOf(".");
	if (dotpos === -1)return host;
	// Find the second last dot
	dotpos = host.lastIndexOf(".", dotpos - 1);
	if (dotpos === -1)return host;
	return host.substring(dotpos + 1);
};
function isMatchProxy(url, pattern) {
     try {return new RegExp(pattern.replace('.', '\\.')).test(url);} 
	 catch (e) {return false;}     
}
function log(msg) {
	// opera will temporary disable pac proxy because it did not support alert function
    if(debug)alert(msg);
}
function MatchListProxy(list,proxy,url) {
	// Google 代理
	for(var i=0, l=list.length; i<l; i++) {
        if (isMatchProxy(url, list[i])) {
			log("url:"+url+" "+list[i]);
			log("isMatchProxy:"+isMatchProxy(url, list[i])+" "+proxy);
            PROXY=proxy;return;
        }
    }
}
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
	var Protocol = url.substring(0,url.indexOf(":"));
    debugPAC +="Protocol: " + Protocol + "\n";
    // Reduce volume of alerts to a useable level, e.g. only alert on static text pages.
    //if (!shExpMatch(url,"*.(js|xml|ico|gif|png|jpg|jpeg|css|swf)*"))log(debugPAC);

	// Google 代理
	if(Protocol=="http")MatchListProxy(google_list,googleHttp,url);
	if(Protocol=="https")MatchListProxy(google_list,googleHttps,url);
	MatchListProxy(google_list,googleHttp);

	log(PROXY+" Host: "+host);
	log("Url: "+url);
 	return PROXY;
	//return gfwed[host2domain(host)] ? http_proxy : direct;
}

