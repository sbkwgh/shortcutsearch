chrome.runtime.onInstalled.addListener(function (object) {
	chrome.tabs.create({url: "https://shortcutsearch.herokuapp.com/"}, function (tab) {});
});