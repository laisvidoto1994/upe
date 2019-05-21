/*
@title: Test Editor renderlayout
@authors: Rhony Pedraza
@date: 31-may-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Editor renderlayout Test");
    
    test("Check Editor renderlayout creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor creation");
        ok(!!$.fn.bizagi_editor_component_editor_renderlayout, "Widget (plugin $.Controller) bizagi_editor_component_editor_renderlayout creation");
        
        var container = $("<div></div>");
        var renderlayout = new bizagi.editor.component.editor.renderlayout(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_renderlayout"], "Widget (plugin) $.data register (call to setup)");
        
        renderlayout.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(renderlayout.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.renderlayout");
        
    });
    
    test("Check Editor renderlayout templates", 3, function(){
        
        var container = $("<div />");
        var renderlayout = new bizagi.editor.component.editor.renderlayout(container);
        
        // Se revisa la carga de las plantillas
        ok(!!renderlayout.tmpl, "Templates object is in editor renderlayout plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.editor.renderlayout"))
            .done(function(tmpl) {
                ok(!!tmpl, "Editor renderlayout templates can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Editor renderlayout templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor renderlayout templates load", 2, function() {
        
        var container = $("<div></div>");
        var renderlayout = new bizagi.editor.component.editor.renderlayout(container);
        
        // Validacion de la carga de las plantillas
        stop();
        renderlayout.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(renderlayout.tmpl), "Templates in editor renderlayout successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(renderlayout.getTemplate("frame"), null, "Get back \"frame\" template in editor renderlayout");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in editor renderlayout can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor renderlayout stub load", 3, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/editor/renderlayout/mocks/stub.editor.renderlayout.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.editor.renderlayout.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json["bas-type"], "render-layout", "bas-type in stub is \"render-layout\"");
            equal(json.subproperties.length, 2, "subproperties length in stub is 2");
            
            start();
        }).fail(function() {
            ok(false, "File stub.editor.renderlayout.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor renderlayout render (renderEditor and renderOptions)", 5, function() {
        
        var inlineStub = 
        {
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
        };
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var renderlayout = new bizagi.editor.component.editor.renderlayout(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(renderlayout.render !== undefined, "Method render in editor renderlayout exist");
        
        stop();
        renderlayout.loadTemplates().done(function() {
            $.extend(renderlayout.options, inlineStub); // Se cargan los datos de prueba
            
            ok(renderlayout.renderEditor !== undefined, "Method renderEditor in editor renderlayout exist");
            //ok(rendertype.renderOptions !== undefined, "Method renderOptions in editor rendertype exist");
            renderlayout.renderEditor(renderlayout.element, renderlayout.options);
            
            //ok(!!container.find("> div > label").length && !!container.find("> div > select > option").length, "HTML struct editor in editor rendertype created");
            
            ok(renderlayout.remove !== undefined, "Method remove in editor renderlayout exist");
            
            start();
            //renderlayout.remove();
        }).fail(function() {
            ok(false, "Error in renderlayout.loadTemplates()");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    //
    
});