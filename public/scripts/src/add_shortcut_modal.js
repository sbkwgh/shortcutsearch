var Store = require('./store.js');
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

module.exports = AddShortcutModal;