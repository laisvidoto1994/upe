/*
 *   Name: BizAgi Workportal Tablet New Case Widget Controller
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will provide tablet overrides to implement the new case widget
 */

// Auto extend
bizagi.workportal.widgets.newCase.extend("bizagi.workportal.widgets.newCase", {}, {

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function() {
        var self = this;
        var content = self.getContent();
        // Render base categories
        self.renderCategories();

        // Bind back button
        self.configureBackButton();

        // Reset state
        bizagi.idCategory = undefined;

        // Bind scroll buttons
        self.scrollVertical();

        // Bind tree navigation
        self.configureTreeNavigation();
        // Bind recent process
        $("#frecuentCases", content).click(function() {
            // Hide search field
            $("#searchNewCase", content).hide();

            // Change to recent process 
            self.renderRecentProcess();

            // Change css selected
            $(this).addClass("frecuentCasesOn");
            $("#casesList", content).removeClass("casesListOn");

        });

        // Bind recent process
        $("#casesList", content).click(function() {
            // Show search field and empty element
            $("#searchNewCase", content).show();
            $("#searchNewCase", content).focus();
            $("#searchNewCase", content).val("");

            // Change to recent process 
            self.renderCategories();
            // Change css selected
            $(this).addClass("casesListOn");
            $("#frecuentCases", content).removeClass("frecuentCasesOn");
        });

        // Bind Search tab
        $("#search", content).click(function() {
            if ($(this).hasClass("searchOn")) {
                $(this).removeClass("searchOn");

            } else {
                $(this).addClass("searchOn");

            }
        });
    },

    /**
    * Render List categories for each idCategory
    */
    renderCategories: function(idParentCategory, appId) {
        var self = this;
        var content = self.getContent();
        var template = self.workportalFacade.getTemplate("newCase-categories");
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var filtered = false;
        var categoryContent;
        var filterData = {};
        var elemToShow = 100;

        // Create critic section to prevent double click event
        bizagi.criticSection = (bizagi.criticSection == 1) ? 1 : 0;

        // Load categories
        $.when(self.dataService.getCategories({
            idCategory: idParentCategory,
            idApp: appId || ""
        })).done(function(data) {
            // Renders the categories
            ///       categoryContainer.empty();
            categoryTree.show();

            //todo se puede incluir una funcion en util que me diga el status actual del dispositivo
            /*if (!bizagi.workportal.tablet.popup.instance) {
            return;
            }*/

            if (data.totalApps > 1) {
                var transformedData = {
                    category: []
                };

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


            // Bind scroll vertical
            self.scrollVertical();


            // Define autocomplete information for search cases
            var filteredDataCases = {};
            filteredDataCases.category = [];
            var i = 0;
            $.each(data.category, function(key, obj) {
                // Add label and value to item object
                data.category[key].label = obj.categoryName;
                data.category[key].value = obj.idCategory;
            });

            // Add auto focus 
            $("#searchNewCase", content).focus();

            $(content).delegate("#searchNewCase", "keyup", function(e) {
                e.stopPropagation();
                if ($("#searchNewCase", content).val().length === 0 && filtered) {
                    categoryContent = $.tmpl(template, filterData);
                    categoryContent.appendTo(categoryContainer);
                    self.assignEvent();
                    self.loadAllElementEvent(data);
                    // reset flag
                    filtered = false;
                }
            });

            // Define search results
            $("#searchNewCase", content).autocomplete({
                minLength: 3,
                source: data.category,
                autoFocus: true,
                close: "close",
                position: {
                    my: "left top",
                    at: "left top",
                    of: "body",
                    offset: "-10 -10",
                    collision: "none",
                    delay: 800
                },

                /* OPEN METHOD */
                open: function(event, ui) {
                    // Reset values
                    $(".ui-menu-item").hide();
                    filteredDataCases.category = [];
                },

                /* SELECT METHOD */
                select: function(event, ui) {
                    // If list only have one element, open them
                    if ($("#categories ul").length == 1) {
                        $("#categories ul").trigger("click");
                    }
                    return false;
                },
                response: function(event, ui) {
                    if (ui.content.length >= 15) {
                        return true;
                    }
                    // Render template with new filtered data
                    $.each(ui.content, function(key, value) {
                        filteredDataCases.category.push(value);
                    });


                    categoryContent = $.tmpl(template, filteredDataCases);
                    categoryContent.appendTo(categoryContainer);

                    // Set flag 
                    filtered = true;
                    // Assign click event for new content
                    self.assignEvent(categoryContent);
                    self.loadAllElementEvent(data);
                    return true;
                }
            });

            // Assign click event for new content
            self.assignEvent();
            self.scrollVertical();
        });
    },

    /*
    * Assign click event to load all elements
    */
    loadAllElementEvent: function(data) {
        var self = this;
        var content = self.getContent();
        var template = self.workportalFacade.getTemplate("newCase-categories");
        var categoryContainer = $("#categories", content);

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
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var ul = elem || $("ul", categoryContainer);

        $(ul).click(function(e) {
            e.stopPropagation();

            var idCategory = $(this).children("#idCategory").val();
            var isProcess = $(this).children("#isProcess").val();
            var categoryName = $(this).children("#categoryName").val();
            var appId = $(this).data('appid');
            var hasOfflineForm = bizagi.util.parseBoolean($(this).children("#hasOfflineForm").val());

            // check critic section
            if ((bizagi.criticSection == 1 || idCategory == bizagi.idCategory) && !bizagi.util.parseBoolean(isProcess)) {
                return true;
            }

            // Define last idcategory
            bizagi.idCategory = idCategory;

            // Clear autocomplete field value
            $("#searchNewCase", content).val("");

            // up critic section
            bizagi.criticSection = 1;

            if (bizagi.util.parseBoolean(isProcess) === true) {

                // Allow user to access offline form
                if (!bizagi.util.hasOfflineFormsEnabled() && hasOfflineForm) {
                    hasOfflineForm = false;
                }

                // Create a new case
                var elemt = $(this).find(".processIco");
                $(elemt).addClass("wait");

                // Delete others elements

                $(this).prevAll("ul").fadeTo(650, 0, "easeInOutCirc").slideUp({
                    duration: 300,
                    easing: "easeInOutCirc"
                });

                $(this).nextAll("ul").fadeTo(650, 0, "easeInOutCirc").slideUp({
                    duration: 300,
                    easing: "easeInOutCirc"
                });

                // Show waiting modal box
                $("#modalNewCaseOverlay", content).removeClass("modalNewCaseOverlay").addClass("modalNewCaseOverlayShow");
                $("#modalNewCaseMessage", content).addClass("show");
                // Center Element                
                $("#modalNewCaseMessage", content).css("left", (($(document).width() / 2) - ($("#modalNewCaseMessage",content).width() / 2)));
                $("#modalNewCaseMessage", content).css("top", (($(document).height() / 2) - ($("#modalNewCaseMessage",content).height() / 2)));
                // Set Text 
                $("#case", content).html(categoryName);
                $("#menu-items #new-case").trigger("processClicked");

                $.when(self.createNewCase(idCategory, null, hasOfflineForm)).done(function(resp) {
                    // set global idworkitem
                    var data = { hasStartForm: resp.hasStartForm, idProcess: resp.idProcess };
                    $.extend(data, resp.caseInfo);

                    bizagi.referrerParams.idWorkItem = (data.workitems && data.workItems.length) > 0 ? data.workItems[0].idWorkItem : "";

                    // Also close the popup
                    bizagi.workportal.tablet.popup.closePopupInstance();

                    // Hide waiting modal box
                    $("#modalNewCaseOverlay", content).addClass("modalNewCaseOverlay").removeClass("modalNewCaseOverlayShow");
                    $("#modalNewCaseMessage", content).removeClass("show");

                    // Toggle menu
                    $("#menu-toggler").trigger("click");
                }).fail(function(msg) {
                    bizagi.workportal.tablet.popup.closePopupInstance();

                    // Hide waiting modal box
                    $("#modalNewCaseOverlay", content).addClass("modalNewCaseOverlay").removeClass("modalNewCaseOverlayShow");
                    $("#modalNewCaseMessage", content).removeClass("show");

                    if (msg.responseText) {
                        var response = $.parseJSON(msg.responseText);
                        bizagi.showMessageBox(response.message, "Bizagi");
                    }

                    // Toggle menu
                    $("#menu-toggler").trigger("click");
                });
            } else {
                // Append category header
                var headerTemplate = self.workportalFacade.getTemplate("newCase-categories-tree");
                $.tmpl(headerTemplate, {
                    idParentCategory: idCategory,
                    categoryName: categoryName,
                    appId: appId
                }).appendTo(categoryTree);

                // Set bind event for last element
                self.configureTreeNavigation();

                // Render sub-categories
                self.renderCategories(idCategory, appId);
            }

            // Reset critical section
            bizagi.criticSection = 0;
        });
    },
    /**
    *  Render the recent process category
    */
    renderRecentProcess: function() {
        var self = this;
        var content = self.getContent();
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var btnBack = $("#bt-back", content);
        var template = self.workportalFacade.getTemplate("newCase-categories-recent-process");

        categoryContainer.empty();

        // reset content of category tree
        $("li:first", categoryTree).nextAll().remove();
        categoryTree.hide();
        btnBack.hide();

        // Define New Content
        $.when(
            self.dataService.getRecentProcesses()
        ).done(function(data) {
            $.tmpl(template, data).appendTo(categoryContainer);

            // Bind recent process
            $("ul", categoryContainer).click(function() {
                var idWFClass = $(this).children("#idWFClass").val();
                // Creates a new case
                var elemt = $(this).find(".processIco");
                $(elemt).addClass("wait");

                // Delete others elements

                $(this).prevAll("ul").fadeTo(650, 0, "easeInOutCirc").slideUp({
                    duration: 300,
                    easing: "easeInOutCirc"
                });

                $(this).nextAll("ul").fadeTo(650, 0, "easeInOutCirc").slideUp({
                    duration: 300,
                    easing: "easeInOutCirc"
                });

                $.when(self.createNewCase(idWFClass)).done(function(resp) {
                    // set global idworkitem
                    var data = { hasStartForm: resp.hasStartForm, idProcess: resp.idProcess };
                    $.extend(data, resp.caseInfo);

                    bizagi.referrerParams.idWorkItem = (data.workitems && data.workitems.length > 0) ? data.workItems[0].idWorkItem : "";

                    // Also close the popup
                    bizagi.workportal.tablet.popup.closePopupInstance();
                }).fail(function(msg) {
                    // Also close the popup
                    bizagi.workportal.tablet.popup.closePopupInstance();

                    if (msg.responseText) {
                        var response = $.parseJSON(msg.responseText);
                        bizagi.showMessageBox(response.message, "Bizagi");
                    }
                });
            });
        });
    },

    /**
    *   Binds the back buttons so we can navigate back
    */
    configureBackButton: function() {
        var self = this;
        var content = self.getContent();
        var btnBack = $("#bt-back", content);
        var categoryTree = $("#categoryTree", content);

        // Bind click
        btnBack.click(function() {

            if ($("li", categoryTree).length == 2) {
                // hide back button
                btnBack.hide();
            }

            if ($("li", categoryTree).length > 1) {
                // Removes last child                    
                $("li:last-child", categoryTree).remove();

                // Render categories again
                var idCategory = $("li:last-child").children("#idParentCategory").val();
                self.renderCategories(idCategory);
            }
        });
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function() {
        var self = this;
        var content = self.getContent();
        var btnBack = $("#bt-back", content);
        var categoryTree = $("#categoryTree", content);

        if ($("li", categoryTree).length <= 1) {
            btnBack.hide();
        } else {
            btnBack.show();
        }

        // Bind header events
        $("li:last-child", categoryTree).click(function() {
            // Remove all elements
            $(this).nextAll().remove();
            var idCategory = $(this).children("#idParentCategory").val();
            var appId = $(this).data('appid');
            if ($("li", categoryTree).length == 1) {
                bizagi.idCategory = undefined;
                btnBack.hide();
            }

            // if it has appId, reset bizagi.idCategory in orden to unlock criticSection
            if (appId) {
                bizagi.idCategory = undefined;
            }

            // Render category again
            self.renderCategories(idCategory, appId);
        });
    },

    /**
    *  Bind the vertical scroll buttons
    */
    scrollVertical: function(options) {
        var self = this;
        var content = self.getContent();

        options = options || {};

        $("#categories", content).css({
            "overflow-y": "scroll",
            "-webkit-overflow-scrolling": "touch"
        });
    },

    /*
    *   Creates a new case based on the selected process
    */
    createNewCase: function(idWfClass, idOrganization, isOfflineForm) {
        var self = this;
        var def = new $.Deferred();

        // Creates a new case
        $.when(self.dataService.createNewCase({
            idWfClass: idWfClass,
            idOrganization: idOrganization,
            isOfflineForm: isOfflineForm
        })).done(function(data) {
            def.resolve(data);
            // Then we call the routing action
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: data.idCase,
                formsRenderVersion: (typeof data.isOfflineForm != "undefined") ? data.formsRenderVersion : 0,
                isOfflineForm: (typeof data.isOfflineForm != "undefined") ? data.isOfflineForm : false
            });
        }).fail(function(msg) {
            def.reject(msg);
        });
        return def.promise();
    }

});
