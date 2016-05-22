var Store = require('../store.js');
var downloadDefaults = require('../download_defaults.js');

module.exports = function(templateContainer, templateHTML, data) {
	var template = Handlebars.compile(templateHTML);
	
	var shortcuts = Store.get('shortcuts');
	var defaults = Store.get('defaults');
	var defaultsArr = [];
	var shortcutsArr = [];

	for(var key in defaults) {
		if(!shortcuts[key]) {
			defaultsArr.push({
				shortcut: key,
				expansion: defaults[key].expansion,
				site: defaults[key].site
			})
		}
	}

	for(var key in shortcuts) {
		shortcutsArr.push({
			'shortcut': key,
			'expansion': shortcuts[key].expansion,
			'site': shortcuts[key].site
		});
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
			title: 'No shortcuts',
			message:
				'You haven\'t added any shortcuts yet. ' +
				'Click the + button to start'
		}
	})
};


['mouseover', 'mouseout'].forEach(function(event) {
	document.body.addEventListener(event, function(ev) {
		if(
			!ev.target.parentElement.matches('tbody tr') &&
			(ev.target.parentElement.parentElement &&
			!ev.target.parentElement.parentElement.matches('tbody tr'))
		) return;
		
		var tr = ev.target.parentElement;

		if(tr.nodeName === 'TD') {
			tr = ev.target.parentElement.parentElement;
		}

		tr.classList.toggle('table-show_delete')
	});
});


document.body.addEventListener('click', function(ev) {
	var shortcut = ev.target.parentElement.firstElementChild.innerHTML;
	var tr = ev.target.parentElement;

	if(tr.classList.contains('table-sub_header')) return;

	if(ev.target.matches('tbody tr td:last-child')) {
		var really = confirm('Are you sure you want to delete the shortcut "' + shortcut + '"? You can\'t undo this action.');

		if(!really) return;

		if(tr.getAttribute('data-default')) {
			Store.add('deleted', shortcut, Store.get('defaults')[shortcut]);
			tr.parentElement.removeChild(tr);
			downloadDefaults();
		} else {
			Store.remove('shortcuts', shortcut);
			App.refreshUi();
		}

	}
});