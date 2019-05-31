/*
@title: Test Editor BooleanRule Component
@authors: Rhony Pedraza
@date: 07-may-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Editor BooleanRule Test");
    
    test("Check Editor BooleanRule creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor creation");
        ok(!!$.fn.bizagi_editor_component_editor_booleanrule, "Widget (plugin $.Controller) bizagi_editor_component_editor_booleanrule creation");
        
        var container = $("<div></div>");
        var booleanrule = new bizagi.editor.component.editor.booleanrule(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_booleanrule"], "Widget (plugin) $.data register (call to setup)");
        
        booleanrule.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(booleanrule.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.booleanrule");
        
    });
    
    test("Check Editor BooleanRule templates", 3, function(){
        
        var container = $("<div />");
        var booleanrule = new bizagi.editor.component.editor.booleanrule(container);
        
        // Se revisa la carga de las plantillas
        ok(!!booleanrule.tmpl, "Templates object is in editor booleanrule plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.editor.booleanrule"))
            .done(function(tmpl) {
                ok(!!tmpl, "Editor BooleanRule templates can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Editor BooleanRule templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor BooleanRule templates load", 2, function() {
        
        var container = $("<div />");
        var booleanrule = new bizagi.editor.component.editor.booleanrule(container);
        
        // Validacion de la carga de las plantillas
        stop();
        booleanrule.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(booleanrule.tmpl), "Templates in editor booleanrule successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(booleanrule.getTemplate("frame"), null, "Get back \"frame\" template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in editor booleanrule can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor BooleanRule stub load", 3, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/editor/booleanrule/mocks/stub.editor.booleanrule.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.editor.booleanrule.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json.displayName, "Editable", "displayName in stub is \"Editable\"");
            strictEqual(json.type, "booleanrule", "type in stub is \"booleanrule\"");
            
            start();
        }).fail(function() {
            ok(false, "File stub.editor.booleanrule.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor BooleanRule render (renderEditor)", 4, function() {
        
        var inlineStub =
        {
            "displayName": "Editable", 
            "helptext": "Determine if the render will be editable or not", 
            "name": "editable",
            "type": "booleanrule",
            "value": false,
            "expression" : "expression"
        }
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var booleanrule = new bizagi.editor.component.editor.booleanrule(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(booleanrule.render !== undefined, "Method render in editor booleanrule exist");
        
        stop();
        booleanrule.loadTemplates().done(function() {
            $.extend(booleanrule.options, inlineStub); // Se cargan los datos de prueba
            
            ok(booleanrule.renderEditor !== undefined, "Method renderEditor in editor booleanrule exist");
            booleanrule.renderEditor(booleanrule.element, booleanrule.options);
            ok(!!container.find("> div > label").length && !!container.find("> div > div > ul > li").length, "HTML struct editor in editor booleanrule created");
            
            ok(booleanrule.remove !== undefined, "Method remove in editor booleanrule exist");
            
            start();
            booleanrule.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor BooleanRule events", 3, function() {
        
        var inlineStub =
        {
            "displayName": "Editable", 
            "helptext": "Determine if the render will be editable or not", 
            "name": "editable",
            "type": "booleanrule",
            "value": false,
            "expression" : "expression"
        }
        
        var containerBooleanrule = $("<div></div>");
        var containerProperties = $("<div></div>");
        containerBooleanrule.prependTo("body");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, { render : { id : 1 } });
        var booleanrule = new bizagi.editor.component.editor.booleanrule(containerBooleanrule, inlineStub, properties);
        
        ok(booleanrule.controller.publish !== undefined, "Check controller.publish in Editor BooleanRule");
        
        ok(properties.subscribe !== undefined, "Check subscribe in properties presenter");
        
        function PropertiesComm(args) {
            ok(true, "External test succesfuly called (MessageEditorProperties)");
            booleanrule.remove();
        }
        
        properties.subscribe("propertyEditorChanged", function(event, args) {
            PropertiesComm(args);
        });
        
        stop();
        booleanrule.render().done(function() {
            var input = booleanrule.element.find("input");
            var button = input.next();
            var box = button.next();
            
            input.focus();
            button.trigger("click");
            box.find("li:eq(0)").trigger("click");
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    //
    
});