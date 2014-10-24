function FindProxyForURL(url, host) {
	if (/^https?:\/\/[\w\.]+\/crossdomain\.xml/i.test(url)) 
		return "PROXY yk.pp.navi.youku.com:80";
	else
		return "DIRECT";
}