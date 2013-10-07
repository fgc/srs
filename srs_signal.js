/* Useful signal functions */
var SRS = (function(srs) {

    srs.constant = function(val, output) {
        var output = output || new srs.Signal();
        return srs.lift(function(_v){return val;}, new srs.Signal(), 1, output);
    };

    srs.if_s = function(if_signal, true_signal, false_signal, output) {
        var output = output || new srs.Signal();

        var select = function(if_val, true_val, false_val) {
            return if_val?true_val:false_val;
        };
        
        return srs.liftn(select, output, if_signal, true_signal, false_signal);
    };

    srs.Signal.prototype.if_s = function (true_signal, false_signal, output) {
        return srs.if_s(this, true_signal, false_signal, output);
    }

    return srs;
}(SRS));
