var T = (function(srs) {
    var tecs = {};
    
    tecs.not = function(input, output) {
        return srs.nandgate(input, input, 1, output);
    };

    tecs.and = function(input_a, input_b, output) {
        return tecs.not(srs.nandgate(input_a,input_b), output);
    };

    tecs.or = function(input_a, input_b, output) {
        return srs.nandgate(tecs.not(input_a), tecs.not(input_b), 1, output);
    };

    tecs.xor = function(input_a, input_b, output) {
        var xtra_nand = srs.nandgate(input_a, input_b);
        return srs.nandgate(
            srs.nandgate(input_a, xtra_nand),
            srs.nandgate(input_b, xtra_nand)
            ,output);
    };

    tecs.mux = function(select, input_a, input_b, output) {
        return tecs.or(
            tecs.and(input_a, select),
            tecs.and(input_b, tecs.not(select)),
            output);
    };

    tecs.demux = function(select, input) {
        return {out_a: tecs.and(input, select),
                out_b: tecs.and(input, tecs.not(select))};
    };

    tecs.half_adder = function(input_a, input_b) {
        return {sum: tecs.xor(input_a, input_b),
                carry: tecs.and(input_a, input_b)};
    };

    tecs.full_adder = function(input_a, input_b, carry_in) {
        var inner_half = tecs.half_adder(
            tecs.xor(input_a,input_b),
            carry_in);
        return {
            sum: inner_half.sum,
            carry : tecs.or(inner_half.carry,
                            tecs.and(input_a, input_b))
        };

    };

    tecs.adder = function(bits, in_bus_a, in_bus_b) {
        var out_bus = [];
        var last_carry = srs.constant(false);
        for (var i = 0; i < bits; i++) {
            var new_adder = tecs.full_adder(in_bus_a[i],in_bus_b[i],last_carry);
            out_bus.push(new_adder.sum);
            last_carry = new_adder.carry;
        };
        return {out_bus: out_bus,
                carry: last_carry};
    };

    tecs.not_bus = function(in_bus) {
        return in_bus.map(function(s) {
            return tecs.not(s);
        });
    };

    tecs.and_bus = function(in_bus_a, in_bus_b) {
        return in_bus_a.map(function(bit_a, i) {
            return tecs.and(bit_a, in_bus_b[i]);
        });
    };
    
    tecs.mux_bus = function(select, in_bus_a, in_bus_b) {
        return in_bus_a.map(function(bit_a, i) {
            return tecs.mux(select, bit_a, in_bus_b[i]);
        });        
    };

    tecs.zero_bus = function(bits) {
        return srs.constant(0).to_bus(bits);
    };

    tecs.alu = function(input_bus_a,input_bus_b,za,na,zb,nb,f,no) {
        var zero = tecs.zero_bus(16);
        var a1 = tecs.mux_bus(za, zero, input_bus_a);
        var b1 = tecs.mux_bus(zb, zero, input_bus_b);
        var a2 = tecs.mux_bus(na, tecs.not_bus(a1), a1);
        var b2 = tecs.mux_bus(nb, tecs.not_bus(b1), b1);
        var adder = tecs.adder(16, a2, b2);
        var andder = tecs.and_bus(a2, b2);
        var preout = tecs.mux_bus(f, adder.out_bus, andder);
        return {
            out: tecs.mux_bus(no, tecs.not_bus(preout), preout)
        };
    };

    tecs.dff = function(input, clk, output) {
        var output = output || new srs.Signal();
        var state;
        var store = function() {
            var oldstate = state;
            state = input.get_value();
            return oldstate;
        };
        var propagate = function() {
            return state;
        };
        srs.lift(store,clk.rising_edge(),1,output);
        srs.lift(propagate,srs.inverter(clk).rising_edge(),1,output);
        return output;
    };

    tecs.register = function(input, clk, load, output) {
        var loopback = new srs.Signal();
        var mux = tecs.mux(load, input, loopback);
        return tecs.dff(mux, clk, loopback);
    };

    return tecs;
}(SRS));
