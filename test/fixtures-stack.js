module.exports = [
	{
		join: function (a, b) {
			return a +"-" + b;
		},
		allKids: function () {
			return this.kids.join(", ");
		}
	},
	{
		lorem: "ipsum",
		kids: [
			"Billy",
			"Julia"
		],
		actions: {
			'didn\'t': "did not",
			'couldn\'t': "could not",
			'james\'': "jameses"
		}
	},
	{
		getKid: function (i) {
			// console.log(this);
			return this.kids[i];
		},
		plus3: function (a, b, c) {
			return a + b + c;
		}
	},
	{
		kidsObj: {
			first: "Billy",
			second: "Julia"
		}
	}
];