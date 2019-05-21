/**
 * Zoom plugin creates a zoom control
 *
 * @author Andrés Fernando Muñoz
 */
(function($) {

	$.widget("diagram.zoom", {
		options: {
			min: 50,
			max: 150,
			step: 10,
			value: 100,
			onZoom: function (value) {}
		},

		_create: function() {
			var self = this;
			var options = this.options;
			self._bindSlider();
			self._bindTooltip();
		},

		/**
		 *
		 * @private
		 */
		_bindSlider: function () {
			var self = this
				options = self.options;
			self.element.slider({
				min: options.min,
				max: options.max,
				step: options.step,
				value: options.value,
				change: function(event, ui) {
					options.onZoom(ui.value);
					var val = ui.value.toString() + "%";
					$('#zoom-value').text(val);
				}
			});
		},

		/**
		 *
		 * @private
		 */
		_bindTooltip: function () {
			var self = this;
			var $tooltip = $("<div class='zoom-tooltip'><label id='zoom-value'></label></div>");
			$(".bz-zoom-container").append($tooltip);

			$(".bz-zoom-container").mouseenter(function () {
				$tooltip.addClass("is-visible-output");
				var val = self.element.slider("option", "value") + "%";
				$('#zoom-value').text(val);
			}).mouseleave(function () {
				$tooltip.removeClass("is-visible-output");
			});

		},

		destroy: function() {
			// Call the base destroy function.
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);

