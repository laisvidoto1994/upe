/*
*   Name: BizAgi Desktop Queries Dialog implementation
*   Author: Juan Pablo Crossley
*   Modifications:
*   modifiedPostRender
*   -    Paola Herrera
*   -    Andres Fernando Muñoz
*   -    Iván Ricardo Taimal
*
*  added checkDisplayedNames, getRenderElementDisplayByXpath
*  -    Carlos I Mercado
*/

// Extends itself
bizagi.workportal.widgets.queryform.extend("bizagi.workportal.widgets.queryform", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "queryform": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-frankenstein-queryform-wrapper"),
            "queryform-wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-wrapper"),
            "queryform-container": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-container"),
            "queryform-buttons": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-buttons"),
            "queryform-graphic-analysis": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-graphic-analysis"),
            "queryform-result-set": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-result-set"),
            "queryform-search-result": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-search-result"),
            "queryform-pagination": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-pagination"),
            "queryform-admin-result": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-admin-result"),
            "queryform-share-selection": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-share-selection"),
            "queryform-select-user": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-select-user"),
            "queryform-select-group": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-select-group"),
            "queryform-save-as": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform-save-as"),
            "queryform-message-error": bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform").concat("#ui-bizagi-workportal-widget-queryform--message-error"),
            useNewEngine: false
        });
    },
    /*
     *   To be overriden in each device to apply layouts
     */
    postRender: function () {
        var self = this;

        if (self.params.notMigratedUrl == "true") {
            self.params.notMigratedUrl = Boolean(self.params.notMigratedUrl);
        }

        //if (bizagi.util.parseBoolean(bizagi.override.disableFrankensteinQueryForms) == true && (self.params.notMigratedUrl == "" || self.params.notMigratedUrl == true)) {
        if ((self.params.notMigratedUrl == "" || self.params.notMigratedUrl == true)) {
            self.modifiedPostRender();
        }
        else {
            self.frankensteinPostRender();
        }
    },

    loadtemplates: function () {
        var self = this;
        self.container = self.getTemplate("queryform-container");
        self.buttons = self.getTemplate("queryform-buttons");
        self.graphicalAnalysisContainer = self.getTemplate("queryform-graphic-analysis");
        self.resultSet = self.getTemplate("queryform-result-set");
        self.searchResult = self.getTemplate("queryform-search-result");
        self.paginationTmpl = self.getTemplate("queryform-pagination");
        self.adminResult = self.getTemplate("queryform-admin-result");
        self.selectUser = self.getTemplate("queryform-select-user");
        self.selectGroup = self.getTemplate("queryform-select-group");
        self.shareSelection = self.getTemplate("queryform-share-selection");
        self.dialogSaveAs = self.getTemplate("queryform-save-as");
    },

    /*
     *  New Query Forms implementation
     */
    modifiedPostRender: function () {
        var self = this;
        var content = self.getContent();
        self.maxElemShow = 10;
        self.maxPageToShow = 5;
        self.atLeastOneChecked = false;
        self.selectedItemsToShare = {
            users: [],
            groups: []
        };
        self.readyToSave = false;
        self.includeAllUsers = false;
        self.saveAs = false;
        self.sortedField = {};
        self.storedQueryFormParameters = {};
        self.dialogSaveAs = $.tmpl(self.dialogSaveAs);
        self.orderType = {
            ASC: "ASC",
            DESC: "DESC",
            NONE: "NONE"
        };
        self.queryFormContextTypes = {
            CASES: "metadata",
            ENTITY: "entity"
        };
        self.queryFormTypes = {
            CASES: "CASES",
            ENTITY: "ENTITIES"
        };

        if (self.params.notMigratedUrl == true || self.params.paramsStoredQuery.notMigratedUrl == true) {
            var messageErrorForm = self.getResource("workportal-widget-admin-entities-message-migrate");
            messageErrorForm = messageErrorForm.replace("{build}", bizagi.loader.productBuildToAbout);
            var htmlMessage = $.tmpl(self.getTemplate("queryform-message-error"), { messageError: messageErrorForm });
            $(content).html(htmlMessage);
            return false;
        }

        if (self.params.queryFormAction == 'edit') {
            self.guidEntity = self.params.paramsStoredQuery.definition.entityGuid;
            self.guidForm = self.params.paramsStoredQuery.guid;
            self.queryFormType = self.params.paramsStoredQuery.definition.type;
            self.idQueryForm = self.params.paramsStoredQuery.id;
            self.renderQueryForm();
            self.showSaveResultsForm();
            self.previousValues(self.params.paramsStoredQuery);
        }

        if (self.params.queryFormAction == 'renderQueryForm') {
            self.guidForm = self.params.guidForm;
            self.guidEntity = self.params.guidEntity;
            if (self.params.queryType == 1) {
                self.queryFormType = self.queryFormTypes.CASES;
            } else if (self.params.queryType == 2) {
                self.queryFormType = self.queryFormTypes.ENTITY;
            }
            self.renderQueryForm();
        }
        //Load data from query form stored
        if (self.params.queryFormAction == 'execute') {
            self.guidEntity = self.params.paramsStoredQuery.definition.entityGuid;
            self.guidForm = self.params.paramsStoredQuery.guid;
            self.queryFormType = self.params.paramsStoredQuery.definition.type;
            self.includeAllUsers = self.params.paramsStoredQuery.definition.includeAllUsers;
            self.idQueryForm = self.params.paramsStoredQuery.id
            var searchParams = {
                "numberOfRows": 10,
                "pageNumber": 1,
                "queryFormGuid": self.params.paramsStoredQuery.guid,
                "entityGuid": self.params.paramsStoredQuery.definition.entityGuid,
                "type": self.params.paramsStoredQuery.definition.type,
                "parameters": self.params.paramsStoredQuery.definition.parameters,
                "ownerQuery": self.params.paramsStoredQuery.owner,
                "includeAllUsers": self.params.paramsStoredQuery.definition.includeAllUsers
            };
            self.handleEvents();
            self.initialSearchParams = JSON.parse(JSON.stringify(searchParams));

            //parses the type
            if (self.queryFormType == self.queryFormTypes.CASES) {
                self.contextType = self.queryFormContextTypes.CASES;
            } else if (self.queryFormType == self.queryFormTypes.ENTITY) {
                self.contextType = self.queryFormContextTypes.ENTITY;
            }
            //builds the params
            var queryFormParams = {
                h_action: "QUERYFORM",
                h_contexttype: self.contextType,
                h_idForm: self.guidForm
            };
            $("#query-form-buttons", content).hide();

            //request to queryForm definition service
            self.dataService.getQueryForm(queryFormParams).done(function (data) {

                //stores the elements to check their values later
                self.queryFormElements = data.form.elements;

                //find the results directly, no need to enter any value
                self.findResults(content, searchParams);
            });

            $("#copy-as-new-stored-queryform", content).hide();
            $("#update-stored-queryform", content).hide();
            $('#edit-stored-queryform', content).show();
        }
    },


    /*
    *  Render queryForm
    * */
    renderQueryForm: function () {
        var self = this;
        var content = self.getContent();
        if (self.queryFormType == self.queryFormTypes.CASES) {
            self.contextType = self.queryFormContextTypes.CASES;
        } else if (self.queryFormType == self.queryFormTypes.ENTITY) {
            self.contextType = self.queryFormContextTypes.ENTITY;
        }
        var queryFormParams = {
            h_action: "QUERYFORM",
            h_contexttype: self.contextType,
            h_idForm: self.guidForm
        };
        if (self.idQueryForm && self.idQueryForm != "") {
            queryFormParams.h_idqueryform = self.idQueryForm;
        }
        var renderContainer = $.tmpl(self.container);
        //request to queryForm definition service
        self.dataService.getQueryForm(queryFormParams).done(function (data) {
            var renderingParams = { canvas: renderContainer, data: data, type: "queryForm" };

            //stores the elements to validate them later
            self.queryFormElements = data.form.elements;

            bizagi.loader.startAndThen("rendering").then(function () {
                var rendering = new bizagi.rendering.facade();
                rendering.execute(renderingParams).done(function (form) {
                    self.queryForm = rendering.form;
                    if (self.queryForm.properties && typeof (self.queryForm.properties.includeAllUsers) != "undefined") {
                        self.includeAllUsers = self.queryForm.properties.includeAllUsers;
                    }
                    $("#query-form", content).html(renderContainer);
                    self.handleEvents();
                    $("#query-form", content).show();
                    $("#query-form-result", content).hide();
                    $("#mainButtons", content).css("width", "100%");
                    $("#exportExcel", content).hide();
                    $("#graphicalAnalysis", content).hide();
                    $("#back-to-queryform", content).hide();
                    $("#save-queryform", content).hide();
                    if (self.params.queryFormAction == 'renderQueryForm') {

                        $("#query-form-admin-result", content).hide();
                        $("#copy-as-new-stored-queryform", content).hide();
                        $("#update-stored-queryform", content).hide();
                        $('#edit-stored-queryform', content).hide();
                    }
                    else if (self.params.queryFormAction == 'edit') {
                        var parentName = self.params.paramsStoredQuery.definition.parentQueryForm || self.params.paramsStoredQuery.definition.name;
                        $("#queryFormFieldsContainerName span", content).html(parentName);
                        $("#queryFormFieldsContainer", content).html(renderContainer);
                        $("#submit-for-search", content).hide();
                        $("#clear-queryform", content).hide();
                        $("#copy-as-new-stored-queryform", content).show();
                        $("#update-stored-queryform", content).show();
                        $('#edit-stored-queryform', content).hide();
                    }
                });
            });
        });
    },

    /*
    *  Buttons for query Form actions
    */
    handleEvents: function () {
        var self = this;
        var content = self.getContent();
        var pageResultsData = {};

        // PARAMS TO EXPORT EXCEL
        pageResultsData.I_PROCESSSTATE = "ALL";
        pageResultsData.h_idEnt = 10001;
        pageResultsData.h_idQueryForm = self.idQueryForm;

        $("#query-form-buttons", content).html($.tmpl(self.buttons, pageResultsData));
        $("#back-to-queryform", content).click(function (e) {
            if (self.params.queryFormAction == 'execute') {
                self.renderQueryForm();
            }
            else {
                $("#iframeGraphicalAnalysis", content).hide();
                $("#query-form-admin-result", content).hide();
                if (self.params.queryFormAction == 'saveQueryForm') {
                    self.params.queryFormAction = 'renderQueryForm';
                    $("#query-form-result", content).show();
                    $("#back-to-queryform", content).show();
                    $("#save-queryform", content).show();
                    $("#exportExcel", content).show();
                    $("#graphicalAnalysis", content).show();
                }
                else {
                    $("#query-form-result", content).hide();
                    $("#query-form", content).show();
                    $("#submit-for-search", content).attr("disabled", false).removeClass("ui-button-disabled");

                    var dialog = $(this).closest(".ui-dialog");
                    var dialogContent = dialog.length ? dialog.find(".ui-dialog-content") : [];

                    if (dialog.height() === dialogContent.height()) {
                        dialogContent.height(440);
                    }

                    if (self.originalHeight) {
                        content.parent().height(self.originalHeight);
                    }

                    $("#back-to-queryform", content).hide();
                    $("#submit-for-search", content).show();
                    $("#clear-queryform", content).show();
                    $("#save-queryform", content).hide();
                    $("#exportExcel", content).hide();
                    $("#graphicalAnalysis", content).hide();
                    if (self.params.queryFormAction == 'graphicalAnalysis') {
                        self.params.queryFormAction = 'submitQueryForm';
                        var request = {
                            "queryFormGuid": self.guidForm,
                            "numberOfRows": 10,
                            "pageNumber": 1,
                            "entityGuid": self.guidEntity,
                            "type": self.queryFormType,
                            "includeAllUsers": self.includeAllUsers,
                            "parameters": []
                        };
                        var searchParams = self.queryForm.getSearchParams(request);
                        self.submitQueryForm(searchParams);
                    }
                }
            }
            self.readyToSave = false;
        });
        $("#clear-queryform", content).click(function (e) {
            self.params.queryFormAction = 'renderQueryForm';
            self.renderQueryForm();
        });
        $("#submit-for-search", content).click(function (e) {
            //collects data in a structure to search Cases Data or Entity Data
            self.params.queryFormAction = 'submitQueryForm';
            var request = {
                "queryFormGuid": self.guidForm,
                "numberOfRows": 10,
                "pageNumber": 1,
                "entityGuid": self.guidEntity,
                "type": self.queryFormType,
                "includeAllUsers": self.includeAllUsers,
                "parameters": []
            };
            var searchParams = self.queryForm.getSearchParams(request);
            if (searchParams !== null) {
                self.disableButton($(this));
                self.submitQueryForm(searchParams);
            }            
        });
        $(".ui-bizagi-render-control-included", content).tooltip({ content: bizagi.localization.getResource("workportal-widget-query-form-included-tooltip") });

        $("#save-queryform", content).click(function (e) {
            if (self.readyToSave) {
                self.createStoredQueryForm();
            } else {
                self.showSaveResultsForm();
            }
            self.params.queryFormAction = 'saveQueryForm';
            $("#exportExcel", content).hide();
            $("#graphicalAnalysis", content).hide();
            $("#mainButtons", content).css("width", "100%");
        });

        $("#copy-as-new-stored-queryform", content).click(function (e) {
            // Open dialog with confirm message
            self.saveAs = true;
            $(self.dialogSaveAs).dialog({
                resizable: true,
                modal: true,
                title: self.getResource("workportal-widget-query-form-copy-as-new"),
                buttons: [
                    {
                        text: self.getResource("workportal-general-button-label-ok"),
                        click: function () {
                            if (self.createStoredQueryForm()) {
                                $(this).dialog("destroy");
                                bizagi.workportal.desktop.popup.closePopupInstance();
                            }
                        }
                    },
                    {
                        text: self.getResource("workportal-widget-queries-confirm-cancel"),
                        click: function () {
                            self.saveAs = false;
                            $(this).dialog("destroy");
                        }
                    }
                ]
            });
        });

        $("#update-stored-queryform", content).click(function (e) {
            var p_sessionId = bizagi.cookie("JSESSIONID");
            if (p_sessionId != null) {
                self.updateStoredQueryForm(); //JEE
            } else {//.net
                var confirmContentParams = {
                    resizable: true,
                    modal: true,
                    title: self.getResource("workportal-widget-query-form-update"),
                    buttons: []
                };
                confirmContentParams.buttons = [
                    {
                        text: self.getResource("confirmation-box-ok"),
                        click: function () {
                            self.updateStoredQueryForm();
                            $(this).dialog("close");
                            bizagi.workportal.desktop.popup.closePopupInstance();
                        }
                    },
                    {
                        text: self.getResource("workportal-widget-queries-confirm-cancel"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ];
                $("<div><span class='ui-icon ui-icon-alert'></span><span>" + self.getResource("workportal-widget-query-form-container-alert") + "</span></div>").dialog(confirmContentParams);
            }
        });

        $("#edit-stored-queryform", content).click(function (e) {
            self.publish("closeCurrentDialog");
            self.params.editQueryForm({ response: self.params.paramsStoredQuery.id, fromExec: true });
        });

        $(".biz-wp-form-queryForm-graphicalAnalysisLink", content).click(function (e) {
            self.params.queryFormAction = "graphicalAnalysis";
            var paramsStored;
            if (self.params.paramsStoredQuery.definition) {
                paramsStored = JSON.stringify(self.params.paramsStoredQuery.definition);
            } else {
                paramsStored = JSON.stringify({
                    name: "name",
                    description: "desc",
                    parameters: self.searchParams.parameters,
                    type: self.queryFormType,
                    entityGuid: self.guidEntity,
                    includeAllUsers: self.includeAllUsers,
                    parentQueryForm: self.queryForm.properties.displayName
                });
            }
            var guidForm = self.params.paramsStoredQuery.id ? self.params.paramsStoredQuery.guid : self.params.guidForm;
            var htmlGraphicalAnalysis = $.tmpl(self.graphicalAnalysisContainer, { h_guidQueryForm: guidForm, h_idStoredQuery: self.params.paramsStoredQuery.id, h_definition: paramsStored });
            $("#query-form-result", content).html(htmlGraphicalAnalysis);
            $("#exportExcel", content).hide();
            $("#graphicalAnalysis", content).hide();
            $("#mainButtons", content).show();
            $("#mainButtons", content).css("width", "99%");
            $("#save-queryform", content).hide();
            self.originalHeight = content.parent().height();
            content.parent().height("auto");
            $("#formGraphicalAnalysis").delay(800).submit();

            // adjust iframe height
            var iframe = $("#iframeGraphicalAnalysis");
            var dialog = iframe.length ? iframe.closest(".ui-dialog") : [];
            var dialogHeight = dialog.length ? dialog.height() : 0;
            if (dialogHeight > 550) {
                iframe.height(dialogHeight - 100);
            }

            dialog.on("dialogmaximize", calculateHeight);
            dialog.on("dialogunmaximize", calculateHeight);

            function calculateHeight() {
                var iframe = $("#iframeGraphicalAnalysis");
                var dialog = $(this);
                var dialogHeight = dialog.length ? dialog.height() : 0;
                if (dialogHeight > 550) {
                    iframe.height(dialogHeight - 100);
                } else {
                    iframe.height(400);
                    dialog.find(".ui-dialog-content").height("auto");
                }
            }
        });

        $(".biz-wp-form-queryForm-exportExcelLink", content).click(function (e) {
            var request = {
                "entityGuid": self.guidEntity,
                "type": self.queryFormType,
                "includeAllUsers": self.includeAllUsers,
                "parameters": []
            };

            request.parameters = JSON.parse(JSON.stringify(self.initialSearchParams.parameters));
            var requestForSearch = self.refactorParameters(request);
            var p_sessionId = bizagi.cookie("JSESSIONID");
            if (p_sessionId != null) {
                requestForSearch.p_sessionId = p_sessionId;
            }
            self.dataService.getQueryFormExportExcel(requestForSearch).done(function (resultList) { });
        });
    },

    disableButton: function (button) {
        var self = this, content = self.getContent();
        var included = $(".ui-bizagi-render-control-included:checked", content).size();
        var atLeastOneChecked = (included > 0);
        if ((self.queryFormType == self.queryFormTypes.ENTITY && self.atLeastOneChecked) || self.queryFormType == self.queryFormTypes.CASES) {
            button.attr("disabled", true).addClass("ui-button-disabled");
        }
    },

    enableButton: function (button) {
        button.removeAttr("disabled").removeClass("ui-button-disabled");
    },

    /*
     * Validation before submit
     */
    submitQueryForm: function (searchParams) {
        var self = this;
        var content = self.getContent();
        var included = $(".ui-bizagi-render-control-included:checked", content).size();
        self.atLeastOneChecked = (included > 0);
        if (searchParams !== null) {
            if ((self.queryFormType == self.queryFormTypes.ENTITY && self.atLeastOneChecked) || self.queryFormType == self.queryFormTypes.CASES) {
                self.initialSearchParams = JSON.parse(JSON.stringify(searchParams));
                self.findResults(content, searchParams);
            }
            else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-query-form-at-least-one-checked"), "Bizagi", "warning");
            }
        } 
    },

    /*
     * Find cases for App query Form
     */
    findResults: function (content, params, pageToShow) {
        var self = this;
        self.searchParams = JSON.parse(JSON.stringify(params));
        params = self.refactorParameters(params);
        params.pageNumber = pageToShow ? pageToShow : 1;
        if(bizagiConfig.groupByCaseNumber){
            params.group = "T_RADNUMBER";
        }
        self.dataService.getQueryFormResponse(params).done(function (resultList) {

            self.validateSecurityGraphicQuery(resultList);

            //clean old results
            $(".biz-wp-table").remove();
            $("#biz-wp-table-summary-wrapper").remove();

            //Keep in track the total Records
            self.totalRecords = resultList.records;

            //keep in track the total pages
            self.totalPages = resultList.total;

            if (resultList.rows.length > 0) {
                self.showSearchResultFrame(content, resultList, params);
                $("#query-form-buttons", content).show();
            } else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-query-form-no-records-found"), "Bizagi", "warning");
                self.enableButton($("#submit-for-search", self.getContent()));
                if (self.params.queryFormAction === "execute") {
                    self.params.queryFormAction = "edit";
                    self.modifiedPostRender();
                }
            }
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /**
     * Validate if show or not graphic query icon.
     * @param resultList
     */
    validateSecurityGraphicQuery: function (resultList){
        if(!bizagi.menuSecurity.GraphicQuery &&
            resultList.header && resultList.header.length &&
            resultList.header[resultList.header.length - 1].dataType === 0
        ){
            resultList.header.splice(-1,1); //Remove last item
            resultList.rows.forEach(function(row){
                row.splice(-1,1);
            });
        }
    },

    /*
    * Checks that all the header displayed names are the same shown in the form
    */
    checkDisplayedNames: function (resultList) {
        var self = this;

        //goes for each item and checks them one by one
        $.each(resultList.header, function (i, header) {

            //cheks if display name, it should get the display name from the form values
            if (header.xpath) {
                var foundDisplayName = self.getRenderElementDisplayByXpath(header.xpath,self.queryFormElements);
                //if it founds it, it sets the displayName
                if (foundDisplayName) {
                    if (self.initialSearchParams && self.initialSearchParams.parameters) {
                        for (var i = 0; i < self.initialSearchParams.parameters.length; i++) {
                            var searchParameter = self.initialSearchParams.parameters[i];
                            var storedQueryFormParameter = self.searchParams.parameters[i];
                            var fullParameterXpath = searchParameter.xpath + "." + searchParameter.displayXpath;
                            var storedDefinition = {};
                            if (self.params.paramsStoredQuery.definition) {
                                storedDefinition = self.params.paramsStoredQuery.definition.parameters[i];
                            }

                            if (searchParameter.xpath === header.xpath || fullParameterXpath === header.xpath) {
                                storedQueryFormParameter.displayHeader = foundDisplayName;
                                searchParameter.displayHeader = foundDisplayName;
                                storedDefinition.displayHeader = foundDisplayName;
                                break;
                            }
                        }
                    }

                    header.displayName = foundDisplayName;
                }
            }
        });

        return resultList;
    },
    /*
     *Gets the display name that the xpath provided should show in the results
     */
    getRenderElementDisplayByXpath: function (xpath,elements) {
        var self = this;
        if (elements && elements.length>0) {
            for (var i = 0, l = elements.length; i < l; i++) {
                var element = elements[i];
                if(typeof (element.render) !== 'undefined'){
                    var includePreference = typeof (element.render.properties.included) === 'undefined' || element.render.properties.included;
                    var elementXpath = element.render.properties.xpath;
                    var fullEelementXpath = element.render.properties.xpath + "." + element.render.properties.displayXpath;

                    if (includePreference && (elementXpath === xpath || fullEelementXpath === xpath)) {
                        return element.render.properties.displayName
                    }
                }else if(typeof (element.container) !== 'undefined'){
                    var result =  self.getRenderElementDisplayByXpath(xpath,element.container.elements);
                    if (result != undefined)
                        return result;
                }
            }
        }
    },

    refactorParameters: function (params) {
        var parameters = [];
        if (typeof (params.parameters) == "string") {
            params.parameters = JSON.parse(params.parameters);
        }
        $.each(params.parameters, function (i, item) {
            if (item.value != null && typeof (item.value) == "object" && typeof (item.value[0].id) != "undefined") {
                item.value = item.value[0].id;
            }
            parameters.push(item);
        });
        params.parameters = JSON.stringify(parameters);
        return params;
    },
    /*
    * Show search result frames
    */
    showSearchResultFrame: function (content, resultList, params) {
        var self = this;

        //goes for the result list and checks that the displayed names in the grid match with the rendered form
        resultList = self.checkDisplayedNames(resultList);

        var resultTemplate = $.tmpl(self.searchResult,
            {
                headers: resultList.header,
                rows: resultList.rows,
                sortedField: self.sortedField.xpath ? self.sortedField : null,
                records: resultList.records,
                groupByCaseNumber: bizagiConfig.groupByCaseNumber,
                securityGraphicQuery: bizagi.menuSecurity.GraphicQuery,
                resultList: resultList
            },
            {
                getRadNumberColumnIndex: function(){
                    var data = this.data;
                    var index = -1;
                    for(var i=0,l=data.headers.length; i<l;i++){
                        if (data.headers[i].fieldName == "radnumber") {
                            index = i;
                        }
                    }
                    return index;
                },
                showColumn:function(columnIndex) {
                    var index = this.getRadNumberColumnIndex();
                    return (this.data.groupByCaseNumber && index == columnIndex)? ' hidden ': "";
                },
                createGroupedHeader:function(rowIndex){
                    var data = this.data.resultList;
                    var result = false;
                    var radNumber = this.getRadNumber(data.rows[rowIndex]);
                    if(this.data.groupByCaseNumber){
                        if(rowIndex == 0 && radNumber != ""){
                            result = true;
                        }else{
                            var previousRadNumber = this.getRadNumber(data.rows[rowIndex-1]);
                            if(radNumber != previousRadNumber && radNumber != ""){
                                result = true;
                            }
                        }
                    }
                    return result;
                },
                getRadNumber:function(row){
                    var index = this.getRadNumberColumnIndex();
                    return (index >= 0)? row[index].radNumber : "";
                },
                formatValue: function(value, dataType){
                    return bizagi.util.formatValueByDataType(value, dataType);
                }
            });

        var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow;
        var summaryWrapper = $("#biz-wp-table-pager-wrapper", resultTemplate);
        var pagerData = {};
        var paginationHtml;

        // show or hide "load more" button
        pagerData.pagination = (self.totalPages > 1) ? true : false;
        pagerData.page = resultList.page;
        pagerData.pages = {};

        for (var i = 1; i <= pageToshow; i++) {
            pagerData.pages[i] = {
                "pageNumber": i
            };
        }

        //load and append the paginator to the result table
        paginationHtml = $.tmpl(self.paginationTmpl, pagerData).html();
        summaryWrapper.append(paginationHtml);

        $("#submit-for-search", content).hide();
        $("#clear-queryform", content).hide();
        $("#save-queryform", content).show();

        //checks if user has permissions to see the export button
        if (resultList.permissions && resultList.permissions.canExportData) {
            $("#exportExcel", content).show();
        }

        $("#mainButtons", content).css("width", "100%");
        $("#query-form", content).hide();
        $("#query-form-result", content).show();
        $("#query-form-result", content).html(resultTemplate);
        $("#back-to-queryform", content).show();

        //checks if user has permissions to see the graphical button
        if (resultList.permissions && resultList.permissions.canAnalizeData) {
            $("#graphicalAnalysis", content).show();
        }
        else {
            $("#graphicalAnalysis", content).hide();
        }

        if (self.params.queryFormAction == "execute") {
            $("#back-to-queryform", content).hide();
            $("#save-queryform", content).hide();
        }

        if (params.ownerQuery == false) {
            $("#edit-stored-queryform", content).hide();
        }

        //add data and behaviour to pager
        $("ul").bizagiPagination({
            maxElemShow: self.maxElemShow,
            totalPages: self.totalPages,
            actualPage: resultList.page,
            listElement: $("#biz-wp-table-pager-wrapper"),
            clickCallBack: function (options) {
                var target = $('.sortColumnsDataUpIcon, .sortColumnsDataDownIcon').parent().parent().last();

                if (target.length == 0) {
                    self.findResults(content, self.initialSearchParams, options.page);
                }

                else {
                    var paramXpath = target.data("xpath");
                    var orderType = null;
                    if (typeof self.sortedField.xpath != undefined && self.sortedField.xpath == paramXpath) {
                        orderType = self.sortedField.orderType
                    }
                    if (orderType == null || orderType == self.orderType.DESC) {
                        self.findSortedResults(content, paramXpath, self.orderType.DESC, options.page);
                    } else {
                        self.findSortedResults(content, paramXpath, self.orderType.ASC, options.page);
                    }
                }
            }
        });

        $(".cases-column-header", content).click(function (e) {
            var target = $(e.currentTarget);
            var paramXpath = target.data("xpath");
            var orderType = null;
            if (typeof self.sortedField.xpath != undefined && self.sortedField.xpath == paramXpath) {
                orderType = self.sortedField.orderType
            }
            if (orderType == null || orderType == self.orderType.DESC) {
                self.findSortedResults(content, paramXpath, self.orderType.ASC, params.pageNumber);
            } else {
                self.findSortedResults(content, paramXpath, self.orderType.DESC, params.pageNumber);
            }

        });

        // Add click event to case link
        $(".caseClicked", content).click(function () {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this)[0].getAttribute("data-idcase"),
                idWorkItem: $(this)[0].getAttribute("data-idworkitem"),
                idTask: $(this)[0].getAttribute("data-idtask"),
                idWorkflow: $(this)[0].getAttribute("data-idworkflow")
            });
            self.publish("closeCurrentDialog");
        });


        $(".ui-bizagi-wp-app-inbox-grouped", content).bind("click", function () {
            var idCase = $(this).find("#idCase").val();

            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: idCase
            });
            self.publish("closeCurrentDialog");
        });


        // Add click event to view workflow
        $(".biz-wp-diagram-view-icon", content).click(function () {
            var idCase = $(this).data("idcase");
            var idWorkflow = $(this).data('idworkflow');
            self.showGraphicQuery({ idCase: idCase, idWorkflow: idWorkflow });
        });
    },

    /**
     * Add class to format the number
     * */
    applyFomatNumbers: function(elementsDataType, resultTemplate, userLocalization){
        var self = this;
        var numberHeaders = $("th[data-type='" + elementsDataType + "']", resultTemplate);
        $.each(numberHeaders, function (i, item) {
            var index = item.getAttribute('data-index');
            $(".biz-wp-table tr", resultTemplate).find("td:eq(" + index + ")").find("span").addClass("formatMoney");
        });
        bizagi.util.formatInvariantNumber(resultTemplate, userLocalization);
    },

    /*
     * order by
     */
    findSortedResults: function (content, sortParameter, orderType, pageToShow) {
        var self = this;
        var sorted = false;
        var clonedParams = JSON.parse(JSON.stringify(self.initialSearchParams));
        if (clonedParams) {
            var newParameters = clonedParams.parameters;
            newParameters = $.type(newParameters) === "array" ? newParameters : JSON.parse(newParameters);
            if (newParameters.length > 0) {
                $.each(newParameters, function (i, item) {
                    var itemXpath = item.xpath;
                    if (itemXpath == sortParameter) {
                        item.orderType = orderType;
                        sorted = true;
                    }
                });
            }
            if (!sorted && sortParameter != "") {
                newParameters.push({
                    "value": null,
                    "included": true,
                    "xpath": sortParameter,
                    "searchType": "NONE",
                    "orderType": orderType
                });
            }
            self.sortedField = { "xpath": sortParameter, "orderType": orderType };
            clonedParams.parameters = newParameters;
            self.findResults(content, clonedParams, pageToShow);
        }
    },

    previousValues: function (previousValues) {
        var self = this;
        var content = self.getContent();
        $("#queryFormName", content).val(previousValues.definition.name);
        $("#queryFormDescription", content).val(previousValues.definition.description);
        self.selectedItemsToShare.users = (previousValues && previousValues.users) ? previousValues.users : [];
        self.selectedItemsToShare.groups = (previousValues && previousValues.groups) ? previousValues.groups : [];
    },

    /*
     *Collect parameters and save query form results
     */
    createStoredQueryForm: function () {
        var self = this;
        var content = self.getContent();
        var params = self.buildStoredQueryFormParams();
        if (params != null) {
            $.when(self.dataService.saveStoredQueryForm(params)
            ).done(function (response) {
                self.publish("closeCurrentDialog");
                self.readyToSave = false;
                self.params.queryFormAction = 'renderQueryForm';

                if ($("#queryFormShortcut").has("#modalMenuBtList").length == 0) {
                    $.when(self.workportalFacade.getWidget("queriesShortcut", {}))
                        .pipe(function (result) {
                            widget = result;
                            return widget.render();
                        }).done(function () {
                            var content = widget.getContent();
                            $("#queryFormShortcut").html(content);
                            self.params.executeQueryForm(response);
                        });
                }
                else {
                    self.params.executeQueryForm(response);
                }

            }).fail(function (error) {
                bizagi.log(error);
            });
            return true;
        }
        return false;
    },

    closeQueryForm : function(){
        //$($('.ui-dialog .ui-dialog-titlebar-close')[0]).click();
    },

    /*
    *Collect parameters and save query form results
    */
    updateStoredQueryForm: function () {
        var self = this;
        var content = self.getContent();
        var params = self.buildStoredQueryFormParams();
        if (params != null) {
            params.id = self.idQueryForm;
            $.when(self.dataService.updateStoredQueryForm(params)
            ).done(function (response) {
                self.readyToSave = false;
                self.params.queryFormAction = 'renderQueryForm';
                self.renderQueryForm();
                self.publish("refreshQueryFormShortCut");
            }).fail(function (error) {
                bizagi.log(error);
            });
            return true;
        }
        return false;
    },

    buildStoredQueryFormParams: function () {
        var self = this;
        var content = self.getContent();
        var storedQueryFormParameters = {};
        storedQueryFormParameters.users = JSON.stringify($.unique(self.selectedItemsToShare.users));
        storedQueryFormParameters.groups = JSON.stringify($.unique(self.selectedItemsToShare.groups));
        if (self.params.queryFormAction == 'edit') {
            var request = {
                "parameters": []
            };
            self.searchParams = self.queryForm.getSearchParams(request);
        }
        storedQueryFormParameters.guid = self.guidForm;
        var nameSaveAs = $("#queryFormNameSaveAs", self.dialogSaveAs).val();
        var nameSave = $("#queryFormName", content).val();

        if (self.saveAs && (nameSaveAs == null || nameSaveAs == "")) {
            var alert = $("#queryFormNameSaveAs").next(".ui-bizagi-input-icon-error");
            alert.show();
            alert.tooltip({ content: bizagi.localization.getResource("workportal-general-error-required") });
            return null;
        }
        if (!self.saveAs && (nameSave == null || nameSave == "")) {
            var alert = $("#queryFormName", content).next(".ui-bizagi-input-icon-error"); ;
            alert.show();
            alert.tooltip({ content: bizagi.localization.getResource("workportal-general-error-required") });
            return null;
        }

        if (self.queryForm.validateForm()) {
            storedQueryFormParameters.definition = JSON.stringify({
                name: nameSaveAs ? nameSaveAs : nameSave,
                description: ($("#queryFormDescriptionSaveAs", self.dialogSaveAs).val()) ? $("#queryFormDescriptionSaveAs", self.dialogSaveAs).val() : $("#queryFormDescription", content).val(),
                parameters: self.searchParams.parameters,
                type: self.queryFormType,
                entityGuid: self.guidEntity,
                includeAllUsers: self.includeAllUsers,
                parentQueryForm: self.queryForm.properties.displayName
            });
            return storedQueryFormParameters;
        }
    },

    /*
    * saveResults,  show the form to save the current query result
    */
    showSaveResultsForm: function () {
        var self = this;
        var content = self.getContent();
        self.readyToSave = true;
        var adminResult = $.tmpl(self.adminResult, {});

        $("#tab_share", adminResult).click(function (e) {
            self.initShareSelection();
            $("#query-form").hide();
        });
        $("#tab_definition", adminResult).click(function (e) {
            if (self.params.queryFormAction === "edit") {
                $("#query-form").show();
            }
        });
        $("input[type=radio][name=shareType]", adminResult).change(function () {
            if (this.value == 'users') {
                self.initShareSelection();
            }
            else if (this.value == 'groups') {
                $.when(self.searchGroupToShare())
                    .done(function () {
                        $("#userShare", self.shareSlection).hide();
                    })
            }
        });
        $("#query-form", content).hide();
        $("#query-form-result", content).hide();
        $("#query-form-admin-result", content).show();
        $("#query-form-admin-result", content).html(adminResult);
        $("#admin-stored-query-form-wrapper", content).tabs();
    },

    initShareSelection: function () {
        var self = this;
        var content = self.getContent();
        var shareSelection = $.tmpl(self.shareSelection, {});
        var users = self.selectedItemsToShare.users;
        $("#shareUsers", content).prop('checked', true);
        $("#search_user", shareSelection).click(function (e) {
            self.searchUserToShare();
        });
        $("#shareSelectionPanel", content).html(shareSelection);
        $("#move_left", content).click(function (e) {
            self.removeItem();
        });
        $("#move_right", content).click(function (e) {
            self.addItem();
        });
        if (users.length > 0) {
            self.searchSavedUser();
        }
    },

    searchUserToShare: function () {
        var self = this;
        var content = self.getContent();
        var filterData = {
            userName: $("#userName", content).val(),
            domain: $("#domain", content).val(),
            fullName: $("#fullName", content).val()
        };
        $.when(self.dataService.searchUsers(filterData)
        ).done(function (response) {
            var filteredUsers = [];
            $.each(response.users, function (index, item) {
                var dupIndex;
                if (item) {
                    dupIndex = $.inArray(item.idUser, self.selectedItemsToShare.users);
                    if (dupIndex < 0) {
                        filteredUsers.push(item);
                    }
                }
            });
            self.showDataToShare(filteredUsers, []);
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    searchSavedUser: function () {
        var self = this;
        var content = self.getContent();
        var shareType = $("input[type=radio][name=shareType]:checked", content).val();
        $.when(self.dataService.searchUsersByID(self.selectedItemsToShare.users)
        ).done(function (response) {
            $("#ListBoxResult", content).empty();
            self.addPrevious(response, shareType);
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    searchGroupToShare: function () {
        var self = this;
        var content = self.getContent();
        var params = { profileType: 11 };
        return self.dataService.searchProfiles(params)
            .pipe(function (groups) {
                var filteredGroups = [], groupsSelected = [];
                $.each(groups.response, function (index, item) {
                    var dupIndex;
                    if (item) {
                        dupIndex = $.inArray(item.id, self.selectedItemsToShare.groups);
                        if (dupIndex < 0) {
                            filteredGroups.push(item);
                        }
                        else {
                            groupsSelected.push(item);
                        }
                    }
                });
                self.showDataToShare(filteredGroups, groupsSelected);
            });
    },

    showDataToShare: function (items, itemSelected) {
        var self = this;
        var content = self.getContent();
        var shareType = $("input[type=radio][name=shareType]:checked", content).val();
        var selectData;
        if (shareType == "users") {
            selectData = $.tmpl(self.selectUser, { elementList: items });
        }
        else {
            selectData = $.tmpl(self.selectGroup, { elementList: items });

            $("#ListBoxResult", content).empty();
            if (itemSelected.length > 0) {
                self.addPrevious(itemSelected, shareType);
            }
        }

        $("#ListBoxSource", content).replaceWith(selectData);
    },

    addPrevious: function (items, shareType) {
        var self = this;
        var content = self.getContent();
        if (shareType == "users") {
            $.each(items.users, function (i, item) {
                $("#ListBoxResult", content).append(new Option(item.userName, item.idUser));
            });
        }
        else {
            $.each(items, function (i, item) {
                $("#ListBoxResult", content).append(new Option(item.displayName, item.id));
            });
        }
    },

    addItem: function () {
        var self = this;
        var content = self.getContent();
        var shareType = $("input[type=radio][name=shareType]:checked", content).val();
        var users = $("#ListBoxSource option:selected", content);

        $.each(users, function (i, item) {
            if ($.inArray(item.value, self.selectedItemsToShare) == -1) {
                //Persist user information
                self.selectedItemsToShare[shareType].push(item.value);
                $("#ListBoxSource option[value='" + item.value + "']", content).appendTo("#ListBoxResult"); //visual behavior
            } else {
                //remove only selected users
                $("#ListBoxSource option[value='" + item.value + "']", content).remove(); //visual behavior
            }
        });
        $("#ListBoxResult option:selected").prop("selected", false);
    },

    removeItem: function () {
        var self = this;
        var content = self.getContent();
        var shareType = $("input[type=radio][name=shareType]:checked", content).val();
        var users = $("#ListBoxResult option:selected", content);
        var auxUsers = $("#ListBoxSource option").toArray();
        var arrayUserValues = [];
        $.each(auxUsers, function (i, item) {
            arrayUserValues.push(item.value);
        });

        $.each(users, function (i, item) {
            var userId = item.value;
            if ($.inArray(userId, arrayUserValues) == -1) {
                $("#ListBoxResult option[value='" + userId + "']", content).appendTo("#ListBoxSource"); //visual behavior
            }
            else {
                $("#ListBoxResult option[value='" + userId + "']", content).remove(); //visual behavior
            }
            self.selectedItemsToShare[shareType].splice($.inArray(userId, self.selectedItemsToShare[shareType]), 1);
        });
        $("#ListBoxSource option:selected").prop("selected", false);
    },

    HTMLEncodeText: function (strText) {
        strNew = strText;

        strNew = strNew.replace("á", "&aacute;");
        strNew = strNew.replace("é", "&eacute;");
        strNew = strNew.replace("í", "&iacute;");
        strNew = strNew.replace("ó", "&oacute;");
        strNew = strNew.replace("ú", "&uacute;");
        strNew = strNew.replace("ñ", "&ntilde;");

        strNew = strNew.replace("Á", "&Aacute;");
        strNew = strNew.replace("É", "&Eacute;");
        strNew = strNew.replace("Í", "&Iacute;");
        strNew = strNew.replace("Ó", "&Oacute;");
        strNew = strNew.replace("Ú", "&Uacute;");
        strNew = strNew.replace("Ñ", "&Ntilde;");

        return strNew;
    },


    /*
    * *********************
    * aspx query forms
    * ********************
    */
    frankensteinPostRender: function () {
        var self = this;
        var content = self.getContent();
        var iframe = $("#queryFormIFrame", content);
        var css = "";
        var cssList = "";
        var injectCss = [".ui-bizagi-old-render*", "@font-face"];


        iframe.attr('frameborder', 0);

        if (typeof injectCss == "object") {
            $.each(injectCss, function (key, value) {
                css += bizagi.getStyle(value);
                cssList += value.replace(".", "") + " ";
            });
        } else {
            css += bizagi.getStyle(injectCss);
            cssList += injectCss.replace(".", "");
        }
        // Wait until the iframe has been loadedpip
        iframe.load(function () {
            // inject css
            var iframeContent = $(this).contents();
            var resetCSS = 'body, .ui-bizagi-old-render { overflow-y: visible;};';
            iframeContent.find('input[name="btnReturn"]').css('display', 'none');
            // Append css
            $('head', iframeContent).append("<style type='text/css'>" + css + resetCSS + "</style>");
            $('body', iframeContent).addClass(cssList.replace("*", ""));
            // Remove borders buttons
            $('body a.WPButton', iframeContent).parent().siblings().remove();
            var callBack = function (params) {
                // This script will execute inside the iframe context
                this.openBACase = function (idCase, sHref) {
                    var workitem = null, workflow = null;
                    if (sHref.indexOf("idWorkitem=") > -1) {
                        workitem = sHref.substring(sHref.indexOf("idWorkitem=") + 11);
                        workitem = workitem.substring(0, workitem.indexOf("&"));
                    }
                    if (sHref.indexOf("idWorkflow=") > -1) {
                        workflow = sHref.substring(sHref.indexOf("idWorkflow=") + 11);
                    }
                    // Executes thepw act on
                    params.controller.publish("executeAction", {
                        action: params.routingAction,
                        idCase: idCase,
                        idWorkItem: workitem,
                        idWorkflow: workflow,
                        referrer: 'queryform'
                    });

                    var lastQueryFullKey = document.getElementById('h_lastFullKey');
                    var lstCasesElement = document.getElementById('h_lstCases');
                    //bizagi.referrerParams = lastQueryFullKey.value;
                    // Lista de casos bizagi.lstIdCases
                    try {
                        params.controller.dataService.lastQueryFullKey = lastQueryFullKey.value;
                        params.bizagireference.referrerParams.referrer = 'queryform';
                        params.bizagireference.lstIdCases = lstCasesElement.value.split(',');
                        // close dialog
                    } catch (e) {
                    }
                    for (var i = 0; i < params.bizagireference.workportal.desktop.dialogStack.length; i++) {
                        params.controller.publish("closeCurrentDialog");
                    }
                };

                this.ShowCaseSumary = function (idCase) {
                    // Verify render version
                    var $ = params.$;
                    $.when(params.controller.dataService.getCaseFormsRenderVersion({ idCase: idCase })).done(function (version) {
                        if (version.formsRenderVersion == 1) {
                            params.controller.publish("showDialogWidget", {
                                widgetName: params.bizagireference.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                                widgetURL: params.controller.dataService.serviceLocator.getUrl("old-render") + "?idCase=" + idCase + "&isSummary=1",
                                modalParameters: {
                                    title: params.controller.resources.getResource("workportal-widget-navigation-summary-case")
                                },
                                afterLoad: params.callBack,
                                afterLoadParams: {
                                    routingAction: params.bizagireference.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                                    genericIframe: params.bizagireference.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                                    bizagi: params.bizagireference
                                }
                            });
                        } else {
                            // new version
                            /*var summary = params.bizagireference.workportal.widgets.search.prototype;
                            summary.caseSummaryTemplate = params.controller.workportalFacade.getTemplate("inbox-common-case-summary");
                            summary.dataService = params.controller.dataService;
                            try{
                            summary.showCase.apply(summary,[idCase]);
                            }catch(e){
                            }*/
                        }
                    });
                };
            };

            iframe.callInside(callBack, {
                controller: self,
                routingAction: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                bizagireference: bizagi,
                callBack: callBack,
                $: jQuery
            });
        });

    }
});
