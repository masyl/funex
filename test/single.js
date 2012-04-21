var
		fixtures = require("./fixtures");
		runner = require("./runner");

// test name, expression, expected
var tests = [
		[
			"Function calls inside function calls",
			"join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))",
			"Billy-Julia-Billy-Julia"
		]
];

runner(tests, fixtures, 1);