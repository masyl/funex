var
		result,
		funex = require("../lib/funex"),
		should = require("should"),
		assert = require("assert");

var context = {
	lorem: "ipsum",
	kids: {
		first: "Billy",
		second: "Julia"
	},
	allKids: function () {
		return this.kids.join(", ")
	}
};

describe("With a sample context object", function () {

	describe('The expression "lorem"', function () {
		var result = funex("lorem", context);
		it("Should equal ipsum", function() {
			result.should.equal("ipsum");
		});
	});

	describe('The expression "kids.first"', function () {
		var result = funex("kids.first", context);
		it("Should equal Billy", function() {
			result.should.equal("Billy");
		});
	});

	describe('The expression "allKids()"', function () {
		var result = funex("allKids()", context);
		it('Should equal "Billy, Julia"', function() {
			result.should.equal("Billy, Julia");
		});
	});

});





