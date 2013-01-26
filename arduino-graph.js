var util = require('util');
var serialport = require("serialport");
var express = require('express');

// config stuff
var config = {port:8007};

// arduino stuff

var board = new serialport.SerialPort("/dev/tty.usbserial-A600dP0M", {
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});

var latestData;

board.on("open", function () {
  console.log('open');
  board.on('data', function(data) {
  	latestData = data;
  });
});

// web server stuff

function notFound(req, res) {
	if (config.debug) {
		res.send(404, config);
	} else {
		res.send(404);
	}
};

var app = express();

// raw html mode via ejs
app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
	res.render('home.html');
});

app.get('/gl', function(req, res) {
	res.render('gl.html');
});

app.get('/data', function(req, res) {
	res.send(latestData);
});

app.get('/static/:file', function(req, res) {
	res.sendfile('./static/'+req.params['file']);
});

app.all("*", notFound);

app.listen(config.port);
console.log('Listening on port ' + config.port);
