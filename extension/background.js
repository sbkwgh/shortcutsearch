chrome.runtime.onInstalled.addListener(function (object) {
	chrome.runtime.getPlatformInfo(function(info) {
		chrome.tabs.create({
			url: "https://shortcutsearch.herokuapp.com/?installed=" + info.os
		}, function (tab) {});
	});
});