$(function() {
    $("input").focus();
    $("#eins button").click(function() {
        location.href = "#zwei"; // oder window.location
        $("input").val("");
        return false;
    });
    $("#drei #zurueck").click(function() {
        location.href = "#eins";
        $("input").focus();
    });
});
