/*
 *   Name: BizAgi Workportal Desktop my search search lists Widget Controller
 *   Author: Andres Fernando Munoz
 *   Comments:
 *   -   This script will provide desktop overrides to implement the my search search lists widget
 */

// Auto extend
bizagi.workportal.widgets.mySearchList.extend("bizagi.workportal.widgets.mySearchList", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "mySearchListWrapper": bizagi.getTemplate("bizagi.workportal.desktop.widget.mySearchList").concat("#ui-bizagi-workportal-widget-mysearchlist-searchlists-wrapper"),
            "mySearchList": bizagi.getTemplate("bizagi.workportal.desktop.widget.mySearchList").concat("#ui-bizagi-workportal-widget-mysearchlist-searchlists"),
            useNewEngine: false
        });
    },

    /**
     *   To be overriden in each device to apply layouts
     */
    postRender: function () {
        var self = this;

        self.loadtemplates();
        self.renderSearchLists();
    },

    loadtemplates: function () {
        var self = this;

        self.mySearchListTmpl = self.getTemplate("mySearchList");
    },

    renderSearchLists: function(){
        var self = this;
        var content = self.getContent();

        $.when(self.dataService.getSearchLists()).done(function (data) {
            var searchLists = data;
            var $searchLists = $.tmpl(self.mySearchListTmpl, {searchLists: searchLists});

            content.append($searchLists);
            self.configureHandlers();
        });
    },

    closeModal: function () {
        var self = this;
        var modal = $(self.content).closest('.modal');

        modal.hide();
    },

    configureHandlers: function(){
        var self = this;
        var content = self.getContent();

        $(".ui-bizagi-wp-widget-my-search-list-item", content).on('click', $.proxy(self.onListItemClick, self));
        $("#menuQuery").keypress(function () { //Hides the widget when the user types something
            self.closeModal();
        });
    },

    onListItemClick: function (ev) {
        var self = this;
        self.closeModal();//Hides the widget when the user selects any item on the list

        var $target = $(ev.currentTarget);
        var guidform = $target.data("guidform");
        var id = $target.data("id");
        var displayname = $target.data("displayname");
        var guidEntity = $target.data("guidentity");

        var publishParams = {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_LOADFORM,
            summaryDecorator:false,
            guidForm: guidform,
            displayname: displayname,
            guidEntity: guidEntity,
            closeVisible: false,
            buttons: [
                {
                    text: bizagi.localization.getResource('workportal-menu-search'),
                    click: function(e) {
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

                            self.performQuery({guidSearch: id, guidForm: guidform, guidEntity: guidEntity, displayname: displayname, metadataFilters: metadataFilters,filters: filterObject, page: 1, pageSize: 10, calculateFilters: true, histName: displayname});

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
                title: displayname
            }
        }

        self.publish("showDialogWidget", publishParams);
        self.publish("onWidgetIncludedInDOM");
    },

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
            var widgetManager = bizagi.injector.get('widgetManager');
            widgetManager._context = "home";

            $.when(homeportalInstance.isReady()).done(function(){
                homeportalInstance.pub("notify", dataParams);
            })
        });
    }

});
