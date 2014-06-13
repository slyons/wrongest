var uuid = require("node-uuid");
var async = require("async");

exports.usernameGG = function(usernameFunc) {
	return function(client, cb) {
		async.nextTick(function(){
			cb(null, client, "user-"+usernameFunc());
		});
	}
};

exports.roomGG = function(roomnameFunc) {
	return function(client, cb) {
		async.nextTick(function() {
			cb(null, "room-"+roomnameFunc(), client);
		});
	}
};
