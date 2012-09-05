(function () {
	var undefined = void 0;
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
	var __charMapNumericStart = "1234567890-";
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
		"'":__string
	};

	/**
	 * Compile a funex string expression into a executable function
	 * @param exp
	 */
	module.exports = function (exp) {
		var tokens = tokenizer(exp);
		return function (context) {
			// If no context was provided, create an empty one.
			if (typeof context === "undefined") context = [
				{}
			];
			//If the context is not already an array, create a one-level stack
			if (context.constructor.name !== "Array") context = [context];
			return executeTokens(tokens, context);
		};
	};

	/**
	 * Execute the instructions dictated by code tokens
	 * @param tokens
	 * @param context
	 */
	function executeTokens(tokens, context) {
		var i;
		var j;
		var s0;
		var token;
		var tokenStr;
		var args;
		var frame;
		var value = undefined;
		var valueParent = context[0];
		var state;
		var callee;
		var parsedStr = "";
		var stack = [
			[context[0]]
		];
		var __function = "function";
		var __illegalCall = "Illegal call : ";
		var __syntaxError = "Syntax error : ";

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
					// Add a fresh context in the stack
					args = [context[0]];
					args._ = true;
					args.c = value; // Callee
					args.cP = valueParent; // CalleeParent
					stack.unshift(args);
					value = undefined;
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
					} else
						throw __syntaxError + __illegalCall + parsedStr;
					break;
				case __arrayOpen:
					stack.unshift([context[0]]);
					value = undefined;
					valueParent = context[0];
					break;
				case __arrayClose:
					// Pop the stack and then call the new stack head
					// as an array with the popped value
					value = stack.shift();
					s0 = stack[0];
					// Prevent an array call on the root context
					if (s0[0] === context[0])
						throw __syntaxError + __illegalCall + parsedStr;
					// Prevent an array call on undefined
					if (s0[0] === undefined)
						throw "Cannot read property '" + tokenStr + "' of undefined : " + parsedStr;
					// Read the new value
					value = s0[0][ value[0] ];
					s0[0] = value;
					break;
				case __dot:
					valueParent = value;
					value = undefined;
					break;
				case __argsSeparator:
					value = undefined;
					valueParent = context[0];
					//todo: check if the argSeparator is used in a correct setting
					if (!s0._)
						throw __syntaxError + parsedStr;
					// If the first argument was never set, set as undefined
					if (s0[0] === context[0])
						s0[0] = undefined;
					s0.unshift(context[0]);
					break;
				case __string:
					s0[0] = value = tokenStr;
					break;
				case __numeric:
					s0[0] = value = parseFloat(tokenStr);
					break;
				case __name:
					// If the name is resolved on the global context
					// Try to resolve in across the stack
					if (s0[0] === context[0]) {
						value = undefined;
						for (j = 0; j < context.length; j++) {
							frame = context[j];
							if ((frame !== undefined) && (tokenStr in frame))
								value = frame[tokenStr];
						}
						s0[0] = value;
					} else {
						// Else resolve it on the current value
						if (s0[0] === undefined)
							throw "Cannot read property '" + tokenStr + "' of undefined : " + parsedStr;
						// TODO: RESOLVE NAME ON CONTEXT STACK
						value = s0[0][tokenStr];
						s0[0] = value;
					}
			}
		}
		s0 = stack[0];
		return (s0 === context[0]) ? undefined : s0[0];
	}

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
		var tokenIsOneChar;

		for (i = 0; i < exp.length; i++) {
			chr = exp[i];
			newState = undefined;
			tokenIsOneChar = (token.length == 1);
			switch (state) {
				case __default:
					newState = stateChars[chr];
					if (newState !== undefined) break;
					if (__charMapNumericStart.indexOf(chr) + 1) {
						newState = __numeric;
						break;
					}
					if (__charMapAlphaExtended.indexOf(chr) + 1)
						newState = __name;
					break;
				case  __callOpen:
					if (chr != "(" || tokenIsOneChar) newState = __default;
					break;
				case __callClose:
					if (chr != ")" || tokenIsOneChar) newState = __default;
					break;
				case __arrayOpen:
					if (chr != "[" || tokenIsOneChar) newState = __default;
					break;
				case __arrayClose:
					if (chr != "]" || tokenIsOneChar) newState = __default;
					break;
				case __dot:
					if (chr != "." || tokenIsOneChar) newState = __default;
					break;
				case __argsSeparator:
					if (chr != "," || tokenIsOneChar) newState = __default;
					break;
				case __whitespace:
					// todo: add other whitespace codes
					if (chr != " ") newState = __default;
					break;
				case __string:	
					// If the last char is a "'" and not the first char			
					if (chr == "'" && token.length > 1) {
						//if the character is a "'" and is followed by a second "'", then we skip over it, unless it's the last char
						if (exp[i+1] === "'") {
							//escape the character
							chr = "\'";
							//and ignore the next character since it's the extra apostrophe
							i++;
						}				
						else {
							token = token.substring(1);
							chr = "";
							newState = __default;
						}
					}
					break;
				case __numeric:
					if (__charMapNumeric.indexOf(chr) < 0)
						newState = __default;
					break;
				case __name:
					if (__charMapAlphaExtendedContinued.indexOf(chr) < 0)
						newState = __default;
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
		if (token.length)
			instructions.push([token, state]);
		return instructions;
	}
})();