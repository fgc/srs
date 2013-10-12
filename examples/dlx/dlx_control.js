var DLX = (function(dlx,srs) {
    var dlx = dlx || {};

    
    dlx.init_control = function() {

    dlx.control = {};

    dlx.control.clk = srs.flipswitch("clk");
    dlx.control.not_clk = srs.inverter(dlx.control.clk);
    dlx.control.clr = srs.flipswitch("clr");
    }

    return dlx;

}(DLX,SRS));
