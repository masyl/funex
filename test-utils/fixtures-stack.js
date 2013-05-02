module.exports = [
	{
		join: function (a, b) {
			return a +"-" + b;
		},
		allKids: function () {
			return this.kids.join(", ");
		},
		keys: function (obj) {
			var arr = [];
			for (key in obj) {
				arr.push(key);
			}
			return arr.join();
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
		},
		uppercase: function (str) {
			return str.toUpperCase();
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