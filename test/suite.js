
var cycles = 1;
var evalComparison = false;
// Fixture for single object as the execution context
// var fixtures = require("./fixtures");

// Fixture for using an array of objects as the execution context (behaves life memory frames)
var funex = require("../lib/funex");
var fixtures = require("../test-utils/fixtures-stack");
var runner = require("../test-utils/runner");

// test name, expression, expected
var tests = [
		["Simple variable access", "lorem", "ipsum"],
		["Simple string", "'TEST'", "TEST"],
		["Simple numeric integer", "12345", 12345],
		["Simple numeric decimal", "2345.234", 2345.234],
		["Simple numeric decimal with zero'", "01315.2380", 1315.238],
		["Simple negative numeric decimal with zero'", "-01315.2380", -1315.238],
		["Dot notation", "kidsObj.first", "Billy"],
		["Dot notation with whitespace", "  kidsObj.first  ", "Billy"],
		["Dot notation with whitespace around the dot", "  kidsObj  .  first  ", "Billy"],
		["Multiline and tabs", "  \n\tkidsObj\n\t\t.first\t\n  ", "Billy"],
		["Function call with no argument", "allKids()", "Billy, Julia"],
		["Function call with first empty argument", "allKids(,5)", "Billy, Julia"], // Force code coverage
		["Function call with a multiple argument", "getKid(1)", "Julia"],
		["Array call with number", "kids[0]", "Billy"],
		["Array call with string", "kidsObj['second']", "Julia"],
		["Function call with multiple arguments", "plus3(1, 2, 3)", 6],
		["Collapse double-single quote", "'TES\\'T'", "TES'T"],
		["collpase double-single quote in object", "  actions['didn\\'t']  ", "did not"],
		["collpase double-single quote in object at end", "  actions['james\\'']  ", "jameses"],
		["Simple string with single quote", "'L\\'TEST'", "L'TEST"],
		["Simple string with single quote at first", "'\\'LTEST'", "'LTEST"],
		["Simple string with single quote at last", "'LTEST\\''", "LTEST'"],
		["Simple string with multiple single quote at last", "'\\'L\\'\\'TEST\\''", "'L''TEST'"],
		["empty string", "''",""],
		["Multiple statements", "'abcd'; plus3(1, 2, 3);", 6],
		["Multiple statements with trailing semicolons", "'abcd'; plus3(1, 2, 3);;; ", 6],
		["Multiple statements in multiline", "'abcd';\n\tplus3(1, 2, 3);\n\tkidsObj['second'];", "Julia"],
		["Inline JSON notation", 'keys({"a":1, "b":2, "c":3, "d": {"abc": 999}})', "a,b,c,d"],
		["more empty string", "   ''    ",""],
		[
			"Function call with multiple complex arguments",
			"join(kidsObj.first, kidsObj.second)",
			"Billy-Julia"
		],[
			"Function call within function calls with multiple complex arguments",
			"join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))",
			"Billy-Julia-Julia-Billy"
		], [
			"Function call within function calls with multiple complex arguments using double-single quotes",
			"join(join(actions['didn\\'t'], actions['couldn\\'t']), join(actions['couldn\\'t'], 'wild\\'card\\''))",
			"did not-could not-could not-wild'card'"
		], [
			"Exception thrown when using function call parens not on a function",
			"()",
			"Type error: undefined is not a function : ()",
			{isException: true}
		], [
			"Exception thrown when using function call parens on undefined",
			"someBogusVar()",
			"Type error: undefined is not a function : someBogusVar()",
			{isException: true}
		], [
			"Exception thrown when calling a property on undefined",
			"someBogusVar.someUndefinedValue",
			"Cannot read property 'someUndefinedValue' of undefined : someBogusVar.someUndefinedValue",
			{isException: true}
		], [
			"Exception thrown when calling a property on undefined with brackets",
			"someBogusVar['someUndefinedValue']",
			"Cannot read property 'someUndefinedValue' of undefined : someBogusVar['someUndefinedValue']",
			{isException: true}
		], [
			"Exception thrown when closing a brace before openning one",
			"someBogusVar}",
			"Syntax error : someBogusVar}",
			{isException: true}
		], [
			"Exception when expression contains one closing parens too many",
			"join('a', 'b'))",
			"Syntax error : Illegal call : join('a', 'b'))",
			{isException: true}
		], [
			"Exception when trying to use arythmetic operations",
			"join(2 + 3, 'b'))",
			"Syntax error : join(2 +",
			{isException: true}
		], [
			"Exception when using comma outside of a function call",
			"2, 3, 4",
			"Syntax error : 2,",
			{isException: true}
		], [
			"Exception when ",
			"2 4 4",
			"",
			{isException: true}
		], [
			"Exception when ",
			"'abc' 4",
			"",
			{isException: true}
		]
];

runner(funex, tests, fixtures, cycles, evalComparison);


