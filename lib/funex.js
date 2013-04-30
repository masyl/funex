(function (global) {
	"use strict";
	var undef = void 0;
	// Declare constants for state names
	var __default = 99;
	var __callOpen = 3;
	var __callClose = 4;
	var __arrayOpen = 5;
	var __arrayClose = 6;
	var __dot = 7;
	var __argsSeparator = 8;
	var __whitespace = 9;
	var __string = 10;
	var __numeric = 11;
	var __name = 12;
	var __statementSeparator = 13;
	var __charMapNumericStart = "1234567890-";
	var __charMapWhiteSpace = " \n\t";
	var __charMapNumeric = __charMapNumericStart + ".";
	var __charMapAlpha = "abcdefghijklmnopqrstuvwxyz";
	var __charMapAlphaExtended = __charMapAlpha + __charMapAlpha.toUpperCase() + "_$";
	var __charMapAlphaExtendedContinued = __charMapAlphaExtended + __charMapNumericStart;
	var stateChars = {
		"(":__callOpen,
		")":__callClose,
		"[":__arrayOpen,
		"]":__arrayClose,
		".":__dot,
		",":__argsSeparator,
		" ":__whitespace,
		"\n":__whitespace,
		"\t":__whitespace,
		"'":__string,
		";":__statementSeparator
	};


	/**
	 * Takes an array of objects and creates a prototype chain
	 * that can simulate a stack of memory frames
	 * @param framesArray An array of objects to be used as memory frames
	 */
	function recursiveMemoryFrameFactory(framesArray) {
		// Ensure that the provided array will not be muted during
		// the recursions
		function _recursiveMemoryFrameFactory(framesArray) {
			function Frame(obj) {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						this[key] = obj[key];
					}
				}
			}
			var referenceObj = framesArray.shift();
			if (framesArray.length > 0) {
				Frame.prototype = _recursiveMemoryFrameFactory(framesArray);
			}
			var frame = new Frame(referenceObj);
			return frame;
		}
		return _recursiveMemoryFrameFactory(framesArray.slice(0));
	}


	/**
	 * Compile a funex string expression into a executable function
	 * @param exp
	 */
	function compile(exp) {
		//get rid of leading and trailing spaces.
		exp = exp.trim();
		var tokens = tokenizer(exp);
		return function (context) {
			// If no context was provided, create an empty one.
			if (typeof context === "undefined") context = [
				{}
			];
			//If the context is not already an array, create a one-level stack
			if (context.constructor.name !== "Array") context = [context];

			// var frames = context;
			var frames = [recursiveMemoryFrameFactory(context)];

			return executeTokens(tokens, frames);
		};
	}

	if (typeof module == "object" && typeof window == "undefined") module.exports = compile;
	if (typeof window == "object" && global === window) window.funex = compile;

	/**
	 * Execute the instructions dictated by code tokens
	 * @param tokens
	 * @param context
	 */
	function executeTokens(tokens, context) {
		var i;
		var j;
		var s0; // Shorthand for the first item of the call stack
		var token;
		var tokenStr;
		var args;
		var frame;
		var value = undef;
		var valueParent = context[0];
		var state;
		var callee;
		var parsedStr = "";
		var stack = [
			[context[0]] //todo: array encapsulation not needed anymore since we simulate the call stack with the prototype chain
		];
		stack[0].d = false; // Set the current context as no dirty 
		var __function = "function";
		var __illegalCall = "Illegal call : ";
		var __syntaxError = "Syntax error : ";
		var statementOutputs = [];

		for (i = 0; i < tokens.length; i++) {
			s0 = stack[0];
			token = tokens[i];
			tokenStr = token[0];
			state = token[1];
			parsedStr += tokenStr;
			switch (state) {
				case __default:
					throw __syntaxError + parsedStr;
				case  __callOpen:
					s0.d = true; // Mark the context as dirty
					// Add a fresh context in the stack
					args = [context[0]];
					args._ = true; // Mark the statement as unterminated
					args.c = value; // Callee
					args.cP = valueParent; // CalleeParent
					args.d = false; // Start as not dirty
					stack.unshift(args);
					value = undef;
					valueParent = context[0];
					break;
				case __callClose:
					// Pop the stack and then call the new stack head
					// with the popped value
					args = stack.shift();
					callee = args.c;
					if (!args._)
						throw __syntaxError + __illegalCall + parsedStr;
					if (callee !== context[0]) { // Prevent an array call on undefined
						// Reverse the argument into the correct order
						if (typeof callee !== __function)
							throw "Type error: " + typeof(callee) + " is not a " + __function + " : " + parsedStr;
						stack[0][0] = callee.apply(args.cP, args.reverse());
						value = stack[0][0];
						s0 = stack[0];
						s0.d = true; // Mark the context as dirty
					} else
						throw __syntaxError + __illegalCall + parsedStr;
					break;
				case __arrayOpen:
					s0.d = true; // Mark the context as dirty
					stack.unshift([context[0]]);
					value = undef;
					valueParent = context[0];
					break;
				case __arrayClose:
					// Pop the stack and then call the new stack head
					// as an array with the popped value
					value = stack.shift();
					s0 = stack[0];
					s0.d = true; // Mark the context as dirty
					// Prevent an array call on the root context
					if (s0[0] === context[0])
						throw __syntaxError + __illegalCall + parsedStr;
					// Prevent an array call on undefined
					if (s0[0] === undef)
						throw "Cannot read property '" + tokenStr + "' of undefined : " + parsedStr;
					// Read the new value
					value = s0[0][ value[0] ];
					s0[0] = value;
					break;
				case __dot:
					s0.d = true; // Mark the context as dirty
					valueParent = value;
					value = undef;
					break;
				case __argsSeparator:
					s0.d = true; // Mark the context as dirty
					//todo: check if the argSeparator is used in a correct setting
					if (!s0._)
						throw __syntaxError + parsedStr;
					value = undef;
					valueParent = context[0];
					// If the first argument was never set, set as undefined
					if (s0[0] === context[0])
						s0[0] = undef;
					s0.unshift(context[0]);
					break;
				case __string:
					s0.d = true; // Mark the context as dirty
					s0[0] = value = tokenStr;
					break;
				case __numeric:
					s0.d = true; // Mark the context as dirty
					s0[0] = value = parseFloat(tokenStr);
					break;
				case __name:
					s0.d = true; // Mark the context as dirty
					// Else resolve it on the current value
					if (s0[0] === undef)
						throw "Cannot read property '" + tokenStr + "' of undefined : " + parsedStr;
					value = s0[0][tokenStr];
					s0[0] = value;
					break;
				case __statementSeparator:
					//todo: check if the argSeparator is used in a correct setting (unterminated statement)
					if (s0._)
						throw __syntaxError + parsedStr;
					// If a new context is dirty (statement has been started)
					// Store the current value as a candidate for output
					if (s0.d) statementOutputs.unshift(value); 
					s0.d = false;
					// Clear the context and values
					s0[0] = context[0];
					valueParent = undef;
					value = undef;
			}
		}
		s0 = stack[0];
		// If a new context is dirty (statement has been started)
		// Store the current value as a candidate for output
		if (s0.d) statementOutputs.unshift(value);
		return (statementOutputs.length) ? statementOutputs[0] : undef;
	}


	// Define all token handlers

	var tokenHandlers = {};

	tokenHandlers[__default] = function (chr) {
		var newState = stateChars[chr];
		if (newState !== undef) return [newState];
		if (__charMapNumericStart.indexOf(chr) + 1) {
			newState = __numeric;
		} else if (__charMapAlphaExtended.indexOf(chr) + 1) {
			newState = __name;
		}
		return [newState];
	};

	tokenHandlers[__callOpen] = function (chr, token) {
		if (chr != "(" || (token.length == 1)) return [__default];
	};
	tokenHandlers[__callClose] = function (chr, token) {
		if (chr != ")" || (token.length == 1)) return [__default];
	};
	tokenHandlers[__arrayOpen] = function (chr, token) {
		if (chr != "[" || (token.length == 1)) return [__default];
	};
	tokenHandlers[__arrayClose] = function (chr, token) {
		if (chr != "]" || (token.length == 1)) return [__default];
	};
	tokenHandlers[__statementSeparator] = function (chr, token) {
		if (chr != ";" || (token.length == 1)) return [__default];
	};
	tokenHandlers[__dot] = function (chr, token) {
		if (chr != "." || (token.length == 1)) return [__default];
	};
	tokenHandlers[__argsSeparator] = function (chr, token) {
		if (chr != "," || (token.length == 1)) return [__default];
	};
	tokenHandlers[__whitespace] = function (chr, token) {
		// todo: add other whitespace codes
		if (__charMapWhiteSpace.indexOf(chr) < 0) return [__default];
	};
	tokenHandlers[__string] = function (chr, token, exp, i) {
		var _chr = chr;
		var _token = token;
		// If the last char is a "'""
		if (chr == "'") {
			//if the character is a "'" and is preceeded by a "\\", then we
			//update the token and keep going (we remove the escaping)
			if ((token.length > 1 || token === "'") && exp[i-1] === "\\" ) {
				_token = token.substring(0, token.length-1);
				return [undef, _chr, _token];
			}
			// If the last char is a "'" and not the first char
			else if (token.length > 1) {
				_token = token.substring(1);
				_chr = "";
				return [__default, _chr, _token];
			}
		}
	};
	tokenHandlers[__numeric] = function (chr) {
		if (__charMapNumeric.indexOf(chr) < 0)
			return [__default];
	};
	tokenHandlers[__name] = function (chr) {
		if (__charMapAlphaExtendedContinued.indexOf(chr) < 0)
			return [__default];
	};

	/**
	 * Parse a funex string into a stack of tokens
	 * @param exp
	 */
	function tokenizer(exp) {
		var i;
		var chr;
		var instructions = [];
		var newState;
		var token = "";
		var state = __default;
		var tokenHandler;
		var tokenHandlerResult;

		// special case for empty string made of consecutive single quoted : "''"
		// todo: figure out how to handle this without an special code path
		if (exp === "''"){
			instructions.push(["", __string]);
			return instructions;
		}

		for (i = 0; i < exp.length; i++) {
			chr = exp[i];
			newState = undef;
			tokenHandler = tokenHandlers[state];
			tokenHandlerResult = tokenHandler(chr, token, exp, i);
			// return [state, chr, token];

			// Handle the return value for the token Handler
			if (tokenHandlerResult && tokenHandlerResult.length > 0) {
				newState = tokenHandlerResult[0];
				if (tokenHandlerResult.length > 1) {
					chr = tokenHandlerResult[1];
					if (tokenHandlerResult.length > 2) {
						token = tokenHandlerResult[2];
					}
				}
			}

			// If state changed, set the new state push the token on the
			// stack of tokens and start a new token
			if (newState) {
				// If the current token is not empty,
				// push it in the instruction stack
				if (token.length)
					instructions.push([token, state]);
				// Get the new state returned by the state handler
				state = newState;
				// Flush the token
				token = "";
				// Unless the current character has been flushed (like for quotes
				// around strings, set back the index for the next iteration
				if (chr !== "") i--;
			} else {
				// Push the parsing result of that char on the token
				token += chr;
			}
		}
		// Push the last token
		if (token.length){
			instructions.push([token, state]);
		}
		return instructions;
	}
})(this);
