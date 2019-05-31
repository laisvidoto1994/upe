/**
 * Module to show transitions between modules
 *
 * @author Edward J Morales
 */

if(!bizagi) {
	var bizagi = {};
}

bizagi.loadModuleStatus = (function() {
	var self = this;
	self.module = "";
	self.$container = $("#loadModuleStatus");
	self.$template = $("div");
	self.hasBeenStoped = false;
	self.isVisible = false;
	self.excludedModules = ["kendo", "formModeler"];


	self._render = function(args) {
		args = args || {};
		self._clean();
		self.$content = ($.tmpl) ? $.tmpl(self.$template, args) : $("div");
		var $module = $("[name='modulename']", self.$content);
		$module.html(self.module);
		self.$content.appendTo(self.$container);

	};
	self._clean = function() {
		self.$container.empty();
	};

	self._show = function() {
		if($.inArray(self.module, self.excludedModules) >= 0) {
			return;
		}

		window.setTimeout(function() {
			if(!self.hasBeenStoped) {
				var maxZIndex = bizagi.util.getMaxZIndex();
				self._render();
				$(".ui-widget-overlay", self.$container).css("z-index", maxZIndex + 20);
				$("#modalModuleStatus", self.$container).css("z-index", maxZIndex + 30);
				self.$container.show();
				self.isVisible = true;
			}
		}, 100);

		// If module expend more than 10 sec, just force to hide it
		window.setTimeout(function() {
			if(self.isVisible) {
				self._hide()
			}
		}, 10000);
	};

	self._hide = function() {
		self.hasBeenStoped = true;
		self.$content.hide();
		self._clean();
		self.isVisible = false;
	};

	self._setTemplate = function($template) {
		self.$template = $template;
		self._render();
	};

	self._setModule = function(module) {
		self.module = module;
	};

	//Start Actions
	self.$container.empty();
	self.$container.hide();
	self._render();

	return {
		show: self._show,
		hide: self._hide,
		setTemplate: self._setTemplate,
		setModule: self._setModule
	}
});