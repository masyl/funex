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

// test name, expression, expected
var testSuite = [
		["Simple variable access", "lorem", "ipsum"],
		["Simple string", "'TEST'", "TEST"],
		["Simple number", "12345", "12345"],
		["Dot notation", "kidsObj.first", "Billy"],
		["Dot notation with whitespace", "  kidsObj.first  ", "Billy"],
		["Dot notation with whitespace around the dot", "  kidsObj  .  first  ", "Billy"],
		["Function call with no argument", "allKids()", "Billy, Julia"],
		["Function call with a multiple argument", "getKid(1)", "Julia"],
		["Array call with number", "kids[0]", "Billy"],
		["Array call with string", "kidsObj['second']", "Julia"],
		["Function call with multiple arguments", "plus3(1, 2, 3)", 6],
		["Function call with multiple complex arguments", "join(kidsObj.first, kidsObj.second)", "Billy-Julia"],
		[
			"Function calls inside function calls",
			"join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))",
			"Billy-Julia-Billy-Julia"
		]
];
