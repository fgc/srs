/* DOM based IO elements */
var SRS = (function(srs) {


    function make_checkbox(id, context) {
        var context = context || document.body;
        var el = document.createElement("input");
        el.id = id;
        el.type = "checkbox";
        context.appendChild(el);
        return el;
    }

    srs.checkbox = function (id, input, output, context) {
        var output = output || new srs.Signal();
        var el = document.getElementById(id) || make_checkbox(id, context);
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

    /** end dom based IO**/
    return srs;
}(SRS));
