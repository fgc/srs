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
                //this might need 2-complement conversion
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
                                                 //clean it from other places we do need
                                                 //a real output to connect to every bit

        //This is quite bad, lots of unneeded recalcs, might be useful to
        //have a current value and deal with incoming single bits.

        /* get the current values for every bit signal in the bus
           and return the corresponding number */
        var bus_to_number = function() {
            return bus.reduce(function (acc, bit, i) {
                //console.log(i + "->" + (bit.get_value() << i));
                //2-complement missing!
                return acc + (bit.get_value() << i);
            },0);
        };

        /* recalculate the output for every change of one of the signals
           in the bus*/
        bus.map(function(s){s.lift(bus_to_number,1,output);});
        
        return output;
    };


    /** end logic gates **/
    return srs;
}(SRS));
