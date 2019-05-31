adhoc.processes.admin.authorization.extend("adhoc.processes.workflow", {}, {

    init: function (workportalFacade, dataService, params) {

        var self = this;          

        // Call base
        self._super(workportalFacade, dataService, params);

        // Load Templates
        self.loadTemplates({
            "adhoc.processes.workflow": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#adhoc-process-tasks"),            
            useNewEngine: false
        });
    },

    render: function (canvas) {
        var self = this;
        if (canvas) {
            self.container = canvas;
        } else {
            self.container.empty();
        }
        var tmpl = self.getTemplate("adhoc.processes.workflow");
        var content = self.content = $.tmpl(tmpl, self.params.adhocProcessInfo);
        content.appendTo(self.container);

        self.postRender();
    },

    postRender: function () {
        var self = this;
        // Add handlers
        if (self.params.adhocProcessInfo.state === "Draft") {
            $("#to-pilot-process", self.content).on("click", $.proxy(self.onClickPilotAdhocProcess, self));
        } else if (self.params.adhocProcessInfo.state === "Pilot") {
            $("#to-publish-process", self.content).on("click", $.proxy(self.onClickPublishAdhocProcess, self));
        }

        $("#summary-form", self.content).on("click", $.proxy(self.onClickShowSummaryForm, self));
        
        self.renderAdhocProcessModeler();        
    },

    renderAdhocProcessModeler: function () {
        var self = this;
        var canvas = $(".adhoc-process-task-list", self.content);
        canvas.empty();

        var modeler = new bizagi.bpmn.modeler.viewer();
        modeler.render(canvas);
        modeler.subscribe("bpm.modeler.externalOption", function (ev, params) {
            if (params.option == "form") {
                self.renderFormModeler(params.task);
            } else if (params.option == "assignee") {
                self.showPopupAssignments(params.task);
            } else if (params.option == "rule") {
                self.showPopupEditBooleanExpression(params.source, params.target)
            }
        });

        modeler.subscribe("bpm.modeler.changed", function (ev, params) {
            self.saveDiagram("", true);
        });

        if (self.params.adhocProcessInfo.diagramId && self.params.adhocProcessInfo.diagramId != null) {
            $.when(self.dataService.getAdhocProcessDiagram(self.params.adhocProcessInfo.id, self.params.adhocProcessInfo.diagramId)).done(function (data) {
                modeler.load(data);                                
            }).fail(function (error) {
                bizagi.log(error);
            });
        }

        self.processModeler = modeler;
    },

    renderFormModeler: function (idTask, isAdhocSummaryForm) {
        var self = this;
        self.params.formModelerCanvas.empty();
        self.formModeler = new adhoc.processes.formmodeler({ idProcess: self.params.adhocProcessInfo.id, idTask: idTask, isAdhocSummaryForm: isAdhocSummaryForm });
        self.formModeler.render(self.params.formModelerCanvas);
    },    

    showPopupAssignments: function (idSelectedTask) {
        var self = this, template = self.getTemplate("adhoc.processes.authorization.editor.popup");        

        $.when(self.dataService.getAdhocTask(self.params.adhocProcessInfo.id, idSelectedTask)).done(function (adhocTask) {
            var popupContent = $.tmpl(template, { isAdhocTask: true });
            if (adhocTask.assignee == null || adhocTask.assignee.length == 0 || !adhocTask.assignee[0].allowTo) {
                adhocTask.assignee = [{ id: Math.guid(), allowTo: [], parentId: idSelectedTask }];
            } else {
                adhocTask.assignee[0].parentId = idSelectedTask;                
            }

            var assignmentTypeElement = $('input[type=radio][name=assignmentType]', popupContent);
            $("input[type=radio][name=assignmentType][value=" + adhocTask.assignmentType + "]", popupContent).attr('checked', 'checked');
            assignmentTypeElement.on('change', function () {
                self.onSaveAssignmentType($(this).val(), adhocTask);
            });

            self.renderAuthorizationItems($("#authorizationItems", popupContent), self.params.adhocProcessInfo.id, adhocTask.assignee[0], true);

            self.unsubscribe("refreshAuthItems");
            self.subscribe("refreshAuthItems", function (e, params) {
                $("#authorizationItems", popupContent).empty();
                self.renderAuthorizationItems($("#authorizationItems", popupContent), self.params.adhocProcessInfo.id, params.auth, true);
            });

            popupContent.dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: "615px",
                modal: true,
                title: bizagi.localization.getResource("workportal-adhoc-process-assignment-popup-title"),                
                maximize: false,
                close: $.proxy(self.closeDialogBox, self, popupContent)
            });
        })
        .fail(function (error) {
            bizagi.log(error);
        });                
    },

    showPopupEditBooleanExpression: function (idTask, idSuccessor) {
        var self = this;

        $.when(self.dataService.getAdhocTask(self.params.adhocProcessInfo.id, idTask)).done(function (adhocTask) {

            var currentSuccessor = adhocTask.successors.filter(function (item) {
                return item.taskGuid === idSuccessor;
            })[0];

            var widgetParameters = {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_BOOLEAN_EXP,
                data: { booleanExp: currentSuccessor.expression, adhocProcessId: self.params.adhocProcessInfo.id },
                closeVisible: false,
                modalParameters: {
                    resizable: false,
                    title: self.getResource("workportal-adhoc-process-boolean-exp-popup-title"),
                    id: "AdhocBooleanExpAdmin",
                    width: "790px",
                    height: "auto"
                },
                buttons: [
                    {
                        text: self.getResource("text-save"),
                        click: function () {
                            var that = this;
                            var widget = $(this).dialog("option", "widget");
                            var booleanExp = widget.booleanExp || {};
                            if (booleanExp.conditions != null && booleanExp.conditions.count() > 0) {
                                currentSuccessor.expression = booleanExp;
                            } else {
                                currentSuccessor.expression = null;
                            }
                            $.when(self.dataService.updateAdhocTask({ idProcess: self.params.adhocProcessInfo.id, task: adhocTask })).done(function () {
                                widget.dispose();
                                $(that).dialog('close');
                                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-boolean-exp-saved"), ""));
                                self.processModeler.setConnectionExpression(idTask, idSuccessor);
                            }).fail(function (error) {
                                bizagi.log(error);
                            });                            
                        }
                    },
                    {
                        text: self.getResource("text-cancel"),
                        click: function () {
                            var that = this;
                            var widget = $(this).dialog("option", "widget");
                            widget.dispose();
                            $(that).dialog('close');
                        }
                    }
                ]
            };
            self.publish("showDialogWidget", widgetParameters);
        })
        .fail(function (error) {
            bizagi.log(error);
        });
    },

    onSaveAssignmentType: function (type, adhocTask) {
        var self = this;
        adhocTask.assignmentType = type;
        $.when(self.dataService.updateAdhocTask({ idProcess: self.params.adhocProcessInfo.id, task: adhocTask })).fail(function (error) {
            bizagi.log(error);
        });
    },

    onClickShowSummaryForm: function (event) {
        event.preventDefault();
        var self = this;
        self.renderFormModeler(null, true);
    },

    transform: function (elementsDiagram) {
        var elements = [];
        for (obj in elementsDiagram.tasks) {
            var task = elementsDiagram.tasks[obj];
            var element = {
                id: task.id,
                type: task.type,
                displayName: task.displayName,
                duration: task.duration,
                position: task.position,
                predecessors: task.predecessors,
                successors: task.successors,
                rules: task.rules
            };
            elements.push(element);
        }
        return elements;
    },

    saveDiagram: function (evt, hideMessage) {
        var self = this;
        var defer = new $.Deferred();
        if (!self.saving) {
            self.saving = true;            
            if (!self.params.adhocProcessInfo.diagramId || self.params.adhocProcessInfo.diagramId == null) {
                self.params.adhocProcessInfo.diagramId = Math.guid();
            }
            var workflow = self.processModeler.save();
            var elements = self.transform(workflow);
            var diagram = {
                id : self.params.adhocProcessInfo.diagramId,
                elements,
                canvas: workflow.canvas
            };
            $.when(self.dataService.saveAdhocProcessDiagram(self.params.adhocProcessInfo.id, diagram)).done(function () {
                self.saving = false;                
                if (!hideMessage) self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-diagram-saved"), ""));
                defer.resolve();
            }).fail(function (error) {
                self.saving = false;
                bizagi.log(error);
            });
        }
        return defer.promise();
    },

    onClickPilotAdhocProcess: function (event) {
        event.preventDefault();
        var self = this;
        var buttons = [{ 'label': 'Test', 'action': 'resolve' }, { 'label': 'Later' }];
        if (self.params.adhocProcessInfo.authorization === null || !self.params.adhocProcessInfo.authorization[0].allowTo) {
            $.when(bizagi.showConfirmationBox("do you want to set process authorization first?", "", "", buttons)).done(function () {
                self.showPopupAuthAdhocProcess();
            }).fail(function () {
                self.params.adhocProcessInfo.state = "PILOT";
                $.when(self.dataService.publishAdhocProcess(self.params.adhocProcessInfo)).done(function () {
                    self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-pilot"), ""));
                    self.render();
                }).fail(function (error) {
                    bizagi.log(error);
                });
            });
        } else {
            self.params.adhocProcessInfo.state = "PILOT";
            $.when(self.dataService.publishAdhocProcess(self.params.adhocProcessInfo)).done(function () {
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-pilot"), ""));
                self.render();
            }).fail(function (error) {
                bizagi.log(error);
            });
        }
    },

    onClickPublishAdhocProcess: function (event) {
        event.preventDefault();
        var self = this;
        self.params.adhocProcessInfo.state = "PUBLISHED";
        $.when(self.dataService.publishAdhocProcess(self.params.adhocProcessInfo)).done(function () {
            self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-published"), ""));
            self.render();
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    showPopupAuthAdhocProcess: function () {
        var self = this, template = self.getTemplate("adhoc.processes.authorization.editor.popup");

        var formContent = $.tmpl(template, {});

        if (self.params.adhocProcessInfo.authorization == null || !self.params.adhocProcessInfo.authorization[0].allowTo) {
            self.params.adhocProcessInfo.authorization = [{ id: Math.guid(), allowTo: [] }];
        }

        self.renderAuthorizationItems($("#authorizationItems", formContent), self.params.adhocProcessInfo.id, self.params.adhocProcessInfo.authorization[0], false);

        this.unsubscribe("refreshAuthItems");
        this.subscribe("refreshAuthItems", function (e, params) {
            $("#authorizationItems", formContent).empty();
            self.params.adhocProcessInfo.authorization[0] = params.auth;
            self.renderAuthorizationItems($("#authorizationItems", formContent), self.params.adhocProcessInfo.id, params.auth, false);
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

    dispose: function () {
        var self = this;
        if (self.formModeler) self.formModeler.dispose();
        self._super();
    }
});