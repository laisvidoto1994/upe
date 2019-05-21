/*
@title: Editor filter
@authors: Rhony Pedraza
@date: 27-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.filter", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var elEditor, lblRequired, self = this;
            
            
            if(!data.value) {
                data.value = { bafilter : { filter : "" }};
            } else {
                if(!data.value.hasOwnProperty("bafilter")) {
                    data.value = { bafilter : { filter : bizagi.localization.getResource('formmodeler-component-editor-all-metadata-error'), contextentity: "", scopedefinition : "" }};
                }
            }
            
            self.inputValue = data.value;
            
            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);
            
            if(data.value.bafilter.filter == "") {
                data.value.bafilter.filter = "filter";
            }

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);
        },
        remove : function() {
            var self = this;
            self.element.hide();
            self.element.empty();
        },
        loadTemplates : function() {
            var self = this;
            var deferred = $.Deferred();
            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.filter").concat("#filter-frame"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        
        ".biz-ico-filter-value click" : function(el, event) {
            var self = this, options;
            // call external editor
            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EDITOR_DATALIST,
                data: self.inputValue,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            self.controller.publish("propertyEditorChanged", options);
        }
    }
);