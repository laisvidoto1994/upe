/*
@title: Test Editor String Component
@authors: Rhony Pedraza
@date: 24-apr-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Editor String Test");
    
    test("Check Editor String creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor() creation");
        ok(!!$.fn.bizagi_editor_component_editor_string, "Widget (plugin $.Controller) bizagi_editor_component_editor_string() creation");
        
        var container = $("<div></div>");
        var string = new bizagi.editor.component.editor.string(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_string"], "Widget (plugin) $.data register (call to setup)");
        
        string.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(string.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.string");
        
    });
    
    test("Check Editor String templates", 3, function(){
        
        var container = $("<div />");
        var string = new bizagi.editor.component.editor.string(container);
        
        // Se revisa la carga de las plantillas
        ok(!!string.tmpl, "Templates object is in editor string plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.editor.string"))
            .done(function(tmpl) {
                ok(!!tmpl, "Editor String templates can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Editor String templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor String templates load", 5, function() {
        
        var container = $("<div />");
        var string = new bizagi.editor.component.editor.string(container);
        
        // Validacion de la carga de las plantillas
        stop();
        string.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(string.tmpl), "Templates in editor string successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(string.getTemplate("frame"), 'frame', "Get back frame template");
                notStrictEqual(string.getTemplate("default"), 'error', "Get back 'default value' button action template");
                notStrictEqual(string.getTemplate("error"), 'error', "Get back error validator template");
                notStrictEqual(string.getTemplate("localization"), 'localization', "Get back localization button action template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in editor string can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor String stub load", 3, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/editor/string/mocks/stub.editor.string.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.editor.string.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json.caption, "Nombre de la Propiedad", "displayName in stub is \"Nombre de la Propiedad\"");
            strictEqual(json.showLocalization, true, "showLocalization in stub is true");
            
            start();
        }).fail(function() {
            ok(false, "File stub.editor.string.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor String render (renderEditor)", 4, function() {
        
        var inlineStub =
        {
            "caption": "Nombre de la Propiedad", 
            "helpText": "Texto de Ayuda de la Propiedad", 
            "name": "NombrePropiedad", 
            "type": "string", 
            "value": "Valor de la Propiedad", 
            "showLocalization": true, 
            "orientation": "horizontal"
        };
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var string = new bizagi.editor.component.editor.string(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(string.render !== undefined, "Method render in editor string exist");
        
        stop();
        string.loadTemplates().done(function() {
            $.extend(string.options, inlineStub); // Se cargan los datos de prueba
            
            ok(string.renderEditor !== undefined, "Method renderEditor in editor string exist");
            string.renderEditor(string.element, string.options);
            ok(!!container.find("> div > label").length && !!container.find("> div > div > input").length, "HTML struct editor in editor string created");
            
            ok(string.remove !== undefined, "Method remove in editor string exist");
            
            start();
            string.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor String events", 3, function() {
        
        var inlineStub =
        {
            "caption": "Nombre de una Nueva Propiedad", 
            "helpText": "Texto de Ayuda de una Nueva Propiedad", 
            "name": "NombreNuevaPropiedad",
            "type": "string",
            "value": "Valor de una Nueva Propiedad", 
            "showLocalization": true, 
            "orientation": "horizontal"
        };
        
        var containerString = $("<div></div>");
        var containerProperties = $("<div></div>");
        containerString.prependTo("body");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, { render : { id : 1 } });
        var string = new bizagi.editor.component.editor.string(containerString, inlineStub, properties);
        
        ok(string.controller.publish !== undefined, "Check controller.publish in Editor String");
        
        ok(properties.subscribe !== undefined, "Check subscribe in properties presenter");
        
        function PropertiesComm(args) {
            ok(true, "External test succesfuly called (MessageEditorProperties)");
            string.remove();
        }
        
        properties.subscribe("propertyEditorChanged", function(event, args) {
            PropertiesComm(args);
        });
        
        stop();
        string.render().done(function() {
            var input = string.element.find("input").val("cambio");
            var event = $.Event("keydown");
            event.keyCode = 13;
            input.trigger(event);
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    //
    
});