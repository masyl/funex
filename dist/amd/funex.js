/*! funex v0.2.37 for AMD loaders | 2013-05-06 | No Copyright - Released in the Public Domain by Mathieu Sylvain  */
(function (define) {
"use strict";


// Local definition of undefined
var undef = void 0;

// String constants
var __function = "function";
var __illegalCall = "Illegal call : ";
var __syntaxError = "Syntax error : ";
var __cannotReadProperty = "Cannot read property ";
var __ofUndefined = " of undefined : ";

// Character maps
var __charMapNumericStart = "1234567890-";
var __charMapWhiteSpace = " \n\t";
var __charMapNumeric = __charMapNumericStart + ".";
var __charMapAlpha = "abcdefghijklmnopqrstuvwxyz";
var __charMapAlphaExtended = __charMapAlpha + __charMapAlpha.toUpperCase() + "_$";
var __charMapAlphaExtendedContinued = __charMapAlphaExtended + __charMapNumericStart;

// State Entry Characters
var stateChars = {
	"{": "json",
	"(": "call+",
	")": "call-",
	"[": "arr+",
	"]": "arr-",
	".": "dot", // Dot notation
	",": "arg", // Argument separator
	" ": "w",
	"\n": "w",
	"\t": "w", // whitespaces
	"'": "str", // Single Quoted Strings
	'"': "str2", // Double Quoted Strings
	";": "sep" // Statement separator
};


/**
 * Takes an array of objects and creates a prototype chain
 * that can simulate a stack of memory frames
 * @param framesArray An array of objects to be used as memory frames
 */
function memoryStackFactory(framesArray) {
	// Ensure that the provided array will not be muted during
	// the recursions
	return memoryStackFactoryIterator(framesArray.slice(0));
}
function memoryStackFactoryIterator(framesArray) {
	var referenceObj = framesArray.shift();
	if (framesArray.length > 0) {
		// *** Special note: Event if the prototype keeps being reassigned, the object
		// that has been created from it will remember the construction work
		// that the original prototype did
		MemoryStackFactoryFrame.prototype = memoryStackFactoryIterator(framesArray);
	}
	return new MemoryStackFactoryFrame(referenceObj);
}
function MemoryStackFactoryFrame(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			this[key] = obj[key];
		}
	}
}




var tokenExecutionHandlers = {
	"def": function (cursor) {
		throw __syntaxError + cursor.parsedStr;
	},
	"call+": function (cursor) {
		if (cursor.s0[0] === cursor.context[0]) // Prevent a function call on undefined
			throw __syntaxError + __illegalCall + cursor.parsedStr;

		cursor.s0.d = true; // Mark the context as dirty
		// Add a fresh context in the stack
		var args = [cursor.context[0]];
		args._ = true; // Mark the statement as unterminated
		args.c = cursor.v; // Callee
		args.cP = cursor.vP; // CalleeParent
		args.d = false; // Start as not dirty
		cursor.stack.unshift(args);
		cursor.v = undef;
		cursor.vP = cursor.context[0];
	},
	"call-": function (cursor) {
		// Pop the stack and then call the new stack head
		// with the popped value
		var args = cursor.stack.shift();
		cursor.callee = args.c; // Should callee really be in the cursor ?
		if (!args._)
			throw __syntaxError + __illegalCall + cursor.parsedStr;

		// Reverse the argument into the correct order
		if (typeof cursor.callee !== __function)
			throw "Type error: " + typeof(cursor.callee) + " is not a " + __function + " : " + cursor.parsedStr;
		cursor.stack[0][0] = cursor.callee.apply(args.cP, args.reverse());
		cursor.v = cursor.stack[0][0];
		cursor.s0 = cursor.stack[0];
		cursor.s0.d = true; // Mark the context as dirty
	},
	"arr+": function (cursor) { // Array open
		cursor.s0.d = true; // Mark the context as dirty
		cursor.stack.unshift([cursor.context[0]]);
		cursor.v = undef;
		cursor.vP = cursor.context[0];
	},
	"arr-": function (cursor) { // Array close
		// Pop the stack and then call the new stack head
		// as an array with the popped value
		cursor.v = cursor.stack.shift();
		cursor.s0 = cursor.stack[0];
		cursor.s0.d = true; // Mark the context as dirty
		// Prevent an array call on the root context
		if (cursor.s0[0] === cursor.context[0])
			throw __syntaxError + __illegalCall + cursor.parsedStr;
		// Prevent an array call on undefined
		if (cursor.s0[0] === undef)
			throw __cannotReadProperty + cursor.tokens[cursor.i-1][0] + __ofUndefined + cursor.parsedStr;
		// Read the new value
		cursor.v = cursor.s0[0][ cursor.v[0] ];
		cursor.s0[0] = cursor.v;
	},
	"dot": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.vP = cursor.v;
		cursor.v = undef;
	},
	"arg": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		//todo: check if the argSeparator is used in a correct setting
		if (!cursor.s0._)
			throw __syntaxError + cursor.parsedStr;
		cursor.v = undef;
		cursor.vP = cursor.context[0];
		// If the first argument was never set, set as undefined
		if (cursor.s0[0] === cursor.context[0])
			cursor.s0[0] = cursor.undef;
		cursor.s0.unshift(cursor.context[0]);
	},
	"str": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.v = cursor.tokenStr.substring(1, cursor.tokenStr.length-1);
	},
	"str2": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.v = cursor.tokenStr.substring(1, cursor.tokenStr.length-1);
	},
	"json": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.v = JSON.parse(cursor.tokenStr);
	},
	"num": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.v = parseFloat(cursor.tokenStr);
	},
	"name": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		// Else resolve it on the current value
		if (cursor.s0[0] === undef)
			throw __cannotReadProperty + "'" + cursor.tokenStr + "'" + __ofUndefined + cursor.parsedStr;
		cursor.v = cursor.s0[0][cursor.tokenStr];
		cursor.s0[0] = cursor.v;
	},
	"sep": function (cursor) {
		//todo: check if the argSeparator is used in a correct setting (unterminated statement)
		if (cursor.s0._)
			throw __syntaxError + cursor.parsedStr;
		// If a new context is dirty (statement has been started)
		// Store the current value as a candidate for output
		if (cursor.s0.d) cursor.statementOutputs.unshift(cursor.v);
		cursor.s0.d = false;
		// Clear the context and values
		cursor.s0[0] = cursor.context[0];
		cursor.vP = undef;
		cursor.v = undef;
	},
	"w": function () {}
};

