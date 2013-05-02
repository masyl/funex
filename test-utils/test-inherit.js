var fixtures = require("./fixtures-stack");

function recursiveMemoryFrameFactory(framesArray) {
	function Frame(obj) {
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				this[key] = obj[key];
			}
		}
	};

	console.log("-------");
	console.log(framesArray);

	var referenceObj = framesArray.shift();

	if (framesArray.length > 0) {
		Frame.prototype = recursiveMemoryFrameFactory(framesArray);
	}

	var frame = new Frame(referenceObj);

	return frame;
}
fixtures.unshift({});
var frames = recursiveMemoryFrameFactory(fixtures);

console.log("::::::::::::::");
console.log(frames["lorem"]);
console.log("lorem" in frames);
