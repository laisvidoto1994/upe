/*
*   Name: BizAgi Form Modeler View Rendering Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view rendering drawing and handlers
*/

bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Starts the rendering component
    */
    configureTemplateView: function () {
        var self = this;
        var renderingModel = self.controller.getRenderingModel();
        var model = {
            data: renderingModel,
            canvas: self.mainContainer.find("#main-panel"),
            mode: self.renderingMode
        };

        // Create rendering facade
        self.renderingView = new bizagi.rendering.facade();
        bizagi.log("Rendering with ...", renderingModel); 

        // Add global handlers
        self.renderingView.subscribe("dropfinish", function (ev, args) {
            // The element dropped is an layout element
            if (args.sourceGuid) {
                self.onRenderingReplaceAndRestoreElement(args);
            } else {
                self.onRenderingViewUpdateElement(args);
            }
        })
        self.renderingView.subscribe("changelabel", function (ev, args) {
            if (args.value) {

                $.extend(args, { property: 'displayName', renderType: 'label' });
                args.value = bizagi.editor.utilities.buildComplexLocalizable(args.value, args.guid, 'displayName');
                self.onRenderingViewUpdateElement(args);
            } else {
                self.refresh();
            }
        });
        self.renderingView.subscribe('deleteRepeaterItem', function (ev, args) { self.onDeleteRepeaterItem(args); });
        self.renderingView.subscribe("unselectelement", function (ev, args) { self.onRenderingViewElementUnselected(args); });
        self.renderingView.subscribe("selectelement", function (ev, args) { self.onRenderingViewElementSelected(args); });
        self.renderingView.subscribe("selectcontainerform", function (e, args) { self.onRenderingSelectForm(args); });
        self.renderingView.subscribe("canChangeLabel", function (e, args) { return self.onTemplateChangeLabel(args);});
        self.renderingView.subscribe('restoreItem', function (ev, args) { self.onRestoreItem(args); });
        self.renderingView.subscribe('isDeleteOptionAllowed', function (ev, args) { return self.onIsDeleteOptionAllowed(args); })
        self.renderingView.subscribe("controlRefreshCanvas", function (ev, args) {
            setTimeout(function () {
                self.refreshCanvas(args);
            }, 0);            
        });
        self.renderingView.subscribe("hideElement", function (ev, args) { self.onHideElement(args); });
       
        // Execute rendering
        $.when(self.renderingView.execute(model))
        .done(function (form) {
            self.formContainer = form;

            // Add theme style
            self.applyThemeToTemplates();
            $(document).ready(function () {
                self.applyThemeToTemplates();
            });
            $(window).resize(function () {
                self.applyThemeToTemplates();
            });
        });
    },
                      
    /*
    *   Style the rendering component
    */
    applyThemeToTemplates: function () {
        var self = this, containerForm, wrapperPanel, mainPanel;

        mainPanel = self.mainContainer.find("#main-panel");
        wrapperPanel = $(".wrapper-main-scroll");
        containerForm = $("> .bz-design-template", mainPanel);

        // Apply global classes depending mode
        if (self.renderingMode === "layout") {
            $("#main-panel").addClass("bz-main-layout-mode");
        } else if (self.renderingMode === "design") {
            $("#main-panel").removeClass("bz-main-layout-mode");
        }

        if (containerForm.children().length === 0) {
            containerForm.append('<div class="children"></div>');
        };

        // Add style class
        containerForm.addClass("biz-form").addClass("biz-draft-border");

        self.renderingView.publish("controlRefreshCanvas");
    },


    /*************************************************************************************************** 
    *   EVENT TYPE HANDLERS
    *****************************************************************************************************/

    /*
    *   Activates when the drop operation finishes in the rendering view
    *  in this case the item droppable is a layout element
    */
    onRenderingReplaceAndRestoreElement: function (args) {
        var self = this;

        self.executeCommand($.extend({ command: "replaceAndRestoreElement" }, args))
    },

    /*
    *   Activates when the drop operation finishes in the rendering view
    */
    onRenderingViewUpdateElement: function (args) {
        var self = this;

        self.executeCommand($.extend({ command: "updateElement"}, args));
    },

    /*
    * Activates when a repeter element want to be deleted
    */
    onDeleteRepeaterItem: function (args) {
        var self = this;

        self.executeCommand($.extend({ command: "deleteRepeaterItem" }, args));
    },

    /*
    *
    */
    onTemplateChangeLabel: function (args) {
        var self = this,
            properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        return (properties.type != ':image');
    },
    
    /*
    * Activates when a layout element is deleted, restores to layout default 
    */
    onRestoreItem: function(args){
        var self = this;

        self.executeCommand({ command: 'updateElement', guid: args.guid, renderType: 'layoutPlaceholder', toInitialState : true});
    },

    /*
    * Returns true if the layout element can be deleted
    */
    onIsDeleteOptionAllowed: function (args) {
        var self = this,             
            model = self.controller.getModel(),        
            element = model.getElement(args.guid);

        if (!element) { return false;}
        if (element.type == 'layoutPlaceholder') { return false; }
        if (element.properties.type && element.properties.type.search(/image/ig) >= 0) { return false; }

        return true;
    },

    /*
    * Activates when a element want to be removed of layout 
    */
    onHideElement: function (args) {
        var self = this;

        self.executeCommand({ command: 'changeProperty', guid: args.guid, property: 'hide', value: true });

    }

})