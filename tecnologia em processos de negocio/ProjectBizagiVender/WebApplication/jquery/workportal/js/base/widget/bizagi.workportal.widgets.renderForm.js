
/*
 *   Name: BizAgi Workportal Render Widget Controller
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base class to to define the render widget
 *       the rendering module is loaded here
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.renderform", {}, {

    /*
     *   Returns the widget name
     */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER_FORM;
    },

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
    	
        // Check if the required params are filled
        if (bizagi.util.isEmpty(params.idForm)) {
        
            if(!bizagi.util.isEmpty(window.location.hash)){
                // Check in the hash
                var hashParams = bizagi.util.getHashParams();
        		
                // Set the first hash param as the idCase
                if (hashParams.length > 1) {
                    params.idCase = hashParams[1];
                    self.isConfiguredFromHash = true;
                }
        		
                // Set the second hash param as the idWorkitem
                if (hashParams.length > 2) {
                    params.idWorkitem = hashParams[2];
                }
            } else if(!bizagi.util.isEmpty(window.location.search)){
                var queryString = bizagi.util.getQueryString();
                
                // Set idCase param from query string
                if (queryString["idEntity"]){
                    params.idEntity = queryString["idEntity"];
                    self.isConfiguredFromHash = true;
                }
                
                // Set idWorkitem param from query string
                if (queryString["surrogateKey"]){
                    params.surrogateKey = queryString["surrogateKey"];
                }
            }
        }

        // Call base
        self._super(workportalFacade, dataService, params);
    },

    /*
     *   Renders the content for the current controller
     *   Returns a deferred because it has to load the current user
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("renderform");
        var summaryDeferred = new $.Deferred(); 
    	
        // Check if the required params are filled
        if (bizagi.util.isEmpty(self.params.idForm)) {
            self.changeWidget(bizagi.workportal.currentInboxView);
            return null;
        }
    	
        // Render base template
        self.content = $.tmpl(template);
    
        // Check if the content is already in dom
        var includedInDom = self.content.parents("body").length > 0;
        if (includedInDom) {
            self.renderForm();
        } else {
            // Wait until the dom is ready to execute the rendering, because some controls need references to full DOM
            // (grids and uploads)
            self.subscribeOneTime("onWidgetIncludedInDOM", function() {
            	
                // Load render page
                self.renderForm({
                    idEntity: self.params.idEntity,
                    surrogateKey: self.params.surrogateKey
                });
            });
        }
    },
    
    /*
     *   Renders the form component of the widget
     */
    renderForm: function(params){
        var self = this;
        
        
        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";
        // Load render page
        var rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });
        var renderContainer = self.getComponentContainer("render");
    
        // Executes rendering into render container
        rendering.execute($.extend(params, {
            canvas: renderContainer	
        }));
    
        // Attach handler to render container to subscribe for routing events
        renderContainer.bind("routing", function(){
            // Executes routing action
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: self.params.idCase,
                onClose: function () {
                    // If the user closes the dialog we need to redirect to inbox widget
                    self.publish("changeWidget", {
                        widgetName : bizagi.workportal.currentInboxView
                    }); 
                }
            });
        });
    	
        // Keep reference to rendering facade
        self.renderingFacade = rendering;
    
        // Resize layout
        self.resizeLayout();
    }  
});
