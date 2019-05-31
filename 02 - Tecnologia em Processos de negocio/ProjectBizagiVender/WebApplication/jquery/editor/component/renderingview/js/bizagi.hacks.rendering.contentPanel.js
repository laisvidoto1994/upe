
/*
*   Name: BizAgi Form Modeler Panel Extension
*   Author: Christian Collazos
*   Comments:
*   -   This script will redefine the panel class to adjust to form modeler
*/

bizagi.rendering.contentPanel.original = $.extend(true, {}, bizagi.rendering.contentPanel.prototype);
$.extend(bizagi.rendering.contentPanel.prototype, {
    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (panel) {
        var self = this;

        bizagi.rendering.contentPanel.original.postRenderContainer.apply(this, arguments);

        // Add custom class just for form modeler
        panel.addClass("ui-bizagi-container-contentpanel-formmodeler");

        //bind header double click
        var header = panel.find(".ui-bizagi-container-contentpanel-header");


        header.dblclick(function () {

            header.hide();

            // Publish label edition event
            self.triggerGlobalHandler("startlabeledition");

            // Create editable label component
            var presenter = new bizagi.editor.component.editableLabel.presenter({
                label: header,
                value: self.properties.displayName
            });

            // Bind change event
            presenter.subscribe("change", function (ev, args) {
                self.triggerGlobalHandler("changelabel", { guid: self.properties.guid, value: args.value });
            });

            // Render label
            $.when(presenter.render()).done(function () {
                if (self.getElement().find(".ui-bizagi-container-input-editable").length == 0) {
                    setTimeout(function () {
                        header.hide();
                        self.adjustEditLabel();
                    }, 100);
                } else {
                    self.adjustEditLabel();
                }
            });
        });
    },

    // Configure  sortable plugin
    configureSortablePlugin: function (container) {
        var self = this;
        
        container = container.find('.ui-bizagi-container-contentpanel-wrapper');

        return bizagi.rendering.contentPanel.original.configureSortablePlugin.apply(this, arguments);
   },
   
    /*
*   Disable sortable plugin
*/
    disableSortablePlugin: function () {
        var self = this;
        var container = self.container.find('.ui-bizagi-container-contentpanel-wrapper');

        if (container && container.hasClass('ui-sortable')) {
            if (container.data()["ui-sortable"]) {
                container.sortable('destroy');
            }
        }

        for (var i = 0, l = self.children.length; i < l; i = i + 1) {
            if (self.children[i].container) {
                self.children[i].disableSortablePlugin();
            }
        }
    },


    adjustEditLabel: function () {
        var self = this;

        self.getElement().find(".ui-bizagi-container-input-editable").css({
            "width": "95%",
            "background-color": "orange",
            "top": "-18px",
            "border-radius": "10px"
        });

        self.getElement().find(".ui-bizagi-container-input-editable input").css({
            "margin-left": "5px",
            "width": "90%"
        });

        self.getElement().find(".ui-bizagi-render-confirmation").css({
            "right": "10px",
            "top": "5px"
        });
    },

    showElementLabelEditor: function () {
        var self = this;

        if (!(self.container.find(".ui-bizagi-container-input-editable > input.ui-bizagi-input-editable").length > 0)) {
            self.container.find("span:first").trigger('dblclick');
        }
    }
})