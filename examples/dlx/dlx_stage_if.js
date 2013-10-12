var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_if = function() {
        dlx.stage_if = {};
        
        var next_pc = new srs.Signal();
        
        var pc = dlx.components.register(next_pc,dlx.control.not_clk, dlx.control.clr, dlx.control.not_clk);
        
        var add4 = pc.lift(function(addr) { return addr + 4;}, 1, next_pc);
        
        var instr = dlx.memory.instruction_cache(pc);
        
        dlx.stage_if.pc = pc;
        dlx.stage_if.next_pc = next_pc;
        dlx.stage_if.instr = instr;

        dlx.stage_if.npc = dlx.components.register(next_pc, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);

        dlx.stage_if.ir = dlx.components.register(instr, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);
    };

    return dlx;
}(DLX,SRS));
