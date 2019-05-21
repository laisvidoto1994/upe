/**
 *   Name: Bizagi Workportal Desktop Create Case Controller
 *   Author: Alexander Mejia
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.createcase", {}, {
    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        // Private fields
        self._processId = params.idObject;
        self._mapping = params.mapping || [];
        self._idParentCase = params.idParentCase;
        self._mappingstakeholders = params.mappingstakeholders;
        self._guidprocess = params.guidprocess;

        //Load templates
        self.loadTemplates({
            "createcase": bizagi.getTemplate("bizagi.workportal.desktop.widget.createcase").concat("#createcase-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("createcase");
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

        bizagi.loader.start("rendering").then(function () {
            $.when(self.dataService.getStartForm(self._getServiceParams())).then(function (data) {
                return self._getRenderingFacade().execute({ canvas: self._getCanvasForm(), data: data, type: "" });
            }).done(function (form) {
                self.startForm = form;
                $content.find('#createcase-content').append(form.container);
                defer.resolve($content);
                self.pub('loadedForm');
            });
        });

        return defer.promise();
    },

    /**
     * Returns an instance of rendering facade
     */
    _getRenderingFacade: function () {
        var self = this;

        if (!self._rendering) {
            self._rendering = new bizagi.rendering.facade({"proxyPrefix": bizagi.RPproxyPrefix, "database": ""});
        }

        return self._rendering;
    },

    /**
     * Returns an object with the parameters available to gets the start form
     */
    _getServiceParams: function () {
        var self = this,
            params = self.getMapping();

        params["h_action"] = "LOADSTARTFORM";

        if (self._idParentCase) {
            params["h_idParentCase"] = self._idParentCase
        }
        if (self._mappingstakeholders) {
            params["h_mappingstakeholders"] = self._mappingstakeholders;
        }
        if (self._guidprocess) {
            params["h_guidprocess"] = self._guidprocess;
        }
        else {
            params["h_idProcess"] = self._processId;
        }
        return params;
    },

    /**
     * Builds the mapping to send at LOADSTARTFORM action
     */
    getMapping: function () {
        var self = this,
            params = {};

        for (var i = 0, l = self._mapping.length; i < l; i++) {
            var map = self._mapping[i];
            if (map.surrogateKey) {
                params[map.xpath] = JSON.stringify(map.surrogateKey);
            }
        }

        return params;
    },

    /**
     * returns the canvas used renderize the start form, also the
     * routing event is attach al canvas.
     * after the case is created succesfully, the form trigger the routing event
     */
    _getCanvasForm: function () {
        var self = this,
            $content = self.getContent();
        var $canvas = $content.find('#createcase-content');

        // When the case is created, rendering module trigger the routing event
        $canvas.on('routing', $.proxy(self.onCaseCreated, self));
        return $canvas;
    },

    /**
     * This handler is called when the create button is clicked in
     * the start form
     */
    onCaseCreated: function (ev, params) {
        var self = this;
        self.pub('closeDialog', params);
    },

    /**
     * Dispose widget
     */
    dispose: function (){
        var self = this;
        if(self.startForm){
            self.startForm.dispose();
        }
        // Call base
        self._super();
    }
});

bizagi.injector.register('bizagi.workportal.widgets.createcase', ['workportalFacade', 'dataService', bizagi.workportal.widgets.createcase], true);