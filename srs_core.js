/* Core SRS module */
var SRS = (function() {
    var srs = {};
    

    /* SICP style wire/signal simulator */

    var schedule = new PriorityQueue({low: true});
    schedule.propagating = false;
    
    srs.Signal = function() {
        this.value = undefined;
        this.action_procedures = new Array();
    };
    
    srs.Signal.prototype.get_value = function() {
        return this.value;
    };

    srs.Signal.prototype.set_value = function(new_value) {
        if (this.value != new_value) {
            this.value = new_value;
            for (var i = 0; i < this.action_procedures.length; i++) {
                this.action_procedures[i]();
            }
        }       
    };
    
    srs.Signal.prototype.add_action = function (proc) {
        this.action_procedures.push(proc);
        proc();
    };

    srs.Signal.prototype.init = function(value) {
        this.set_value(value);
        return this;
    }

    
    /* Event queueing and propagation */

    function after_delay (proc, delay) {
        if (schedule.empty) {
            schedule.push({proc: proc, time: delay}, delay);
        } else {
            var current_time = schedule.top().time;
            schedule.push({proc: proc, time: current_time + delay}, current_time + delay);
        }
        if (!schedule.propagating) {
            propagate();
        }
    };

    function propagate() {
        schedule.propagating = true;
        while (!schedule.empty()) {
            var proc = schedule.pop().proc;
            proc();
        }
        schedule.propagating = false;
    }
    

    /* Lift "normal" functions to operate on signals
     instead of bare values. 
     Optionally schedule delayed event dispatching.*/

    function make_action(proc, input, output) {
        return function () {
            var input_value = input.get_value();
            if (input_value != undefined) {
                output.set_value(proc(input_value));
            };
        }
    }
       
    function delayed(action, delay) {
        var delay = delay || 1;
        return function () {
            after_delay(action, delay);
        };
    }

    srs.lift = function(proc, input, delay, output) {
        var output = output || new srs.Signal();
        var action = make_action(proc, input, output);
        if (delay) {
            action = delayed(action, delay);
        }
        input.add_action(action);
        return output;
    };

    srs.lift2 = function(proc, input_a, input_b, delay, output) {
        var output = output || new srs.Signal();
        var action = function() {
            var in_value_a = input_a.get_value();
            var in_value_b = input_b.get_value();
            if (in_value_a != undefined && in_value_b != undefined) {
                output.set_value(proc(in_value_a, in_value_b));
            }
        };

        if (delay) {
            action = delayed(action, delay);
        }
        
        input_a.add_action(action);
        input_b.add_action(action);
        
        return output;
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
        return srs.lift(function(value) {console.log ("[trace] " + tag +": " + value); return value}, input, 0, output);
    };

    srs.Signal.prototype.trace = function(tag, output) {
        return srs.trace(tag, this, output);
    };

    /** END srs_core **/
    return srs;
}());
