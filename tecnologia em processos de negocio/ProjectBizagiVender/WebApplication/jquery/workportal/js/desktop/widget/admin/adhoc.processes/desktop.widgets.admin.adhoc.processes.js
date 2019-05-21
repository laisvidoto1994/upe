/**
 * Admin module to manage adhoc processes
 *
 * @author Jose Aranzazu
 */
adhoc.processes.admin.authorization.extend("bizagi.workportal.widgets.admin.adhoc.processes", {}, {
    /*
	 *   Returns the widget name
	 */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_PROCESSES;
    },

    init: function (workportalFacade, dataService, params) {

        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Pagination data
        self.filterData = {};
        self.maxRows = 8;
        self.maxPages = 10;
        self.$canvas = params.canvas;
        self.users = [];
        self.totalPages = 0;
        self.currentPage = 1;
        self.orderType = "ASC";
        self.orderField = "";
        self.tableHeaders = [
            { "displayName": self.getResource("workportal-widget-adhoc-process-table-name"), "fieldValue": "displayName" },
            { "displayName": self.getResource("workportal-widget-adhoc-process-table-creation-date"), "fieldValue": "displayCreationDate" },
            { "displayName": self.getResource("workportal-widget-adhoc-process-table-state"), "fieldValue": "state" }
        ];

        self.adhocProcessLinks = [
            {
                name: "edition",
                label: bizagi.localization.getResource("bz-rp-components-dimension-edit"),
                icon: "bz-icon-cog-outline",
                alwaysShow: true
            },
            {
                name: "workflow",
                label: bizagi.localization.getResource("workportal-widget-admin-alarms-task-table-title-workflow"),
                icon: "bz-icon-diagram-outline",
                alwaysShow: true
            },
            {
                name: "clone",
                label: bizagi.localization.getResource("workportal-adhoc-process-clone-button"),                
                icon: "bz-icon-window-create-outline",
                alwaysShow: false
            },
            {
                name: "delete",
                label: bizagi.localization.getResource("bz-rp-components-dimension-delete"),
                icon: "bz-icon-trash",
                alwaysShow: false
            },
            {
                name: "auth",
                label: bizagi.localization.getResource("workportal-adhoc-process-authorization-button"),
                icon: "bz-icon-authentication-outline",
                alwaysShow: false
            }
        ];    

        self.stateList = [
            { id: "", displayName: "----------------" },
            { id: "Draft", displayName: "Draft" },
            { id: "Pilot", displayName: "Pilot" },
            { id: "Published", displayName: "Published" }
        ];

        self.allowCreation = true;        

        self.adhocProcesses = [];              

        //Load templates
        self.loadTemplates({
            "admin.adhoc.processes": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes"),
            "admin.adhoc.processes.formbuttons": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes-formbuttons"),
            "admin.adhoc.processes.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes-wrapper"),
            "admin.adhoc.processes.query.form": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes-query-form"),            
            "admin.adhoc.processes.table": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes-table"),
            "admin.adhoc.processes.message": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes-message"),
            "admin.adhoc.processes.create.popup": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#adhoc-process-popup-template"),
            "admin.adhoc.processes.edit.popup": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#ui-bizagi-workportal-widget-admin-adhoc-processes-edit-form"),
            useNewEngine: false
        });
    },    

    /*
	 *   Renders the content for the current controller
	 */
    renderContent: function () {
        var self = this;
        var tmpl = self.getTemplate("admin.adhoc.processes");
        self.content = $.tmpl(tmpl);
        return self.content;
    },

    postRender: function () {
        var self = this;

        self.dateFormat = self.getResource("dateFormat") + " " + self.getResource("timeFormat");
        self.$adhocProcessTable = $("#bz-wp-widget-admin-adhoc-process-table", self.content);
        self.$processModelerCanvas = $("#bz-wp-widget-admin-adhoc-process-renderform", self.content);
        self.$formModelerCanvas = $("#bz-wp-widget-admin-adhoc-process-form-modeler", self.content);
        self.$buttonsContainer = $("#bz-wp-widget-admin-adhoc-process-buttonset", self.content);        

        $.when(self.dataService.getAllCategories()).done(function (rps) {
            self.catList = $.parseJSON(rps);
            self.catList.unshift({ categoryName: "----------------", guidCategory: "" });
            self.renderQueryForm();
        }).fail(function (error) {
            bizagi.log(error);
        });        

        //add event handlers
        self.addEventsHandler();
    },

    /**
     * Render user table
     */
    renderQueryForm: function () {
        var self = this;
        var queryFormTemplate = $.tmpl(self.getTemplate("admin.adhoc.processes.query.form"), { catList: self.catList.length });
        var wrapperFormFormTemplate = $.tmpl(self.getTemplate("admin.adhoc.processes.wrapper"), {});
        $("#biz-wp-admin-adhoc-processes-wrapperform", wrapperFormFormTemplate).html(queryFormTemplate);
        $("#bz-wp-widget-admin-adhoc-process-table", self.content).html(wrapperFormFormTemplate);            
        self.setupPredefinedCombo(queryFormTemplate.find("#biz-wp-admin-adhoc-processes-state"), self.stateList, self.stateList[0]);
        self.setupCatCombo(queryFormTemplate.find("#biz-wp-admin-adhoc-processes-cat"), self.catList, self.catList[0]);   
        self.setupFormEventsHandler();
        self.renderButtons("query");      
    },

    /**
     * Events Handlers
     */
    addEventsHandler: function () {
        var self = this;

        self.$adhocProcessTable.on("click", "#bz-wp-widget-admin-adhocprocess-createbutton-wrapper", function () {
            self.adhocProcessData = {};            
            self.showPopupCreateProcess();
        });

        var $btnBack = $("#bz-wp-widget-admin-adhoc-process-buttonset", self.content);
        $btnBack.on("click", "button", function () {
            if(self.workflowView.formModeler && self.workflowView.formModeler.editor && self.workflowView.formModeler.editor.controller.thereAreChangesInForm()){
                $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("confirmation-savebox-message2"), "", "info")).done(function () {
                    self.returnToContainer($("button", $btnBack).data("backto"));
                });
            }
            else{
                self.returnToContainer($(this).data("backto"));
            }
        });       

    },

    setupFormEventsHandler: function () {
        var self = this;            
        var $adhocProcessForm = $("#biz-wp-admin-adhoc-processes-wrapperform form", self.content);

        $adhocProcessForm.on("submit", function (e) {

            e.preventDefault();

            self.currentPage = 1;
            self.orderType = "DES";
            self.orderField = "displayCreationDate";

            self.filterData = {
                filter: {},
                pag: self.currentPage,
                pagSize: self.maxRows,
                orderField: self.orderField,
                orderType: self.orderType
            };

            if (this.elements[0].value.length > 0) self.filterData.filter.displayName = this.elements[0].value;
            if ($(this.elements[1]).data('value') != "") self.filterData.filter.state = $(this.elements[1]).data('value');
            if ($(this.elements[2]).data('value') != "") self.filterData.filter.category = $(this.elements[2]).data('value');

            self.getAdhocProcessTableData();

        });

        $adhocProcessForm.on("reset", function (event) {
            event.preventDefault();
            this.elements[0].value = "";
            $(this.elements[1]).data("value", "").val("----------------");
            $(this.elements[2]).data("value", "").val("----------------");
            $("#biz-wp-admin-adhoc-processes-wrapperlist", self.content).empty();
        });

    },

    /*
    * Get adhoc processes table data
    */
    getAdhocProcessTableData: function (args) {
        var self = this;

        var params = args || {};
        self.orderType = params.orderType || self.orderType;
        self.orderField = params.orderField || self.orderField;

        $.when(self.dataService.getAdhocProcessesList($.extend(self.filterData, params))).done(function (data) {

            self.adhocProcesses = data.adhocProcesses;
            self.totalPages = data.total;

            self.showAdhocProcessesTable();
            self.setAdhocProcessActions();

        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    showAdhocProcessesTable: function () {

        var self = this;
        var $wrapperList = $("#biz-wp-admin-adhoc-processes-wrapperlist", self.content);

        $wrapperList.empty();

        if (self.adhocProcesses.length > 0) {

            var pagination = (self.totalPages > 1);
            var pagesArray = self.getPagesArray();

            var links = self.adhocProcessLinks && Object.prototype.toString.apply(self.adhocProcessLinks) === "[object Array]" ? self.adhocProcessLinks : [self.adhocProcessLinks];

            var adhocProcessTableTmpl = $.tmpl(self.getTemplate("admin.adhoc.processes.table"), { adhocProcesses: self.adhocProcesses, headers: self.tableHeaders, links: links, page: self.currentPage, pagination: pagination, pagesArray: pagesArray, orderField: self.orderField, orderType: self.orderType });
            $wrapperList.html(adhocProcessTableTmpl);

            self.setUpPagination();
            self.setUpSortColumnLinks();
        } else {
            var msg = bizagi.localization.getResource("workportal-widget-usertable-empty");
            $wrapperList.html($.tmpl(self.usersTableMessage, { message: msg }));
        }
    },

    /*
    * Get Pages
    */
    getPagesArray: function () {

        var self = this;
        var pagesToShow = (self.maxPages > self.totalPages) ? self.totalPages : self.maxPages;
        var aux = [];

        for (var a = 0; a < pagesToShow; a++) {
            aux.push(a + 1);
        }

        return aux;
    },

    /*
    * Set pagination
    */
    setUpPagination: function () {
        var self = this;
        var $pager = $("#biz-wp-admin-adhoc-processes-pager ul", self.content);

        $pager.bizagiPagination({
            maxElemShow: self.maxRows,
            totalPages: self.totalPages,
            actualPage: self.currentPage,
            listElement: $pager,
            clickCallBack: function (options) {
                self.filterData.pag = self.currentPage = parseInt(options.page);
                self.getAdhocProcessTableData();
            }
        });

    },

    /*
    * assign click event to each column to order
    */
    setUpSortColumnLinks: function () {
        var self = this;

        $(".biz-wp-table-head th", self.content).click(function () {

            var orderField = $(this).data("orderfield");
            var orderType = $(this).data("ordertype");

            self.getAdhocProcessTableData({ "orderType": orderType, "orderField": orderField });
            self.setAdhocProcessActions();
        });

    },

    setAdhocProcessActions: function () {
        var self = this;

        $(".bizagi-wp-admin-adhoc-processes-link", self.content).click(function (e) {            
            var idSelectedProcess = this.id;

            if (!self.currentProcess || self.currentProcess.id != idSelectedProcess) {
                self.currentProcess = self.adhocProcesses.filter(function (process) {
                    return process.id === idSelectedProcess;
                })[0];
            }

            switch ($(this).data("linkname")) {
                case "edition": self.showPopupEditAdhocProcess();
                    break;
                case "delete": self.deleteAdhocProcess();
                    break;
                case "workflow": self.renderAdhocProcessEditor();
                    break;
                case "clone": self.cloneAdhocProcess();
                    break;
                case "auth": self.showPopupAuthAdhocProcess();                    
                    break;
            }
        });
    },

    /**
     * Return to adhoc process table to query processes
     */
    returnToContainer: function (container) {
        var self = this;
        self.toggleForm(container);                
    },

    /**
     * Remove Buttons
     */
    removeButtons: function () {
        var self = this;
        self.$buttonsContainer.empty();
    },

    /**
     * Render form button
     */
    renderButtons: function (type, backTo) {
        var self = this;
        var tmpl = self.getTemplate("admin.adhoc.processes.formbuttons");
        var $button = $.tmpl(tmpl, { type: type, allowCreation: self.allowCreation, backTo: backTo });

        if (type === "query") {
            $("#bz-wp-widget-admin-adhoc-process-table #admin-adhoc-processes-table-buttonset", self.content).append($button);
        }
        else {
            self.$buttonsContainer.html($button);
        }
    },

    /**
     * Change form display
     */
    toggleForm: function (display) {
        var self = this;
        self.removeButtons();
        switch (display) {
            case "table":
                self.getAdhocProcessTableData();
                self.$adhocProcessTable.show();
                self.$processModelerCanvas.hide();
                self.$processModelerCanvas.empty();
                self.$formModelerCanvas.hide();                
                self.currentProcess = null;
                break;
            case "form":
                self.$adhocProcessTable.hide();                
                self.$formModelerCanvas.hide();                
                self.$processModelerCanvas.show();
                self.renderButtons("back", "table");
                break;
            case "modeler":
                self.$adhocProcessTable.hide();
                self.$processModelerCanvas.hide();
                self.$formModelerCanvas.show();
                self.renderButtons("back", "form");
                break;
        }
    },

    /**
     * Render Adhoc Process form
     */
    renderAdhocProcessEditor: function () {
        var self = this;
        self.$processModelerCanvas.empty();

        self.workflowView = new adhoc.processes.workflow(self.workportalFacade, self.dataService, { adhocProcessInfo: self.currentProcess, formModelerCanvas: self.$formModelerCanvas });
        self.workflowView.render(self.$processModelerCanvas);

        self.subscribe("refreshAdhocProcessesCanvas", function (e, params) {
            self.toggleForm(params.canvasName);
        });

        self.toggleForm("form");        
    },

    deleteAdhocProcess: function () {
        var self = this;        
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-adhoc-process-delete-confirmation"), "", "info")).done(function () {
            $.when(self.dataService.deleteAdhocProcess(self.currentProcess.id)).done(function () {
                self.currentProcess = null;
                self.getAdhocProcessTableData();
            });
        });
    },

    cloneAdhocProcess: function () {
        var self = this;

        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-adhoc-process-clone-confirmation"), "", "info")).done(function () {        
            $.when(self.dataService.cloneAdhocProcess(self.currentProcess)).done(function () {                
                self.getAdhocProcessTableData();
            });
        });      
    },

    setupPredefinedCombo: function (element, data, initValue) {
        element.uicombo({
            data: { combo: data },
            initValue: initValue,
            itemValue: function (item) {
                return item.id;
            },
            itemText: function (item) {
                return item.displayName;
            },
            onChange: function (obj) {
                var value = obj.ui.data('value');
                element.val(value);
            }
        });
    },

    setupCatCombo: function (element, data, initValue) {                
        element.uicombo({
            data: { combo: data },
            initValue: initValue,
            itemValue: function (item) {
                return item.guidCategory;                
            },
            itemText: function (item) {
                return item.categoryName;                
            },
            onChange: function (obj) {
                var value = obj.ui.data('value');
                element.val(value);
            }
        });        
    },

    showPopupCreateProcess: function () {
        var self = this, template = self.getTemplate("admin.adhoc.processes.create.popup");
        var createProcessPopup = {};
        createProcessPopup.formContent = $.tmpl(template);
        createProcessPopup.elements = {
            inputName: $("#input-name-adhoc-process", createProcessPopup.formContent),
            buttonSave: $("#button-accept-create-adhoc-process", createProcessPopup.formContent),
            buttonCancel: $("#button-cancel-create-adhoc-process", createProcessPopup.formContent)
        };
        createProcessPopup.elements.buttonSave.on("click", $.proxy(self.onCreateProcess, self, createProcessPopup));
        createProcessPopup.elements.buttonCancel.on("click", $.proxy(self.closeDialogBox, self, createProcessPopup.formContent));
               
        createProcessPopup.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "600px",
            modal: true,
            title: bizagi.localization.getResource("workportal-adhoc-process-create-popup-title"),
            maximize: false,
            close: function () {
                createProcessPopup.formContent.dialog("destroy");
                createProcessPopup.formContent.detach();
            }
        });
    },

    showPopupEditAdhocProcess: function () {
        var self = this, template = self.getTemplate("admin.adhoc.processes.edit.popup");
        var editProcessPopup = {};
        editProcessPopup.formContent = $.tmpl(template);
        editProcessPopup.elements = {
            inputName: $("#input-name-adhoc-process", editProcessPopup.formContent),
            inputDesc: $("#input-desc-adhoc-process", editProcessPopup.formContent),
            inputCat: $("#input-cat-adhoc-process", editProcessPopup.formContent),
            inputState: $("#input-state-adhoc-process", editProcessPopup.formContent),
            inputAlarms: $("#input-alarms-adhoc-process", editProcessPopup.formContent),
            inputCaseNumber: $("#input-case-number-adhoc-process", editProcessPopup.formContent),
            inputCaseNumberPreffix: $("#input-case-number-preffix", editProcessPopup.formContent),
            inputCaseNumberSuffix: $("#input-case-number-suffix", editProcessPopup.formContent),
            validator: $("#input-case-number-validator", editProcessPopup.formContent),
            buttonSave: $("#button-accept-edit-adhoc-process", editProcessPopup.formContent),
            buttonCancel: $("#button-cancel-edit-adhoc-process", editProcessPopup.formContent)
        };
        editProcessPopup.elements.buttonSave.on("click", $.proxy(self.onEditAdhocProcess, self, editProcessPopup));
        editProcessPopup.elements.buttonCancel.on("click", $.proxy(self.closeDialogBox, self, editProcessPopup.formContent));

        editProcessPopup.elements.inputCaseNumber.change(function () {
            $('.case-number-container', editProcessPopup.formContent).toggle(this.checked);
        }).change();

        editProcessPopup.elements.inputCat.html('');

        var initValue = self.catList[0];
        if (self.currentProcess.category && self.currentProcess.category != null) {
            initValue = self.catList.filter(function (cat) {
                return cat.guidCategory === self.currentProcess.category;
            })[0];
        }
        
        self.setupCatCombo(editProcessPopup.elements.inputCat, self.catList, initValue);

        editProcessPopup.elements.inputName.val(self.currentProcess.displayName);
        editProcessPopup.elements.inputDesc.val(self.currentProcess.description);
        editProcessPopup.elements.inputCat.val(self.currentProcess.category);
        editProcessPopup.elements.inputState.html(self.currentProcess.state);
        if (self.currentProcess.enableAlarms) editProcessPopup.elements.inputAlarms.attr('checked', true);
        if (self.currentProcess.enableCustomizedCaseNumber) {
            editProcessPopup.elements.inputCaseNumber.attr('checked', true);
            editProcessPopup.elements.inputCaseNumberPreffix.val(self.currentProcess.caseNumberSequence.prefix);
            editProcessPopup.elements.inputCaseNumberSuffix.val(self.currentProcess.caseNumberSequence.suffix);
            $('.case-number-container', editProcessPopup.formContent).show();
        } else {
            $('.case-number-container', editProcessPopup.formContent).hide();
        }

        editProcessPopup.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "600px",
            modal: true,
            title: bizagi.localization.getResource("workportal-adhoc-process-popup-title"),
            maximize: false,
            close: function () {
                editProcessPopup.formContent.dialog("destroy");
                editProcessPopup.formContent.detach();
            }
        });
    },

    showPopupAuthAdhocProcess: function () {
        var self = this, template = self.getTemplate("adhoc.processes.authorization.editor.popup");

        var formContent = $.tmpl(template, {});

        if (self.currentProcess.authorization == null || !self.currentProcess.authorization[0].allowTo) {
            self.currentProcess.authorization = [{ id: Math.guid(), allowTo: [] }];
        }

        self.renderAuthorizationItems($("#authorizationItems", formContent), self.currentProcess.id, self.currentProcess.authorization[0], false);

        this.unsubscribe("refreshAuthItems");
        this.subscribe("refreshAuthItems", function (e, params) {
            $("#authorizationItems", formContent).empty();
            self.currentProcess.authorization[0] = params.auth;
            self.renderAuthorizationItems($("#authorizationItems", formContent), self.currentProcess.id, params.auth, false);
        });

        formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "615px",
            modal: true,
            title: bizagi.localization.getResource("workportal-adhoc-process-auth-popup-title"),
            maximize: false,
            close: $.proxy(self.closeDialogBox, self, formContent)
        });
    },

    onCreateProcess: function (dialogBox, event) {
        event.preventDefault();
        var self = this;
        if (self.validateParams(dialogBox)) {
            var paramsNewProcess = {                
                id: Math.guid(),
                displayName: dialogBox.elements.inputName.val(),
                state: "Draft",                                
                activities: []
            };
            $.when(self.dataService.createAdhocProcess(paramsNewProcess)).done(function (data) {
                self.currentProcess = data;
                self.adhocProcesses.push(data);
                self.closeDialogBox(dialogBox.formContent);
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-created"), ""));
                self.renderAdhocProcessEditor(paramsNewProcess.id);
            }).fail(function (error) {
                bizagi.log(error);
            });           
        }
    },

    onEditAdhocProcess: function (dialogBox, event) {
        event.preventDefault();
        var self = this;
        if (self.validateParams(dialogBox)) {
            self.currentProcess.displayName = dialogBox.elements.inputName.val();
            self.currentProcess.description = dialogBox.elements.inputDesc.val();
            self.currentProcess.category = dialogBox.elements.inputCat.val();
            self.currentProcess.enableAlarms = dialogBox.elements.inputAlarms.is(":checked");
            if (dialogBox.elements.inputCaseNumber.is(":checked")) {
                self.currentProcess.enableCustomizedCaseNumber = true;
                if (self.currentProcess.caseNumberSequence != null) {
                    self.currentProcess.caseNumberSequence.prefix = dialogBox.elements.inputCaseNumberPreffix.val();
                    self.currentProcess.caseNumberSequence.suffix = dialogBox.elements.inputCaseNumberSuffix.val();
                } else {
                    self.currentProcess.caseNumberId = Math.guid();
                    self.currentProcess.caseNumberSequence = {
                        id: self.currentProcess.caseNumberId,
                        prefix: dialogBox.elements.inputCaseNumberPreffix.val(),
                        suffix: dialogBox.elements.inputCaseNumberSuffix.val()
                    };
                }
            } else {
                self.currentProcess.enableCustomizedCaseNumber = false;
            }
            $.when(self.dataService.updateAdhocProcess(self.currentProcess)).done(function () {
                self.closeDialogBox(dialogBox.formContent);
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-saved"), ""));
                self.getAdhocProcessTableData();                
            }).fail(function (error) {
                bizagi.log(error);
            });
        }
    },

    validateParams: function (dialogBox) {
        var self = this;
        var isValidForm = true;
        var name = dialogBox.elements.inputName;
        if (name.val() && name.val() !== "") {
            isValidForm = true;
        } else {
            var nameValidation = bizagi.localization.getResource("workportal-general-error-field-required");
            nameValidation = nameValidation.replace("{0}", "Name");
            name.next().find("span").html(nameValidation);
            isValidForm = false;
        }
        if (dialogBox.elements.inputCaseNumber && dialogBox.elements.inputCaseNumber.is(":checked")) {
            if (dialogBox.elements.inputCaseNumberPreffix.val() !== "" || dialogBox.elements.inputCaseNumberSuffix.val() !== "") {
                isValidForm = true;
            } else {
                var caseNumberValidation = bizagi.localization.getResource("workportal-general-error-field-required");
                caseNumberValidation = nameValidation.replace("{0}", "Preffix/Suffix");                
                dialogBox.elements.validator.find("span").html(caseNumberValidation);
                isValidForm = false;
            }
        }
        return isValidForm;
    },

    dispose: function () {
        var self = this;
        if (bizagi.rendering) {
            // Unbind resize handlers
            $(window).unbind("resize.windowPanel");
            $(window).unbind("resize.rendering");

            self.restoreMethod('container', 'postRenderContainer');
            self.restoreMethod('group', 'postRenderContainer');
            self.restoreMethod('contentPanel', 'postRenderContainer');
            self.restoreMethod('tab', 'postRenderContainer');
            self.restoreMethod('form', 'postRenderContainer');

            self.restoreMethod('render', 'postRenderElement');
            self.restoreMethod('search', 'postRender');
            self.restoreMethod('imageNoFlash', 'postRender');
            self.restoreMethod('collectionnavigator', 'postRender');
        }
        if (self.workflowView) self.workflowView.dispose();
        self._super();
    },

    restoreMethod: function (clazz, method, useBackup) {
        var self = this;
        if (bizagi.rendering.form.editorInstance) {
            bizagi.rendering[clazz].prototype[method] = function () {
                if (useBackup) {
                    return bizagi.rendering[clazz].editorInstance[method].apply(this, arguments);
                } else {
                    return bizagi.rendering[clazz].original[method].apply(this, arguments);
                }
            };
        }
    }        

});