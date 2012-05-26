var assert = require("assert");
var fixtures = require("./fixtures");
var funex = require("../lib/funex");
var funex1 = funex("join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))");

fixtures = [fixtures];
fixtures.push({
	name:"bob",
	age:30
});

var result = funex1(fixtures);

assert.equal(result, "Billy-Julia-Julia-Billy");