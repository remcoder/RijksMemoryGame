function Card(id, url, row, column, rows, cols) {
	console.log(	console.logid, url, row, column, rows, cols);
	this.id = id;
	this.url = url;

	this.$card = $("<div>").addClass("card");
	var $wrapper = $("<div>").addClass("wrapper").addClass("front");
	var $front = $("<img>").attr("src", url + "&100x100");
	$wrapper.append($front);
	var $back = $("<div>").addClass("back");

	this.$card.append($wrapper);
	this.$card.append($back);

	this.sprite = new Sprite3D(this.$card[0]);

	Sprites.push(this.sprite);
	Stage.addChild(this.sprite);

	this.startPos = {
		x : 50 + 100 * (column-cols/2),
		y : 50 + 100 * (row-rows/2)
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

}

Card.prototype = {
	onClick : function () {
		this.flip();
	},

	flip: function () {
		this.sprite.rotateY(180).update();
	},

	flash: function (color) {

	}
};
