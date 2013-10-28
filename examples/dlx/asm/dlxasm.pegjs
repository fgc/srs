dasm
	= lines: (reg)+ {
                return lines;
            }	

/* Lexical elements */

SourceCharacter
    = .

WhiteSpace "whitespace"
    = [\t\v\f \u00A0\uFEFF]

_
    = (WhiteSpace)*

LineTerminator
    = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
    = "\n"
    / "\r\n"
    / "\r"
    / "\u2028" // line separator
    / "\u2029" // paragraph separator

EOL
    = (LineTerminatorSequence / ";" LineTerminatorSequence)

Comment "comment"
    = ";" (!LineTerminator SourceCharacter)*

Identifier "identifier"
    = !Reserved name:IdentifierName { return name; }

IdentifierName "identifier"
    = start:IdentifierPart parts:IdentifierPart* {
            return parts.join("");
}   

IdentifierPart
    = [0-9a-z-A-Z] / "_"

Reserved
    =
    (
    "addi" /
     "addui" /
    "andi" /
    "beqz" /
    "bfpf" /
    "bfpt" /
    "bnez" /
    "j" /
    "jal" /
    "jalr" /
    "jr" /
    "lb" /
    "lbu" /
    "ld" /
    "lf" /
    "lh" /
    "lhi" /
    "lhu" /
    "lw" /
    "ori" /
    "rfe" /
    "sb" /
    "sd" /
    "seqi" /
    "sf" /
    "sgei" /
    "sgeui" /
    "sgti" /
    "sgtui" /
    "sh" /
    "slei" /
    "sleui" /
    "slli" /
    "slti" /
    "sltui" /
    "snei" /
    "srai" /
    "srli" /
    "subi" /
    "subui" /
    "sw" /
    "trap" /
    "xori" /
    "la" /
    "nop" /
    "add" /
    "addu" /
    "and" /
    "movd" /
    "movf" /
    "movfp2i" /
    "movi2fp" /
    "movi2s" /
    "movs2i" /
    "or" /
    "seq" /
    "sge" /
    "sgeu" /
    "sgt" /
    "sgtu" /
    "sle" /
    "sleu" /
    "sll" /
    "slt" /
    "sltu" /
    "sne" /
    "sra" /
    "srl" /
    "sub" /
    "subu" /
    "xor" /
    "addd" /
    "addf" /
    "cvtd2f" /
    "cvtd2i" /
    "cvtf2d" /
    "cvtf2i" /
    "cvti2d" /
    "cvti2f" /
    "div" /
    "divd" /
    "divf" /
    "divu" /
    "eqd" /
    "eqf" /
    "ged" /
    "gef" /
    "gtd" /
    "gtf" /
    "led" /
    "lef" /
    "ltd" /
    "ltf" /
    "mult" /
    "multd" /
    "multf" /
    "multu" /
    "ned" /
    "nef" /
    "subd" /
    "subf"
    ) !IdentifierPart

Register
    = ("r"/"$") digits:[0-9]+ {
    register = parseInt(digits.join(""), 10); 
    if (register > 31) { 
        throw new Error ("No such register: r" + register);
    }
    return register;
}

RegInst
  = (
    "add" /
    "sub"
    )

reg
   = instr:RegInst _ reg1:Register _ "," _ reg2:Register _ "," _ reg3:Register _ EOL {
    return [instr, reg1, reg2, reg3];
}


