# Funex

Javascript utility for secure evaluation of functional expressions.

Example usage:

	result = funex("members[id].name.fullname()", model);

## Features
- Expressions are evaluated and executed in a controlled and secure scope
- Minified source is around 2k
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

## Installation

For now it is a single "funex.js" file, but it should soon be on node npm

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


## Roadmap
- DONE - Whitespace support
- DONE - Support for Multi-statement
- Functions as arguments instead of strings
- Syntax error on unclosed function calls and array gets
- Syntax error on miss-use of ";"
- Syntax error on miss-placed string test."string"
- Syntax error on unterminated statement
- Support evaluation of async expressions with a standard callback
- Annotated code
- Strict mode
- npm installation
- Test coverage report
- Detailed syntax documentation
- A pretty web-site
