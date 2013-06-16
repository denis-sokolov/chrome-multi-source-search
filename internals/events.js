(function(){
	'use strict';

	var search = function(query, callback){
		var results = {
			query: query
		};

		var tasks = 0;
		var checkDone = function(){
			if (tasks === 0) {
				callback(results);
			}
		};
		var taskDone = function(){
			tasks--;
			checkDone();
		};

		tasks++;
		chrome.storage.sync.get('bookmarksEnabled', function(result){
			if (result.bookmarksEnabled) {
				chrome.bookmarks.search(query, function(bookmarks){
					results.bookmarks = bookmarks;
					taskDone();
				});
			} else { taskDone(); }
		});

		checkDone();
	};


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
				search(query, function(result){
					reply(result);
				});
				return true;
			} else {
				reply({});
				return;
			}
		}
	});
})();
