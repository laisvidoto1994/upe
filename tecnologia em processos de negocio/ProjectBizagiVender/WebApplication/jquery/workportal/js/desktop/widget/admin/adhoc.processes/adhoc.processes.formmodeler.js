bizagi.workportal.widgets.widget.extend("adhoc.processes.formmodeler", {}, {

    init: function (params) {
        var self = this;
        self.params = params;
    },

    render: function (canvas) {
        var self = this;
        self.loadModeler(canvas);
        self.publish("refreshAdhocProcessesCanvas", { canvasName: "modeler" });
    },

    loadModeler: function (canvas) {
        var self = this;

        // WEIRD FIX FOR A WEIRD PROBLEM
        // http://stackoverflow.com/questions/15665552/jquery-ui-focus-stealing
        if (window.jQuery && window.jQuery.ui.dialog) {
            $(document).unbind("focusin.dialog");
        }
        
        bizagi.loader.start("formModeler").loadFile({ src: bizagi.getStyleSheet("bizagi.editor.portal.overrides"), type: "css" }).then(function () {

            self.makeBackupForHacks();            

            $.when(bizagi.localization.loadLanguageExtension(bizagi.language))
            .done(function () {
                // Initialize 
                bizagi.form.modeler.initialize({
                    urlRestServices: location.protocol + "//" + location.host + location.pathname,
                    environment: bizagiConfig.environment
                });

                // WEIRD FLAGS
                BIZAGI_ACTION_VALIDATIONS_IMPR = false;

                // Get form data                    
                var formContext = "adhocform";
                bizagi.editor.communicationprotocol.factory.setContext(formContext);
                var loadFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol: "loadform",
                    form: self.params.idTask,
                    loadByParent: true,
                    adhocProcessId: self.params.idProcess,
                    isAdhocSummaryForm: self.params.isAdhocSummaryForm
                });

                $.when(loadFormProtocol.processRequest())
                .done(function (data) {
                    // Load form modeler                        
                    $.when(bizagi.form.modeler.createForm({
                        context: formContext,
                        isActivityForm: false,
                        canvas: canvas,
                        adhocTaskId: self.params.idTask,
                        data: data,
                        adhocProcessId: self.params.idProcess,
                        isAdhocSummaryForm: self.params.isAdhocSummaryForm
                    }))
                    .done(function (_editor) {
                        self.editor = _editor;
                    });
                });
            });

        });
    },

    makeBackupForHacks: function () {
        var self = this;
        if (bizagi.rendering.container.editorInstance) {
            self.restoreMethod('container', 'postRenderContainer', true);
            self.restoreMethod('group', 'postRenderContainer', true);
            self.restoreMethod('contentPanel', 'postRenderContainer', true);
            self.restoreMethod('tab', 'postRenderContainer', true);
            self.restoreMethod('form', 'postRenderContainer', true);

            self.restoreMethod('render', 'postRenderElement', true);
            self.restoreMethod('search', 'postRender', true);
            self.restoreMethod('imageNoFlash', 'postRender', true);
            self.restoreMethod('collectionnavigator', 'postRender', true);
        } else {
            bizagi.rendering.container.editorInstance = $.extend(true, {}, bizagi.rendering.container.prototype);
            bizagi.rendering.group.editorInstance = $.extend(true, {}, bizagi.rendering.group.prototype);
            bizagi.rendering.contentPanel.editorInstance = $.extend(true, {}, bizagi.rendering.contentPanel.prototype);
            bizagi.rendering.tab.editorInstance = $.extend(true, {}, bizagi.rendering.tab.prototype);
            bizagi.rendering.form.editorInstance = $.extend(true, {}, bizagi.rendering.form.prototype);
            bizagi.rendering.render.editorInstance = $.extend(true, {}, bizagi.rendering.render.prototype);
            bizagi.rendering.search.editorInstance = $.extend(true, {}, bizagi.rendering.search.prototype);
            bizagi.rendering.imageNoFlash.editorInstance = $.extend(true, {}, bizagi.rendering.imageNoFlash.prototype);
            bizagi.rendering.collectionnavigator.editorInstance = $.extend(true, {}, bizagi.rendering.collectionnavigator.prototype);
        }
    },

    restoreMethod: function (clazz, method, useBackup) {
        var self = this;
        if (bizagi.rendering.form.editorInstance) {
            bizagi.rendering[clazz].prototype[method] = function () {
                if (useBackup) {
                    return bizagi.rendering[clazz].editorInstance[method].apply(this, arguments);
                } else {
                    return bizagi.rendering[clazz].original[method].apply(this, arguments);
                }
            };
        }
    },

    dispose: function(){
        var self = this;
        delete self.editor;
    }
});