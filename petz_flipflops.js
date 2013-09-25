function dnor_gate(input_a, input_b, output) {
    var output = output || new Signal();
    var action = function () {
        after_delay(function() {
            output.set_value(!(input_a.get_value() || input_b.get_value()));
        },1)
    };
    
    input_a.add_action(action);
    input_b.add_action(action);

    return output;
}

function dinverter(input) {
    console.log(input);
    return dlift(function(i) {return !i;}, input);
} 

function dand_gate(input_a, input_b, output) {
    return dlift2(function(a, b) {
        return a & b;
    }, 
                  input_a, 
                  input_b, 
                  output);
}


function flipflop(r, s, q, nq) {
    var q = q || new Signal();
    var nq = nq || new Signal();
    
    var nor1 = dnor_gate(r, nq, q);
    var nor2 = dnor_gate(s, q, nq);
    
    return {q: q, nq: nq};
}

function l_trg_d_ff(clk, data, q, nq) {
    var q = q || new Signal();
    var nq = nq || new Signal();

    var a1 = dand_gate(dinverter(data), clk);
    var a2 = dand_gate(data, clk);

    var ff = flipflop(a1, a2, q, nq);
    return {q: ff.q, nq: ff.nq};
}


function n_latch(clk, data) {
    var output = new Array();
    for (var i=0; i< data.length; i++) {
        output.push(l_trg_d_ff(clk, data[i]).q)
    }
    return output;
}

function n_switch(name, data, length) {
    var output = new Array();
    var length = length || data.length;
    for (var i=0; i< length; i++) {
        output.push(checkbox(name + i, data[i]));
    }
    return output;
}

function separator() {
    var el = document.createElement("span");
    el.innerHTML="|";
    document.body.appendChild(el);
}

window.onload = function() {
    var t = constant("<br>FlipFlop: ");
    Text("ff",t);
    var r = checkbox("R");
    var s = checkbox("S");
    var ff = flipflop(r,s);
    var q = checkbox("Q",ff.q);
    var nq = checkbox("NQ",ff.nq);

    var t2 = constant("<br>Inverter: ");
    Text("ff2",t2);
    var inverterI = checkbox("iI");
    var i = dinverter(inverterI); 
    var iO = checkbox("iO", i);

    var t3 = constant("<br>d_andgate: ");
    Text("ff3",t3);
    var andA = checkbox("aA");
    var andB = checkbox("aB");
    var andO = dand_gate(andA, andB); 
    var aO = checkbox("aO", andO);

    var t4 = constant("<br>level triggered D-type flip-flop: ");
    Text("ff4",t4);
    var clk = checkbox("CLK");
    var data = checkbox("DATA");
    var ltdff = l_trg_d_ff(clk, data); 
    var ltdffO = checkbox("ltdffO", ltdff.q);

    var t5 = constant("<br>8-bit latch: ");
    Text("ff5",t5);
    var clkl = checkbox("CLKL");
    separator();
    var databus = n_switch("DATABUS",[],8);
    separator();
    var latch = n_latch(clkl, databus); 
    var latchO = n_switch("latchO", latch);
    
    
}