/**
 * Execute the instructions dictated by code tokens
 * @param tokens
 * @param context
 */
function executeTokens(tokens, context) {
	// todo: cursor has too much, should be simplified
	var cursor = {
		state: undef,
		s0: undef, // Shorthand for the first item of the call stack
		context: context,
		//todo: array encapsulation not needed anymore since we simulate
		//the call stack with the prototype chain
		stack: [ [context[0]] ],
		v: undef, // value
		vP: context[0], // valueParent
		tokens: tokens,
		tokenStr: undef,
		statementOutputs: [],
		parsedStr: "",
		callee: undef,
		i: 0
	};

	cursor.stack[0].d = false; // Set the current context as no dirty 

	for (; cursor.i < tokens.length; cursor.i++) {
		cursor.s0 = cursor.stack[0];
		cursor.t = tokens[cursor.i];
		cursor.tokenStr = cursor.t[0];
		cursor.state = cursor.t[1];
		cursor.parsedStr += cursor.tokenStr;
		tokenExecutionHandlers[cursor.state](cursor);
	}
	cursor.s0 = cursor.stack[0];
	// If a new context is dirty (statement has been started)
	// Store the current value as a candidate for output
	if (cursor.s0.d) cursor.statementOutputs.unshift(cursor.v);
	return (cursor.statementOutputs.length) ? cursor.statementOutputs[0] : undef;
}

// Define token handlers

