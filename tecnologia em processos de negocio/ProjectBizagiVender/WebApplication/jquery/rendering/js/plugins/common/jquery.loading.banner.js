/* 
 * Custom Loading Message 
 * @author: Edward J Morales, Refactor => Diego Parra
 */

/**
 * 
 * @param: type  {default || custom}
 * @param: customMessage  {html}
 * @param: positionX  {integer+px|| percent}
 * @param: positionY  {integer+px|| percent}
 */

(function ($) {
    // Create or Define BizAgi namespace
    bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
    bizagi.loadingMessageTemplate = $.template('#loading_template', '<div class="ui-bizagi-loading-message" style="position: relative;"><div class="ui-bizagi-loading-message-center" style="position: ${position}; top: ${top}; left: ${top}; display: ${inline};"><div class="ui-bizagi-loading-icon"></div></div></div>');

    // Loading plugin
    $.fn.loadingMessage = function (options) {
        options = options || {};

        // define global options
        var parentContainer = this;

        // Don't set the waiting message if the container has elements
        if (parentContainer.children().length == 0) {
            var message = $.fasttmpl(bizagi.loadingMessageTemplate, {
                "position": "absolute",
                "top": options["position-y"] || "48%",
                "left": options["position-x"] || "48%",
                "display": "inline"
            });
            parentContainer.append(message);
            parentContainer.data("loading", true);
        }
    };

    (function ($) {
        $.fn.startLoading = function (params) {
            var content = this;
            var params = params || {};
            var delay = params.delay || 0;
            var overlay = params.overlay || false;
            
            // Check that the container is not loading already
            if ($(content).data("loading") == true) return;
            
            // Set loading flag
            $(content).data("loading", true);
            
            // Create overlay
            var overlayElement = (overlay) ?
                    $.template('#loading_tmpl_transparent', '<div class="ui-bizagi-loading-transparent-overlay ui-bizagi-loading-alpha-overlay"><div class="ui-bizagi-loading-overlay-preloader"></div></div>') :
                    $.template('#loading_tmpl_alpha', '<div class="ui-bizagi-loading-transparent-overlay"><div class="ui-bizagi-loading-overlay-preloader ${extraCssClass}"></div></div>');


            // Creates a timeout function and save the handle in the element
            var handle = window.setTimeout(function () {
                $(content).data("original-position", $(content).css("position"));
                $(content).css("position", "relative");

                $(content).append($.fasttmpl(overlayElement));
                $(content).removeData("loading-timeout");
            }, delay);
            $(content).data("loading-timeout", handle);
        };

        $.fn.endLoading = function () {
            var content = this;
            $(content).css("position", $(content).data("original-position"));
            $(".ui-bizagi-loading-transparent-overlay", content).remove();
            
            // Clear the timeout handle
            var handle = $(content).data("loading-timeout");
            if (handle) clearTimeout(handle);
            
            // Remove loading flag
            $(content).data("loading", false);
            
        };
    })(jQuery);

})(jQuery);
