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
	this.lives = this.initLives();


	// setup main stage and load the cards
	this.stage = Sprite3D.createCenteredContainer();
	this.load(set, $.proxy(this.onLoad,this) );
}

Memory.prototype = {

	initLives : function() {
		var lives = Sprite3D.createCenteredContainer();
		$(lives.domElement).css({
			position: "absolute",
			top: "15px",
			left: "15px",
			//"-webkit-perspective": "800px",
			"-webkit-perspective-origin-x": "245px",
		}).attr("id", "lives");


		for (var s=0; s<6 ; s++)
		{
			var img = new Image();
			img.src= "img/life.jpg";
			img.width=42;

			var sprite = new Sprite3D(img);
			lives.addChild(sprite);
			sprite.setPosition( s * (42+15), 0, 0 );
			sprite.update();
		}

		return lives;
	},

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

		// this.cards.sort(function (){
		// 	return (Math.round(Math.random())-0.5);
		// });

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
	},

	onFound: function() {
		this.countFound++;
		if (this.countFound == this.cards.length / 2)
			this.win();
	},

	onMistake: function () {
		//$("#mistakes").append("<img src='http://rijksmuseumspotlight.com/Content/800/SK-A-135.jpg'>");

		var last = this.lives.children.length - 1;
		var sprite = this.lives.children[last];

		var _this = this;
		sprite.domElement.addEventListener(
    	'webkitTransitionEnd',
    	function( event ) {
    		_this.lives.removeChildAt(last);
    	}, false );

    anim = ~~(Math.random() * 3);

		if (anim == 0) sprite.rotateX(90).update();
		if (anim == 1) sprite.rotateY(90).update();
		if (anim == 2) sprite.rotateZ(180).update();
		sprite.domElement.style.opacity = 0;

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