var tokenHandlers = {
	"def": function (cursor) {
		var state = stateChars[cursor.c];
		if (state !== undef) cursor.newState = state;
		if (__charMapNumericStart.indexOf(cursor.c) + 1) {
			cursor.newState = "num";
		} else if (__charMapAlphaExtended.indexOf(cursor.c) + 1) {
			cursor.newState = "name";
		}
	},
	"call+": function (cursor) {
		if (cursor.c !== "(" || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"call-": function (cursor) {
		if (cursor.c !== ")" || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"arr+": function (cursor) {
		if (cursor.c !== "[" || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"arr-": function (cursor) {
		if (cursor.c !== "]" || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"sep": function (cursor) {
		if (cursor.c !== ";" || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"dot": function (cursor) {
		if (cursor.c !== "." || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"arg": function (cursor) {
		if (cursor.c !== "," || (cursor.t.length === 1))
			cursor.newState = "def";
	},
	"w": function (cursor) {
		// todo: add other whitespace codes
		if (__charMapWhiteSpace.indexOf(cursor.c) < 0)
			cursor.newState = "def";
	},
	"str": function (cursor) {
		// If the last char is a "'""
		if (cursor.c === "'") {
			//if the character is a "'" and is preceeded by a "\\", then we
			//update the token and keep going (we remove the escaping)
			if ((cursor.t.length > 1 || cursor.t === "'") && cursor.exp[cursor.i-1] === "\\" ) {
				cursor.newState = undef;
				cursor.t = cursor.t.substring(0, cursor.t.length-1);
			}
			// If the last char is a "'" and not the first char
			else if (cursor.t.length > 1) {
				cursor.newState = "def";
				cursor.c = "";
				cursor.i++;
				cursor.t = cursor.t.substring(0) + "'";
			}
		}
	},
	// todo: generalize str and str2
	"str2": function (cursor) {
		// If the last char is a '"'
		if (cursor.c === '"') {
			//if the character is a "'" and is preceeded by a "\\", then we
			//update the token and keep going (we remove the escaping)
			if ((cursor.t.length > 1 || cursor.t === '"') && cursor.exp[cursor.i-1] === "\\" ) {
				cursor.newState = undef;
				cursor.t = cursor.t.substring(0, cursor.t.length-1);
			}
			// If the last char is a "'" and not the first char
			else if (cursor.t.length > 1) {
				cursor.newState = "def";
				cursor.t = cursor.t.substring(0) + '"';
				cursor.c = "";
				cursor.i++;
			}
		}
	},
	"json": function (cursor) {
		if (cursor.c === "{") cursor.braces++;
		if (cursor.c === "}") cursor.braces--;
		if (cursor.braces === 0) {
			cursor.newState = "def";
			cursor.t += cursor.c;
			cursor.i++;
		}
	},
	"num": function (cursor) {
		if (__charMapNumeric.indexOf(cursor.c) < 0)
			cursor.newState = "def";
	},
	"name" : function (cursor) {
		if (__charMapAlphaExtendedContinued.indexOf(cursor.c) < 0)
			cursor.newState = "def";
	}
};




/**
 * Parse a funex string into a stack of tokens
 * @param exp
 */
function tokenizer(exp) {
	var instructions = [];
	var cursor = {
		braces: 0, // The number of brackets accumulated (for json handling)
		c: "", // .char
		t: "", // .token
		exp: exp,
		state: "def",
		newState: null,
		i: 0
	};
	// Parse the expression char by char
	for (; cursor.i < cursor.exp.length; cursor.i++) {
		nextChar(cursor, instructions);
	}
	// Push the last token
	if (cursor.t.length)
		instructions.push([cursor.t, cursor.state]);

	return instructions;
}

// Parse chars and yeld instructions
function nextChar(cursor, instructions) {
	cursor.c = cursor.exp[cursor.i];
	cursor.newState = null;
	tokenHandlers[cursor.state](cursor);

	// If state changed, set the new state push the token on the
	// stack of tokens and start a new token
	if (cursor.newState) {
		// If the current token is not empty,
		// push it in the instruction stack
		if (cursor.t)
			instructions.push([cursor.t, cursor.state]);
		// Get the new state returned by the state handler
		cursor.state = cursor.newState;
		// Flush the token
		cursor.t = "";
		// Unless the current character has been flushed (like for quotes
		// around strings, set back the index for the next iteration
		cursor.i--;
	} else {
		// Push the parsing result of that char on the token
		cursor.t += cursor.c;
	}
}

function compiledProxy(context) {
	// If no context was provided, create an empty one.
	if (typeof context === "undefined")
		context = [{}];
	//If the context is not already an array, create a one-level stack
	if (context.constructor.name !== "Array")
		context = [context];

	// todo: remove needless array over memoryStackFactory
	// "this" is the list of tokens
	/*jshint validthis:true */
	return executeTokens(this, [memoryStackFactory(context)]);
}

/**
 * Compile a funex string expression into a executable function
 * @param exp
 */
function compile(exp) {
		return compiledProxy.bind(tokenizer(exp.trim()));
}





// AMD define happens at the end for compatibility with AMD loaders
// that don't enforce next-turn semantics on modules.
if (typeof define === 'function' && define.amd) {
	define('funex', function() {
		return compile;
	});
}

})(define);
