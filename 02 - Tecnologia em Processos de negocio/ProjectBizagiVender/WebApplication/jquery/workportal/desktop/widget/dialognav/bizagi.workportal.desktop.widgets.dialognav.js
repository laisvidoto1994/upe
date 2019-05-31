/**
 *   Name: Bizagi Workportal Desktop HomePortal Controller
 *   Author: Danny González
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.dialognav", {
    contexts: {
        "TEMPLATEENGINE-VIEW": {
            widgets: {
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false,
                    "newInstance": true
                },
                "template": {
                    "layout": "template",
                    "name": "bizagi.workportal.widgets.templates",
                    "newInstance": true
                },
                "paginator": {
                    "layout": "paginator",
                    "name": "bizagi.workportal.widgets.paginator",
                    "newInstance": true
                }
            },
            nav: { level: 1 }
        }
    }
}, {

    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        params = params || {};
        params.supportNav = true;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "dialognavdata": bizagi.getTemplate("bizagi.workportal.desktop.widget.dialognav").concat("#dialognavdata-frame")
        });

        self.manager = new bizagi.workportal.widgets.manager(self.workportalFacade, self.dataService, '', params);
        self.manager.sub("notifyChange", $.proxy(self.onNotifyChange, self));

        self.sub("notify", $.proxy(self.onNotifyChange, self));
    },

    /**
     *   Returns the widget name
     */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_DIALOGNAV;
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("dialognavdata");
        self.content = template.render({});

        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this;
        var paramsData = self.params.data.data || {};
        var eventType = self.params.data.eventType || "";
        var args = {
            fromActionLauncher: true,
            guidEntityCurrent: paramsData.guidEntityCurrent,
            histName: paramsData.displayName,
            level: 1,
            page: 1,
            reference: paramsData.reference,
            referenceType: paramsData.referenceType,
            showDateNavigator: false,
            surrogateKey: paramsData.surrogateKey,
            xpath: paramsData.xpath,
            eventType: eventType
        };

        self.manager.setLayout(self.getContent());
        self.manager.updateView({
            context: "TEMPLATEENGINE-VIEW",
            data: self.Class.contexts["TEMPLATEENGINE-VIEW"],
            args: args
        });
    },

    /**
     * Notifies when an event is raised
     */
    onNotifyChange: function (ev, params) {
        var self = this;
        var context = params.type;

        if (self.isValidContext(context)) {
            return self.manager.updateView($.extend({
                context: context,
                data: self.Class.contexts[context]
            }, params));
        }

        return self.manager.emit($.extend(params, { context: context }));
    },

    /**
     * Returns true if the context is valid
     */
    isValidContext: function (context) {
        var self = this;
        var classContext = self.Class.contexts;

        return (classContext[context] !== null && typeof classContext[context] == "object");
    },

    /**
     * Override base dispose method
     */
    dispose: function () {
        var self = this;

        self.manager.dispose();
        self._super();
    }
});