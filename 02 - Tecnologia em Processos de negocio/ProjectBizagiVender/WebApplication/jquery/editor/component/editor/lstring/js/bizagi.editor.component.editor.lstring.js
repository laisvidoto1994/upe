/*
@title: lstring Editor (temporal)
@authors: Rhony Pedraza
@date: 8-mar-12
*/
$.Controller(
    "bizagi.editor.component.editor.lstring", {
        init : function(canvas, model, controller) {
            this.canvas = canvas;
            this.model = model;
            this.controller = controller;
        },
        render : function() {
            //var label = $("<label></label>").text(this.options.displayName).addClass("prop-property-label");
            var label = $("<label></label>").html(this.options.caption);
            //var input = $("<input />").attr("type", "text").val(this.options.value).addClass("prop-property-value");
            var input = $("<input />").attr("type", "text").val((this.options.hasOwnProperty("value")) ? this.options.value : this.options["default"]);
            input.addClass('ui-control-input').css('width', '95%');
            this.inputVal = this.options.value;
            label.appendTo(this.element);
            input.appendTo(this.element);
        },
        "input keydown" : function(el, event) {
            event.stopPropagation();
            if(event.keyCode == 13) {
                if(this.inputVal != el.val()) {
                    this.controller.publish("propertyEditorChanged", { typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputVal, newValue : el.val(), type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id")});
                    this.inputVal = el.val();
                }
                
            }
        }
    }
);