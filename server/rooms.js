/*
	rooms.js

	Wrongest rooms/user logic

*/

var events = require('events'),
	util   = require('util'),
	uuid   = require("node-uuid"),
	debug  = require("debug");

var people = {},
	rooms  = {},
	clients = {};

function Room(name, id, owner, io) {
	this.name = name;
	this.id = id;
	this.owner = owner;
	this.players = [];
	this.status = "available";
	this.log = debug("wrongest-room-" + name);
};

Room.prototype.addPerson = function(personID) {
	if (this.status === "available" && !(personID in this.players)) {
		this.players.push(personID);
		this.log("Player " + personID + " joined. Players:" + this.players);
	}
};

Room.prototype.removePerson = function(personID) {
	this.players.splice(this.players.indexOf(personID), 1)
	this.log("Player " + personID + " left. Players:" + this.players);
};

Room.prototype.containsPlayer = function(playerID) {
	return playerID in this.players;
};

Room.prototype.playerCount = function() {
	return this.players.length;
};

exports.start = function(io) {
	people = {};
	rooms = {};
	clients = {};

	io.on("connection", function (client){
		var log = debug("wrongest.rooms."+client.id);

		client.on("hello", function (name) {
			log("hello:", arguments);
			roomID = null;
			
			for(var index in clients)
			{
				var existingClient = clients[index];
				if(people[existingClient.id] && people[existingClient.id].name == name)
				{
					log("Username %s already exists", name);
					client.emit("welcome", { success:false, message: "Username already in use."});
					return;
				}
			}
			people[client.id] = {"name": name, "room": roomID};
			client.emit("welcome", {success:true, message:"You have connected to the server."});
			clients[client.id] = client;
		});

		client.on("join", function(roomName){
			log("joining %s", roomName);

			if(!(client.id in people)) {
				log("Has not hello'd yet!");
				client.emit("join", {success:false, message:"You must be polite and say hello first."});
			} else {

				if(people[client.id].room !== null) {
					log("Is trying to double-dip");
					client.emit("join", {success:false, message:"You are already in a room!"});
				} else {
					var room = rooms[roomName] || new Room(roomName, uuid.v4(), client.id, io);
					if(room.status === "available")
					{
						log("has joined room %s", roomName);
						// Should probably improve this at some point
						room.addPerson(people[client.id].name);
						people[client.id].room = roomName;
						client.room = roomName;
						client.join(roomName);
						client.emit("join", {success:true});
						io.sockets.in(roomName).emit("roomUpdate", {success:true, players:room.players, roomOwner:room.owner});
					}
					else
					{
						log("Room unavailable!");
						client.emit("join", {success:false, message:"Room locked"});
					}
					rooms[roomName] = room;
				}
			}

		});

		var clientQuits = function() {
			log("Quitting");
			if(client.id in clients) {
				var c = clients[client.id];
				if(people[client.id].room !== null) {
					var roomName = c.room;
					var room = rooms[roomName];
					room.removePerson(people[client.id].name);
					c.leave(roomName);
					io.sockets.in(roomName).emit("roomUpdate", {success:true, players:room.players, roomOwner:room.owner});
				}

				delete people[client.id];
				delete clients[client.id];
			}
		};

		client.on("disconnect", clientQuits);
		client.on("goodbye", clientQuits);
	});

	io.of("/debug")
	.on('connection', function(client) {
		client.on("people", function(callback){
			callback(people);
		});

		client.on("rooms", function(callback){
			callback(rooms);
		});

		client.on("clients", function(callback){
			callback(clients);
		});

		client.on("reset", function(){
			people = {};
			rooms = {};
			clients = {};
		});
	})
};
