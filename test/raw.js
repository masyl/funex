var
		result,
		funex = require("../lib/funex"),
		should = require("should"),
		assert = require("assert");

var context = {
	lorem: "ipsum",
	kids: {
		first: "Billy",
		second: "Julia"
	},
	allKids: function () {
		return this.kids.join(", ")
	}
};

funex("lorem.patate('this, is not', val[0], this)", context);
funex("{ a:[1,2] , b:[3,4] }", context);
