const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

const ADDON_NAME = "Better URL Bar";
const URLBAR_FORMATTING_PREF = "browser.urlbar.formatting.enabled";

var domainHighlight_o;

/* Function adapted from the extension "Restartless Restart" by Eric Vold */
(function(global) global.include = function include(src) {
  var o = {};
  Cu.import("resource://gre/modules/Services.jsm", o);
  var uri = o.Services.io.newURI(src, null, o.Services.io.newURI(__SCRIPT_URI_SPEC__, null, null));
  o.Services.scriptloader.loadSubScript(uri.spec, global);
})(this);

include("scripts/utils.js");
include("scripts/pref.js");
include("scripts/helpers.js");

function setURLBarFormattingPref() {
  domainHighlight_o = Services.prefs.getBoolPref(URLBAR_FORMATTING_PREF);

  function assignPrefValue() {
    Services.prefs.setBoolPref(URLBAR_FORMATTING_PREF, pref("allowURLBarFormatting"));
    printToLog(URLBAR_FORMATTING_PREF + " is set to " + pref("allowURLBarFormatting"));
  }

  assignPrefValue();
  pref.observe(["allowURLBarFormatting"], assignPrefValue);

  unload(function() {
    Services.prefs.setBoolPref(URLBAR_FORMATTING_PREF, domainHighlight_o);
  })
}

function startup(data, reason) {
  loadAndObserve("increaseFonts", "styles/increaseFonts.css");
  loadAndObserve("hideIdentityLabels", "styles/hideIdentityLabels.css");
  loadAndObserve("autoSizeSearchBox", "styles/autoSizeSearchBox.css");
  setURLBarFormattingPref();
}

function shutdown(data, reason) {
  if(reason == APP_SHUTDOWN)  return;
  unload();
}

function install() {}
function uninstall() {}
