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
		__charMapAlpha = "abcdefghijklmnopqrstuvwxyz",
		__charMapAlphaExtended = __charMapAlpha + __charMapAlpha.toUpperCase() + "_",
		__charMapNumericStart = "1234567890",
		__charMapNumeric = __charMapNumericStart + ".";


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
				token,
				state,
				// Note: the stack is handled in reverse for easy access
				// to the current value with stack[0]
				stack = [[context]];

		for (i = 0; i < tokens.length; i++) {
			token = tokens[i];
			tokenStr = token[0];
			state = token[1];
			switch(state) {
				case __default:
					// Dont do anything for now
					// todo: raise an exception or return an error for unrecognized syntax
					break;
				case __objOpen:
					break;
				case __objClose:
					break;
				case  __callOpen:
					// Add a fresh context in the stack
					stack.unshift([context]);
					break;
				case __callClose:
					// Pop the stack and then call the new stack head
					// with the popped value
					var value = stack.shift();
					if (stack[0].length > 1) // Prevent a function call on the context object
						stack[0].unshift(
							stack[0][0].call(
								stack[0][1], value[0]
							)
						);
					else
						throw ("Function call on the execution scope if not allowed!")
					break;
				case __arrayOpen:
					stack.unshift([context]);
					break;
				case __arrayClose:
					// Pop the stack and then call the new stack head
					// as an array with the popped value
					var value = stack.shift();
					if (stack[0].length > 1) // Prevent an array call on the context object
						stack[0].unshift(
							stack[0][0][
								value[0]
							]
						);
					else
						throw ("Function call on the execution scope if not allowed!")
					break;
				case __dot:
					// hu? Nothing ?
					break;
				case __argsSeparator:

					break;
				case __whitespace:
					// Do nothing here!!!
					// todo: whitespace in some places should be illegal
					break;
				case __string:
					stack[0].unshift(
							tokenStr.substring(1, tokenStr.length-1)
					);
					break;
				case __numeric:
					stack[0].unshift(new Number(tokenStr));
					break;
				case __name:
					stack[0].unshift(stack[0][0][tokenStr]);

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
					if (__charMapAlphaExtended.indexOf(chr) + 1 == 0)
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