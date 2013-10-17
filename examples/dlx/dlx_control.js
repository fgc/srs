var DLX = (function(dlx,srs) {
    var dlx = dlx || {};

    
    dlx.init_control = function() {

    dlx.control = {};

    dlx.control.clk = srs.flipswitch("clk");
    dlx.control.not_clk = srs.inverter(dlx.control.clk);
    dlx.control.clr = srs.flipswitch("clr");


    dlx.control.reg_data_write = new srs.Signal();
    dlx.control.reg_enable_write = new srs.Signal();
    dlx.control.reg_select_write = new srs.Signal();
    }

    return dlx;

}(DLX,SRS));
