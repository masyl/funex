var
		cycles = 1000000,
		evalComparison = false,
		fixtures = require("./fixtures");
		runner = require("./runner");

// test name, expression, expected
var tests = [
		["Simple variable access", "lorem", "ipsum"]
		,["Simple string", "'TEST'", "TEST"]
		,["Simple number", "12345", 12345]
		,["Dot notation", "kidsObj.first", "Billy"]
		,["Dot notation with whitespace", "  kidsObj.first  ", "Billy"]
		,["Dot notation with whitespace around the dot", "  kidsObj  .  first  ", "Billy"]
		,["Function call with no argument", "allKids()", "Billy, Julia"]
		,["Function call with a multiple argument", "getKid(1)", "Julia"]
		,["Array call with number", "kids[0]", "Billy"]
		,["Array call with string", "kidsObj['second']", "Julia"]
		,["Function call with multiple arguments", "plus3(1, 2, 3)", 6]
		,["Function call with multiple complex arguments", "join(kidsObj.first, kidsObj.second)", "Billy-Julia"]
];

runner(tests, fixtures, cycles, evalComparison);