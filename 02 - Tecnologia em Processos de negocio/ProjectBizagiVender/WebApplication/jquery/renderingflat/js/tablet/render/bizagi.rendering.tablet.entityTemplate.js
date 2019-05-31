/**
 * Tablet definition of entity template
 *
 * @author: Ricardo Pérez
 */

bizagi.rendering.actionLauncher.extend("bizagi.rendering.entityTemplate", {}, {

    /**
     * Render a specific implementation for Desktop device
     */
    postRender: function() {
        var self = this;
        var properties = self.properties;
        var def = new $.Deferred();

        self.actions = [];

        self.configureQueueVisibility();

        /**
         * Define params to get template
         */
        self.startLoading();
        self.dataService.multiaction().getPropertyData(self.processPropertyValueDataTmplArgs)
            .then(function(templateData) {
                return self.engine.render(templateData, self.processPropertyValueDataTmplArgs)
                    .then(function(tmpl) {
                        var template = self.renderFactory.getTemplate("render-actionLauncher-horizontal");
                        if (properties.allowactions) {
                            return self.dataService.multiaction().getActions(self.processPropertyValueArgs)
                                .then(function(response) {
                                    self.deferredActions.resolve(response);
                                    self.actions = response;
                                    var htmlTemplate = $($.fasttmpl(template, {
                                        actions: self.actions,
                                        template: true
                                    }));
                                    $(".template-container", htmlTemplate.wrap('<div>').parent()).append(tmpl);
                                    return htmlTemplate;
                                });
                        } else {
                            var htmlTemplate = $($.fasttmpl(template, { template: true }));
                            $(".template-container", htmlTemplate.wrap('<div>').parent()).append(tmpl);
                            return htmlTemplate;
                        }
                    });

            }).done(function(html) {
                var control = self.getControl();
                var actionsContainer = $(".bz-action-launcher-actions-container", control);

                self.endLoading();

                actionsContainer.append(html);
                self.configureHandlers();
                self.configureTemplateHandlers();

                def.resolve(actionsContainer);
            }).fail(function(error) {
                self.endLoading();
                def.fail(error);
            });
        return def.promise();
    },

    /**
     * Add binding to html elements
     */
    configureHandlers: function() {
        var self = this;
        var control = self.getControl();
        var entityTemplateControls = $(".action-launcher-control", control);

        /**
         * Binding for click action on buttons
         */
        entityTemplateControls.on("click", function() {
            var item = self.actions[parseInt($(this).data("index"))];
            var action = {
                guidProcess: item[0],
                guidAction: item[4],
                displayName: item[1],
                actionType: item[3],
                xpathContext: (typeof item[5] !== "undefined" && item[5] === "true"),
                xpathActions: self.properties.xpathActions || ""
            };

            if (action.actionType === "Form") {
                action.xpathContext = undefined;
                action.contextType = "entitytemplate";
                action.guidEntity = self.properties.guidEntity;
            }

            $.when(self.actionManager(action)).done(function(act) {
                self.executeAction(act);
            });
        });
    },

    configureTemplateHandlers: function() {
        var self = this;
        /**
         * Catch the event from the layout link
         */
        self.engine.subscribe("onLoadDataNavigation", function(ev, params) {
            params.filters = [];
            params.calculateFilters = params.calculateFilters || true;
            bizagi.webpart.publish("homeportalShow", {
                what: "stuffTemplates",
                title: params.data.displayName,
                params: params
            });
        });
    }

});