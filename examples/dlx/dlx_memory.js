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

    dlx.memory.instruction_cache = function (addr) {
        addr.set_value(0);
        var read_proc = function(addr_value) {
            var word_addr = addr_value / 4;
            return ui32view[word_addr];
        };
        return r.lift(read_proc, align_checker(addr));
    }; 


    dlx.memory.ram_test_data = function() {
        
        ui32view[0] = 0x20010064;
        ui32view[1] = 0x20220065;
        ui32view[2] = 0x20430066;
        ui32view[3] = 0x24640067;

        for (var i = 4; i < 10; i++) {
            ui32view[i] = 2*i;
        }
        ui32view[10] = 0xffffffff;
        for (var i = 41; i < 50; i++) {
            ui8view[i] = 2*i;
        }
        
    };



    var register_buffer = new ArrayBuffer(32);
    var register_view = new Int32Array(register_buffer);

    dlx.memory.register_file = function(reg_A, reg_B, reg_W, data_W, W) {
        
        r.lift(function(W_val) {
            if (W_val) {
                register_view[reg_W.get_value()] = data_W.get_value(); 
            }
        }, W);

        var read_reg = function (reg) {
            if (reg == 0) {
                return 0;
            }
            return register_view[reg];
        };
        
        return {
            out_a: r.lift(read_reg, reg_A),
            out_b: r.lift(read_reg, reg_B)
        };

    };

    dlx.memory.register_test_data = function() {
        
       register_view[1] = 111;
       register_view[2] = 222;
       register_view[3] = 333;
       register_view[4] = 444;
       register_view[5] = 555;
    }

    return dlx;
}(DLX,SRS));
