$(function(){
	'use strict';

	// i18n
	$('[data-msg]').each(function(){
		var el = $(this);
		el.text(chrome.i18n.getMessage(el.data('msg')));
	});

	// Fill initial values
	var names = $('[type="checkbox"]').map(function(){
		return this.name;
	}).get();
	chrome.storage.sync.get(names, function(result){
		for (var key in result) {
			if (result.hasOwnProperty(key)) {
				var all = $('[name="'+key+'"]');
				all.filter('[type="checkbox"]').prop('checked', result[key]);
			}
		}
	});

	// Save new values
	$('[type="checkbox"]').on('change', function(){
		var settings = {};
		settings[this.name] = this.checked;
		chrome.storage.sync.set(settings);
	});
});
