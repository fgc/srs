/* Logic gate implementations */
var SRS = (function(srs) {

    srs.inverter = function(input, delay, output) {
        return srs.lift(function(i){return !i;}, input, delay, output);
    };


    srs.andgate = function(input_a, input_b, delay, output) {
        return srs.lift2(function(a,b){return a && b;}, input_a, input_b, delay, output);
    };

    /** end logic gates **/
    return srs;
}(SRS));
