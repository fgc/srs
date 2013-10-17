var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_id = function() {
        dlx.stage_id = {};
        
        var ir  = dlx.stage_if.ir;
        var op  = ir.lift(function(instr){ return instr >> 26 ;}).trace("OP");
        var r1  = ir.lift(function(instr){ return (instr >> 21) & 0x1f ;}).trace("R1");
        var r2  = ir.lift(function(instr){ return (instr >> 16) & 0x1f ;}).trace("R2");
        var imm = ir.lift(function(instr){ return instr & 0xff ;}).trace("IMM");
        
        //control logic. TODO test this thoroughly
        var r_format   = op.lift(function(op) {return op == 0;});
        var alu_src    = op.lift(function(op) {return op & 0x08;});
        var mem_to_reg = op.lift(function(op) {return (op & 0x20) && (op & 0x3);});
        var reg_write  = op.lift(function(op) {return !((op & 0x28) || (op>>3 == 0));});
        var mem_read   = mem_to_reg;
        var mem_write  = op.lift(function(op) {return (op & 0x28) && (op & 0x3);});
        var branch     = op.lift(function(op) {return (op >> 3 == 0) && (op & 0x7);});
        var alu_op1    = r_format;
        var alu_op0    = srs.constant(true); //TODO fix this, not every instruction does the same in the alu.
        
                      
        

        var register_file = dlx.memory.register_file(r1,
                                                     r2,
                                                     dlx.control.reg_select_write, 
                                                     dlx.control.reg_data_write, 
                                                     dlx.control.reg_enable_write);


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
        dlx.stage_id.imm        = dlx.components.register(imm, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.r_format   = dlx.components.register(r_format, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.alu_src    = dlx.components.register(alu_src, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.mem_to_reg = dlx.components.register(mem_to_reg, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.reg_write  = dlx.components.register(reg_write, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.mem_read   = dlx.components.register(mem_read, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.mem_write  = dlx.components.register(mem_write, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.branch     = dlx.components.register(branch, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.alu_op1    = dlx.components.register(alu_op1, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_id.alu_op0    = dlx.components.register(alu_op0, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
    };

    return dlx;
}(DLX,SRS));
