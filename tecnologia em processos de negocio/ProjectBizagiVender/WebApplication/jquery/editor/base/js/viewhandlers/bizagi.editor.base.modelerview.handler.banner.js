/*
*   Name: BizAgi Form Modeler View Context Menu Handler
*   Author: Alexander Mejia
*   Comments:
*   -   This script will handler modeler view context menu handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {
    /*
    *   Draws the context menu in the layout
    */
    drawBanner: function (params) {
        var self = this;

        // Define canvas
        var canvas = $("<div />")
            .appendTo(self.mainContainer.find("#left-panel"));

        // Define model
        var data = { element: self.mainContainer.find("#left-panel") };
        var presenter = self.banner = new bizagi.editor.component.banner.presenter({ canvas: canvas, data: data });

        // Define handlers
        presenter.subscribe("onBannerClick", function (e, args) { self.onBannerClick(args); });
        presenter.subscribe("onBannerOptionClick", function (e, args) { self.onBannerOptionClick(args); });
        // Render and return 
        return presenter.render();

    },

    hideBanner: function () {
        var self = this;
        self.banner.hide();
    },
    showBanner: function () {
        var self = this;

        if (self.controller.isFormContext() || self.controller.isStartFormContext()) {
            self.banner.show();
        }
    },

    /*
    *  Destroy component
    */
    destroy: function () {
        var self = this;
    },

    /*
    *  Handlers options banner
    */
    onBannerClick: function (args) {
        var self = this;
        self.performstore();
    },

    /*
    *  Handlers options banner
    */
    onBannerOptionClick: function (args) {
        var self = this;

        if (typeof self["perform" + args.key] === "function") {
            self["perform" + args.key]();
        }
    },


    /*
    *  Opens bizagi store
    */
    performstore: function () {
        var self = this;

        var openWidgetStoreProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "openwidgetstore" });

        $.when(openWidgetStoreProtocol.processRequest())
        .done(function (success) {
            if (success) {
                var getWidgetsProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getwidgets" });
                $.when(getWidgetsProtocol.processRequest())
                    .done(function (widgets) {
                        if (widgets) {
                            self.executeCommand({ command: "loadWidgets", controls: widgets });
                        }
                        self.destroy();
                    });
            }
        });
    },

    /*
    *  Uploads widget in bizagi store
    */
    performupload: function () {
        var self = this;

        var installWidgetProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "installwidget" });
        $.when(installWidgetProtocol.processRequest())
            .done(function () {
                self.destroy();
            });
    }


});
