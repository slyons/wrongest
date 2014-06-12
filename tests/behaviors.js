var debug = require('debug')("wrongest.behaviors");
var uuid = require("node-uuid");
var async = require("async");
var io = require('socket.io-client');
var util = require("util");

var doConnect = function(cb) {
	var client = io.connect("http://localhost:3000", options ={
		transports: ['websocket'],
		'force new connection': true,
		'reconnection delay' : 0,
		'reopen delay' : 0,
		multiplex: false
    });
    client.on("connect", function() {
    	cb(null, client);
    });
};

var doLogin = function(client, cb) {
	var username = uuid.v4();
	client.username = username;
	client.on("welcome", function(data) {
		cb(null, client, data);
	});
	client.emit("hello", username);
};

var doJoinRoom = function(client, rmName, cb) {
	client.on("join", function(data) {
		client.room = rmName;
		cb(null, client, data);
	});
	client.emit("join", rmName);
};

exports.login = async.compose(doLogin, doConnect);