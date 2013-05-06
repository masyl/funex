/*! funex v0.2.36 for Browsers | 2013-05-06 | No Copyright - Released in the Public Domain by Mathieu Sylvain  */
(function (global) {
"use strict";


// Local definition of undefined
var undef = void 0;

// String constants
var __function = "function";
var __illegalCall = "Illegal call : ";
var __syntaxError = "Syntax error : ";

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
	"(": "callOpen",
	")": "callClose",
	"[": "arrayOpen",
	"]": "arrayClose",
	".": "dot",
	",": "argsSeparator",
	" ": "whitespace",
	"\n": "whitespace",
	"\t": "whitespace",
	"'": "str",
	'"': "str2",
	";": "statementSeparator"
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
	"callOpen": function (cursor) {
		if (cursor.s0[0] === cursor.context[0]) // Prevent a function call on undefined
			throw __syntaxError + __illegalCall + cursor.parsedStr;

		cursor.s0.d = true; // Mark the context as dirty
		// Add a fresh context in the stack
		var args = [cursor.context[0]];
		args._ = true; // Mark the statement as unterminated
		args.c = cursor.value; // Callee
		args.cP = cursor.valueParent; // CalleeParent
		args.d = false; // Start as not dirty
		cursor.stack.unshift(args);
		cursor.value = undef;
		cursor.valueParent = cursor.context[0];
	},
	"callClose": function (cursor) {
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
		cursor.value = cursor.stack[0][0];
		cursor.s0 = cursor.stack[0];
		cursor.s0.d = true; // Mark the context as dirty
	},
	"arrayOpen": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.stack.unshift([cursor.context[0]]);
		cursor.value = undef;
		cursor.valueParent = cursor.context[0];
	},
	"arrayClose": function (cursor) {
		// Pop the stack and then call the new stack head
		// as an array with the popped value
		cursor.value = cursor.stack.shift();
		cursor.s0 = cursor.stack[0];
		cursor.s0.d = true; // Mark the context as dirty
		// Prevent an array call on the root context
		if (cursor.s0[0] === cursor.context[0])
			throw __syntaxError + __illegalCall + cursor.parsedStr;
		// Prevent an array call on undefined
		if (cursor.s0[0] === undef)
			throw "Cannot read property " + cursor.tokens[cursor.i-1][0] + " of undefined : " + cursor.parsedStr;
		// Read the new value
		cursor.value = cursor.s0[0][ cursor.value[0] ];
		cursor.s0[0] = cursor.value;
	},
	"dot": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.valueParent = cursor.value;
		cursor.value = undef;
	},
	"argsSeparator": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		//todo: check if the argSeparator is used in a correct setting
		if (!cursor.s0._)
			throw __syntaxError + cursor.parsedStr;
		cursor.value = undef;
		cursor.valueParent = cursor.context[0];
		// If the first argument was never set, set as undefined
		if (cursor.s0[0] === cursor.context[0])
			cursor.s0[0] = cursor.undef;
		cursor.s0.unshift(cursor.context[0]);
	},
	"str": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.value = cursor.tokenStr.substring(1, cursor.tokenStr.length-1);
	},
	"str2": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.value = cursor.tokenStr.substring(1, cursor.tokenStr.length-1);
	},
	"json": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.value = JSON.parse(cursor.tokenStr);
	},
	"numeric": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		cursor.s0[0] = cursor.value = parseFloat(cursor.tokenStr);
	},
	"name": function (cursor) {
		cursor.s0.d = true; // Mark the context as dirty
		// Else resolve it on the current value
		if (cursor.s0[0] === undef)
			throw "Cannot read property '" + cursor.tokenStr + "' of undefined : " + cursor.parsedStr;
		cursor.value = cursor.s0[0][cursor.tokenStr];
		cursor.s0[0] = cursor.value;
	},
	"statementSeparator": function (cursor) {
		//todo: check if the argSeparator is used in a correct setting (unterminated statement)
		if (cursor.s0._)
			throw __syntaxError + cursor.parsedStr;
		// If a new context is dirty (statement has been started)
		// Store the current value as a candidate for output
		if (cursor.s0.d) cursor.statementOutputs.unshift(cursor.value);
		cursor.s0.d = false;
		// Clear the context and values
		cursor.s0[0] = cursor.context[0];
		cursor.valueParent = undef;
		cursor.value = undef;
	},
	"whitespace": function () {}
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
		value: undef,
		valueParent: context[0],
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
		cursor.token = tokens[cursor.i];
		cursor.tokenStr = cursor.token[0];
		cursor.state = cursor.token[1];
		cursor.parsedStr += cursor.tokenStr;
		tokenExecutionHandlers[cursor.state](cursor);
	}
	cursor.s0 = cursor.stack[0];
	// If a new context is dirty (statement has been started)
	// Store the current value as a candidate for output
	if (cursor.s0.d) cursor.statementOutputs.unshift(cursor.value);
	return (cursor.statementOutputs.length) ? cursor.statementOutputs[0] : undef;
}

