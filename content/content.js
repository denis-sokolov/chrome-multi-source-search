(function(){
	'use strict';

	var populateResults = function(result) {
		var containerClass = chrome.i18n.getMessage('@@extension_id')+'-infobar';

		var bar = $('<div>')
			.addClass(containerClass);

			$('<button>')
				.addClass('close')
				.text(chrome.i18n.getMessage('infobar_close'))
				.on('click', function(){
					$(this).closest('.'+containerClass).remove();
				})
				.appendTo(bar);

		if (result.bookmarks.length === 1) {
			var b = result.bookmarks[0];
			$('<a>')
				.prop('href', b.url)
				.text(b.title)
				.appendTo(bar);
		} else if (result.bookmarks.length > 1) {
			$('<a>')
				.prop('href', 'chrome://bookmarks/#q='+result.query)
				.text(chrome.i18n.getMessage('infobar_bookmarks_multiple', [
					result.bookmarks.length,
					result.query
				]))
				.appendTo(bar);
		}

		bar
			.on('click', 'a', function(e){
				e.preventDefault();
				chrome.extension.sendMessage({
					navigate: $(this).prop('href')
				});
			})
			.appendTo('body');
	};


	chrome.extension.sendMessage({
		location: document.location
	}, function(result){
		if (result.query) {
			populateResults(result);
		}
	});
})();
