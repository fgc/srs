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
        
    };

    return dlx;

}(DLX,SRS));
