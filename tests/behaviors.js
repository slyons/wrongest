var debug = require('debug')("wrongest.behaviors");
var uuid = require("node-uuid");
var async = require("async");
var io = require('socket.io-client');
var util = require("util");
var testutils = require("./utils.js");

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

var doDisconnect = function(client, cb) {
	client.on("disconnect", function() {
		cb(null, client);
	});
	client.disconnect();
};
exports.disconnect = doDisconnect;

/*
	LOGIN

	Send: ("hello", <username>)
	Receive: ("welcome", {success:<boolean>, message:<string>})
*/
var doLogin = function(client, username, cb) {
	client.username = username;


	client.on("welcome", function(data) {
		cb(null, client, data);
	});
	client.emit("hello", username);
};

/*
	JOIN

	Send: ("join", <room name>)
	Receive: ("join", {success:<boolean>, message:<string>})
*/
var doJoinRoom = function(rmName, client, cb) {
	client.on("join", function(data) {
		client.room = rmName;
		cb(null, client, data);
	});
	client.emit("join", rmName);
};

// Generates random usernames
var generateRandomUsername = testutils.usernameGG(uuid.v4);

exports.login = async.compose(doLogin, generateRandomUsername, doConnect);
exports.loginWithUsername = function(username) {
	return async.compose(
		doLogin,
		testutils.usernameGG(function(){ return username; }),
		doConnect);
};

exports.loginXUsers = function(userCount, callback) {
	async.times(userCount, function(n, next) {
		exports.login(next);
	}, function(err, clients){
		async.every(clients, function(c, cb){
			cb(c.connected);
		}, function(result) {
			callback(clients, {success:result});
		});
	});
}

// Generates random room names
var generateRandomRoomName = testutils.roomGG(uuid.v4);

// Partial room joining function. Simply give it a client and a callback
// and it will send the client there
exports.joinRoom = doJoinRoom;
exports.joinRandomRoom = async.compose(doJoinRoom, generateRandomRoomName);

