/*
@title: Editor datalist
@authors: Rhony Pedraza
@date: 03-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.datalist", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self= this, elEditor, i, subpropertiesLength = data.subproperties.length;
            
            elEditor = $.tmpl(this.getTemplate("frame"), data);
            
            // subproperties
            self.inputValues = {};
            for(i=0; i<subpropertiesLength; i++) {
                self.inputValues[data.subproperties[i].property.name] = data.subproperties[i].property.value;
                if(data.subproperties[i].property["bas-type"] == "filter" || data.subproperties[i].property["bas-type"] == "xpath-from-entity" || data.subproperties[i].property["bas-type"] == "xpathfromentity") {
                    this.renderExternal(elEditor.find(".datalist-group"), data.subproperties[i].property);
                } else {
                    self.renderSubproperty(elEditor.find(".datalist-group"), data.subproperties[i].property);
                }
            }
            
            elEditor.appendTo(container);
            self.setAsCollapsible(elEditor);
        },
        renderExternal : function(container, dataProperty) {
            var elExternal, property;
            if(dataProperty["user-editable"] == "true") {
                elExternal = $.tmpl(this.getTemplate("external"), {});
                dataProperty["bas-type"] = this.machineName(dataProperty["bas-type"]);

                if(bizagi.editor.component.editor[dataProperty["bas-type"]] === undefined) {
                    if(/^.*xpath.*$/ig.test(dataProperty["bas-type"])) {
                        property = new bizagi.editor.component.editor.xpath(elExternal, dataProperty, this.controller);
                    } else {
                        property = new bizagi.editor.component.editor.lstring(elExternal, dataProperty, this.controller);
                    }

                } else {
                    var fn = eval("var bafn = function(elExternal, dataProperty, controller) { " +
                            " return new bizagi.editor.component.editor." + dataProperty["bas-type"] + "(elExternal, dataProperty, controller);" +
                      "};bafn");
                    property = fn(elExternal, dataProperty, this.controller);
                }

                elExternal.appendTo(container);
                property.render();
            }
        },
        machineName : function(string) {
            return string.toLowerCase().replace(/-/g, "");
        },
        setAsCollapsible:function(collapsibleObj){
            var content = $('.ui-content',collapsibleObj);
            $('h3',collapsibleObj).bind('click',function(){
                content.slideToggle();
            });
        },
        renderSubproperty : function(container, property) {
            var elSubproperty, lblRequired;
            if(property["user-editable"] == "true") {
                elSubproperty = $.tmpl(this.getTemplate("subproperty"), property);
                elSubproperty.appendTo(container);

                lblRequired = $('label',elSubproperty);
                self.addRequired(lblRequired);
            }
        },
        remove : function() {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates : function() {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.datalist").concat("#datalist-frame")),
                this.loadTemplate("subproperty", bizagi.getTemplate("bizagi.editor.component.editor.datalist").concat("#datalist-subproperty")),
                this.loadTemplate("external", bizagi.getTemplate("bizagi.editor.component.editor.datalist").concat("#datalist-frame-external"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        
        ".datalist-group .datalist-subproperty-value keydown" : function(el, event) {
            event.stopPropagation();
            if(event.keyCode == 13) {
                this.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValues[el.data("name")], newValue : el.val(), data : el.val(), type : el.data("name"), id : this.element.closest(".bizagi_editor_component_properties").data("id")});
                this.inputValues[el.data("name")] = el.val();
            }
        },
        ".datalist-group .datalist-subproperty-external click" : function(el, event) {
            // call external editor
            this.controller.publish("propertyEditorChanged",
                {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EDITOR_DATALIST,
                    oldValue: this.inputValues[el.parent().find(".datalist-subproperty-value").data("name")],
                    type: el.parent().find(".datalist-subproperty-value").data("name"),
                    id: this.element.closest(".bizagi_editor_component_properties").data("id")
                }
            );
        }
    }
);