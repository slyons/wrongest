/*
	game.js

	Wrongest game logic

*/

var events = require('events'),
	util   = require('util'),
	uuid   = require("node-uuid");

var people = {},
	rooms  = {},
	clients = [];

exports.start = function(io) {
	people = {};
	rooms = {};
	clients = [];

	io.on("connection", function (client){
		client.on("hello", function (name) {
			roomID = null;
			
			for(var index in clients)
			{
				var existingClient = clients[index];
				if(people[existingClient.id] && people[existingClient.id].name == name)
				{
					client.emit("welcome", { success:false, message: "Username already in use."});
					return;
				}
			}
			people[client.id] = {"name": name, "room": roomID};
			client.emit("welcome", {success:true, message:"You have connected to the server."});
			clients.push(client);
		});

		client.on("join", function(roomName){
			if(!(client.id in people)) {
				client.emit("join", {success:false, message:"You must be polite and say hello first."});
				console.log(people);
				console.log(client.id);
			} else {

				if(people[client.id].room !== null) {
					client.emit("join", {success:false, message:"You are already in a room!"});

				} else {

					var room = rooms[roomName] || new Room(roomName, uuid.v4(), client.id);
					if(room.status === "available")
					{
						room.addPerson(client.id);
						people[client.id].room = roomName;
						client.room = roomName;
						client.join(roomName);
						io.sockets.in(roomName).emit("roomUpdate", {success:true, players:room.players, roomOwner:room.owner});
					}
					rooms[roomName] = room;
				}
			}

		});

		client.on("createRoom", function (name) {
			if (people[client.id].room === null) {
				var id = uuid.v4();
				var room = new Room(name, id, client.id);
				rooms[id] = room;
				client.room = name;
				client.join(client.room);
				room.addPerson(client.id);
			}
		});
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
	})
};

function Room(name, id, owner) {
	this.name = name;
	this.id = id;
	this.owner = owner;
	this.players = [];
	this.status = "available";

	events.EventEmitter.call(this);
};

util.inherits(Room, events.EventEmitter);

Room.prototype.addPerson = function(personID) {
	if (this.status === "available" && !(personID in this.players)) {
		this.players.push(personID);
		this.emit("playerJoined", personID);
	}
};

Room.prototype.containsPlayer = function(playerID) {
	return playerID in this.players;
}
