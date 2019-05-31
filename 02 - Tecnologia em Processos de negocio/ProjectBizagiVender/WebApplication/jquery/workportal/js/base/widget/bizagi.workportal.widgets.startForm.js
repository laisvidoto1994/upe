/*
*   Name: Start Form Widget Controller
*   Author: Fabian Moreno (based on Diego Parra version)
*   Comments:
*   -   This script will provide start form widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.startForm", {}, {

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_START_FORM;
    },

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        self.idProcess = params.data.idProcess;
        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "startForm": bizagi.getTemplate("bizagi.workportal.desktop.widget.startForm").concat("#ui-bizagi-workportal-widget-start-form"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;    
        var template = self.getTemplate("startForm");

        // Render base template
        self.content = $.tmpl(template);

        // Check if the content is already in dom
        var includedInDom = self.content.parents("body").length > 0;
        if (includedInDom) {
            self.renderForm();
        } else {
            // Wait until the dom is ready to execute the rendering, because some controls need references to full DOM
            // (grids and uploads)
            self.subscribeOneTime("onWidgetIncludedInDOM", function () {

                // Load render page
                self.renderForm({
                    idCase: self.params.idCase,
                    idWorkitem: self.params.idWorkitem,
                    idTask: self.params.idTask,
                    withOutGlobalForm: self.params.withOutGlobalForm || false,
                    isOfflineForm: self.params.isOfflineForm || false,
                    messageForm: self.params.messageForm || ""
                });
            });
        }

    },


    /*
    *   Renders the form component of the widget
    */
    renderForm: function (params) {
        var self = this, resultRender;

        var renderContainer = self.getComponentContainer("render");
        if (!params.withOutGlobalForm) {
            // it has't activities and global form
            var proxyPrefix = (typeof self.dataService.serviceLocator.proxyPrefix !== "undefined") ? self.dataService.serviceLocator.proxyPrefix : "";
            var database = (typeof self.dataService.database !== "undefined") ? self.dataService.database : "";


            // Load render page
            var rendering = self.rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix, "database": database });
            // Executes rendering into render container

            params.action = "LOADSTARTFORM";
            params.idProcess = self.idProcess;

            resultRender = rendering.execute($.extend(params, {
                canvas: renderContainer,
                menu: self.menu
            }));

            // Attach handler to render container to subscribe for routing events
            renderContainer.bind("routing", function (context, triggerparams) {
                // Executes routing action

                var params = {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: self.params.idCase || triggerparams.idCase,
                    fromTask: self.params.fromTask || self.params.idTask,
                    fromWorkItemId: self.params.fromWorkItemId || self.params.idWorkitem,
                    isOfflineForm: self.params.isOfflineForm,
                    formsRenderVersion: self.params.formsRenderVersion,
                    onClose: function () {
                        // If the user closes the dialog we need to redirect to inbox widget
                        self.publish("changeWidget", {
                            widgetName: bizagi.workportal.currentInboxView
                        });
                    }
                };
                params = $.extend(params, triggerparams);
                self.publish("executeAction", params);
            });

            //
            renderContainer.bind("oldrenderintegration", function () {
                if (bizagi.oldrenderevent === undefined) {
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
                }

                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION,
                    idCase: self.params.idCase,
                    idWorkitem: self.params.idWorkitem,
                    idTask: self.params.idTask,
                    onlyUserWorkItems: self.params.onlyUserWorkItems,
                    referrer: self.params.referrer,
                    eventAsTasks: self.params.eventAsTasks
                });

            });
        } else {
            var errorTemplate = self.workportalFacade.getTemplate("info-message");
            var message = (params.messageForm !== "") ? params.messageForm : self.resources.getResource("render-without-globalform");

            if (typeof self.params !== "undefined" && typeof self.params.isOfflineForm !== "undefined" && self.params.isOfflineForm === true) {
                message = self.resources.getResource("render-without-globalform-offline");
            }

            var errorHtml = $.tmpl(errorTemplate, {
                message: message
            });
            // Remove loading icon from summary container
            errorHtml.appendTo(renderContainer);

            resultRender = $.Deferred();
            resultRender.fail();
        }

        // Keep reference to rendering facade
        self.renderingFacade = rendering;

        // Resize layout
        self.resizeLayout();

        return resultRender;
    },


    routingExecute: function (element) {
        // Executes routing action
        if (element === undefined) {
            return false;
        }

        var self = this;

        var idCase = element.find("#idCase").val() || self.params.idCase;
        var idWorkflow = element.find("#idWorkflow").val() || self.params.idWorkflow;
        var idWorkItem = element.find("#idWorkItem").val() || element.parent().find("#idWorkItem").val();
        var idTask = element.find("#idTask").val();
        var eventAsTasks = element.find("#eventAsTasks").val() || false;

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkflow: idWorkflow,
            idWorkItem: idWorkItem,
            idTask: idTask,
            eventAsTasks: eventAsTasks
        });

        return true;
    },

    dispose: function () {
        var self = this;

        // Dispose the rendering binds
        if (self.rendering) {
            var renderContainer = self.rendering.canvas;
            renderContainer.off();

            if(self.rendering.form){
                self.rendering.form.dispose();
            }

            if (this.IsDisposed)
                return;
        }

        // Call base
        self._super();
    }
});
