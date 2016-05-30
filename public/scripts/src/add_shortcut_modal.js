var Store = require('./store.js');
var Modal = require('./modal.js');
var Tooltip = require('./tooltip.js');

var AddShortcutModal = new Modal(
	document.querySelector('#modal-add'),
	document.querySelector('#add_shortcut-holder')
);


AddShortcutModal.el.shortcut = document.querySelector('#shortcut_form-shortcut');
AddShortcutModal.el.expansion = document.querySelector('#shortcut_form-expansion');
AddShortcutModal.el.site = document.querySelector('#shortcut_form-site');
AddShortcutModal.el.submit = document.querySelector('#shortcut_form_submit');

AddShortcutModal.el.expansionError = document.querySelector('#shortcut_form-expansion_error');
AddShortcutModal.el.shortcutError = document.querySelector('#shortcut_form-shortcut_error');

AddShortcutModal.errors = {};
Object.defineProperties(AddShortcutModal.errors, {
	shortcut: {
		set: function(err) {
			console.log(err)
			AddShortcutModal.el.shortcutError.innerHTML = err;
		}
	},
	expansion: {
		set: function(err) {
			AddShortcutModal.el.expansionError.innerHTML = err;
		}
	}
});

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
	this.errors.shortcut = '';
	this.errors.expansion = '';
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
	AddShortcutModal.errors.shortcut = '';
	AddShortcutModal.errors.expansion = '';

	if(!AddShortcutModal.shortcut.length) {
		AddShortcutModal.errors.shortcut = 'Shortcut must not be empty'
	}
	if(!AddShortcutModal.expansion.length) {
		AddShortcutModal.errors.expansion = 'Expansion URL must not be empty'
	}
	if(!AddShortcutModal.expansion.match("{query}")) {
		AddShortcutModal.errors.expansion = 'Expansion URL must contain {query}'
	}
	if(!AddShortcutModal.validateUrl(AddShortcutModal.expansion)) {
		AddShortcutModal.errors.expansion = 'Expansion URL is not valid';
	}


	if(
		!AddShortcutModal.shortcut.length ||
		!AddShortcutModal.expansion.length ||
		!AddShortcutModal.expansion.match("{query}") ||
		!AddShortcutModal.validateUrl(AddShortcutModal.expansion)
	) { return; }

	if(!AddShortcutModal.site.length) {
		AddShortcutModal.site = AddShortcutModal.getDomainFromURL(AddShortcutModal.expansion);
	}

	Store.add('shortcuts', AddShortcutModal.shortcut.toLowerCase(), {
		expansion: AddShortcutModal.expansion,
		site: AddShortcutModal.site
	});

	App.refreshUi();

	AddShortcutModal.clear()

	AddShortcutModal.close();
});


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
	'<li>Replace that text with <span style="font-size: 0.8rem" class="pre pre-bold">{query}</span></li></ol>'
);

module.exports = AddShortcutModal;