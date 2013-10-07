/* Event related functions */
var SRS = (function(srs) {

    srs.rising_edge = function (signal, output) {
        var output = output || new srs.Event();

        var rising = function (signal_value) {
            if (signal_value) {
                return signal_value;
            }
            return undefined;
        }

        return srs.lift(rising, signal, 1, output);
    };

    srs.Signal.prototype.rising_edge = function(output) {
        return srs.rising_edge(this, output);
    };

    return srs;
}(SRS));
