var express = require('express');
var path = require('path');
var compress = require('compression');

var shortcuts = require('./shortcuts.js');

var app = express();

app.use(compress());
app.use('/public', express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, './public', 'index.html'));
});
app.get('/googleac10c630c73587c2.html', function(req, res) {
	res.sendFile(path.join(__dirname, './public', 'googleac10c630c73587c2.html'));
});
app.get('/opensearch.xml', function(req, res) {
	res.sendFile(path.join(__dirname, './public', 'opensearch.xml'));
});
app.get('/redirect', function(req, res) {
	res.sendFile(path.join(__dirname, './public', 'redirect.html'));
});
app.get('/api/shortcuts', function(req, res) {
	res.json(shortcuts);
});

if(!process.env.PRODUCTION) app.use(require('morgan')('dev'));

app.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + (process.env.PORT || 3000))
});