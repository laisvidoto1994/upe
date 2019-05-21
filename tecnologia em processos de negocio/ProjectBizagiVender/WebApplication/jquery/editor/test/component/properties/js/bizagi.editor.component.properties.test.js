/*
@title: Test Properties Component
@authors: Rhony Pedraza
@date: 7-mar-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("properties Test");
    
    test("Check properties creation", 3, function() {
        
        ok(!!$.fn.bizagi_editor_component_properties, "Widget creation");
        
        var container = $("<div />");
        var properties = new bizagi.editor.component.properties(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_properties"], "Widget $.data register (call to setup)");
        
        properties.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(properties.options.value, "value", "Value is updated");
        
    });
    
    test("Check properties templates", 3, function(){
        
        var container = $("<div />");
        var properties = new bizagi.editor.component.properties(container);
        
        // Se revisa la carga de las plantillas
        ok(!!properties.tmpl, "Templates array is in plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.properties"))
            .done(function(tmpl) {
                ok(!!tmpl, "Template can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Template can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check properties templates load", 2, function() {
        
        var container = $("<div />");
        var properties = new bizagi.editor.component.properties(container);
        
        // Validacion de la carga de las plantillas
        stop();
        properties.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(properties.tmpl), "Templates successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(properties.getTemplate("frame-header"), null, "Get back \"frame-header\" template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check properties stub load", 3, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/properties/mocks/stub.2.properties.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File jquery/editor/component/properties/mocks/stub.2.properties.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json.elements[0].tabs[0].elements[1].property["bas-type"], "localizable-string", "Type from second property and first tab is \"localizable-string\"");
            equal(json.elements[0].tabs[0].elements.length, 5, "In first tab 5 elements are painting");
            
            start();
        }).fail(function() {
            ok(false, "File jquery/editor/component/properties/mocks/stub.2.properties.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check properties render (frame)", 3, function() {
        
        var inlineStub =
        {
            "idRender" : "GUID-0",
            "elements" : [
                {
                    "tabs" : [
                        {
                            "caption" : "Basic Information"
                        },
                        {
                            "caption" : "Render Display"
                        }
                    ]
                }
            ]
        };
        
        var container = $("<div></div");
        container.prependTo("body"); // local test
        
        var properties = new bizagi.editor.component.properties(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(properties.render !== undefined, "Method render exists in properties");
        
        stop();
        properties.loadTemplates().done(function() {
            $.extend(properties.options, inlineStub); // Se cargan los datos de prueba
            
            ok(properties.renderFrame !== undefined, "Method renderFrame exists in properties");
            properties.renderFrame(properties.element, properties.options);
            ok(!!container.find("ul > li > a").length, "HTML struct header \"ul > li > a\" created");
            
            properties.remove();
            start();
        }).fail(function() {
            ok(false, "loadTemplates() did not perform successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check properties render content (with temporal lstring editor)", 3, function() {
        
        var inlineStub =
        {
            "idRender": "GUID-0", 
            "elements": [
                {
                    "tabs": [
                        {
                            "caption": "Basic", 
                            "elements": [
                                {
                                    "property": {
                                        "name": "displayName", 
                                        "bas-type": "localizable-string", 
                                        "caption": "Display Name", 
                                        "value": "Label Text", 
                                        "default": "Label"
                                    }
                                }, 
                                {
                                    "property": {
                                        "name": "helptext", 
                                        "bas-type": "localizable-string", 
                                        "caption": "Help Text"
                                    }
                                }, 
                                {
                                    "category": {
                                        "caption": "Rules", 
                                        "elements": [
                                            {
                                                "property": {
                                                    "name": "visible", 
                                                    "bas-type": "rule-expression", 
                                                    "editor-parameters": {
                                                        "types": [
                                                            "boolean"
                                                        ]
                                                    }, 
                                                    "caption": "Visible", 
                                                    "default": "true", 
                                                    "required": true
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "editable", 
                                                    "bas-type": "rule-expression", 
                                                    "editor-parameters": {
                                                        "types": [
                                                            "boolean"
                                                        ]
                                                    }, 
                                                    "caption": "Editable", 
                                                    "default": "true", 
                                                    "required": true
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "required", 
                                                    "bas-type": "rule-expression", 
                                                    "editor-parameters": {
                                                        "types": [
                                                            "boolean"
                                                        ]
                                                    }, 
                                                    "caption": "Required", 
                                                    "default": "false", 
                                                    "required": true
                                                }
                                            }
                                        ]
                                    }
                                }, 
                                {
                                    "group": {
                                        "caption": "Grupo de Prueba", 
                                        "elements": [
                                            {
                                                "property": {
                                                    "name": "labelalign", 
                                                    "bas-type": "horizontal-align", 
                                                    "caption": "Label Align", 
                                                    "default": "left"
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "valuealign", 
                                                    "bas-type": "horizontal-align", 
                                                    "caption": "Value Align", 
                                                    "default": "left"
                                                }
                                            }
                                        ]
                                    }
                                }, 
                                {
                                    "property": {
                                        "name": "layout", 
                                        "bas-type": "render-layout", 
                                        "caption": "Layout", 
                                        "subproperties": [
                                            {
                                                "property": {
                                                    "name": "labelwidth", 
                                                    "bas-type": "int", 
                                                    "caption": "Label Width", 
                                                    "value": 30, 
                                                    "user-editable": false
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "valuewidth", 
                                                    "bas-type": "int", 
                                                    "caption": "Control Width", 
                                                    "value": 70, 
                                                    "user-editable": false
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        
        var container = $("<div></div>");
        container.prependTo("body"); // local test
        
        var properties = new bizagi.editor.component.properties(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(properties.render !== undefined, "Method render exists in properties");
        
        stop();
        properties.loadTemplates().done(function() {
            $.extend(properties.options, inlineStub); // Se cargan los datos de prueba
            
            ok(properties.renderContent !== undefined, "Method renderContent exists in properties");
            
            properties.renderContent(properties.element, properties.options);
            
            ok(!!container.find("#properties-tab-basic").length && !!container.find("> div > div > fieldset"), "HTML struct for renderContent is created");
            properties.remove();
            start();
        }).fail(function() {
            ok(false, "loadTemplates() did not perform successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check properties presenter (integration)", 5, function() {
        
        var inlineStub =
        {
            "idRender": "GUID-0", 
            "elements": [
                {
                    "tabs": [
                        {
                            "caption": "Basic", 
                            "elements": [
                                {
                                    "group": {
                                        "caption": "Grupo de Prueba", 
                                        "elements": [
                                            {
                                                "property": {
                                                    "name": "labelalign", 
                                                    "bas-type": "horizontal-align", 
                                                    "caption": "Label Align", 
                                                    "default": "left"
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "valuealign", 
                                                    "bas-type": "horizontal-align", 
                                                    "caption": "Value Align", 
                                                    "default": "left"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "category": {
                                        "caption": "Rules", 
                                        "elements": [
                                            {
                                                "property": {
                                                    "name": "visible", 
                                                    "bas-type": "rule-expression", 
                                                    "editor-parameters": {
                                                        "types": [
                                                            "boolean"
                                                        ]
                                                    }, 
                                                    "caption": "Visible", 
                                                    "default": "true", 
                                                    "required": true
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "editable", 
                                                    "bas-type": "rule-expression", 
                                                    "editor-parameters": {
                                                        "types": [
                                                            "boolean"
                                                        ]
                                                    }, 
                                                    "caption": "Editable", 
                                                    "default": "true", 
                                                    "required": true
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "required", 
                                                    "bas-type": "rule-expression", 
                                                    "editor-parameters": {
                                                        "types": [
                                                            "boolean"
                                                        ]
                                                    }, 
                                                    "caption": "Required", 
                                                    "default": "false", 
                                                    "required": true
                                                }
                                            }
                                        ]
                                    }
                                } 
                            ]
                        },
                        {
                            "caption" : "Display Render",
                            "elements" : [
                                {
                                    "property": {
                                        "name": "displayName", 
                                        "bas-type": "localizable-string", 
                                        "caption": "Display Name", 
                                        "value": "Label Text", 
                                        "default": "Label"
                                    }
                                },
                                {
                                    "property": {
                                        "name": "layout", 
                                        "bas-type": "render-layout", 
                                        "caption": "Layout", 
                                        "subproperties": [
                                            {
                                                "property": {
                                                    "name": "labelwidth", 
                                                    "bas-type": "int", 
                                                    "caption": "Label Width", 
                                                    "value": 30, 
                                                    "user-editable": false
                                                }
                                            }, 
                                            {
                                                "property": {
                                                    "name": "valuewidth", 
                                                    "bas-type": "int", 
                                                    "caption": "Control Width", 
                                                    "value": 70, 
                                                    "user-editable": false
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        
        var position = {
            position : {
                top : 10,
                left : 120
            }
        };
        
        var containerProperties = $("<div />");
        containerProperties.prependTo("body");
        
        ok(bizagi.editor.component.properties.presenter !== undefined, "Check bizagi.editor.component.properties.presenter");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, $.extend({},{ model : inlineStub }, position));
        
        ok(properties.create !== undefined, "Check presenter create");
        
        ok(properties.render !== undefined, "Check presenter render");
        
        stop();
        properties.render().done(function(properties) {   
            // Se revisa si se pinto
            ok(!!properties.element.find("> ul > li > a").length && !!properties.element.find("> div > div > span").length, "HTML struct header and content created in properties");
            deepEqual(properties.element.offset(), { top : 10, left : 120 }, "Check offset position in properties");
            
            containerProperties.remove(); 
            start();
        }).fail(function() {
            ok(false, "loadTemplates() did not perform successfuly");
            start();
        });
        setTimeout(function() {
            start();    
        }, 1000);
        
    });
    
    
    
    
    
    
    
    /*
    test("Check Properties presenter and position", 5, function() {
        
        var containerProperties = $("<div />");
        containerProperties.prependTo("body");
        
        ok(bizagi.editor.component.properties.presenter !== undefined, "Check presenter");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, inlineStub);
        
        ok(properties.create !== undefined, "Check presenter create");
        
        ok(properties.render !== undefined, "Check presenter render");
        
        stop();
        properties.render().done(function(properties) {   
            // Se revisa si se pinto
            ok(!!properties.element.find("ul.ui-tabs-nav > li.ui-state-default").length && !!properties.element.find("div.ui-tabs-panel > div > label.prop-property-label").length, "HTML struct created");
            deepEqual(properties.element.offset(), inlineStub.render.position, "Check position");
            containerProperties.remove(); 
            start();
        });
        setTimeout(function() {
            start();    
        }, 1000);
    });
    
    test("Check Properties events", 4, function() {
        
        var inlineStub = {
            render : {
                id : "9b2f0e9d-41d4-41cf-8f21-3b7dba1953b0", 
                name : "label", 
                position : {
                    top : 25, 
                    left : 340
                }, 
                elements : [{
                    container: {
                        type : "tab",
                        name : "visualSettings",
                        displayName : "Visual Settings 2",
                        elements : [{
                            property : {
                                type : "lstring", 
                                name : "displayName",
                                displayName : "Display Name 2", 
                                value : "Last value",
                                tooltip : "Display Name Tooltip"
                            }
                        }, {
                            property : {
                                type : "otherType", 
                                name : "displayName",
                                displayName : "Display Name 2", 
                                value : "Last value",
                                tooltip : "Display Name Tooltip"
                            }
                        }]
                    }
                },{
                    container: {
                        type : "tab",
                        name : "preRender",
                        displayName : "Pre Render 2",
                        elements : [{
                            property : {
                                type : "lstring", 
                                name : "description", 
                                displayName : "Description 2", 
                                value : "Last description", 
                                tooltip : "Description Tooltip"
                            }
                        }]
                    }
                }]
            }
        };
        
        
        var containerProperties = $("<div />");
        containerProperties.prependTo("body");
        
        ok(bizagi.editor.component.properties.presenter !== undefined, "Check presenter");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, inlineStub);
        
        ok(properties.subscribe !== undefined, "Check subscribe");
        
        function PropertiesComm(args) {
            ok(true, "External test succesfuly called");
        }
        
        properties.subscribe("propertyChanged", function(event, args) {
            PropertiesComm(args);
        });
        
        stop();
        properties.render().done(function(properties) {   
            // Se revisa si se pinto
            ok(!!properties.element.find("ul.ui-tabs-nav > li.ui-state-default").length && !!properties.element.find("div.ui-tabs-panel > div > label.prop-property-label").length, "HTML struct created");
            start();
            // Se lanza el evento
            var input = $("#prop-tab-visualSettings .prop-property-value", properties.element).val("cambio");
            var event = $.Event("keydown");
            event.keyCode = 13;
            input.trigger(event);
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });*/
    
    //
    
});