Handlebars = require('./src/handlebars.js');

var Router = require('./src/router.js');
var Request = require('./src/request.js');
var Store = require('./src/store.js');
var AddShortcutModal = require('./src/add_shortcut_modal.js');
var Modal = require('./src/modal.js');

require('./src/download_defaults.js')();

App = new Router(document.querySelector('#app'));

App.addRoute('index', require('./src/routes/index.js'));
App.addRoute('/faq', require('./src/routes/faq.js'));
App.addRoute('/search/:query', require('./src/routes/search.js'));
App.addRoute('/settings', require('./src/routes/settings.js'));

if(!Store.get('defaultSearch').name) {
	Store.set('defaultSearch', {
		name: 'Google',
		URL: 'https://encrypted.google.com/search?hl=en&q='
	});
}

var installedModal = new Modal(
	document.querySelector('#modal-installed')
);
if(location.search.length && !location.search.match('win')) {
	installedModal.open();
}