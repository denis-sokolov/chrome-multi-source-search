(function(){
	'use strict';

	var populateResults = function(result) {
		var results = false;

		var bar = $('<div>')
			.addClass(chrome.i18n.getMessage('@@extension_id')+'-infobar')
			.on('click', 'a', function(e){
				e.preventDefault();
				chrome.extension.sendMessage({
					navigate: $(this).prop('href')
				});
			});

		$('<button>')
			.addClass('close')
			.text(chrome.i18n.getMessage('infobar_close'))
			.on('click', function(){
				bar.remove();
			})
			.appendTo(bar);




		if (result.bookmarks && result.bookmarks.length) {
			var bookmarks = $('<div>').addClass('bookmarks').appendTo(bar);

			var b = result.bookmarks[0];
			$('<a>')
				.prop('href', b.url)
				.text(b.title)
				.appendTo(bookmarks);

			if (result.bookmarks.length > 1) {
				bookmarks.append(chrome.i18n.getMessage('infobar_bookmarks_and')).append(
					$('<a>')
						.prop('href', 'chrome://bookmarks/#q='+encodeURIComponent(result.query))
						.text(chrome.i18n.getMessage('infobar_bookmarks_multiple', [
							result.bookmarks.length - 1,
							result.query
						]))
				).append('.');
			}
			results = true;
		}

		if (result.wikipedia && result.wikipedia.query && result.wikipedia.query.search) {
			var wikipedia = $('<div>').addClass('wikipedia').appendTo(bar);

			var wp = result.wikipedia.query.search[0];
			$('<a>')
				.prop('href', 'https://en.wikipedia.org/wiki/'+encodeURIComponent(wp.title))
				.text(wp.title)
				.appendTo(wikipedia);
			wikipedia.append(chrome.i18n.getMessage('infobar_wikipedia_and')).append(
				$('<a>')
					.prop('href', 'https://en.wikipedia.org/w/index.php?fulltext=Search&search='+encodeURIComponent(result.query))
					.text(chrome.i18n.getMessage('infobar_wikipedia_multiple', [
						result.wikipedia.query.searchinfo.totalhits - 1,
						result.query
					]))
			).append('.');

			results = true;
		}

		if (results) {
			bar.appendTo('body');
		}
	};


	chrome.extension.sendMessage({
		location: document.location
	}, function(result){
		if (result.query) {
			populateResults(result);
		}
	});
})();
