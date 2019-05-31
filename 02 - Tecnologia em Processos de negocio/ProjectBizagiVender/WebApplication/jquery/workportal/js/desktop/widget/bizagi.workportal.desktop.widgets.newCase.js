/*
*   Name: BizAgi Workportal Desktop New Case Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will provide desktop overrides to implement the new case widget
*/

// Auto extend
bizagi.workportal.widgets.newCase.extend("bizagi.workportal.widgets.newCase", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "error-message": bizagi.getTemplate("common.bizagi.desktop.error-message"),
            "newCase": bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase").concat("#ui-bizagi-workportal-widget-newcase"),
            "newCase-categories": bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase").concat("#ui-bizagi-workportal-widget-newcase-categories"),
            "newCase-categories-tree": bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase").concat("#ui-bizagi-workportal-widget-newcase-categories-tree"),
            "newCase-categories-recent-process": bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase").concat("#ui-bizagi-workportal-widget-recent-process"),
            "newCase-categories-organization-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase").concat("#ui-bizagi-workportal-widget-newcase-organization-list"),
            useNewEngine: false
        });
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();
        // Render base categories
        //self.renderCategories();

        // Bind back button
        self.configureBackButton();

        // Reset state
        bizagi.idCategory = undefined;

        // Bind scroll buttons
        self.scrollVertical({
            "autohide": false
        });

        // Bind tree navigation
        self.configureTreeNavigation();
        // Bind recent process
        $("#frecuentCases", content).click(function () {
            //Remove organizationList if exist
            self.removeOrganizationList();

            // Block multi click on this element
            if ($(this).hasClass('frecuentCasesOn')) {
                return;
            }

            // Hide search field
            $(".searchNewCase", content).hide();

            // Set title
            $('#modalTitle', content).html(self.getResource('workportal-widget-newcase-recent'));

            // Change to recent process 
            self.renderRecentProcess();

            // Change css selected
            $(this).addClass("frecuentCasesOn");
            $("#casesList", content).removeClass("casesListOn");

        }).tooltip();

        // Bind recent process
        $("#casesList", content).click(function () {
            //Remove organizationList if exist
            self.removeOrganizationList();

            // Block multi click on this element
            if ($(this).hasClass('casesListOn')) {
                return;
            }

            // Show search field and empty element
            $(".searchNewCase", content).show();
            $("#searchNewCase", content).focus();
            $("#searchNewCase", content).val("");

            // Set title
            $('#modalTitle', content).html(self.getResource('workportal-widget-newcase-create'));

            // Change to recent process 
            self.renderCategories();
            
            // Change css selected
            $(this).addClass("casesListOn");
            $("#frecuentCases", content).removeClass("frecuentCasesOn");

        }).tooltip();

        

        // Bind Search tab
        $("#search", content).click(function () {
            if ($(this).hasClass("searchOn")) {
                $(this).removeClass("searchOn");

            } else {
                $(this).addClass("searchOn");

            }
        });


        // Show recent proccess category
        $("#frecuentCases", content).click();
    },

    /**
    * Render List categories for each idCategory
    */
    renderCategories: function (idParentCategory, appId) {
        var self = this;
        var content = self.getContent();
        var template = self.getTemplate("newCase-categories");
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var filtered = false;
        var categoryContent;
        var filterData = {};
        var elemToShow = 100;

        // Create critic section to prevent double click event
        bizagi.criticSection = (bizagi.criticSection == 1) ? 1 : 0;

        // Load categories
        $.when(
			self.dataService.getCategories({
			    idCategory: idParentCategory,
			    idApp: appId || ""
			}))
		.done(function (data) {
		    // Renders the categories
		    categoryContainer.empty();
		    categoryTree.show();

		    if (data.totalApps > 1) {
		        var transformedData = {
		            category: []
		        };

		        // Transform data and mark with appId flag
		        $.each(data.category, function (key, value) {
		            transformedData.category.push({
		                "appId": value.appId,
		                "idCategory": '',
		                "categoryName": value.appName,
		                "isProcess": "false",
		                "isAdhocProcess": "false",
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
		    self.scrollVertical({
		        "autohide": false
		    });


		    // Define autocomplete information for search cases
		    var filteredDataCases = {};
		    filteredDataCases.category = [];
		    var i = 0;
		    $.each(data.category, function (key, obj) {
		        // Add label and value to item object
		        data.category[key].label = obj.categoryName;
		        data.category[key].value = obj.idCategory;
		    });

		    // Add auto focus 
		    $("#searchNewCase", content).focus();

		    $(content).delegate("#searchNewCase", "keyup", function (e) {
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
		        messages: {
		            noResults: null, //"No search results.",
		            results: function () { }
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

		        /* OPEN METHOD */
		        open: function (event, ui) {
		            // Reset values
		            i = 0;
		            filteredDataCases.category = [];
		        },

		        /* SELECT METHOD */
		        select: function (event, ui) {
		            // If list only have one element, open them
		            if ($("#categories ul").length == 1) {
		                $("#categories ul").trigger("click");
		            }
		            return false;
		        }

		        /* FILTER DATA FOR AUTOCOMPLE */
		    }).data("ui-autocomplete")._renderItem = function (ul, item) {

		        if (i >= 15) {
		            return true;
		        }
		        filteredDataCases.category[i++] = item;

		        // Render template with new filtered data
		        categoryContent = $.tmpl(template, filteredDataCases);
		        categoryContent.appendTo(categoryContainer);

		        // Set flag 
		        filtered = true;
		        // Assign click event for new content
		        self.assignEvent(categoryContent);
		        self.loadAllElementEvent(data);
		        return categoryContent;
		    };

		    // Assign click event for new content
		    self.assignEvent();

		});
    },

    /*
    * Assign click event to load all elements
    */
    loadAllElementEvent: function (data) {
        var self = this;
        var content = self.getContent();
        var template = self.getTemplate("newCase-categories");
        var categoryContainer = $("#categories", content);

        $(".loadMoreElements", categoryContainer).click(function (e) {
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
    assignEvent: function (elem, data) {
        var self = this;
        var content = self.getContent();
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var ul = elem || $("ul", categoryContainer);
        $(ul).click(function (e) {
            e.stopPropagation();

            var idCategory = $(this).children("#idCategory").val();
            var idWFClass = idCategory;
            var isProcess = $(this).children("#isProcess").val();
            var categoryName = $(this).children("#categoryName").val();
            var isAdhocProcess = $(this).children("#isAdhocProcess").val();
            var appId = $(this).data('appid');


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

                if(bizagi.currentUser.isMultiOrganization && bizagi.currentUser.isMultiOrganization == "true"){
                    $.when(
                       self.dataService.getOrganizationsList()
                    ).done(function (data){
                       self.createOrganizationList( idWFClass, data.response, $(categoryContainer).parent().outerWidth(), $("#modalMenuBtList",self.getContent()).position().top);
                    });
                }
                else{

                // Show waiting modal box
                $("#modalNewCaseOverlay", content).removeClass("modalNewCaseOverlay").addClass("modalNewCaseOverlayShow");
                $("#modalNewCaseMessage", content).addClass("show");
                // Center Element                
                $("#modalNewCaseMessage", content).css("left", (($(document).width() / 2) - ($("#modalNewCaseMessage", content).width() / 2)));
                $("#modalNewCaseMessage", content).css("top", (($(document).height() / 2) - ($("#modalNewCaseMessage", content).height() / 2)));
                // Set Text 
                $("#case", content).html(categoryName);

                    $.when(self.createNewCase(idCategory, isAdhocProcess)).done(function (data) {
					    // set global idworkitem
                        if(bizagi.referrerParams){
                            bizagi.referrerParams.idWorkItem = '';
                        }


					    if (data.caseInfo.workItems && data.caseInfo.workItems.length >= 1) {
					    bizagi.referrerParams.idWorkItem = (data.caseInfo.workItems.length >= 1) ? data.caseInfo.workItems[0].idWorkItem : '';
					    }

					    // Also close the popup
					    bizagi.workportal.desktop.popup.closePopupInstance();

					    // Hide waiting modal box
					    $("#modalNewCaseOverlay", content).addClass("modalNewCaseOverlay").removeClass("modalNewCaseOverlayShow");
					    $("#modalNewCaseMessage", content).removeClass("show");

					});
                }

            } else {
                // Append category header
                var headerTemplate = self.getTemplate("newCase-categories-tree");
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
            // Reset last idcategory
            bizagi.idCategory = undefined;
        });
    },
    /**
    *  Render the recent process category
    */
    renderRecentProcess: function () {
        var self = this;
        var content = self.getContent();
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var btnBack = $("#bt-back", content);
        var template = self.getTemplate("newCase-categories-recent-process");

        categoryContainer.empty();

        // reset content of category tree
        $("li:first", categoryTree).nextAll().remove();
        categoryTree.hide();
        btnBack.hide();

        // Define New Content
        $.when(
			self.dataService.getRecentProcesses({
			    numberOfProcesses: 7
			})
			).done(function (data) {
			    $.tmpl(template, data).appendTo(categoryContainer);
                // this is for IE9. to prevent an undesirable visual effect.
			    if (data.processes.length === 0 && $.browser.msie) {
			        categoryContainer.blur();
			        self.busyLoop();
			        categoryContainer.hide();
			        categoryContainer.remove();
			    }
			    // Bind recent process
			    $("ul", categoryContainer).click(function () {

			        $("ul", categoryContainer).unbind("click");
			        
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


			        if (bizagi.currentUser.isMultiOrganization && bizagi.currentUser.isMultiOrganization == "true") {
                        $.when(
                        self.dataService.getOrganizationsList()
                        ).done(function (data) {
                            self.createOrganizationList(idWFClass, data.response, $(categoryContainer).parent().outerWidth(), $("#modalMenuBtList", self.getContent()).position().top);
                        });
                    }
			        else {
			            $.when(bizagi.util.autoSave()).done(function () {
			                $(document).data('auto-save', '');
			                $.when(self.createNewCase(idWFClass)).done(function (data) {
                            // set global idworkitem
			                    if (data && !data.hasStartForm)
                            if (bizagi.referrerParams)
			                            bizagi.referrerParams.idWorkItem = (data.caseInfo.workItems.length >= 1) ? data.caseInfo.workItems[0].idWorkItem : '';
			                });
			            });
                            // Also close the popup
                            bizagi.workportal.desktop.popup.closePopupInstance();
                    }

                    setTimeout(function () {
                        $("ul", categoryContainer).bind("click");
                    }, 1000);
					
			    });

			});
    },

    createOrganizationList: function (idWFClass, organizationList, posX, posY) {
        var self = this,
            content = self.getContent();

        var modalMenuBtList = $('#modalMenuBtList', content);
        
        var organizationListTemplate = self.getTemplate("newCase-categories-organization-list");
        
        if($('#organization-list', modalMenuBtList).length === 0){
            var organizationListContent = $.tmpl(organizationListTemplate, {"organizationList": organizationList}).appendTo(modalMenuBtList);

        //Bind the click event create the case
        $('#new-case', organizationListContent).click(function (e) {
            e.preventDefault();

            $.when(
                self.createNewCase(idWFClass, $('#organization-list', organizationListContent).val())
            ).done(function (data) {
                // set global idworkitem
                if (data)
                if (bizagi.referrerParams)
                bizagi.referrerParams.idWorkItem = (data.caseInfo.workItems.length >= 1) ? data.caseInfo.workItems[0].idWorkItem : '';

                // Also close the popup
                bizagi.workportal.desktop.popup.closePopupInstance();
            });

        });
        }
    },

    removeOrganizationList: function(){
        var self = this;
        var content = self.getContent();
        $(".new-case-organization-list-content", content).remove();
    },

    /**
    *   Binds the back buttons so we can navigate back
    */
    configureBackButton: function () {
        var self = this;
        var content = self.getContent();
        var btnBack = $("#bt-back", content);
        var categoryTree = $("#categoryTree", content);

        // Bind click
        btnBack.click(function () {
            bizagi.idCategory = undefined;
            if ($("li", categoryTree).length == 2) {
                // hide back button
                btnBack.hide();
            }

            if ($("li", categoryTree).length > 1) {
                // Removes last child                    
                $("li:last-child", categoryTree).remove();

                // Render categories again
                var idCategory = $("li:last-child", categoryTree).children("#idParentCategory").val();
                var appId = $("li:last-child", categoryTree).data('appid');
                self.renderCategories(idCategory, appId);
            }
        });
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function () {
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
        $("li:last-child", categoryTree).click(function () {
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
    scrollVertical: function (options) {
        var self = this;
        var content = self.getContent();

        options = options || {};

        $("#categories", content).bizagiScrollbar(options);
    },

    busyLoop: function (options) {
        var x = 1;
        var y = null; // To keep under proper scope

        setTimeout(function () {
            x = x * 3 + 2;
            y = x / 2;
        }, 100);
    }
});
