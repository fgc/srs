function Signal() {
    this.value = 0;
    this.action_procedures = new Array();
}

Signal.prototype.get_value = function() {
    return this.value;
};

Signal.prototype.set_value = function(new_value) {
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
        var new_value = input_a.get_value() && input_b.get_value();
        after_delay(function() {
            output.set_value(new_value);
        }, 1);
    }

    input_a.add_action(and_action_proc);
    input_b.add_action(and_action_proc);
}

function Ram(address, data, write) {
    var contents = new Array();
    function read_proc() {
        after_delay(function() {
            data.set_value(contents[address.get_value()]);
        } , 1);
    }

    function write_proc() {
        after_delay(function() {
            contents[address.get_value()] = data.get_value();
        } , 1);
    }

    address.add_action(read_proc);
    write.add_action(write_proc);
}

function Clock(delay, output) {
    output.add_action(function() {
        after_delay( function() {
            output.set_value(!output.get_value());
            console.log("Clock: " + output.get_value());
            }, delay);
    });
}

function Text(id, input) {
    var text_element = document.createElement("span");
    text_element.id = id;
    document.body.appendChild(text_element);
    input.add_action(function() {
        text_element.innerHTML = input.get_value();
    });
}

function Button(name, context) {
    var output = new Signal();
    var clicks = 0;
    var button = document.createElement("input");
    button.type = "button";
    button.value = name;
    button.onclick = function() {
        output.set_value(clicks++);
        };
    context.appendChild(button);
    return output;
}


function Mouse() {
    var output = new Signal();
    output.set_value({x: undefined, y: undefined});
    document.addEventListener("mousemove", function(e){
        output.set_value({x: e.pageX, y: e.pageY});
    },false);
    return output;
}

function Stringify(input) {
    var output = new Signal();
    input.add_action(function() {
        output.set_value(JSON.stringify(input.get_value()));
    });
    return output;
}

function lift(proc, input) {
    var output = new Signal();
    input.add_action(function() {
        output.set_value(proc(input.get_value()));
    });
    return output;
}

function lift2(proc, input_a, input_b) {
    var output = new Signal();
    var action = function () {
        output.set_value(proc(input_a.get_value(), input_b.get_value()));
    }
    input_a.add_action(action);
    input_b.add_action(action);
    return output;
}

function andgate(input_a, input_b) {
    return lift2(function (a, b){return a & b;}, input_a, input_b);
}

function toggle_on(input) {
    var flag = false;
    return lift(function (val) { 
        flag = !flag;
        return flag;
    }, input);
}
