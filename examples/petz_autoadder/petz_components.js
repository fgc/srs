var PETZC = (function(srs) {
    var petzc = {};


    petzc.counter = function(clk, clr, max, output) {
        var output = output || new srs.Signal();
        var max = max || 65536; //16-bit by default
        var count = undefined;

        var increment = function (clk_val) {
            if (clr.get_value()) {
                return undefined; // don't count up when clear is up
            }

            if (count == undefined) {
                count = 0;
                return count;
            }
            return ++count % max;
        };
        
        var clearup = function(clr_val) {
            count = undefined;
            return undefined;
        };

        srs.lift(clearup,clr,1);
        
        var counter = clk.rising_edge().lift(increment);

        return srs.if_s(clr,srs.constant("undefined"),counter);
    }

    petzc.ram = function(size, addr, data_in, write, data_out) {
        var contents = new Array(size);
        contents[0]=1;
        contents[1]=2;
        contents[2]=3;
        contents[3]=4;
        contents[4]=5;
        contents[5]=6;
        contents[6]=7;
        contents[7]=8;
        contents[8]=0;
        contents[9]=0;

        var read_proc = function (addr) {
            return contents[addr % size];
        };
        
        var write_proc = function (write) {
            contents[addr.get_value() % size] = data_in.get_value();
            return data_in.get_value();
        };

        if (data_in != undefined && write != undefined) {
            write.rising_edge().lift(write_proc);
        }
        return addr.lift(read_proc, 1, data_out);        
    }

    petzc.ram_control_panel = function (id, ram_data_out) {
        var addr = srs.textinput("addr_" + id);
        var data = srs.textinput("data_" + id, ram_data_out);
        var write = srs.flipswitch("write_" + id, "write_" + id + "_div").set_value(false);
        var takeover = srs.flipswitch("takeover_" + id, "takeover_" + id + "_div").set_value(false);

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
        return srs.liftn(function(a,b){return a+b;},
                     new srs.Signal(),
                     input_a,
                     input_b);
    };

    petzc.latch = function (data_in, clk, clr, data_out) {
        var content = data_in.sample_on(clk.rising_edge(), data_out).set_value(0);
        //ugly? but we need to zero the content signal on clear
        var zero = clr.lift(function(){content.set_value(0); return 0;});
        return clr.if_s(zero, content, data_out);
    };

    return petzc;
}(SRS));
