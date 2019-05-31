
/*
 *   Name: BizAgi Desktop Render Yes-No Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the Yes-No render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.searchList.extend("bizagi.rendering.searchList", {
    ADVANCED_SEARCH_ID: -1,
    ADVANCED_ADDITION_ID: -2,
    CLEAR_SEARCH_ID: -3,
    SEARCH_MIN_LENGTH: 2 },
{

    /*
     *   Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);

        // Fill default properties
        var properties = this.properties;
        properties.searchImage = properties.searchImage || this.dataService.getSearchDefaultImage();
    },

    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        
        // Call base 
        this._super();

        // Apply plugin
        self.searchInput = $("input", control);
        self.applyAutocompletePlugin();

    	// Bind remove action of each list item
        $('.biz-render-searchlist', control).delegate('.removeItem', 'click', function () {

        	var li = $(this).parent('li');

        	// Remove from main memory and set the new value
        	self.removeElement({ id: li.data('id') });

        	// Remove list element
        	li.remove();

        	// Set focus on input element
        	$('.biz-render-input-search', control).focus();
		});

    	// Display associated form
        $('.biz-render-searchlist', control).delegate('.button-search', 'click', function () {
        	self.showSlideSearch();
        });
    },

    /* Apply autocomplete capabilities to a single input*/
    applyAutocompletePlugin: function () {

    	var self = this;
    	var control = self.getControl();
        var searchInput = self.searchInput;

        searchInput.autocomplete({
            messages: {
                noResults: null, //"No search results.",
                results: function () { }
            },
        	source: function (req, add) {
        		self.processRequest(req, add);
        	},
            select: function (event, ui) {
            	self.appendFoundItem(event, ui);
            },
            close: function (event, ui) {
				// Clear text on search input
            	$(event.target).val('');
            }
		});
    },
    
    
    /* APPEND FOUND ITEM TO LIST
	=====================================================*/
    appendFoundItem: function (event, ui) {

		// The context list
    	var $ul = $('.biz-render-input-search').parents('ul');

    	// Map the ids of the elements to an array
    	var uniqueIds = $.map($('li:not(:last)', $ul), function (val, i) {
    		return $(val).data('id');
		});

    	// Avoid appending duplicated items
    	if (uniqueIds.indexOf(ui.item.id) == -1) {

    		// Found item text must be within a label for consistency
    		var $newElementLabel = $('<label></label>').text(ui.item.value);

    		// Each element must have its removal button
    		var $newElementRemoveBtn = $('<a></a>').addClass('removeItem');

    		// Wrap label and btn on a <li>
    		var $newElement = $('<li></li>')
			.append($newElementLabel)
			.append($newElementRemoveBtn)
			.data('id', ui.item.id);

    		// Get the latest item on list to append new li with match word
    		$('li:last', $ul).before($newElement);

    		// Set value
    		this.addElement({
    			id: ui.item.id,
    			value: ui.item.value
			});
    	}
    },

    /* 
     *   Renders a search item
     */
    renderSearchItem: function (item) {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("searchItem");

        var searchItem = $.tmpl(template, {
            image: properties.searchImage,
            label: item.label
        });

        searchItem.data("ui-autocomplete-item", item);

        return searchItem;
    },

    

    /* Renders the advanced item */
    renderClearItem: function () {
        var self = this;
        var searchItem = self.renderSearchItem({
            id: self.Class.CLEAR_SEARCH_ID, 
            label: this.getResource("render-search-clear-label")
        });

        // Bind click event
        searchItem.click(function () {
            self.setValue(null);

            // Submit info to server
            self.submitData();
        //            return false;
        //            self.showSearchDialog();
        });

        return searchItem;
    },

    /* Renders the add item*/
    renderAddItem: function () {
        var self = this;
        var searchItem = self.renderSearchItem({
            id: self.Class.ADVANCED_ADDITION_ID, 
            label: this.getResource("render-search-add-label")
        });

        // Bind click event
        searchItem.click(function () {
            // TODO: Implement this
            });

        return searchItem;
    },


    /* 
     *   Process the request data for the autocomplete control
     */
    processRequest: function (req, add) {
        var self = this,
        properties = self.properties;

        // Create array for response objects   
        var suggestions = [];

        if ((req.term.length >= this.Class.SEARCH_MIN_LENGTH)) {
            
            // Update term property to reflect the search
            properties.term = req.term;
            this.getData()
            .done(function (data) {

                // Process response to highlight matches
                $.each(data, function (i, val) {
                    suggestions.push({
                        id: val.id,
                        //label: val.value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                        label: val.value,
                        value: val.value
                    });
                });

                addToSuggestions(suggestions);
            });

        } else {
            addToSuggestions(suggestions);
        }

        /* 
         *   Method to add the special items to the suggestions 
         */
        function addToSuggestions(alSuggestions) {
            // Add the clear option
            if (properties.allowClear && (self.value !== undefined)) {
                alSuggestions.push({
                    id: self.Class.CLEAR_SEARCH_ID, 
                    label: '', 
                    value: ''
                });
            }
            // Add additional option if advanced search is on
            if (properties.advancedSearch) {
                alSuggestions.push({
                    id: self.Class.ADVANCED_SEARCH_ID, 
                    label: '', 
                    value: ''
                });
            }

            // Add additional option if allow addition is on
            if (properties.allowAdd) {
                alSuggestions.push({
                    id: self.Class.ADVANCED_ADDITION_ID, 
                    label: '', 
                    value: ''
                });
            }

            // Pass array to callback   
            add(alSuggestions);
        }
    },

    /* 
     *   Returns the desired width for the suggestion menu
     */
    calculateSuggestionWidth: function () {
        var self = this;
        var suggestMenu = self.searchInput.data("ui-autocomplete").menu.element;

        return suggestMenu.width();
    },

    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (value !== undefined) {
            if (properties.editable) {
                self.searchInput.val(value.label);
            }
        }

        // Call base
        this._super(value);
    },

    /*
     *   Returns the value to display, ex. non-editable renders
     */
    getDisplayValue: function () {
        return this.selectedValue;
    },

    /* 
     *   Opens the search dialog
     */
    showSearchDialog: function () {
        var self = this,
        properties = self.properties;

        // Show search dialog
        var dialog = new bizagi.rendering.dialog.search(self.dataService, self.renderFactory, properties.searchForms, {
            allowFullSearch: properties.allowFullSearch	,
            maxRecords: properties.maxRecords	
        });

        dialog.render({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        })
        .done(function (item) {
            // Set data                 
            self.setValue(item);

            // Submit info to server
            self.submitData();
        });
    },

	/*
     *   Opens the search slide
     */
    showSlideSearch: function () {

    	var self = this;
    	var control = self.getControl();
    	var properties = self.properties;
    	li = $('li:[data-id]', control);
        var canBeAdd = true;

        var slideParams = { container: self.getFormContainer().container };

    	// Show search dialog, Create slide search object
        var slideForm = new bizagi.rendering.slide.search(
			self.dataService, self.renderFactory, properties.searchForms,
			{
				allowFullSearch: properties.allowFullSearch,
				maxRecords: properties.maxRecords
			},
			slideParams
        );

    	// Render the search form
    	slideForm.render({
    		idRender: properties.id,
    		xpath: properties.xpath,
    		xpathContext: properties.xpathContext,
    		idPageCache: properties.idPageCache
		}).done(function (item) {

			var label = [];

			// Parse label
			$.each(item.label, function (key, value) {
				if (key != 'id') {
					label.push($(value).text());
				}
			});

			// check if element is already appended in the list
			$.each(li, function (key, value) {
				if ($(value).data('id') == item.id) {
					canBeAdd = false;
				}
			});

			if (canBeAdd) {
				self.appendFoundItem('', {
					item: {
						id: item.id,
						value: label.join(',')
					}
				});
			}

    		// Set data
    		//self.setValue(item);

    		// Submit info to server
    		self.submitData();
    	});
    },

	/* RENDER READ ONLY
	=====================================================*/
    renderReadOnly: function () {

    	var self = this;
    	var control = self.getControl();

    	// Render as usual
    	self.postRender();

    	// Undelegate events
    	$('.biz-render-searchlist', control).undelegate('.removeItem');

    	// Display associated form
    	$('.biz-render-searchlist', control).undelegate('.button-search');

    	// Remove "advanced search" icon
    	$('.button-search', control).remove();

    	// Remove the last "li" from the list so user cannot enter any key.
    	$('.biz-render-input-search li:last', control).remove();

    	// Remove "x" icon from each element on the list
    	$('.biz-render-input-search li .removeItem', control).remove();
    }
});
