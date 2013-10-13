var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_id = function() {
        dlx.stage_id = {};
        
        var ir  = dlx.stage_if.ir;
        var op  = ir.lift(function(instr){ return instr >> 26 ;}).trace("OP");
        var r1  = ir.lift(function(instr){ return (instr >> 21) & 0x1f ;}).trace("R1");
        var r2  = ir.lift(function(instr){ return (instr >> 16) & 0x1f ;}).trace("R2");
        var imm = ir.lift(function(instr){ return instr & 0xff ;}).trace("IMM");
        
        var register_file = dlx.memory.register_file(r1,r2,new srs.Signal(), new srs.Signal(), new srs.Signal());


        //pipeline stage registers

        dlx.stage_id.npc = dlx.components.register(dlx.stage_if.npc, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);

        dlx.stage_id.ir = dlx.components.register(dlx.stage_if.ir, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);

        dlx.stage_id.r_a = dlx.components.register(register_file.out_a, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);

        dlx.stage_id.r_b = dlx.components.register(register_file.out_b, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);
        //implicit sign-extend 16->32
        dlx.stage_id.imm = dlx.components.register(imm, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);


    };

    return dlx;
}(DLX,SRS));
