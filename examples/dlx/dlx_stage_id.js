var DLX = (function(dlx,srs) {
    var dlx = dlx || {};


    dlx.init_stage_id = function() {
        dlx.stage_id = {};
        
        var ir  = dlx.stage_if.ir;
        var op  = ir.lift(function(instr){ return instr >> 26 ;}).trace("OP");
        var r1  = ir.lift(function(instr){ return (instr >> 21) & 0x1f ;}).trace("R1");
        var r2  = ir.lift(function(instr){ return (instr >> 16) & 0x1f ;}).trace("R2");
        var imm = ir.lift(function(instr){ return instr & 0xff ;}).trace("IMM");
        
        
    };

    return dlx;
}(DLX,SRS));
