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
	join: function (a, b) {
		return a +"-" + b;
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
	},
	plus3: function (a, b, c) {
		return a + b + c;
	}
};
/*

*/

// Simple variable access
var result = funex("lorem", context);
assert.equal(result, "ipsum");

// Simple string
var result = funex("'TEST'", context);
assert.equal(result, "TEST");

// Simple number
var result = funex("12345", context);
assert.equal(result, 12345);

// Dot notation
var result = funex("kidsObj.first", context);
assert.equal(result, "Billy");

// Dot notation with whitespace
var result = funex("  kidsObj.first  ", context);
assert.equal(result, "Billy");

// Function call with no argument
var result = funex("allKids()", context);
assert.equal(result, "Billy, Julia");

// Function call with a multiple argument
var result = funex("getKid(1)", context);
assert.equal(result, "Julia");

// Array call with number
var result = funex("kids[0]", context);
assert.equal(result, "Billy");

// Array call with number
var result = funex("kidsObj['second']", context);
assert.equal(result, "Julia");

// Function call with multiple arguments
var result = funex("plus3(1, 2, 3)", context);
assert.equal(result, 6);

// Function call with multiple complex arguments
var result = funex("join(kidsObj.first, kidsObj.second)", context);
assert.equal(result, "Billy-Julia");

// todo: function calls with multiple arguments
// todo: check for missuse of dot notation
// todo: check for missuse of whitespaces
// todo: raise exception on unrecognized syntax
// todo: support for arrays declarations
// todo: support for arrays declarations with multiple item and depth
// todo: literal object syntax





