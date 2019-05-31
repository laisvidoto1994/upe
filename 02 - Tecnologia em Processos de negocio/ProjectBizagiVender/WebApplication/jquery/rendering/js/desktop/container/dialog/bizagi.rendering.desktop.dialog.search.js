/*
 *   Name: BizAgi Desktop Search Dialog Implementation
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will shows a search form inside a popup dialog in order to edit
 */

// Extends itself
$.Class.extend("bizagi.rendering.dialog.search", {
    POPUP_WIDTH: 800,
    POPUP_HEIGHT: 600

}, {
    /* 
    *   Constructor
    */
    init: function (dataService, renderFactory, searchForms, searchParams, otherOptions) {
        var self = this;
        var doc = window.document;
        otherOptions = otherOptions || {};

        this.dataService = dataService;
        this.renderFactory = renderFactory;
        this.searchForms = searchForms;
        this.searchParams = searchParams;
        this.dialogDeferred = new $.Deferred();
        this.extraButtons = (otherOptions.hasOwnProperty("buttons")) ? otherOptions.buttons : false;

        // Draw dialog box
        self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");
        self.dialogBox.empty();
        self.dialogBox.appendTo("body", doc);

        // Create dialog box
        self.showDialogBox(self.dialogBox)
				.done(function (data) {
				    self.dialogDeferred.resolve(data);
                    self.form.unbindAutoSaveForm();
				})
				.fail(function () {
				    self.dialogDeferred.reject();
                    self.form.unbindAutoSaveForm();
				});
    },
    /*
    *   Render the form
    *   The params are the same that will be send to the ajax service
    *   Returns a deferred
    */
    render: function (params) {
        var self = this;

        // Render search dialog
        self.renderSearchDialog(params);

        // Return promise
        return self.dialogDeferred.promise();
    },
    renderSearchDialog: function (params) {
        var self = this;
        self.form = null;
        // Creates a dialog
        $.when(self.getSearchContainerData(params))
				.pipe(function (data) {

				    // Render dialog form
				    if (typeof (data.form.properties) != "undefined")
				        data.form.properties.orientation = params.orientation || "ltr";

				    var _form = self.renderFactory.getContainer({
				        type: "form",
				        data: data.form
				    });

				    if (params.contexttype) {
				        _form.properties.contexttype = params.contexttype;
				    }

				    // Save form reference
				    self.form = _form;

				    // Return rendering promise
				    return self.form.render();
				})
				.done(function (element) {
				    // Remove button container
				    $(".ui-bizagi-button-container", element).remove();

				    // Append form  in the dialog
				    $('.ui-bizagi-loading-message', self.dialogBox).remove();
				    element.appendTo(self.dialogBox);

				    // Publish an event to check if the form has been set in the DOM
				    self.form.triggerHandler("ondomincluded");

				    // Check if there is a tab container (when there are more than one search form)
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

				        // Select first tab
				        tabContainer.container.tabs("option", "active", 0);
				        self.currentSearchForm = tabContainer.firstChild().firstChild();
				        self.currentSearchForm.triggerHandler("ondomincluded");

				    } else {

				        // Set currents search form
				        self.currentSearchForm = self.form.firstChild();
				        self.currentSearchForm.triggerHandler("ondomincluded");
				    }

				    // Focus into first control
				    self.focusFirstControl(self.currentSearchForm, 100);

				    // Add row selected handlers to resolve the deferred
				    self.currentSearchForm.bind("instanceSelected", function (ev, ui) {
				        self.closeDialogBox();
				        self.dialogBoxDeferred.resolve({
				            id: ui.id,
				            label: ''
				        });
				    });

				    // Event handler to searchList control
				    self.currentSearchForm.bind("multiSelect", function (ev, ui) {
				        self.closeDialogBox();
				        self.dialogBoxDeferred.resolve({
				            id: ui.id,
				            label: ui.data
				        });
				    });
				});
    },
    /**
    * Sets the focus to the first control
    */
    focusFirstControl: function (form, time) {
        // Configures effect
        var effect = function () {
            var defaultControl = $("input:visible, select:visible, option:visible, textarea:visible", form.container);
            if (defaultControl.length > 0) {
                // Focus control
                var innerControl = defaultControl[0];
                try {
                    innerControl.focus();
                } catch (e) { };
            }
        };

        // Run effect
        if (time > 0) {
            setTimeout(effect, time);

        } else {
            effect();
        }
    },
    /*
    *   Loads a search tab on demand inside an already rendered dialog
    */
    loadSearchTab: function (params, tab, searchForm) {
        var self = this;
        var defer = new $.Deferred();

        // If the tab has children it is loaded already
        if (tab.children.length > 0)
            return null;

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
				    $(".ui-bizagi-button-container", element).remove();

				    tab.container.append(element);
				    defer.resolve();
				});

        return defer.promise();
    },
    /*
    *   Shows the dialog box in the browser
    *   Returns a promise that the dialog will be closed
    */
    showDialogBox: function (dialogBox, reverseButtons) {
        var self = this;
        var reverseButtons = self.searchParams.orientation == "rtl" ? true : false;
        // Define buttons
        var buttons = [];
        self.dialogBoxDeferred = new $.Deferred();

        var defaultButtons = [
            {
                text: bizagi.localization.getResource("render-form-dialog-box-search"),
                click: function () {
                    if (self.searchParams) {
                        self.searchParams.searchTriggeredBy = "button";
                    }
                    // Perform search
                    self.currentSearchForm.performSearch(self.searchParams);
                }
            },
            {
                text: bizagi.localization.getResource("render-form-dialog-box-cancel"),
                click: function () {
                    self.dialogBoxDeferred.reject();
                    self.closeDialogBox();
                }
            }
        ]
        if (this.extraButtons) {
            buttons.push(this.extraButtons);
        }
        buttons = buttons.concat(defaultButtons);

        if (reverseButtons)
            buttons.reverse();

        var popupWidth = this.Class.POPUP_WIDTH;
        var popupHeight = this.Class.POPUP_HEIGHT;

        if (popupWidth > $(window).width())
            popupWidth = $(window).width() * 0.9;

        // Creates a dialog
        dialogBox
				.addClass("ui-bizagi-dialog-search")
				.dialog({
				    title: bizagi.localization.getResource("render-search-dialog-title"),
				    width: popupWidth,
				    height: popupHeight,
				    resizable: false,  // This one is to avoid a memory leak, DO NOT CHANGE PLEASE
				    modal: true,
				    buttons: buttons,
				    close: function () {
				        self.dialogBoxDeferred.reject();
				        self.closeDialogBox();
				    },
				    resizeStop: function (event, ui) {
				        self.form.resize(ui.size);
				    }

				});

        // Return promise
        return self.dialogBoxDeferred.promise();
    },

    /*
    *   Closes the dialog box
    */
    closeDialogBox: function () {
        var self = this;
        var dialogBox = self.dialogBox;
        dialogBox.dialog('destroy');
        dialogBox.detach();
    },

    /**
    * Add buttons to dialog box
    */

    addButtons: function (params) {


    },
    /*     
    *   Creates the search dialog sub-containers
    */
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
        $.when(self.getSearchFormData(params, searchFormToLoad)).done(function (searchFormData) {
            if (searchFormData) {
                container.elements.push(searchFormData);

                // Resolve deferred
                deferred.resolve(data);
            }
        }).fail(function(){
            console.log("Error");
        });

        return deferred.promise();
    },
    /*
    *   Loads a search form
    */
    getSearchFormData: function (params, searchForm) {
        var self = this;
        //Check if exist form
        if (searchForm == undefined || searchForm.id == undefined) {
            var strMessage = bizagi.localization.getResource("render-search-without-form");
            var divMessage = $("<div>").append(strMessage);
            self.dialogBox.dialog("close");

            $(divMessage).dialog({
                modal: true,
                buttons: [{
                    text: bizagi.localization.getResource("render-form-dialog-box-close"),
                    click: function () {
                        $(this).dialog("close");
                    }
                }]
            });

            return false;
        }

        return self.dataService.getSearchFormData($.extend(params, {
            idSearchForm: searchForm.id,
            url: searchForm.url

        })).pipe(function (data) {
            // Append search render properties
            data.form.properties.idRender = params.idRender;

            return data;
        });
    },

    dispose: function () {
        var self = this;
        self.form.dispose();
        bizagi.util.dispose(self.buttons);
        bizagi.util.dispose(self);
    }
});
