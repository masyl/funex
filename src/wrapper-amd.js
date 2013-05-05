/*! {name} v{version} {buildName} | {now} | {copyright} */
(function (define) {
"use strict";

{source}

// AMD define happens at the end for compatibility with AMD loaders
// that don't enforce next-turn semantics on modules.
if (typeof define === 'function' && define.amd) {
	define('funex', function() {
		return compile;
	});
}

})(define);
