/*
*   Name: BizAgi Desktop Render Link Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the link render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.link.extend("bizagi.rendering.link", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {

    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this,
            control = self.getControl(),
            properties = self.properties,
            link = $(".ui-bizagi-render-link", control);

        // Call base
        self._super();

        if (properties.value) {
            // Modify href
            link.attr("href", properties.value);
            link.attr("target", "_blank");

            link.click(function() {
                //if the container form of this component is detail, executes the link
                self.linkSolver({ linkType: properties.linktarget, url: properties.value });
                return false;
            });
        } else {
            link.addClass("ui-state-disabled");
        }
    },

    linkSolver: function (args) {
        args = args || {};
        var self = this;
        var url = args.url || "";
        var target = args.target || "_blank";

        if (url) {
            if (url.indexOf("http") === -1 && url.indexOf("\\\\") === -1) {
                url = "//" + bizagi.util.trim(url);
            }
        }

        switch (args.linkType) {
            case "newwindow":
                var windowParamsPatter = "width=%s,height=%s,resizable,scrollbars=yes,status=1,toolbar=yes";
                var windowParams = printf(windowParamsPatter, window.screen.width, window.screen.height);
                self.windowObjReference = window.open(url, target, windowParams);
                break;
            case "newtab":
                self.windowObjReference = window.open(url, target);
                break;
            default:
                self.windowObjReference = window.open(url, target);
                break;
        }
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;

        // Execute the same as post-render
        self.postRender();
        self.configureHandlers();
    }
});
