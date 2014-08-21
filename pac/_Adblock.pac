//define proxy
var TorProxy = "PROXY 127.0.0.1:8118";
var NoProxy  = "DIRECT";
var adblock  = "PROXY 127.0.0.1:8888";
var GoogleIpv6  = "PROXY ipv6.google.com:80";

//define regexp white list for adblock
var whlist = new Array();
var whi = 1;
whlist[whi++] = /(-------------)/i;
whlist[whi++] = /(-------------)/i;
whlist[whi++] = /(-------------)/i;
whlist[whi++] = /(opera\.com\/)/i;
whlist[whi++] = /(zh\.wikipedia\.org\/)/i;
whlist[whi++] = /(www\.google\.com\/search)/i;
whlist[whi++] = /(72\.14\.235\.104\/search)/i;

//define regexp black list for adblock
var balist = new Array();
var bai = 1;
balist[bai++] = /(-------------)/i;
balist[bai++] = /(-------------)/i;
balist[bai++] = /(-------------)/i;
balist[bai++] = /([\W\d](double|fast|specific|value|inter)click[\W\d])/i;
balist[bai++] = /([\W\d]click(stream|thru.*|xchange|\.net)[\W\d])/i;
balist[bai++] = /([\W_](click|bar)[\W_])/i;
balist[bai++] = /([\W_]a-?d-?(v|s)?[\W_])/i;
balist[bai++] = /([\W\d_]banner)/i;
balist[bai++] = /(\.swf)/i;
balist[bai++] = /(\b((cn|cnx|myle|show|js|Text|google)_?)?ad(?!er|rive|dress|d|vanced|obe)(s|v)?.*(jpg|gif|js|htm|asp|jsp|do|php))/i;
balist[bai++] = /((analytics|biaoshi|banner|cpm|cpa|icp|cpc|click|guanggao|Ggao|tongji|tuiguang|titou|(kk)?union|unicom|count(er)?(?!s)|a-d-s).*\.(asp|gif|htm|js|jsp|jpg|png|php))/i;
balist[bai++] = /(\b(51traffic|17luntan|7town|is686|yu520|yp4p|heima8|t2t2|52s|e78|my5757|1tong|95ol|sg\.a8|gg\.51)\b)/i;
balist[bai++] = /(\b(114|265|3721|3155|1687799|(spcode|u[a-z]+)\.baidu|(beacon|pfp)\.sina)\b)/i;
balist[bai++] = /(\b(borlander|cnnic|haoxi|itsun|klsms)\b)/i;
balist[bai++] = /(\b(linkpage|mmforce|pub\.lele|vogate|yeeyoo|ulinkjs\.tom)\b)/i;
balist[bai++] = /(\b(rapidcounter|kliptracker|robotreplay|reinvigorate|zanox|linksynergy|imrworldwide)\b)/i;

//main function
function FindProxyForURL(url, host){
url = /my.opera.com/community/forums/url.toLowerCase();
host = host.toLowerCase();

if(
	shExpMatch(url,"*.appspot.com*")
	||shExpMatch(url,"*.blogspot.com*")
){return GoogleIpv6;}
	return NoProxy;
}

if (!whwh(url)&&baba(url)){return adblock;}

if(dnsDomainIs(host, "upload.wikimedia.org")//torproxy_select
	||dnsDomainIs(host, "upload.wikimedia.org")
	||dnsDomainIs(host, "--secure.wikimedia.org")
	||dnsDomainIs(host, "www.pconline.com")
){return NoProxy;}
if(dnsDomainIs(host, ".avdvd.net")
	||dnsDomainIs(host, ".1pondo.tv")
	||dnsDomainIs(host, ".wikimedia.org")
	||dnsDomainIs(host, ".wikipedia.org")
	||dnsDomainIs(host, "hk.yahoo.com")
	||dnsDomainIs(host, ".yahoo.com.hk")
	||dnsDomainIs(host, ".1pondo.tv")
	||dnsDomainIs(host, ".1pondo.tv")
	||shExpMatch(url,"*www.privoxy.org*")
	||shExpMatch(url,"*64.233.161.104/search*")
	||shExpMatch(url,"*72.14.235.104/search*")
	||shExpMatch(url,"*209.85.129.104/search*")
	||shExpMatch(url,"*216.239.63.104/search*")
	||shExpMatch(url,"*6sxoyfb3h2nvok2d.onion/tor/*")
){return TorProxy;}
	return NoProxy;
}

function whwh(urlw)
{
	for (var i=1;i<whi ;i++ ){;
		if (whlist[i].test(urlw)){return 1;}
	}
	return 0;
}

function baba(urlb)
{
	for (var i=1;i<bai ;i++ ){;
		if (balist[i].test(urlb)){return 1;}
	}
	return 0;
}