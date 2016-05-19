module.exports = {
	'!b': {
		site: 'bing',
		expansion: 'http://www.bing.com/search?q=__QUERY__'
	},
	'!w': {
		site: 'wikipedia',
		expansion: 'https://en.wikipedia.org/w/index.php?search=__QUERY__'
	},
	'!so' : {
		site: 'stackoverflow',
		expansion: 'http://stackoverflow.com/search?q=__QUERY__'
	},
	'!ddg': {
		site: 'duck duck go',
		expansion: 'https://duckduckgo.com/?q=__QUERY__'
	},
	'!gi': {
		site: 'google images',
		expansion: 'https://encrypted.google.com/search?q=__QUERY__&tbm=isch'
	},
	'!wkt': {
		site: 'wiktionary',
		expansion: 'https://en.wiktionary.org/w/index.php?search=__QUERY__&title=Special%3ASearch'
	}
};