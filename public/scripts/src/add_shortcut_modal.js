var Store = require('./store.js');
var Modal = require('./modal.js');
var AddShortcutModal = new Modal(
	document.querySelector('#modal-add'),
	document.querySelector('#add_shortcut-holder')
);


AddShortcutModal.el.shortcut = document.querySelector('#shortcut_form-shortcut');
AddShortcutModal.el.expansion = document.querySelector('#shortcut_form-expansion');
AddShortcutModal.el.site = document.querySelector('#shortcut_form-site');
AddShortcutModal.el.submit = document.querySelector('#shortcut_form_submit');


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

	AddShortcutModal.close();
});


module.exports = AddShortcutModal;