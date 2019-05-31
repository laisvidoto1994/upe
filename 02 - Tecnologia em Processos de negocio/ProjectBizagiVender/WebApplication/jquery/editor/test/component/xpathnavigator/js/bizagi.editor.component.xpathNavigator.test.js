/*
 * Author : David Montoya
 * Date   : 15mar12 
 * Comments:
 *     Define basic test for the presenter of the xpath navigator component
 *
 */
 
bizagi.loader.then( function() {

	module("Xpath_navigator_component");
	
    test("Check_xpathNavigator_creation", function() {
        
        ok(!!$.fn.xpathnavigator, "Widget creation");
        
        var container = $("<div />");
        var xpathNavigator = new Xpathnavigator(container);
        
        // Execute ok for setup function of widget
        ok(!!container.data("controllers")["xpathnavigator"], "Widget $.data register (call to setup)");
        
        // Las variables son creadas correctamente
        ok(!!xpathNavigator.options, "Exist this.options in the instance");
        ok(!!xpathNavigator.element, "Exist this.element in the instance");
        
        xpathNavigator.update( {value: "value"} );
        
        strictEqual(xpathNavigator.options.value, "value", "Value is updated");

    });

   test("Check_xpathNavigator_templates", 5, function(){
        
        var container = $("<div />");
        var xpathNavigator = new Xpathnavigator(container);
        
        // Se revisa la carga de las plantillas
        ok(!!xpathNavigator.tmpl, "Templates array is in plugin");
        
        ok(bizagi.templateService.getTemplate, "Check bizagi getTemplate service");
        
        // Validacion del metodo de rendering que carga las plantillas
        stop();
        bizagi.templateService.getTemplate("jquery/editor/component/xpathnavigator/tmpl/bizagi.editor.component.xpathnavigator.tmpl.html")
            .done(function(tmpl) {
                ok(!!tmpl, "Template can be loaded");                
                start();
            })
            .fail(function() {
                ok(false, "Template can not be loaded");
                start();
            });
        setTimeout(function() {
            ok(false, "Template can not be loaded, timeout");
            start();
        }, 1000);
        
        // Validacion de la carga de las plantillas
        stop();
        xpathNavigator.loadTemplates()
            .done(function() {
                ok(!$.isEmptyObject(xpathNavigator.tmpl), "Template successfuly loaded");
                
                // Validacion de la devolucion de una plantilla
                var templateNode = xpathNavigator.getTemplate("node"); 
                console.log(templateNode);
                notStrictEqual(templateNode, null, "Get back template node");
                
                start();
            })
            .fail(function() {
                ok(false, "Templates can not be loaded");
                start();
            });
        setTimeout(function() {
            ok(false, "Template can not be loaded, timeout");
            start();
        }, 1000);
       
    });

    
    test("Check_xpathNavigator_render", 3, function() {
        
        var container,
            xpathNavigator,
            model,
            inlineStub = {
                        
                            "nodes" : [
                                { "guid": "attribute-10001", "displayName": "Texto", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-string", "xpath": "cliente.apellido",  "renderType" : "text"},
                                { "guid": "attribute-10002", "displayName": "Fecha de nacimiento", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-date", "xpath": "cliente.fechaNacimiento", "renderType" : "date" },
                                { "guid": "attribute-10003", "displayName": "Numero", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-number", "xpath": "cliente.identificacion", "renderType" : "number"},
                                { "guid": "attribute-10004", "displayName": "Booleano", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-boolean", "xpath": "cliente.habilitado", "renderType" : "boolean"},
                                { "guid": "attribute-10005", "displayName": "Flotante", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-float", "xpath": "cliente.estatura", "renderType" : "number"},
                                { "guid": "attribute-10006", "displayName": "Carta", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-letter", "xpath": "cliente.cartaPresentacion", "renderType" : "letter"},
                                { "guid": "attribute-10007", "displayName": "Archivo", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-attachment", "xpath": "cliente.attachment" , "renderType" : "upload"},
                                { "guid": "attribute-10017", "displayName": "Moneda", "canHasChildren": "false", "style": "ui-bizagi-type-attribute-currency", "xpath": "cliente.moneda", "renderType" : "money"},
                                { "guid": "collection-10008", "displayName": "Coleccion", "canHasChildren": "true", "style": "ui-bizagi-type-collection", "xpath": "cliente.collection", "renderType" : "grid"},
                                { "guid": "entity-10010", "displayName": "Maestra", "canHasChildren": "true", "style": "ui-bizagi-type-entity-master", "xpath": "cliente.Master", "renderType" : "search"},
                                { "guid": "entity-10009", "displayName": "Parametrica", "canHasChildren": "true", "style": "ui-bizagi-type-entity-parametric", "xpath": "cliente.ciudad", "renderType" : "combo"},
                                { "guid": "entity-10011", "displayName": "Sistema", "canHasChildren": "true", "style": "ui-bizagi-type-entity-system", "xpath": "cliente.system", "renderType" : "combo"},
                                { 
                                    "guid": "node-form-10016", 
                                    "canHasChildren": "true", 
                                    "style": "bizagi-node-forms", 
                                    "isDragabble" : "false",
                                    "nodes" : [
                                        { "guid": "entity-form-10016", "displayName": "FormaDemo", "canHasChildren": "false", "style": "ui-bizagi-type-form", "xpath": "cliente.forms"}
                                    ]
                                }                       
                            ]
                        };
        
        container = $("<div />");
        container.appendTo("body"); // Local test
        
        xpathNavigator = new Xpathnavigator(container);
        
        ok(xpathNavigator.render !== undefined, "Method render exists");
        
        stop();
        xpathNavigator.loadTemplates().done(function() {
            //$.extend(xpathNavigator.options, inlineStub); // Se cargan los datos de prueba
            
            ok(xpathNavigator.renderNodes !== undefined, "Method renderNodes");
            
            model = new bizagi.editor.component.xpathnavigator.model(inlineStub);
            xpathNavigator.renderNodes(xpathNavigator.element, model.nodes);
            
            ok(!!container.find("#attribute-10001").length, "HTML struct created");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        container.remove();
    });


    test("Check_xpathNavigator_presenter", 4, function() {
        var model,
            that = this,
            container = $("<div />"),
            inlineStub = {
				    "nodes": [
				        { "guid": "attribute-20002", "displayName": "Apellido", "canHasChildren": "false",  "style": "ui-bizagi-type-attribute-string", "xpath": "cliente.apellido", "renderType" : "text"},
				        { "guid": "attribute-20003", "displayName": "Ciudad", "canHasChildren": "true",  "style": "ui-bizagi-type-entity-parametric", "xpath": "cliente.ciudad", "renderType" : "combo"}
				    ]    
				};
        
        container.prependTo("body");
        
        ok(bizagi.editor.component.xpathnavigator.presenter !== undefined, "Check presenter");
        
        model = new bizagi.editor.component.xpathnavigator.model(inlineStub);
        that.presenter = new bizagi.editor.component.xpathnavigator.presenter(container, model);
        
        ok(that.presenter.create !== undefined, "Check presenter create");
        
        ok(that.presenter.render !== undefined, "Check presenter render");
        
        stop();
        that.presenter.render(model).done(function() {   
            // Se revisa si se pinto
            ok(!!that.presenter.xpathNavigator.element.find("#attribute-20002").length && !!that.presenter.xpathNavigator.element.find("#attribute-20003").length, "HTML struct created");
            start();
        });
        setTimeout(function() {
            start();
        }, 1000);
        
    });

})
