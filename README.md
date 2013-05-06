![Funex logo](doc/images/funex-logo.gif)

[![NPM version](https://badge.fury.io/js/funex.png)](http://badge.fury.io/js/funex)
[![Build Status](https://travis-ci.org/masyl/funex.png)](https://travis-ci.org/masyl/funex)
[![Dependency Status](https://gemnasium.com/masyl/funex.png)](https://gemnasium.com/masyl/funex)
[![Coverage Status](https://coveralls.io/repos/masyl/funex/badge.png?branch=master)](https://coveralls.io/r/masyl/funex)

# Funex

A Javascript api for evaluating functional expressions.

# Example usage:

	// compile the expression into a function	
	var fn = funex("person.name.first.toUpperCase()");

	// Evaluate the expression with a scope
	var result = fn({person: {name: {first: "John", last: "Doe"}}});

	// Would output "JOHN"

# Introduction

This library bring the concept of a funex, which is short for "Functional Expressions".

Functionnal expressions is a subset of javascript that only the simplest parts while still being usefull. It mosty allows function calls, property access, numbers, strings, JSON and a few other tricks.

By being so simple and so specific, it allows you to use dynamic expressions in a context that need to be controlled and secure.

In other words, it's similare to "eval", without being "evil".


## Features

- Secure: Expressions are evaluated and executed in a controlled and secure scope
- Supports function calls, dot notation, array/object members, strings, numbers, JSON syntax
- Provide simple objects or use array of objects to simulate closures.
- The syntax is a familiar subset of javascript
- Simple because it is logic-less: no operators, statements or boolean logic.
- Runs both in browser and on the server
- No complex api or configuration, it is a single function to use

## Usefull for ...

- Resolving richer but secure expressions in templating engines
- A good replacement for some uses of .eval()
- Scenarios where third parties can customize portion of your apps without
compromising security
- To allow secure macros in extendable apps
- For computable values in configs

## Funex is also awesome because ...

- Small : Minified + Gzipped source is around 1.5k
- Compiled expressions can be cached and reused
- Throws readable syntax errors
- Minimal overhead compared to native code
- Extensive test suite with 100% coverage - [![Coverage Status](https://coveralls.io/repos/masyl/funex/badge.png?branch=master)](https://coveralls.io/r/masyl/funex)
- Public Domain code maintained on Github
- Source code is short, documented and low in complexity - [doc/plato/index.html](See the Plato Report)
- Has specific builds for browsers, node.js and AMD and is deployed to Travic CI - [![Build Status](https://travis-ci.org/masyl/funex.png)](https://travis-ci.org/masyl/funex)


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

### v0.3

- [ ] Apply unit tests to the minified build
- [ ] Working support of all modern browsers
- [ ] Document : Whitespace support
- [ ] Document : Support for Multi-statement
- [ ] Document : Code Quality and Hygiene
- [ ] Document : Support for inline JSON (No litterals)
- [ ] Document : Available Dists
- [ ] Document: Lower cyclomatic complexity : all functions under 5
- [X] A new logo

### v0.4

- [ ] A pretty homepage
- [ ] provide a base memory frame when creating the funex
- [ ] primitives like true, false, this

### v0.5

- [ ] Benchmarks
- [ ] Automate test suite on the frontend in all browsers (testling or sauce labs)
- [ ] Syntax error on unclosed function calls and array gets
- [ ] Syntax error on miss-placed string test."string"
- [ ] Syntax error on unterminated statement

### v1.0

- [ ] A api to tap property access and function calls
- [ ] A tool to try/test funex live
- [ ] Better sample usage
- [ ] 100% Annotated code
- [ ] Support evaluation of async expressions with a standard callback

### v0.6

- [ ] Capacity setting: multi-statement ()
- [ ] Capacity setting: JSON
- [ ] Capacity setting: true/false primitives (true) 
- [ ] Capacity setting: validator for function calls
- [ ] Capacity setting: validator for property access
- [ ] Capacity setting: validator for value access

