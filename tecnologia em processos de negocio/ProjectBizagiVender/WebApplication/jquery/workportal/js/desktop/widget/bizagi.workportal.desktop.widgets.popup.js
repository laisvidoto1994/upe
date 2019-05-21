/*
*   Name: BizAgi Desktop Popup Widget Implementation
*   Author: Diego Parra
*   Comments:
*   -   This script will shows a widget inside a popup box
*/

// Extends itself
bizagi.workportal.desktop.popup.extend("bizagi.workportal.desktop.widgets.popup", { }, {

    /*
    *   Render the Widget
    *   Returns a deferred
    */
    renderWidget: function (params) {
        var self = this;
        var widget;
        // Creates widget
        $.when(
            self.workportalFacade.getWidget(params.widgetName, params)

        ).pipe(function (result) {
            // Renders widget
            widget = result;
            // register
            self.register(widget);
            return widget.render();

        }).done(function () {
            var content = widget.getContent();

            // Renders content
            self.render(content, params.options);
        });
    },
    
    register : function(widget) {
        var self = this;
        if(widget.registerCallback) {
            widget.registerCallback(self);
        }
    }

});
