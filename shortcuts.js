module.exports = {
	'!b': {
		site: 'bing',
		expansion: 'http://www.bing.com/search?q={query}'
	},
	'!w': {
		site: 'wikipedia',
		expansion: 'https://en.wikipedia.org/w/index.php?search={query}'
	},
	'!so' : {
		site: 'stackoverflow',
		expansion: 'http://stackoverflow.com/search?q={query}'
	},
	'!ddg': {
		site: 'duck duck go',
		expansion: 'https://duckduckgo.com/?q={query}'
	},
	'!gi': {
		site: 'google images',
		expansion: 'https://encrypted.google.com/search?q={query}&tbm=isch'
	},
	'!wkt': {
		site: 'wiktionary',
		expansion: 'https://en.wiktionary.org/w/index.php?search={query}&title=Special%3ASearch'
	},
	'!bbc': {
		site: 'bbc.co.uk',
		expansion: 'http://www.bbc.co.uk/search?q={query}'
	},
	'!yt': {
		site: 'YouTube',
		expansion: 'https://www.youtube.com/results?search_query={query}'
	},
	'!yh': {
		site: 'Yahoo',
		expansion: 'https://search.yahoo.com/search?p={query}'
	},
	'!a': {
		site: 'Amazon.com',
		expansion: 'https://www.amazon.com/s/?field-keywords={query}'
	},
	'!tw': {
		site: 'Twitter',
		expansion: 'https://twitter.com/search?q={query}&src=typd'
	},
	'!gt': {
		site: 'Google Translate',
		expansion:'https://translate.google.com/#{1}/{2}/{query}'
	}
};