bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.loadForm", {}, {

    init: function (workportalFacade, dataService, params) {
        this.workportalFacade = workportalFacade;
        this.dataService = dataService;
        this.params = params || {};
        this.form;
        this.searchCriteriasApplied = params.searchCriteriasApplied || [];
    },

    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_LOADFORM;
    },

    preProcessValue: function (value, control) {
        if (control.properties.type == "combo" || control.properties.type == "radio"){
            value = {"id": value[0]};
            /*    var i= -1, a;
                while(a = value[++i]){
                    value[i] = {"id": a};
                }*/
        }

        return value;
    },

    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("loadForm");

        self.content = $.tmpl(template);

        bizagi.loader.start("rendering").then(function () {
            var formClass = bizagi.rendering.form.extend({
                createRenderElement: function (element) {
                    var self = this;
                    var properties = element.render.properties;

                    if (properties.rangeQuery && properties.rangeQuery != "none") {
                        properties.xpath = properties.xpath + "@" + properties.rangeQuery;
                    }
                    self._super(element);
                }
            });

            var renderFacade = bizagi.rendering.facade.extend({
                processForm: function (data, renderFactory, params) {
                    var containerParams = $.extend(params, {
                        renderFactory: renderFactory,
                        dataService: params.dataService || this.dataService,
                        data: data
                    });
                    var form =  new formClass(containerParams);

                    //set default data
                    if (self.searchCriteriasApplied.length > 0){
                        $.each(self.searchCriteriasApplied, function (key, value) {
                            var control = form.getRenderById(value.id);
                            if (control) {
                                control.setValue(self.preProcessValue(value.value, control));
                            }
                        });
                    }

                    // Render the full form
                    form.render();

                    return form;
                }
            });

            var render = new renderFacade();

            var queryFormParams = {
                h_action: "QUERYFORM",
                h_contexttype: "entity",
                h_idForm: self.params.guidForm,
                dataType: "text"
            };


            //request to queryForm definition service
            self.dataService.getQueryForm(queryFormParams).done(function (data) {
                //convert the form json
                var regexTypeString = /\"type\"\s*:\s*\"([':.,-\[\]\w\s]*)\"/g;
                var regexIncludedInResultString = /\"includedInResult\"\s*:\s*(true)/g;

                var processedForm = data.replace(regexTypeString, function (match, g1, offset, string) {
                    return match.replace(g1, g1.replace(/query/i, "").toLowerCase());
                });
                processedForm = processedForm.replace(regexIncludedInResultString, '"includedInResult":false');

                var form = JSON.parse(processedForm);
                form.form.buttons = [];

                var renderingParams = { canvas: $(self.content), data: form };

                render.execute(renderingParams).done(function (form) {
                    self.form = form;
                });

                return self.content;
            });
        });
    }

});