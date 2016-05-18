var downloadDefaults = require('../download_defaults.js');

module.exports = function(templateContainer, templateHTML, data) {
	var template = Handlebars.compile(templateHTML);

	templateContainer.innerHTML = template(data);
};

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