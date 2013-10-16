var DLX = (function(dlx,srs) {
    var dlx = dlx || {};
    
    dlx.components = {};
    
    dlx.components.register = function (input, clk, clr, load, output) {
        var content = 0;

        var onclk= function(clk_val) {
            if (clr.get_value()) {
                content = 0;
                return 0;
            }

            if (clk_val && load.get_value()) {
                var old_content = content;
                content = input.get_value();
                return old_content;
            }

            return content;
        }
        
        var onclr = function(clr_val) {
            content = 0;
            return 0;
        };

        srs.lift(onclr, clr);

        return srs.lift(onclk, clk, 1, output);
    };

    dlx.components.mux = function (select, input_hi, input_lo, output) {
        return srs.if_s(select, input_hi, input_lo, output);
    };
    
    return dlx;
}(DLX,SRS));
