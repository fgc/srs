#!/usr/bin/nodejs
var wsServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(req,res){
    res.writeHead(404);
    res.end();
});
server.listen(8080);

ws = new wsServer({
    httpServer: server,
    autoAcceptConnections: false
});

var conns = [];
ws.on('request', function(request){
    console.log("new request");
    var conn = request.accept();
    conns.push(conn);
    conn.on('message', function(message) {
	console.log("Received", message);
	conns.forEach(function(dest) {
	    dest.send(message.utf8Data);
	});
    });
});

