/*
@title: Editor Rendertype Component
@authors: Rhony Pedraza
@date: 09-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.rendertype", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self = this,
            elEditor;
            self.clicks = 0;
            self.inputValue = self.options.value;
            elEditor = $.tmpl(this.getTemplate("frame"), data);
            $.each(data.data, function(i, value) {
                self.renderOptions(elEditor.find("select"), value);
            });
            elEditor.appendTo(container);
        },
        renderOptions : function(container, value) {
            var selected = "";
            if(value.hasOwnProperty("selected") & value.selected == true) {
                selected = " selected=selected";
            }
            $.extend(value, { selected : selected });
            var elOption = $.tmpl(this.getTemplate("option"), value);
            elOption.appendTo(container);
        },
        remove : function() {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates : function() {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.rendertype").concat("#rendertype-frame")),
                this.loadTemplate("option", bizagi.getTemplate("bizagi.editor.component.editor.rendertype").concat("#rendertype-option"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        "span focus" : function(el, event) {
            el.removeClass("editor-text-rendertype-enabled").addClass("editor-text-rendertype-disabled");
            el.next().removeClass("editor-options-disabled").addClass("editor-options-enabled").focus();
        },
        "select blur" : function(el, event) {
            el.removeClass("editor-options-enabled").addClass("editor-options-disabled");
            el.prev().removeClass("editor-text-rendertype-disabled").addClass("editor-text-rendertype-enabled");
        },
        "label click" : function(el, event) {
            var self = this;
            self.clicks++;
            if(self.clicks == 1) {
                setTimeout(function() {
                    if(self.clicks == 1) {
                        el.next().focus();
                    }
                    self.clicks = 0;
                }, 200);
            }
        },
        "label dblclick" : function(el, event) {
            var select = el.closest(".bizagi_editor_component_editor_rendertype").find("select"),
            numOptions = select.children().length,
            option = select.find("option:selected"),
            value;
            if((numOptions-1) == select.find("option").index(option)) {
                select.find("option:first").attr("selected", "selected");
                value = select.find("option:first").text();
                el.next().text(value);
                this.controller.publish("propertyEditorChanged", { typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValue, newValue : value, type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
                this.inputValue = value;
            } else {
                option.next().attr("selected", "selected");
                value = option.next().text();
                el.next().text(value);
                this.controller.publish("propertyEditorChanged", { typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValue, newValue : value, type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
                this.inputValue = value;
            }
        },
        "select change" : function(el, event) {
            el.prev().text(el.find("option:selected").text());
            this.controller.publish("propertyEditorChanged", { typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValue, newValue : el.val(), type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
            this.inputValue = el.val();
        }
    }
);