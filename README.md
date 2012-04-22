# Funex

Javascript utility for secure evaluation of functional expressions.

Example usage:

	result = funex("members[id].name.fullname()", model);

## Features
- Expressions are evaluated and executed in a controled and secure scope
- Minified source is under 2k (under 1k gzipped)
- Function calls, dot notation, array/object members, strings, numbers
- The syntax is a familiar subset of javascript
- Simple because it is logic-less: no operators, statements or boolean logic
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
		join: function (a, b) {

		}
	}

	// Compile the expression into a function
	fn = funex("join(dogs.names[0], '-', dogs.name[1])");

	// Call the function with a context
	var fn(context);

## Roadmap
- Support evaluation of async expressions with a standard callback
- npm installation
- Test coverage report
- Detailed syntax documentation
- A pretty web-site
