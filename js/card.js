function Card(obj) {
	//console.log(	console.logid, url, row, column, rows, cols);

	this.obj = obj;
	this.memory = null;
	this.faceUp = false;
}

Card.prototype = {
	init: function (row, column, rows, cols, memory) {
		this.memory = memory;

		this.$card = $("<div>").addClass("card");
		var $wrapper = $("<div>")
			.addClass("wrapper")
			.addClass("face")
			.addClass("front");

		var $front = $("<img>").attr("src", this.obj.url + "&200x200");
		$wrapper.append($front);

		var $back = $("<div>")
			.addClass("face")
			.addClass("back");

		this.$card.append($wrapper);
		this.$card.append($back);

		this.sprite = new Sprite3D(this.$card[0]);

		this.memory.stage.addChild(this.sprite);

		this.startPos = {
			x : 50 + 110 * (column-cols/2),
			y : 50 + 110 * (row-rows/2)
		}

		this.sprite
				.setRegistrationPoint( 50, 50, 0 )
				.setPosition(this.startPos.x, this.startPos.y, 0)
				.setRotation(0, 180, 0)
				.update();

		this.found = false;

		this.$card.click($.proxy(function (evt) {
			evt.preventDefault();
			this.onClick(evt);
		}, this));
	},

	onClick : function () {
		if (this.memory.blocked)
		{
			console.log("blocked!");
			return;
		}

		if (this.faceUp)
		{
			console.log("already facing up!");
			return;
		}

		if (this.obj.found)
		{
			console.log("already found!");
			return;
		}

		this.flip();

		if (this.memory.move == 0)
		{
			console.log("first peek");
			this.memory.buffer = this
			this.memory.move = 1;
		}
		else
		{
			if (this.obj == this.memory.buffer.obj ) // we have a match
			{
				console.log("match!");
				this.obj.found = true;

				this.memory.onFound();
			}
			else
			{
				console.log("no match :-(");

				this.memory.blocked = true;
				setTimeout( $.proxy(function() {
					this.flip();
					this.memory.buffer.flip();
					this.memory.blocked = false;
					this.memory.buffer = null;
					this.memory.onMistake();
				}, this), 2000)
			}

			this.memory.move = 0;
		}

	},

	flip: function (callback) {
		this.sprite.rotateY(180).update();
		this.faceUp = !this.faceUp;
	}
};
