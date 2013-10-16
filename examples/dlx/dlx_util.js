var DLX = (function(dlx,srs) {
    var dlx = dlx || {};
    
    dlx.util = {};
    
    var op = [];
    var fn = [];

    op[2]="j";
    op[3]="jal";
    op[4]="beq";
    op[5]="bne";
    op[6]="blez";
    op[7]="bgtz";
    op[8]="addi";
    op[9]="addiu";    
    op[10]="stli";
    op[11]="sltiu";
    op[12]="andi";
    op[13]="ori";
    op[14]="xori";
    op[24]="llo";
    op[25]="lhi";
    op[26]="trap";
    op[32]="lb";
    op[33]="lh";
    op[35]="lw";
    op[36]="lbu";
    op[37]="lhu";
    op[40]="sb";
    op[41]="sh";
    op[43]="sw";
    fn[0]="sll";
    fn[2]="srl";
    fn[3]="sra";
    fn[4]="sllv";
    fn[6]="srlv";
    fn[7]="srav";
    fn[8]="jr";
    fn[9]="jalr";
    fn[16]="mfhi";
    fn[17]="mthi";
    fn[18]="mflo";
    fn[19]="mtlo";
    fn[24]="mult";
    fn[25]="multu";
    fn[26]="div";
    fn[27]="divu";
    fn[32]="add";
    fn[33]="addu";
    fn[34]="sub";
    fn[35]="subu";
    fn[36]="and";
    fn[37]="or";
    fn[38]="xor";
    fn[39]="nor";
    fn[42]="slt";
    fn[43]="sltu";


    //TODO shifts and jumps
    dlx.util.disassemble = function(instruction) {
        if (instruction == 0) {
            return "nop";
        }
        var opcode = instruction >>> 26;
        var name = (opcode==0)?fn[instruction & 0x1f]:op[opcode];
        if (name == undefined) {
            return "bad instruction: 0x" + instruction.toString(16);
        };
        var rd = instruction >>> 21 & 0x1f;
        var rs1 = instruction >>> 16 & 0x1f;
        var rs2 = instruction >>> 11 & 0x1f;
        var imm = instruction & 0xffff;
        
        if ((opcode >>> 3) & 1 == 1) {
            return name + " r" + rd + ", " + "r" + rs1 + ", " + imm;
        }
        return name + " r" + rd + ",r" + rs1 + ", r" + rs2;
    };

    return dlx;
}(DLX,SRS));
