var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_mem = function() {
        //TODO we just bypass this for now, let's get the reg->reg stuff right first.
        dlx.stage_mem = {};


        dlx.stage_mem.ir = dlx.components.register(dlx.stage_ex.ir, 
                                                   dlx.control.not_clk, 
                                                   dlx.control.clr, 
                                                   dlx.control.not_clk);

        
    };

    return dlx;
}(DLX,SRS));
