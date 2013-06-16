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
		var checkbox = this;

		var save = function(){
			var settings = {};
			settings[checkbox.name] = checkbox.checked;
			chrome.storage.sync.set(settings);
		};
		var revert = function(){
			checkbox.checked = false;
		};

		var requiredPermission = $(checkbox).data('permission');
		var permissionObject = {};
		if (requiredPermission.substr(0, 4) === 'http') {
			permissionObject.origins = [requiredPermission];
		} else {
			permissionObject.permissions = [requiredPermission];
		}

		if (!requiredPermission) {
			save();
			return;
		}

		if (checkbox.checked) {
			chrome.permissions.request(permissionObject, function(granted){
				if (granted) {
					save();
				} else {
					revert();
				}
			});
		} else {
			chrome.permissions.remove(permissionObject);
			save();
		}
	});
});
