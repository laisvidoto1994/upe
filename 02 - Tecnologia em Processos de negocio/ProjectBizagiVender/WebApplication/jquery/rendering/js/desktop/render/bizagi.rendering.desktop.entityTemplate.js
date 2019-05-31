/**
 * Desktop definition of entity template
 *
 * @author: Andrés Fernando Muñoz
 * based on action launcher control
 */

bizagi.rendering.actionLauncher.extend("bizagi.rendering.entityTemplate", {}, {

    /**
     *
     * @param data
     */
    initializeData: function(data) {
        var self = this,
            data = data || {},
            properties = data.properties || {};

        self._super(data);
        self.properties.allowactions = (typeof properties.allowactions != "undefined") ? bizagi.util.parseBoolean(properties.allowactions) : false;
        self.properties.templatetype = (typeof properties.templatetype != "undefined") ? properties.templatetype : 'default';
    },

    /**
     * Render a specific implementation for Desktop device
     */
    postRender: function() {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var html, template;
        var control = self.getControl();

        if (mode == "design" || !self.properties.surrogatedKey) {
            return "";
        }

        self.configureQueueVisibility();

        // Define params to get template
        $.when(self.dataService.multiaction().getPropertyData(self.processPropertyValueDataTmplArgs))
            .done(function (templateData) {

                // Put the guidTemplate in the request for the multiaction loadtemplate.
                if (typeof templateData.templateGuid !== "undefined" && templateData.templateGuid) {
                    templateData.isDefaultTemplate = false;
                    templateData.guidTemplate = templateData.templateGuid;
                    delete templateData["templateGuid"];
                }

                $.when(self.engine.render(templateData, self.processPropertyValueDataTmplArgs)).done(function (template) {
                    var htmlTemplate = template;
                    var actionsContainer = $(".bz-action-launcher-actions-container", control);
                    template = self.renderFactory.getTemplate("render-actionLauncher-horizontal");

                    if (properties.allowactions) {
                        $.when(self.dataService.multiaction().getActions(self.processPropertyValueArgs)).done(function(response) {
                            self.deferredActions.resolve(response);
                            var actions = bizagi.clone(response);
                            var moreActionsManager = self.moreActionsManager(actions);
                            var isMoreActions = moreActionsManager.isMoreActions;
                            actions = moreActionsManager.actions;

                            var html = $.fasttmpl(template, {actions: actions, template: true, isMoreActions: isMoreActions, allowactions: properties.allowactions});
                            actionsContainer.append(html);
                            actionsContainer.find('.actions-container.actions-container-template').append(htmlTemplate);

                            self.configureHandlers();
                        }).fail(function(error) {
                            //TODO: do something
                        });
                    }
                    else {
                        var html = $.fasttmpl(template, {template: true, allowactions: properties.allowactions});

                        actionsContainer.append(html);
                        actionsContainer.find('.actions-container.actions-container-template').append(htmlTemplate);
                    }
                });
            }).fail(function(error) {
            //TODO: do something
        });
        self.engine.subscribe('onLoadDataNavigation', function (ev, params) {
            bizagi.loader.start("entity-engine-view").then(function () {
                $(document).triggerHandler("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_DIALOGNAV,
                    data: params,
                    modalParameters: {
                        refreshInbox: false,
                        title: params.data.displayName
                    },
                    maximizeOnly: false
                });
            });
        });
    },

    /**
     * Add binding to html elements
     */
    configureHandlers: function() {
        var self = this;
        var formContainer = self.getFormContainer();
        if(typeof formContainer.params.printversion === "undefined" || formContainer.params.printversion == false) {
            var control = self.getControl();
            var properties = self.properties;
            var entityTemplateControls = $(".action-launcher-control", control);

            // Binding for a tooltip when max items is excedded
            self.configureMoreActionsHandler();

            // Binding for click action on buttons
            entityTemplateControls.on("click", function() {
                var action = {
                    guidProcess: $(this).data("guidprocess"),
                    guidAction: $(this).data("guidaction"),
                    displayName: $(this).data("display-name"),
                    actionType: $(this).data("action-type"),
                    xpathContext: $(this).data("xpathcontext"),
                    xpathActions: self.properties.xpathActions || ""
                };

                if (action.actionType === "Form") {
                    action.xpathContext = undefined;
                    action.contextType = "entitytemplate";
                    action.guidEntity = self.properties.guidEntity;
                }
                self.onActionClicked(action);
            });
        }


    }
});