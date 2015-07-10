// requirejs
var requirejs = require('requirejs');
requirejs.config({
  baseUrl: __dirname + '/js',
  nodeRequire: require
});
require = requirejs;

// mount index and js
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/js'));

app.listen(process.env.PORT || 3000);
