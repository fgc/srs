window.onload = function() {
    clk = new Signal();
    on = checkbox("ON", undefined);
    clr = checkbox("CLR", undefined);
    addrBus = new Signal();
    ram_data_out = ram(100,addrBus);
    co = counter(clk, clr, addrBus);
    adder_loop = new Signal();
    sum = adder(ram_data_out, adder_loop); 
    result = latch(clk,clr,sum,adder_loop);
    Text("CLK", clk);
    Text("S1", constant("|"));
    Text("CO", co);
    Text("S1.5", constant("|"));
    Text("RAM", ram_data_out);
    Text("S2", constant("|"));
    Text("SUM", adder_loop);
    go = oscilator(50, clk, on);
    //this fails when resetting (27 instead of 28)
};
