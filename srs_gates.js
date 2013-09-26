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


    /** end logic gates **/
    return srs;
}(SRS));
