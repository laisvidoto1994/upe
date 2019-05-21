/*
@title: Test Decorator Component
@authors: Rhony Pedraza
@date: 14-mar-12
*/
bizagi.loader.then(function() {
    
    //
    
    module("Decorator Test");
    
    test("Check Decorator creation", 3, function() {
        
        ok(!!$.fn.bizagi_editor_component_decorator, "Widget (plugin) bizagi_editor_component_decorator() creation");
        
        var container = $("<div />");
        var decorator = new bizagi.editor.component.decorator(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_decorator"], "Widget (plugin) $.data register (call to setup)");
        
        decorator.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(decorator.options.value, "value", "Value is updated in this.options");
        
    });
    
    test("Check Decorator templates", 5, function(){
        
        var container = $("<div />");
        var decorator = new bizagi.editor.component.decorator(container);
        
        // Se revisa la carga de las plantillas
        ok(!!decorator.tmpl, "tmpl object is in component");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service (bizagi.templateService.getTemplate)");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.decorator"))
            .done(function(tmpl) {
                ok(!!tmpl, "Template can be loaded with bizagi.templateService.getTemplate(bizagi.getTemplate(NAME_TEMPLATE)");
                start();
            })
            .fail(function() {
                ok(false, "Template can not be loaded with bizagi.templateService.getTemplate(bizagi.getTemplate(NAME_TEMPLATE)");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
        // Validacion de la carga de las plantillas
        stop();
        decorator.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(decorator.tmpl), "Templates successfuly loaded within loadTemplates()");
                
                // Validacion de la devolucion de una plantilla
                notStrictEqual(decorator.getTemplate("frame"), null, "Template (frame) return is not null");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates can not be loaded within loadTemplates()");
                start();
            });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Properties stub load", 4, function() {
        
        stop();
        $.ajax({
            url : "jquery/editor/component/decorator/mocks/stub.decorator.json.txt",
            dataType : "text"
        }).done(function(json) {
            ok(!!json, "File jquery/editor/component/decorator/mocks/stub.decorator.json.txt loaded successfuly");
            start();
            
            json = JSON.parse(json);
            
            // Valida parte del contenido del stub
            ok(json.decorator.position !== undefined, "Decorator position exist");
            ok(json.decorator.position.width == 100 && !$.isEmptyObject(json.properties), "Decorator width (relative) is 100 and properties exist");
            
            var container = $("<div />");
            var decorator = new bizagi.editor.component.decorator(container, json);
            
            // Valida parte del contenido dentro del componente
            strictEqual(json.decorator.position.left, decorator.options.decorator.position.left, "json and this.options are equals");
            
        }).fail(function() {
            ok(false, "File stub.decorator.json.txt not loaded successfuly");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Decorator render (renderDecorator)", 3, function() {
        
        var inlineStub = {
            decorator : {
                position : { }
            },
            properties : {
                render : { }
            }
        };
        
        var container = $("<div />");
        container.prependTo("body"); // Local test
        
        var decorator = new bizagi.editor.component.decorator(container);
        
        // Se modifica this.element despues de aplicar el render
        ok(decorator.render !== undefined, "Method render in decorator");
        
        stop();
        decorator.loadTemplates().done(function() {
            $.extend(decorator.options, inlineStub); // Se cargan los datos de prueba
            
            ok(decorator.renderDecorator !== undefined, "Method renderDecorator exist");
            
            decorator.renderDecorator(decorator.element);
            
            ok(!!container.find("> .decorator-image").length && !!container.find("> .decorator-gear").length, "HTML image and gear struct created");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Decorator presenter and position", 5, function() {
        
        var inlineStub = {
            decorator : {
                position : {
                    top : 5,
                    left : 5,
                    width  : 100
                }
            },
            properties : {
                render : { }
            }
        };
        
        var containerDecorator = $("<div />");
        containerDecorator.prependTo("body");
        
        ok(bizagi.editor.component.decorator.presenter !== undefined, "Check presenter bizagi.editor.component.decorator.presenter");
        
        var decorator = new bizagi.editor.component.decorator.presenter(containerDecorator, inlineStub);
        
        ok(decorator.create !== undefined, "Check presenter create");
        
        ok(decorator.render !== undefined, "Check presenter render");
        
        stop();
        decorator.render().done(function(decorator) {   
            // Se revisa si se pinto
            ok(!!decorator.element.find("> .decorator-image").length && !!decorator.element.find("> .decorator-delete").length, "HTML > .decorator-image and > .decorator-delete struct created");
            var coords = {
                top : inlineStub.decorator.position.top - decorator.element.outerHeight() + 1,
                left : inlineStub.decorator.position.left + inlineStub.decorator.position.width - decorator.element.outerWidth() + 2
            };
            deepEqual(decorator.element.offset(), coords, "Check position coords");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    test("Check Decorator events and remove", 6, function() {
        
        var inlineStub = {
            decorator : {
                position : {
                    top : 15,
                    left : 15,
                    width  : 300
                }
            },
            properties : {
                render : { }
            }
        };
        
        var containerDecorator = $("<div />");
        containerDecorator.prependTo("body");
        
        ok(bizagi.editor.component.decorator.presenter !== undefined, "Check presenter bizagi.editor.component.decorator.presenter");
        
        var decorator = new bizagi.editor.component.decorator.presenter(containerDecorator, inlineStub);
        
        ok(decorator.subscribe !== undefined, "Check subscribe in component");
        
        function DecoratorComm(args) {
            ok(true, "Internal click succesfuly called");
        }
        
        decorator.subscribe("MessageDecorator", function(event, args) {
            DecoratorComm(args);
        });
        
        stop();
        decorator.render().done(function(decorator) {
            // Se revisa si se pinto
            ok(!!decorator.element.find("> .decorator-image").length && !!decorator.element.find("> .decorator-data-bind").length, "HTML > .decorator-image and > .decorator-data-bind struct created");
            start();
            // Se lanza el evento
            $(".decorator-gear", decorator.element).trigger("click");
            ok(decorator.remove !== undefined, "Check remove in component");
            // Se revisa remove
            decorator.remove();
            equal(decorator.element.children().length, 0, "Child removed from this.element");
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });
    
    //
    
});