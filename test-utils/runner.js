var
		evalCompare = false,
		result,
		should = require("should"),
		assert = require("assert");

module.exports = function (funex, tests, fixtures, cycles, evalComparison) {
	describe("With a series of tests and fixtures, repeated " + cycles + " times", function () {
		var
				i,
				options,
				singleTest;
		for (i = 0; i < tests.length; i++) {
			singleTest = tests[i];
			options = {};
			if (singleTest.length === 4) options = singleTest[3];
			test(singleTest[0], singleTest[1], singleTest[2], options, cycles, evalComparison);
		}
	});

	function test(testName, expression, expected, options, cycles, evalCompare) {
		var funex1 = funex(expression);
		describe(testName + " : " + expression, function () {
			var result;

			if (evalCompare) {
				describe('Evaluated using eval()', function () {
					// Load fixtures in the global context for comparing with eval
					for (var attr in fixtures) {
						if (fixtures.hasOwnProperty(attr)) this[attr] = fixtures[attr];
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
					var i, e, err = "";
					if (options.isException) {
						try {
							for (i = 0; i < cycles; i++) {
								result = funex1(fixtures);
							}
						} catch (e) {
							err = e;
						}
						err.should.equal(expected);
					} else {
						for (i = 0; i < cycles; i++) {
							result = funex1(fixtures);
						}
						result.should.equal(expected);
					}
				});
			}


		});
	}
}