/*
@title: Editor filter expression
@authors: Alexander Mejia
@date: 09-Apr-13
*/

bizagi.editor.component.editor("bizagi.editor.component.editor.filterexpression",

    {
        defaultRule: {
            rule: {
                baref: {
                    ref: "expression"
                }
            }
        },


        defaultFilter: {
            bafilter: {
                filter: "filter"
            }
        }

    },

    {

        init: function (canvas, model, controller) {
            var self = this;
            self._super(canvas, model, controller);
        },

        /*
        * Render editor
        */
        renderEditor: function (container, data) {
            var self = this;
            self.properties = {};
            self.findSubproperties(data);
            self.inputValue = data.value;            
            var currentType = self.getCurrentType(data.value);
            var options = {
                caption: data.caption,
                currentType: currentType.replace(/\ /g,"&nbsp;")
            };

            $.extend(options, self.properties);
            
            var elEditor = $.tmpl(self.getTemplate("frame"), options);
            elEditor.appendTo(container);

        },

        /*
        * Checks if the currentType is rule
        */
        isRule: function () {
            var self = this;

            if (!self.inputValue) return false;

            return (self.inputValue["rule"]) ? true : false;

        },

        /*
        * Checks if the currentType is filter
        */
        isFilter: function () {
            var self = this;

            if (!self.inputValue) return false;

            return (self.inputValue["bafilter"]) ? true : false;
        },

        /*
        * Returns currentType
        */
        getCurrentType: function (value) {
            var self = this;
            var type = bizagi.localization.getResource("formmodeler-component-filterexpression-empty");

            if (self.isRule()) {                

                if (null != value.rule && value.rule.displayName) {
                    type = value.rule.displayName;                   
                } else {
                    type = bizagi.localization.getResource("formmodeler-component-filterexpression-rule");
                }
            }
            else if (self.isFilter())
                type = bizagi.localization.getResource("formmodeler-component-filterexpression-filter");

            return type;
        },


        /*
        * Finds subproperties for element
        */
        findSubproperties: function (data) {
            var self = this;

            if (data.subproperties && $.isArray(data.subproperties)) {
                for (var i = 0, l = data.subproperties.length; i < l; i++) {
                    var property = data.subproperties[i].property;
                    self.properties[property["bas-type"]] = true;
                }
            }
        },


        /*
        * Removes component
        */
        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        /*
        * Loads component templates
        */
        loadTemplates: function () {
            var self = this;

            var deferred = $.Deferred();

            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.filterexpression").concat("#filterexpression-frame"))
            ).done(function () {
                deferred.resolve();
            });

            return deferred.promise();
        },

        /*
        * Edit or create rule
        */
        editCreateRule: function () {
            var self = this;
            var rule = self.Class.defaultRule;

            if (self.isRule()) {
                rule = self.inputValue;
            }

            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EXPRESSION,
                type: self.options.name,
                data: rule,
                id: self.element.closest(".bizagi_editor_component_properties").data("id"),
                categorytype: "Scripting"
            };

            self.controller.publish("propertyEditorChanged", options);
        },

        /*
        * Edit or Create Filter
        */
        editCreateFilter: function () {
            var self = this;
            var filter = self.Class.defaultFilter;

            if (self.isFilter())
                filter = self.inputValue;

            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EDITOR_DATALIST,
                data: filter,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
        },

        /*
        * Removes current value
        */
        deleteValue: function () {
            var self = this;

            if (self.inputValue) {

                var options = {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                    newValue: undefined,
                    type: self.options.name,
                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                };

                self.controller.publish("propertyEditorChanged", options);
            }
        },

        //************************* EVENTS *****************************
        //**************************************************************


        "i.filterexpression-rule-external click": function () {
            var self = this;
            self.editCreateRule();
        },

        "i.filterexpression-filter-external click": function () {
            var self = this;
            self.editCreateFilter();
        },

        "i.filterexpression-delete-filter click": function () {
            var self = this;
            self.deleteValue();
        },

        "input.filterexpression-string-value click": function () {
            var self = this;

            if (self.inputValue) {
                if (self.isRule())
                    self.editCreateRule();
                else if (self.isFilter())
                    self.editCreateFilter();
            }
        }

    }
);