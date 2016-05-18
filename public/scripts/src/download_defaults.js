var Request = require('./request.js');
var Store = require('./store.js');

module.exports = function() {
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