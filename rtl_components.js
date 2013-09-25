function oscilator(period, output, input) {
    var output = output || new Signal();
    var input = input || constant(undefined);

    output.set_value(undefined);
    function change() {
        after_delay( function() {
            if (input.get_value()) {
                console.log("********************* clk going: " + !output.get_value());
                output.set_value(!output.get_value());
                setTimeout(function() { change()}, period);
            }
        },2);
    }
    input.add_action(change);
    return output;
}

function counter(clk, clr, output) {
    var count = undefined;
    var clr = clr || constant(false);
    var step = function (clk, clr) {
        if (clr && clk) {
            count = undefined;
            console.log("Counter: clr up");
            return count;
        } 
        if (clk) {
            console.log("Counter high: returning " + count + "and postincrementing");
            if (count == undefined) {
                count = 0;
                return count;
            } else {
                return ++count;
            }
        } 
        else {
            console.log("Counter low: returning " + count);
            return count;
        }
    }

    
    return dlift2(step, clk, clr, output);
}


function ram(size, address, data_in, write, data_out) {
    var contents = new Array(size);
    contents[0]=1;
    contents[1]=2;
    contents[2]=3;
    contents[3]=4;
    contents[4]=5;
    contents[5]=6;
    contents[6]=7;

    var data_out = data_out || new Signal();
    var data_in = data_in || constant(0);
    var write = write || constant(false);

    function read_proc() {
        after_delay(function() {
            if (address.get_value() != undefined) {
                var clamp_addr = address.get_value() % size;
                var content = contents[clamp_addr] || 0;
                console.log("ram: " + contents);
                console.log("read ram at: " + clamp_addr + " -> " + content);
                data_out.set_value(content);
            }
        } , 1);
    }
    
    function write_proc() {
        after_delay(function() {
            if (write.get_value() && address.get_value() != undefined) {
                console.log("RAM write!");
                var clamp_addr = address.get_value() % size;
                contents[clamp_addr] = data_in.get_value();
            }
        } , 1);
    }
    
    address.add_action(read_proc);
    write.add_action(write_proc);

    return data_out;
}


function adder(input_a, input_b, output) {
    return dlift2(function(a, b) {
        if (a != undefined && b != undefined) {
            console.log("Adding: " + a + " + " + b);
            return a+b;
        } else {
            return undefined;
        }
    }, input_a, input_b, output);
}

function latch(clk, clr, data_in, data_out) {
    var content = undefined;
    var data_out = data_out || new Signal();
    
    var clear_proc = function() {
        after_delay(function() { 
            if (clr.get_value()) {
                console.log("Latch: clr up");
                content=0;
                data_out.set_value(content);
            }
        }, 1);
    };

    var store_proc = function() {
        after_delay(function () {
            if (clk.get_value() && !clr.get_value()) {
                content = data_in.get_value();
                console.log("Latching: " + content); 
                data_out.set_value(content);
            }
        }, 1);
    };

    clr.add_action(clear_proc);
    clk.add_action(store_proc);
    
    return data_out;
}
