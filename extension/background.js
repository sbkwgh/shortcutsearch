chrome.runtime.onInstalled.addListener(function (object) {
	chrome.tabs.create({url: "http://localhost:3000"}, function (tab) {});
});