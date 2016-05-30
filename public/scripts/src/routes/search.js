var Store = require('../store.js');

module.exports = function(templateContainer, templateHTML, data) {
	var template = Handlebars.compile(document.querySelector('script[data-template="index"]').innerHTML);
	var query = data.query.toLowerCase();
	var shortcutFromQuery = query[0]==='!' ? query : '!' + query;
	var siteFromQuery = query[0]==='!' ? query.slice(1) : query;

	var shortcuts = Store.get('shortcuts');
	var defaults = Store.get('defaults');

	var shortcutsArr = [];
	var defaultsArr = [];

	for(var key in defaults) {
		if(
			!shortcuts[key] &&
			(key.toLowerCase().startsWith(shortcutFromQuery.toLowerCase()) || 
			defaults[key].site.toLowerCase().startsWith(siteFromQuery.toLowerCase()))
		) {
			defaultsArr.push({
				shortcut: key,
				expansion: defaults[key].expansion,
				site: defaults[key].site
			})
		}
	}

	for(var key in shortcuts) {
		if(
			key.toLowerCase().startsWith(shortcutFromQuery.toLowerCase) ||
			shortcuts[key].site.toLowerCase().startsWith(siteFromQuery.toLowerCase)
		) {
			shortcutsArr.push({
				'shortcut': key,
				'expansion': shortcuts[key].expansion,
				'site': shortcuts[key].site
			});
		}
	}

	[defaultsArr, shortcutsArr].forEach(function(item) {
		item.sort(function(a,b) {
			var a = (a.shortcut[0] === '!') ? a.shortcut.slice(1) : a.shortcut;
			var b = (b.shortcut[0] === '!') ? b.shortcut.slice(1) : b.shortcut;

			return a.localeCompare(b);
		});
	});

	templateContainer.innerHTML = template({
		'anyShortcuts': shortcutsArr.length || defaultsArr.length,
		'shortcuts':shortcutsArr,
		'defaults': defaultsArr,
		'noneFound': {
			title: 'No shortcuts found',
			message:
				'Try a different search term, or add your own shortcut. ' +
				'Click the + button to start'
		}
	});
};

document.querySelector('#search_box input').addEventListener('keyup', function() {
	var query = this.value.trim();

	if(!query.length) {
		location.hash = '';
	} else {
		location.hash = 'search/' + query;
	}
});
document.querySelector('#search_box input').addEventListener('click', function() {
	var query = this.value.trim();

	if(!query.length) {
		location.hash = '';
	}
});
