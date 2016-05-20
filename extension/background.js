chrome.runtime.onInstalled.addListener(function (object) {
	chrome.runtime.getPlatformInfo(function(info) {
		chrome.tabs.create({
			url: "https://shortcutsearch.herokuapp.com/?" + info.os
		}, function (tab) {});
	});
});