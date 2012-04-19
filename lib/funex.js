(function () {
	// Declare constants for state names
	var
		__default = 999,
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
		__name = 12;

	function funex(exp, context, callback) {
		if (typeof callback === "function") {
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
		var segments = parseInstructions(exp);
		return function(context) {
			return context.lorem;
		}
	}

	var
		__charMapAlpha = "abcdefghijklmnopqrstuvwxyz",
		__charMapAlphaExtended = __charMapAlpha + __charMapAlpha.toUpperCase() + "_",
		__charMapNumericStart = "1234567890",
		__charMapNumeric = __charMapNumericStart + ".";

	var stateHandlers = {
		// todo: marke the return value a single value string or false if it didnt changed;
		// Return Array: [stateChanged, newState]
		/*__default*/
		999: function (chr) {
			if (chr === "{")
				return __objOpen;
			if (chr === "}")
				return __objClose;
			if (chr === "(")
				return __callOpen;
			if (chr === ")")
				return __callClose;
			if (chr === "[")
				return __arrayOpen;
			if (chr === "]")
				return __arrayClose;
			if (chr === ".")
				return __dot;
			if (chr === ",")
				return __argsSeparator;
			if (chr === " ")
				return __whitespace;
			if (chr === "'")
				return __string;
			if (__charMapNumericStart.indexOf(chr) + 1 > 0)
				return __numeric;
			if (__charMapAlphaExtended.indexOf(chr) + 1 > 0)
				return __name;
		},
		/* __objOpen */
		1: function (chr) {
			if (chr !== "{") return __default;
		},
		/* __objClose */
		2: function (chr) {
			if (chr !== "}") return __default;
		},
		/* __callOpen */
		3: function (chr) {
			if (chr !== "(") return __default;
		},
		/* __callClose */
		4: function (chr) {
			if (chr !== ")") return __default;
		},
		/* __arrayOpen */
		5: function (chr) {
			if (chr !== "[") return __default;
		},
		/*__arrayClose*/
		6: function (chr) {
			if (chr !== "]") return __default;
		},
		/* __dot */
		7: function (chr) {
			if (chr !== ".") return __default;
		},
		/* __argsSeparator */
		8: function (chr) {
			if (chr !== ",") return __default;
		},
		/* __whitespace */
		9: function (chr) {
			// todo: add other whitespace codes
			if (chr !== " ") return __default;
		},
		/* __string */
		10: function (chr, segment) { // Use segment argument to test for double-quotes
			// If the last char is a "'" and not the first char
			if (segment[segment.length-1] === "'" && segment.length > 1)
				return __default;
		},
		/* __numeric */
		11: function (chr) {
			if (__charMapNumeric.indexOf(chr) + 1 === 0)
				return __default;
		},
		/* __name */
		12: function (chr) {
			if (__charMapAlphaExtended.indexOf(chr) + 1 === 0)
				return __default;
		}
	};

	/**
	 * Parse a funex string into a stack of syntax segments
	 * @param exp
	 */
	function parseInstructions(exp) {
		var
				chr,
				instructions = [],
				result,
				segment = "",
				state = __default;

		for (var i = 0; i < exp.length; i++) {
			chr = exp[i];
			result = stateHandlers[state](chr, segment);
			// If state changed, set the new state push the segment on the
			// stack of segments and start a new segment
			if (result) {
				// If the current segment is not empty,
				// push it in the instruction stack
				if (segment.length > 0)
					instructions.push([segment, state]);
				// Get the new state returned by the state handler
				state = result;
				// Flush the segment
				segment = "";
				i = i - 1;
			} else {
				// Push the parsing result of that char on the segment
				segment = segment + chr;
			}
		}
		// Push the last segment
		if (segment.length > 0)
			instructions.push([segment, state]);
		return instructions;
	}

	module.exports = funex;

})();