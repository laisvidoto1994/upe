/**
 *
 * Created by RicardoPD on 8/11/2016.
 */

(function ($) {
    $.fn.helpText = function (options) {
        'use strict';

        options = options || {};
        options.helpText = options.helpText || "";
        options.dir = typeof options.dir !== "undefined" && options.dir !== "" ? options.dir : "inherit";

        var tmpl =
            '<div class="bz-container-rn-helptext-overlay">' +
            '   <div class="bz-rn-helptext" dir="#: data.dir #">' +
            '       <div class="bz-cancel-container">' +
            '           <a href="\\#" style="opacity: 0; width: 0; height: 0"></a>' +
            '           <span class="bz-mo-icon bz-cancel"></span>' +
            '       </div>' +
            '       <span class="bz-rn-helptext-text">#= data.helpText #</span>' +
            '   </div>' +
            '</div>';

        var template = kendo.template(tmpl, { useWithBlock: false });
        var $html = $(template(options));

        $(this).bind("click", function () {
            $("body").append($html);
            $("a", $html).get(0).focus();
            $(".bz-cancel", $html).bind("click", function () {
                $html.remove();
            });
            $("a", $html).bind("blur", function () {
                $(".bz-cancel", $html).click();
            });
            $html.addClass("active");
        });
    };
})(jQuery);