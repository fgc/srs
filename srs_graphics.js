/* DOM based reactive UI elements */
var SRS = (function(srs) {

    //** checkboxes that act as toggles and "leds" **/
    function make_checkbox(id, context) {
        console.log("Making CB");
        var el = document.createElement("input");
        el.id = id;
        el.type = "checkbox";
        context.appendChild(el);
        return el;
    }

    function make_led(id, context) {
        console.log("Making led");
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
        console.log("Making switch");

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
        for (var i = 0; i < swclasses.length; i++) {
            ispan = document.createElement("span");
            ispan.className = swclasses[i];
            switch_border2.appendChild(ispan);
        }

        return cb;
     
    }

    srs.checkbox = function(id, input, output, context, is_led) {
        var context = document.getElementById(context) || document.body;
        var output = output || new srs.Signal();
        console.log("is_led is: " + is_led);
        var el = document.getElementById(id) || 
            (is_led?make_led(id, context):make_checkbox(id, context));
        console.log(el);
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


    srs.Signal.prototype.checkbox = function (id, output, context, is_led) {
        return srs.checkbox(id, this, output, context, is_led); 
    };

    function make_span(id, context) {
        var context = context || document.body;
        var el = document.createElement("span");
        el.id = id;
        context.appendChild(el);
        return el;
    }

    srs.as_text = function(id, input, context) {
        var output = output || new srs.Signal();
        var el = document.getElementById(id) || make_span(id, context);
        
        input.add_action(function() {
            var new_value = input.get_value();
            el.innerHTML = new_value;
        });      
    };

    srs.Signal.prototype.as_text = function (id, context) {
        return srs.as_text(id, this, context); 
    };




    /** end dom based UI**/
    return srs;
}(SRS));
