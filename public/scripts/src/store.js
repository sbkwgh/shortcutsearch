var Store = {
	get: function(name) {
		var items = JSON.parse(localStorage.getItem(name));
		return items || {};

	},
	set: function(name, value) {
		var item = JSON.stringify(value);

		localStorage.setItem(name, item);
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

module.exports = Store;