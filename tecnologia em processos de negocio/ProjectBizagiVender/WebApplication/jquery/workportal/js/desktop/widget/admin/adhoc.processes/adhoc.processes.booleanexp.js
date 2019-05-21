bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.adhoc.booleanexp", {}, {

    init: function (workportalFacade, dataService, params) {

        var self = this;

        self.booleanExp = params.data && params.data.booleanExp ? params.data.booleanExp : { evaluationType: "ALL", conditions: [] };
        if (!self.booleanExp.conditions) self.booleanExp.conditions = [];
        self.adhocProcessId = params.data && params.data.adhocProcessId ? params.data.adhocProcessId : null;

        self.operList = [
            { label: "is equal to", value: "==" },
            { label: "is different to", value: "!=" },
            { label: "is greater than or equal to", value: ">=" },
            { label: "is greater than", value: ">" },
            { label: "is less than or equal to", value: "<=" },
            { label: "is less than", value: "<" }
        ];

        self.propertyTypeList = [
            { label: "TEXT", value: "adhoctext" },
            { label: "NUMBER", value: "adhocnumber" },
            { label: "BOOLEAN", value: "adhocboolean" },
            { label: "DATE", value: "adhocdate" },
            { label: "MONEY", value: "adhocmoney" }
        ];

        self.notifier = bizagi.injector.get("notifier");

        // Call base
        self._super(workportalFacade, dataService, params);

        // Load Templates
        self.loadTemplates({
            "adhoc.processes.boolean.exp.editor.popup": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#adhoc-process-boolean-expression-template"),
            useNewEngine: false
        });
    },

    /*
	 *   Returns the widget name
	 */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_BOOLEAN_EXP;
    },

    /*
	 *   Renders the content for the current controller
	 */
    renderContent: function () {
        var self = this;
        var tmpl = self.getTemplate("adhoc.processes.boolean.exp.editor.popup");
        var content = self.content = $.tmpl(tmpl);
        return content;
    },

    postRender: function () {
        var self = this;
        var content = self.getContent();                
        var evaluationType = $("#conditionType", content);
        self.conditionGrid = $("#conditionContainer", content);
        
        evaluationType.on("change", function () {
            var selectedValue = $(this).val();
            if (selectedValue == "ALL") {
                $(".condition-type-text", content).text(bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-option-all-label"));
            } else {
                $(".condition-type-text", content).text(bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-option-any-label"));
            }
            self.booleanExp.evaluationType = selectedValue;
        });
        
        var evalType = self.booleanExp.evaluationType;
        $("option[value=" + evalType + "]", evaluationType).attr('selected', 'selected');
        $(".condition-type-text", content).text(bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-option-" + evalType.toLowerCase() + "-label"));

        $.when(self.getAdhocDataSchema()).done(function (data) {
            self.buildSuggestField(self.conditionGrid, data);
            self.conditionGrid.jsGrid({
                width: "100%",
                height: "300px",
                inserting: true,
                editing: true,
                sorting: false,
                paging: false,
                deleteConfirm: bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-delete-confirmation"),
                autoload: true,

                controller: {
                    loadData: function (filter) {
                        return self.booleanExp.conditions;
                    }
                },

                fields: [
                    {
                        name: "property",
                        title: bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-col-prop"),
                        type: "suggest",
                        width: 150,
                        validate: "required",
                        editing: false
                    },
                    {
                        name: "propertyType",
                        title: bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-col-type"),
                        type: "select",
                        validate: "required",
                        editing: false,
                        items: self.propertyTypeList,
                        valueField: "value",
                        textField: "label",
                    },
                    {
                        name: "oper",
                        title: bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-col-oper"),
                        type: "select",
                        items: self.operList,
                        valueField: "value",
                        textField: "label",
                        validate: "required"
                    },
                    {
                        name: "value",
                        title: bizagi.localization.getResource("workportal-adhoc-processes-boolean-exps-col-value"),
                        type: "text",
                        width: 150,
                        validate: "required"
                    },
                    { type: "control" }
                ]
            });
        });
    },

    buildSuggestField: function (conditionGrid, data) {
        var self = this;
        if (jsGrid.fields["suggest"]) return;
        var suggestField = function SuggestField(config) {
            jsGrid.Field.call(this, config);
        }

        suggestField.prototype = new jsGrid.Field({

            insertTemplate: function (value) {
                var element = $("<input>");
                self.initializeAdhocXpathAutoComplete(element, data);
                return this._insertAutoComplete = element;
            },

            editTemplate: function (value) {
                var allowEdit = conditionGrid.jsGrid("fieldOption", "property", "editing");
                if (allowEdit) {
                    var element = $("<input>");
                    if (value) {
                        var selectedInstance = data.filter(function (instance) {
                            return instance.value.key === value.key;
                        })[0];
                        element.val(selectedInstance ? selectedInstance.label : "");
                    }
                    self.initializeAdhocXpathAutoComplete(element, data);
                    return this._editAutoComplete = element;
                }
                return value;
            },

            insertValue: function () {
                return this._insertAutoComplete.val();
            },

            editValue: function () {
                return this._editAutoComplete.val();
            }
        });

        jsGrid.fields["suggest"] = suggestField;
    },

    initializeAdhocXpathAutoComplete: function (element, data) {
        var self = this;
        element.autocomplete({
            minLength: 2,
            source: data,
            select: function (event, ui) {
                var name = ui.item.label;
                element.val(ui.item.value);
                $(this).parent(".jsgrid-cell").next().find("select").val(ui.item.type);
                $(this).parent(".jsgrid-cell").next().find("select").attr("disabled", "disabled");
                return false;
            },
            focus: function () {
                return false;
            },
            change: function (event, ui) {
                if (ui.item === null) {
                    element.val(event.currentTarget.value);
                    $(this).parent(".jsgrid-cell").next().find("select").removeAttr("disabled");
                    $(this).parent(".jsgrid-cell").next().find("select").val("adhoctext");
                }
                return false;
            }
        });
    },

    getAdhocDataSchema: function () {
        var self = this;
        var def = new $.Deferred();

        $.when(self.dataService.getAdhocDataSchema(self.adhocProcessId)).done(function (data) {
            var json = $.parseJSON(data);
            var values = [];
            if (json.properties) {
                $.each(json.properties, function (key, val) {
                    values.push({ label: val.name, value: val.name, type: val.type });
                });
            }
            def.resolve(values);
        });

        return def.promise();
    },

    dispose: function () {
        var self = this;
        self.conditionGrid.jsGrid("destroy");
        jsGrid.fields["suggest"] = undefined;
    }

});