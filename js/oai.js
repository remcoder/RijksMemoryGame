function OAI() {}

OAI.prototype = {

	listRecords: function (n, callback) {
		var pattern = "xml/%s.xml";
		var url = interpolate(pattern, n.toString());
		console.log("retrieving " + url);
		$.get(url, function (data) {
			var $xml = $(data);

			console.log("records retrieved: " + $xml.find("record").length);

			var results = $xml.find("record").map(function(i,el) {
				return {
					url: $(el).find("format:contains('text')").find("identifier").text(),
					title: $(el).find("title").text(),
					imageUrl: $(el).find("format:contains('image')").find("identifier").text()
				}
			});

			callback($.makeArray(results));
		});
	}

}
