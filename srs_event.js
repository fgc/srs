/* Event related functions */
var SRS = (function(srs) {

    srs.rising_edge = function (signal, output) {

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


    srs.sample_on = function (signal, event, output) {
        var output = output || new srs.Event();

        var sample = function() {
            return signal.get_value();
        }

        return srs.lift(sample, event, 1, output);
    };

    srs.Signal.prototype.sample_on = function(event, output) {
        return srs.sample_on(this, event, output);
    };

    return srs;
}(SRS));
