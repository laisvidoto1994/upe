/**
 *   Name: BizAgi Desktop Render Yes-No Extension
 *   Author: Cristian Olaya
 *   Date: 30/11/2015
 *   Comments:
 *   -   This script will redefine the Yes-No render class to adjust to desktop devices
 */

bizagi.rendering.searchList.extend("bizagi.rendering.searchList", {
    SEARCH_MIN_LENGTH: 2,
    temporalElements: {}
}, {
    /**
     * RenderSingle Method
     * */
    initializeList: function () {
        var self = this;
        self._super();
        var properties = self.properties;
        var control = self.getControl();

        //Getting all aux templates
        self.modalViewTemplates = kendo.template(self.renderFactory.getTemplate('searchListModalViewAuxTemplates'), { useWithBlock: false });
        self.inputTemplates = kendo.template(self.renderFactory.getTemplate('searchListInputAuxTemplates'), { useWithBlock: false });

        //Getting the input
        self.input = $(".bz-rn-container-searchlist", control);

        self.configureListHandlers();
    },

    /**
     * Postrender Method
     * */
    postRender: function () {
        var self = this;

        //Initialicing the list
        self.initializeList();

        // Call base
        this._super();

        //trigger click event on remove tag
        self.input.on("click", '.bz-rn-remove-tag-on-search-list', function () {
            self.removeItem($(this));
        });
    },

    postRenderReadOnly: function(){
        var self = this;

        //Initialicing the list
        self.initializeList();

        // Call base
        this._super();

        if (!self.properties.editable) {
            //Add styles class
            self.configureReadOnly();
        }
    },

    /**
     * Setting the control events
     * */
    configureListHandlers: function () {
        var self = this;

        if (self.properties.editable) {
            if (self.properties.value.length > 0) {
                self.configureModalView(".bz-rn-last-child");
            } else {
                self.configureModalView("ul");
                self.configureModalView(".bz-rn-last-child");
            }
        }
    },

    /**
     * Configure the modal view to select values
     * */
    configureModalView: function (selector) {
        var self = this;
        var inputContainer = (selector === "") ? self.input : $(selector, self.input);

        inputContainer.unbind().bind("click", function () {
            //Getting the values to show
            var elements = $("ul li.bz-rn-regular-element", self.input);
            var values = [];

            //Reset the temporal array
            self.Class.temporalElements = {};

            for (var i = 0, length = elements.length; i < length; i++) {
                var id = $(elements[i]).data("id");
                var value = $("label", $(elements[i])).text();
                var newElement = { 'id': id, 'value': value };

                values.push(newElement);

                //Add element to temporal context array
                self.addTemporalElement(id, value, false);
            }

            //Creating modal view
            var modalViewTemplate = kendo.template(self.renderFactory.getTemplate('searchListModalView'), { useWithBlock: false });
            var modalView = $(bizagi.util.trim(modalViewTemplate({ 'items': values, 'displayName': self.properties.displayName || "", "orientation": self.properties.orientation }))).clone();

            modalView.kendoMobileModalView({
                close: function () {
                    this.destroy();
                    this.element.remove();
                },
                useNativeScrolling: true,
                modal: false
            });

            self.configureModalViewHandlers(modalView);
            modalView.kendoMobileModalView('open');
            modalView.closest(".k-animation-container").addClass("bz-rn-new-modalview-position");
        });
    },

    /**
     * Configure the modalView Handlers for the new combo control.
     * */
    configureModalViewHandlers: function (inputContainer) {
        var self = this;

        var closeModalViewPromise = new $.Deferred();

        //Hide the clear text icon
        inputContainer.find(".bz-wp-modalview-header-cancel-search").hide(500);

        //Showing found results
        inputContainer.find(".bz-wp-modalview-header-input-search").on('keypress keyup', function () {
            if (this.value !== "") {
                inputContainer.find(".bz-wp-modalview-header-cancel-search").show(500);
            } else {
                inputContainer.find(".bz-wp-modalview-header-cancel-search").hide(500);
            }

            //Show splash loader
            bizagiLoader({ 'selector': ".bz-rn-new-modalview-content-styles" }).start();

            //Getting and showing the data
            $.when(self.showResults(this.value, inputContainer)).always(function () {
                bizagiLoader({ 'selector': ".bz-rn-new-modalview-content-styles" }).stop();
            });
        });

        //Cleaning search
        inputContainer.find(".bz-wp-modalview-header-cancel-search").bind('click', function () {
            self.showNoResultsMessage(self.getResource("workportal-widget-inboxcommon-no-results-found"), inputContainer);
            inputContainer.find(".bz-wp-modalview-header-input-search").val("");
            $(this).hide(500);
        });

        //when click on apply button
        inputContainer.delegate(".ui-bizagi-apply-button-searchlist", "click", function () {
            closeModalViewPromise.resolve();
            inputContainer.data("kendoMobileModalView").close();
        });

        inputContainer.find(".bz-wp-modalview-close").bind("click", function () {
            closeModalViewPromise.reject();
            inputContainer.data("kendoMobileModalView").close();
        });

        //Trigger delete event for tags
        inputContainer.find(".filter-searchlist-modal-view-tags").on("click", '.bz-rn-remove-tag-on-search-list', function () {
            self.removeItem($(this), true);

            var term = inputContainer.find(".bz-wp-modalview-header-input-search").val();

            //Show splash loader
            bizagiLoader({ 'selector': ".bz-rn-new-modalview-content-styles" }).start();

            //Getting and showing the data
            $.when(self.showResults(term, inputContainer)).always(function () {
                bizagiLoader({ 'selector': ".bz-rn-new-modalview-content-styles" }).stop();
            });
        });

        $.when(closeModalViewPromise).done(function () {
            self.addNewValuesToInput();
            self.Class.temporalElements = {};
        }).fail(function () {
            self.Class.temporalElements = {};
        });
    },

    /**
     * Show finded results
     * */
    showResults: function (value, inputContainer) {
        var self = this;

        return $.when(self.processRequest({ 'term': value })).done(function (suggestions) {
            if (suggestions.length === 0) {
                self.showNoResultsMessage(self.getResource("workportal-widget-inboxcommon-no-results-found"), inputContainer);
            } else {
                //Hide current results
                $("#ui-bizagi-wp-filter-results-searchlist-wrapper ul li", inputContainer).remove();

                //Add new results to list
                var newElement = $("li", $(bizagi.util.trim(self.modalViewTemplates({ 'template': "sugestions", 'items': suggestions }))));
                newElement.appendTo($("#ui-bizagi-wp-filter-results-searchlist-wrapper ul", inputContainer));

                //Get list of elements
                self.modalViewList = $(".ui-bizagi-render-list-elements", inputContainer);

                //Setting the initial selected display value
                self.modalViewList.find("li").unbind().bind("click", function () {
                    //add new element to data control
                    self.appendFoundItem(this, $(".filter-searchlist-modal-view-tags", inputContainer));

                    if ($(this).siblings().length === 0) {
                        self.showNoResultsMessage(self.getResource("workportal-widget-inboxcommon-no-results-found"), inputContainer);
                    }

                    $(this).remove();
                });
            }
        }).fail(function (response) {
            self.showNoResultsMessage(response, inputContainer);
        });
    },

    /**
     * Adding new values to input
     * */
    addNewValuesToInput: function () {
        var self = this;

        //Create a temporal array
        var tempArray = [];

        $.each(self.Class.temporalElements, function (i, ele) {
            tempArray.push(ele.obj);
        });

        self.setValue(tempArray);

        //Clear the input
        $("ul li", self.input).remove();

        //Get the input content
        var inputContainer = $("li", $(bizagi.util.trim(self.inputTemplates({ 'template': "inputContainer", 'value': tempArray }))));

        //Add the input container
        inputContainer.appendTo($("ul", self.input));

        //unbind current events
        $("ul", self.input).unbind();
        $(".bz-rn-last-child", self.input).unbind();

        //Trigger click event
        if (tempArray.length > 0) {
            self.configureModalView(".bz-rn-last-child");
        } else {
            self.configureModalView("ul");
            self.configureModalView(".bz-rn-last-child");
        }
    },

    /*
     *   check if the control has value
     */
    hasValue: function () {
        var self = this;
        return JSON.parse(self.getValue()).value.length > 0;
    },

    /*
     *   Sets the internal value
     */
    setValue: function (value, triggerEvents) {
        var self = this;
        triggerEvents = triggerEvents !== undefined ? triggerEvents : true;

        // Change internal value
        self.value = JSON.encode({
            "value": value
        });

        self.changeRequiredLabel(!self.hasValue());

        // Trigger events
        if (triggerEvents && !self.internalSetInitialValueFlag) {
            self.triggerRenderChange();
        }
    },

    /**
     * Show the correct message if there are elements to show
     * */
    showNoResultsMessage: function (message, inputContainer) {
        var self = this;
        $("#ui-bizagi-wp-filter-results-searchlist-wrapper ul li", inputContainer).remove();
        var newElement = $("li", $(bizagi.util.trim(self.modalViewTemplates({ 'template': "modalViewDefaultMessage", 'message': message }))));
        newElement.appendTo($("#ui-bizagi-wp-filter-results-searchlist-wrapper ul", inputContainer));
    },

    /**
     * Append founded item
     * */
    appendFoundItem: function (item, container) {
        var self = this;

        // Map the ids of the elements to an array
        var uniqueIds = $.map($('li', container), function (val) {
            return $(val).data('id');
        });

        // Avoid appending duplicated items
        if (uniqueIds.indexOf($(item).data("id")) == -1) {
            var id = $(item).data("id");
            var value = $("label", item).text();
            var $newElement = $("li", $(bizagi.util.trim(self.modalViewTemplates({ 'template': "fullElement", 'id': id, 'value': value }))));

            // Get the latest item on list to append new li with match word
            var lastElement = $('li:last', container);
            if (lastElement.hasClass("bz-rn-any-element")) {
                lastElement.remove();
                //$newElement.appendTo($('ul', container));
                $('ul', container).prepend($newElement);
            } else {
                //$newElement.appendTo($('ul', container));
                $('ul', container).prepend($newElement);
            }

            self.addTemporalElement($(item).data("id"), $("label", item).text(), false);
        }
    },

    /**
     * Removen a item from the list
     * */
    removeItem: function (element, isModalViewContainer) {
        var self = this;
        var li = element.parent();
        var container = element.closest(".bz-rn-container-searchlist");

        if (container.length === 0) {
            container = element.closest(".filter-searchlist-modal-view-tags");
        }

        if (!isModalViewContainer) {
            // Remove from main memory and set the new value
            self.removeElement({ id: li.data('id') });
        } else {
            delete self.Class.temporalElements[li.data('id')];
        }

        // Remove list element
        li.remove();

        if (container.find("li").length <= 1 && !isModalViewContainer) {
            $('.bz-rn-click-to-add-span', container).removeClass("hidden");
            self.configureModalView("ul");
            self.configureModalView(".bz-rn-last-child");
        } else if (container.find("li").length === 0 && isModalViewContainer) {
            var defaultElement = $(bizagi.util.trim(self.modalViewTemplates({ 'template': "modalViewDefaultValue" })));
            $("li", defaultElement).appendTo($("ul", container));
        }
    },

    /**
     *   Process the request data for the autocomplete control
     */
    processRequest: function (req) {
        var self = this;
        var properties = self.properties;

        // Create array for response objects
        var suggestions = [];
        var defer = new $.Deferred();

        /**
  *   Method to add the special items to the suggestions
  */
        function addToSuggestions(suggestions) {
            // Add the clear option

            /* 
            // TODO: To implement allowClear
        if (properties.allowClear && (self.value !== undefined)) { 
                suggestions.push({
                    id: self.Class.CLEAR_SEARCH_ID,
                    label: '',
                    value: ''
                });
            }*/
            // Add additional option if advanced search is on
            if (properties.advancedSearch) {
                suggestions.push({
                    id: self.Class.ADVANCED_SEARCH_ID,
                    label: "",
                    value: ""
                });
            }

            // Add additional option if allow addition is on
            if (properties.allowAdd) {
                suggestions.push({
                    id: self.Class.ADVANCED_ADDITION_ID,
                    label: "",
                    value: ""
                });
            }
        }

        if ((req.term.length >= this.Class.SEARCH_MIN_LENGTH)) {

            // Update term property to reflect the search
            properties.term = req.term;
            this.getData()
                    .done(function (data) {

                        // Process response to highlight matches
                        $.each(data, function (i, val) {
                            var parseValue;
                            switch (typeof val.value) {
                                case "number":
                                    parseValue = val.value;
                                    break;
                                case "object":
                                    parseValue = val.value.toString();
                                    break;
                                case "string":
                                    parseValue = val.value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + req.term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                                    break;
                                default:
                                    parseValue = val.value;
                                    break;
                            }

                            if (typeof self.Class.temporalElements[val.id] === 'undefined') {
                                suggestions.push({
                                    id: val.id,
                                    label: parseValue,
                                    value: val.value
                                });
                            }
                        });

                        addToSuggestions(suggestions);
                        defer.resolve(suggestions);
                    });
        } else {
            addToSuggestions(suggestions);
            defer.reject(self.getResource("workportal-widget-inboxcommon-no-results-found"));
        }

        return defer;
    },

    /**
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        var finalValue = typeof value === "string" ? JSON.parse(value).value : value.value;

        // Set internal value
        self.setValue(finalValue);

        if (value !== undefined) {
            if (properties.editable) {
                self.input.val(value.label);
            }
        }
    },

    /**
     *   Returns the value to display, ex. non-editable renders
     */
    getDisplayValue: function () {
        return this.selectedValue;
    },

    /**
     * When the render isn't editable
     */
    renderReadOnly: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("searchList");

        return $.fasttmpl(template, {
            id: properties.id,
            xpath: properties.xpath,
            allowTyping: properties.allowTyping,
            value: properties.value,
            hasSearchForm: (properties.searchForms) ? true : false,
            editable: false
        });
    },

    configureReadOnly: function(){
        var self = this;
        var control = self.getControl();

        // Remove click event
        $('.bz-rn-last-child', control).unbind("click");
        $('.bz-rn-searchlist-search-icon', control).unbind("click");

        //hide all elements
        $('.bz-rn-click-to-add-span', control).remove();

        // Remove "x" icon from each element on the list
        $('.bz-rn-remove-tag-on-search-list', control).remove();

        self.input.addClass("searchListNonEditable");
    },

    /**
     * Add new element to the temporal array
     * */
    addTemporalElement: function (id, value, elementToRemove) {
        var self = this;

        if (self.Class.temporalElements[id]) {
            delete self.Class.temporalElements[id];
        }

        self.Class.temporalElements[id] = { 'obj': { 'id': id, 'value': value }, 'remove': elementToRemove };
    }
});