var io = require('socket.io-client'),
	assert = require('assert'),
	util = require('util'),
	expect = require('expect.js'),
	async = require("async"),
	behaviors = require("./tests/behaviors.js");

var gameServer = require("./server/server.js");

describe("The Wrongest unit tests", function() {

	var client1, client2;
	var debugClient;

	before(function(done){
		gameServer.start();

		debugClient = io.connect("http://localhost:3000/debug", options ={
	      transports: ['websocket'],
	      'force new connection': true,
	      'reconnection delay' : 0,
	      'reopen delay' : 0,
	      multiplex: false
	    });

		done();
	});

	after(function(done){

		gameServer.stop();

		debugClient.disconnect();

		done();
	});

	beforeEach(function(done){

		client1 = io.connect("http://localhost:3000", options ={
	      transports: ['websocket'],
	      'force new connection': true,
	      'reconnection delay' : 0,
	      'reopen delay' : 0,
	      multiplex: false
	      });

		client2 = io.connect("http://localhost:3000", options ={
	      transports: ['websocket'],
	      'force new connection': true,
	      'reconnection delay' : 0,
	      'reopen delay' : 0,
	      multiplex: false
	      });

		done();
	});

	afterEach(function(done){

		if(client2.connected) {
			client2.disconnect();
		}

		if(client1.connected) {
			client1.disconnect();
		}

		debugClient.emit("reset");

		done();
	});

	/* 
	
		The most basic connection tests. Connecting, disconnecting

	*/
	describe("pre-game", function() {

		it("must allow clients to login", function(done) {
			behaviors.login(function(err, client, data) {
				expect(data.success).to.be.ok();
				expect(client.connected).to.be.ok();
				done();
			});
		});

		it("must cleanup clients when they leave", function(done) {
			behaviors.login(function(err, client, data) {
				expect(data.success).to.be.ok();
				expect(client.connected).to.be.ok();
				behaviors.disconnect(client, function(client){
					setTimeout(function() {
						debugClient.emit("people", function(peopleList) {
							expect(Object.keys(peopleList).length).to.eql(0);
							done();
						});
					}, 10);
				});
			});

		});

		it("must not allow duplicate usernames", function(done) {
			behaviors.loginWithUsername("scott")(function(err, c, d) {
				expect(d.success).to.be.ok();
				behaviors.loginWithUsername("scott")( function(err, c, d) {
					expect(d.success).to.not.be.ok();
					done();
				});
			});
		});

		it("must allow rooms to be joined", function(done) {
			
			behaviors.login(function(err, client, data) {
				expect(data.success).to.be.ok();
				expect(client.connected).to.be.ok();

				behaviors.joinRandomRoom(client, function(err, client, data) {
					expect(data.success).to.be.ok();
					done();
				});
			});
		});

		it("must alert others when someone new joins or leaves", function(done) {

			behaviors.loginXUsers(2, function(clients, data) {
				expect(data.success).to.be.ok();

				clients[0].on("roomUpdate", function(data){
					if(data.players.length >=2)
						done();
				});

				async.map(clients, behaviors.joinRoom("room-testroom"), function(err, results){

				});

				
			});

			/*behaviors.login(function(err, client, data) {

				client.on("roomUpdate", function(data){
					expect(data.players.length).to.be.eql(2);
					done();
				});

				behaviors.login(function(){});
			});*/

		});
		
	});
});