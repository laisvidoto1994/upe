/**
 * Tablet definition of entity template
 *
 * @author: Ricardo Pérez
 */

bizagi.rendering.actionLauncher.extend("bizagi.rendering.entityTemplate", {}, {

    /**
     * Render a specific implementation for smartphone device
     */
    postRenderSingle: function() {
        var self = this;
        var properties = self.properties;
        var def = new $.Deferred();

        self.actions = [];

        self.getArrowContainer().hide();
        self.configureQueueVisibility();

        self.startLoading();

        // Define params to get template               
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

                                    $(".template-container", htmlTemplate.wrap("<div>").parent()).append(tmpl);

                                    return htmlTemplate;
                                });
                        } else {
                            var htmlTemplate = $($.fasttmpl(template, { template: true }));
                            $(".template-container", htmlTemplate.wrap("<div>").parent()).append(tmpl);

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

            self.processAction(action);
        });

        var actions = [];
        for (var i = 0, len = self.actions.length; i < len; i++) {
            actions.push({
                guid: self.actions[i][0],
                displayName: self.actions[i][1]
            });
        }

        /**
         * Binding for click action sheet
         */
        $(".wp-action-more", control).actionSheet({
            actions: actions,
            actionClicked: function(action) {
                var item = self.actions.find(function(e) {
                    return e[0] == action.guid;
                });
                self.processAction({
                    guidProcess: item[0],
                    guidAction: item[4],
                    displayName: item[1],
                    actionType: item[3],
                    xpathContext: (typeof item[5] !== "undefined" && item[5] === "true")
                });
            }
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

            if (bizagi.util.isNativePluginSupported()) {
                params.data.what = "stuffTemplates";
                bizagiapp.dataNavigation(params);
            } else {
                bizagi.webpart.publish("homeportalShow", {
                    what: "stuffTemplates",
                    title: params.data.displayName,
                    params: params
                });
            }
        });
    }

});