var
		result,
		funex = require("../lib/funex"),
		should = require("should"),
		assert = require("assert");

var context = {
	lorem: "ipsum",
	kidsObj: {
		first: "Billy",
		second: "Julia"
	},
	kids: [
		"Billy",
		"Julia"
	],
	allKids: function () {
		return this.kids.join(", ")
	},
	getKid: function (i) {
		return this.kids[i]
	}
};

var result = funex("lorem", context);
assert.equal(result, "ipsum");

var result = funex("kidsObj.first", context);
assert.equal(result, "Billy");

// Function call with no argument
var result = funex("allKids()", context);
assert.equal(result, "Billy, Julia");

// Function call with a multiple argument
var result = funex("getKid(1)", context);
assert.equal(result, "Julia");

/*
// Function call with a single argument
var result = funex("allKids()", context);
assert.equal(result, "Billy, Julia");
 */


//funex("lorem.patate('this, is not', val[0], this)", context);
//funex("{ a:[1,2] , b:[3,4] }", context);
