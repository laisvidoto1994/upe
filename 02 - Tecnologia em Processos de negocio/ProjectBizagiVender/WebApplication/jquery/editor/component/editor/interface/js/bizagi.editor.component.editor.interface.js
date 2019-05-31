/*
@title: Editor interface
@authors: Rhony Pedraza
@date: 30-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.interface", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var elEditor,name;
            
            if(data.value === undefined) {
                data.value = {
                        baref : {
                            ref : bizagi.localization.getResource("formmodeler-component-editor-interface-expression")
                        }
                };
            } else {
                if(data.value === null) {
                    data.value = {
                            baref : {
                                ref : bizagi.localization.getResource("formmodeler-component-editor-interface-expression")
                            }
                    };
                }
            }
            
            this.inputValue = data.value;

            name = data.name.replace(/\./gi, '-');
            data["title"] = bizagi.localization.getResource("formmodeler-component-editor-rule-validation-"+name);

            if(data["title"] === "formmodeler-component-editor-rule-validation-"+name){
                data["title"] = ""
            }
            
            if(data.value.baref.ref == bizagi.localization.getResource("formmodeler-component-editor-interface-expression")) {
                elEditor = $.tmpl(this.getTemplate("frame-empty"), data);
            } else {
                if(data.value.displayName !== undefined) {
                    if(data.value.displayName != "") {
                        $.extend(data, { nameRule : data.value.displayName });
                    } else {
                        $.extend(data, { nameRule : bizagi.localization.getResource("formmodeler-component-editor-interface-rule") });
                    }
                } else {
                    $.extend(data, { nameRule : bizagi.localization.getResource("formmodeler-component-editor-interface-rule") });
                }
                elEditor = $.tmpl(this.getTemplate("frame-rule"), data);
            }
            
            elEditor.appendTo(container);

            $('input.interface-rule-value[title]', elEditor).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-rule-editor-tooltip',
                                                            position: {
                                                                            my: "left top+10",
                                                                            at: "left bottom"
                                                                            
                                                                        }
                                                                    });
            $('.interface-rule-value > .defaultvalue-button-value[title]', elEditor).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-rule-editor-tooltip',
                                                            position: {
                                                                            my: "left top+10",
                                                                            at: "left bottom"                                                                            
                                                                        }
                                                                    });
        },
        remove : function() {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates : function() {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame-empty", bizagi.getTemplate("bizagi.editor.component.editor.interface").concat("#interface-frame-empty")),
                this.loadTemplate("frame-rule", bizagi.getTemplate("bizagi.editor.component.editor.interface").concat("#interface-frame-rule"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        createEditRule:function(el, event){
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_INTERFACE,
                oldValue: this.inputValue,
                data : this.options.value,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            };
            
            if(this.options.hasOwnProperty("exclusive")) {
                options = $.extend({}, options, { exclusive : this.options.exclusive });
            }
            // call external editor
            this.controller.publish("propertyEditorChanged", options);
        },
        
        ".interface-rule-value .interface-image-rule-delete click" : function(el, event) {
            var self = this;
            //var elEditor;
            //this.element.empty();
            var options;
            this.element.find(".interface-container").empty();
            this.options.value = {baref : {ref : bizagi.localization.getResource("formmodeler-component-editor-interface-expression")}};
            
            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue : this.inputValue,
                newValue : undefined,
                data : undefined,
                type : this.options.name,
                id : this.element.closest(".bizagi_editor_component_properties").data("id")
            };
            
            if(this.options.hasOwnProperty("exclusive")) {
                $.extend(options, { exclusive : this.options.exclusive });
            }
            
            this.controller.publish("propertyEditorChanged", options);
            
            this.renderEditor(this.element.find(".interface-container"), this.options);
            //elEditor = $.tmpl(this.getTemplate("frame-empty"), this.options);
            //elEditor.appendTo(this.element);
        },
        ".interface-rule-value .interface-image-rule-edit click" : function(el, event) {
            var self = this;
            self.createEditRule(el, event);
        },
        ".defaultvalue-button-value click":function(el, event){
            var self = this;
            self.createEditRule(el, event);
        },
        ".biz-ico.interface-image-external click" : function(el, event) {
            var self = this;
            self.createEditRule(el, event);
        }
    }
);