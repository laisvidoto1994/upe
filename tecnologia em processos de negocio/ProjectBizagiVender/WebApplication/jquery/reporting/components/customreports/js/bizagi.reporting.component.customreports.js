/*
* @title : Process filter componet
* @author : David Romero
* @date   : 19/02/2014
* Comments:
*     Defines a base class for all report components
*
*/

bizagi.reporting.component.controller("bizagi.reporting.component.customreports", {

    /*
    *   Constructor
    */
    init: function (canvas, services, params) {
        params = params || {};

        // Call super

        this._super(canvas);
        this.reportSet = params.info.reportSet;
        this.reportName = params.info.reportName;
        this.filters = params.filters;
        this.services = services;
        this.modal = [];

        // Render component
        this.render();
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "button": (bizagi.getTemplate("bizagi.reporting.component.customreports") + "#bz-rp-components-customreports-button"),
            "form": (bizagi.getTemplate("bizagi.reporting.component.customreports") + "#bz-rp-components-customreports-form"),
            "modal-container": (bizagi.getTemplate("bizagi.reporting.component.customreports") + "#bz-rp-components-customreports-container"),
            "message": (bizagi.getTemplate("bizagi.reporting.component.customreports") + "#bz-rp-components-customreports-message")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Templated render component
    */
    renderComponent: function () {
        var self = this,
            template = self.getTemplate("button"),
            content = $.tmpl(template);

        return content;
    },

    /*
    * After Render is loaded execute some actions
    */
    postRender: function () {

        var self = this;
        self.eventsHandler();
    },

    /*
    * Append div for displaying data
    */
    appendModal: function () {

        var self = this;

        if (!self.modal.length) {

            var tmpl = self.getTemplate("modal-container");
            self.modal = $.tmpl(tmpl);
            self.modal.appendTo('body');
        }
    },

    /*
    * Show custom reports dialog
    */
    showCustomReportsDialog: function (content) {

        var self = this;

        var window = self.modal.append(content);

        content.dialog({
            resizable: false,
            dialogClass: "bz-rp-components-custom-reports-dialog",
            modal: true,
            appendTo: self.modal,
            title: self.getResource("bz-rp-components-customreports-title"),
            draggable: false,
            maximize: false,
            close: function () {
                $(this).remove();
            },
            buttons: [
                    {
                        text: self.getResource("confirmation-savebox-save"),
                        click: function (event) {
                            var $button = $(event.target).closest("button");
                            event.preventDefault();

                            $.when(self.saveQuery()).done(function () {
                                $button.remove();
                            });

                        }
                    },
                    {
                        text: self.getResource("render-form-dialog-box-close"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
        });

    },

    /*
    * Save reports filters
    */
    saveQuery: function () {

        var self = this;
        var deferred = $.Deferred();
        var elements = $("#bz-rp-components-customereports-form", self.modal)[0].elements;
        var toSend = self.getJSON(elements);

        if (self.validateFields(elements)) {

            $.when(self.services.customReportsSaveQuery(toSend, $(".bz-rp-components-customreports-message", self.modal))).done(function (response) {

                if (response.status === false) {

                    self.showMessage(self.getResource("bz-rp-components-customreports-alreadyexist"), $(elements[0]).siblings(".bz-rp-messagecnt"));
                    deferred.reject();
                } else {

                    $("#bz-rp-components-custom-reports-warpper", self.modal).remove();
                    $("#bz-rp-components-customreports-message", self.modal).show().append(self.getResource("bz-rp-components-customreports-sucessfulsave"));

                    deferred.resolve();
                }
            });

            return deferred.promise();
        } else {

            return deferred.reject();
        }

    },

    /*
    * Validate fields
    */
    validateFields: function (elements) {

        var self = this
        var validFlg = true;

        for (var i = 0, length = elements.length; i < length; i++) {

            var msgContainer = $(elements[i]).siblings(".bz-rp-messagecnt");

            if (self.validateRequired($(elements[i]))) {

                if (self.validateSpecialCharacters($(elements[i]))) {
                    self.removeMessage(msgContainer);
                } else {
                    validFlg = false;
                    self.showMessage(self.getResource("bz-rp-components-customreports-invalidvalue"), msgContainer);
                }

            } else {
                validFlg = false;
                self.showMessage(self.getResource("bz-rp-components-customreports-required"), msgContainer);
            }
        }

        return validFlg;
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
    * Show message
    */
    showMessage: function (msg, cnt) {

        var self = this;
        var tmpl = self.getTemplate("message");

        cnt.html($.tmpl(tmpl, { message: msg }));
    },

    /*
    * Remove message
    */
    removeMessage: function (cnt) {

        var self = this;

        $(".bz-rp-errormsg", cnt).remove();
    },

    /*
    * Set filters
    */
    setReportsFilters: function (filters) {

        var self = this;
        self.filters = filters;
    },

    /*
    * Get JSON for custom reports
    */
    getJSON: function (elements) {
        var self = this;
        var json = { name: elements[0].value, description: elements[1].value, reportSet: this.reportSet, filterParameters: self.filters };

        return "parameters=" + JSON.stringify(json);
    },

    /*
    * Listen events
    */
    eventsHandler: function () {
        var self = this;
        var form = self.getTemplate("form");

        $("#bz-rp-custom-reports-button", self.content).on("click", function () {

            var content = $.tmpl(form, { name: self.reportName });
            self.appendModal();
            self.showCustomReportsDialog(content);
        });

    }

});

