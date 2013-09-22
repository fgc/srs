function Signal() {
    this.value = 0;
    this.action_procedures = new Array();
}

Signal.prototype.get = function() {
    return this.value;
};

Signal.prototype.set = function(new_value) {
    if (this.value != new_value) {
        this.value = new_value;
        for (var i = 0; i < this.action_procedures.length; i++) {
            this.action_procedures[i]();
        }
    }       
};

Signal.prototype.add_action = function (proc) {
    this.action_procedures.push(proc);
    proc();
};

var agenda = PriorityQueue({low: true});

function after_delay(proc, delay) {
    if (agenda.empty) {
        agenda.push({proc: proc, time: delay}, delay);
    } else {
        var current_time = agenda.top().time;
        agenda.push({proc: proc, time: current_time + delay}, current_time + delay);
    }
}

function propagate() {
    while (!agenda.empty()) {
        var proc = agenda.pop().proc;
        proc();
    }
}

function AndGate(input_a, input_b, output) {
    function and_action_proc() {
        var new_value = input_a.get() && input_b.get();
        after_delay(function() {
            output.set(new_value);
        }, 1);
    }

    input_a.add_action(and_action_proc);
    input_b.add_action(and_action_proc);
}

function Ram(address, data, write) {
    var contents = new Array();
    function read_proc() {
        after_delay(function() {
            data.set(contents[address.get()]);
        } , 1);
    }

    function write_proc() {
        after_delay(function() {
            contents[address.get()] = data.get();
        } , 1);
    }

    address.add_action(read_proc);
    write.add_action(write_proc);
}

function Clock(delay, output) {
    output.add_action(function() {
        after_delay( function() {
            output.set(!output.get());
            console.log("Clock: " + output.get());
            }, delay);
    });
}

function Text(id, signal) {
    var text_element = document.createElement("span");
    text_element.id = id;
    document.body.appendChild(text_element);
    signal.add_action(function() {
        text_element.innerHTML = signal.get();
    });
}


function Mouse(output) {
    output.set({x: undefined, y: undefined});
    document.addEventListener("mousemove", function(e){
        output.set({x: e.pageX, y: e.pageY});
    },false);
}

function Stringify(input, output) {
    input.add_action(function() {
        output.set(JSON.stringify(input.get()));
    });
}
