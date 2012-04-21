var
		cycle = 100,
		evalCompare = false,
		result,
		funex = require("../lib/funex"),
		should = require("should"),
		assert = require("assert");


var data = {
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
		/*
		,[
			"Function calls inside function calls",
			"join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))",
			"Billy-Julia-Billy-Julia"
		]
		*/
];


describe("With the test suite and sample data", function () {
	var
			i,
			singleTest;
	for (i = 0; i < testSuite.length; i++) {
		singleTest = testSuite[i];
		test(singleTest[0], singleTest[1], singleTest[2], cycle, evalCompare);
	}
});

function test(testName, expression, expected, cycles, evalCompare) {
	var funex1 = funex(expression);
	describe(testName + " : " + expression, function () {
		var result;

		if (evalCompare) {
			describe('Evaluated using eval()', function () {
				// Load data in the global context for comparing with eval
				for (var attr in data) {
					if (data.hasOwnProperty(attr)) this[attr] = data[attr];
				}
				it('Should equal "' + expected + '"', function() {
					for (var i = 0; i < cycles; i++) {
						result = eval(expression);
					}
					result.should.equal(expected);
				});
			});
			describe('Evaluated using funex()', testFn);
		} else {
			testFn();
		}

		function testFn() {
			it('Should equal "' + expected + '"', function() {
				for (var i = 0; i < cycles; i++) {
					result = funex1(data);
				}
				result.should.equal(expected);
			});
		}


	});
}
