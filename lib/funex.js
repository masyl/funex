(function () {
	var
		undefined = void 0,
		// Declare constants for state names
		__default = 99,
		__callOpen = 3,
		__callClose = 4,
		__arrayOpen = 5,
		__arrayClose = 6,
		__dot = 7,
		__argsSeparator = 8,
		__whitespace = 9,
		__string = 10,
		__numeric = 11,
		__name = 12,
		// Character maps
		__charMapNumericStart = "1234567890",
		__charMapNumeric = __charMapNumericStart + ".",
		__charMapAlpha = "abcdefghijklmnopqrstuvwxyz",
		__charMapAlphaExtended = __charMapAlpha + __charMapAlpha.toUpperCase() + "_",
		__charMapAlphaExtendedContinued = __charMapAlphaExtended + __charMapNumericStart,
		// Error
		__illegalCall = "Illegal call : ",
		__syntaxError = "Syntax error : ";

	/**
	 * Compile a funex string expression into a executable function
	 * @param exp
	 */
	function funex(exp) {
		var tokens = tokenizer(exp);
		return function(context) {
			return executeTokens(tokens, context);
		}
	}

	/**
	 * Execute the instructions dictated by code tokens
	 * @param tokens
	 * @param context
	 */
	function executeTokens(tokens, context) {
		var
				i,
				token,
				tokenStr,
				args,
				value = undefined,
				valueParent = context,
				state,
				callee,
				parsedStr = "",
				// Note: the stack is handled in reverse for easy access
				// to the current value with stack[0]
				stack = [[context]];

		for (i = 0; i < tokens.length; i++) {
			token = tokens[i];
			tokenStr = token[0];
			state = token[1];
			switch(state) {
				case __default:
					parsedStr = parsedStr + tokenStr;
					throw __syntaxError + parsedStr;
					// Dont do anything for now
					// todo: raise an exception or return an error for unrecognized syntax
					break;
				case  __callOpen:
					parsedStr = parsedStr + tokenStr;
					// Add a fresh context in the stack
					args = [context];
					args.__isArgumentArray = true;
					args.c = value; // Callee
					args.cP = valueParent; // CalleeParent
					stack.unshift(args);
					value = undefined;
					valueParent = context;
					break;
				case __callClose:
					parsedStr = parsedStr + tokenStr;
					// Pop the stack and then call the new stack head
					// with the popped value
					args = stack.shift();
					callee = args.c;
					if (!args.__isArgumentArray)
						throw __syntaxError + __illegalCall + parsedStr;
					if (callee !== context) { // Prevent an array call on undefined
						// Reverse the argument into the correct order
						if (typeof callee !== "function")
							throw "Type error: " + typeof(callee) + " is not a function : " + parsedStr;
						stack[0][0] = callee.apply(args.cP, args.reverse());
					} else
						throw __syntaxError + __illegalCall + parsedStr;
					break;
				case __arrayOpen:
					parsedStr = parsedStr + tokenStr;
					stack.unshift([context]);
					value = undefined;
					valueParent = context;
					break;
				case __arrayClose:
					parsedStr = parsedStr + tokenStr;
					// Pop the stack and then call the new stack head
					// as an array with the popped value
					value = stack.shift();
					if (stack[0][0] !== context) {// Prevent an array call on undefined
						value = stack[0][0][ value[0] ];
						stack[0][0] = value;
					} else
						throw __syntaxError + __illegalCall + parsedStr;
					break;
				case __dot:
					parsedStr = parsedStr + tokenStr;
					valueParent = value;
					value = undefined;
					break;
				case __argsSeparator:
					value = undefined;
					valueParent = context;
					parsedStr = parsedStr + tokenStr;
					//todo: check if the argSeparator is used in a correct setting
					if (!stack[0].__isArgumentArray)
						throw __syntaxError + "Illegal use of a comma : " + parsedStr;

					// If the first argument was never set, set as undefined
					if (stack[0][0] === context) stack[0][0] = undefined;
					stack[0].unshift(context);
					break;
//				case __whitespace:
//					// Do nothing here!!!
//					break;
				case __string:
					parsedStr = parsedStr + tokenStr;
					value = tokenStr.substring(1, tokenStr.length-1);
					stack[0][0] = value;
					break;
				case __numeric:
					parsedStr = parsedStr + tokenStr;
					value = parseFloat(tokenStr);
					stack[0][0] = value;
					break;
				case __name:
					parsedStr = parsedStr + tokenStr;
					if (typeof stack[0][0] === "undefined")
						throw "Cannot read property '" + tokenStr + "' of undefined : " + parsedStr;
					value = stack[0][0][tokenStr];
					stack[0][0] = value;
			}
		}
		return (stack[0] === context) ? undefined: stack[0][0];
	}

	/**
	 * Parse a funex string into a stack of tokens
	 * @param exp
	 */
	function tokenizer(exp) {
		var
				i,
				chr,
				instructions = [],
				newState,
				token = "",
				state = __default;

		for (i = 0; i < exp.length; i++) {
			chr = exp[i];

			newState = undefined;
			switch(state) {
				case __default:
					if (chr == "(")
						newState = __callOpen;
					if (chr == ")")
						newState = __callClose;
					if (chr == "[")
						newState = __arrayOpen;
					if (chr == "]")
						newState = __arrayClose;
					if (chr == ".")
						newState = __dot;
					if (chr == ",")
						newState = __argsSeparator;
					if (chr == " ")
						newState = __whitespace;
					if (chr == "'")
						newState = __string;
					if (__charMapNumericStart.indexOf(chr) + 1 > 0)
						newState = __numeric;
					if (__charMapAlphaExtended.indexOf(chr) + 1 > 0)
						newState = __name;
					break;
				case  __callOpen:
					if (chr != "(") newState = __default;
					break;
				case __callClose:
					if (chr != ")") newState = __default;
					break;
				case __arrayOpen:
					if (chr != "[") newState = __default;
					break;
				case __arrayClose:
					if (chr != "]") newState = __default;
					break;
				case __dot:
					if (chr != ".") newState = __default;
					break;
				case __argsSeparator:
					if (chr != ",") newState = __default;
					break;
				case __whitespace:
					// todo: add other whitespace codes
					if (chr != " ") newState = __default;
					break;
				case __string:
					// Use token argument to test for double-quotes
					// If the last char is a "'" and not the first char
					if (token[token.length-1] == "'" && token.length > 1)
						newState = __default;
					break;
				case __numeric:
					if (__charMapNumeric.indexOf(chr) + 1 == 0)
						newState = __default;
					break;
				case __name:
					if (__charMapAlphaExtendedContinued.indexOf(chr) + 1 == 0)
						newState = __default;
			}

			// If state changed, set the new state push the token on the
			// stack of tokens and start a new token
			if (newState) {
				// If the current token is not empty,
				// push it in the instruction stack
				if (token.length > 0)
					instructions.push([token, state]);
				// Get the new state returned by the state handler
				state = newState;
				// Flush the token
				token = "";
				i = i - 1;
			} else {
				// Push the parsing result of that char on the token
				token = token + chr;
			}
		}
		// Push the last token
		if (token.length > 0)
			instructions.push([token, state]);
		return instructions;
	}

	module.exports = funex;

})();