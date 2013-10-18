var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_wb = function() {
        dlx.stage_wb = {};

        //what are we writing back, memory or alu output?
        dlx.components.mux(dlx.stage_mem.mem_to_reg,
                dlx.stage_mem.md,
                dlx.stage_mem.alu_out,
                dlx.control.reg_data_write);

        //which register are we writing to?
        dlx.components.mux(srs.constant(false), //TODO find out what really goes here
                dlx.stage_mem.ir.lift(function(i) {return (i>>>16) & 0x1f;}),
                dlx.stage_mem.ir.lift(function(i) {return (i>>>11) & 0x1f;}),
                dlx.control.reg_select_write);


        //TODO: srs.buffer(dlx.stage_mem.reg_write, dlx.control.reg_enable_write);
        dlx.stage_mem.reg_write.lift(function(val){
            dlx.control.reg_enable_write.set_value(val);
        });
    };

    return dlx;
}(DLX,SRS));
