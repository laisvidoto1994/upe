/*
@title: Test Editor Boolean Component
@authors: Rhony Pedraza
@date: 03-may-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Editor Boolean Test");
    
    test("Check Editor Boolean creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor creation");
        ok(!!$.fn.bizagi_editor_component_editor_boolean, "Widget (plugin $.Controller) bizagi_editor_component_editor_boolean creation");
        
        var container = $("<div></div>");
        var boolean = new bizagi.editor.component.editor.boolean(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_boolean"], "Widget (plugin) $.data register (call to setup)");
        
        boolean.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(boolean.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.boolean");
        
    });
    
    test("Check Editor Boolean templates", 3, function(){
        
        var container = $("<div />");
        var boolean = new bizagi.editor.component.editor.boolean(container);
        
        // Se revisa la carga de las plantillas
        ok(!!boolean.tmpl, "Templates object is in editor boolean plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.editor.boolean"))
            .done(function(tmpl) {
                ok(!!tmpl, "Editor Boolean templates can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Editor Boolean templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor Boolean templates load", 2, function() {
        
        var container = $("<div />");
        var boolean = new bizagi.editor.component.editor.boolean(container);
        
        // Validacion de la carga de las plantillas
        stop();
        boolean.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(boolean.tmpl), "Templates in editor boolean successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(boolean.getTemplate("frame"), null, "Get back \"frame\" template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in editor boolean can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });

    test("Check Editor Boolean stub load", 4, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/editor/boolean/mocks/stub.editor.boolean.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.editor.boolean.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json.caption, "Visible", "Caption in stub is \"Boolean\"");
            strictEqual(json.type, "boolean", "type in stub is \"boolean\"");
            equal(json.data.length, 4, "data length in stub is 4");
            
            start();
        }).fail(function() {
            ok(false, "File stub.editor.boolean.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    
    test("Check Editor Boolean render (renderEditor)", 4, function() {
        
        var inlineStub =
        {
            "caption": "Visible", 
            "name": "visible", 
            "type": "boolean", 
            "value": false
        }
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var boolean = new bizagi.editor.component.editor.boolean(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(boolean.render !== undefined, "Method render in editor boolean exist");
        
        stop();
        boolean.loadTemplates().done(function() {
            $.extend(boolean.options, inlineStub); // Se cargan los datos de prueba
            
            ok(boolean.renderEditor !== undefined, "Method renderEditor in editor boolean exist");
            boolean.renderEditor(boolean.element, boolean.options);
            ok(!!container.find("> div > label").length && !!container.find("> div > div > input").length, "HTML struct editor in editor string created");
            
            ok(boolean.remove !== undefined, "Method remove in editor boolean exist");
            
            start();
            //boolean.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor Boolean events", 3, function() {
        
        var inlineStub =
        {
            "caption": "Visible", 
            "name": "visible", 
            "type": "boolean", 
            "value": false
        }
        
        var containerBoolean = $("<div></div>");
        var containerProperties = $("<div></div>");
        containerBoolean.prependTo("body");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, { render : { id : 1 } });
        var boolean = new bizagi.editor.component.editor.boolean(containerBoolean, inlineStub, properties);
        
        ok(boolean.controller.publish !== undefined, "Check controller.publish in Editor Boolean");
        
        ok(properties.subscribe !== undefined, "Check subscribe in properties presenter");
        
        function PropertiesComm(args) {
            ok(true, "External test succesfuly called (MessageEditorProperties)");
            boolean.remove();
        }
        
        properties.subscribe("propertyEditorChanged", function(event, args) {
            PropertiesComm(args);
        });
        
        stop();
        boolean.render().done(function() {
            var input = boolean.element.find("input");
            input.trigger("click");
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    //
    
});