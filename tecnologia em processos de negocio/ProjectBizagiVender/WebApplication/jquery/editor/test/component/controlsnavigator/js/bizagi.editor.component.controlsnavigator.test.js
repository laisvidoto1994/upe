/*
@title: Test Controls Navigator Component
@authors: Rhony Pedraza
@date: 28-feb-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Controls Navigator Test");
    
    test("Check Controls Navigator creation", 5, function() {
        
        ok(!!$.fn.bizagi_editor_component_controlsnavigator, "Widget creation");
        
        var container = $("<div />");
        var controls = new  bizagi.editor.component.controlsnavigator(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_controlsnavigator"], "Widget $.data register (call to setup)");
        
        // Las variables son creadas correctamente
        ok(!!controls.options, "Exist this.options in the instance");
        ok(!!controls.element, "Exist this.element in the instance");
        
        controls.update( {value: "value"} );
        
        strictEqual(controls.options.value, "value", "Value is updated");
        
    });
    
    test("Check Controls Navigator templates", 3, function(){
        
        var container = $("<div />");
        var controls = new bizagi.editor.component.controlsnavigator(container);
        
        // Se revisa la carga de las plantillas
        ok(!!controls.tmpl, "Templates array is in plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate("jquery/editor/component/controlsnavigator/tmpl/bizagi.editor.component.controlsnavigator.tmpl.html")
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
    
    test("Check Controls Navigator templates load", 2, function() {
        
        var container = $("<div />");
        var controls = new bizagi.editor.component.controlsnavigator(container);
        
        // Validacion de la carga de las plantillas
        stop();
        controls.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(controls.tmpl), "Templates successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(controls.getTemplate("group"), null, "Get back template");
                
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
    
    test("Check Controls Navigator stub load", 4, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/controlsnavigator/mocks/stub.controlsnavigator.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File loaded successfuly");
            start();
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            ok(json.minitoolbar.groups !== undefined, "Groups exist");
            strictEqual(json.minitoolbar.groups[0].items.length, 2, "Items exist and is equal to 2");
            
            var container = $("<div />");
            var controls = new bizagi.editor.component.controlsnavigator(container, json);
            
            // Valida parte del contenido dentro del componente
            strictEqual(controls.options.minitoolbar.groups[0].items[1].id, "text", "Items in component exist and is equal to text");
            
        }).fail(function() {
            ok(false, "File loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Controls Navigator render", 4, function() {
        
        var inlineStub = {
            minitoolbar : {
                groups : [{
                    collapsed : "false",
                    id : "basic-renders",
                    name : "Basic Renders",
                    
                    items : [{
                        id : "label",
                        name : "Label",
                        type : "render"
                    }, {
                        id : "text",
                        name : "Text",
                        type: "render"
                    }]
                }]
            }
        };
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var controls = new bizagi.editor.component.controlsnavigator(container);
        
        // Se modifica this.elemente despues de aplicar el render
        ok(controls.render !== undefined, "Method render");
        
        stop();
        controls.loadTemplates().done(function() {
            $.extend(controls.options, inlineStub); // Se cargan los datos de prueba
            
            ok(controls.renderGroups !== undefined, "Method renderGroup");
            ok(controls.renderItems !== undefined, "Method renderItems");
            
            controls.renderGroups(controls.element, controls.options.minitoolbar.groups);
            
            ok(!!container.find(".mtool-group").length, "HTML struct created");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Controls Navigator events", 2, function() {
        
        var inlineStub2 = {
            minitoolbar : {
                groups : [{
                    collapsed : "false",
                    id : "basic-renders",
                    name : "Basic Renders 2",
                    
                    items : [{
                        id : "label",
                        name : "Label 2",
                        type: "render"
                    }, {
                        id : "text",
                        name : "Text 2",
                        type: "render"
                    }]
                }]
            }
        };
        
        function ControlsNavigatorComm(args) {
            console.group("CONTROLS NAVIGATOR COMM");
            console.debug("args", args);
            console.groupEnd();
        }
        
        var container = $("<div />");
        var controlsnavigator = new bizagi.editor.component.controlsnavigator.presenter(container, inlineStub2);
        container.prependTo("body");
        
        controlsnavigator.subscribe("MessageMinitoolbar", function(event, args) {
            ControlsNavigatorComm(args);
            ok(true, "Succesful called")
        });
        
        ok(!!controlsnavigator.subscribe, "Check for subscribe");
        
        // Se valida el llamado despues de lanzar el evento
        stop();
        controlsnavigator.render().done(function() {
            $(".mtool-item:nth-child(1)", container).trigger("dblclick");
            start();
        });
        
    });
    
    //
    
});
