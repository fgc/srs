var DLX = (function(dlx,srs) {
    var dlx = dlx || {};
    
    dlx.init_stage_ex = function() {
        dlx.stage_ex = {};
        
        

        var op_b = dlx.components.mux(dlx.stage_id.alu_src,
                                      dlx.stage_id.imm,
                                      dlx.stage_id.r_b);
        
        //dumb test alu
        var alu = srs.lift2(function(a,b){
            console.log("ALU operands: " + a + " + " + b);
            return a+b;
        },dlx.stage_id.r_a, op_b);
        

    dlx.stage_ex.ir = dlx.components.register(dlx.stage_id.ir, 
                                              dlx.control.not_clk, 
                                              dlx.control.clr, 
                                              dlx.control.not_clk);
    
    dlx.stage_ex.r_b = dlx.components.register(dlx.stage_id.r_b, 
                                               dlx.control.not_clk, 
                                               dlx.control.clr, 
                                               dlx.control.not_clk);
    
    dlx.stage_ex.alu_out = dlx.components.register(alu, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);

    dlx.stage_ex.bc = srs.constant(false); //TODO calculate this for jumps


    dlx.stage_ex.mem_to_reg = dlx.components.register(dlx.stage_id.mem_to_reg, 
                                                    dlx.control.not_clk, 
                                                    dlx.control.clr, 
                                                    dlx.control.not_clk);
    dlx.stage_ex.reg_write  = dlx.components.register(dlx.stage_id.reg_write, 
                                                    dlx.control.not_clk, 
                                                    dlx.control.clr, 
                                                    dlx.control.not_clk);
    dlx.stage_ex.reg_dst  = dlx.components.register(dlx.stage_id.reg_dst, 
                                                    dlx.control.not_clk, 
                                                    dlx.control.clr, 
                                                    dlx.control.not_clk);
    dlx.stage_ex.mem_read   = dlx.components.register(dlx.stage_id.mem_read, 
                                                    dlx.control.not_clk, 
                                                    dlx.control.clr, 
                                                    dlx.control.not_clk);
    dlx.stage_ex.mem_write  = dlx.components.register(dlx.stage_id.mem_write, 
                                                    dlx.control.not_clk, 
                                                    dlx.control.clr, 
                                                    dlx.control.not_clk);
    dlx.stage_ex.branch     = dlx.components.register(dlx.stage_id.branch, 
                                                      dlx.control.not_clk, 
                                                      dlx.control.clr, 
                                                      dlx.control.not_clk);


    };
    return dlx;

}(DLX,SRS));
