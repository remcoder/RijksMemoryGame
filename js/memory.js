function Memory(cards) {
	this.lives = 5;
	this.buffer = "";
	this.cards = cards;
	this.moves = 0;

	this.display();
}

Memory.prototype = {
	display: function () {
		this.cards.sort(function (){
			return (Math.round(Math.random())-0.5);
		});

		this.cols = 5;
		this.rows = ~~(this.cards.length / this.cols);

		// display cards
		for(var c=0 ; c<this.cards.length ; c++)
		{
			var row = ~~(c/this.cols);
			var col = c % this.cols;

			var card = this.cards[c];

			card.display(row,col, this.rows, this.cols);

		}
	}
}
