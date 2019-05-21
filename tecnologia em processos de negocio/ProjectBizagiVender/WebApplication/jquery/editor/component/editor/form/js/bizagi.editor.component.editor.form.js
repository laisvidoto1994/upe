/*
@title: Editor form
@authors: Rhony Pedraza
@date: 01-aug-12
*/
bizagi.editor.component.editor.formbase(
    "bizagi.editor.component.editor.form", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },

        ".form-button-caption click": function (el, event) {
            var self = this;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_BUTTON,
                value: self.inputValue,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });

            if ($(".form-button-dropdown", this.element).hasClass("form-open")) {
                $(".form-button-dropdown", this.element).removeClass("form-open");
            }
            if ($(".form-menu", this.element).hasClass("form-open")) {
                $(".form-menu", this.element).removeClass("form-open");
            }
            event.stopPropagation();

        },

        ".form-newform click": function (el, event) {
            var self = this, elBtn, elMenu;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_NEW,
                propertyName: self.model.name,
                context: "form",
                id: this.element.closest(".bizagi_editor_component_properties").data("id"),
                showForm: self.editorParameters.showForm
            });

            elBtn = $(".form-button-dropdown", this.element);
            elMenu = $(".form-menu", this.element);

            self.closeMenu(elBtn, elMenu);
            event.stopPropagation();
        },

        ".form-none click": function (el, event) {
            var self = this, elBtn, elMenu;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_NONE,
                propertyName: self.model.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });

            $(".form-button-dropdown", this.element).removeClass("form-open");

            elBtn = $(".form-button-dropdown", this.element);
            elMenu = $(".form-menu", this.element);

            self.closeMenu(elBtn, elMenu);
            event.stopPropagation();
        },

        ".form-submenu li.form-item-selectable click": function (el, event) {
            var self = this, data = el.data("info"), elBtn, elMenu, optionForm;

            optionForm = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_OPTION,
                propertyName: self.model.name,
                form: data.guid,
                value: self.inputValue,
                id: this.element.closest(".bizagi_editor_component_properties").data("id"),
                showForm: self.editorParameters.showForm
            };            

            this.controller.publish("propertyEditorChanged", optionForm);

            this.inputValue = {
                baref: {
                    ref: data.guid
                }
            };

            elBtn = $(".form-button-dropdown", this.element);
            elMenu = $(".form-menu", this.element);
            self.closeMenu(elBtn, elMenu);
            event.stopPropagation();
        }
    }
);