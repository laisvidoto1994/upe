/*
*   Name: BizAgi Smartphone Workportal Facade
*   Author: oscaro
*   Comments:
*   -   This script will define a workportal facade to access to all components
*/


$.Class.extend("bizagi.workportal.tablet.facade", {
    /*
    *   Returns the implementation class by widget
    */
    getWidgetImplementation: function (widget) {
        bizagi.log("getWidgetImplementation" + widget);
    }
}, {
    /*
    *   Constructor
    */
    init: function (dataService, device) {
        this.templates = {};
        this.dataService = dataService;
        this.setIPhoneMetaTags();
        this.modules = {};
        this.device = device;
        this.homePortalFramework = new bizagi.workportal.homeportalFramework(this);
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
            href: 'jquery/common/base/css/tablet/images/BizAgi_logo.png'
        }).appendTo('head');

        $('<link>', {
            rel: 'apple-touch-startup-image',
            href: 'jquery/common/base/css/tablet/images/splash.png'
        }).appendTo('head');
    },

    /*
    *   This function will load asynchronous stuff needed in the module
    */
    initAsyncStuff: function () {
        var self = this;
        // Load default templates            
        return $.when(self.loadTemplate("base", bizagi.getTemplate("base.workportal.tablet")))
            .done(function (template) {
                $("body").append(template);
                bizagi.util.tablet.startkendo({
                    init: function () {
                        //don't do this for android, causes more issues than it fixes
                        kendo.UserEvents.defaultThreshold(kendo.support.mobileOS.device === 'android' ? 0 : 20);
                    }
                });
            });
    },

    /*
    *   Load one template and save it internally
    */
    loadTemplate: function (template, templateDestination) {
        var self = this;
        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination, template)
            .done(function (resolvedTemplate) {
                if (typeof resolvedTemplate === "string") {
                    self.templates[template] = $.trim(resolvedTemplate.replace(/\n/g, ""));
                }
            });
    },

    /*
    *   Load one template and save it internally
    */
    loadTemplateWebpart: function (template, templateDestination) {
        var self = this;

        // Go fetch the template
        return bizagi.templateService.getTemplateWebpart(templateDestination, template)
            .done(function (resolvedRemplate) {
                self.templates[template] = $.trim(resolvedRemplate.replace(/\n/g, ""));
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
    *   Initializes a webpart
    */
    loadWebpart: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var webpartName = params.webpart;
        var webpart = bizagi.getWebpart(webpartName, params);

        if (!webpart) {
            bizagi.log("webpart not found");
        }

        if (bizagi.override.webpartsChunk && bizagi.loader.environment === "release") {
          defer.resolve(webpart);
        }
        else{
            // Ensure the webpart is initialized
            $.when(bizagi.util.initWebpart(webpart, self.device))
                .done(function () {
                // Load all templates asyncronously
                $.when.apply(this, $.map(webpart.tmpl, function (tmpl) {
                    return self.loadTemplateWebpart(tmpl.originalAlias, bizagi.getTemplate(tmpl.alias, true));
                })).done(function () {
                    defer.resolve(webpart);
                });

            });
        }

        return defer.promise();
    },

    /*
    *   Returns a webpart
    */
    getWebpart: function (webpartImplementation, params) {
        try {

            // Create a dynamic function to avoid problem with eval calls when minifying the code
            if (webpartImplementation.indexOf("bizagi") === -1) {
                webpartImplementation = "bizagi.workportal.webparts." + webpartImplementation;
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

        $.when(self.loadWebpart(params)).done(function (webpart) {
            var webpartImplementation = webpart["class"];
            var dynamic = self.getWebpart(webpartImplementation, params);

            $.when(dynamic.render($.extend(params, { creating: false }))).done(function () {

                params.canvas.triggerHandler("ondomincluded");
                defer.resolve(dynamic);

            });
        });
        return defer.promise();
    },

      executeWebparts: function () {
        var self = this;

        //load rendering first
        self.loadModule("renderingflat");
        return $.when(self.dataService.getCurrentUser()).fail(function(err){
            $.when(self.dataService.logoutMobile())
                .always(function (response) {
                    self.defaultLogout();
                });
        }).pipe(
            function (currentUser) {
                // Sacar de este lugar cuando se adicione el security al currentUser
                currentUser.userProperties = {};
                var userProperty;
                var i = -1;

                while ((userProperty = currentUser.sUserProperties[++i])) {
                    currentUser.userProperties[userProperty.key] = userProperty.value;
                }

                bizagi.currentUser = currentUser;
                var startpage = currentUser.userProperties.userstartpage = currentUser.userProperties.userstartpage || "";
                self.sortMenuItemsByStartPage(startpage, currentUser);


                return $.when(self.loadReleaseTemplates()).then(function() {
                  return $.when(
                    self.executeWebpart({
                      webpart: "homePortal",
                      canvas: $("body")
                    }),
                    self.executeWebpart({
                      webpart: "menu",
                      canvas: $("body")
                    }),
                    self.executeWebpart({
                      webpart: "newcase",
                      canvas: $("body")
                    }),
                    self.executeWebpart({
                      webpart: "render",
                      canvas: $("body")
                    })).then(function () {
                    bizagi.debug("Finalizo ejecución de webparts workportal");
                  });
                });
            }
        );
    },

  loadReleaseTemplates: function(){

    if (!bizagi.override.webpartsChunk || bizagi.loader.environment !== "release") {
      return true;
    }

    var self = this;
    var defer = new $.Deferred();
    var prefix = bizagi.loader.useAbsolutePath ? bizagi.loader.basePath + bizagi.loader.getLocationPrefix() : "" + bizagi.loader.getLocationPrefix();
    var url = prefix + "jquery/workportalflat/production/webpart." + this.device.replace(/[^a-z0-9]+/gi, "") + ".production.tmpl.html?build=" + bizagi.loader.build;

    steal.then({
      src: url,
      id: url,
      type: "text",
      waits: false,
      onError: function (options) {
        bizagi.log("Could not load file " + options.src, options, "error");
        defer.reject( options );
      }
    }).then(function () {
      var data = steal.resources[url].options.text;
      self.templates = eval("(" + data + ")");

      Object.keys(self.templates).map(function(key){
        self.templates[key] = bizagi.templateService.localization.translate(self.templates[key]);
      });

      defer.resolve();
    });

    return defer.promise();
  },

    sortMenuItemsByStartPage: function (startpage, currentUser) {
        var self = this;

        /*
        Values userstartpage property
        1. "" -> El usuario no ha configurado esta opción(usuario viejo).
        2. "1" -> Automatic
        3. "2" -> Me
        4. "3" -> Inbox
        */

        if (startpage === "1" || startpage === "2") {
            if (typeof currentUser.associatedStakeholders !== "undefined" && currentUser.associatedStakeholders.length > 0) {
                // Merge layouts - Load dashboard
                self.homePortalFramework.homePortalLayout = $.extend(self.homePortalFramework.homePortalLayoutDashboard, self.homePortalFramework.homePortalLayoutTaskFeed, self.homePortalFramework.homePortalLayoutComplement);
            } else {
                // Merge layouts - Load task feed
                self.homePortalFramework.homePortalLayout = $.extend(self.homePortalFramework.homePortalLayoutTaskFeed, self.homePortalFramework.homePortalLayoutDashboard, self.homePortalFramework.homePortalLayoutComplement);
            }
        }
        else {
            // Merge layouts - Load task feed
            self.homePortalFramework.homePortalLayout = $.extend(self.homePortalFramework.homePortalLayoutTaskFeed, self.homePortalFramework.homePortalLayoutDashboard, self.homePortalFramework.homePortalLayoutComplement);
        }
    },
    
  loadModule: function (bizagiModule) {
        var self = this;
        if (typeof bizagiModule !== "string") {
            return;
        }

        if (typeof self.modules[bizagiModule] !== "undefined") {
            return self.modules[bizagiModule];
        }

        self.modules[bizagiModule] = new $.Deferred();

        bizagi.loader.start(bizagiModule).then(function () {
            self.modules[bizagiModule].resolve();
        });

        return self.modules[bizagiModule].promise();
    },

    defaultLogout: function () {
        /* istanbul ignore next: untestable */
        if (bizagi.util.isCordovaSupported()) {
            window.location = bizagi.services.ajax.logoutPage;
        } else {
          window.location.replace("");
        }
    }
});