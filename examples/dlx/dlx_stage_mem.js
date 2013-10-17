var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_mem = function() {
        //TODO we just bypass this stage for now, let's get the reg->reg stuff right first.
        dlx.stage_mem = {};


        dlx.stage_mem.ir = dlx.components.register(dlx.stage_ex.ir, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);
        dlx.stage_mem.alu_out = dlx.components.register(dlx.stage_ex.alu_out, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);
        dlx.stage_mem.md = dlx.components.register(srs.constant(0), // TODO actually get the data from memory
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);
        
        dlx.stage_mem.mem_to_reg = dlx.components.register(dlx.stage_ex.mem_to_reg, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_mem.reg_write  = dlx.components.register(dlx.stage_ex.reg_write, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);
        dlx.stage_mem.mem_read   = dlx.components.register(dlx.stage_ex.mem_read, 
                                                          dlx.control.not_clk, 
                                                          dlx.control.clr, 
                                                          dlx.control.not_clk);

        
        
    };

    return dlx;
}(DLX,SRS));
