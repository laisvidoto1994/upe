/**
 * Document   : Bizagi Workportal Desktop My Search Criteria
 * Created on : May 20, 2015, 11:24:00 AM
 * Author     : Andrés Felipe Arenas Vargas
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.mysearchcriteria", {

    /**
     *
     * @param workportalFacade
     * @param dataService
     * @param processActionService
     * @param params
     */
    init: function (workportalFacade, dataService, processActionService, params) {
        var self = this;
        self.params = {};
        self._super(workportalFacade, dataService, params);
        self.loadTemplates({
            "mySearchCriteria": bizagi.getTemplate("bizagi.workportal.desktop.widget.mysearchcriteria").concat("#mysearchcriteria-wrapper"),
            "mySearchCriteriaList": bizagi.getTemplate("bizagi.workportal.desktop.widget.mysearchcriteria").concat("#mysearchcriteria-list")
        });
    },

    /**
     *
     * @returns {*}
     */
    renderContent: function () {
        var self = this;
        self.content = self.getTemplate("mySearchCriteria").render({});
        return self.content;
    },

    /**
     *
     */
    postRender: function () {
        var self = this;
        self.configureHandlers();
    },

    /**
     *
     */
    configureHandlers: function () {
        var self = this;
        self.sub('SEARCH-ENGINE-VIEW', $.proxy(self.processCriterias, self));

        $(".wdg-mysearchcriteria-content", self.content).on("click", "div.wdg-mysearchcriteria-card span", function () {
            self.callQueryForm();
        });

        $(".wdg-mysearchcriteria-content", self.content).on("click", "div.wdg-mysearchcriteria-card i", function (e) {
            var xpath = $(this).data("xpath");
            self.performQuery(self.removeFilterApplied(xpath));
            e.stopPropagation();
        });
    },

    /**
     *
     * @param ev
     * @param params
     */
    processCriterias: function (ev, params) {
        var self = this;
        if(typeof params.args.level === "undefined"){//do only from searchList
            self.originParams =  bizagi.clone(params);
            var criterias = self.originParams.args.metadataFilters || [];
            if (criterias.length > 0) {
                if (self.areThereVisibleFilters(criterias)) {
                    var $listContent = $(".wdg-mysearchcriteria-content", self.content);
                    var list = self.getTemplate("mySearchCriteriaList").render({ "criterias": criterias });
                    $listContent.html(list);
                }
            }
        }
    },

    areThereVisibleFilters: function (criterias) {
        var result = false;
        var i = 0;
        for (; i < criterias.length; i++) {
            if (!criterias[i].isHidden) {
                result = true;
                break;
            }
        }
        return result;
    },

    /**
     *
     * @param filters
     * @returns {Array}
     */
    preProcessValues: function (filters) {
        var filtersToSend = bizagi.clone(filters) || [];
        var i = -1, a;

        while(a = filtersToSend[++i]){
            if (a.searchType && a.searchType == "range"){
                if (a.rangeQuery == "from"){
                    a.value = a.value.min;
                }
                else{
                    a.value = a.value.max;
                }
            }
        }
        return filtersToSend;
    },

    /**
     *
     */
    callQueryForm: function () {
        var self = this,
                params = self.originParams.args;

        var publishParams = {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_LOADFORM,
            summaryDecorator: false,
            guidForm: params.guidForm,
            displayname: params.displayname,
            guidEntity: params.guidEntity,
            searchCriteriasApplied: self.preProcessValues(params.metadataFilters),
            closeVisible: false,
            buttons: [
                {
                    text: bizagi.localization.getResource('workportal-menu-search'),
                    click: function() {
                        var that = this;
                        var widget = $(this).dialog("option","widget");
                        var form = widget.form || {};

                        if(Object.keys(form).length !==0){
                            var renderValues = [];
                            $.forceCollectData = true;
                            form.collectRenderValues(renderValues);
                            $.forceCollectData = false;

                            var filterObject = [];
                            var metadataFilters = [];

                            for (name in renderValues) {
                                if (typeof renderValues[name] !== 'function') {
                                    var control = form.getRender(name);
                                    self.dataService.defineFilterObject({properties: control.properties, value: control.value}, filterObject, function(filter){
                                        metadataFilters.push($.extend(filter, {id : control.properties.id, rangeQuery: control.properties.rangeQuery, displayValue: control.getDisplayValue(), displayName: control.properties.displayName}));
                                    });
                                }
                            }

                            self.performQuery($.extend(params, {filters: filterObject, metadataFilters: metadataFilters}));

                            $(that).dialog('close');
                        }
                    }
                },
                {
                    text: bizagi.localization.getResource("workportal-widget-dialog-box-close"),
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ],
            modalParameters: {
                title: params.displayname
            }
        };

        self.publish("showDialogWidget", publishParams);
        self.publish("onWidgetIncludedInDOM");
    },

    /**
     *
     * @param xpath
     * @returns {*}
     */
    removeFilterApplied: function (xpath) {
        var self = this;
        var params = self.originParams.args;

        $.each(params.filters.filter(function (el) {
            return el.xpath == xpath;
        }), function (key, value) {
            params.filters.splice(params.filters.indexOf(value), 1)
        });


        $.each(params.metadataFilters.filter(function (el) {
            return el.xpath == xpath;
        }), function (key, value) {
            params.metadataFilters.splice(params.metadataFilters.indexOf(value), 1)
        });

        return params;
    },

    /**
     *
     * @param params
     */
    performQuery: function (params) {
        var self = this;
        var dataParams = {
            "type": "SEARCH-ENGINE-VIEW",
            "args": params
        };

        $.when(self.publish("changeWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL
        })).done(function () {
            var homeportalInstance = bizagi.injector.get('homeportal');
            $.when(homeportalInstance.isReady()).done(function(){
                homeportalInstance.pub("notify", dataParams);
            });
        });
    }

});

bizagi.injector.register('bizagi.workportal.widgets.mysearchcriteria', ['workportalFacade', 'dataService', 'processActionService', bizagi.workportal.widgets.mysearchcriteria], false);