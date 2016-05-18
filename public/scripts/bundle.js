/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Router = __webpack_require__(1);
	var Request = __webpack_require__(2);
	var Store = __webpack_require__(3);
	var AddShortcutModal = __webpack_require__(4);
	var Tooltip = __webpack_require__(5);

	__webpack_require__(6)();

	App = new Router(document.querySelector('#app'));

	App.addRoute('index', __webpack_require__(7));
	App.addRoute('/faq', __webpack_require__(8));
	App.addRoute('/search/:query', __webpack_require__(9));
	App.addRoute('/settings', __webpack_require__(10));

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	var Router = function(templateContainer) {
		var self = this;

		this.routes = {};
		this.templateContainer = templateContainer;

		this.refreshUi = function() {
			var event = new Event('refreshui');
			window.dispatchEvent(event);
		};

		
		['load', 'hashchange', 'refreshui'].forEach(function(event) {

			window.addEventListener(event, function() {
				var hash =  location.hash.slice(1);
				var routeHandler;

				if(hash.slice(-1) === '/') hash = hash.slice(0, -1);

				var link = document.querySelector('.menu-menu_item[data-url="' + hash + '"]');

				if(hash.trim() === '') hash = 'index';

				var selected = document.querySelector('.menu-menu_item_selected');
				if(selected) {
					selected.classList.remove('menu-menu_item_selected');
				}
				if(link) {
					link.classList.add('menu-menu_item_selected');
				}

				routeHandler = self.getRouteHandlerFromRoute(hash);

				if('ga' in window) ga('send', 'pageview', '/' + hash);

				if(!hash || !routeHandler) {
					if(hash[0] === '/') hash = hash.slice(1);
					routeHandler = self.getRouteHandlerFromRoute('404/' + hash);
				}

				var template = document.querySelector('script[data-template="' + (routeHandler || {}).templateName + '"]');

				if(routeHandler.handler.onLoad && event === 'load') {
					routeHandler.handler.onLoad(function() {
						routeHandler.handler.allEvents(self.templateContainer, template.innerHTML, routeHandler.params);
					}, self.templateContainer, template.innerHTML, routeHandler.params);
				} else {
					routeHandler.handler.allEvents(self.templateContainer, template.innerHTML, routeHandler.params);
				}
			})
		});

		this.change = function(templateName) {
			location.hash = templateName;
		}

		this.addRoute = function(route, allEvents, onLoad) {
			var routeSegments;
			var routeSegment;
			var subRoute = this.routes;

			if(route[0] === '/') {
				route = route.slice(1)
			}

			routeSegments = route.split('/');

			for(var i = 0; i < routeSegments.length; i++) {
				routeSegment = routeSegments[i];
				if(!subRoute[routeSegment]) {
					subRoute[routeSegment] = {};
				}

				if(i === routeSegments.length-1) {
					subRoute[routeSegment] = {
						allEvents: allEvents,
						onLoad: onLoad
					};
				}

				subRoute = subRoute[routeSegment];
			}
		};

		this.getRouteHandlerFromRoute = function(route) {
			var routeSegments = route.split('/');
			var templateName = ''
			var subRoutes = this.routes;
			var routeSegment;
			var returnSegments = {};

			self.templateName = '';

			for(var i = 0; i < routeSegments.length; i++) {
				
				for(routeSegment in subRoutes) {
					if(routeSegment[0] === ':') {
						returnSegments[routeSegment.slice(1)] = routeSegments[i];
						subRoutes = subRoutes[routeSegment]
						templateName += routeSegment + '/'
						break;
					} else if(routeSegment === routeSegments[i]) {
						subRoutes = subRoutes[routeSegment]
						templateName += routeSegment + 	'/'
						break;
					}
				}
				
				if(i === routeSegments.length-1 && typeof subRoutes['allEvents'] === 'function') {
					return {
						handler: {
							onLoad: subRoutes.onLoad,
							allEvents: subRoutes.allEvents
						},
						templateName: templateName.slice(0, -1),
						params: returnSegments
					};
				}
			}
		}
	};

	module.exports = Router;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var Request = {};
	Request.serializeData = function(object) {
		var temp = '';
		var serializedString = '';
		for(var key in object) {
			if(object[key] === undefined) continue;
			if(typeof object[key] === 'object') {
				temp = '&' + key + '=' + encodeURIComponent(JSON.stringify(object[key]));
			} else {
				temp = '&' + key + '=' + encodeURIComponent(object[key]);
			}
			serializedString += temp;
		}
		return serializedString.slice(1);
	};
	Request.request = function(method, url, data, cb) {
		var http = new XMLHttpRequest();

		http.addEventListener('load', function() {
			var json;

			try {
				json = JSON.parse(this.responseText)
			} catch(err) {
				console.log(err);
				console.log(this.responseText);
			}

			if(cb) {
				cb(json);
			}
		})

		http.open(method, url, true);
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		if(typeof data !== 'function') {
			http.send(this.serializeData(data));
		} else {
			http.send();
		}
	}
	Request.post = function(url, data, cb) {
		this.request('post', url, data, cb);
	};
	Request.delete = function(url, data, cb) {
		this.request('delete', url, data, cb);
	};
	Request.put = function(url, data, cb) {
		this.request('put', url, data, cb);
	};
	Request.get = function(url, data, cb) {
		var http = new XMLHttpRequest();

		http.addEventListener('load', function() {
			if(cb) {
				cb(JSON.parse(this.responseText));
			}
		})

		http.open('GET', url + '/?' + this.serializeData(data || {}), true);
		http.send();
	};

	var Model = {
		getType: function(val) {
			if(typeof val !== 'object') {
				return typeof val;
			} else if(Array.isArray(val)) {
				return 'array';
			} else if(val === null) {
				return 'null';
			} else {
				return typeof val;
			}
		},
		new: function(modelName, modelDefn, updateDelay, updateFunction) {
			var modelFactory = function(params) {
				var self = this;
				var _data = {};

				this.data = {};
				this.changedObject = {};

				if(updateFunction) {
					this.updateFunction = updateFunction.bind(this);
				}

				this.save = function(cb) {
					var url = Model.rootUrl + '/' + modelFactory.modelName;
					var dataNoUndefined = {};

					for(var key in _data) {
						if(_data[key] !== undefined) {
							dataNoUndefined[key] = _data[key];
						}
					}

					Request.post(url, dataNoUndefined, function(modelInstance) {
						if(modelInstance._id) {
							self.data._id = modelInstance._id;
						}
						cb(modelInstance.error, modelInstance);
					})
				}

				this.delete = function(cb) {
					if(!this.data[modelFactory.primaryKey]) {
						throw new Error('Model instance does not have primary key field "' + modelFactory.primaryKey + '"');
						return;
					}
					var url = Model.rootUrl + '/' + modelFactory.modelName + '/' + this.data[modelFactory.primaryKey];
					Request.delete(url, function(result) {
						cb(result.error, result);
					})
				}

				this.update = function(cb, specificData) {
					if(!this.data[modelFactory.primaryKey]) {
						throw new Error('Model instance does not have primary key field "' + modelFactory.primaryKey + '"');
						return;
					}
					var url = Model.rootUrl + '/' + modelFactory.modelName + '/' + this.data[modelFactory.primaryKey];
					Request.put(url, specificData || _data, function(modelInstance) {
						cb(modelInstance.error, modelInstance);
					})
				}
				

				this.post = function(url, cb) {	
					var url = Model.rootUrl + '/' + modelFactory.modelName + '/' + url;
					Request.post(url, _data, cb);
				}

				//Create getter/setter for each field
				// which checks type on setting
				function getSetProp(proxyObj, prop, originalObj, type) {
					Object.defineProperty(proxyObj, prop, {
						get: function() {
							return originalObj[prop];
						},
						set: function(val) {
							if(Model.getType(val) !== type) {
								throw new TypeError('Field "' + prop + '" must be of type "' + type + '"');
							} else {
								originalObj[prop] = val;
								self.changedObject[prop] = val;
							}
						}
					})
				}
				for(var prop in modelDefn) {
					var type = modelDefn[prop].type || modelDefn[prop];

					if(modelDefn[prop].primaryKey) {
						modelFactory.primaryKey = prop;
					}

					if(typeof params[prop] !== undefined) {
						_data[prop] = params[prop];
					}

					getSetProp(self.data, prop, _data, type);
				}

				setInterval(function() {
					if(Object.keys(self.changedObject).length && self.updateFunction) {
						self.update(self.updateFunction, self.changedObject)
						self.changedObject = {};
					}
				}, modelFactory.updateDelay)
			};

			modelFactory.modelName = modelName;

			modelFactory.get = function(idOrCb, cb) {
				var url = Model.rootUrl + '/' + modelFactory.modelName;
				if(typeof idOrCb !== 'function') {
					url += '/' + idOrCb;
				}
				
				Request.get(url, {}, function(modelInstances) {
					if(cb) {
						cb(modelInstances.error, modelInstances);
					} else {
						idOrCb(modelInstances.error, modelInstances);
					}
				})
			};

			modelFactory.updateDelay = updateDelay;
			
			return modelFactory;
		}
	};

	module.exports = Request;

