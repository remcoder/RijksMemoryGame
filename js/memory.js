function Memory(set) {
	this.lives = 5;
	this.buffer = "";
	this.cards = [];
	this.moves = 0;
	this.move = 0;
	this.blocked = false;
	this.countFound = 0;
	this.countMistakes = 0;
	this.maxMistakes = 5;

	this.load(set);
	this.init();
}

Memory.prototype = {

	load: function (set) {
		//console.log(set.length);

		var cards = this.cards;
		var cols = 5;
		var rows = ~~(set.length / cols);
		for (var s=0 ; s<set.length ; s++)
		{
			var obj = set[s];

			obj.found = false;
			var c1 = new Card(obj);
			var c2 = new Card(obj);

			c1.other = c2;
			c2.other = c1;

			cards.push( c1 );
			cards.push( c2 );
		}
	},

	init: function () {
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
		$('#final, #final h1.win').css('display', 'inline-block');
	},

	lose: function() {
		$('#final, #final h1.lose').css('display', 'inline-block');
	}
}
