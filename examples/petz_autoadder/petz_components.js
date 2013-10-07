var PETZC = (function(srs) {
    var petzc = {};


    petzc.better_counter = function(clk, clr, max, output) {
        var output = output || new srs.Signal();
        var max = max || 65536; //16-bit by default
        var count = undefined;

        var increment = function (clk_val) {
            console.log("increment yay: " + clk_val);
            if (clk_val) {
                if (count == undefined) {
                    count = 0;
                    return count;
                }
                return ++count % max;
            }
            return count;
        };
        
        var clearup = function(clr_val) {
            if (clr_val) {
                count = undefined;
                return undefined;
            }
        };

        srs.lift(clearup,clr,1).trace("IN_counter_clear");
        
        var counter = srs.lift(increment,clk,1);
        counter.trace("IN_counter_counter");

        return counter;
    }

    petzc.counter = function(clk, clr, max, output) {
        var output = output || new srs.Signal();
        var max = max || 65536; //16-bit by default
        var count = undefined;

        var increment = function(clk) {
            if (clr.get_value()) {
                count = undefined;
                return undefined;
            }

            if (!clk) {
                return count;
            }

            if (count == undefined) {
                return 0;
            }
 
            count = ++count%max;
            return count;
   
        };

        var zero = function(clr) {
            count = undefined;
            return undefined;
        };

        srs.lift(increment, clk, 1, output);
        srs.lift(zero, clr, 1, output);
        return output;
    };

    petzc.ram = function(size, addr, data_in, write, data_out) {
        var data_out = data_out || new srs.Signal();
        var contents = new Array(size);
        contents[0]=1;
        contents[1]=2;
        contents[2]=3;
        contents[3]=4;
        contents[4]=5;
        contents[5]=6;
        contents[6]=7;
        contents[7]=8;

        var read_proc = function (addr) {
            return contents[addr % size];
        };
        
        var write_proc = function (write) {
            contents[addr.get_value() % size] = data_in.get_value();
            return data_in.get_value();
        };

        if (data_in != undefined && write != undefined) {
            srs.lift(write_proc, write, 1, data_out);
        }
        return srs.lift(read_proc, addr, 1, data_out);        
    }

    petzc.ram_control_panel = function (id, ram_data_out) {
        var addr = srs.textinput("addr_" + id);
        var data = srs.textinput("data_" + id, ram_data_out);
        var write = srs.flipswitch("write_" + id, "write_" + id + "_div").init(false);
        var takeover = srs.flipswitch("takeover_" + id, "takeover_" + id + "_div").init(false);

        return {addr: addr, data: data, write: write, takeover: takeover};
    }

    petzc.ram_control_selector = function (input_ctrl, input_system, flip) {
        var select = function(value_ctrl, value_system) {
            return flip.get_value()?value_ctrl:value_system;
        }

        var addr = srs.liftn(select, 
                             new srs.Signal(), 
                             input_ctrl.addr, 
                             input_system.addr);

        var data = srs.liftn(select, 
                             new srs.Signal(), 
                             input_ctrl.data, 
                             input_system.data);

        var write = srs.liftn(select, 
                              new srs.Signal(), 
                              input_ctrl.write, 
                              input_system.write);
        
        return {addr: addr, data: data, write: write};
    };


    petzc.adder = function (input_a, input_b) {
        return srs.liftn(function(a,b){console.log("in_adder: " + a + ", " + b);return a+b;},
                     new srs.Signal(),
                     input_a,
                     input_b);
    };

    petzc.latch = function (data_in, clk, clr, data_out) {
        var data_out = data_out || new srs.Signal();
        var content = undefined;
        var store_proc = function(store_it) {
            console.log("latch store proc. clr: " + clr.get_value() + ", clk:" + clk.get_value() + "data_in: " +data_in.get_value());
            if (clr.get_value()) {
                return 0;
            }
            if (store_it) {
                content = data_in.get_value();
                console.log("Content:" + content);
            }
            return content;
        };

        var clr_proc = function(){
            if (clr) {
                content = 0;
                return content;
            }
        };
        data_in.trace("LATCH data in");
        srs.lift(store_proc, clk, 1, data_out);
        srs.lift(clr_proc, clr, 1, data_out);
        
        return data_out;
    };

    return petzc;
}(SRS));
