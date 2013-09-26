/* Reactive ajax */
var SRS = (function(srs) {

    srs.http_get = function(input, output) {
        var output = output || new srs.Signal();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
              output.set_value(xmlhttp.responseText);
          }  
        };
        
        input.add_action(function() {
            var in_value = input.get_value();
            if (in_value != undefined) {
                xmlhttp.open("GET", input.get_value(), true);
                xmlhttp.send();
            }
        });
        return output;
    }
    /** end reactive ajax**/
    return srs;
}(SRS));
