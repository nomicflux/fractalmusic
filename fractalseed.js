function randInt(a, b) {
    return Math.floor(a + Math.random() * (b-a));
}

function quot(a, b) {
    if(a == 0) { return 0; } else {
	return Math.round( a/b - (a%b)/b);
    }
}

function posMod(a, b) {
    var m = a % b;
    if(m >= 0) { return m; } else { return (b+m); }
}

var fractal = (function() {
    var probabilities = [1, 1, 4, 8, 8, 4, 8, 8, 4, 1, 1];
    var likelihoods = [];

    var setLikelihoods = function () {
	var total = _.reduce(probabilities, function(acc, num) { return acc + num; }, 0);
	var probs = _.map(probabilities, function(i) { return i / total; });
	likelihoods = [];
	for(var i = 0; i < probs.length; i++) {
	    likelihoods.push(0);
	    for(var j = 0; j <= i; j++) {
		likelihoods[i] += probs[j];
	    }
	}
	likelihoods[likelihoods.length - 1] = 1.00001;
    };
		 	
    function randomWalk() {
	if(!likelihoods || likelihoods.length == 0) { setLikelihoods(); }
	var prob = Math.random();
	var place = 0;
	while(prob > likelihoods[place]) { place++; }
	return (place - Math.floor(probabilities.length / 2));
    }

    function fractalChunk(n, s) {
	var chunk = [];
	var prev = n;
	var fixed = true;
	while(fixed) {
	    for(var i= 0; i < s; i++) {
		var next = randomWalk() + prev;
		chunk.push( next );
		fixed = fixed && (next == prev);
		prev = next; 
	    }
	}
	return chunk;
    }

    function toTritave(arr) {
	var newArr = [];
	for(var i = 0; i < arr.length; i++) {
	    var m = posMod(arr[i], music.numNotes);
	    var q = quot(arr[i]-m, music.numNotes);
	    newArr.push({note: m, tritave: q});
	}
	return newArr;
    }

    function tritaveCorrect(arr, t) {
	var newArr = [];
	for(var i = 0; i < arr.length; i++) {
	    if(arr[i].isObject) {
		var q = quot(arr[i].note, music.numNotes);
		var m = posMod(arr[i].note, music.numNotes);
		newArr.push({note: m,
			     tritave: arr[i].tritave + q});
	    } else {
		newArr.push({note: posMod(arr[i], music.numNotes), 
			     tritave: quot(arr[i], music.numNotes) + t});
	    }
	}
	return newArr;
    }

    var fractalPattern = function (minSize, maxSize) {
	var pattern = [];
	for(var i = 0; i < music.numNotes; i++) {
//	    pattern.push(fractalChunk(i, randInt(minSize, maxSize)));
	    pattern.push(fractalChunk(0, randInt(minSize, maxSize)));
	}
	return pattern;
    };

    var fractalSeed = function (s) {
	var seed = [0];
	if(s > 1) {
	    seed = seed.concat(fractalChunk(0, s-1));
	}
	return seed;
    }

    function printSong(arr) {
	var songStr = [];
	for(var i=0; i<arr.length; i++) {
	    songStr.push("Note: " + arr[i].note + ", Tritave: " + arr[i].tritave + "\n");
	}
	return songStr;
    }

    function flatten(arrs) {
	var newArr = [];
	for(var i=0; i<arrs.length; i++) {
	    newArr = newArr.concat(arrs[i]);
	}
	return newArr;
    }

    function applyPattern(arr, num) {
	var newArr = [];
	for(var i = 0; i < arr.length; i++) {
	    newArr.push(arr[i] + num);
	}
	return newArr;
    }

//    var lookup=['C', 'D', 'E', 'F', 'G', 'H', 'J', 'A', 'B'];
    
    var printPattern = function(p) {
	var str = "";
	for(var i =0; i<p.length; i++) {
	    str += i + " => " + p[i] + "<br />";
	}
	return str;
    };

    var fractalSong = function(depth, startSize, minSize, maxSize) {
	var seed = fractalSeed(startSize);
	var pattern = fractalPattern(minSize, maxSize);
	var prev = seed;
	var song = [];
	try {
	    for(var i = 0; i < depth; i++) {
		song = [];
		for(var j = 0; j < prev.length; j++) {
		    var n = posMod(prev[j], music.numNotes);
		    var transformed = _.map(pattern[n],
					    function(a) { return a + prev[j]; } );
		    song = song.concat( transformed );
		}
		prev = song;
	    }
	} catch(e) {
	    alert("Error in fractalSong\n" + 
		  "Prev: " + printSong(prev) + "\n" +
		  "Pattern: " + pattern + "\n" +
		  "Song: " + printSong(song) + "\n");
	    return;
	}
	return {song: toTritave(prev),
		seed: seed,
		pattern: pattern};
    }

    return({
	fractalSong: fractalSong,
	printPattern: printPattern
    });
})();
