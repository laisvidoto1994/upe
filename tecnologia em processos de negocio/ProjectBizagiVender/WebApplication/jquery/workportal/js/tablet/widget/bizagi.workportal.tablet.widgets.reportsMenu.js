/*
*   Name: BizAgi Workportal Tablet Reports Widget Controller
*   Author: David Romero
*/

// Auto extend
bizagi.workportal.widgets.reportsMenu.extend("bizagi.workportal.widgets.reportsMenu", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        self._super(workportalFacade, dataService, params);
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;

        //prepare json
        $.when(self.buildAnalysisJSON()).done(function () {

            //render reports menu
            self.renderReportsMenu("Reports");
        });

        //Events handler
        self.eventsHandler();
    },

    /**
    * Get getAnalisysQueries service and parse json to
    * create tree categories
    */
    getAnalisysQueries: function () {

        var self = this;
        var analysisJSON = [];
        var def = new $.Deferred();

        $.when(self.dataService.getReporstAnalysisQuery()).done(function (data) {
            $.each(data.queries, function (key, value) {
                analysisJSON.push({
                    displayName: value.name || "",
                    description: value.description || "",
                    icon: "",
                    show: true,
                    filters: value.filterParameters,
                    endPoint: self.endPoint[value.reportSet],
                    reportSet: value.reportSet,
                    activeEdit: true,
                    id: value.id,
                    subItems: []
                });
            });

            def.resolve(analysisJSON);
        });

        return def.promise();
    },

    /*
    * Render list categories for each idCategory
    */
    renderReportsMenu: function (index) {

        var self = this;
        var content = self.getContent();
        var tmplItems = self.workportalFacade.getTemplate("reportsMenu-items");
        var tmplNoItems = self.workportalFacade.getTemplate("reportsMenu-noitems");
        var reportsContainer = $("#bz-wp-widget-reportsmenu-list", content);
        var elements = self.reportsMenu[index];

        if (elements.length) {
            reportsContainer.html($.tmpl(tmplItems, { elements: elements }));
               
        } else {
            reportsContainer.html($.tmpl(tmplNoItems, { elements: elements }));
        }

    },

    /*
    * Build menu JSON
    */
    buildAnalysisJSON: function () {

        var self = this;
        var deferred = $.Deferred();

        $.when(self.getAnalisysQueries()).pipe(function (data) {

            if (bizagi.menuSecurity.AnalysisQueries && (data.length > 0)) {

                self.reportsMenu["AnalysisQuery"] = data;

                self.reportsMenu["Reports"].push({
                    displayName: self.resources.getResource('workportal-menu-submenu-AnalysisQueries'),
                    show: true,
                    icon: "",
                    endPoint: "",
                    subItems: "AnalysisQuery"
                });
            }

            deferred.resolve();
        });

        return deferred.promise();
    },

    /*
    * Events Handler
    */
    eventsHandler: function () {

        var self = this;
        var content = self.getContent();
        var $menuList = $("#bz-wp-widget-reportsmenu-list", content);

        //event for selected menu item
        $menuList.on("click", "li.bz-wp-widget-reportsmenu-readmode", function (event) {

            event.stopPropagation();

            var $el = $(this);
            var subItems = $el.data("subitems"),
                displayName = $el.data("displayname"),
                endPoint = $el.data("endpoint"),
                id = $el.find(".bz-wp-widget-reportsmenu-itemactions").data("id");

            //execute selected item
            self.execSelectedItem(id, subItems, endPoint);

            //build navigation tree
            self.buildNavTree(displayName, subItems);

        });

        //event for edit o delete custom report
        $menuList.on("click", ".bz-wp-widget-reportsmenu-action", function (event) {

            event.stopPropagation();
            event.preventDefault();

            var $li = $(this).closest("li.bz-wp-widget-reportsmenu-item");
            var id = $(this).closest(".bz-wp-widget-reportsmenu-itemactions").data("id");

            if ($(this).hasClass("bz-wp-widget-reportsmenu-edit")) {
                self.showReportEdition(id, $li);
            } else if ($(this).hasClass("bz-wp-widget-reportsmenu-delete")) {
                self.showDeleteForm(id, $li);
            } else if ($(this).hasClass("bz-wp-widget-reportsmenu-cancel")) {
                self.cancelReportAction(id, $li);
            } else if ($(this).hasClass("bz-wp-widget-reportsmenu-applyedition")) {
                self.applyReportEdition(id, $li)
            } else if ($(this).hasClass("bz-wp-widget-reportsmenu-applydelete")) {
                self.deleteReport(id, $li);
            }

        });

        //event for navigation tree
        $("#bz-wp-widget-reportsmenu-navtree", content).on("click", "li", function (event) {

            //remove tree
            $(this).nextAll().remove();

            var path = $(this).data("path");
            self.renderReportsMenu(path);

        });

    },

    /*
    * Actions for the selected item in menu
    */
    execSelectedItem: function (id, subItems, endPoint) {

        var self = this;

        if (endPoint === "") {
            self.renderReportsMenu(subItems);
        } else {

            var filters = (!id) ? {} : self.getFiltersById(id);

            self.publish("changeWidget", {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_CHART,
                endPoint: endPoint,
                filters: filters
            });
        }

    },

    /*
    * Form to delete report 
    */
    showDeleteForm: function (id, $li) {

        var self = this;
        var tmpl = self.workportalFacade.getTemplate("reportsMenu-delete");
        var form = $.tmpl(tmpl, { id: id });

        $li.slideUp("fast", function () {
            $(this).removeClass('bz-wp-widget-reportsmenu-readmode').addClass('bz-wp-widget-reportsmenu-edition').html(form);
        });

        $li.slideDown("fast");

    },

    /*
    * Delete report by id
    */
    deleteReport: function (id, $li) {

        var self = this;
        var content = self.getContent();
        var params = "id=" + id;

        $.when(self.dataService.deleteReportData(params)).done(function (response) {

            if (response.status === true) {
                var $liSiblings = $li.nextAll();
                
                if ( $liSiblings.size() > 0 ) {

                    $liSiblings.slideUp("fast", function () {
                        //remove item
                        $li.remove(); 
                    });

                    $liSiblings.slideDown("fast");
                } else {
                    $li.fadeOut("fast", function () {
                        $(this).remove();
                    });
                }

                //remove data from array
                self.reportsMenu["AnalysisQuery"] = jQuery.grep(self.reportsMenu["AnalysisQuery"], function (value) {
                    return value.id !== id;
                });

                if (!self.reportsMenu["AnalysisQuery"].length) {
                    self.reportsMenu["Reports"].pop();
                    $("#bz-wp-widget-reportsmenu-navtree li:nth-of-type(1)", content).trigger("click");
                }

            }

        });

    },

    /*
    * Build Navigation Tree
    */
    buildNavTree: function (displayName, path) {

        var self = this;
        var content = self.getContent();
        var tmpl = self.workportalFacade.getTemplate("reportsMenu-tree");
        var categoryCnt = $.tmpl(tmpl, { displayName: displayName, path: path });

        $("#bz-wp-widget-reportsmenu-navtree", content).append(categoryCnt);

    },

    /*
    * Show edition form 
    */
    showReportEdition: function (id, $li) {

        var self = this;
        var tmpl = self.workportalFacade.getTemplate("reportsMenu-edition");
        var reportData = self.getReportsData(id);

        var form = $.tmpl(tmpl, {
            displayName: reportData[0].displayName,
            description: reportData[0].description,
            id: id
        });

        $li.slideUp("fast", function () {
            $(this).removeClass('bz-wp-widget-reportsmenu-readmode').addClass('bz-wp-widget-reportsmenu-edition').html(form);
        });

        $li.slideDown("fast");        
    },

    /*
    * Apply report edition
    */
    applyReportEdition: function (id, $li) {

        var self = this;
        var elements = $li.find("input, textarea");

        if (self.validateFormElements(elements)) {

            var reportData = self.getReportsData(id);
            var name = elements[0].value;
            var description = elements[1].value;

            var params = "parameters=" + JSON.stringify({ id: id, name: name, description: description, reportSet: reportData[0].reportSet, filterParameters: reportData[0].filters });

            $.when(self.dataService.updateReportData(params)).done(function (response) {

                if (response.status !== true) {

                    var cnt = $(elements[0]).siblings(".bz-wp-widget-reportmenu-messagecnt");
                    var msg = response.message;

                    self.showValidationMessage(msg, cnt)
                } else {

                    reportData[0].displayName = name;
                    reportData[0].description = description;

                    self.cancelReportAction(id, $li);
                }
            });
        }

    },


    /*
    * Validate form
    */
    validateFormElements: function (elements) {

        var self = this;
        var isValid = true;

        for (var i = 0, length = elements.length; i < length; i++) {

            var msgContainer = $(elements[i]).siblings(".bz-wp-widget-reportmenu-messagecnt");

            if (self.validateRequired($(elements[i]))) {

                if (self.validateSpecialCharacters($(elements[i]))) {
                    self.removeValidationMessage(msgContainer);
                } else {
                    isValid = false;
                    self.showValidationMessage(self.getResource("bz-rp-components-customreports-invalidvalue"), msgContainer);
                }

            } else {
                isValid = false;
                self.showValidationMessage(self.getResource("bz-rp-components-customreports-required"), msgContainer);
            }
        }

        return isValid;
    },

    /*
    * Show message
    */
    showValidationMessage: function (msg, cnt) {

        var self = this;
        var tmpl = self.workportalFacade.getTemplate("reportsMenu-vldmessage");

        cnt.html($.tmpl(tmpl, { message: msg }));
    },

    /*
    * Remove message
    */
    removeValidationMessage: function (cnt) {

        var self = this;

        $(".bz-wp-widget-reportmenu-errormsg", cnt).remove();
    },

    /*
    * Validate required
    */
    validateRequired: function ($el) {

        var self = this;
        var isValid = true;

        if ($el.attr('required')) {
            if ($el.val() === "") {
                isValid = false;
            }
        }

        return isValid;
    },

    /*
    * Validate special caracters
    */
    validateSpecialCharacters: function ($el) {

        var exp = new RegExp(/^[a-zA-Z0-9- ]*$/);
        var isValid = true;

        if (!exp.test($el.val())) {
            isValid = false;
        }

        return isValid;
    },

    /*
    * Cancel report action
    */
    cancelReportAction: function (id, $li) {

        var self = this;
        var tmpl = self.workportalFacade.getTemplate("reportsMenu-itemsdata");
        var reportData = self.getReportsData(id);

        var content = $.tmpl(tmpl, { element: reportData[0] });

        $li.slideUp("fast", function () {
            $(this).addClass("bz-wp-widget-reportsmenu-readmode").removeClass('bz-wp-widget-reportsmenu-edition').html(content);
        });

        $li.slideDown("fast");

    },

    /*
    * Get Reports Data
    */
    getReportsData: function (id) {

        var self = this;
        var queryItems = self.reportsMenu["AnalysisQuery"];

        return queryItems.filter(function (obj) {
            return (obj.id === id);
        });


    },

    /*
    * Get filter by id
    */
    getFiltersById: function (id) {

        var self = this;
        var rpData = self.getReportsData(id);

        return rpData[0].filters;
    }
});
