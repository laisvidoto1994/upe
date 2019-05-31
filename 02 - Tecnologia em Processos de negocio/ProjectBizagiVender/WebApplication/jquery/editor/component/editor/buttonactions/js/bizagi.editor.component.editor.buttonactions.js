/*
@title: Editor buttonactions
@authors: Diego Parra
@date: 12-Jul-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.buttonactions", {

        /*
        *   Constructor
        */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);

            var nextWithoutValidations = (typeof bizagi.editor.flags.EnableNextWithoutValidations != "undefined") ? bizagi.util.parseBoolean(bizagi.editor.flags.EnableNextWithoutValidations) : false;

            if (nextWithoutValidations) {

                this.actions = {
                    "submitData": { tooltip: "formmodeler-component-editor-buttonactions-submitdata-tooltip", label: "formmodeler-component-editor-buttonactions-submitdata", value: false, show: true },
                    "refresh": { tooltip: "formmodeler-component-editor-buttonactions-refresh", label: "formmodeler-component-editor-buttonactions-refresh", value: false, show: false },
                    "validate": { tooltip: "formmodeler-component-editor-buttonactions-validate-tooltip", label: "formmodeler-component-editor-buttonactions-validate", value: false, show: true },
                    "next": { tooltip: "formmodeler-component-editor-buttonactions-next-tooltip", label: "formmodeler-component-editor-buttonactions-next", value: false, show: true },
                    "next without validations": { tooltip: "formmodeler-component-editor-buttonactions-next-without-validations-tooltip", label: "formmodeler-component-editor-buttonactions-next-without-validations", value: false, show: true },
                    "back": { tooltip: "formmodeler-component-editor-buttonactions-back", label: "formmodeler-component-editor-buttonactions-back", value: false, show: false }
                };  
            } else {
                this.actions = {
                    "submitData": { tooltip: "formmodeler-component-editor-buttonactions-submitdata-tooltip", label: "formmodeler-component-editor-buttonactions-submitdata", value: false, show: true },
                    "refresh": { tooltip: "formmodeler-component-editor-buttonactions-refresh", label: "formmodeler-component-editor-buttonactions-refresh", value: false, show: false },
                    "validate": { tooltip: "formmodeler-component-editor-buttonactions-validate-tooltip", label: "formmodeler-component-editor-buttonactions-validate", value: false, show: true },
                    "next": { tooltip: "formmodeler-component-editor-buttonactions-next-tooltip", label: "formmodeler-component-editor-buttonactions-next", value: false, show: true },                   
                    "back": { tooltip: "formmodeler-component-editor-buttonactions-back", label: "formmodeler-component-editor-buttonactions-back", value: false, show: false }
                };
            }
        },

        /*
        *   Render the current editor
        */
        renderEditor: function (container, data) {
            var self = this;

            // Merge actions with data
            self.originalValue = data.value;

            //Set initial values by validations rules
            data.value = self.executeInternalValidationRules(data.value, true);

            if (data.value) {
                $.each(data.value, function (i, action) {
                    if (self.actions[action] && self.actions[action].show) self.actions[action].value = true;
                });
            }

            var elEditor = $.tmpl(self.getTemplate("control"));

            //Append control to the container
            elEditor.appendTo(container);

            //Get actions in an array
            var actions = self.getComboValues();

            //Apply combo plugin
            self.createUIControls(elEditor, actions);

            //Add toolTips
            container.tooltip({ position: { my: "left+15 center", at: "right center" }, tooltipClass: 'ui-widget-content ui-propertybox-tooltip' });
        },
        /*
        *   Get values for combo plugin
        */
        getComboValues: function () {

            var self = this;
            var actions = [];

            // Extract only setted items, and return the names in an array
            $.each(self.actions, function (i, item) {

                if (item.show) {

                    if (item.value) {

                        actions.push({ tooltip: item.tooltip, icon: null, label: item.label, value: i, selected: "selected" });
                    } else {

                        actions.push({ tooltip: item.tooltip, icon: null, label: item.label, value: i });
                    }
                }
            });

            return actions;
        },
        /*
        *   Load editor templates
        */
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.buttonactions").concat("#buttonactions-frame")),
                this.loadTemplate("control", bizagi.getTemplate("bizagi.editor.component.editor.buttonactions").concat("#buttonactions-control"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        /*
        *
        * Handle change combo response
        */
        responseChangeCombo: function (elValue, event) {

            var self = this;
            var valueToTrigger = self.executeInternalValidationRules(elValue, false);

            // Trigger event
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.originalValue,
                newValue: valueToTrigger,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            });

            return true;
        },
        /*
        *   Perform internal rules to restrict actions selected
        */
        executeInternalValidationRules: function (data, init) {

            var self = this;
            var actions = [];

            if (init) {

                if ($.isArray(data) && data.indexOf("next") >= 0) {
                    actions.push(self.resolveAction("next", data));
                } else {
                    actions = data;
                }

            } else {

                switch (data) {

                    case "next": actions = ["next", "submitData", "validate"]; break;
                    case "next without validations": actions = ["next", "submitData"]; break;
                    case "submitData": actions = ["submitData", "refresh"]; break;
                    default: actions = [data]; break;
                }
            }

            return actions;

        },

        /*
        * Resolves action type
        */
        resolveAction: function (action, actions) {

            if (action == "next") {
                if (actions.indexOf("validate") >= 0)
                    return action;
                else
                    return "next without validations";
            }

            return action;
        },

        /*
        * Creates UI controls
        */
        createUIControls: function (elEditor, actions) {
            var self = this;
            /*
            uiControls.comboBox
            @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */

            self.myCombo = new self.uiControls.comboBox(
                {
                    uiEditor: self,
                    uiPlaceHolderText: " ---------- ",
                    uiContainer: $('.ui-control-editor', elEditor),
                    uiValues: actions,
                    uiInline: false,
                    onChange: function (elValue, event) {
                        self.responseChangeCombo(elValue, event, self);
                    }
                });
        }
    }
);