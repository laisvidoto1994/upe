/*
*   Name: BizAgi Generic Page Widget Implementation
*   Author: Diego Parra
*   Comments:
*/


// Extends itself
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.entities", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ENTITIES;
    },

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "entities": bizagi.getTemplate("bizagi.workportal.desktop.widget.entities").concat("#ui-bizagi-workportal-widget-entities"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        
        var deferred = new $.Deferred();

        var template = self.getTemplate("entities");
        /*
        var data = { entitiesURL: self.dataService.getUrl({ "endPoint": "EntityAdmin" }) };
        
        var content = $.tmpl(template, data);
        
        var iframe = $("#entitiesIFrame", content);
        
        // Wait until the iframe has been loadedpip
        iframe.load(function(){
            iframe.callInside(function(params){
            alert('1');
                // This script will execute inside the iframe context
                this.newentity = function(idEntity){
                    self.publish("showDialogWidget", {
    	                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PAGE,
    	                context: "entitymanagement",
                        idForm: idForm,
                        idEntity: idEntity,
    			        modalParameters: {
    			            title: self.getResource("workportal-menu-preferences"),
    			            width:"1020px",
    			            showCloseButton: false
    			        }
                    });
                
                    params.controller.publish("closeCurrentDialog");
                };
            }, { });
        });
*/
        $.when(self.dataService.getAllAdministrableEntities())
           .done(function(data) { 
              var content = self.content = $.tmpl(template, data);
              
              $(".bz-wp-widget-entities li", content).click(function() {
                 var idEntity = $(this).data("entity-id");
                 var idForm = $(this).data("entity-form");
                 self.renderEntityData(content, idEntity, idForm);
              });
              deferred.resolve(content);
           });

        // Return content
        return deferred.promise();;
    },
    
    renderStaticForm: function (params) {
        var self = this;
        var canvas = params.content;
        var rendering = new bizagi.rendering.facade(params.context);

        // Executes rendering into render container
        params = params || {};
    	$.extend(params, {
    	    canvas: canvas,
    	    customHandlers: {
    	        onGridAdd: function(){
                    self.publish("showDialogWidget", {
    	                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PAGE,
    	                context: "entitymanagement",
                        idForm: params.idForm,
                        idEntity: params.idEntity,
    			        modalParameters: {
    			            title: self.getResource("workportal-menu-preferences"),
    			            width:"1020px",
    			            showCloseButton: false
    			        },
    			        customHandlers: {
    	                    afterFormButtonClick: function(button){
                                self.publish("closeCurrentDialog");
    	                    }
    			        }
                    });
    	        },
    	        onGridEdit: function(surrogateKey){
                    self.publish("showDialogWidget", {
    	                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PAGE,
    	                context: "entitymanagement",
                        idForm: params.idForm,
                        idEntity: params.idEntity,
                        surrogateKey: surrogateKey,
    			        modalParameters: {
    			            title: self.getResource("workportal-menu-preferences"),
    			            width:"1020px",
    			            showCloseButton: false
    			        },
    			        customHandlers: {
    	                    afterFormButtonClick: function(button){
                                self.publish("closeCurrentDialog");
                                self.renderEntityData(params.content, params.idEntity, params.idForm);
    	                    }
    			        }
                    });
    	        }
    	    }
        });
        
        rendering.execute(params);

        canvas.bind("close", function () {
            self.publish("closeCurrentDialog");            
        });
    },
    
    renderEntityData: function(content, idEntity, idForm) {
        var self = this;
        content.empty();
        $.when(self.dataService.getEntitiesList({ idEntity: idEntity, page: 1}))
         .done(function(data) {
                self.renderStaticForm({context: "entitymanagement", content: content, idEntity: idEntity, idForm: idForm, data: data});
               });
                
                /*
                var facade = new bizagi.rendering.facade();
                facade.p
                var renderFactory = facade.renderFactory;
                $.when(renderFactory).done(function(factory) {
                        var grid = factory.getRender('grid', data, content);
                    });
               });
               */

/*
                    self.publish("showDialogWidget", {
    	                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PAGE,
    	                context: "entitymanagement",
                        idForm: idForm,
                        idEntity: idEntity,
    			        modalParameters: {
    			            title: self.getResource("workportal-menu-preferences"),
    			            width:"1020px",
    			            showCloseButton: false
    			        }
                    });
*/        
    }
});

