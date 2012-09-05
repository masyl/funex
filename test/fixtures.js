module.exports = {
	lorem: "ipsum",
	kidsObj: {
		first: "Billy",
		second: "Julia"
	},
	join: function (a, b) {
		return a +"-" + b;
	},
	kids: [
		"Billy",
		"Julia"
	],
	allKids: function () {
		return this.kids.join(", ");
	},
	getKid: function (i) {
		return this.kids[i];
	},
	plus3: function (a, b, c) {
		return a + b + c;
	},
	actions: {
		'didn\'t': "did not",
		'couldn\'t': "could not",
		'james\'': "jameses"
	}
};