function Memory(set) {
	this.lives = 5;
	this.buffer = "";
	this.cards = [];
	this.moves = 0;
	this.move = 0;
	this.blocked = false;
	this.countFound = 0;
	this.player = 0; // 0: not playing, 1: player 1, 2: player 2
	this.score1 = 0;
	this.score2 = 0;

	// setup main stage and load the cards
	this.stage = Sprite3D.createCenteredContainer();
	this.load(set, $.proxy(this.onLoad,this) );
}

Memory.prototype = {

	load: function (set, callback) {
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

		this.cols = 5;
		this.rows = ~~(this.cards.length / this.cols);
		this.loading = 0; // keep track of loading images

		// display cards
		for(var c=0 ; c<this.cards.length ; c++)
		{
			var row = ~~(c/this.cols);
			var col = c % this.cols;

			var card = this.cards[c];
			this.loading++;
			card.init(row, col, this, $.proxy(function() {
				console.log('loaded');
				this.loading--;
				if (callback && this.loading == 0)
					callback();
			}, this));
		}
	},

	onLoad: function() {
		console.log('loading finished!');

		setTimeout($.proxy(this.randomize,this), 1000);
	},

	randomize: function() {
		console.log('randomizing');
		this.cards.sort(function (){
			return (Math.round(Math.random())-0.5);
		});

		// display cards in order
		for(var i=0 ; i<this.cards.length ; i++)
		{
			var row = ~~(i/this.cols);
			var col = i % this.cols;

			var card = this.cards[i];

			card.setPos(row,col);
			card.sprite.setRotation(0, 180, 0);
			card.sprite.update();

		}

		this.setActivePlayer(1);
	},

	onFound: function(card) {
		if (this.player == 1)
			this.score1++;
		if (this.player == 2)
			this.score2++;

		card.$card.addClass("player" + this.player);
		card.other.$card.addClass("player" + this.player);

		this.countFound++;
		if (this.countFound == this.cards.length / 2)
			this.win();
	},

	onMistake: function () {
		this.nextPlayer();
	},

	win: function() {
		$('#final, #final h1.win').css('display', 'inline-block');
	},

	lose: function() {
		$('#final, #final h1.lose').css('display', 'inline-block');
	},

	setActivePlayer: function(n) {
		this.player = n;
		document.title = "player " + n;
		$(".scorecard").removeClass("active");
		if (n == 1)
		{
			$("#player1").addClass("active");
		}
		else if (n == 2)
		{
			$("#player2").addClass("active");
		}
	},

	nextPlayer: function() {
		if (this.player == 1)
			this.setActivePlayer(2);
		else
			this.setActivePlayer(1);
	}
}
