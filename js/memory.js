function Memory(cards) {
	this.lives = 5;
	this.buffer = "";
	this.cards = cards;
	this.moves = 0;
	this.move = 0;
	this.blocked = false;
	this.countFound = 0;
	this.countMistakes = 0;
	this.maxMistakes = 5;
	this.init();
}

Memory.prototype = {
	init: function () {
		// this.cards.sort(function (){
		// 	return (Math.round(Math.random())-0.5);
		// });

		this.cols = 5;
		this.rows = ~~(this.cards.length / this.cols);

		// display cards
		for(var c=0 ; c<this.cards.length ; c++)
		{
			var row = ~~(c/this.cols);
			var col = c % this.cols;

			var card = this.cards[c];

			card.init(row,col, this.rows, this.cols, this);
		}
	},

	onFound: function() {
		this.countFound++;
		if (this.countFound == this.cards.length / 2)
			this.win();
	},

	onMistake: function () {
		this.countMistakes++;
		if (this.countMistakes > this.maxMistakes)
			this.lose();
	},

	win: function() {
		alert("Yay! je hebt gewonnen!");
	},

	lose: function() {
		alert("helaas.. je hebt gefaald :-(");
	}

}
