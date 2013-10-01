var PETZC = (function(srs) {
    var petzc = {};

    petzc.counter = function(clk, clr, max, output) {
        var output = output || new srs.Signal();
        var max = max || 65536; //16-bit by default
        var count = undefined;

        var increment = function(clk,clr) {
            if (clr) {
                count = 0;
                return 0;
            }
            if (!clk) {
                return count;
            }
            if (count == undefined) {
                return 0;
            } else {
                count = ++count%max;
                return count;
            }
        };

        var zero = function(clr) {
            count = 0;
            return 0;
        };

        srs.lift2(increment, clk, clr, 1, output);
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
            srs.lift(write_proc, write, data_out);
        }
        return srs.lift(read_proc, addr, data_out);        
    }

    petzc.ram_control_panel = function (id, context) {
        var context = context || document.body;

        var addr_subpanel = document.createElement("div");
        addr_subpanel.id = id + "_addr_subpanel";
        context.appendChild(addr_subpanel);
        for (var i = 15; i>= 0; i--) {
            var addr_bit_unit = document.createElement("div");
            addr_bit_unit.id = id + "_addr_bit_unit_" + i;
            addr_subpanel.appendChild(addr_bit_unit);
            srs.flipswitch("addr_" + i, addr_bit_unit.id).led("add_led_" + i, addr_bit_unit.id);
        }

        
    }

    return petzc;
}(SRS));
