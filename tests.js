var io = require('socket.io-client'),
	assert = require('assert'),
	util = require('util'),
	expect = require('expect.js'),
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

			behaviors.login(function(err, client, data){
				expect(data).to.have.property("success");
				expect(data.success).to.be.ok();
				done();
			});

			/*client1.on("welcome", function(data){
				expect(data).to.have.property("success");
				expect(data.success).to.be.ok();

				client2.on("welcome", function(data){
					expect(data).to.have.property("success");
					expect(data.success).to.be.ok();
					
					done();
				});

				client2.emit("hello", "fred");
			});

			client1.on("connect", function() {
				client1.emit("hello", "scottA");
			});*/
		});

		it("must cleanup clients when they leave", function(done) {
			client1.on("welcome", function(data) {
				expect(data).to.have.property("success");
				expect(data.success).to.be.ok();

				client1.disconnect();
				setTimeout(function() {
					debugClient.emit("people", function(peopleList) {
						expect(Object.keys(peopleList).length).to.eql(0);
						done();
					});
				}, 10);
			});

			client1.on("connect", function() {
				client1.emit("hello", "scottD");
			});
		});

		it("must not allow duplicate usernames", function(done) {
			client2.on("welcome", function(data){
				expect(data).to.have.property("success");
				expect(data.success).to.not.be.ok();
				done();
			});
			client1.emit("hello", "scottB");
			client2.emit("hello", "scottB");
		});

		it("must allow rooms to be joined", function(done) {
			

			client1.on("welcome", function(data){
				expect(data).to.have.property("success");
				expect(data.success).to.be.ok();

				client1.on("roomUpdate", function(data){
					expect(data).to.have.property("success");
					expect(data).to.have.property("roomOwner");
					expect(data).to.have.property("players");
					expect(data.success).to.be.ok();

					done();
				});
				client1.emit("join", "testRoom");
			});

			client1.emit("hello", "scottC");
		});

		/*it("must alert others when someone new joins", function(done) {
			client1.on("roomUpdate", function(data){
				expect(data).to.have.property("success");
				expect(data.success).to.be.ok();
				expect(data.players.length).to.be.eql(2);
				done();
			});
		});
		*/
		
	});
});