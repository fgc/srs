/* Useful signal functions */
var SRS = (function(srs) {


    function delayed(action, delay) {
        var delay = delay || 1;
        return function () {
            srs.after_delay(action, delay);
        };
    }

    /* Lift "normal" functions to operate on signals
     instead of bare values. 
     Optionally schedule delayed event dispatching.*/
    srs.liftn = function(proc, output) {        
        var args = Array.prototype.slice.call(arguments, 2);
        var action = function () {
            var values = args.map(function(s){return s.get_value()});
            if (values.some(function(value){return value != undefined;})) {
                output.set_value(proc.apply(this, values));
            }
        };
        for (var i = 0; i < args.length; i++) {
            args[i].add_action(action);
        }
        return output;
    };

    srs.lift = function(proc, input, delay, output) {
        var output = output || new srs.Signal();
        return srs.liftn(proc, output, input);
    };

    srs.Signal.prototype.lift = function(proc, delay, output) {
       return srs.lift(proc,this,delay,output);
    }

    srs.lift2 = function(proc, input_a, input_b, delay, output) {
        var output = output || new srs.Signal();
        return srs.liftn(proc, output, input_a, input_b);
    };

    srs.fold = function(step, acc, input, output) {
        var output = output || new srs.Signal();
        output.set_value(acc);
        var action = delayed(function() {
            var in_value = input.get_value();
            var out_value = output.get_value();
            if (in_value != undefined && out_value != undefined) {
                output.set_value(step(in_value, out_value));
            }
        },1);
        input.add_action(action);
        return output;
    };
    
    srs.filter = function(pred, input, output) {
        var output = output || new srs.Signal();
        var action = delayed(function() {
            var in_value = input.get_value();
            if (in_value != undefined && pred(in_value)) {
                output.set_value(in_value);
            }
        },1);
        input.add_action(action);
        return output;
    };

    srs.trace = function(tag, input, output) {
        var tag = tag || "Untagged trace: ";
        return srs.lift(function(value) {
            console.log ("[trace] " + tag +": " + value); 
            return value}, input, 0, output);
    };

    srs.Signal.prototype.trace = function(tag, output) {
        return srs.trace(tag, this, output);
    };


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
