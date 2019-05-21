/**
 * Name: Bizagi Workportal Desktop Update Form Controller
 * Author: Alexander Mejia
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.updateform", {}, {
    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
        // Private fields
        self._guidForm = params.guidForm;
        self._entityGuid = params.entityGuid;
        self._surrogateKey = params.surrogateKey;
        self._mapping = params.mapping;
        self._readonlyform = params.readonlyform;
        //Load templates
        self.loadTemplates({
            "updateform": bizagi.getTemplate("bizagi.workportal.desktop.widget.updateform").concat("#updateform-wrapper"),
            "content": bizagi.getTemplate("bizagi.workportal.desktop.widget.updateform").concat("#form-content")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("updateform");
        self.content = template.render();

        return self.content;
    },

    /**
     * Process widget
     */
    postRender: function () {
        var self = this,
            defer = new $.Deferred(),
            $content = self.getContent();

        self.dataService.getEntityForm(self._getServiceParams()).then(function (data) {
            return self._getRenderingFacade().execute({ canvas: $content.find('#updateform-content'), data: data, type: "" });
        }).done(function (form) {
            $content.find('#updateform-content').append(form.container);
            defer.resolve($content);
        });

        return defer.promise();
    },

    /**
     * Returns an instance of rendering facade
     * */
    _getRenderingFacade: function () {
        var self = this;

        if (!self._rendering) {
            self._rendering = new bizagi.rendering.facade({ "proxyPrefix": bizagi.RPproxyPrefix, "database": "" });
        }
        self._rendering.subscribe('rendering-formRendered', $.proxy(self._overrideHandlers, self));

        return self._rendering;
    },

    /**
     * Returns an object with the parameters available to gets the start form
     * */
    _getServiceParams: function () {
        var self = this,
            params = {};

        params["h_action"] = "LOADENTITYFORM";
        params["h_contexttype"] = "entity";
        params["h_guidForm"] = self._guidForm;
        params["h_showDisabled"] = false;
        params["h_guidEntity"] = self._entityGuid;
        params["h_readonlyform"] = self._readonlyform;

        if (self._mapping) {
            params["h_mapping"] = JSON.stringify(self._mapping);
        }

        if (self._surrogateKey) {
            params["h_surrogateKey"] = self._surrogateKey;
        }

        return params;
    },

    /**
     * returns the canvas used renderize the start form, also the
     * routing event is attach al canvas.
     * after the case is created succesfully, the form trigger the routing event
     */
    _getCanvasForm: function () {
        var self = this;
        var formTemplate = self.getTemplate('content');

        return formTemplate.render();
    },

    /**
     *
     * @private
     */
    _overrideHandlers: function () {
        var self = this,
            form = typeof self._rendering === "undefined" ? null : self._rendering.form;

        if (form) {
            self.idPageCache = self.idPageCache || form.idPageCache;
            var properties = form.properties;
            var originalProcessButton = form.processButton;

            form.processButton = function (buttonProperties) {
                var action = buttonProperties.action;

                if (action == "cancel") {
                    form.endLoading();
                    self.pub('closeDialog', { refresh : false });
                    form.dispose();
                }
                else {
                    properties.surrogateKey = self._surrogateKey;
                    properties.contextType = "entity";

                    form.bind('refresh', function () {
                        form.endLoading();
                        self.pub('closeDialog', { refresh: true });
                        form.dispose();
                    });

                    return originalProcessButton.apply(form, arguments);
                }
            };

        }
    },

    /**
     * Dispose
     */
    dispose: function() {
        var self = this;
        if(self._rendering && self._rendering.form) {
            self._rendering.form.dispose();
        }
        bizagi.util.dispose(self);
    },
});
bizagi.injector.register('bizagi.workportal.widgets.updateform', ['workportalFacade', 'dataService', bizagi.workportal.widgets.updateform], true);