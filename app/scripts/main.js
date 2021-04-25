'use strict';

$(function () {
	$('.color-field').wpColorPicker({
		change: function (event, ui) {
			var $this = $(this);
			setTimeout(function () {
					$this.trigger('input');
				}, 0
			);
		}
	});

	$('#style').html($('pre#css').html());
});