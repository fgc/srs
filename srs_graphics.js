/* DOM based reactive UI elements */
var SRS = (function(srs) {

    //** checkboxes that act as toggles and "leds" **/
    function make_checkbox(id, context) {
        var el = document.createElement("input");
        el.id = id;
        el.type = "checkbox";
        context.appendChild(el);
        return el;
    }

    function make_led(id, context) {
        var outerdiv = document.createElement("div");
        outerdiv.style = "display: inline-block;text-align: center;"
        //outerdiv.innerHTML = id;

        var cb = document.createElement("input");
        cb.id = id;
        cb.type = "checkbox";
        cb.className = "led-red";
        outerdiv.appendChild(cb);

        var led_div = document.createElement("div");
        led_div.className = "led-red";
        outerdiv.appendChild(led_div);

        context.appendChild(outerdiv);

        return cb;
    }

    function make_switch(id, context) {
        var switch_span = document.createElement("span");
        switch_span.className = "switch";

        var switch_border1 = document.createElement("span");
        switch_border1.className = "switch-border1";
        switch_span.appendChild(switch_border1);

        var switch_border2 = document.createElement("span");
        switch_border2.className = "switch-border2";
        switch_border1.appendChild(switch_border2);

        var cb = document.createElement("input");
        cb.id = id;
        cb.type = "checkbox";
        switch_border2.appendChild(cb);
        
        lbl = document.createElement("label");
        lbl.setAttribute("for", id);
        switch_border2.appendChild(lbl);
        
        var sw_classes=["switch-top",
                        "switch-shadow",
                        "switch-handle",
                        "switch-handle-left",
                        "switch-handle-right",
                        "switch-handle-top",
                        "switch-handle-bottom",
                        "switch-handle-base"];

        var ispan;
        for (var i = 0; i < sw_classes.length; i++) {
            ispan = document.createElement("span");
            ispan.className = sw_classes[i];
            switch_border2.appendChild(ispan);
        }

        context.appendChild(switch_span);
        return cb;
     
    }
    

    function checkbox_el(type, id, context) {
        switch(type) {
        case srs.checkbox.STD:
            return make_switch(id,context);
        case srs.checkbox.LED:
            return make_led(id,context);
        case srs.checkbox.SWITCH:
            return make_switch(id,context);
        default:
            return make_checkbox(id,context);
        }
    };

    srs.checkbox = function(id, input, output, context, type) {
        var context = document.getElementById(context) || document.body;
        var output = output || new srs.Signal();
        var el = document.getElementById(id) || checkbox_el(type, id, context);
        el.checked = false;
        output.set_value(undefined);
        el.onchange = function() {
            output.set_value(el.checked);
            return false; //?????
        }
        if (input != undefined) {
            el.disabled = true;
            input.add_action(function() {
                var new_value = input.get_value();
                el.checked = new_value;
                output.set_value(new_value);
            });      
        }

        return output;
    };

    var cb_type = 0;
    srs.checkbox.LED = cb_type++; 
    srs.checkbox.SWITCH = cb_type++; 
    srs.checkbox.STD = cb_type++; 


    srs.Signal.prototype.checkbox = function(id, output, context, type) {
        return srs.checkbox(id, this, output, context, type); 
    };

    srs.Signal.prototype.led = function(id, context) {
        return srs.checkbox(id, this, undefined, context, srs.checkbox.LED);
    }

    srs.flipswitch = function(id, context, output) {
        return srs.checkbox(id, undefined, output, context, srs.checkbox.SWITCH);
    }

    /*********************************************************************/

    function make_textinput(id, context) {
        var el = document.createElement("input");
        el.id = id;
        el.type = "text";
        context.appendChild(el);
        return el;
    }
    
    srs.textinput = function(id, input, output, context) {
        var context = document.getElementById(context) || document.body;
        var output = output || new srs.Signal();
        var el = document.getElementById(id) || make_textinput(id, context);
        el.onchange = function() {
            output.set_value(el.value);
        }
        el.onkeypress = el.onchange
        el.onpaste = el.onchange;
        el.oninput = el.onchange;;
        
        
        if (input != undefined) {
            //el.disabled = true;
            input.add_action(function() {
                var new_value = input.get_value();
                el.value = new_value;
                output.set_value(new_value); //will onchange fire by itself so this is redundant?
            });      
        }

        return output;
    };



    /*******************************************/
    function make_span(id, context) {
        var context = context || document.body;
        var el = document.createElement("span");
        el.id = id;
        context.appendChild(el);
        return el;
    }

    srs.as_text = function(id, input, context) {
        var el = document.getElementById(id) || make_span(id, context);
        
        input.add_action(function() {
            var new_value = input.get_value();
            el.innerHTML = new_value;
        });
        return input;
    };

    srs.Signal.prototype.as_text = function (id, context) {
        return srs.as_text(id, this, context); 
    };




    /** end dom based UI**/
    return srs;
}(SRS));
