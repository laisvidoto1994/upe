/*
*   Name: BizAgi Workportal Search Controller
*   Author: Diego Parra (based on Edward Morales version)
*   Comments:
*   -   This script will provide base library for search cases
*/

// Auto extend
bizagi.workportal.widgets.search.extend('bizagi.workportal.widgets.search', {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, params);

        // Define variables
        self.radNumber = params.radNumber || '';

        // Set templates
        self.searchTemplate = self.workportalFacade.getTemplate('search');
        //self.searchDetailsTemplate = self.workportalFacade.getTemplate('search-details');
        self.casesGridTmpl = self.workportalFacade.getTemplate('inbox-grid-cases');
    },

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();
        //var contentDetails = $('#searchDetails', content);
        var contentDetails = content;
        contentDetails.empty();
        // Append search results // Previous version    //$.tmpl(self.searchDetailsTemplate, self.params.data).appendTo(contentDetails);
        // Render grid
        var workflowName = !bizagi.util.isEmpty(self.params.workflowName) ? "&nbsp;&gt;&nbsp;" + self.params.workflowName : "";

        // Convert null to empty "" fields
        for (i = 0; i < self.params.data.cases.rows.length; i++)
            for (j = 0; j < self.params.data.cases.rows[i].fields.length; j++)
                self.params.data.cases.rows[i].fields[j] = (self.params.data.cases.rows[i].fields[j] == null) ? "" : self.params.data.cases.rows[i].fields[j];

        $.tmpl(
        //self.searchDetailsTemplate,
        //self.searchTemplate,
            self.casesGridTmpl,
            $.extend(self.params.data.cases, { processName: self.params.data.processName }),
            {
                setFormat: self.formatValue,
                isArray: self.isArray,
                formatCategories: self.formatCategories,
                isDate: self.isDate
            }
            ).appendTo(contentDetails);
        //TODO wtf mejorar implementacion search que se recibio 
        // Show back button
        $('#ui-bizagi-workportal-wrapper-back').show();

        // Hide view button
        $('#ui-bizagi-workportal-widget-view-options').hide();

        /* New lines based on Widget InboxGrid */

        //emulate click for close menu
        if (self.getMenu().getContent() != null)
            self.getMenu().getContent().find("#menu-toggler").click();

        // Add click event for activities
        $(".ui-bizagi-wp-app-inbox-activity-name", contentDetails).click(function () {
            // Call routing action
            var idCase = $(this).find("#idCase").val() || 0;
            var idWorkItem = $(this).find("#idWorkItem").val() || 0;
            var idTask = $(this).find("#idTask").val() || 0;
            // Show back button
            $('#ui-bizagi-workportal-wrapper-back', contentDetails).show();
            // Hide view button
            $('#ui-bizagi-workportal-widget-view-options', contentDetails).hide();
            self.icoTaskState = "";
            self.idCase = idCase;
            self.idWorkflow = "";
            self.onlyFavorites = "";
            self.popupOpened = false;
            
            // fix for SUITE-9491
            if(idWorkItem != "" && idTask != "") {
                if(bizagi.cache === undefined) {
                    bizagi.cache = {};
                } else {
                    if(bizagi.cache[idCase] !== undefined) {
                        if(bizagi.cache[idCase].idWorkitem == parseInt(idWorkItem) && bizagi.cache[idCase].idTask == parseInt(idTask) && bizagi.cache[idCase].isComplex !== undefined) {
                            idWorkItem = "";
                        }
                    }
                }
            }

            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: idCase,
                idWorkItem: idWorkItem,
                idTask: idTask,
                eventAsTasks: true
            });
        });
        $(".sortColumnsData", contentDetails).click(function () {
            self.loadCasesGrid({
                idWorkflow: idWorkflow,
                workflowName: params.workflowName,
                orderFieldName: $(this).find("#orderFieldName").val(),
                orderType: (($(this).find("#orderType").val() == 0) ? 1 : 0),
                order: $(this).find("#order").val()
            });
        });
        // bind for sort columns
        $(".sortColumnsData", contentDetails).click(function () {
            self.loadCasesGrid({
                idWorkflow: idWorkflow,
                workflowName: params.workflowName,
                orderFieldName: $(this).find("#orderFieldName").val(),
                orderType: (($(this).find("#orderType").val() == 0) ? 1 : 0),
                order: $(this).find("#order").val()
            });
        });
        /* End New lines based on Widget Inbox grid */
        // Bind button to open render
        // show routing
        $(".workonitRow.showDesc", contentDetails).click(function () {
            // Show back button
            $('#ui-bizagi-workportal-wrapper-back', contentDetails).show();
            // Hide view button
            $('#ui-bizagi-workportal-widget-view-options', contentDetails).hide();
            self.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this).parents("td").first().find("#idCase").val()
            });
        });

        $(".ui-bizagi-wp-app-inbox-cases-start", contentDetails).click(function () {
            var icon = $(this);
            var row = icon.closest('td');
            var favorite = $("#isFavorite", row);
            var isFavorite = favorite.val();
            var idrow = $("#idCase", row).val();
            var options;
            if (isFavorite == "false") {
                options = {
                    idObject: idrow,
                    favoriteType: 'CASES'
                };
            $.when(
                self.dataService.addFavorite(options)
             ).done(function (favoriteData) {
                icon.addClass("on").removeClass("off");
                favorite.val("true");
                $("#guidFavorite", row).val(favoriteData.idFavorites);
            });
            } else {
                options = {
                    idObject: $("#guidFavorite", row).val(),
                    favoriteType: 'CASES'
                };
            $.when(
                self.dataService.delFavorite(options)
             ).done(function (favoriteData) {
                icon.addClass("off").removeClass("on");
                favorite.val("false");
            });
            }



        });
    },
    /*
    *   Misc method to format cell values
    */
    formatRequest: function (value) {
        return value;
    },
    /**
    * Misc method to render categories
    */
    formatCategories: function (value) {
        return value;
    },
    isArray: function (value) {
        if (typeof (value) == 'object') {
            return true;
        } else {
            return false;
        }
    },
    isDate: function (value) {
        var state = false;
        try {
            var date = new Date(value);
            if (date.getYear() > 0) {
                state = true;
            }
        } catch (e) {
            state = false;
        }
        return state;
    },

    getMenu: function () {
        return this.params.menu || null;
    }

});
