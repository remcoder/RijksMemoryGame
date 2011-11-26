function Card(obj, memory) {
	//console.log(	console.logid, url, row, column, rows, cols);

	this.obj = obj;
	this.memory = memory;
}

Card.prototype = {
	display: function (row, column, rows, cols) {
		this.$card = $("<div>").addClass("card");
		var $wrapper = $("<div>").addClass("wrapper").addClass("front");
		var $front = $("<img>").attr("src", this.obj.url + "&200x200");
		$wrapper.append($front);
		var $back = $("<div>").addClass("back");

		this.$card.append($wrapper);
		this.$card.append($back);

		this.sprite = new Sprite3D(this.$card[0]);

		Sprites.push(this.sprite);
		Stage.addChild(this.sprite);

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
			console.log("click");
			this.onClick(evt);
		}, this));
	},

	onClick : function () {
		//if (this.obj.found)
		this.flip();
	},

	flip: function () {
		this.sprite.rotateY(180).update();
	},

	flash: function (color) {

	}
};
