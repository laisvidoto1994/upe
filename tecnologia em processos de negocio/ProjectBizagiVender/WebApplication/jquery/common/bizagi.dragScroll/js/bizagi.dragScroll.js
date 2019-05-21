/**
 * Zoom plugin creates a drag and scroll control
 *
 * @author Andrés Fernando Muñoz
 */
(function($) {

	$.widget("diagram.dragScroll", {
		options: {
		},

		_create: function() {
			var self = this;
			var options = this.options;
			var clicked = false;
			self.curYPos = 0;
			self.curXPos = 0;

			$(self.element).css({
				'cursor': 'move'
			});

			$(self.element).bind("mousedown",function(e){
				clicked = true;

				self.options.$scrollable.data({
					"clicked": clicked
				});

				self.curYPos = e.pageY;
				self.curXPos = e.pageX;
				self.scrollLeft = self.options.$scrollable.scrollLeft();
				self.scrollTop = self.options.$scrollable.scrollTop();
				options.$scrollable.bind("mousemove",function(e){
					if(clicked){
						self._move(e.pageX,e.pageY);
					}
				});
			});

			$(self.element).bind("mouseup",function(e){
				clicked = false;
				self.options.$scrollable.data({
					"clicked": clicked
				});
				options.$scrollable.unbind("mousemove");
			});


		},
		/**
		 * Moves the element
		 * @param x, x axis differential
		 * @param y, y axis differential
		 * @private
		 */
		_move: function(x,y){
			var self = this;
			var moveX = self.scrollLeft + self.curXPos - x;
			var moveY = self.scrollTop + self.curYPos - y;
			if (moveX != 0 && moveY != 0){
				self.options.$scrollable.scrollTop(moveY);
				self.options.$scrollable.scrollLeft(moveX);
			}

		},


		destroy: function() {
			// Call the base destroy function.
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);

