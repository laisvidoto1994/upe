
bizagi.editor.modelerView.extend("bizagi.editor.adhocModelerView", {}, {
   
    init: function (params) {
        var self = this;

        self.initializeForm(params);

        self.formModelerParams = params;               
        params = params || {};

        // Set current rendering mode
        self.renderingMode = "design";

        // Define current state of validation flag
        self.validateForm = false;

        // Call base
        bizagi.editor.view.prototype.init.apply(this, [params]);

        // Define of current tab selected
        self.currentTabIndex = 0;

        // Set current editor language
        bizagi.editorLanguage = { displayname: "default", IsRightToLeft: false, key: "default" };

        // If the modeler was created with some data, then load the model
        if (params.data) {
            // Wait until controller is ready
            $.when(self.load(params.data), this.controller.ready())
                .done(function () {
                    // Process view layout
                    self.processLayout(params);
                });

        } else {
            // Wait until controller is ready
            $.when(this.controller.ready())
                .done(function () {
                    // Process view layout
                    self.processLayout(params);
               });
        }

        //If the model has the property Autogenerate then
        if (params.autoGenerate) {
            self.autoGenerate();
        }

        self.setOriginalModel();

        self.applyCustomOverrides();
    },

    configureLeftPane: function () {
        var self = this;
        // Show tabs            
        $.when(
            self.drawControlsNavigator(),
            self.drawXpathNavigator(),
            self.drawLayoutNavigator(),
            self.drawBanner()
        ).done(function () {
            // Adds tab plugin
            self.mainContainer.find("#left-panel").tabs({
                beforeActivate: function (event, ui) {
                    var renderingMode = $('a', ui.newTab).data("rendering-mode");
                    // Hide properties
                    self.hidePropertyBox();

                    // Check if a render view refresh needs to be performed
                    if (self.needsRedrawAfterTabChange(ui.newTab.index())) {
                        self.currentSelectedElement = null;
                        self.controller.removeSelectedElement();
                        self.renderingMode = renderingMode;
                        self.render(renderingMode);
                    }
                    // Save current tab index
                    self.currentTabIndex = ui.newTab.index();
                    self.setBannerVisibility(ui);
                }
            });
            self.setBannerVisibility();
        });
    },

    /*
    *   Configure html page, in order to add attributes and classes
    */
    configureHtmlPage: function (params) {
        var self = this;
        // Add top classes
        var canvas = self.adhocCanvas = params.canvas;
        canvas.addClass("biz-work-area");
        //canvas.addClass("biz-font").addClass("biz-normal-font").addClass("biz-text-color");
        $('body').attr('oncontextmenu', "return false");
    },

    /*
      *   Draw the property box in the layout
      */
    drawPropertyBox: function (params) {
        var self = this;

        // Hide property box if there is another instance already
        if (self.propertyBox) self.hidePropertyBox();

        self.redrawPropertyBox = (params.redraw) ? params.redraw : false;

        if (self.formModelerParams) {
            self.propertyBox = new bizagi.editor.component.properties.presenter({
                adhocProcessId: self.formModelerParams.adhocProcessId
            });
        } else {
            self.propertyBox = new bizagi.editor.component.properties.presenter();
        }
        self.propertyBox.subscribe("propertyChanged", function (event, args) { return self.onPropertiesChanged(args); });
        self.propertyBox.subscribe("getRenderElement", function (event, args) { return self.onGetRenderElement(args); });

        self.propertyBox.subscribe("destroy", function (event, args) { self.hidePropertyBox(args); });

        // For editor validations
        self.editorValidations = {};

        self.guid = params.guid || self.currentSelectedElement;
        self.formProperties = (params && params.formProperties) ? true : false;

        self.refreshPropertyBox();

    },

    /*
    *   Locate the given xpath in the navigator.
    */
    showElementXpath: function (xpath) {
                
    },

    saveForm: function () {
        var self = this;
        var defer = $.Deferred();

        var renderArea = $("#container-layout");
        $.when(self.executeCommand({ command: "saveModel" })).done(function (jsonForm) {
            var model = { message: bizagi.localization.getResource("formmodeler-component-wait-message-save") };
            var presenter = new bizagi.editor.component.wait.presenter({ model: model, renderArea: renderArea });

            $.when(presenter.render())
            .done(function () {
                var saveFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol: "saveform",
                    jsonForm: jsonForm,
                    adhocTaskId: self.formModelerParams.adhocTaskId,
                    adhocProcessId: self.formModelerParams.adhocProcessId,
                    isAdhocSummaryForm: self.formModelerParams.isAdhocSummaryForm ? true : false
                });

                setTimeout(function () {
                    $.when(saveFormProtocol.processRequest())
                        .done(function () {
                            self.controller.setNewForm(false);
                            self.refreshRibbon();
                            self.refreshPropertyBox();
                            presenter.destroy();
                            defer.resolve();
                        });
                }, 200);

            });
        });
        return defer.promise();
    },

    /*
    *   Loads a persistence model
    */
    load: function (dataModel) {
        var self = this;
        // Wait until controller is ready
        return $.when(this.controller.ready())
                .done(function () {
                    self.executeCommand({ command: "loadModel", dataModel: dataModel, canUndo: false, refresh: true });
                });
    },

    applyCustomOverrides: function () {

        // OVERRIDE ALLOWDECIMALS PROPERTY COMMAND
        bizagi.editor.component.properties.commands.allowdecimals.prototype.execute = function () {

        };
        bizagi.editor.component.properties.commands.numberrange.prototype.execute = function () {
            var self = this;
            self.properties.allowdecimals = true;
            self.indexedProperty.notShow = false;
        };
        bizagi.editor.component.properties.commands.thousands.prototype.execute = function () {

        };
        bizagi.editor.component.properties.commands.defaultvalue.prototype.execute = function () {
            var self = this;
            self.indexedProperty.notShow = false;
        };
        bizagi.editor.component.properties.commands.data.displayattrib.prototype.execute = function () {
            var self = this;
            if (self.element.properties.data.datasource && self.element.properties.data.datasource.type === "bizagi") {
                self.indexedProperty.show = true;
            } else {
                if (self.element.properties.data.datasource && self.element.properties.data.datasource.type === "adhoc")
                    self.element.properties.data.displayattrib = undefined;
                self.indexedProperty.show = false;
            }
        }
    },

    changeXpathPropertyForElement: function (id, property, xpathData) {
        var self = this;

        // Exists in map
        if (self.editorValidations[id] !== undefined) {
            var valid = self.validateXpathChange(id, property, xpathData);
            if (!valid) return;
        }

        var value = "";
        if (xpathData.data.entityContext == "adhoc") {
            value = xpathData.guid;
        }
        else //entityContext = Bizagi
        {
            value = bizagi.editor.utilities.buildComplexXpath(xpathData.xpath, xpathData.contextScope, xpathData.isScopeAttribute, xpathData.guidRelatedEntity);
        }

        // Perform property change            
        var command = {
            command: "changeProperty",
            guid: id,
            property: property,
            value: value,
            refreshProperties: true,
            removeDefaultDisplayName: true,
            renderTypeProperty: xpathData.nodeSubtype,
            validateForm: self.validateForm
        };

        // Add exclusive "validation" to the command ???
        if (self.editorValidations[id] && self.editorValidations[id].exclusive !== undefined) {
            command = $.extend({}, command, { exclusive: self.editorValidations[id].exclusive });
        }

        // Executes the command
        self.executeCommand(command);
    },

    initializeForm: function (params) {
        if (!params.data) {
            params.data = { properties: { displayName: "AdhocForm_" + Math.guid() } };
        }
    },

    refreshXpathNavigator: function (params) {
        var self = this;
        if (self.controller.isGridContext()) {
            // Fetch the model
            $.when(self.executeCommand({ command: "getAdhocXpathNavigatorModel" }))
            .done(function (model) {
                self.controller.setXpathNavigatorModelGrid(model);
                var options = {
                    model: (params && params.model) || model,
                    context: params ? params.context : undefined,
                    scope: self.controller.getContext(),
                    isReadOnly: self.controller.isReadOnlyForm()
                };
                self.xpathNavigator.render(options);
            });            
        } else {
            //bizagi.editor.modelerView.prototype.refreshXpathNavigator.apply(this, params);
            self._super(params);
        }
    }
});
    
