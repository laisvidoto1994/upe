/* 
 * Simple Scroll for Bizagi Workportal
 * @author: Edward J Morales
 */

(function ($) {
    $.fn.bizagiScrollbar = function (options) {
        // define options
        var $options = options || {};
        var $autohide = typeof ($options['autohide']) !== "undefined" ? $options['autohide'] : true;

        if ($.browser.webkit) {
            $autohide = false;
        }

        // scroll containers
        var $scrollContainer = this;

        // hide or show scrollbar 
        if ($autohide) {
            $scrollContainer.css("overflow-y", "hidden");
            $scrollContainer.hover(
                function () {
                    $scrollContainer.css("overflow-y", "auto");
                },

                function () {
                    $scrollContainer.css("overflow-y", "hidden");
                }
            );

        } else {
            $scrollContainer.css("overflow-y", "auto");
        }
    };
})(jQuery);


