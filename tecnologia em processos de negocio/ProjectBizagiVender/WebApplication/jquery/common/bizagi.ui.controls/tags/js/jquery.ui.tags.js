(function ( $ ) {
    $.fn.uitags = function(facade, options) {
        var self = this;
        options = options || {};

        //creating a temporal array to admin the tags
        self.temporalElements = {};

        //set the plugin templates and styles files
        self.config = {
            nameTemplate: "bizagi.ui.controls.tags.template",
            cssComponent: "bizagi.ui.controls.tags"
        };

        /**
        * Load and return the template
        **/
        function getTemplateElement(destination, element){
            var defer = new $.Deferred();

            $.when(facade.loadTemplate(destination, bizagi.getTemplate(self.config.nameTemplate).concat(element))).done(function(){
                defer.resolve(facade.getTemplate(destination));
            });

            return defer.promise();
        }

        var methods = {
            /**
            * init the plugin
            */
            init: function(element, options){
                var self = this;

                //setting the input to apply the plugin
                self.input = element;

                //setting the tags array
                self.tags = options.dataSource || [];

                //Load and set the templates
                $.when(getTemplateElement("bizagi.inputTags.container", "#ui-bz-mobile-uitags-control"),
                        getTemplateElement("bizagi.inputTags.modalView", "#ui-bz-wp-popup-uitags-control"),
                            getTemplateElement("bizagi.inputTags.modalView.default", "#ui-bz-wp-uitags-control-modalview-auxiliary-templates"),
                                getTemplateElement("bizagi.imputTags.container.default", "#ui-bz-wp-uitags-control-input-auxiliary-templates"))

                .then(function(inputTags, modalViewTags, defaultModalViewTags, defaultInputTags){
                    self.inputTags = inputTags;
                    self.modalViewTags = modalViewTags;
                    self.defaultModalViewTags = defaultModalViewTags;
                    self.defaultInputTags = defaultInputTags;

                    //self.input.replaceWith($.tmpl(self.inputTags, {"value": {}}));
                    self.input.html($.tmpl(self.inputTags, {"value": options.value || []}));

                    self.configureInputHandlers();
                    //trigger click events
                    self.configureModalView(".bz-rn-last-child");
                });
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
                    self.temporalElements = {};

                    for (var i = 0; i < elements.length; i++) {
                        var id = $(elements[i]).data("guid");
                        var value = $("label", $(elements[i])).text();
                        var newElement = { "guid": id, "tag": value };

                        values.push(newElement);

                        //Add element to temporal context array
                        self.addTemporalElement(id, value, false);
                    }

                    //Creating modal view
                    var modalViewTemplate = self.modalViewTags;
                    var modalView = $.tmpl(modalViewTemplate, { 'items': values, "orientation": ""}).clone();

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
                });
            },

            /**
             * Configure the modalView Handlers for the new combo control.
             * */
            configureModalViewHandlers: function (inputContainer) {
                var self = this;
                var closeModalViewPromise = new $.Deferred();

                //Hide the clear text icon
                inputContainer.find(".bz-wp-uitagsplugin-cancel-icon-list").hide(500);
                inputContainer.find(".bz-wp-uitagsplugin-add-icon-list").hide(500);

                //Showing found results
                inputContainer.find(".input-filter-results-on-uitagsplugin").bind('keypress keyup', function () {
                    if (this.value !== "") {
                        inputContainer.find(".bz-wp-uitagsplugin-cancel-icon-list").show(500);
                        inputContainer.find(".bz-wp-uitagsplugin-add-icon-list").show(500);
                    } else {
                        inputContainer.find(".bz-wp-uitagsplugin-cancel-icon-list").hide(500);
                        inputContainer.find(".bz-wp-uitagsplugin-add-icon-list").hide(500);
                    }

                    self.searchValue(this.value, inputContainer);
                }).focus(function(){
                    inputContainer.find(".filter-searchlist-modal-view-tags").addClass("searching");
                }).blur(function(){
                    inputContainer.find(".filter-searchlist-modal-view-tags").removeClass("searching");
                });

                //Cleaning search
                inputContainer.find(".bz-wp-uitagsplugin-cancel-icon-list").bind('click', function () {
                    self.showNoResultsMessage(inputContainer);
                    inputContainer.find(".input-filter-results-on-uitagsplugin").val("");
                    $(this).hide(500);
                    inputContainer.find(".bz-wp-uitagsplugin-add-icon-list").hide(500);
                });

                //adding tag
                inputContainer.find(".bz-wp-uitagsplugin-add-icon-list").bind('click', function () {
                    $(this).hide(500);
                    inputContainer.find(".bz-wp-uitagsplugin-cancel-icon-list").hide(500);

                    //add new element to data control
                    var value = inputContainer.find(".input-filter-results-on-uitagsplugin").val();
                    self.appendFoundItem(value, $(".filter-uitags-modal-view-tags", inputContainer), false);

                    inputContainer.find(".input-filter-results-on-uitagsplugin").val("");
                });

                //when click on apply button
                inputContainer.delegate("#ui-bizagi-apply-button-uitags", "click", function () {
                    closeModalViewPromise.resolve();
                    inputContainer.data("kendoMobileModalView").close();
                });

                inputContainer.find(".bz-wp-search-on-uitags-back-icon-list").bind("click", function () {
                    closeModalViewPromise.reject();
                    inputContainer.data("kendoMobileModalView").close();
                });

                //Trigger delete event for tags
                inputContainer.find(".filter-uitags-modal-view-tags").on("click", '.bz-rn-remove-tag-on-uitags', function () {
                    self.removeItem($(this), true);
                    var term = inputContainer.find(".input-filter-results-on-uitagsplugin").val();

                    self.searchValue(term, inputContainer);
                });

                $.when(closeModalViewPromise).done(function () {
                    self.addNewValuesToInput();
                    self.temporalElements = {};
                }).fail(function () {
                    self.temporalElements = {};
                });
            },

            /**
            * serach the value
            */
            searchValue: function(value, element){
                var self = this;

                //Show splash loader
                bizagiLoader({ "selector": ".bz-rn-new-modalview-content-styles" }).start();

                //Getting and showing the data
                $.when(self.showResults(value, element)).always(function () {
                    bizagiLoader({ "selector": ".bz-rn-new-modalview-content-styles" }).stop();
                });
            },

            /**
             * Show finded results
             * */
            showResults: function (value, inputContainer) {
                var self = this;

                var suggestions = self.tags.filter(function (tag) {
                  return tag.tag.indexOf(value) !== -1;
                });

                if (suggestions.length === 0) {
                    self.showNoResultsMessage(inputContainer);
                } else {
                    //Hide current results
                    $("#ui-bizagi-wp-filter-results-uitags-wrapper ul li", inputContainer).remove();

                    //Add new results to list
                    var newElement = $("li", $.tmpl(self.defaultModalViewTags, {"template": "sugestions", "items": suggestions }));
                    newElement.appendTo($("#ui-bizagi-wp-filter-results-uitags-wrapper ul", inputContainer));

                    //Get list of elements
                    self.modalViewList = $(".ui-bizagi-render-list-elements", inputContainer);

                    //Setting the initial selected display value
                    self.modalViewList.find("li").unbind().bind("click", function () {
                        //add new element to data control

                        self.appendFoundItem(this, $(".filter-uitags-modal-view-tags", inputContainer), true);

                        if ($(this).siblings().length === 0) {
                            self.showNoResultsMessage(inputContainer);
                        }

                        $(this).remove();
                    });
                }
            },

            /**
             * Show the correct message if there are elements to show
             * */
            showNoResultsMessage: function (inputContainer) {
                var self = this;
                var message = bizagi.localization.getResource("workportal-widget-inboxcommon-no-results-found");
                var newElement = $("li", $.tmpl(self.defaultModalViewTags, { 'template': "modalViewDefaultMessage", 'message': message }));

                $("#ui-bizagi-wp-filter-results-uitags-wrapper ul li", inputContainer).remove();
                newElement.appendTo($("#ui-bizagi-wp-filter-results-uitags-wrapper ul", inputContainer));
            },

            /**
             * Removen a item from the list
             * */
            removeItem: function (element, isModalViewContainer) {
                var self = this;
                var li = element.parent();
                var container = element.closest(".bz-rn-container-uitags");

                if (container.length === 0) {
                    container = element.closest(".filter-uitags-modal-view-tags");
                }

                if (!isModalViewContainer) {
                    delete li;
                } else {
                    delete self.temporalElements[li.data('id')];
                }

                // Remove list element
                li.remove();

                if (container.find("li").length <= 1 && !isModalViewContainer) {
                    $('.bz-rn-click-to-add-span', container).removeClass("hidden");
                    self.configureModalView(".bz-rn-last-child");
                } else if (container.find("li").length === 0 && isModalViewContainer) {
                    var defaultElement = $.tmpl(self.defaultModalViewTags, { 'template': "modalViewDefaultValue" }).clone();
                    $("li", defaultElement).appendTo($("ul", container));
                }
            },

            /**
             * Append founded item
             * */
            appendFoundItem: function (value, container, listElement) {
                var self = this;
                var id = "";
                var tag = "";

                // Map the ids of the elements to an array
                var uniqueIds = $.map($("li", container), function (val) {
                    return $(val).data("guid");
                });

                //in order to determinate if the tag exist in the tags array
                var suggest = [];

                // Avoid appending duplicated items
                //if is a clicked element
                if(listElement){
                    id = $(value).data("guid");
                    tag = $("label", value).text();
                }
                //if is a type element
                else {
                    //look if the element is in the tags array
                    suggest = self.tags.filter(function (tag) {
                      return tag.tag == value;
                    })[0];

                    //if the element exist in the tags array take it!
                    if(suggest){
                        id = suggest.guid;
                        tag = suggest.tag;

                        //if the selected element has simialars sibblings hide them
                        var element = $("[data-guid='" + id + "']", self.modalViewList);
                        if (element.siblings().length === 0) {
                            var inputContainer = $("#ui-bizagi-wp-filter-results-uitags-wrapper ul li", self.modalViewList.parents());
                            self.showNoResultsMessage(inputContainer);
                        }

                        //remove the element from results list
                        element.remove();
                    }
                    //if the element dont exist in the tags array, create a new element!
                    else{
                        id = Math.guid();
                        tag = value;
                    }
                }

                if (uniqueIds.indexOf(id) == -1) {
                    var $newElement = $("li", $.tmpl(self.defaultModalViewTags, { "template": "fullElement", "guid": id, "tag": tag }).clone());

                    // Get the latest item on list to append new li with match word
                    var lastElement = $("li:last", container);
                    if (lastElement.hasClass("bz-rn-any-element")) {
                        lastElement.remove();
                        $("ul", container).prepend($newElement);
                    } else {
                        $("ul", container).prepend($newElement);
                    }

                    self.addTemporalElement(id, tag, false);
                }
            },

            /**
            * get all the selectes tags
            */
            getTagsElements: function(){
                var elements = $("ul li.bz-rn-regular-element", self.input);
                var tags = [];

                for (var i = 0; i < elements.length; i++) {
                    var guid = $(elements[i]).data("guid");
                    var value = $("label", $(elements[i])).text();
                    var newElement = { "guid": guid, "tag": value };

                    tags.push(newElement);
                }

                return tags;
            },

            /**
             * Adding new values to input
             * */
            addNewValuesToInput: function () {
                var self = this;

                //Create a temporal array
                var tempArray = [];

                $.each(self.temporalElements, function (i, ele) {
                    tempArray.push(ele.obj);
                });

                //Clear the input
                $("ul li", self.input).remove();

                //Get the input content
                var inputContainer = $("li", $.tmpl(self.defaultInputTags, { "template": "inputContainer", "value": tempArray }).clone());

                //Add the input container
                inputContainer.appendTo($("ul", self.input));

                //unbind current events
                $("ul", self.input).unbind();
                $(".bz-rn-last-child", self.input).unbind();

                self.configureModalView(".bz-rn-last-child");

                self.configureInputHandlers();
            },

            configureInputHandlers: function(){
                var self = this;
                self.input.on("click", ".bz-rn-remove-tag-on-uitags", function () {
                    self.removeItem($(this));
                });
            },

            /**
             * Add new element to the temporal array
             * */
            addTemporalElement: function (id, value, elementToRemove) {
                var self = this;

                if (self.temporalElements[id]) {
                    delete self.temporalElements[id];
                }

                self.temporalElements[id] = { "obj": { "guid": id, "tag": value }, "remove": elementToRemove };
            }
        };

        methods.init(self, options);

        return methods;
    };

})($);