/*
*   Name: BizAgi Smartphone Workportal Facade
*   Author: oscaro
*   Comments:
*   -   This script will define a workportal facade to access to all components
*/


$.Class.extend("bizagi.workportal.smartphone.facade", {
    /*
    *   Returns the implementation class by widget
    */
    getWidgetImplementation: function (widget) {
        bizagi.log("getWidgetImplementation" + widget);
    }
},
 {
     /* 
     *   Constructor
     */
     init: function (dataService) {
         this.templates = {};
         this.dataService = dataService;
         this.setIPhoneMetaTags();
         this.setTmpviewKendo();
     },

     setTmpviewKendo: function () {
         $('<div data-role="view" id="initKendo"></div>').appendTo('body');
     },

     /* SETS iPhone META TAGS
     =====================================================*/
     setIPhoneMetaTags: function () {
         $('<meta>', {
             name: "apple-mobile-web-app-capable",
             content: "yes"
         }).appendTo('head');

         $('<meta>', {
             name: "viewport",
             content: "width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no"
         }).appendTo('head');

         $('<link>', {
             rel: 'apple-touch-icon-precomposed',
             href: 'jquery/common/base/css/smartphone/images/BizAgi_logo.png'
         }).appendTo('head');

         $('<link>', {
             rel: 'apple-touch-startup-image',
             href: 'jquery/common/base/css/smartphone/images/splash.png'
         }).appendTo('head');
     },

     /*
     *   This function will load asynchronous stuff needed in the module
     */
     initAsyncStuff: function () {
         var self = this;
         // Load default templates	
         return $.when(self.loadTemplates());
     },
     /*
     *   Load all the templates used in the workportal
     */
     loadTemplates: function () {
         var self = this;
         var defer = new $.Deferred();
         $.when(
            self.loadTemplate("base", bizagi.getTemplate("bizagi.workportal.smartphone") + "#bz-workportal"),
            self.loadTemplate("base.popup", bizagi.getTemplate("bizagi.workportal.smartphone") + "#bz-workportal-popup"),
         // MENU
           self.loadTemplate("menu", bizagi.getTemplate("bizagi.workportal.smartphone.menu") + "#ui-bizagi-workportal-menu-content"),
           self.loadTemplate("menu.items", bizagi.getTemplate("bizagi.workportal.smartphone.menu") + "#ui-bizagi-workportal-widget-menu-items"),
           self.loadTemplate("menu.search.results", bizagi.getTemplate("bizagi.workportal.smartphone.widget.search") + "#ui-bizagi-workportal-widget-search-details"),
        // RENDER EDITION (create dinamyc view)
           self.loadTemplate("render.edition", bizagi.getTemplate("bizagi.workportal.smartphone.widget.render") + "#bz-wp-widget-renderedition"),
           self.loadTemplate("render.routing", bizagi.getTemplate("bizagi.workportal.smartphone.widget.routing")),
         //ActionSheet
           self.loadTemplate("render.actionsheet", bizagi.getTemplate("bizagi.workportal.smartphone.widget.render") + "#bz-wp-widget-render-dynamics")
        ).done(function () {
            // Resolve when all templates are loaded
            defer.resolve();
        });
         return defer.promise();
     },

     /*
     *   Load one template and save it internally
     */
     loadTemplate: function (template, templateDestination) {
         var self = this;
         // Go fetch the template
         return bizagi.templateService.getTemplate(templateDestination)
        .done(function (resolvedRemplate) {
            self.templates[template] = resolvedRemplate;
        });
     },

     /*
     *   Method to fetch templates from a private dictionary
     */
     getTemplate: function (template) {
         var self = this;
         return self.templates[template];
     },

     /*
     *   Returns the main controller to be used
     */
     getMainController: function () {
         return new bizagi.workportal.controllers.main(this, this.dataService);
     },

     /*
     *   Returns the menu controller to be used
     */
     getMenuController: function () {
         return new bizagi.workportal.controllers.menu(this, this.dataService);
     },
     /*
     *   Returns the workarea controller to be used
     */
     getWorkareaController: function () {
         bizagi.log("getWorkareaController  not allowed");
         //  return new bizagi.workportal.controllers.workarea(this, this.dataService);
     },

     /*
     *   Returns the desired widget
     */
     getWidget: function (widget, params) {
         bizagi.log("getWidget  not allowed" + widget);
     },

     /*
     *   Returns the desired action
     */
     getAction: function (action, params) {
         if (action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING) {
             return new bizagi.workportal.actions.routing(this, this.dataService, params);
         }

         if (action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH) {
             return new bizagi.workportal.actions.search(this, this.dataService, params);
         }

         // No type supported
         bizagi.log(action + " action not supported", params, "error");
         return null;
     },

     /*
     *   Initializes a webpart
     */
     loadWebpart: function (params) {
         var self = this;
         var defer = new $.Deferred();
         var webpartName = params.webpart;
         var webpart = bizagi.getWebpart(webpartName, params); //self.getWebpart(webpartName, params);
         if (!webpart) {
             bizagi.log("webpart not found");
         }

         // Ensure the webpart is initialized
         $.when(bizagi.util.initWebpart(webpart))
        .done(function () {
            // Load all templates asyncronously
            $.when.apply(this, $.map(webpart.tmpl, function (tmpl) {
                return self.loadTemplate(tmpl.originalAlias, bizagi.getTemplate(tmpl.alias, true));
            })).done(function () {
                defer.resolve(webpart);
            });

        });
         return defer.promise();
     },

     /*
     *   Returns a webpart  
     */
     getWebpart: function (webpartImplementation, params) {
         try {
             // Create a dynamic function to avoid problem with eval calls when minifying the code
             if (webpartImplementation.indexOf("bizagi") == "-1") {
                 webpartImplementation = "bizagi.workportal.webparts." + webpartImplementation
             
              }
             var dynamicFunction = "var baDynamicFn = function(facade, dataService, params){ \r\n";
             dynamicFunction += "return new " + webpartImplementation + "(facade, dataService, params);\r\n";
             dynamicFunction += "}\r\n";
             dynamicFunction += "baDynamicFn";
             dynamicFunction = eval(dynamicFunction);
             // Call the dynamic function
             return dynamicFunction(this, this.dataService, params);
         } catch (e) {
             bizagi.log(e);
         }
     },
     /*
     * call the render method for webparts and insert into canvas
     */
     executeWebpart: function (params) {
         var self = this;
         var defer = new $.Deferred();
         var doc = this.ownerDocument;
         // Creates ready deferred
         var canvas = params.canvas || $("<div/>").appendTo($("body", doc));

         $.when(self.loadWebpart(params)).done(function (webpart) {
             var webpartImplementation = webpart["class"];
             dynamic = self.getWebpart(webpartImplementation, params);

             $.when(dynamic.render({ creating: false })).done(function (result) {
                 canvas.append(result);
                 defer.resolve(dynamic);
             });
         });
         return defer.promise();
     }

 });