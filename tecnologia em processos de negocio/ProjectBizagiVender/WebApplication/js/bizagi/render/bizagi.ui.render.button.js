/*
* jQuery BizAgi Render Button Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.button.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {

    var DEFAULT_BUTTON_URL = "äjax/AjaxButtonHandler.aspx";

    $.ui.baseRender.subclass('ui.buttonRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.buttonUrl = properties.actionUrl || DEFAULT_BUTTON_URL;

            // Creates control
            self.button = $('<input class="ui-bizagi-render-button" type="button" />')
                .attr("value", properties.caption)
                .appendTo(control);

            // Apply button plugin
            self.button.button();

            // Bind event
            self.button.click(function () {

                // Submit the entire form
                var form = self.getFormContainer();
                form.ajaxSubmit({
                    url: self.buttonUrl,
                    data: { dependencies: properties.dependencies, idRender: properties.id, submitType: 'buttonRender' },
                    success: function (responseText, statusText, xhr, element) {
                        // DUMMY
                        alert("The rule has been executed via AJAX sucessfully");

                        // Process response
                        self._parseSubmitOnChangeResponse(responseText);
                    }
                });
            });
        }
    });

})(jQuery);