/***/ },
/* 3 */
/***/ function(module, exports) {

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

	module.exports = Store;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Store = __webpack_require__(3);
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	var Tooltip = {};
	Tooltip.create = function(text, primaryButtonObject, secondaryButtonObject) {
		var tooltip = document.createElement('div');
		var tooltipButtons = document.createElement('div');
		var triangleWhite = document.createElement('div');
		var triangleGray = document.createElement('div');
		var primaryButton, secondaryButton;

		function removeToolTip() {
			tooltip.parentNode.removeChild(tooltip);
			document.querySelector('.tooltip-modal-cover').classList.toggle('tooltip-modal-cover-hidden');
		}

		tooltip.classList.add('tooltip');
		tooltipButtons.classList.add('tooltip-buttons');
		triangleWhite.setAttribute('class', 'triangle-white');
		triangleGray.setAttribute('class', 'triangle-gray');

		if(primaryButtonObject) {
			primaryButton = document.createElement('div');
			primaryButton.setAttribute(
				'class',
				'button' + (primaryButtonObject.colour ? ' btn-' + primaryButtonObject.colour : '')
			);
			primaryButton.innerHTML = primaryButtonObject.text;

			primaryButton.addEventListener('click', function(ev) {
				if(primaryButtonObject.eventListener) {
					ev.removeTooltip = removeToolTip;
					primaryButtonObject.eventListener(ev);
				} else {
					removeToolTip();
				}
			});

			tooltipButtons.appendChild(primaryButton);
		}
		if(secondaryButtonObject) {
			secondaryButton = document.createElement('div');
			secondaryButton.setAttribute(
				'class',
				'button' + (secondaryButtonObject.colour ? ' btn-' + secondaryButtonObject.colour : '')
			);
			secondaryButton.innerHTML = secondaryButtonObject.text;

			secondaryButton.addEventListener('click', function(ev) {
				if(secondaryButtonObject.eventListener) {
					ev.removeTooltip = removeToolTip;
					secondaryButtonObject.eventListener(ev);
				} else {
					removeToolTip();
				}
			});

			tooltipButtons.appendChild(secondaryButton);
		}

		if(typeof text === 'object') {
			tooltip.appendChild(text);
		} else {
			tooltip.innerHTML = text;
		}
		tooltip.appendChild(triangleGray);
		tooltip.appendChild(triangleWhite);
		tooltip.appendChild(tooltipButtons);

		return tooltip;
	}

	Tooltip.isTooltip = function(el) {
		if(el === document.body || el === null) {
			return false;
		} else if(el.classList.contains('tooltip')) {
			return el;
		} else {
			return this.isTooltip(el.parentNode);
		}
	}

	Tooltip.onClick = function(querySelector, text, primaryButtonObject, secondaryButtonObject) {
		if(!this.createdModalCover) {
			var modalDiv = document.createElement('div');
			modalDiv.setAttribute('class', 'tooltip-modal-cover tooltip-modal-cover-hidden');

			document.body.appendChild(modalDiv);

			document.body.addEventListener('click', function(ev) {
				if(!document.querySelector('.tooltip')) return;

				if(
					!ev.target.contains(document.querySelector('.tooltip')) ||
					!ev.target.contains(document.querySelector(querySelector))
				) {
					[].forEach.call(document.body.querySelectorAll('.tooltip'), function(tooltip) {
						tooltip.parentNode.removeChild(tooltip);
					});
					document.body.querySelector('.tooltip-modal-cover').classList.add('tooltip-modal-cover-hidden');
				}
			})

			this.createdModalCover = true;
		}
		document.body.addEventListener('click', function(ev) {
			var el = document.querySelector(querySelector);
			if(!el || !el.contains(ev.target)) return;
			
			[].forEach.call(document.body.querySelectorAll('.tooltip'), function(tooltip) {
				tooltip.parentNode.removeChild(tooltip);
			})

			var tooltip = Tooltip.create(
				text,
				primaryButtonObject,
				secondaryButtonObject
			);

			var rect = el.getBoundingClientRect();
			var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

			document.querySelector('.tooltip-modal-cover').classList.toggle('tooltip-modal-cover-hidden');

			tooltip.style.left = 'calc(' + rect.left + 'px + (10rem - ' + el.clientWidth + 'px) / -2)';
			tooltip.style.top = 'calc(0.5rem + ' + rect.bottom + 'px)';

			tooltip.querySelector('.triangle-gray').style.left = 'calc(' + rect.left + 'px + ' + el.offsetWidth + 'px /2 - 0.5rem + 1px)';
			tooltip.querySelector('.triangle-gray').style.top = rect.bottom + 'px';

			tooltip.querySelector('.triangle-white').style.left = 'calc(' + rect.left + 'px + ' + el.offsetWidth + 'px /2 - 0.5rem + 3px)';
			tooltip.querySelector('.triangle-white').style.top = rect.bottom + 3 + 'px';

			if(!Tooltip.isTooltip(ev.target) && !ev.target.querySelector('.tooltip')) {
				document.body.appendChild(tooltip);

				if(tooltip.getBoundingClientRect().right > viewPortWidth) {
					tooltip.style.left = '';
					tooltip.style.right = '0.5rem';
				} else if(tooltip.getBoundingClientRect().left <= 16) {
					tooltip.style.left = '0.5rem';
				}
			}
		})
	}

	module.exports = Tooltip;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Request = __webpack_require__(2);
	var Store = __webpack_require__(3);

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Store = __webpack_require__(3);
	var downloadDefaults = __webpack_require__(6);

	module.exports = function(templateContainer, templateHTML, data) {
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
	};


	['mouseover', 'mouseout'].forEach(function(event) {
		document.body.addEventListener(event, function(ev) {
			if(!ev.target.parentElement.matches('tbody tr')) return;
			
			var tr = ev.target.parentElement;
			tr.classList.toggle('table-show_delete')
		});
	});


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

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(templateContainer, templateHTML, data) {
		templateContainer.innerHTML = templateHTML;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Store = __webpack_require__(3);

	module.exports = function(templateContainer, templateHTML, data) {
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
		});
	};

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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var downloadDefaults = __webpack_require__(6);

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

/***/ }
/******/ ]);