var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
Cu.import("resource://gre/modules/Services.jsm");

var REDUCED_URL = "styles/nbReduced.css", ADAPTIVE_URL = "styles/nbAdaptive.css", MINIMAL_URL = "styles/nbMinimal.css";

var PREF_ROOT = "extensions.better_url.";
var PREF_DEFAULTS = {
	increaseFonts : true,
	autoSizeSearchBox : false,
	navBarSpacing : "adaptive",
	loggingEnabled : false
};

function include(src) {
	var o = {};
	Cu.import("resource://gre/modules/Services.jsm", o);
	var uri = o.Services.io.newURI(src, null, o.Services.io.newURI(
			__SCRIPT_URI_SPEC__, null, null));
	o.Services.scriptloader.loadSubScript(uri.spec, this);
}

include("scripts/utils.js");
include("scripts/pref.js");
include("scripts/helpers.js");

initDefaultPrefs(PREF_ROOT, PREF_DEFAULTS, true);

var navBarSpacingURL_current;

function navBarSpacingValueToUrl(prefName) {
	var nbValue = prefValue(prefName).toLowerCase();
	if (nbValue == "reduced")
		return REDUCED_URL;
	else if (nbValue == "adaptive")
		return ADAPTIVE_URL;
	else if (nbValue == "minimal")
		return MINIMAL_URL;
	return null;
}

function loadAndHandleNBSpacing(prefName) {
	navBarSpacingURL_current = navBarSpacingValueToUrl(prefName);
	loadSheet(navBarSpacingURL_current);

	prefObserve([ prefName ], function() {
		var navBarSpacingURL_new = navBarSpacingValueToUrl(prefName);
		if (navBarSpacingURL_new != navBarSpacingURL_current) {
			unloadSheet(navBarSpacingURL_current);
			loadSheet(navBarSpacingURL_new);
			navBarSpacingURL_current = navBarSpacingURL_new;
		}
		printToLog("navBarSpacing: " + navBarSpacingURL_current + " -> "
				+ navBarSpacingURL_new);
	});

	unload(function() {
		unloadSheet(navBarSpacingURL_current);
	});
}

function startup(data, reason) {
	initAddonNameAsync(data);

	loadSheet("styles/stylesheet.css");
	unload(function() {
		unloadSheet("styles/stylesheet.css");
	});

	loadObsPrefWCallback("increaseFonts", "nav-bar");
	loadObsPrefWCallback("autoSizeSearchBox", "nav-bar");
	loadAndHandleNBSpacing("navBarSpacing");
}

function shutdown(data, reason) {
	if (reason != APP_SHUTDOWN)
		unload();
}

function install() {
}
function uninstall() {
}
