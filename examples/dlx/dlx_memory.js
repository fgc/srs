(function(dlx,r) {

    dlx.memory = {};

    var memory_buffer = new ArrayBuffer(dlx.config.ram_size);
    var ui8view = new Uint8Array(memory_buffer);
    var ui32view = new Uint32Array(memory_buffer);
    
    function align_checker(input) {
        var aligned = function(addr){
            if (addr % 4 != 0) {
                alert("Wrong alignment for address: " + addr);
                return undefined;
            }
            return addr;
        };
        
        return r.lift(aligned, input);
    };

    dlx.memory.instruction_cache = function (addr, clk) {
        addr.set_value(0);
        var read_proc = function(addr_value) {
            var word_addr = addr_value / 4;
            return ui32view[word_addr];
        };
        var content = r.lift(read_proc, align_checker(addr));
        return r.sample_on(content, r.inverter(clk).rising_edge());
    }; 


    dlx.memory.test_data = function() {
        for (var i = 0; i < 10; i++) {
            ui32view[i] = 2*i;
        }
        ui32view[10] = 0xffffffff;
        for (var i = 41; i < 50; i++) {
            ui8view[i] = 2*i;
        }
        
    };

    return dlx;
}(DLX,SRS));
