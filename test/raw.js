var
		assert = require("assert"),
		fixtures = require("./fixtures");
		funex = require("../lib/funex");

var funex1 = funex("join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))");
var result = funex1(fixtures);

assert.equal(result, "Billy-Julia-Julia-Billy");