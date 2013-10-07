/* Core SRS module */
var SRS = (function() {
    var srs = {};
    

    /* SICP style wire/signal simulator */
    
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
                this.action_procedures[i](new_value);
            }
        }
        return this;
    };
    
    srs.Signal.prototype.add_action = function (proc) {
        this.action_procedures.push(proc);
        proc();
    };

    /* Separate events from signals */

    srs.Event = function() {
        this.lastvalue = undefined;
        this.action_procedures = new Array();
    };

    srs.Event.prototype = new srs.Signal();

    srs.Event.prototype.get_value = function() {
        return this.lastvalue;
    };
    
    srs.Event.prototype.set_value = function(new_value) {
        if (new_value != undefined) {
            this.lastvalue = new_value;
            this.action_procedures.map(function(proc){return proc();});
        }
        return this;
    };
    
    /* Propagation and Queueing*/
    var schedule = new PriorityQueue({low: true});
    schedule.propagating = false;

    function propagate() {
        schedule.propagating = true;
        while (!schedule.empty()) {
            var proc = schedule.pop().proc;
            proc();
        }
        schedule.propagating = false;
    }

    srs.after_delay = function (proc, delay) {
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
    
    /** END srs_core **/
    return srs;
}());