// Define token handlers

var tokenHandlers = {
	"def": function (cursor) {
		var state = stateChars[cursor.chr];
		if (state !== undef) cursor.newState = state;
		if (__charMapNumericStart.indexOf(cursor.chr) + 1) {
			cursor.newState = "numeric";
		} else if (__charMapAlphaExtended.indexOf(cursor.chr) + 1) {
			cursor.newState = "name";
		}
	},
	"callOpen": function (cursor) {
		if (cursor.chr !== "(" || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"callClose": function (cursor) {
		if (cursor.chr !== ")" || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"arrayOpen": function (cursor) {
		if (cursor.chr !== "[" || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"arrayClose": function (cursor) {
		if (cursor.chr !== "]" || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"statementSeparator": function (cursor) {
		if (cursor.chr !== ";" || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"dot": function (cursor) {
		if (cursor.chr !== "." || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"argsSeparator": function (cursor) {
		if (cursor.chr !== "," || (cursor.token.length === 1))
			cursor.newState = "def";
	},
	"whitespace": function (cursor) {
		// todo: add other whitespace codes
		if (__charMapWhiteSpace.indexOf(cursor.chr) < 0)
			cursor.newState = "def";
	},
	"str": function (cursor) {
		// If the last char is a "'""
		if (cursor.chr === "'") {
			//if the character is a "'" and is preceeded by a "\\", then we
			//update the token and keep going (we remove the escaping)
			if ((cursor.token.length > 1 || cursor.token === "'") && cursor.exp[cursor.i-1] === "\\" ) {
				cursor.newState = undef;
				cursor.token = cursor.token.substring(0, cursor.token.length-1);
			}
			// If the last char is a "'" and not the first char
			else if (cursor.token.length > 1) {
				cursor.newState = "def";
				cursor.chr = "";
				cursor.i++;
				cursor.token = cursor.token.substring(0) + "'";
			}
		}
	},
	// todo: generalize str and str2
	"str2": function (cursor) {
		// If the last char is a '"'
		if (cursor.chr === '"') {
			//if the character is a "'" and is preceeded by a "\\", then we
			//update the token and keep going (we remove the escaping)
			if ((cursor.token.length > 1 || cursor.token === '"') && cursor.exp[cursor.i-1] === "\\" ) {
				cursor.newState = undef;
				cursor.token = cursor.token.substring(0, cursor.token.length-1);
			}
			// If the last char is a "'" and not the first char
			else if (cursor.token.length > 1) {
				cursor.newState = "def";
				cursor.token = cursor.token.substring(0) + '"';
				cursor.chr = "";
				cursor.i++;
			}
		}
	},
	"json": function (cursor) {
		if (cursor.chr === "{") cursor.braces++;
		if (cursor.chr === "}") cursor.braces--;
		if (cursor.braces === 0) {
			cursor.newState = "def";
			cursor.token += cursor.chr;
			cursor.i++;
		}
	},
	"numeric": function (cursor) {
		if (__charMapNumeric.indexOf(cursor.chr) < 0)
			cursor.newState = "def";
	},
	"name" : function (cursor) {
		if (__charMapAlphaExtendedContinued.indexOf(cursor.chr) < 0)
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
		chr: "",
		token: "",
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
	if (cursor.token.length)
		instructions.push([cursor.token, cursor.state]);

	return instructions;
}

// Parse chars and yeld instructions
function nextChar(cursor, instructions) {
	cursor.chr = cursor.exp[cursor.i];
	cursor.newState = null;
	tokenHandlers[cursor.state](cursor);

	// If state changed, set the new state push the token on the
	// stack of tokens and start a new token
	if (cursor.newState) {
		// If the current token is not empty,
		// push it in the instruction stack
		if (cursor.token)
			instructions.push([cursor.token, cursor.state]);
		// Get the new state returned by the state handler
		cursor.state = cursor.newState;
		// Flush the token
		cursor.token = "";
		// Unless the current character has been flushed (like for quotes
		// around strings, set back the index for the next iteration
		cursor.i--;
	} else {
		// Push the parsing result of that char on the token
		cursor.token += cursor.chr;
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





global.funex = compile;

})(window);
