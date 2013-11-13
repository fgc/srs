var SRS = (function(srs) {

    srs.ws = function(uri, input, output) {
        var output = output || new srs.Signal();
	var socket = new WebSocket(uri);
	if (input) {
	    srs.lift(function(message){socket.send(JSON.stringify({"msg":message}));},input);
	}
	socket.onmessage = function(message) {
	    output.set_value(JSON.parse(message.data).msg);
	}
	return output;
    };
    srs.Signal.prototype.ws = function(uri,output) {return srs.ws(uri, this, output);};
    return srs;
}(SRS));
