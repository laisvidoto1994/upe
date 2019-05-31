/*
* @title : Detail list component
* @author : David Romero
* @date   : 05/03/2014
* Comments:
*     Defines a base class for detail list
*
*/
bizagi.reporting.component.controller("bizagi.reporting.component.detaillist", {

    /*
    *   Constructor
    */
    init: function (canvas, services) {

        // Call super
        this._super(canvas);
        this.services = services;
        this.modal = [];
        this.render();
        this.process = 0;

    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "main": (bizagi.getTemplate("bizagi.reporting.component.detaillist") + "#bz-rp-component-detaillist-main"),
            "content": (bizagi.getTemplate("bizagi.reporting.component.detaillist") + "#bz-rp-component-detaillist-content"),
            "summary": (bizagi.getTemplate("bizagi.reporting.component.detaillist") + "#bz-rp-component-detaillist-summary"),
            "pager": (bizagi.getTemplate("bizagi.reporting.component.detaillist") + "#bz-rp-component-detaillist-pager"),
            "container": (bizagi.getTemplate("bizagi.reporting.component.detaillist") + "#bz-rp-components-detaillist-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Templated render component
    */
    renderComponent: function () {
        var self = this;

        var tmpl = self.getTemplate("container");
        self.modal = $.tmpl(tmpl).appendTo("body");

        return [];
    },

    /*
    * After Render is loaded execute some actions
    */
    postRender: function () {
        var self = this;

        self.eventsHandler();
    },

    /*
    * Render Detail List
    */
    renderDetailList: function (filter, process) {

        var self = this;

        self.filter = filter;
        self.process = process;

        var tmpl = self.getTemplate("main");
        self.content = $.tmpl(tmpl);

        $.when(self.showDialog()).done(function () {

            self.setDetailList();
        });


    },

    /*
    * Set Detail List
    */
    setDetailList: function () {

        var self = this;

        return $.when(self.services.getDetailList(self.filter)).pipe(function (params) {

            self.detailsTable = params.detailsTable;
            self.pages = Math.ceil(self.detailsTable.rows.length / 6);

            self.renderContent();
            self.bindPagerEvents();
        });
    },

    /*
    * Render data by page
    */
    renderContent: function () {

        var self = this;
        var tmpl = self.getTemplate("content");
        var json = $.extend({}, self.getSummaryJSON(1), self.getPagerJSON(1, "next"));
        self.removeDuplicatesInData(json);
        //render content
        var content = $.tmpl(tmpl, json, {
            device: self.device,
            formatValue: function(value, dataHeader){
                return bizagi.util.formatValueByDataType(value, dataHeader.dataType);
            }
        });

        $("#bz-rp-detaillist-container", self.modal).html(content);
    },

    removeDuplicatesInData: function (data) {
        var dateIndexes = [];
        $.each(data.summary.headers, function (i, item) {
            if (item.dataType === "DateTime") {
                dateIndexes.push(i);
            }
        });

        $.each(data.summary.rows, function (i, val) {
            $.each(val.cells, function (j, values) {
                var uniques = [];
                $.each(values, function (z, el) {
                    if ($.inArray(el, uniques) === -1) uniques.push(el);
                });

                //Checks if is already formated
                var alreadyFormated;
                if (data.summary.rows[i].cells[j].isFormated)
                    alreadyFormated = true;

                data.summary.rows[i].cells[j] = uniques;

                // format date
                if (dateIndexes.indexOf(j) !== -1) {
                    //if is not formated, it make it formated
                    if (!alreadyFormated)
                        data.summary.rows[i].cells[j] = values;

                    //Keep the flag updated
                    data.summary.rows[i].cells[j].isFormated = true;
                }
            });
        });
        return data;
    },



    /*
    * Prepare JSON to show detail list
    */
    getSummaryJSON: function (page) {

        var self = this;
        var first = (page - 1) * 6;
        var last = first + 6;

        return { summary: { headers: self.detailsTable.headers, rows: self.detailsTable.rows.slice(first, last)} };
    },

    /*
    * Prepare JSON to show pagination
    */
    getPagerJSON: function (page, order) {

        var self = this;
        var arr = [];
        var a = 0;

        if (self.pages > 1) {
            if (order === "next") {
                a = ((page + 10) > self.pages && self.pages > 10) ? self.pages - 9 : page;
            } else {
                a = ((page - 10) < 1) ? 1 : page - 9;
            }

            var b = (self.pages > 10) ? a + 9 : self.pages;

            for (var i = a; i <= b; i++) {
                arr.push(i);
            }
        }

        return { pager: { pages: arr, page: page, total: self.pages} }
    },

    /*
    * Show detail list dialog
    */
    showDialog: function () {

        var self = this;
        var deferred = $.Deferred();

        self.content.dialog({
            resizable: false,
            modal: true,
            dialogClass: "bz-rp-dialog",
            height: 680,
            appendTo: self.modal,
            title: self.getResource("bz-rp-components-detaillist-title"),
            draggable: false,
            maximize: false,
            close: function () {
                $(this).remove();
            },
            open: function (event) {
                event.stopPropagation();
                deferred.resolve();
            }
        });

        return deferred.promise();
    },

    /*
    * Bind events for pager
    */
    bindPagerEvents: function () {

        var self = this;
        var $pager = self.modal.find("#bz-rp-detaillist-pagercnt");

        $pager.on("click", ".bz-rp-detaillist-pagintation-page, .bz-rp-detaillist-pagination-firstpage, .bz-rp-detaillist-pagination-lastpage, .bz-rp-detaillist-pagination-nextpage, .bz-rp-detaillist-pagination-prevpage", function (event) {

            event.stopPropagation();

            if ($(this).hasClass("bz-rp-detaillist-pagintation-page")) {

                var page = parseInt($(this).data('page'));
                self.highlightPage($(this));
                self.updateSummary(page);
            } else if ($(this).hasClass("bz-rp-detaillist-pagination-firstpage")) {

                self.updateContent(1, "prev");
            } else if ($(this).hasClass("bz-rp-detaillist-pagination-lastpage")) {

                self.updateContent(self.pages, "next");
            } else if ($(this).hasClass("bz-rp-detaillist-pagination-nextpage")) {

                var page = $(this).prev(".bz-rp-detaillist-pagintation-page").data("page");
                page = parseInt(page) + 1;
                self.updateContent(page, "next");
            } else if ($(this).hasClass("bz-rp-detaillist-pagination-prevpage")) {

                var page = $(this).next(".bz-rp-detaillist-pagintation-page").data("page");
                page = parseInt(page) - 1;
                self.updateContent(page, "prev");
            }

        });
    },

    /*
    * Update content
    */
    updateContent: function (page, order) {

        var self = this;

        self.updatePager(page, order);
        self.updateSummary(page);
    },

    /*
    * Update summary
    */
    updateSummary: function (page) {

        var self = this;
        var tmpl = self.getTemplate("summary");
        var json = self.getSummaryJSON(page);
        self.removeDuplicatesInData(json);
        //summary content
        var content = $.tmpl(tmpl, json.summary, {
            device: self.device,
            formatValue: function(value, dataHeader){
                return bizagi.util.formatValueByDataType(value, dataHeader.dataType);
            }
        });

        $("#bz-rp-detaillist-summarycnt", self.modal).html(content);
    },

    /*
    * Update pager
    */
    updatePager: function (page, order) {

        var self = this;
        var tmpl = self.getTemplate("pager");
        var json = self.getPagerJSON(page, order);

        var content = $.tmpl(tmpl, json.pager);

        $("#bz-rp-detaillist-pagercnt", self.modal).html(content);
    },

    /*
    * highlight the selected page
    */
    highlightPage: function ($el) {

        var self = this;

        $(".bz-rp-detaillist-pagintation-page", self.modal).removeClass("bz-rp-detaillist-pagination-active");
        $el.addClass("bz-rp-detaillist-pagination-active");
    },

    /*
    * Events Handler
    */
    eventsHandler: function () {

        var self = this;

        self.modal.on("click", ".bz-rp-exportdtl-excel, .bz-rp-detaillist-summary-admincell, .bz-rp-detaillist-summary-viewcell, .bz-rp-detaillist-return, .bz-rp-detaillist-summary-opencase, .caseClicked, .activityClicked", function (event) {

            event.stopPropagation();

            var idCase = $(this).closest("tr").data("case");

            if ($(this).hasClass("bz-rp-exportdtl-excel")) {

                self.exportExcel();
            } else if ($(this).hasClass("bz-rp-detaillist-summary-admincell")) {

                var radNumber = $(this).closest("span").data("radnumber");
                self.excAdminAction(radNumber, this);

                $(this).closest("tr").addClass("bz-wp-detaillist-selectedcase");

            } else if ($(this).hasClass("bz-rp-detaillist-summary-viewcell")) {

                self.excViewAction(idCase);
            } else if ($(this).hasClass("bz-rp-detaillist-return")) {

                self.returnToDetailList();
            } else if ($(this).hasClass("bz-rp-detaillist-summary-opencase")) {

                self.OpenCaseWithSecurity(idCase);
            } else if ($(this).hasClass("caseClicked") || $(this).hasClass("activityClicked") ) {

                //Captures idCase from the caseSearch Widget
                idCase = $(this)[0].getAttribute("data-idCase");
                self.OpenCaseWithSecurity(idCase);
                self.content.dialog("close");
            }
        });
    },

    /*
    * Open case depending on the security of the user clicking
    */
    OpenCaseWithSecurity: function (idCase) {
        var self = this;

        $.when(self.haveCaseAccess(idCase))
            .done(function (result) {
                if (result.hasAccess) {
                self.content.dialog("close");
                self.openCase({ idCase: idCase });
            }
            else {
                self.showErrorMessage();
            }
        });
    },

    /*
    * Show security error for case
    */
    showErrorMessage: function () {
        var self = this;
        var message = self.getResource("bz-rp-components-detaillist-access-error");
        bizagi.showMessageBox(message);
    },

    /*
    * Check case access for user
    */
    haveCaseAccess: function (idCase) {
        var self = this;
        var params = "idCase=" + idCase + "&user=" + bizagi.currentUser.idUser;
        var result = self.services.checkCaseAccess(params);
        return result;
    },

    /*
    * Open Case
    */
    openCase: function (data) {

        var self = this;

        self.publish("rp-opencase", { caseData: data })
    },

    /*
    * Export to Excel
    */
    exportExcel: function () {

        var self = this;
        var params = self.filter + "&user=" + bizagi.currentUser.idUser;
        self.services.exportDetailList(params);
    },

    /*
    * Excecute action when clicking admin column
    */
    excAdminAction: function (radNumber) {

        var self = this;

        self.publish("rp-caseadministration", {
            canvas: $("#bz-rp-detaillist-casesearch", self.modal),
            radNumber: radNumber
        });

        //Change view
        $("#bz-rp-detaillist-mainframe", self.modal).hide();
        $("#bz-rp-detaillist-auxframe", self.modal).show();
    },

    /*
    * Excecute action when cliking view column
    */
    excViewAction: function (idCase) {

        var self = this;

        self.publish("rp-graphicquery", { idCase: idCase, idWorkflow: self.process });
    },

    /*
    * Return to detail list
    */
    returnToDetailList: function () {

        var self = this;
        var $mainframe = $("#bz-rp-detaillist-mainframe", self.modal);
        var $auxframe = $("#bz-rp-detaillist-auxframe", self.modal);
        var invalidate = $(".bz-wp-casesearch-invalidation", $auxframe);

        if (invalidate.length > 0) {

            $.when(self.setDetailList()).done(function () {

                //Change view
                $mainframe.show();
                $auxframe.hide();
            });

        } else {
            $("tr.bz-wp-detaillist-selectedcase", $mainframe).removeClass("bz-wp-detaillist-selectedcase");

            //Change view
            $mainframe.show();
            $auxframe.hide();
        }

    }

});