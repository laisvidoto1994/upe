/*
*   Name: BizAgi Workportal Workarea Controller 
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to handle all the workarea of the application
*/

bizagi.workportal.controllers.controller.extend("bizagi.workportal.controllers.workarea", {}, {

    /*
    *   This method sets the internal widget to be rendered
    */
    setWidget: function (widget) {
        var self = this;
        self.widget = widget;
    },

    disposeWidget: function () {
        var self = this;
        if (self.widget) {
            self.widget.dispose();
            delete self.widget;
        }
    },

    cleanWidgets: function () {
        var self = this;

        if (self.widget) {
            self.widget.clean();
        }
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;

        var defer = new $.Deferred();

        if (self.widget) {
            // Renders the widget
            $.when(self.widget.render())
            .done(function () {
                self.content = self.widget.getContent();
                defer.resolve(self.content);
            });

        } else {
            self.content = $("<div/>");
            defer.resolve(self.content);
        }

        return defer.promise();
    },

    /*
    *   Resizes layout for controller
    */
    performResizeLayout: function () {
        var self = this;

        // Call internal widget resize
        if (self.widget) self.widget.performResizeLayout();
    }

});
