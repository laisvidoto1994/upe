/*
*   Name: BizAgi Tablet Search Slide Implementation
*   Author: Edward Morales
*   Comments:
*   -   This script will shows a sliding search form  order to edit
*/

// Extends itself
$.Class.extend("bizagi.rendering.slide.search", {}, {

    /* 
    *   Constructor
    */
    init: function (dataService, renderFactory, searchForms, searchParams, slideParams) {
        var self = this;
    	
        this.dataService = dataService;
        this.renderFactory = renderFactory;
        this.searchForms = searchForms;
        this.searchParams = searchParams;
        this.slideParams = slideParams;
        this.slideDeferred = new $.Deferred();
        this.extraButtons = (slideParams.hasOwnProperty("buttons")) ? slideParams.buttons : false;
        // Draw slide content
        // TODO: Check that waiting feature is working
        self.slideBox = $("<div/>");
        self.slideBox.empty();
        
        // Apply slide plugin
        self.applySlidePlugin(self.slideBox)
        .done(function(data) {
            self.slideDeferred.resolve(data);
        })
        .fail(function() {
            self.slideDeferred.reject();
        });
        // Moves scroll to the Top
        if (this.slideBox.parent().parent())  this.slideBox.parent().parent().scrollTop("0");
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
        return self.slideDeferred.promise();
    },
	
    /*
    * Render the search form
    */
    renderSearchDialog: function(params){
        var self = this;
		
        // Creates a dialog
        $.when(self.getSearchContainerData(params))
        .pipe(function(data) {

            // Render dialog form
            form = self.renderFactory.getContainer({
                type: "form",
                data: data.form
            });

            // Save form reference
            self.form = form;

            // Return rendering promise
            return form.render();
        })
        .done(function(element) {
            // Hide title of html content
            var searchResultContainer = $(".ui-bizagi-container-search-results",element);
            searchResultContainer.hide();
            
            // Append form html in the slide content box
            element.appendTo(self.slideBox);

            // Publish an event to check if the form has been set in the DOM
            form.triggerHandler("ondomincluded");



            // Set currents search form
            self.currentSearchForm = self.form.firstChild();
            self.currentSearchForm.triggerHandler("ondomincluded");
            
            self.currentSearchForm.bind("instancerefresh", function () {
                // Show search results container
                searchResultContainer.show(); 
            });
    		
            // Add row selected handlers to resolve the deferred
            self.currentSearchForm.bind("instanceSelected", function (ev, ui) {
               
                
                // TODO: Destroy plugin
            	self.slideBox.slideContent("close");
                self.slideBox.detach();
                self.slideBoxDeferred.resolve({
                    id: ui.id, 
                    label: ''
                });
            });
        });
    },

    /*
    *   Shows the dialog box in the browser
    *   Returns a promise that the dialog will be closed
    */
    applySlidePlugin: function (slideBox) {
        var self = this;
        
        // Define options to slide widget
        var slideOptions = $.extend({
            buttons:[
            {
                text: bizagi.localization.getResource("render-form-dialog-box-search"),
                click:function(){
                    self.currentSearchForm.performSearch(self.searchParams);
                }
            },
            {
                text: bizagi.localization.getResource("render-form-dialog-box-cancel"),
                click:function(){
                    slideBox.slideContent("close");
                }
            }
            ]
            
        }, this.slideParams);
        
        // Create deferred
        self.slideBoxDeferred = new $.Deferred();

        // Apply slide plugin
        slideBox.slideContent(slideOptions);

        // Return promise
        return self.slideBoxDeferred.promise();
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
        $.when(self.getSearchFormData(params, searchFormToLoad))
        .done(function (searchFormData) {
            container.elements.push(searchFormData);

            // Resolve deferred
            deferred.resolve(data);
        });

        return deferred.promise();
    },
    
    /*
    *   Loads a search form
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
    }
});
