var assert = require("assert");
var fixtures = require("./fixtures");
var funex = require("../lib/funex");
//var funex1 = funex("join(join(kidsObj.first, kidsObj.second), join(kidsObj.second, kidsObj.first))");
//var funex1 = funex("kidsObj.first");
var funex1 = funex("name");

fixtures = [fixtures];
fixtures.push({
	name:"bob",
	age:30
});

var result = funex1(fixtures);

assert.equal(result, "Billy");