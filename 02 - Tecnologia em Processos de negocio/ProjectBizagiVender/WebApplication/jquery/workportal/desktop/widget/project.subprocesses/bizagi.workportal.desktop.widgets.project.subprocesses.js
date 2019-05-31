/*
 *   Name: Bizagi Workportal Desktop Project Subprocesses Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.subprocesses", {}, {
        /*
         *   Constructor
         */
        init: function (workportalFacade, dataService, params) {
            var self = this;

            // Call base
            self._super(workportalFacade, dataService, params);

            self.contextsSidebarActivity = params.contextsSidebarActivity;

            //Load templates
            self.loadTemplates({
                "project-subprocesses": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.subprocesses").concat("#project-subprocesses-wrapper"),
                "project-subprocesses-tootip-custom-properties": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.subprocesses").concat("#project-subprocesses-tooltip-custom-properties-wrapper")
            });
        },

        /*
         * Renders the template defined in the widget
         */
        renderContent: function () {
            var self = this;
            self.content = $("<div></div>");
            return self.content;
        },

        /*
         * links events with handlers
         */
        postRender: function () {
            var self = this;

            //Handlers
            self.contextsSidebarActivity.forEach(function (context) {
                self.sub(context, $.proxy(self.updateView, self));
            });
        },

        updateView: function (event, params) {
            var self = this,
                args = params.args,
                $content = self.getContent().empty();
            self.params = args;
            $.when(
                self.dataService.summarySubProcess({
                    idCase: self.params.idCase
                })
            ).done(function (responseSubprocess) {
                    if (responseSubprocess.showSubProcess) {
                        $.each(responseSubprocess.subProcesses, function (key) {
                            var custData = responseSubprocess.subProcesses[key].custData;
                            if (custData && custData.length) {
                                for (var i = 0; i < custData.length; i += 1) {
                                    if (custData[i] === null) {
                                        custData[i] = "";
                                    }
                                }
                            }

                        });

                        var subProcess = responseSubprocess.subProcesses || responseSubprocess.subProcPersonalized;

                        //prepare array with subprocess
                        var auxArrayListSubprocesses = [];
                        for (var i = 0; i < Object.keys(subProcess).length; i += 1) {
                            var tempSubprocesses = subProcess[i];

                            auxArrayListSubprocesses.push({
                                isOpen: tempSubprocesses.isOpen,
                                radNumber: tempSubprocesses.radNumber,
                                displayName: tempSubprocesses.displayName,
                                idCase: tempSubprocesses.idCase,
                                indexSubprocess: i,
                                idCustData: tempSubprocesses.idCustData
                            });
                            if (tempSubprocesses.subProcesses) {
                                Object.keys(tempSubprocesses).forEach(function (key) {//only one iteration
                                    auxArrayListSubprocesses.push({
                                        isOpen: tempSubprocesses[key].isOpen,
                                        radNumber: tempSubprocesses[key].radNumber,
                                        displayName: tempSubprocesses[key].displayName,
                                        idCase: tempSubprocesses[key].idCase,
                                        indexSubprocess: i,
                                        idCustData: tempSubprocesses[key].idCustData
                                    });
                                });
                            }
                        }

                        //Update widget
                        var contentTemplate = self.getTemplate("project-subprocesses");
                        contentTemplate
                            .render($.extend(args, {auxArrayListSubprocesses: auxArrayListSubprocesses}))
                            .appendTo($content);

                        $(".list-subprocesses a", $content).on("click", $.proxy(self.onClickGoSubprocess, self));

                        var selectorTooltip = ".list-subprocesses li";
                        $(selectorTooltip, $content).tooltip({
                            position: {
                                collision: "flipfit",
                                my: "right center", at: "left-10 center"
                            },
                            show: null, // show immediately
                            content: function () {
                                return self.getContentTooltip($(this),
                                    responseSubprocess,
                                    self.getTemplate("project-subprocesses-tootip-custom-properties"))
                            },
                            open: function(event, ui)
                            {
                                if (typeof(event.originalEvent) === 'undefined')
                                {
                                    return false;
                                }
                                var $id = $(ui.tooltip).attr('id');
                                // close any lingering tooltips
                                $('div.ui-tooltip').not('#' + $id).remove();
                            },
                            close: function(event, ui)
                            {
                                ui.tooltip.hover(function()
                                    {
                                        $(this).stop(true).fadeTo(400, 1);
                                    },
                                    function()
                                    {
                                        $(this).fadeOut('400', function()
                                        {
                                            $(this).remove();
                                        });
                                    });
                            }
                        });
                    }
                });
        },

        getContentTooltip: function (target, responseSubprocess, templateTooltip) {
            var self = this;
            var indexSubprocess = $(target).closest("li").find("#indexSubprocess").val();
            var idCustData = $(target).closest("li").find("#idCustData").val();

            //when not show custom columns
            if(idCustData == "-1"){
                idCustData = "0";//So show only basic data subprocess
            }

            var rowCustomProperty = function (nameProperty, valueProperty) {
                return {
                    nameProperty: nameProperty,
                    valueProperty: valueProperty
                };
            };

            var arrayCustomsProperties = [];
            var auxValueProperty = "";
            var subprocessData = self.getSubprocessData(responseSubprocess, indexSubprocess, idCustData);
            var custData = subprocessData.custData;
            var custDataTypes = subprocessData.custDataTypes;
            var custFields = subprocessData.custFields;
            var displayName = subprocessData.displayName;

            //subproceso
            arrayCustomsProperties.push(new rowCustomProperty("subproceso", displayName));

            //Others custom properties
            if (custData.length) {
                for (var i = 0; i < custData.length; i += 1) {
                    auxValueProperty = custData[i];
                    if (custDataTypes) {
                        if (custDataTypes[i] == "Money") {
                            auxValueProperty = bizagi.util.formatMonetaryCell(auxValueProperty);
                        } else {
                            if (custDataTypes[i] == "Boolean") {
                                auxValueProperty = bizagi.util.formatBoolean(auxValueProperty);
                            } else {
                                if (custDataTypes[i] == "Float" || custDataTypes[i] == "Real") {
                                    auxValueProperty = bizagi.util.formatDecimalCell(auxValueProperty);
                                }
                                else {
                                    if (typeof auxValueProperty === "function") {
                                        auxValueProperty = "";
                                    }
                                }
                            }
                        }
                    }
                    arrayCustomsProperties.push(new rowCustomProperty(custFields[i], auxValueProperty));
                }
            }

            //Render properties
            var objectTemplate = {};
            objectTemplate.arrayCustomsProperties = arrayCustomsProperties;
            objectTemplate.nameSubprocess = $(target).text();
            var contentTemplate = templateTooltip;
            var contentTableCustomProperties = $('<div class="bizagi-custom-tooltip-subprocesses"></div>');
            contentTemplate.render(objectTemplate).appendTo(contentTableCustomProperties);

            return contentTableCustomProperties.html();
        },

        getSubprocessData: function (responseSubprocess, indexSubprocess, idCustData) {

            var subProcessData = {};
            var subProcess = responseSubprocess.subProcesses;
            var subProcPersonalized = responseSubprocess.subProcPersonalized;

            if (subProcess && subProcess.length > 0) {
                subProcessData.custData = subProcess[indexSubprocess].custData;
                subProcessData.custDataTypes = subProcess[indexSubprocess].custDataTypes;
                var customFields = responseSubprocess.CustFields[idCustData];
                subProcessData.custFields = customFields[Object.keys(customFields)[0]];
                subProcessData.displayName = subProcess[indexSubprocess].displayName;
            } else if (subProcPersonalized && Object.keys(subProcPersonalized).length > 0) {
                subProcessData.custData = subProcPersonalized[0].subProcesses[indexSubprocess].custData;
                subProcessData.custDataTypes = subProcPersonalized[0].subProcesses[indexSubprocess].custDataTypes;
                subProcessData.custFields = subProcPersonalized[0].CustFields[0];
                subProcessData.displayName = subProcPersonalized[0].subProcesses[indexSubprocess].displayName;
            }
            return subProcessData;
        },

        /**
         * Events UI
         */

        onClickGoSubprocess: function (event) {
            event.preventDefault();
            var self = this;

            self.routingExecute($(event.target).closest("li"));
        },

        clean: function () {
            var self = this;

            self.params = {};
            self.pluginTooltip = null;

            self.contextsSidebarActivity.forEach(function (context) {
                self.unsub(context, $.proxy(self.updateView, self));
            });
        }
    }
);

bizagi.injector.register("bizagi.workportal.widgets.project.subprocesses", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.subprocesses]);