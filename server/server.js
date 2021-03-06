/*
	The Wrongest Game

	Everybody lies, nobody wins
*/

var debug = require("debug")("wrongest.root");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var port = process.env.PORT || 3000;

app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

exports.start = function(listenPort) {
	if (listenPort == undefined) {
		listenPort = port;
	}
	server.listen(listenPort, function() {
		debug('Server listening at port %d', listenPort);
	});

	var wrongestGame = require("./rooms.js");
	wrongestGame.start(io);
};

exports.stop = function() {
	server.close();
	debug("Closing server...");
};


