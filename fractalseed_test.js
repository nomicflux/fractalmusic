describe("RandInt: ", function() {
    it("should give 0", function() {
	var x = randInt(0,1);
	expect(x).toEqual(0);
    });
});

describe("Quot and Mod:", function() {
    var a = 10;
    var b = 3;
    var c = -3;

    it("10 / 3 should be 3", function() {
	expect( quot(a, b) ).toEqual(3);
    });

    it("10 % 3 should be 1", function() {
	expect( posMod(a, b) ).toEqual(1);
    });

    it("10 % -3 should be 1", function() {
	expect( posMod(a, c) ).toEqual(1);
    });
});
