[![NPM version](https://badge.fury.io/js/funex.png)](http://badge.fury.io/js/funex)
[![Build Status](https://travis-ci.org/masyl/funex.png)](https://travis-ci.org/masyl/funex)
[![Dependency Status](https://gemnasium.com/masyl/funex.png)](https://gemnasium.com/masyl/funex)
[![Coverage Status](https://coveralls.io/repos/masyl/funex/badge.png?branch=master)](https://coveralls.io/r/masyl/funex)

# Funex

Javascript utility for secure evaluation of functional expressions.

Example usage:

	result = funex("members[id].name.fullname()", model);

## Features
- Secure: Expressions are evaluated and executed in a controlled and secure scope
- Small : Minified + Gzipped source is around 1.6k
- Supports function calls, dot notation, array/object members, strings, numbers
- Use array of objects to simulate closures.
- The syntax is a familiar subset of javascript
- Simple because it is logic-less: no operators, statements or boolean logic.
- Throws readable syntax errors
- Runs both in browser and on the server
- No complex api or configuration, a single function to use
- Compiled expressions can be cached and reused
- Minimal overhead compared to native code
- Extensive test suite and benchmarking
- Open source and maintained on Github

## Usefull for ...
- Resolving richer but secure expressions in templating engines
- Scenarios where third parties can customize portion of your apps without
compromising security
- To allow secure macros in extendable apps
- For computable values in configurable apps

## Installation on Node.js

	npm install --save funex

## Installation with Bower

	bower install funex

## Usage

	// Declare a context with the allowed data
	context = {
		dogs : {
			names: ["fido", "ricky"],
		}
		join: function (a, b) { return a+"-"+b }
	}

	// Compile the expression into a function
	fn = funex("join(dogs.names[0], dogs.name[1])");

	// Call the function with a context
	var value = fn(context);

## Usage with closures

	// Declare the context with an array of objects with item 0 being the top most frame
	context = [
		{
			dogs : {
				names: ["fido", "ricky"],
			}
		},
		{
			join: function (a, b) { return a+"-"+b }
		}
	]

	// Compile the expression into a function
	fn = funex("join(dogs.names[0], dogs.name[1])");

	// Call the function with a context
	var value = fn(context);

## License

Released in the Public Domain - http://creativecommons.org/publicdomain/zero/1.0/


## Roadmap
- Document : Whitespace support
- Document : Support for Multi-statement
- Document : Code Quality and Hygiene
- Document : Support for inline JSON
- Document : Available Dists
- Document: Lower cyclomatic complexity : all functions under 5
- Support for literal object notation (needed?)
- Measure impact of uncompressible member names on gZipped version of the library
- Re-avaluate the need for the test runner
- Automate test suite on the frontend in all browsers (testling or testling)
- Fix ie9 support
- Measure impact of uncompressible member names on gZipped version of the library
- Refactoring: tokenHandler should manipulate a cursor object instead of multiple argument and return values
- Support evaluation of async expressions with a standard callback
- Syntax error on unclosed function calls and array gets
- Syntax error on miss-use of ";"
- Syntax error on miss-placed string test."string"
- Syntax error on unterminated statement
- Test syntax errors on bad json
- A tool to try/test funex live
- 100% Annotated code
- Test coverage report or integration with coveralls.io
- Detailed syntax documentation
- A pretty web-site
- A new logo
- Apply unit tests to the minified build
- Multi-broser tests with Sauce or Testling
- Only push minimal deps with bower
- Capacity setting: multi-statement ()
- Capacity setting: true/false primitives (true) 
- Capacity setting: validator for function calls
- Capacity setting: validator for property access
- Capacity setting: validator for value access
- Low capacity by default
- Simplify the installed bower package
