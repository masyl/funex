(function () {
	// Declare constants for state names
	var
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
		__name = 12;

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
		var segments = parseInstructions(exp);
		return function(context) {
			return executeSegments(segments, context);
		}
	}

	/**
	 * Execute the instructions dictated by code segments
	 * @param segments
	 * @param context
	 */
	function executeSegments(segments, context) {
		var stack = [];
		for (var i = 0; i < segments.length; i++) {
			// stateSegmentHandlers[ ...
			// start executing!!!!!!
		}
	}

	var
		__charMapAlpha = "abcdefghijklmnopqrstuvwxyz",
		__charMapAlphaExtended = __charMapAlpha + __charMapAlpha.toUpperCase() + "_",
		__charMapNumericStart = "1234567890",
		__charMapNumeric = __charMapNumericStart + ".";

	/**
	 * Parse a funex string into a stack of syntax segments
	 * @param exp
	 */
	function parseInstructions(exp) {
		var
				chr,
				instructions = [],
				newState,
				segment = "",
				state = __default;

		for (var i = 0; i < exp.length; i++) {
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
				case __string: // Use segment argument to test for double-quotes
					// If the last char is a "'" and not the first char
					if (segment[segment.length-1] == "'" && segment.length > 1)
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

			// If state changed, set the new state push the segment on the
			// stack of segments and start a new segment
			if (newState) {
				// If the current segment is not empty,
				// push it in the instruction stack
				if (segment.length > 0)
					instructions.push([segment, state]);
				// Get the new state returned by the state handler
				state = newState;
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