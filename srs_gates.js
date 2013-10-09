/* Logic gate implementations */
var SRS = (function(srs) {

    srs.buffer = function(input, delay, output) {
        return srs.lift(function(i){return i;}, input, delay, output);
    }

    srs.inverter = function(input, delay, output) {
        return srs.lift(function(i){return !i;}, input, delay, output);
    };


    srs.andgate = function(input_a, input_b, delay, output) {
        return srs.lift2(function(a,b){return a && b;}, input_a, input_b, delay, output);
    };


    srs.orgate = function(input_a, input_b, delay, output) {
        return srs.lift2(function(a,b){return a || b;}, input_a, input_b, delay, output);
    };

    srs.norgate = function(input_a, input_b, delay, output) {
        return srs.lift2(function(a,b){return !(a || b);}, input_a, input_b, delay, output);
    };

    srs.nandgate = function(input_a, input_b, delay, output) {
        return srs.lift2(function(a,b){return !(a && b);}, input_a, input_b, delay, output);
    };


    /* Convert between buses as number signals and arrays of single bit signals*/
    srs.to_bus = function (width, input) {
        var bits = Array.apply(null, new Array(width)).map(function(){
            return new SRS.Signal();
        });
        
        input.lift(function(n) {
            bits.map(function(bit,i){
                bit.set_value((n >> i) & 1);
            });
        },1);

        return bits;
    };

    srs.Signal.prototype.to_bus = function(width) {
        return srs.to_bus(width, this);
    };
    
    srs.from_bus = function(bus, output) {
        var output = output || new srs.Signal(); //Don't remove this one, even if you
                                                 //clean it from other places
        var bus_to_number = function() {
            return bus.reduce(function (acc, bit, i) {
                console.log(i + "->" + (bit.get_value() << i));
                return acc + (bit.get_value() << i);
            },0);
        };

        bus.map(function(s){s.lift(bus_to_number,1,output);});
        
        return output;
    };


    /** end logic gates **/
    return srs;
}(SRS));
