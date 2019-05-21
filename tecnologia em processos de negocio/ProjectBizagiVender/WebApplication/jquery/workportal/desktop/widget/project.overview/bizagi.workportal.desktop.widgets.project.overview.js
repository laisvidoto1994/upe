/*
*   Name: Bizagi Workportal Desktop Project Overview Controller
*   Author: David Romero Estrada
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.overview", {}, {
    
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "project-overview": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.overview").concat("#project-overview"),
            "project-overview-no-summary-form-found": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.overview").concat("#project-overview-no-summary-form-found")
        });
    },

    /*
    * Renders the template defined in the widget
    */
    renderContent: function () {

        var self = this;
        var template = self.getTemplate("project-overview");

        self.content = template.render({});
        return self.content;
    },

    /*
    * Links events with handlers
    */
    postRender: function () {
        var self = this;
        var contentWidget = self.getContent();

        var canvas = $("#ui-bizagi-wp-project-overview-wrapper", contentWidget);

        // Define action when render form has not been migrated
        canvas.bind("oldrenderintegration", function (e) {
            if (e.isPropagationStopped()) {
                return;
            }
            e.stopPropagation();

            var template = self.workportalFacade.getTemplate("inbox-common-case-summary-oldrender");
            var data = {};

            bizagi.oldrenderevent = true; // has been loaded
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

            // Listen to message from child window
            eventer(messageEvent, function (e) {
                e.stopPropagation();
                self.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: e.data
                });
            }, false);

            // Define wirkitem and idtask
            $.when(self.dataService.getWorkitems({
                idCase: self.params.idCase,
                onlyUserWorkItems: true
            })).done(function (getWorkitems) {
                // verify workitem, in some cases these variables are not available
                if (typeof getWorkitems.workItems == "object" && getWorkitems.workItems.length >= 1) {
                    // Case Open
                    var idWorkitem = getWorkitems.workItems[0]['idWorkItem'];
                    var idTask = getWorkitems.workItems[0]['idTask'];
                    data.url = self.dataService.serviceLocator.getUrl("old-render") + "?PostBack=1&idCase=" + self.idCase + "&idWorkitem=" + idWorkitem + "&idTask=" + idTask + "&isSummary=1";
                } else {
                    // Case closed
                    data.url = self.dataService.serviceLocator.getUrl("old-render") + "?PostBack=1&idCase=" + self.idCase + "&isSummary=1";
                }

                // Render content
                canvas.empty();
                $.tmpl(template, data).appendTo(canvas);
                //Set styles
                self.iframeOldRender($("iframe", canvas));
            });
        });

        var params = {
            idCase: self.params.idCase
        };
        $.when(self.dataService.getCaseFormsRenderVersion(params))
           .done(function (formsVersion) {
               if (formsVersion.formsRenderVersion == 1) {
                   canvas.trigger("oldrenderintegration");
               } else {
                   self.renderSummaryForm(self.params.idCase, $("#ui-bizagi-wp-project-overview-wrapper", contentWidget));
               }
           });
    },

    renderSummaryForm: function(idCase, container){
        var self = this;

        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";

        // Load render page
        var rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });

        // Executes rendering into render container
        rendering.execute({
            canvas: container,
            summaryForm: true,
            idCase: idCase
        });
        rendering.subscribe("no-data-found", function() {
            var template = self.getTemplate("project-overview-no-summary-form-found");
            container.append(template.render());
        });

        // Keep reference to rendering facade
        self.renderingFacade = rendering;

        // Resize layout
        setTimeout(function() {
            self.resizeLayout();
        }, 1000);
    },

    /**
     * Inject styles and js into the iframe
     */
    iframeOldRender: function (canvas) {
        var self = this;
        var iframe;
        var content = self.getContent();
        var theme = "bizagiDefault";
        var queryString = bizagi.readQueryString();

        $.each(canvas, function () {
            if ($(this).is("iframe")) {
                iframe = $(this);
            }
        });

        iframe.load(function () {
            // inject css
            var content = $(this).contents();

            // Fixed problem with relative path across the different browsers
            var cssLocation = ($.browser.mozilla || $.browser.webkit) ? "../../css/render_%theme%.css" : "css/render_%theme%.css";

            // Define theme
            cssLocation = cssLocation.replace("%theme%", (queryString["theme"] || theme));

            // Append css
            $('body', content).append("<link type='text/css' rel='stylesheet' href='" + cssLocation + "'>");

            // Append javascript
            //  $('head',content).append("<script type='text/javascript' src='../../js/renderintegration.js'></script>");
        });
    }

});

bizagi.injector.register('bizagi.workportal.widgets.project.overview', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.overview], true);