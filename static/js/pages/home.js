jQuery(function($) {
    $('button').on('click', function(e) { 
        e.preventDefault();
        var val = $('input').val()
        
        var match = /^((((http)(s)?):)?\/\/)?([^\/:]*):?([0-9]*)(\/?.*)/.exec(val);
        var protocol = match[3] || "http";
        var host = match[6];
        var port = match[7] ? ':' + match[7] : '';
        var path = match[8];
        var secure = protocol === "https";

        var newPath = "http://" + (secure ? "doges." : "doge.") + host + ".dogeifyit.com" + port + path;

        window.location = newPath;
    });

    $('#destination').on('keydown', function(e) {    
        var keycode;    

        if (window.event) 
            keycode = window.event.keyCode;   
        else if (e) 
            keycode = e.which;  
        else 
            return true; 

        if(keycode == 13) {    
            $('button').click();   
        }
    });

    $('.top-sites ul li a').click(function() {
        $('#destination')
            .val($(this).attr('href'))
            .focus();

        return false;
    });

    var referrer = window.location.hash;

    if(referrer) {
        $('#referrer').val(referrer);
    }

    // preload doge-go-woah (shown on URL input focus)
    var woah = new Image();
    woah.src = "i/doge-go-woah.png";
});