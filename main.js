 var timeChunk = 300;
 var startTime = 1000;
 var gap = 25;
 var mode = 0;

 var oscillator = [];
 var amp = [];

 var violinamp = [1,1/2,1/3,1/4,1/5,1/6];
 var violinfreq = [1,2,3,4,5,6];

 var clarinetamp = [1, .75, .5, .14, .5, .12, .17];
 var clarinetfreq = [1, 3,5,7,8,11,13];

 var sineamp = [1];
 var sinefreq = [1];

 var ampchanges = clarinetamp;
 var freqchanges = clarinetfreq;
 var harmonics = freqchanges.length;

 var timeouts = [];

 function initAudio() {
   if( audioContext ) {
     for(var i = 0; i < harmonics; i++) {
       oscillator.push(audioContext.createOscillator());
       fixOscillator(oscillator[i]);

       amp.push(audioContext.createGain());
       amp[i].gain.value = 0;
    
       oscillator[i].connect(amp[i]);
       amp[i].connect(audioContext.destination);
       oscillator[i].start(0);
     }
   }
 }

 var lookup = ['C', 'D', 'E', 'F', 'G', 'H', 'J', 'A', 'B'];

 function startTone( note, tritave ) {
   var frequency = music.freq(note, tritave, mode);

   var mult = 1;
   frequency *= mult;
   var now = audioContext.currentTime;
    
   for(var i=0; i < harmonics; i++) {
     amp[i].gain.cancelScheduledValues(now);
     oscillator[i].frequency.setValueAtTime(freqchanges[i]*frequency, now);
     amp[i].gain.setValueAtTime(ampchanges[i]*amp[i].gain.value, now);
     amp[i].gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
   }

/*   var b = frequency / 261.6 / mult;
   var l = Math.round(Math.log(b) / Math.log(3) * 13);
   var m = posMod(l, music.numNotes);
   var tritave = quot(l -m , music.numNotes);
   $("#pattern").html("<p>"+lookup[m]+", Tritave " + tritave + "</p>"); */
}

function stopTone()
{
  var now = audioContext.currentTime; 
  for(var i = 0; i < harmonics; i++) {
    amp[i].gain.cancelScheduledValues(now);
    amp[i].gain.setValueAtTime(amp[i].gain.value, now);
    amp[i].gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 1.0);
  }
}

function playSong(notes, time) {
  var paused = true;

  for(var i=0; i < notes.length; i++) {
    var currTime = Date.now() - time;
    if(!paused) { timeouts.push(setTimeout('stopTone()', startTime - currTime + i*timeChunk - gap)); }
    var freq = music.freq(notes[i], mode);
    if(freq > 1) {
      timeouts.push(
	setTimeout('startTone(' + notes[i].note + ', ' + notes[i].tritave + ')', 
		   startTime - currTime + i*timeChunk));
      paused = false;
    } else {
      paused = true;
    }
  } 
  timeouts.push(setTimeout('clearSong()', startTime + notes.length*timeChunk));
}

function clearSong() {
  for(var i=0; i<timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
  timeouts = [];
  stopTone();
}

$(document).ready(function() {
  initAudio();
  $("#startMusic").click(function() {
    clearSong();

    var depth = parseInt($("#depth").val());
    var minsize = parseInt($("#minsize").val());
    var maxsize = parseInt($("#maxsize").val());
    mode = parseInt($("#mode").val());

    var song = fractal.fractalSong(depth,
				   1, 
				   minsize,
				   maxsize);
    var notes = song.song;

    var song2 = fractal.fractalSong(depth,
				    1, 
				    minsize,
				    maxsize);
    var notes2 = song2.song;
//    var pattern = song.pattern;

//    $("#pattern").html(fractal.printPattern(pattern));

    var time = Date.now();
    playSong(notes, time);
//    playSong(notes2, time);
  });
 8
  $("#stopMusic").click(function() {
    clearSong();
  });

  $("#changeMode").click(function() {
    mode = parseInt($("#mode").val());
  });

  $("#changeInstrument").click(function() {
    var prefix = $("#instrument").val();
    ampchanges = eval(prefix + "amp");
    freqchanges = eval(prefix + "freq");
    harmonics = freqchanges.length;
  });

 });
