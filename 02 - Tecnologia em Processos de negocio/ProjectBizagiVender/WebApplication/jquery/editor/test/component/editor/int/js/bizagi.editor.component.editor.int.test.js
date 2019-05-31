/*
@title: Test Editor Rendertype Component
@authors: Rhony Pedraza
@date: 09-may-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Editor Int");
    
    test("Check Editor Int creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor creation");
        ok(!!$.fn.bizagi_editor_component_editor_int, "Widget (plugin $.Controller) bizagi_editor_component_editor_int creation");
        
        var container = $("<div></div>");
        var intEditor = new bizagi.editor.component.editor.int(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_int"], "Widget (plugin) $.data register (call to setup)");
        
        intEditor.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(intEditor.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.rendertype");
        
    });
    
    
    test("Check Editor Int templates", 4, function(){
        
       var container = $("<div />");
        var intEditor = new bizagi.editor.component.editor.int(container);
        
        // Se revisa la carga de las plantillas
        ok(!!intEditor.tmpl, "Templates object is in editor int plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");

        ok(bizagi.getTemplate("bizagi.editor.component.editor.int").concat("#int-frame") ,"Check bizagi getTemplate service with a specific target" );
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();

        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.editor.int"))
        .done(function(tmpl) {
            ok(!!tmpl, "Editor int templates can be loaded");
            start();
        })
        .fail(function() {
            ok(false, "Editor int templates can not be loaded");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
   
    test("Check Editor Int templates load", 3, function() {
        
       var container = $("<div />");
        var intEditor = new bizagi.editor.component.editor.int(container);
        
        // Validacion de la carga de las plantillas
        stop();
        intEditor.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(intEditor.tmpl), "Templates in editor rendertype successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(intEditor.getTemplate("frame"), 'frame', "Get back \"frame\" template");

                notStrictEqual(intEditor.getTemplate("error"), 'error', "Get back \"error\" template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in editor int can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor int stub load", 4, function() {
        
       stop();
        $.ajax({
            url : "jquery/editor/component/editor/int/mocks/stub.editor.int.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.editor.int.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json.displayName, "Int", "displayName in stub is \"Int\"");
            strictEqual(json.type, "int", "type in stub is \"int\"");
            equal(json.data.length, 4, "data length in stub is 4");
            
            start();
        }).fail(function() {
            ok(false, "File stub.editor.int.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor int render (renderEditor and renderOptions)", 4, function() {
        
        var inlineStub =
        {
            "displayName": "Int",
            "name": "int",
            "type": "int",
            "value": "125",
            "data": [{
                "name" : "button"
            }, {
                "name" : "hidden"
            }, {
                "name" : "label"
            }, {
                "name" : "letter"
            }]
        }
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var intEditor = new bizagi.editor.component.editor.int(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(intEditor.render !== undefined, "Method render in editor int exist");
        
        stop();
        intEditor.loadTemplates().done(function() {
            $.extend(intEditor.options, inlineStub); // Se cargan los datos de prueba
            
            ok(intEditor.renderEditor !== undefined, "Method renderEditor in editor int exist");

            intEditor.renderEditor(intEditor.element, intEditor.options);
            
            ok(!!container.find("> div > label").length && !!container.find("> div > input").length, "HTML struct editor in editor int Editor created");
            
            ok(intEditor.remove !== undefined, "Method remove in editor int exist");
            
            start();
            intEditor.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor int events", 4, function() {
        
        var inlineStub =
        {
            "displayName": "Int",
            "name": "int",
            "type": "int",
            "value": "125",
            "data": [{
                "name" : "button"
            }, {
                "name" : "hidden"
            }, {
                "name" : "label"
            }, {
                "name" : "letter"
            }]
        }
        
        var containerInt = $("<div></div>");
        var containerProperties = $("<div></div>");
        containerInt.prependTo("body");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, { render : { id : 1 } });
        var intEditor = new bizagi.editor.component.editor.int(containerInt, inlineStub, properties);
        
        ok(intEditor.controller.publish !== undefined, "Check controller.publish in int Editor");
        
        ok(properties.subscribe !== undefined, "Check subscribe in properties presenter");
        
        function PropertiesComm(args) {
            ok(true, "External test succesfuly called (MessageEditorProperties)");
            rendertype.remove();
        }
        
        properties.subscribe("MessageEditorProperties", function(event, args) {
            PropertiesComm(args);
        });


        ok(!!container.find("> span[class*='icon-default-value']").length , "HTML struct for default value button in int editor exist");
        
        stop();
        intEditor.render().done(function() {
            var inputText = intEditor.element.find("input");
            inputText.trigger("focus").val('45698').delay(1000,function(){
                inputText.blur();
            });


            intEditor.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    
    //
    
});