var downloadDefaults = require('../download_defaults.js');
var confirmBox = require('../confirmBox.js');
var Store = require('../store.js');

module.exports = function(templateContainer, templateHTML, data) {
	var template = Handlebars.compile(templateHTML);
	var defaultSearch = Store.get('defaultSearch');

	templateContainer.innerHTML = template({
		defaultSearch: defaultSearch.name,
		hideSettingsMessage: localStorage.getItem('hideSettingsMessage')
	});

	[].forEach.call(document.querySelectorAll('#settings-default_search option'), function(option) {
		if(option.value === defaultSearch.name) {
			option.setAttribute('selected', 'true');
		}
	});
};

document.body.addEventListener('click', function(ev) {
	if(ev.target.matches('.message_box-small-close')) {
		var msg = document.querySelector('.message_box.message_box-small');
		msg.parentElement.removeChild(msg);

		localStorage.setItem('hideSettingsMessage', true);
	}

	if(ev.target.matches('#settings-reset')) {
		confirmBox(
			'Are you sure you want to reset everything and delete all custom shortcuts?',
			function(res) {
				if(res) {
					delete localStorage.shortcuts;
					delete localStorage.deleted;

					downloadDefaults();
					location.hash = '';
					App.refreshUi();
				}
			},
			'red'
		);
	} else if(ev.target.matches('#settings-restore_defaults')) {
		confirmBox(
			'Are you sure you want to reset the default shortcuts?',
			function(res) {
				if(res) {
					delete localStorage.deleted;

					downloadDefaults();
					location.hash = '';
					App.refreshUi();
				}
			}
		);
	} else if(ev.target.matches('#settings-delete_shortcuts')) {
		confirmBox(
			'Are you sure you want to delete all custom shortcuts?',
			function(res) {
				if(res) {
					delete localStorage.shortcuts;

					location.hash = '';
					App.refreshUi();
				}
			},
			'red'
		);
	}
});

document.body.addEventListener('change', function(ev) {
	if(ev.target.matches('#settings-default_search')) {
		var selected = ev.target.options[ev.target.selectedIndex].value;
		var URL;

		switch(selected) {
			case "Google":
				URL = 'https://encrypted.google.com/search?hl=en&q=';
				break;
			case "DuckDuckGo":
				URL = 'https://duckduckgo.com/?q=';
				break;
			case "Bing":
				URL = 'http://www.bing.com/search?q=';
				break;
			case "Yahoo!":
				URL = 'https://search.yahoo.com/search?p=';
				break;
			default:
				URL = 'https://encrypted.google.com/search?hl=en&q=';
		}

		Store.set('defaultSearch', {
			name: selected,
			URL: URL
		});
		document.querySelector('#settings-default_search-current').innerHTML = selected;
	}
});