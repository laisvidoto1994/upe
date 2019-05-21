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
    configureRenderingView: function () {
        var self = this;
        var renderingModel = self.controller.getRenderingModel();
        var model = {
            data: renderingModel,
            canvas: self.mainContainer.find("#main-panel"),
            mode: self.renderingMode
        };

        // Set a ready deferred
        self.loadFormDeferred = new $.Deferred();

        // Create rendering facade
        self.renderingView = new bizagi.rendering.facade();
        bizagi.log("Rendering with ...", renderingModel);

        // Add global handlers
        self.renderingView.subscribe("sortstart", function () { self.onRenderingViewSortStart(); });
        self.renderingView.subscribe("sortfinish", function (ev, args) { self.onRenderingViewSortFinish(args); });
        self.renderingView.subscribe("unselectelement", function (ev, args) { self.onRenderingViewElementUnselected(args); });
        self.renderingView.subscribe("selectelement", function (ev, args) { self.onRenderingViewElementSelected(args); });
        self.renderingView.subscribe("canChangeLabel", function () { return true; });
        self.renderingView.subscribe("startlabeledition", function () { self.onRenderingViewStartLabelEdition(); });
        self.renderingView.subscribe("changelabel", function (ev, args) { self.onRenderingViewElementChangeLabel(args); });
        self.renderingView.subscribe("elementrightclick", function (ev, args) { self.onRenderingViewElementRightClick(args); });
        self.renderingView.subscribe("addtab", function (ev, args) { self.onRenderingViewTabAdd(args); });
        self.renderingView.subscribe("deletetab", function (ev, args) { self.onRenderingViewTabDelete(args); });
        self.renderingView.subscribe("activatetab", function (ev, args) { self.onRenderingViewTabActivate(args); });
        self.renderingView.subscribe("showsearchform", function (ev, args) { self.onRenderingShowSearchForm(args); });
        self.renderingView.subscribe("showProperties", function (ev, args) { self.onRenderingShowProperties(args); });
        self.renderingView.subscribe("showPropertiesForm", function (ev, args) { self.onRenderingShowPropertiesForm(args); });
        self.renderingView.subscribe("controlRefreshCanvas", function (e, args) { self.refreshCanvas(args); });
        self.renderingView.subscribe("selectcontainerform", function (e, args) { self.onRenderingSelectForm(args); });
        self.renderingView.subscribe("checkCtrlKey", function (e, args) { return self.onCheckCtrlKey(args); });
        self.renderingView.subscribe("resizeImage", function (e, args) { return self.onResizeImage(args); });
        self.renderingView.subscribe("refreshControl", function (e, args) { return self.onRefreshControl(args); });
        self.renderingView.subscribe("getparentid", function (e, args) { return self.onGetParentId(args); });
        self.renderingView.subscribe("getLastInsertedElement", function () { return self.onGetLastInsertedElement(); });
        self.renderingView.subscribe("getControlIcon", function (e, args) { return self.onGetControlIcon(args); });
        self.renderingView.subscribe("setLastInsertedElement", function (e, args) { self.onSetLastInsertedElement(args); });
        
        // Execute rendering
        $.when(self.renderingView.execute(model))
        .done(function (form) {
            self.formContainer = form;

            // Resolve load deferred
            self.loadFormDeferred.resolve();

           setTimeout(function () {
                // Add theme style
                self.applyThemeToRendering();
            }, 100);

            
            $(document).ready(function () {
                self.applyThemeToRendering();
            });

            $(window).bind("resize.rendering", function () {
                self.applyThemeToRendering();
            });
        });

        return self.loadFormDeferred.promise();

    },

    /*
    *   Style the rendering component
    */
    applyThemeToRendering: function () {
        var self = this, containerForm, wrapperPanel, mainPanel;

        mainPanel = self.mainContainer.find("#main-panel");
        wrapperPanel = $(".wrapper-main-scroll");
        containerForm = $("> .ui-bizagi-container-form", mainPanel);

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

        //TODO: Mejorar la funcionalidad para adicionar el drophere//
        /* Para el formulario cuando esta vacio */
        $(".ui-bizagi-container-form > .children").attr("drophere", bizagi.localization.getResource("formmodeler-component-editor-layout-drophere-containers"));
        /* Para los hijos */
        var selectors = ".ui-bizagi-container-panel, .ui-bizagi-container-group, .ui-bizagi-container-nestedform, .ui-bizagi-container-horizontal, .ui-col > .children, .ui-bizagi-container-tab, .ui-bizagi-render:last, .ui-bizagi-render:first";
        $(selectors).attr("drophere", bizagi.localization.getResource("formmodeler-component-editor-layout-drophere"));
        $(".ui-drop-here-layout").attr("drophere", bizagi.localization.getResource("formmodeler-component-editor-layout-drophere"));
        /**/
        var addStyleDropHere = $('<style id="drophere"></style>');
        if ($("#drophere").length === 0) {
            var head = $("head");
            head.append(addStyleDropHere);
            $("#drophere", head).append('.ui-bizagi-placeholder:before,  #bz-fm-grid-columneditor[class*="drop-here"]:before {content:"' + bizagi.localization.getResource("formmodeler-component-editor-layout-drophere") + '"}');
        }

    },

    /*
    *  Apply tooltip plugin
    */
    createMsgValidationTooltip: function () {
        var self = this;

        var mainPanel = self.mainContainer.find("#main-panel");
        $(".ui-bizagi-render-icon-editor-msg-validation[title], .ui-bizagi-container-icon-editor-msg-validation-templates[title]", mainPanel).tooltip({
            tooltipClass: "ui-widget-content ui-msg-validation-tooltip",
            content: function () {
                var element = $(this);
                //set the title as 'content' to apply possible html tags or styles included in original title
                if (element[0] && element[0].attributes["data-title"]) {
                    var text = element[0].attributes["data-title"].value;
                    return text;
                } else if (element[0] && element[0].title) {
                    var _title = element[0].title;
                    element[0].title = "";
                    return _title;
                }
            }
        });
    },

    /*
    * Returns a promise, is is resoved when la form is rendered
    */
    formIsLoaded: function() {
        var self = this;

        return self.loadFormDeferred;
    },

    /*
    * Removes tooltip plugin
    */
    removeMsgValidationTooltip: function () {
        var self = this;
        var mainPanel = self.mainContainer.find("#main-panel");
        $(".ui-msg-validation-tooltip", mainPanel).remove();
    },

    /*
    *   Refresh the rendering component, fetching the model again
    */
    refreshRenderingView: function (args, renderingMode) {
        var self = this;

        // Don't do nothing if there is no rendering view
        if (typeof self.renderingView === "undefined") { return; }

        // Set rendering mode
        renderingMode = renderingMode || self.renderingMode;
        self.renderingMode = renderingMode;

        self.showRenderingModel();
    },

    /*
     * render all the model
     */
    showRenderingModel: function(){
        var self = this;
            

        $.when(self.controller.getRenderingModel())
            .done(function (renderingModel) {

                // Redraw the model
                var model = {
                    data: renderingModel,
                    mode: self.renderingMode,
                    focus: self.currentFocus
                };
                bizagi.log("Rendering with ...", renderingModel);

                // Set the view for the form to allow notifications
                $.when(self.renderingView.update(model))
                    .done(function (form) {
                        self.formContainer = form;

                      

                        // Refresh selection
                        if (self.renderingMode === "design") {
                            form.selectElementByGuid(self.controller.getGuidsSelected());
                        }

                        // Apply theming
                        if (self.controller.isTemplateContext()) {
                            self.applyThemeToTemplates();
                        } else {
                            self.applyThemeToRendering();
                        }

                        // Apply tooltip
                        if (self.validateForm) {
                            self.removeMsgValidationTooltip();
                            self.createMsgValidationTooltip();
                        }
                    });
            });
    },

    /* 
    * Changes the current focus for the rendering view ( Ex. When changing tabs)
    */
    setCurrentFocus: function (elementGuid) {
        var self = this;
        self.currentFocus = elementGuid;
    },

    /*
    * Return true is current mode is layout
    */
    isLayoutMode: function () {
        var self = this;
        return (self.renderingMode === "layout");
    },

    /*
    *  Check if there are elements selected
    */
    processSelectedElements: function (args) {
        var self = this;

        // If there are elements selected, then launch propertybox with ist dependencies
        var guidsSelected = self.controller.getGuidsSelected();

        if (guidsSelected.length === 1) {
            args = self.controller.getSelectedElements(guidsSelected[0]);
            self.controller.removeSelectedElement();
            self.onRenderingViewElementSelected($.extend({ IsOnClickEvent: true }, args));
        }
        else if (guidsSelected.length > 1) { self.drawComponents(); }

    },

    /*
    * Draws Components in current selection 
    */
    drawComponents: function (components) {
        var self = this;

        components = components || {};
        var args = components.args;

        if (self.controller.thereAreMultiselection()) {
            self.removeDecorator();

            if (args && !args.IsOnClickEvent) { }
            else { self.drawPropertyBox({ guid: self.controller.getGuidsSelected() }); }

            // Refresh ribbon 
            self.refreshRibbon();
        }
        else {

            // Draw decorator and show element xpath in navigator
            self.drawDecorator(args);

            // Refresh ribbon 
            self.refreshRibbon(args.guid);

            // Apply copy format
            self.applyCopyFormat(args.guid);
        }
    },


    /*************************************************************************************************** 
    *   EVENT TYPE HANDLERS
    *****************************************************************************************************/

    /*
    *   Deletes the selected item
    */
    deleteElement: function () {
        var self = this;
        var elementsSelected = self.controller.getGuidsSelected();

        if (elementsSelected) {
            self.hidePropertyBox();
            self.executeCommand({
                command: "removeElementById",
                guids: elementsSelected
            });
            self.currentSelectedElement = null;
        }
    },

    /*
    *   Activates when the sort starts in the rendering view
    */
    onRenderingViewSortStart: function () {
        var self = this;

        // Hide property box component
        self.hidePropertyBox();

        // Add dashed grid style
        $("#main-panel").addClass("bz-main-dashed-grid");
    },

    /*
    *   Activates when the sort operation finishes in the rendering view
    */
    onRenderingViewSortFinish: function (args) {
        var self = this;

        // Remove dashed grid style
        $("#main-panel").removeClass("bz-main-dashed-grid");

        // Execute operations
        if (args.source && args.source.toolbar) {
            // Add from controls navigator
            self.executeCommand({ command: "insertElementFromControlsNavigator", position: args.finalPosition, parent: args.targetContainer, data: args.source.data });

        } else if (args.source && args.source.xpathNavigator) {

            // Resolve xpath
            args.source.data.xpath = bizagi.editor.utilities.buildComplexXpath(args.source.data.xpath, args.source.data.contextScope, args.source.data.isScopeAttribute, args.source.data.guidRelatedEntity);

            // Add from xpath navigator
            self.executeCommand({ command: "insertElementFromXpathNavigator", position: args.finalPosition, parent: args.targetContainer, data: args.source.data });

        } else if (args.source && args.source.layout) {
            // Add from layout navigator
            self.executeCommand({ command: "createAndInsertControlLayoutInModel", position: args.finalPosition, parent: args.targetContainer, id: args.source.data });

        } else {
            // Element moving
            if (args.sourceContainer === args.targetContainer) {
                // Same container moving
                if (args.initialPosition !== args.finalPosition) {
                    self.executeCommand({ command: "moveElement", initialPosition: args.initialPosition, finalPosition: args.finalPosition, parent: args.targetContainer });
                }
            }
            else {
                // External container moving
                self.executeCommand({ command: "moveElementContainer", posIni: args.initialPosition, posEnd: args.finalPosition, parentSource: args.sourceContainer, parentTarget: args.targetContainer });
            }
        }
    },

    /*
    *   Activates when an element has been unselected
    */
    onRenderingViewElementUnselected: function (args) {
        var self = this;

        // Remove selected element flag
        self.currentSelectedElement = null;

        if (args && args.ctrlIsPressed !== undefined) {
            self.controller.removeSelectedElement(args.guid);
        } else {
            self.controller.removeSelectedElement();
        }

        // Remove decorator and refresh ribbon with un-selected model
        self.hidePropertyBox();
        self.removeDecorator();
        self.refreshRibbon();

        self.processSelectedElements(args);

    },

    onRenderingSelectForm: function (args) {
        var self = this;
        self.drawPropertyBox({
            formProperties: true
        });
    },

    /*
    *   Activates when an element has been selected
    */
    onRenderingViewElementSelected: function (args) {
        var self = this,
            properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        var components = { args: args, decorator: true, ribbon: true, copyFormat: true };

        // If is a new selection
        if (args.IsOnClickEvent) {

            // Add selected element flag
            self.currentSelectedElement = args.guid;

            // for multiple selection
            if (args.ctrlIsPressed === undefined) {
                self.controller.removeSelectedElement();
            }

            self.controller.addSelectedElement(args.guid, args);

            // Show xpath in XpathNavigator component 
            if (args.type == "nestedForm") {
                self.showElementGuid(properties.form, properties.xpath);
                self.drawComponents(components);
            } else if (args.isInternal) {
                self.showMetadataXpath(properties.xpath);
                self.drawComponents(components);
            } else { 
                $.when(self.showElementXpath(properties.xpath))
                        .done(function () {
                            self.drawComponents(components);
                        });
            }

        } else { self.drawComponents(components); }
    },

    /*
    * Apply the format saved, to speecific render
    */
    applyCopyFormat: function (guid) {
        var self = this, options;
        if (self.controller.copyFormatHasElement()) {
            var property = self.controller.getCopyFormatElement();
            if (property.guid !== guid) {
                property = self.controller.popCopyFormat();

                options = {
                    command: "changeProperty",
                    guid: guid,
                    property: "format"
                };
                if (property.properties !== undefined) {
                    $.extend(options, { value: bizagi.clone(property.properties) });
                } else {
                    $.extend(options, { value: bizagi.clone({}) });
                }
                self.executeCommand(options);
            }
        }
    },


    /*
    *   Activates when the user starts to edit a label in the rendering view
    */
    onRenderingViewStartLabelEdition: function () {
        var self = this;

        // Hide property box
        self.hidePropertyBox();
    },

    /*
    *   Activates when the element has its displayname changed
    */
    onRenderingViewElementChangeLabel: function (args) {
        var self = this;

        // Execute change property command
        self.executeCommand({
            command: "changeProperty",
            guid: args.guid,
            property: "displayName",
            value: args.value
        });
    },

    /*
    *   Activates when the element has been right clicked
    */
    onRenderingViewElementRightClick: function (args) {
        var self = this;

        //This feature is not enabled for multi-selection at the moment
        if (self.controller.thereAreMultiselection() && self.controller.getSelectedElements(args.guid)) { return; }

        var properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        // Destroy the contextmenu if is created to avoid the duplication
        if (self.contextmenu) { self.contextmenu.destroy(); }

        $.when(self.showElementXpath(properties.xpath))
            .done(function () {
                // Draw a new context menu
                self.drawContextMenu({ guid: args.guid, position: args.position });
            });
    },

    /*
    *   Activates when the user attempts to add a tab
    */
    onRenderingViewTabAdd: function (args) {
        var self = this;

        // Perform add tab command
        var tabElement = self.executeCommand({ command: "insertTabItem", tab: args.guid });

        setTimeout(function () {
            self.onRenderingViewTabActivate(tabElement);
        }, 100);

    },

    /*
    *   Activates when the user attempts to remove a tab
    */
    onRenderingViewTabDelete: function (args) {
        var self = this;

        // Perform remove element command
        self.executeCommand({ command: "removeElementById", guid: args.guid });
    },

    /*
    *   Executes when a tab has been activated or selected
    */
    onRenderingViewTabActivate: function (args) {
        var self = this;

        // Save current focus
        self.setCurrentFocus(args.guid);

        // Remove selected element flag
        self.currentSelectedElement = null;

        self.refresh();
    },

    /*
    *   Activates when the user has clicked search button
    */
    onRenderingShowSearchForm: function (args) {
        var self = this;

        var properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        // checks if there are search forms related
        if (properties && properties.searchforms && $.isArray(properties.searchforms)) {
            // Opens search form
            self.performSelectFormButton({ value: properties.searchforms });
        }
    },

    /*
    *   Activates when the user has clicked message validation button
    */
    onRenderingShowPropertiesForm: function () {
        var self = this;

        // show properties form
        self.performShowFormProperties();
    },

    /*
    *   Activates when the user has clicked a tabItem
    */
    onRenderingShowProperties: function (args) {
        var self = this;

        self.drawPropertyBox(args);
    },

    /*
    * Activates when the key CTRL is pressed
    */
    onCheckCtrlKey: function () {
        var self = this;

        return (!self.isLayoutMode() && self.controller.isCtrlKeyPressed()) ? true : false;
    },

    /*
    * Activates on stop resizing the image
    */
    onResizeImage: function (args) {
        var self = this;

        self.executeCommand({ command: "changeMultipleProperties", guid: args.guid, properties: args.properties, refreshProperties: true });
    },

    /*
    * returns the render element 
    */
    onGetRenderElement: function (args) {
        var self = this;
        if (self.formContainer) {
            return self.formContainer.getRenderById(args.id);
        }
        return null;
    },


    /*
    * Refresh an element on the main form
    */
    refreshElement: function (args) {
        var self = this;
        var id, element, render = {};

        if (self.formContainer) {
            if (args.container) {
                var container = args.container;
                id = container.properties.id;
                if (!$.isArray(render[id])) { render[id] = []; }
                render[id].push(1);
                element = self.formContainer.getRenderById(id);

                if (element) {
                    element.refreshDesignContainer(args);
                    self.refreshCanvas();
                }
                
            }                       
        }
    },

    /*
    * Refresh control
    */
    onRefreshControl: function (args) {
        var self = this;

        self.executeCommand({ command: "refreshControl", guid: args.guid, canvas: args.canvas });
    },

    /*
    * Returns parent guid of element
    */
    onGetParentId: function (args) {
        var self = this;

        var element = self.controller.model.getElement(args.guid);
        return element.parent.guid;
    },

    /*
     * Sets the last inserted (from controls navigator) element's guid
     */
    onSetLastInsertedElement: function (args) {
        var self = this;
        self.controller.setLastInsertedElement(args);
    },

    /*
     * Returns the last inserted (from controls navigator) element's guid
     */
    onGetLastInsertedElement: function () {
        var self = this;
        return self.controller.getLastInsertedElement();
    },

    /*
     * Returns the icon related with the control
    */
    onGetControlIcon: function (args) {
        var self = this;

        var control = self.controller.model.getElement(args.id) || { style: 'bz-studio bz-layout-full_16x16_standard' }
        return control.style;

    }
});