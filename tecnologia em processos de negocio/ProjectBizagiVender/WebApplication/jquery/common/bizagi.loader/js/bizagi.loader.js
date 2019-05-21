/*
 * Widtget to manage the loader on smartphones and tablets.
 * @author: Cristian Alberto Olaya Márquez - CristianO
 * Septiempre 2015
 */

(function(global) {
	global.bizagiLoader = function(options) {

		var opt = {
			loaderInstanceVisible: false,
			loaderStopped: false,
			errorMessageShown: false,
		};

		// Extend options
		$.extend(opt, opt, options);

		var methods = {
			start: function() {

				// Override hide loading...
				$(".km-loader").css("display", "none");

				//keep all the loader calls saved to hide it when the last 'stop' function is called
				var loadersArray = bizagi.util.getItemLocalStorage("loader");

				//if selector, apply loader over it, otherwise apply loader on html body
				if (opt.selector) {
					if (opt.innerLoader) {
						$(opt.selector).append('<div class="innerLoader"></div>');
					} else {
						kendo.ui.progress($(opt.selector), true);
					}
				} else {
					if (!loadersArray || loadersArray == "NaN") {
						var loaderStackInitialValue = $(".k-loading-mask").css("display") == "block" ? 2 : 1;
						bizagi.util.setItemLocalStorage("loader", loaderStackInitialValue);
						if ($(".k-loading-mask").css("display") === "block") {
							$(".k-loading-mask").css("display", "none");
						}
					} else {
						loadersArray = Number(loadersArray) + 1;
						bizagi.util.setItemLocalStorage("loader", loadersArray);
					}

					kendo.ui.progress($("body"), true);
				}

				// AutoHide loader after 20 seconds (if no one call stopLoading function)
				setTimeout(function() {
					var loadersArrayCheck = Number(bizagi.util.getItemLocalStorage("loader"));
					//Needs to valid the existence of unregistred
					if (loadersArrayCheck >= 1 || ($('.k-loading-mask').size() >= 1 ) ) {
						$(".km-loader").css("display", "none");

						if (opt.selector) {
							if (opt.innerLoader) {
								$(opt.selector).find('.innerLoader').remove();

							} else {
								kendo.ui.progress($(opt.selector), false);
							}
						}

						kendo.ui.progress($("body"), false);

						opt.errorMessageShown = true;

						localStorage.removeItem("loader");
					}
				}, 20000);
			},

			stop: function() {

				var loadersArray = Number(bizagi.util.getItemLocalStorage("loader"));

				if (opt.selector) {
					if (opt.innerLoader) {
						$(opt.selector).find('.innerLoader').remove();

					} else {
						kendo.ui.progress($(opt.selector), false);
					}
				}

				if (loadersArray <= 1) {

					opt.loaderStopped = true;

					$(".km-loader").css("display", "none");
					$(".k-loading-mask").css("display", "none");
					kendo.ui.progress($(".km-flat"), false);

					localStorage.removeItem("loader");

					return;

				}

				loadersArray -= 1;
				bizagi.util.setItemLocalStorage("loader", loadersArray);
			},

			startInnerLoader: function(elementName) {
				$(elementName).addClass("innerLoaderContainer");
				bizagiLoader({ 'selector': elementName, 'innerLoader': true }).start();
			},

			stopInnerLoader: function(elementName) {
				$(elementName).removeClass("innerLoaderContainer");
				bizagiLoader({ 'selector': elementName, 'innerLoader': true }).stop();
			}
		};

		return methods;
	}
})(this);
