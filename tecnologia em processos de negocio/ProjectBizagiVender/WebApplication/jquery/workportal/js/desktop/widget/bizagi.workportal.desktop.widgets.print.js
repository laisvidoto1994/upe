/*
*   Name: BizAgi Workportal Desktop Print Version Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will provide desktop overrides to implement the print version
*/

// Auto extend
bizagi.workportal.widgets.print.extend("bizagi.workportal.widgets.print", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "print": bizagi.getTemplate("bizagi.workportal.desktop.widget.print").concat("#bz-wp-widget-print"),
            useNewEngine: false
        });
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();


        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";
        // Load render page
        var facade = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });

        //Print all grid rows
        var configParams = { p_all_rows: 1000000 };

        $.when(facade.execute(
                $.extend({
                    canvas: content,
                    printversion: true
                }, $.extend(self.params.params, configParams)))).done(function () {

                    // Remove Tabs elements
                    self.formatTabs();

                    // Remove Group elements
                    self.formatGroups();

                    self.appendCaseDetails();

                    // Remove events to ECM control
                    self.formatECM();

                    // Remove events to button control
                    self.formatButton();

                    // format grid
                    self.formatGrid();

                    // format renders
                    self.formatRenderContainer();

                    // Remove bottons save and next
                    $(".ui-bizagi-button-container", content).remove();

                });
    },

    formatTabs: function () {
        var self = this,
	    formatContent = $("<div>"),
	    i = 0,
	    control = self.getContent(),
	    tabElement = $('.ui-tabs', control);

        // Destroy tabs
        $.each(tabElement, function () {

            // Reorder tabs content
            var ul = $('ul', $(this)); // header elements
            var labels = $('>div', $(this)); // page elements

            $.each($('li', ul), function () {
                // Select all tabs element to force the content loading
                tabElement.tabs("option", "active", i);

                // add header to final content
                $(formatContent).append('<h3>' + $(this).text() + '</h3>');

                // Add content to final content
                $(formatContent).append(labels[i++]);
            });

            // Empty old content and append formated
            $('.ui-tabs', control).empty();
            $('.ui-tabs', control).append(formatContent);
            tabElement.tabs("destroy");
        });
    },

    /* APPEND CASE DETAILS
    =====================================================*/
    appendCaseDetails: function () {
        var self = this;
        var control = self.getContent();

        self.dataService.summaryCaseDetails({
            idCase: self.params.params.idCase
        }).done(function (data) {

            var getState = function (idWorkItem, currentState) {
                var state = "";
                $.each(currentState, function (key, value) {
                    if (value.idWorkItem == idWorkItem) {
                        state = value.state || value.displayName;
                    }
                });
                return state;
            }
            // Process Metadata
            var $caseDetails = $('<ul></ul>').addClass('ui-bz-print-case-details');

            // Case Number
            $('<li></li>').text(self.resources.getResource('workportal-widget-inboxcommon-case-number') + ' ' + data.caseNumber).appendTo($caseDetails);

            // task
            if (self.params && self.params.params && self.params.params.idWorkitem != 0) {
                $('<li></li>').text(self.resources.getResource('workportal-widget-inboxcommon-activities-name') + ' ' + getState(self.params.params.idWorkitem, data.currentState)).appendTo($caseDetails);
            }
            // Created by
            $('<li></li>').text(self.resources.getResource('workportal-widget-inboxcommon-created-by') + ' ' + data.createdBy.Name).appendTo($caseDetails);

            // Creation date
            $('<li></li>').html(self.resources.getResource('workportal-widget-inboxcommon-creation-date') + '<span class=\"formatDate\">' + data.creationDate + "</span>").appendTo($caseDetails);

            // State expires on
            if (typeof data.estimatedSolutionDate != "undefined") {
                $('<li></li>').html(self.resources.getResource('workportal-widget-inboxcommon-state-expires-on') + '<span class=\"formatDate\">' + data.estimatedSolutionDate + "</span>").appendTo($caseDetails);
            }

            function setProcess(process){
                $('<li></li>').text(self.resources.getResource('workportal-widget-inboxcommon-process') + ' ' + process).appendTo($caseDetails);
            }
            // Process
            if(data.idPlan){
                $.when(self.dataService.getPlan({idPlan: data.idPlan})).done(function (responsePlan) {
                    setProcess(responsePlan.name);
                });
            }
            else{
                setProcess(data.process)
            }

            // Process path
            if(data.processPath && data.processPath !== "undefined"){
                $('<li></li>').text(self.resources.getResource('workportal-widget-inboxcommon-process-path') + ' ' + data.processPath).appendTo($caseDetails);
            }

            // Append data
            $('.ui-bizagi-container:first', control).prepend($caseDetails);

            //Format dates
            bizagi.util.formatInvariantDate(control, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));
        });
    },

    formatGroups: function () {
        var self = this,
	       control = self.getContent(),
	       container = $('h3.ui-bizagi-container-group-header', control);

        $.each(container, function () {
            var containerText = $(this).text();

            // Get html to container and convert to plain text
            $(this).empty();
            $(this).append(containerText)
        });
    },


    /**
    * Format ECM control
    */
    formatECM: function () {
        var self = this,
	       control = self.getContent(),
	       container = $('.ui-bizagi-render-upload', control);

        $(container).bind('ecmLoaded', function (cont) {
            var image = $('img', cont.container);
            var file = $(".filename a:last", cont.container);
            var value = $(file).parent('li').text().replace(/^\s+|\s+$/g, "");

            // Remove click event to image
            image.unbind('click');

            // Remove click event to link an parse value
            file.unbind('click');
            $(file).parent('li').text(value);

        });
    },

    /**
    * Format Button Control
    */
    formatButton: function () {
        var self = this,
	    control = self.getContent(),
	    button = $('.ui-bizagi-render-button', control),
	    value = button.val(),
	    parentContainer = button.parent();

        $(parentContainer).empty();
        $(parentContainer).append("<div class='ui-bizagi-render-button'>" + value + "</div>");
    },

    /**
    *  Format Grid Control
    */
    formatGrid: function () {
        var self = this,
	    control = self.getContent(),
        tableControl = $('.ui-bizagi-grid-table', control);
        pageContent = $('.ui-pg-table', control),
	    closeButton = $('.ui-jqgrid-titlebar-close', control);

        // Clean paginator
        /*$.each(pageContent, function () {
        $("td:not[align='left'],td:not[align='center']", $(this)).remove();
        });*/

        $("th.ui-bizagi-column-hidden, td.ui-bizagi-grid-key, .bz-rn-grid-container-foother", control).remove();

        //Remove click event
        $("[data-action], ul li, .ui-bizagi-grid-column, tr, th", tableControl).unbind("click");
        // Remove close button
        $(closeButton).remove();
    },

    /**
    *   Format Render Style
    */

    formatRenderContainer: function () {
        var self = this,
        control = self.getContent();
        $('.ui-bizagi-notifications-container', control).remove();
    }
});
