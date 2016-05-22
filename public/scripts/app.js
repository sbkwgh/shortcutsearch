Handlebars = require('./src/handlebars.js');

var Router = require('./src/router.js');
var Request = require('./src/request.js');
var Store = require('./src/store.js');
var AddShortcutModal = require('./src/add_shortcut_modal.js');
var Modal = require('./src/modal.js');
var Tooltip = require('./src/tooltip.js');

require('./src/download_defaults.js')();

App = new Router(document.querySelector('#app'));

App.addRoute('index', require('./src/routes/index.js'));
App.addRoute('/faq', require('./src/routes/faq.js'));
App.addRoute('/search/:query', require('./src/routes/search.js'));
App.addRoute('/settings', require('./src/routes/settings.js'));

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

var platform = location.search.split('?installed=')[1];
var installedModal = new Modal(
	document.querySelector('#modal-installed')
);

if(platform || location.search.length) {
	if(platform !== 'win' || location.search.slice(1) !== 'win') {
		installedModal.open();
	}
}