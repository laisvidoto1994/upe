/*
@title: Test Editor Rendertype Component
@authors: Rhony Pedraza
@date: 09-may-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Editor Rendertype Test");
    
    test("Check Editor Rendertype creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor creation");
        ok(!!$.fn.bizagi_editor_component_editor_rendertype, "Widget (plugin $.Controller) bizagi_editor_component_editor_rendertype creation");
        
        var container = $("<div></div>");
        var rendertype = new bizagi.editor.component.editor.rendertype(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_rendertype"], "Widget (plugin) $.data register (call to setup)");
        
        rendertype.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(rendertype.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.rendertype");
        
    });
    
    test("Check Editor rendertype templates", 3, function(){
        
        var container = $("<div />");
        var rendertype = new bizagi.editor.component.editor.rendertype(container);
        
        // Se revisa la carga de las plantillas
        ok(!!rendertype.tmpl, "Templates object is in editor rendertype plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.editor.rendertype"))
            .done(function(tmpl) {
                ok(!!tmpl, "Editor rendertype templates can be loaded");
                start();
            })
            .fail(function() {
                ok(false, "Editor rendertype templates can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor rendertype templates load", 2, function() {
        
        var container = $("<div />");
        var rendertype = new bizagi.editor.component.editor.rendertype(container);
        
        // Validacion de la carga de las plantillas
        stop();
        rendertype.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(rendertype.tmpl), "Templates in editor rendertype successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(rendertype.getTemplate("frame"), null, "Get back \"frame\" template");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates in editor rendertype can not be loaded");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor rendertype stub load", 4, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/editor/rendertype/mocks/stub.editor.rendertype.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File stub.editor.rendertype.json.txt loaded successfuly");
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            equal(json.displayName, "Render Type", "displayName in stub is \"Render Type\"");
            strictEqual(json.type, "rendertype", "type in stub is \"rendertype\"");
            equal(json.data.length, 4, "data length in stub is 4");
            
            start();
        }).fail(function() {
            ok(false, "File stub.editor.rendertype.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor rendertype render (renderEditor and renderOptions)", 5, function() {
        
        var inlineStub =
        {
            "displayName": "Render Type",
            "name": "renderType",
            "type": "rendertype",
            "value": "letter",
            "data": [{
                "name" : "button"
            }, {
                "name" : "hidden"
            }, {
                "name" : "label"
            }, {
                "name" : "letter",
                "selected" : true
            }]
        }
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var rendertype = new bizagi.editor.component.editor.rendertype(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(rendertype.render !== undefined, "Method render in editor rendertype exist");
        
        stop();
        rendertype.loadTemplates().done(function() {
            $.extend(rendertype.options, inlineStub); // Se cargan los datos de prueba
            
            ok(rendertype.renderEditor !== undefined, "Method renderEditor in editor rendertype exist");
            ok(rendertype.renderOptions !== undefined, "Method renderOptions in editor rendertype exist");
            rendertype.renderEditor(rendertype.element, rendertype.options);
            
            ok(!!container.find("> div > label").length && !!container.find("> div > select > option").length, "HTML struct editor in editor rendertype created");
            
            ok(rendertype.remove !== undefined, "Method remove in editor rendertype exist");
            
            start();
            rendertype.remove();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Editor rendertype events", 3, function() {
        
        var inlineStub =
        {
            "displayName": "Render Type",
            "name": "renderType",
            "type": "rendertype",
            "value": "letter",
            "data": [{
                "name" : "button"
            }, {
                "name" : "hidden"
            }, {
                "name" : "label"
            }, {
                "name" : "letter",
                "selected" : true
            }]
        }
        
        var containerRendertype = $("<div></div>");
        var containerProperties = $("<div></div>");
        containerRendertype.prependTo("body");
        
        var properties = new bizagi.editor.component.properties.presenter(containerProperties, { render : { id : 1 } });
        var rendertype = new bizagi.editor.component.editor.rendertype(containerRendertype, inlineStub, properties);
        
        ok(rendertype.controller.publish !== undefined, "Check controller.publish in Editor rendertype");
        
        ok(properties.subscribe !== undefined, "Check subscribe in properties presenter");
        
        function PropertiesComm(args) {
            ok(true, "External test succesfuly called (MessageEditorProperties)");
            rendertype.remove();
        }
        
        properties.subscribe("propertyEditorChanged", function(event, args) {
            PropertiesComm(args);
        });
        
        stop();
        rendertype.render().done(function() {
            var select = rendertype.element.find("select");
            select.trigger("change");
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    //
    
});