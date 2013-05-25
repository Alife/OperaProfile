if (!window.console) {
	window.console = {};
	var methods = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
		"group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"],
	noop = function () {}
	for (var i = 0, method; method = methods[i++]; )
		window.console[method] = noop;
	if (window.opera && opera.postError) {window.console.log=opera.postError;}
}
if (!window.log) {
	window.log = console.log;
}
