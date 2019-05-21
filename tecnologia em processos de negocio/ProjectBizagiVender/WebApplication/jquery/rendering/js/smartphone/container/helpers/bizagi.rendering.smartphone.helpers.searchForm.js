/*
*   Name: BizAgi Smartphone Search Slide Implementation
*   Author: Oscar Osorio
*   Comments:
*   -   This script will shows a  search form  
*/
$.Class.extend("bizagi.rendering.smartphone.helpers.searchForm", {}, {


    /* 
    *   Constructor
    */
    init: function (dataService, renderFactory, searchForms, searchParams, searchFormParams) {
        //var self = this;
        this.dataService = dataService;
        this.renderFactory = renderFactory;
        this.searchForms = searchForms;
        this.searchParams = searchParams;
        this.searchFormParams = searchFormParams;
        this.searchFormDeferred = new $.Deferred();
    },



    renderEdition: function (params) {
        var self = this;
        self.properties = params;
        // Render search dialog
        self.renderSearchForm(params);
        // Return promise
        return self.searchFormDeferred.promise();

    },

    renderSearchForm: function (params) {
        var self = this;

        $.when(self.getSearchContainerData(params))
    .pipe(function (data) {
        if (params.editable == false) data.form.properties.editable = false;

        //searchFormParams
        form = self.renderFactory.getContainer($.extend({}, self.searchFormParams, {
            type: "form",
            data: data.form
        }));
        self.form = form;

        for (var indicator in form.children) {
            form.children[indicator].params = $.extend({}, form.children[indicator].params, self.searchFormParams);
        }

        return form.render();
    },

    function (message) {

        var errorTemplate = self.renderFactory.getCommonTemplate('form-error');
        $.tmpl(errorTemplate, { message: message }).appendTo(slideForm.find('.scroll-content'));
    }

    ).done(function (element) {

        var tabContainer = self.form.firstChild().properties.type == "tab" ? self.form.firstChild() : null;
        if (tabContainer) {
            // Bind select tab event
            tabContainer.bind("selected", function (e, ui) {
                var searchForm = self.searchForms[ui.index];
                $.when(self.loadSearchTab(params, ui.tab, searchForm))
    .done(function () {
        // Set currents search form
        self.currentSearchForm = ui.tab.firstChild();
        self.currentSearchForm.triggerHandler("ondomincluded");
    });
            });
            tabContainer.container.tabs("select", 0);
            self.currentSearchForm = tabContainer.firstChild().firstChild();
            if (!self.currentSearchForm.readyDeferred)
                self.currentSearchForm.readyDeferred = new $.Deferred();
            self.currentSearchForm.triggerHandler("ondomincluded");
        } else {
            // Set currents search form
            self.currentSearchForm = self.form.firstChild();
            if (!self.currentSearchForm.readyDeferred)
                self.currentSearchForm.readyDeferred = new $.Deferred();
            self.currentSearchForm.triggerHandler("ondomincluded");
        }


        self.searchFormParams.container.find("#container-items-edit").html(element);
        self.containerGridResults = self.currentSearchForm.container.find("#bz-rn-sf-gr-results");
        self.containerSearchCriteria = self.currentSearchForm.container.find(".ui-bizagi-container-search-criteria");
        self.applyButtons();

    });
    },


    applyButtons: function () {
        var self = this;




        if (self.searchFormParams && self.searchFormParams.postRenderEdit) {
            self.displayBottomButtons();
            self.mainSuscriber = self.searchFormParams.menu.getLastSuscriber();
            self.searchFormParams.menu.removeLastSuscriber();
            self.searchFormParams.menu.nextSuscribe(self.currentSearchForm.idPageCache || self.mainSuscriber.key, [
    function (args) {
        if (args.action == "back") {
            self.mainSuscriber.callback({ action: "back" });
            self.searchFormParams.menu.changeContextualButtons("refresh", self.mainSuscriber.beforeButtons);
            self.searchFormParams.menu.removeSuscriber(args.key, false);
        }
    }, function (args) {
        if (args.action == "buttom") {
            self.currentSearchForm.performSearch(self.searchParams);
        }

    } ]);

            self.searchFormParams.menu.changeContextualButtons("button", { value: bizagi.localization.getResource("render-form-dialog-box-search") });

            self.currentSearchForm.bind("instancerefreshdone", function () {
                // Show search results container
                if (self.currentSearchForm.resultsGrid.properties.data != null && !jQuery.isEmptyObject(self.currentSearchForm.resultsGrid.properties.data.rows)) {
                    self.containerSearchCriteria.hide();
                    self.containerGridResults.show();

                    self.searchFormParams.menu.nextSuscribe(self.currentSearchForm.idPageCache + "instancerefreshdone" || self.mainSuscriber.key + "instancerefreshdone", [
    function (args) {
        if (args.action == "back") {
            self.containerSearchCriteria.show();
            self.containerGridResults.hide();
            self.searchFormParams.menu.changeContextualButtons("button", { value: bizagi.localization.getResource("render-form-dialog-box-search") });
            self.searchFormParams.menu.removeSuscriber(args.key, false);
            var btnSearch = self.currentSearchForm.container.find(".bz-btn-search");
            var btnSelect = self.currentSearchForm.container.find(".bz-btn-select");
            btnSearch.show();
            btnSelect.hide();
        }
    }, function (args) {
        if (args.action == "buttom") {
            self.searchFormParams.menu.removeSuscriber(args.key, false);
            self.searchFormParams.menu.notifyObservers("back");
            self.searchFormDeferred.resolve(self.searchFormParams.container.find("#bz-rn-sf-gr-results [data-key]").data("business-key"));
        }

    } ]);

                    self.searchFormParams.menu.changeContextualButtons("button", { value: bizagi.localization.getResource("render-search-advanced-results-button") });
                }
            });


        } else {
            self.displayBottomButtons();
        }
    },


    loadSearchTab: function (params, tab, searchForm) {
        var self = this;
        var defer = new $.Deferred();
        // If the tab has children it is loaded already
        if (tab.children.length > 0) return null;
        // Load search form data
        $.when(self.getSearchFormData(params, searchForm))
    .pipe(function (data) {
        // Render data inside selected tab
        var searchFormContainer = self.renderFactory.getContainer({
            type: "searchForm",
            data: data.form
        });
        tab.children.push(searchFormContainer);
        return searchFormContainer.render();
    })
    .done(function (element) {
        // Remove button container
        $(".ui-bizagi-button-container", element).detach();
        tab.container.append(element);
        defer.resolve();
    });
        return defer.promise();
    },


    getSearchContainerData: function (params) {
        var self = this;
        var deferred = new $.Deferred();
        var data = {
            form: {
                properties: {},
                elements: []
            }
        };
        var container = data.form;
        var searchFormToLoad = self.searchForms[0];
        // When there are more than one search form, render a tab container
        if (self.searchForms.length > 1) {
            var tabContainer = {};
            tabContainer.properties = {
                type: "tab"
            };
            tabContainer.elements = [];
            var otherElements = [];
            $.each(self.searchForms, function (i, searchForm) {
                var isDefault = searchForm["default"] || false;
                // Create tab item
                var tab = {};
                tab.properties = {
                    id: i,
                    type: 'tabItem',
                    displayName: searchForm.caption
                };
                tab.elements = [];
                // Append children 
                if (isDefault) {
                    tabContainer.elements.push({
                        container: tab
                    });
                    // Set properties to load default container
                    container = tab;
                    searchFormToLoad = self.searchForms[0];
                } else {
                    otherElements.push({
                        container: tab
                    });
                }
            });

            // Append no defaults elements
            $.each(otherElements, function (i, element) {
                tabContainer.elements.push(element);
            });
            data.form.elements.push({
                container: tabContainer
            });
        }

        // Loads default form
        $.when(self.getSearchFormData(params, searchFormToLoad))
    .done(function (searchFormData) {
        container.elements.push(searchFormData);
        // Resolve deferred
        deferred.resolve(data);
    });
        return deferred.promise();
    },

    getSearchFormData: function (params, searchForm) {
        var self = this;
        return self.dataService.getSearchFormData($.extend(params, {
            idSearchForm: searchForm.id,
            url: searchForm.url
        })).pipe(function (data) {
            // Append search render properties
            data.form.properties.idRender = params.idRender;
            return data;
        });
    },

    displayBottomButtons: function () {
        var self = this;
        self.currentSearchForm.container.find(".ui-bizagi-container-button-edit").hide();
        var containerButtons = self.currentSearchForm.container.find(".ui-bizagi-container-button-edit").clone();
        var templateBtn = '<button class="ui-bizagi-form-button ${name}">${text}</button>';
        var btnSearch = $.tmpl(templateBtn, { name: "bz-btn-search", text: bizagi.localization.getResource("render-form-dialog-box-search") }).appendTo(containerButtons);
        var btnSelect = $.tmpl(templateBtn, { name: "bz-btn-select", text: bizagi.localization.getResource("render-search-advanced-results-button") }).appendTo(containerButtons);
        var btnCancel = $.tmpl(templateBtn, { name: "bz-btn-cance", text: bizagi.localization.getResource("render-form-dialog-box-cancel") }).appendTo(containerButtons);
        btnSearch.bind("click", function () { self.currentSearchForm.performSearch(self.searchParams); });
        btnCancel.bind("click", function () { self.searchFormParams.menu.buttonsContextual.back.click(); });
        btnSelect.bind("click", function () { self.searchFormDeferred.resolve(self.searchFormParams.container.find("#bz-rn-sf-gr-results [data-key]").data("business-key")) });

        btnSelect.hide();
        var containerForm = self.currentSearchForm.container.find(".ui-bizagi-container-children-form");
        containerForm.append(containerButtons);
        containerButtons.show();

        self.currentSearchForm.bind("instancerefreshdone", function () {
            // Show search results container
            if (self.currentSearchForm.resultsGrid.properties.data != null && !jQuery.isEmptyObject(self.currentSearchForm.resultsGrid.properties.data.rows) && self.currentSearchForm.resultsGrid.properties.data.rows.length > 0) {
                self.containerSearchCriteria.hide();
                btnSearch.hide();
                btnSelect.show();
            } else if (self.currentSearchForm.resultsGrid.properties.data != null && !jQuery.isEmptyObject(self.currentSearchForm.resultsGrid.properties.data.rows)) {
                btnSearch.hide();
                btnSelect.hide();
            }
        });
    }


});
