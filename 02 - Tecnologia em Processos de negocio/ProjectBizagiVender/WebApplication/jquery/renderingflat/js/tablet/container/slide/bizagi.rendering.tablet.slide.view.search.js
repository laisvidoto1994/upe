/*
*   Name: BizAgi Tablet Search Slide view Implementation
*   Author: Richar Urbano - RicharU
*   Comments:
*   -   This script will shows a sliding search form  order to edit
*/

// Extends itself
$.Class.extend("bizagi.rendering.tablet.slide.view.search", {}, {
    /* 
    *   Constructor
    */
    init: function (dataService, renderFactory, searchForms, searchParams, slideParams) {
        var self = this;

        self.dataService = dataService;
        self.renderFactory = renderFactory;
        self.searchForms = searchForms;
        self.searchParams = searchParams;
        self.slideParams = slideParams;
        self.slideDeferred = new $.Deferred();
        self.extraButtons = (slideParams.hasOwnProperty("buttons")) ? slideParams.buttons : false;

        // Create container
        self.container = self.slideParams.navigation.createRenderContainer({ title: self.slideParams.title });

        self.processButtons()
            .done(function (data) {
                self.slideDeferred.resolve(data);
            }).fail(function () {
                self.slideDeferred.reject();
            });

        self.configureViewHandlers();
    },

    /**
     * Render the form
     * The params are the same that will be send to the ajax service
     * @param {} params 
     * @returns {} Returns a deferred
     */
    render: function (params) {
        var self = this;

        self.properties = params;

        //Render the search form
        self.renderSearchDialog(params);

        // Return promise
        return self.slideDeferred.promise();
    },

    /**
     * Render the search form
     * @param {} params 
     * @returns {} 
     */
    renderSearchDialog: function (params) {
        var self = this;

        bizagi.util.tablet.startLoading();

        // Creates a dialog
        $.when(self.getSearchContainerData(params)).pipe(function (data) {
            if (typeof (data.form.properties) != "undefined"){
                data.form.properties.orientation = self.searchParams.orientation || "ltr";
            }

            // Render dialog form
            var form = self.renderFactory.getContainer({
                type: "form",
                data: data.form,
                navigation: self.slideParams.navigation
            });

            // Save form reference
            self.form = form;

            // Return rendering promise
            return form.render();
        }).done(function (element) {
            // Append form in the slide view
            self.container.element.html(element);

            self.slideParams.navigation.navigate(self.container.id);

            // Add Button
            $(".ui-bizagi-button-container", self.form.container).append(self.buttonContainer);

            // Hide title of html content
            self.searchResultContainer = $(".ui-bizagi-container-search-results", element);
            self.searchResultContainer.hide();

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler("ondomincluded");

            // Set currents search form
            self.currentSearchForm = self.form.firstChild();
            self.currentSearchForm.triggerHandler("ondomincluded");

            self.currentSearchForm.bind("instancerefresh", function () {
                // Show search results container
                self.searchResultContainer.show();
            });

            self.form.bind("refresh", function (_, refreshParams) {
                refreshParams.scrollTop = self.form.container.parent().scrollTop();
                refreshParams = $.extend({
                    focus: focus,
                    selectedTabs: self.form.getSelectedTabs(),
                    isRefresh: true,
                    contextType: self.properties.contextType || "",
                    navigation: self.searchFormParams.navigation
                }, refreshParams);

                return self.renderSearchDialog(refreshParams);
            });

            // Add row selected handlers to resolve the deferred
            self.currentSearchForm.bind("instanceSelected", function (ev, ui) {
                // Close slide      
                self.goBack();

                self.slideBoxDeferred.resolve({
                    id: ui.id,
                    label: ""
                });
            });
            // if is any modal view displayed, hide it to allow this search form been displayed
            self.handleSearchFormZindex("show");

            self.containerSearchCriteria = self.currentSearchForm.container.find(".ui-bizagi-container-search-criteria");
        }).always(function () {
            bizagi.util.tablet.stopLoading();
        });
    },

    /**
     * Get the addform and show it
     * @param {} params 
     * @returns {} 
     */
    renderAddForm: function (params) {
        var self = this;
        params = params || {};
        var properties = self.properties;

        if (!self.addContainer) {
            self.addContainer = self.slideParams.navigation.createRenderContainer({ title: "" });
        } else {
            self.addContainer.element.empty();
        }

        var isRefresh = params.isRefresh || false;

        params = $.extend(params, {
            "allowFullSearch": properties.allowFullSearch,
            "maxRecords": properties.maxRecords,
            "requestedForm": "addForm",
            "xpathContext": properties.xpathContext,
            "contextType": "entity"
        });

        bizagi.util.tablet.startLoading();

        //Get the addform
        $.when(self.dataService.getFormData(params)).pipe(function(data){
            if (params.editable === false) {
                data.form.properties.editable = false;
            }

            if (typeof (data.form.properties) != "undefined"){
                data.form.properties.orientation = self.searchParams.orientation || "ltr";
            }

            data.form.contextType = "entity";

            var form = self.renderFactory.getContainer($.extend({}, self.addFormParams, {
                type: "form",
                data: data.form,
                focus: params.focus || false,
                selectedTabs: params.selectedTabs,
                isRefresh: isRefresh,
                requestedForm: params.requestedForm,
                navigation: self.slideParams.navigation
            }));


            form.buttons = [self.form.buttons[0] || { "caption": "Save", "actions": ["submitData", "refresh"], "submitData": true, "refresh": true, "ordinal": 0, "action": "save", "save": true, "style": "" }, self.form.buttons[1] || { "caption": "Save", "actions": ["submitData", "refresh"], "submitData": true, "refresh": true, "ordinal": 1, "action": "save", "save": true, "style": "" }];
            jQuery.extend(form, {
                processButtons: function() {
                    //not send information set in memory and save

                    $.each(form.buttons, function(index, element) {
                        switch (element["ordinal"]) {
                            case 1: //next button will behave as a cancel button
                                $(form.getButtons()[index]).click(function() {
                                    self.addContainer.destroy();
                                    delete self.addContainer;
                                });
                                form.getButtons()[index].innerHTML = bizagi.localization.getResource("render-form-dialog-box-close");
                                form.buttons[index].caption = bizagi.localization.getResource("render-form-dialog-box-close");
                                form.buttons[index].action = "back";
                                break;

                            default:
                                $(form.getButtons()[index]).click(function() {
                                    self.saveDataAddForm(form);
                                });
                                break;
                        }
                    });
                }
            });

            for (var indicator in form.children) {
                form.children[indicator].params = $.extend({}, form.children[indicator].params, self.addFormParams);
            }

            return $.when(form.render()).then(function (element) {
                // Set currents search form
                self.currentAddForm = form.firstChild();

                form.triggerHandler("ondomincluded");

                // if is any modal view displayed, hide it to allow this search form been displayed
                self.handleSearchFormZindex("show");

                self.addContainer.element.html(element);
                if (!isRefresh){
                    self.slideParams.navigation.navigate(self.addContainer.id);
                }

                form.bind("refresh", function (_, refreshParams) {
                    refreshParams.scrollTop = form.container.parent().scrollTop();
                    refreshParams.focus = focus || refreshParams.focus;
                    refreshParams.selectedTabs = form.getSelectedTabs() || refreshParams.selectedTabs;
                    refreshParams.isRefresh = true;
                    refreshParams.contextType = self.properties.contextType || refreshParams.contextType;
                    refreshParams.idPageCache = form.idPageCache;
                    refreshParams.navigation = self.slideParams.navigation;

                    //form.refresh(refreshParams);
                    return self.renderAddForm(refreshParams);
                });
            });
        }).fail(function(e){
            self.addContainer.destroy();
            delete self.addContainer;
            console.log("there are an error :(");
        }).always(function () {
            bizagi.util.tablet.stopLoading();
        });
    },

    /**
     * Save data to add form
     * @param {} form 
     * @returns {} 
     */
    saveDataAddForm: function (form) {
        var self = this;
        var properties = self.properties;
        if (form.validateForm()) {
            var data = {};
            $.forceCollectData = true;

            form.collectRenderValues(data);
            data.idPageCache = form.idPageCache;
            var defer = $.Deferred();

            var params = {
                action: "SAVE",
                data: data,
                idPageCache: data.idPageCache,
                guidEntity: form.properties.entity,
                contexttype: 'entity'
            };

            // Check if the add form has data
            var formData = {};

            form.collectRenderValuesForSubmit(formData);

            // Turn off flag
            $.forceCollectData = false;

            if (!bizagi.util.isMapEmpty(formData)) {

                bizagi.util.tablet.startLoading();

                $.when(self.dataService.submitData(params)).done(function (response) {
                    function dataHasXpath(xpath) {
                        var render = self.currentSearchForm.getRender(xpath);
                        if (typeof render == "object" && render != null) {
                            return { "found": true, "obj": render };
                        }
                        return { "found": false, "obj": {} };
                    }
                    for (var i in formData) {
                        var mapping = dataHasXpath(i);
                        if (mapping.found) {
                            mapping.obj.setValue(formData[i]);
                            self.setDisplayValueToControl(mapping.obj, form, i, formData);
                        }
                    }

                    self.currentSearchForm.performSearch({
                        allowFullSearch: properties.allowFullSearch,
                        maxRecords: properties.maxRecords
                    });

                    self.addContainer.destroy();
                    delete self.addContainer;
                }).fail(function (jqXHR, type, message) {
                    form.addValidationMessage(message.message);
                }).always(function () {
                    bizagi.util.tablet.stopLoading();
                });
            } else {
                // Form has not data
                bizagi.showMessageBox(bizagi.localization.getResource("render-search-advanced-no-filters"));
            }
        }
    },

    /***
     * Set display value by control type, when add new record
     * @param renderControlSearchForm
     * @param addForm
     * @param xpath
     * @param formData
     */
    setDisplayValueToControl: function (renderControlSearchForm, addForm, xpath, formData){
        if(renderControlSearchForm.properties.type === "searchSuggest"){
            renderControlSearchForm.setDisplayValue(addForm.getRender(xpath).getDisplayValue());
        }
        else{
            renderControlSearchForm.setDisplayValue(formData[xpath]);
        }
    },

    /**
     * Shows the dialog box in the browser
     * @returns {} Returns a promise that the dialog will be closed
     */
    processButtons: function () {
        var self = this;
        self.slideBoxDeferred = new $.Deferred();

        // Create buttons object
        var slideOptions = { buttons: [] };

        // Add search button by default
        slideOptions.buttons.push({
            text: bizagi.localization.getResource("render-form-dialog-box-search"),
            click: function () {
                self.currentSearchForm.performSearch(self.searchParams);
            }
        });

        if (self.slideParams.allowNew) {
            slideOptions.buttons.push({
                text: bizagi.localization.getResource("render-form-dialog-box-add"),
                click: function () {
                    var params = {
                        'idCase': self.slideParams.idCase,
                        "idRender": self.properties.idRender,
                        'displayName': self.properties.displayName,
                        'idPageCache': self.properties.idPageCache
                    };

                    self.renderAddForm(params);
                }
            });
        }

        slideOptions.buttons.push({
            text: bizagi.localization.getResource("render-form-dialog-box-cancel"),
            click: function () {
                // Close slide      
                self.goBack();
            }
        });

        // Apply slide plugin
        slideOptions = $.extend(slideOptions, self.slideParams);
        self._renderButtons(slideOptions);

        // Return promise
        return self.slideBoxDeferred.promise();
    },

    /**
     * Creates the search dialog sub-containers
     * @param {} params 
     * @returns {} 
     */
    getSearchContainerData: function (params) {
        var self = this;
        var deferred = new $.Deferred();
        var data = {
            form: { properties: {}, elements: [] }
        };

        var container = data.form;
        var searchFormToLoad = self.searchForms[0];

        // When there are more than one search form, render a tab container
        if (self.searchForms.length > 1) {

            var tabContainer = {};
            tabContainer.properties = { type: "tab" };
            tabContainer.elements = [];
            var otherElements = [];

            $.each(self.searchForms, function (i, searchForm) {
                var isDefault = searchForm["default"] || false;

                // Create tab item
                var tab = {};
                tab.properties = {
                    id: i,
                    type: "tabItem",
                    displayName: searchForm.caption
                };

                tab.elements = [];

                // Append children 
                if (isDefault) {

                    tabContainer.elements.push({ container: tab });

                    // Set properties to load default container
                    container = tab;
                    searchFormToLoad = self.searchForms[0];

                } else {
                    otherElements.push({ container: tab });
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

        bizagi.util.tablet.startLoading();

        // Loads default form
        $.when(self.getSearchFormData(params, searchFormToLoad))
            .done(function (searchFormData) {
                container.elements.push(searchFormData);

                // Resolve deferred
                deferred.resolve(data);
            }).always(function () {
                bizagi.util.tablet.stopLoading();
            });

        return deferred.promise();
    },

    /**
     * Loads a search form
     * @param {} params 
     * @param {} searchForm 
     * @returns {} 
     */
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

    /**
     * Go back and destroy
     * @returns {} 
     */
    goBack: function () {
        var self = this;

        self.handleSearchFormZindex("hide");
        self.container.destroy();
    },

    /**
     * Handlers kendo view
     * @returns {} 
     */
    configureViewHandlers: function () {
        var self = this;
    },

    /**
      * Process render buttons
      * @param {} options 
      * @returns {} 
      */
    _renderButtons: function (options) {
        var self = this;
        var content = $("<div class='bz-slide-button-container'></div>");

        $.each(options.buttons, function (ui, value) {
            var button = $("<div class='action-button'>" + value.text + "</div>").click(
                value.click
            ).appendTo(content);
        });

        self.buttonContainer = content;
    },

    handleSearchFormZindex: function (option) {
        var self = this;

        //if there is an open modal, change z-index to make searchForm visible
        var modalViewDisplayed = jQuery.grep($(".km-modalview-root"), function (n, i) {
            return ($(n).css("display") == "block");
        });

        if (modalViewDisplayed.length > 0) {
            if (option == "show") {
                $(modalViewDisplayed).css("z-index", 0);
            } else {
                $(modalViewDisplayed).css("z-index", 10001);
            }
        }
    }
});
