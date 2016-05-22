var Modal = function(root, icon) {
	var self = this;

	this.root = root;

	this.el = {};
	this.el.modal = this.root;
	this.el.icon = icon;
	this.el.close = this.root.querySelector('.modal-top_bar-close');

	this.open = function() {
		if(this.clear) {
			this.clear();
		}
		this.el.modal.classList.add('modal-show');
		document.querySelector('.modal-cover').classList.add('modal-cover-show');
	};

	this.close = function() {
		if(this.clear) {
			this.clear();
		}

		this.el.modal.classList.remove('modal-show');
		document.querySelector('.modal-cover').classList.remove('modal-cover-show');
	};

	this.el.close.addEventListener('click', function() {
		self.close();

		if(location.search.match('installed')) {
			location.search = '';
		}
	});

	if(this.el.icon) {
		this.el.icon.addEventListener('click', function() {
			self.open();
		});
	}

};

module.exports = Modal;