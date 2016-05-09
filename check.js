(function() {
    var pattern = /\(Total: (\d+)\)/g;
    var h1s = document.getElementsByTagName("H1");

    for (var i=0; i<h1s.length; i++) {
        var h1 = h1s[i].textContent;
        var match = pattern.exec(h1);
        if (match) {
            var count = match[1];
            if (count > 0) {
                return true;
            }
        }
    }

    return false;
})();