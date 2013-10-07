/* Mouse and keyboard handling*/
var SRS = (function(srs) {
    srs.mouse = function(output){
        var output = output || new srs.Signal();
        
        window.onmousemove = function(e) {
            output.set_value({x: e.pageX, y: e.pageY});
        };
        return output;
    };

    srs.arrows = function(output){
        var output = output || new srs.Signal();

        var current = {x:0, y:0};

        var handle_keydown = function(e) {
            console.log("down: " + e.keyCode);
            switch(e.keyCode) {
            case 37:
                current.x = -1;
                break;
            case 38:
                console.log("up arrow pressed");
                current.y = -1;
                break;
            case 39:
                current.x = 1;
                break;
            case 40:
                current.y = 1;
                break;
            default:
                break;
            }
            output.set_value(current);
        };

        var handle_keyup = function(e) {
            switch(e.keyCode) {
            case 37:
                current.x = 0;
                break;
            case 38:
                current.y = 0;
                break;
            case 39:
                current.x = 0;
                break;
            case 40:
                current.y = 0;
                break;
            default:
                break;
            }
            output.set_value(current);
            console.log("up");
        };

        window.addEventListener("keydown",handle_keydown,true);
        window.addEventListener("keyup",handle_keyup,true);

        return output;
    };
    
    return srs;
}(SRS));
