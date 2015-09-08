var music = (function() {
    var tritave = 0;
    var middle_c = 261.6;
    var ratios = [1, 27/25, 25/21, 9/7, 7/5, 75/49, 5/3, 9/5, 49/25, 15/7, 7/3, 63/25, 25/9, 0];
    
    function note(str) {
	if(str.length > 1 && str.substr(1,2) == "#") { str = str.substr(0,1) + 's'; }
	return ratios[eval("CScale." + str)];
    }
    var CScale = {
	c: 0,
	cs: 1,
	db: 1,
	d: 2,
	eb: 2,
	ds: 3,
	e: 3,
	fb: 3,
	es: 4,
	f: 4,
	fs: 5,
	gb: 5,
	g: 6,
	hb: 6,
	gs: 7,
	h: 7,
	hs: 8,
	jb: 8,
	j: 9,
	ab: 9,
	js: 10,
	a: 10,
	as: 11,
	bb: 11,
	b: 12,
	pause: 13
    };
    var scales = [
	[note('c'), note('d'), note('e'), note('f'), note('g'), note('pause'), note('h'), note('j'), note('a'), note('b'), note('pause')],
	[note('c'), note('db'), note('eb'), note('f'), note('gb'), note('pause'), note('h'), note('jb'), note('a'), note('bb'), note('pause')],
	[note('c'), note('db'), note('e'), note('f'), note('g'), note('pause'), note('h'), note('j'), note('a'), note('b'), note('pause')],
	[note('c'), note('d'), note('e'), note('f#'), note('g'), note('pause'), note('h#'), note('j'), note('a#'), note('b'), note('pause')],
	[note('c'), note('db'), note('e'), note('f'), note('g'), note('pause'), note('h'), note('j'), note('a'), note('bb'), note('pause')],
	[note('c'), note('d'), note('e'), note('f#'), note('g'), note('pause'), note('h#'), note('j'), note('a'), note('b'), note('pause')],
	[note('c'), note('db'), note('e'), note('f'), note('g'), note('pause'), note('h'), note('jb'), note('a'), note('bb'), note('pause')],
	[note('c'), note('d'), note('e'), note('f#'), note('g'), note('pause'), note('h'), note('j'), note('a'), note('b'), note('pause')],
	[note('c'), note('db'), note('e'), note('f'), note('gb'), note('pause'), note('h'), note('jb'), note('a'), note('bb'), note('pause')],
	[note('c'), note('d'), note('e'), note('f'), note('g'), note('pause'), note('h'), note('j'), note('a'), note('bb'), note('pause')],
	[note('c'), note('db'), note('e'), note('f'), note('g'), note('pause'), note('h'), note('jb'), note('a'), note('b'), note('pause')]	
    ];

    var freq = function (n, t, m) {
	if(isNaN(n)) {
	    if(typeof n === 'object') {
		if(!t) { t = 0; }
		return scales[t][n.note] * middle_c * Math.pow(3, 1*n.tritave);
	    } else { 
		return note(n) * middle_c * Math.pow(3, 1 * t);
	    }
	} else {
	    if(!m) { m = 0; }
	    return scales[m][n] * middle_c * Math.pow(3, 1 * t);
	}
    };
    
    var numModes = scales.length;

    var numNotes = scales[0].length;

    return({freq: freq, 
	    numModes: numModes, 
	    numNotes: numNotes});
	
})();
