(function(){
	'use strict';

	var populateResults = function(result) {
		if (result.bookmarks.length === 0) {
			return;
		}

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



		var bookmarks = $('<div>').addClass('bookmarks').appendTo(bar);

		var b = result.bookmarks[0];
		$('<a>')
			.prop('href', b.url)
			.text(b.title)
			.appendTo(bookmarks);

		if (result.bookmarks.length > 1) {
			bookmarks.append(chrome.i18n.getMessage('infobar_bookmarks_and')).append(
				$('<a>')
					.prop('href', 'chrome://bookmarks/#q='+result.query)
					.text(chrome.i18n.getMessage('infobar_bookmarks_multiple', [
						result.bookmarks.length - 1,
						result.query
					]))
			).append('.');
		}

		bar.appendTo('body');
	};


	chrome.extension.sendMessage({
		location: document.location
	}, function(result){
		if (result.query) {
			populateResults(result);
		}
	});
})();
