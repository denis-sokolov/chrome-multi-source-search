(function(){
	'use strict';

	var q = function(url, param) {
	    var results = (new RegExp('[\\?&]' + param + '=([^&#]*)')).exec(url);
	    return results && decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

	chrome.extension.onMessage.addListener(function(request, sender, reply) {
		if ('navigate' in request) {
			chrome.tabs.update({
				url: request.navigate
			});
			reply({});
			return;
		}

		if ('location' in request) {
			var query = q(request.location.search, 'q');
			if (!q(request.location.search, 'start')) {
				chrome.bookmarks.search(query, function(bookmarks){
					reply({
						bookmarks: bookmarks,
						query: query
					});
				});
				return true;
			} else {
				reply({});
				return;
			}
		}
	});
})();
