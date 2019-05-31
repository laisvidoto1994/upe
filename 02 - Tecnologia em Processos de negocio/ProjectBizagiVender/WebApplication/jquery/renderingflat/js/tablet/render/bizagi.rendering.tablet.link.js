/*
*   Name: BizAgi Tablet Render Link Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the link render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.link.extend("bizagi.rendering.link", {}, {
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var link = $(".ui-bizagi-render-link", control);
        var isValidValue = (properties.value
            && $.trim(properties.value).toLowerCase().match(/^(http|https):\/\//) !== null) || false;

        // Call base
        self._super();

        self.input = control.find("a");

        if (!properties.editable) {
            link.addClass("bz-rn-link-disabled");
            control.closest(".ui-bizagi-render").addClass("bz-rn-read-only");
        }

        if (properties.editable && isValidValue) {
            link.attr("href", $.trim(properties.value));
            link.attr("target", "_blank");
            link.attr("data-rel", "external");

            $(self.input).on("click", function (e) {
                e.preventDefault();

                var elem = $(this);
                var url = elem.attr("href");

                window.open(url, "_system");
            });
        }
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;

        // Execute configure handlers
        self.configureHandlers();
        // Help Text Control
        self.configureHelpText();
    }
});
