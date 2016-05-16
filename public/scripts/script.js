var App = new Router(document.querySelector('#app'));

var Store = {
	get: function(name) {
		var items = JSON.parse(localStorage.getItem(name));
		return items || {};

	},
	add: function(name, item, value) {
		var items = this.get(name);
		items[item] = value;

		localStorage.setItem(name, JSON.stringify(items));
	},
	update: function(name, index, updatedItem) {
		var items =  this.get(name);
		items[index] = updatedItem;

		localStorage.setItem(name, JSON.stringify(items));
	},
	remove: function(name, index) {
		var items = this.get(name);
		delete items[index]

		localStorage.setItem(name, JSON.stringify(items));
	}
};

var AddShortcutModal = {};

AddShortcutModal.el = {};
AddShortcutModal.el.shortcut = document.querySelector('#shortcut_form-shortcut');
AddShortcutModal.el.expansion = document.querySelector('#shortcut_form-expansion');
AddShortcutModal.el.site = document.querySelector('#shortcut_form-site');
AddShortcutModal.el.submit = document.querySelector('#shortcut_form_submit');
AddShortcutModal.el.modal = document.querySelector('.modal');
AddShortcutModal.el.close = document.querySelector('.modal-top_bar-close');
AddShortcutModal.el.icon = document.querySelector('#add_shortcut-holder');


Object.defineProperties(AddShortcutModal, {
	shortcut: {
		get: function() { return AddShortcutModal.el.shortcut.value.trim(); },
		set: function(a) { AddShortcutModal.el.shortcut.value = a; }
	},
	expansion: {
		get: function() { return AddShortcutModal.el.expansion.value.trim(); },
		set: function(a) { AddShortcutModal.el.expansion.value = a; }
	},
	site: {
		get: function() { return AddShortcutModal.el.site.value.trim(); },
		set: function(a) { AddShortcutModal.el.site.value = a; }
	}
});

AddShortcutModal.clear = function() {
	this.shortcut = '';
	this.expansion = '';
	this.site = '';
};

AddShortcutModal.open = function() {
	this.clear();
	this.el.modal.classList.add('modal-show');
};
AddShortcutModal.close = function() {
	this.clear();
	this.el.modal.classList.remove('modal-show');
};

AddShortcutModal.validateUrl = function(value){
	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
};
AddShortcutModal.getDomainFromURL = function(url) {
	var a = document.createElement('a');

	a.setAttribute('href', url);

	if(!url.length || !this.validateUrl(url)) return '';

    return a.hostname || '';
}

AddShortcutModal.el.expansion.addEventListener('keyup', function() {
	AddShortcutModal.site = AddShortcutModal.getDomainFromURL(AddShortcutModal.expansion);
});
AddShortcutModal.el.submit.addEventListener('click', function(ev) {
	if(
		!AddShortcutModal.shortcut.length ||
		!AddShortcutModal.expansion.length ||
		!AddShortcutModal.expansion.match("__QUERY__") ||
		!AddShortcutModal.validateUrl(AddShortcutModal.expansion)
	) { return; }

	if(!AddShortcutModal.site.length) {
		AddShortcutModal.site = AddShortcutModal.getDomainFromURL(AddShortcutModal.expansion);
	}

	Store.add('shortcuts', AddShortcutModal.shortcut.toLowerCase(), {
		expansion: AddShortcutModal.expansion,
		site: AddShortcutModal.getDomainFromURL(AddShortcutModal.site)
	});

	App.refreshUi();

	AddShortcutModal.clear()

	AddShortcutModal.el.modal.classList.remove('modal-show');
});
AddShortcutModal.el.close.addEventListener('click', function() {
	AddShortcutModal.close();
});
AddShortcutModal.el.icon.addEventListener('click', function() {
	AddShortcutModal.open();
});

function downloadDefaults() {
	Request.get('/api/shortcuts', {}, function(shortcuts) {
		var defaults = {};
		var deleted = Store.get('deleted');

		for(var key in shortcuts) {
			if(!(key in deleted)) {
				defaults[key] = shortcuts[key];
			}
		}

		localStorage.setItem('defaults', JSON.stringify(defaults));
		App.refreshUi();
	});
}
downloadDefaults();


App.addRoute('/settings', function(templateContainer, templateHTML, data) {
	var template = Handlebars.compile(templateHTML);

	templateContainer.innerHTML = template(data);
});

App.addRoute('index', function(templateContainer, templateHTML, data) {
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
});

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


App.addRoute('/faq', function(templateContainer, templateHTML, data) {
	templateContainer.innerHTML = templateHTML;
});

App.addRoute('/search/:query', function(templateContainer, templateHTML, data) {
	var template = Handlebars.compile(document.querySelector('script[data-template="index"]').innerHTML);
	var query = data.query.toLowerCase();
	var shortcutFromQuery = query[0]==='!' ? query : '!' + query;
	var siteFromQuery = query[0]==='!' ? query.slice(1) : query;
	
	var shortcuts = Store.get('shortcuts');
	var defaults = Store.get('defaults');

	var shortcutsArr = [];
	var defaultsArr = [];

	for(var key in defaults) {
		if(!shortcuts[key] && (key.startsWith(shortcutFromQuery) || defaults[key].site.startsWith(siteFromQuery))) {
			defaultsArr.push({
				shortcut: key,
				expansion: defaults[key].expansion,
				site: defaults[key].site
			})
		}
	}

	for(var key in shortcuts) {
		if(key.startsWith(shortcutFromQuery) || shortcuts[key].site.startsWith(siteFromQuery)) {
			shortcutsArr.push({
				'shortcut': key,
				'expansion': shortcuts[key].expansion,
				'site': shortcuts[key].site
			});
		}
	}

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
	})
})

Tooltip.onClick(
	'#shortcut_form-shortcut',
	'<img height="20em" src="/public/img/chrome-crop.gif" />' +
	'This is what you\'ll enter after your search term to launch the shortcut <br/>	(e.g. to search wikipedia)'
);
Tooltip.onClick(
	'#shortcut_form-expansion',
	'To find the expansion url:' +
	'<ol><li>Enter a search term on the website you want to add.</li>' +
	'<li>Look at the address and where you see the search term you entered</li>' +
	'<li>Replace that text with <b>__QUERY__</b></li></ol>'
);

['mouseover', 'mouseout'].forEach(function(event) {
	document.body.addEventListener(event, function(ev) {
		if(!ev.target.parentElement.matches('tbody tr')) return;
		
		var tr = ev.target.parentElement;
		tr.classList.toggle('table-show_delete')
	});
})
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

document.body.addEventListener('click', function(ev) {
	if(
		ev.target.matches('#settings-reset') &&
		confirm('Are you sure you want to reset everything and delete all custom shortcuts?')
	) {
		delete localStorage.shortcuts;
		delete localStorage.deleted;

		downloadDefaults();
		location.hash = '';
		App.refreshUi();
	} else if(
		ev.target.matches('#settings-restore_defaults') &&
		confirm('Are you sure you want to reset the default shortcuts?')
	) {
		delete localStorage.deleted;

		downloadDefaults();
		location.hash = '';
		App.refreshUi();
	} else if(
		ev.target.matches('#settings-delete_shortcuts') &&
		confirm('Are you sure you want to delete all custom shortcuts?')
	) {
		delete localStorage.shortcuts;

		location.hash = '';
		App.refreshUi();
	}
});