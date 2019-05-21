/*
@title: Test Ribbon Component
@authors: Rhony Pedraza
@date: 10-apr-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Ribbon Test");

    var STUB_RIBBON_URL ="jquery/editor/component/ribbon/mocks/stub.2.ribbon.json.txt";

    test("Check Ribbon creation", 3, function() {
        
        ok(!!$.fn.bizagi_editor_component_ribbon, "Widget (plugin $.Controller) bizagi_editor_component_ribbon() creation");
        
        var container = $("<div />");
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_ribbon"], "Widget (plugin) $.data register (call to setup)");
        
        ribbon.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(ribbon.options.value, "value", "Value is updated in this.options");
        
    });

    
    test("Check Ribbon templates", 3, function(){
        
        var container = $("<div />");
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Se revisa la carga de las plantillas
        ok(!!ribbon.tmpl, "Templates object is in ribbon plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.ribbon"))
            .done(function(tmpl) {
                ok(!!tmpl, "Ribbon templates can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Ribbon templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });


    test("Check Ribbon templates load", 2, function() {
        
        var container = $("<div />");
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Validacion de la carga de las plantillas
        stop();
        ribbon.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(ribbon.tmpl), "Templates in ribbon successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(ribbon.loadTemplate("group", bizagi.getTemplate("bizagi.editor.component.ribbon").concat("#ribbon-group")), null, "Get back gruop template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in ribbon can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });

    test("Check Ribbon stub load", 4, function() {
        
        stop();
        $.ajax({
            url : STUB_RIBBON_URL,
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.ribbon.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            ok(json.groups !== undefined, "Groups in ribbon's stub exist");
            ok(json.groups[0].elements !== undefined, "Elements in ribbon's stub exist");
            strictEqual(json.groups[0].elements[0].caption, "Save", "Element Caption in first ribbon's Group stub  stub is \"Save\"");
            
            start();
        }).fail(function() {
            ok(false, "File stub.ribbon.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });

    test("Check Ribbon render (groups)", 6, function() {
        
        var inlineStub = 
        {
            "groups": [
                        {
                            "elements": [
                                {
                                    "caption": "Save", 
                                    "style": "save", 
                                    "disabled": "disabled"
                                }, 
                                {
                                    "caption": "Copy From", 
                                    "style": "copy-from", 
                                    "disabled": "disabled"
                                }, 
                                {
                                    "caption": "Redo", 
                                    "style": "redo"
                                }, 
                                {
                                    "caption": "Undo", 
                                    "style": "undo"
                                }
                            ]
                        },
                        {
                            "elements": [
                                {
                                    "caption": "Convert To", 
                                    "style": "convert-to"
                                }
                            ]
                        }
                    ]
        };
        
        var container = $("<nav />");
        container.prependTo("body"); // Local test
        
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(ribbon.render !== undefined, "Method render in ribbon exist");
        
        stop();
        ribbon.loadTemplates().done(function() {
            $.extend(ribbon.options, inlineStub); // Se cargan los datos de prueba
            
            ok(ribbon.renderGroups !== undefined, "Method renderGroups in ribbon exist");
            ribbon.renderGroups(ribbon.element, ribbon.options);


            ok(!!container.find("ul").length, "HTML struct tab in ribbon created");
            
            ok(ribbon.renderGroups !== undefined, "Method renderGroups in ribbon exist");
            ok(ribbon.renderElements !== undefined, "Method renderElements in ribbon exist");

            ribbon.renderGroups(ribbon.element, ribbon.options);

            ok(!!container.find("ul").length > 0, "HTML struct groups in ribbon created");
            
            start();
            ribbon.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });

    test("Check Ribbon render (Elements in groups)", 4, function() {
        
        var inlineStub = {
                            "groups": [
                                {
                                    "elements": [
                                        {
                                            "caption": "Save", 
                                            "style": "save", 
                                            "disabled": "disabled"
                                        }, 
                                        {
                                            "caption": "Copy From", 
                                            "style": "copy-from", 
                                            "disabled": "disabled"
                                        }, 
                                        {
                                            "caption": "Redo", 
                                            "style": "redo"
                                        }, 
                                        {
                                            "caption": "Undo", 
                                            "style": "undo"
                                        }
                                    ]
                                }
                            ]
                        }


        var container = $("<nav />");   
        container.prependTo("body"); // Local test
        
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Se modifica this.element despues de aplicar el render
        
        stop();
        ribbon.loadTemplates().done(function() {
            $.extend(ribbon.options, inlineStub); // Se cargan los datos de prueba
            
            //ribbon.renderTab(ribbon.element, ribbon.options.ribbon.container[0]);
            //ribbon.renderGroups(ribbon.element, ribbon.options.ribbon.container[0].groups);
            
            ok(ribbon.renderElements !== undefined, "Method renderElements in ribbon exist");
            ok(ribbon.renderElementWithItems !== undefined, "Method renderElementWithItems in ribbon exist");
            
            ok(!$.isEmptyObject(ribbon.options.groups[0]), "Object -ribbon.options.groups[0]- is not empty");

            ribbon.renderElements(ribbon.element, ribbon.options.groups[0]);
            ok(!!container.find("li > span.ribbon-label").length && !!container.find("li > span.[class*='ribbon-image']").length, "HTML struct Elements in ribbon created");
            
            console.log(ribbon.element);
            start();
            ribbon.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });

    test("Check Ribbon render (Elements with Items)", 4, function() {
        
        var inlineStub = {
                            "groups": [
                                {
                                    "elements": [
                                        {
                                            "caption": "Save", 
                                            "style": "save", 
                                             "items": [
                                                            {
                                                                "caption": "Boolean", 
                                                                "style": "boolean"
                                                            }
                                                        ]
                                        }
                                    ]
                                },
                                {
                                    "elements": [
                                        {
                                            "caption": "Otro", 
                                            "style": "other",
                                            "items": [
                                                            {
                                                                "caption": "Boolean", 
                                                                "style": "boolean"
                                                            }
                                                        ]
                                        }
                                    ]
                                }
                            ]
                        }

        var container = $("<nav />");   
        container.prependTo("body"); // Local test
        
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Se modifica this.element despues de aplicar el render
        
        stop();
        ribbon.loadTemplates().done(function() {
            $.extend(ribbon.options, inlineStub); // Se cargan los datos de prueba
            
            //ribbon.renderTab(ribbon.element, ribbon.options.ribbon.container[0]);
            //ribbon.renderGroups(ribbon.element, ribbon.options.ribbon.container[0].groups);
            
            ok(ribbon.renderElementWithItems !== undefined, "Method renderElementWithItems in ribbon exist");
            
            ok(!$.isEmptyObject(ribbon.options.groups[0].elements[0]), "Object -ribbon.options.groups[0]- is not empty");

            //ribbon.renderGroups(ribbon.element, ribbon.options);

            var elGroups = $.tmpl(ribbon.getTemplate("group"), {});
            ribbon.element.append(elGroups);
            var elGroups2 = $.tmpl(ribbon.getTemplate("group"), {});
            ribbon.element.append(elGroups2);


            ok(!!elGroups !== undefined, "Group was created");

            ribbon.renderElementWithItems(elGroups, ribbon.options.groups[0].elements[0]);
            ribbon.renderElementWithItems(elGroups2, ribbon.options.groups[1].elements[0]);

            ok(!!container.find("ul ul > li > span.ribbon-label").length && !!container.find("ul ul > li > span.[class*='ribbon-image']").length, "HTML struct Elements in ribbon created");
            


            start();
            ribbon.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });


test("Check Ribbon render (Items with SubItems)", 4, function() {
        
        var inlineStub = {
                            "groups": [
                                {
                                    "elements": [
                                        {
                                            "caption": "Save", 
                                            "style": "save", 
                                             "items": [
                                                            {
                                                                "caption": "Date", 
                                                                "style": "date",
                                                                "subitems": [
                                                                                {
                                                                                    "caption": "Yes - No", 
                                                                                    "style": "yes-no"
                                                                                }, 
                                                                                {
                                                                                    "caption": "Checkbox", 
                                                                                    "style": "checkbox"
                                                                                }
                                                                            ]
                                                            },
                                                            {
                                                                "caption": "Label", 
                                                                "style": "label",
                                                                "subitems": [
                                                                                {
                                                                                    "caption": "Yes - No", 
                                                                                    "style": "yes-no"
                                                                                }, 
                                                                                {
                                                                                    "caption": "Checkbox", 
                                                                                    "style": "checkbox"
                                                                                }
                                                                            ]
                                                            }
                                                        ]
                                        }
                                    ]
                                }
                            ]
                        }

        var container = $("<nav />");   
        container.prependTo("body"); // Local test
        
        var ribbon = new bizagi.editor.component.ribbon(container);
        
        // Se modifica this.element despues de aplicar el render
        
        stop();
        ribbon.loadTemplates().done(function() {
            $.extend(ribbon.options, inlineStub); // Se cargan los datos de prueba
            
            //ribbon.renderTab(ribbon.element, ribbon.options.ribbon.container[0]);
            //ribbon.renderGroups(ribbon.element, ribbon.options.ribbon.container[0].groups);
            
            ok(ribbon.renderElementWithSubItems !== undefined, "Method renderElementWithSubItems in ribbon exist");
            
            ok(!$.isEmptyObject(ribbon.options.groups[0].elements[0]), "Object -ribbon.options.groups[0]- is not empty");

            //ribbon.renderGroups(ribbon.element, ribbon.options);

            var elGroups = $.tmpl(ribbon.getTemplate("group"), {});
            ribbon.element.append(elGroups);

            ok(!!elGroups !== undefined, "Group was created");

            ribbon.renderElementWithSubItems(elGroups, ribbon.options.groups[0].elements[0].items[0]);
            ribbon.renderElementWithSubItems(elGroups, ribbon.options.groups[0].elements[0].items[1]);


            ok(!!container.find("ul > li.ribbon-dropdown-section").length && !!container.find("ul > li.ribbon-dropdown-section").next().find("span.[class*='ribbon-image']").length, "HTML struct Elements in ribbon created");
            
            
            
            start();
            ribbon.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });


    test("Check Ribbon presenter", 6, function() {
        
        var inlineStub = 
        {
            "groups": [
                {
                    "elements": [
                        {
                            "caption": "Save", 
                            "style": "save", 
                            "disabled": "disabled"
                        }, 
                        {
                            "caption": "Copy From", 
                            "style": "copy-from", 
                            "disabled": "disabled"
                        }, 
                        {
                            "caption": "Redo", 
                            "style": "redo"
                        }, 
                        {
                            "caption": "Undo", 
                            "style": "undo"
                        }
                    ]
                }, 
                {
                    "elements": [
                        {
                            "caption": "Convert To", 
                            "style": "convert-to", 
                            "items": [
                                {
                                    "caption": "Boolean", 
                                    "style": "boolean", 
                                    "subitems": [
                                        {
                                            "caption": "Yes - No", 
                                            "style": "yes-no"
                                        }, 
                                        {
                                            "caption": "Checkbox", 
                                            "style": "checkbox"
                                        }
                                    ]
                                }, 
                                {
                                    "caption": "Other", 
                                    "style": "other", 
                                    "subitems": [
                                        {
                                            "caption": "Button", 
                                            "style": "button"
                                        }, 
                                        {
                                            "caption": "Label", 
                                            "style": "label"
                                        }, 
                                        {
                                            "caption": "Hidden", 
                                            "style": "hidden"
                                        }, 
                                        {
                                            "caption": "Internal", 
                                            "style": "internal"
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "caption": "Delete", 
                            "style": "delete"
                        }, 
                        {
                            "caption": "Rename", 
                            "style": "rename"
                        }
                    ]
                }, 
                {
                    "elements": [
                        {
                            "caption": "Visible", 
                            "style": "visible", 
                            "items": [
                                {
                                    "caption": "True", 
                                    "style": "true"
                                }, 
                                {
                                    "caption": "False", 
                                    "style": "false"
                                }, 
                                {
                                    "caption": "Expression", 
                                    "style": "expression"
                                }
                            ]
                        }, 
                        {
                            "caption": "Editable", 
                            "style": "editable", 
                            "disabled": "disabled"
                        }, 
                        {
                            "caption": "Required", 
                            "style": "required", 
                            "items": [
                                {
                                    "caption": "True", 
                                    "style": "true"
                                }, 
                                {
                                    "caption": "False", 
                                    "style": "false"
                                }, 
                                {
                                    "caption": "Expression", 
                                    "style": "expression"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        
        var containerRibbon = $("<nav />");
        containerRibbon.prependTo("body");
        
        ok(bizagi.editor.component.ribbon.presenter !== undefined, "Check bizagi.editor.component.ribbon.presenter presenter");
        
        var ribbon = new bizagi.editor.component.ribbon.presenter(containerRibbon, inlineStub);
        
        ok(ribbon.create !== undefined, "Check bizagi.editor.component.ribbon.presenter create method");
        ok(ribbon.render !== undefined, "Check bizagi.editor.component.ribbon.presenter render method");
        ok(ribbon.remove !== undefined, "Check bizagi.editor.component.ribbon.presenter remove method");
        
        stop();
        ribbon.render().done(function(ribbon) {
            // Se revisa si se pinto
            ok(ribbon.element.children().length == 3 && $($(ribbon.element.children()[1]).children()[0]).find('.ribbon-label:lt(1)').text() == "Convert To", "HTML struct for ribbon created");
            deepEqual(ribbon.options.groups, inlineStub.groups, "Check position");
            ribbon.remove();
            start();
        });
        setTimeout(function() {
            start();    
        }, 1000);
    });

    test("Check Ribbon events", 4, function() {
         var inlineStub = 
        {
          "groups": [
            {
              "elements": [
                {
                  "caption": "Save",
                  "style": "save",
                  "disabled": "disabled"
                },
                {
                  "caption": "Copy From",
                  "style": "copy-from",
                  "items": [
                    {
                      "caption": "Item 1",
                      "style": "redo",
                      "subitems": [
                        {
                          "caption": "Sub Item 1",
                          "style": "redo"
                        },
                        {
                          "caption": "Sub Item 2",
                          "style": "redo",
                          "disabled": "disabled"
                        }
                      ]
                    }
                  ]
                },
                {
                  "caption": "Redo",
                  "style": "redo"
                },
                {
                  "caption": "Undo",
                  "style": "undo"
                }
              ]
            }
          ]
        }

        var containerRibbon = $("<nav />");
        containerRibbon.prependTo("body");

        var ribbon = new bizagi.editor.component.ribbon.presenter(containerRibbon, inlineStub);


        ribbon.subscribe("onRibbonItemClicked", function (event, args) {
            interceptClick(args);
        });

        function interceptClick(args){
            ok(true, "Internal click succesfuly called");
            ok(args.rule != undefined && args.action != undefined ,"MessageRibbon subscriber send arguments with values");
        }

        stop();
        ribbon.render().done(function(ribbon) {
            ok(!!ribbon.element.children().length > 0 , "Check Ribbon's childrens");
            
            var elementTriggerTest = ribbon.element.find('li:last');

            ok(!(elementTriggerTest.hasClass('ribbon-disabled')) , "Element is enabled");

            elementTriggerTest.trigger('click');
            ribbon.remove();
            start();
        });
        setTimeout(function() {
            start();    
        }, 1000);

    });


});