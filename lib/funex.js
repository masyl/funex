(function () {
	var
		// Declare constants for state names
		__default = 99,
		__objOpen = 1,
		__objClose = 2,
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
		__charMapAlphaExtendedContinued = __charMapAlphaExtended + __charMapNumericStart;


	function funex(exp, context, callback) {
		if (typeof callback == "function") {
			return null;
		}
		return evaluate(exp, context);
	}

	/**
	 * Evaluate a funex expression with a context object as it's scope
	 * @param exp
	 * @param context
	 */
	function evaluate(exp, context) {
		var func = compile(exp);
		return func(context);
	}

	/**
	 * Compile a funex string expression into a executable function
	 * @param exp
	 */
	function compile(exp) {
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
				value = void 0,
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
					throw ("Unknown syntaxt error");
					// Dont do anything for now
					// todo: raise an exception or return an error for unrecognized syntax
					break;
				case __objOpen:
					break;
				case __objClose:
					break;
				case  __callOpen:
					parsedStr = parsedStr + tokenStr;
					// Add a fresh context in the stack
					args = [context];
					args.__isArgumentArray = true;
					args.callee = value;
					args.calleeParent = valueParent;
					stack.unshift(args);
					value = void 0;
					valueParent = context;
					break;
				case __callClose:
					parsedStr = parsedStr + tokenStr;
					// Pop the stack and then call the new stack head
					// with the popped value
					args = stack.shift();
					callee = args.callee;
					if (!args.__isArgumentArray)
						throw ("Syntax error. Closing a function call without opening one (" + parsedStr+ ")");
					if (callee !== context) { // Prevent an array call on undefined
						// Reverse the argument into the correct order
						if (typeof callee !== "function")
							throw ("TypeError: " + typeof(callee) + " is not a function (" + parsedStr+ ")");
						stack[0][0] = callee.apply(args.calleeParent, args.reverse());
					} else
						throw ("Function call on the execution scope if not allowed! (" + parsedStr+ ")");
					break;
				case __arrayOpen:
					parsedStr = parsedStr + tokenStr;
					stack.unshift([context]);
					value = void 0;
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
						throw ("Array call on the execution scope if not allowed! (" + parsedStr+ ")");
					break;
				case __dot:
					parsedStr = parsedStr + tokenStr;
					valueParent = value;
					value = void 0;
					break;
				case __argsSeparator:
					value = void 0;
					valueParent = context;
					parsedStr = parsedStr + tokenStr;
					//todo: check if the argSeparator is used in a correct setting
					if (!stack[0].__isArgumentArray)
						throw ("Syntax error. Semicolons are reserved for separating arguments in function calls! (" + parsedStr+ ")");

					// If the first argument was never set, set as undefined
					if (stack[0][0] === context) stack[0][0] = void 0;
					stack[0].unshift(context);
					break;
				case __whitespace:
					// Do nothing here!!!
					// todo: whitespace in some places should be illegal
					break;
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
						throw ("Cannot read property '" + tokenStr + "' of undefined (" + parsedStr+ ")");
					value = stack[0][0][tokenStr];
					stack[0][0] = value;
			}
		}
		return (stack[0] === context) ? void 0: stack[0][0];
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

			newState = void 0;
			switch(state) {
				case __default:
					if (chr == "{")
						newState = __objOpen;
					if (chr == "}")
						newState = __objClose;
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
				case __objOpen:
					if (chr != "{") newState = __default;
					break;
				case __objClose:
					if (chr != "}") newState = __default;
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