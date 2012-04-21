var
		cycles = 10000,
		evalComparison = false,
		fixtures = require("./fixtures");
		runner = require("./runner");

// test name, expression, expected
var tests = [
		["Simple variable access", "lorem", "ipsum"]
		,["Simple string", "'TEST'", "TEST"]
		,["Simple numeric integer", "12345", 12345]
		,["Simple numeric decimal", "2345.234", 2345.234]
		,["Simple numeric decimal with zero'", "01315.2380", 1315.238]
		,["Simple negative numeric decimal with zero'", "-01315.2380", -1315.238]
		,["Dot notation", "kidsObj.first", "Billy"]
		,["Dot notation with whitespace", "  kidsObj.first  ", "Billy"]
		,["Dot notation with whitespace around the dot", "  kidsObj  .  first  ", "Billy"]
		,["Function call with no argument", "allKids()", "Billy, Julia"]
		,["Function call with a multiple argument", "getKid(1)", "Julia"]
		,["Array call with number", "kids[0]", "Billy"]
		,["Array call with string", "kidsObj['second']", "Julia"]
		,["Function call with multiple arguments", "plus3(1, 2, 3)", 6]
		,[
			"Function call with multiple complex arguments",
			"join(kidsObj.first, kidsObj.second)",
			"Billy-Julia"
		],[
			"Function call within function calls with multiple complex arguments",
			"join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))",
			"Billy-Julia-Julia-Billy"
		]
];

runner(tests, fixtures, cycles, evalComparison);