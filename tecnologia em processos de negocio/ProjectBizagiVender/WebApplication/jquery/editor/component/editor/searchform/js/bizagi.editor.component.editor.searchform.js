/*
@title: Editor form
@authors: Rhony Pedraza
@date: 17-aug-12
*/
bizagi.editor.component.editor.searchformbase(
    "bizagi.editor.component.editor.searchform", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        
        ".searchform-button-caption click": function (el, event) {
            var self = this;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_BUTTON,
                value: self.inputValue,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
            
            if ($(".searchform-button-dropdown", this.element).hasClass("searchform-open")) {
                $(".searchform-button-dropdown", this.element).removeClass("searchform-open");
            }
            if ($(".searchform-menu", this.element).hasClass("searchform-open")) {
                $(".searchform-menu", this.element).removeClass("searchform-open");
            }
            event.stopPropagation();

        },
        ".searchform-newform click": function (el, event) {
            var self = this;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_NEW,
                propertyName: self.model.name,
                context: "searchform",
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
            
            $(".searchform-button-dropdown", this.element).removeClass("searchform-open");
            $(".searchform-menu", this.element).removeClass("searchform-open");
            event.stopPropagation();
        },
        ".searchform-none click": function (el, event) {
            var self = this;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_NONE,
                propertyName: self.model.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
            
            $(".searchform-button-dropdown", this.element).removeClass("searchform-open");
            $(".searchform-menu", this.element).removeClass("searchform-open");
            event.stopPropagation();
        },
        ".searchform-submenu li.searchform-item-selectable click": function (el, event) {
            var self = this, data = el.data("info"), optionForm;
            
            optionForm = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_FORM_OPTION,
                propertyName: self.model.name,
                form: data.guid,
                value: self.inputValue,
                context: "searchform",
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            };
            this.controller.publish("propertyEditorChanged", optionForm);

            var elBtn = $(".searchform-button-dropdown", this.element);
            var elMenu = $(".searchform-menu", this.element);

            self.closeMenu(elBtn,elMenu);
            event.stopPropagation();
        }
    }
);