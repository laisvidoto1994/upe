/*
*   Name: Bizagi editor build ribbon model
*   Author: Alexander Mejia / Jair Tellez
*   Comments:
*   -   This command retrieves the properties of node from an xpath
*
*   Arguments
*   -   guid
*/
bizagi.editor.notUndoableCommand.extend("bizagi.editor.getRibbonModelCommand", {    
}, {

    /*
    *   Fetchs the properties of node in xpath model
    *   Returns a deferred in "args.result" because properties node xpath could be asyncronous
    */
    execute: function () {
        var self = this,
            args = self.arguments;

        var ribbonModel = self.controller.getRibbonModel();
        var element = self.model.getElement(args.guid);
        var convertToModel = args.convertToModel;

        // Reset ribbon model
        ribbonModel.reset();

        // Get ribbon properties for element
        if (element) {
            // Enable element properties in ribbon
            var ribbonProperties = element.getRibbonProperties();
            for (var i = 0; i < ribbonProperties.length; i++) {
                ribbonModel.enableProperty(ribbonProperties[i], element.resolveProperty(ribbonProperties[i]));
            }

            // for copy format
            ribbonModel.enableAction("copy-format");

            // for convert to
            if (convertToModel.length > 0) {
                ribbonModel.enableAction("convertto");
                self.appendConvertToModel(ribbonModel, convertToModel);
            }

            // Enable rename/delete
            ribbonModel.enableAction("rename");
            if (element.type === "nestedform" || element.type === "grid") {
                ribbonModel.disableAction("rename");
            }
            ribbonModel.enableAction("delete");

            if (!self.isControlEditable(element)) {
                ribbonModel.disableProperty("editable");
            }
        } else {
            // disabled convert to
            ribbonModel.disableAction("convertto");
            self.appendConvertToModel(ribbonModel, []);
        }

        // Enable disable undo
        if (self.controller.hasUndo()) {
            ribbonModel.enableAction("undo");
        } else {
            ribbonModel.disableAction("undo");
        }

        ribbonModel.enableAction("checkout");

        //Enable disable checkout
        if (self.controller.isReadOnlyForm()) {
            ribbonModel.enableAction("checkout");
        } else {
            ribbonModel.disableAction("checkout");
        }

        // Enable disable save
        if (self.controller.thereAreChangesInForm()) {
            ribbonModel.enableAction("save");
        } else {
            ribbonModel.disableAction("save");
        }

        // Enable disable redo
        if (self.controller.hasRedo()) { ribbonModel.enableAction("redo"); }
        else { ribbonModel.disableAction("redo"); }

        // Enable disable copy from
        if (self.controller.isReadOnlyForm()) {
            ribbonModel.enableAction("actionsvalidations");
        }
        else if (self.controller.isFormContext()) {
            ribbonModel.enableAction("copy-from");
            ribbonModel.enableAction("actionsvalidations");
            ribbonModel.enableAction("useCustomButtons");

            // Check / Uncheck use custom buttons
            var useCustomButtons = self.controller.getModel().getProperty("usecustombuttons");
            if (useCustomButtons) {
                ribbonModel.checkAction("useCustomButtons");
                ribbonModel.showGroup("email");
            }
            else ribbonModel.uncheckAction("useCustomButtons");
	    
	    // Check / Uncheck use email options
            var useEmailOptions = self.controller.getModel().getProperty("useemailoption");
            if (useEmailOptions) {
                ribbonModel.checkAction("enableEmail");
                ribbonModel.enableAction("emailTemplate");
            }
            else {
                ribbonModel.uncheckAction("enableEmail");
                ribbonModel.disableAction("emailTemplate");
            }
        }
        else if (self.controller.isOfflineFormContext()) {
            ribbonModel.enableAction("actionsvalidations");
            ribbonModel.showGroup("initForm");
            
            ribbonModel.enableAction("offlineAsOnline");

            if (self.controller.isOfflineAsOnline()) {
                ribbonModel.checkAction("offlineAsOnline");
            } else {
                ribbonModel.uncheckAction("offlineAsOnline");
            }

        }
        else if (self.controller.isQueryFormContext()) {
            ribbonModel.enableAction("actionsvalidations");
        }
        else if (self.controller.isStartFormContext()) {
            ribbonModel.enableAction("actionsvalidations");
            ribbonModel.enableAction("copy-from");

            if (bizagi.editor.flags["UseOfflineForms"]) {

                if (self.controller.hasOfflineForm()) {
                    ribbonModel.enableAction("offlineAsOnline");
                }
                else {
                    ribbonModel.disableAction("offlineAsOnline");
                }

                //show / hide the offline panel
                var enableOfflinePanel = self.controller.getModel().getProperty("useofflineform");
                if (enableOfflinePanel) {
                    ribbonModel.checkAction("useOfflineForm");
                    ribbonModel.showGroup("initForm");
                }
                else {
                    ribbonModel.hideGroup("initForm");
                    ribbonModel.uncheckAction("useOfflineForm");
                }

                if (self.controller.isOfflineAsOnline()) {
                    ribbonModel.checkAction("offlineAsOnline");
                } else {
                    ribbonModel.uncheckAction("offlineAsOnline");
                }
            }

        }

        // Check uncheck action
        if (args.validFormChecked) {
            ribbonModel.checkAction("validate");
        }
        else { ribbonModel.uncheckAction("validate"); }


        if (!self.controller.isReadOnlyForm()) {
            // Enable form properties, when the form isn't read-only
            ribbonModel.enableAction("formproperties");
            ribbonModel.enableProperty("language", bizagi.editorLanguage);
            ribbonModel.setCaption("language", bizagi.editorLanguage.key);
        } else {
            ribbonModel.disableProperty("language");
            ribbonModel.disableAction("validate");
        }


        // Prepare result
        args.result = ribbonModel;
        return true;
    },

    /*
    *
    */
    appendConvertToModel: function (ribbonModel, convertToModel) {
        var self = this;
        var model = ribbonModel.getElementByAction("convertto");

        if (!model) { return; }

        model.elements = [];

        for (var i = 0; i < convertToModel.length; i++) {
            model.elements.push({
                caption: convertToModel[i].caption,
                action: "convert",
                style: convertToModel[i].controlName,
                property: convertToModel[i].controlName,
                css:  convertToModel[i].style
            });
        }

        ribbonModel.processElementsForConvertTo(model.elements);
    },

    isControlEditable: function (control) {
        return control.properties.editable != undefined;
    }
});