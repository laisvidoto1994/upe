/*
@title: select template
@authors: Andrés Fernando Muñoz
@date: 2015-19-02
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.selecttemplate", {
        types: {
            NONE: 'none',
            DEFAULT: 'default',
            TEMPLATE: 'template'
        }
    }, {

        init: function (canvas, model, controller) {
            var self = this;

            self._super(canvas, model, controller);
        },

        /**
        * Process the editor
        */
        renderEditor: function (container, data) {
            var self = this,
                elEditor,
                elDefault,
                elNone,
                editorParameters = self.editorParameters = data["editor-parameters"] || {};

            $.when(editorParameters.templates)
                .done(function (templatesList) {
                    var templates = self.templates = templatesList || [];

                    self.value = data.value;
                    data.selectedValue = self.getSelectedValue(data.value);

                    elEditor = $.tmpl(self.getTemplate("frame"), $.extend(data, { templates: templates }));

                    var options = $.tmpl(self.getTemplate("options"), { disableNoneOption: bizagi.util.parseBoolean(editorParameters.disableNoneOption) });
                    elEditor.find(".selecttemplate-menu").prepend(options);

                    elEditor.appendTo(container);
                });

        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        /**
         * Get the localized value related to value selected
         * @param value
         */
        getSelectedValue: function(value){
            var self = this,
                result = {};

            if (!value) {
                var templatetype = self.editorParameters.templatetype || '';
                templatetype = templatetype.toUpperCase();

                if (self.Class.types[templatetype]) {
                    result.displayName = bizagi.localization.getResource('formmodeler-component-editor-selecttemplate-' + self.Class.types[templatetype]);
                }

                return result;
            }

            if (self.templates.length == 0) {
                return result;
            }

            var guid = bizagi.editor.utilities.resolveComplexReference(value);

            for (var i = 0, l = self.templates.length; i < l; i++) {
                var template = self.templates[i];

                if (template.guid == guid) {
                    result = template;
                    break;
                }
            }

            return result;            
        },
        /**
        * Load the templates
        */
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.selecttemplate").concat("#selecttemplate-frame")),
                this.loadTemplate("options", bizagi.getTemplate("bizagi.editor.component.editor.selecttemplate").concat("#selecttemplate-options")),
                this.loadTemplate("default", bizagi.getTemplate("bizagi.editor.component.editor.selecttemplate").concat("#selecttemplate-default"))                


            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        /**
        * Returns the parameters defined in the editor
        */
        getEditorParameters: function (data) {
            return data["editor-parameters"] || {};
        },

        /**
         * Close the editor menu
         * @param el
         * @param menu
         */
        closeMenu: function(el,menu){
            var self = this;
            menu.slideUp(function(){
                $(this).removeClass("selecttemplate-open");
            });
            el.removeClass("selecttemplate-open");
        },

        /*
        * Returns true if the item selected is the same that the current value
        */
        isSameItem: function (guid) {
            var self = this;

            if (self.value) {
                return bizagi.editor.utilities.resolveComplexReference(self.value) == guid;
            }

            return false;
        },

        /**
         * Open the editor menu
         * @param el
         * @param menu
         */
        openMenu:function(el,menu){
            var self = this;
            $(document).bind("mouseup.selecttemplate", function (e) {

                if(e.which == 1){
                    var dropDownMenu = self.element;

                    if (dropDownMenu.has(e.target).length === 0) {
                        self.closeMenu(el,menu);
                        $(document).unbind("mouseup.selecttemplate");
                    }
                }
            });

            menu.slideDown(function(){
                $(this).addClass("selecttemplate-open");
            });
            el.addClass("selecttemplate-open");
        },

        /*
         * Set type, is necessary to manager correctly the state 
        */
        setTemplatetype: function (type) {
            var self = this;
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                newValue: type,
                type: 'templatetype',
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            });
        },

        /**
         * Handler for opition none
         * @param el
         * @param event
         */
        ".selecttemplate-none click": function (el, event) {
            var self = this;

            self.setTemplatetype(self.Class.types.NONE);

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_TEMPLATE_NONE,
                propertyName: self.model.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });

            $(".selecttemplate-button-dropdown", this.element).removeClass("selecttemplate-open");
            $(".selecttemplate-menu", this.element).removeClass("selecttemplate-open");
            event.stopPropagation();
        },
        /**
         * Handler for option default
         * @param el
         * @param event
         */
        ".selecttemplate-default click": function (el, event) {
            var self = this;

            self.setTemplatetype(self.Class.types.DEFAULT);

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_NONE,
                propertyName: self.model.name,               
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });

            $(".selecttemplate-button-container selecttemplate-button-caption").text(bizagi.localization.getResource("formmodeler-component-editor-selecttemplate-default"));

            $(".selecttemplate-button-dropdown", this.element).removeClass("selecttemplate-open");
            $(".selecttemplate-menu", this.element).removeClass("selecttemplate-open");
            event.stopPropagation();
        },
        /**
         * Handler for button drop down
         * @param el
         * @param event
         */
        ".selecttemplate-button-dropdown click": function (el, event) {
            var self = this, menu = $(".selecttemplate-menu", this.element);
            if (el.hasClass("selecttemplate-open")) {

                self.closeMenu(el,menu);
            } else {

                self.openMenu(el,menu);
            }
            event.stopPropagation();
        },

        /**
        * Handler for a template item
        * @param el
        * @param event
        */
        ".selecttemplate-item click": function ($el, event) {
            var self = this,
                guid = $el.data('guid');

            if (!self.isSameItem(guid)) {

                self.setTemplatetype(self.Class.types.TEMPLATE);

                self.controller.publish("propertyEditorChanged", {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                    newValue: bizagi.editor.utilities.buildComplexReference(guid),
                    type: self.options.name,
                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                });
            }
        },

        ".selecttemplate-button-caption click": function ($el, event) {
            var self = this;

            if (self.value) {
                self.controller.publish("propertyEditorChanged", {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_BUTTON,
                    value: self.value,
                    id: this.element.closest(".bizagi_editor_component_properties").data("id")
                });
            }
        },

        '.selecttemplate-newtemplate click': function($el, event) {
            var self = this;
            
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_WIZARD_TEMPLATES,
                propertyName: self.model.name,
                context: "template",
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });            
        }
    }
);