// sweet alerts config
swal.setDefaults({
    customClass: 'star-wars-alert',
});

var OpeningKey = null;

// make audio load on mobile devices
var audio = document.getElementsByTagName('audio')[0];
var audioIsLoaded = false;
var loadData = function () {
    if(!audioIsLoaded){
        audio.load();
        audioIsLoaded = true;
    }
};
document.body.addEventListener('touchstart', loadData);

function toggleLoading(){
    if(isLoading){
        $('#loader').hide();
    }else{
        $('#loader').show();
    }
    isLoading = !isLoading;
};


// prevent arrow scrolling in firefox
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    var type = document.activeElement.type || '';
    if(!type.startsWith('text')){
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }
}, false);

var notPlayed = true;
var isLoading = false;
var showFooter = true;


var opening = {
    "intro": "A long time ago, in a galaxy far,\nfar away....",
    "logo": "Evan's Birthday",
    "episode": "Episode V",
    "title": "RETURN OF THE BIRTHDAY",
    "text": "Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until all fun is destroyed.\nWith the support of the REPUBLIC,  Jedi Evan leads a brave RESISTANCE. He is desperate to have fun and to return peace and justice to the galaxy. Join him.\n      "
}

$(function() {
    StarWars.opening = opening;
    $("#videoButton").show();

    var intro = opening.intro.replace(/</g,"&lt;");
    intro = intro.replace(/>/g,"&gt;");
    intro = intro.replace(/\n/g,"<br>");
    StarWars.animation.find("#intro").html(intro);
    StarWars.animation.find("#episode").text(opening.episode);
    StarWars.animation.find("#title").text(opening.title);

    var ps = opening.text.split('\n');

    var div = StarWars.animation.find("#text");
    div.text('');
    for(var i in ps){
        div.append($('<p>').text(ps[i]));
    }

    $('#logosvg',StarWars.animation).css('width',$(window).width()+'px'); // set width of the logo
    $('#logoimg',StarWars.animation).css('width',$(window).width()+'px');

    var logoText = opening.logo ? opening.logo : "star\nwars";
    var aLogo = logoText.split('\n'); // breaks logo text in 2 lines
    var logo1 = aLogo[0];
    var logo2 = aLogo[1] || "";
    if(logoText.toLowerCase() != "star\nwars"){
        var texts = $('#logosvg text',StarWars.animation);
        texts[0].textContent = logo1;
        texts[1].textContent = logo2;

        // calculate the svg viewBox using the number of characters of the longest world in the logo.
        var logosize = logo1.length > logo2.length ? logo1 : logo2;
        var vbox = '0 0 '+logosize.length*200+' 500';
        $('#logosvg',StarWars.animation).each(function () {$(this)[0].setAttribute('viewBox', vbox) });
        $('#logosvg',StarWars.animation).show();
        $('#logoimg',StarWars.animation).hide();
    }else{ // if the logo text is "Star Wars" set to the logo SVG.
        $('#logosvg',StarWars.animation).hide();
        $('#logoimg',StarWars.animation).show();
    }

    var play = function(){
        $.when(StarWars.audioDefer).then(function(){
            var buffered = StarWars.audio.buffered.end(StarWars.audio.buffered.length-1);
            if(buffered == 0 && !audioIsLoaded){
                $('#loader').hide();
                playbutton = $('<div class="verticalWrapper"><div class="playAudio"><button id="playBut" class="playButton" style="font-size: 80px">Play</button></div></div>');
                $('body').append(playbutton);
                $('#playBut',playbutton).click(function(){
                    $('#loader').show();
                    playbutton.remove();
                });
                StarWars.audio.oncanplaythrough = function () {
                    toggleLoading();
                    notPlayed = false;
                    StarWars.play();
                };
            }else{
                toggleLoading();
                notPlayed = false;
                StarWars.play();
            }
        });
    };

    if(document.hasFocus()){ // play if has focus
        play();
    }else{
        $(window).focus(function(){ // play when got focus
            if(notPlayed){
                play();
            }
        });
    }

});


