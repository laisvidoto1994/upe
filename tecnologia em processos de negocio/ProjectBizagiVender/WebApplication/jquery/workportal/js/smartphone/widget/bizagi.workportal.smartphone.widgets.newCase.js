/*
*   Name: BizAgi Workportal Smartphone New Case Widget Controller
*   Author: Oscar O
*   Comments:
*   -  refactor for new CAse tablet 
*/

// Auto extend
bizagi.workportal.widgets.newCase.extend("bizagi.workportal.widgets.newCase", {
    SEARCH_MIN_LENGTH: 3,
    SEARCH_DELAY: 700,
    ACTIVATE_AUTO_CLICK_APP_WHEN_1: true,
    ELEMENTS_TO_SHOW: 100
}, {

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function() {
        var self = this;
        var content = self.getContent();
        self.subscribe("onBackButtonClick", function(e, params) {
            self.publish("changeWidget", {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
            });
        });

        self.notifiesNavigation(bizagi.localization.getResource("workportal-widget-navigation-newcase"));

        self.activateAutoClickApplication = self.Class.ACTIVATE_AUTO_CLICK_APP_WHEN_1;
        self.renderCategories();
        self.configureTreeNavigation();
    },

    /*
    *notify to suscribe the message in the header
    */
    notifiesNavigation: function(message) {
        var self = this;
        self.publish("notifiesNavigation", { message: message });
    },

    /**
    these function is realize for optimize the memory in the smarphone; this objet is the common consult in the functions
    **/
    getContainer: function() {
        //return  this.getContent().find(".bz-wp-nc-content >div");
        var self = this;
        if (jQuery.type(self.bzwpnccontent) != "undefined") {
            return self.bzwpnccontent;
        } else {
            return self.bzwpnccontent = this.getContent().find(".bz-wp-nc-content >div");
        }
    },
    getContainerTree: function() {
        return this.getContent().find(".bz-wp-nc-content >ul"); //>ul
    },
    getRenderedElements: function(data) {
        var self = this;
        var template = self.workportalFacade.getTemplate("newCase-categories");
        return $.tmpl(template, data).appendTo(self.getContainer());
    },
    /**
    * Render List categories for each idCategory
    */
    renderCategories: function(idParentCategory, appId) {
        var self = this;
        var content = self.getContent();
        var categoryContainer = self.getContainer();
        var categoryTree = self.getContainerTree();
        var template = self.workportalFacade.getTemplate("newCase-categories");
        //  var defer = new $.Deferred();
        var elemToShow = self.Class.ELEMENTS_TO_SHOW;
        $.when(
                self.dataService.getCategories({
                    idCategory: idParentCategory
                }))
            .done(function(data) {
                categoryTree.show();

                if (bizagi.detectDevice() == "smartphone_ios") {
                    var ulParentHeight = $(".bz-wp-categoryTree").height();
                    $(".bz-wp-categoryTree >li:first-child").height(ulParentHeight + "px");
                }

                if (appId) {
                    var foundAppId = { category: [] };
                    // Search appId into data json, and return subCategories level				
                    $.each(data.category, function(key, value) {
                        if (value.appId == appId) {
                            foundAppId.category = value.subCategories;
                        }
                    });

                    // Change data value with found data
                    data = foundAppId;
                }
                // When it has more than 2 applications
                else if (data.totalApps > 1) {
                    var transformedData = { category: [] };

                    // Transform data and mark with appId flag
                    $.each(data.category, function(key, value) {
                        transformedData.category.push({
                            "appId": value.appId,
                            "idCategory": '',
                            "categoryName": value.appName,
                            "isProcess": "false",
                            "description": " "
                        });
                    });

                    // Change data value with transformed data
                    data = transformedData;
                }
                ////
                // Improve load time
                if (data.category.length > elemToShow) {
                    filterData.category = {};
                    for (i = 0; i <= elemToShow; i++) {
                        filterData.category[i] = data.category[i];
                    }
                    filterData.truncate = true;
                    categoryContent = $.tmpl(template, filterData);
                    categoryContent.appendTo(categoryContainer);

                    self.loadAllElementEvent(data);

                } else {
                    filterData = data;
                    categoryContent = $.tmpl(template, filterData);
                    categoryContent.appendTo(categoryContainer);
                }
                ////

                var filteredDataCases = {};
                filteredDataCases.category = [];
                var i = 0;
                $.each(data.category, function(key, obj) {
                    // Add label and value to item object
                    data.category[key].label = obj.categoryName;
                    data.category[key].value = obj.idCategory;
                });

                $(content).delegate("#searchNewCase", "keyup", function(e) {
                    e.stopPropagation();
                    if ($("#searchNewCase", content).val().length == 0 && filtered) {
                        categoryContent = $.tmpl(template, filterData);
                        categoryContent.appendTo(categoryContainer);
                        self.assignEvent();
                        self.loadAllElementEvent(data);
                        // reset flag
                        filtered = false;
                        filteredDataCases = {};
                        filteredDataCases.category = [];
                    }
                });

                // Define search results
                $("#searchNewCase", content).autocomplete({
                    messages: {
                        noResults: null, //"No search results.",
                        results: function() {}
                    },
                    minLength: 3,
                    source: data.category,
                    autoFocus: true,
                    position: {
                        my: "left top",
                        at: "left top",
                        of: "body",
                        offset: "-10 -10",
                        collision: "none",
                        delay: 800
                    },

                    //OPEN METHOD 
                    open: function(event, ui) {
                        // Reset values
                        i = 0;

                        filteredDataCases.category = [];
                    },

                    // SELECT METHOD 
                    select: function(event, ui) {
                        // If list only have one element, open them
                        if ($("#categories ul").length == 1) {
                            $("#categories ul").trigger("click");
                        }
                        return false;
                    }

                    // FILTER DATA FOR AUTOCOMPLE
                }).data("ui-autocomplete")._renderItem = function(ul, item) {

                    /* if(i>=15){
                    return true;
                    }
                    filteredDataCases.category[i++] = item;
                    */

                    filteredDataCases.category[i++] = item;
                    // Render template with new filtered data
                    categoryContent = $.tmpl(template, filteredDataCases);
                    categoryContent.appendTo(categoryContainer);

                    // Set flag 
                    filtered = true;
                    // Assign click event for new content
                    self.assignEvent(categoryContent);
                    self.loadAllElementEvent(data);
                    return true;
                };

                // Assign click event for new content
                self.assignEvent();
                // self.scrollVertical();

            });


    },

    loadAllElementEvent: function(data) {
        var self = this;
        var content = self.getContent();
        var template = self.workportalFacade.getTemplate("newCase-categories");
        var categoryContainer = self.getContainer();

        $(".loadMoreElements", categoryContainer).click(function(e) {
            e.stopPropagation();
            $(this).find("#loadMoreElementsIcon").removeClass("plus_load_icon").addClass("loading_icon");
            categoryContainer.empty();
            var categoryContent = $.tmpl(template, data);
            categoryContent.appendTo(categoryContainer);
            self.assignEvent();
        });
    },


    /**
    * Assign click event to list elements
    */
    assignEvent: function(elem, data) {
        var self = this;
        var content = self.getContent();
        var categoryContainer = self.getContainer();
        //var categoryTree = self.getContainerTree(); //$("#categoryTree", self.getContent());
        var liItem = elem || $("li", categoryContainer);

        $(liItem).click(function(event) {
            event.stopPropagation();

            var idCategory = bizagi.idCategory = $(this).data("category");
            var appId = $(this).data("appid");
            var isProcess = $(this).hasClass('bz-nc-process');
            var categoryName = $(this).data("category-name") || $(this).find("h3").html();

            $("#searchNewCase", content).val("");

            if (bizagi.util.parseBoolean(isProcess) == true) {
                $(this).prevAll("ul").fadeTo(650, 0, "easeInOutCirc").slideUp({
                    duration: 300,
                    easing: "easeInOutCirc"
                });

                $(this).nextAll("ul").fadeTo(650, 0, "easeInOutCirc").slideUp({
                    duration: 300,
                    easing: "easeInOutCirc"
                });

                bizagi.util.smartphone.startLoading();
                self.getContainer().hide(10, function() {});

                self.getContainerTree().hide(10);

                $.when(self.createNewCase(idCategory)).done(function(response) {
                    bizagi.util.smartphone.stopLoading();

                    if (response.idCase) {
                        self.notifiesNavigation(response.workItems.length > 0 ? response.workItems[0].displayName : "");
                    }

                }).fail(function(msg) {
                    bizagi.util.smartphone.stopLoading();

                    if (msg.responseText) {
                        var response = $.parseJSON(msg.responseText);
                        bizagi.showMessageBox(response.message, "Bizagi");

                        self.publish("changeWidget", {
                            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                        });
                    }
                });

            } else {
                self.drawProcess(idCategory, categoryName, appId);
            }
        });
    },

    drawProcess: function(idCategory, categoryName, appId) {
        var self = this;
        var categoryTree = self.getContainerTree();
        $.when(self.renderCategories(idCategory, appId)).done(function(data) {
            if (data != "") {
                var headerTemplate = self.workportalFacade.getTemplate("newCase-categories-tree");
                $.tmpl(headerTemplate, {
                    idParentCategory: idCategory,
                    categoryName: categoryName || appId,
                    "appId": appId
                }).appendTo(categoryTree);
                self.configureTreeNavigation();
            }
        });
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function() {
        var self = this;
        var categoryTree = self.getContainerTree(); //$("#categoryTree", self.getContent()); 
        $("li:last-child", categoryTree).click(function() {
            $(this).nextAll().remove();
            //$(this).find("> span").data("p-cat")
            self.renderCategories($(this).find("> span").data("p-cat"), $(this).find("> span").data("appid"));
        });
    },

    /*
    *   Creates a new case based on the selected process
    */
    createNewCase: function (idWfClass, idOrganization, isOfflineForm) {
        var self = this;
        var def = new $.Deferred();
        var dialogTemplate = self.workportalFacade.getTemplate("error-message");
        var content = self.getContent();

        // Creates a new case
        $.when(self.dataService.createNewCase({
            idWfClass: idWfClass,
            idOrganization: idOrganization,
            isOfflineForm: isOfflineForm
        })).done(function (data) {
            def.resolve(data);
            // Then we call the routing action
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: data.idCase,
                formsRenderVersion: (typeof data.isOfflineForm != "undefined") ? data.formsRenderVersion : 0,
                isOfflineForm: (typeof data.isOfflineForm != "undefined") ? data.isOfflineForm : false
            });
        }).fail(function (msg) {            
            def.reject(msg);
        });
        return def.promise();
    }
});
