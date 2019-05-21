/*
 *   Name: BizAgi Workportal Render Webpart
 *   Author: Fredy Vasquez
 *   Comments:
 *   -   This script will define a base class to all widgets
 */

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.render", {
    ASYNC_CHECK_TIMER: 3000
}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe("ui-bizagi-show-render", function (e, params) {
            self.renderForm(params);
        });

        // Se genera un evento desde NewCase para que se despliegue la info en el Render
        this.subscribe("ui-bizagi-show-render-new", function (e, params) {
            self.newCaseRenderForm(params);
        });

        // The process webpart fire this event to cases, and render display a old case, it's preferably show empty form
        this.subscribe("ui-bizagi-show-cases", function (e, params) {
            self.emptyRenderForm(params);
        });

        // Other webpart try hide render, but render prevent this action if autosave not finish
        this.subscribe("ui-bizagi-can-change-activityform", function () {
            return self.canHide();
        });

        //waitContainer
        this.waitContainer = initialParams.waitContainer;
        this.previousLoadRender = false;
        this.adjustButtonsToContent = initialParams.adjustButtonsToContent;
    },

    /*
     *   Renders the content for the current controller
     */
    renderContent: function () {
        var self = this;

        var template = self.workportalFacade.getTemplate("render");
        var content = self.content = $.tmpl(template);

        return content;
    },

    /*
     *   Customize the web part in each device
     */
    postRender: function (params) {
        var self = this;
        params.context = "sharepoint";
        params.sharepointProxyPrefix = self.sharepointProxyPrefix;

        if (params.idWfClass != null) {
            self.newCaseRenderForm(params);
        } else if (params.idWorkitem) {
            self.renderingExecute(params);
        } else {
            self.params = params;
            self.performRouting();
        }

        // Apply external theme styles
        self.applyExternalThemeStyles();

        self.endWaiting();
    },

    /*
     *   Listener to ui-bizagi-show-render event
     */
    renderForm: function (params) {
        //Creates a new case based on the selected process        
        var self = this;
        self.helper.addWaitContainer(self.waitContainer);
        self.params = params;
        self.refresh(self.params);
    },

    /*
     *   Creates a new case based on the selected process
     */
    newCaseRenderForm: function (params) {
        var self = this;
        var idWfClass = params.idWfClass;

        self.helper.addWaitContainer(self.waitContainer);
        var defer = new $.Deferred();

        // Start a process
        $.when(self.dataService.startProcess({
            idProcess: idWfClass
        })).done(function (data) {
            if (data.hasStartForm) {
                // Creates a new case
                $.when(self.dataService.getStartForm({
                    h_action: "LOADSTARTFORM",
                    h_mappingstakeholders: true,
                    h_idProcess: idWfClass
                })).then(function (data) {
                    self.renderingExecute({data: data, type: ""});
                });

            } else {
                //Load NewCase data in render form
                params.idCase = data.caseInfo.idCase;
                params.data = data.caseInfo;
                params.idWfClass = null;
                self.renderForm(params);
            }
            defer.resolve(data);
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });

        return defer.promise();
    },

    emptyRenderForm: function () {
        // Clear content
        this.content.empty();
    },

    performRouting: function () {
        var self = this;
        var params = self.params;
        params.fromWorkItemId = self.params.idWorkitem;

        $.when(self.dataService.routing.getRoute(params)).done(function (route) {
            route = route || {};
            route.moduleParams = route.moduleParams || {};

            switch (route.module) {
                case "projectDashboard":
                case "activityform":
                    if (route.moduleParams.idWorkitem) {

                        //The autosave verification always be before this step, not necesary autosave in this place
                        self.publish("ui-bizagi-show-render", {
                            idWorkitem: route.moduleParams.idWorkitem,
                            idCase: route.moduleParams.idCase
                        });
                    }
                    else {
                        if (route.moduleParams.messageForm) {
                            self.showFinishMessage(route.moduleParams.messageForm);
                        }
                        else {
                            if (route.moduleParams.withOutGlobalForm) {
                                //Render Finish Message
                                self.showFinishMessage(self.resources.getResource("render-without-globalform"));
                            }
                            else {
                                //Render summary form
                                params.idWorkitem = null;
                                params.data = null;
                                params.idCase = route.moduleParams.idCase;
                                params.guid = route.moduleParams.guid;
                                self.renderingExecute(params);
                            }
                        }
                        self.publish("ui-bizagi-show-summary", route.moduleParams);
                        self.hideButtons();
                    }
                    break;
                case "oldrenderintegration":
                    // TODO: Implement route for old render v1
                    break;
                case "async":
                    self.checkAsyncProcessingStatus();

                    break;
                case "routing":
                    self.publish("ui-bizagi-show-activitySelector", route.moduleParams);
                    break;
            }

        });
    },
    renderingExecute: function (params) {
        params = params || {};
        var self = this;
        self.previousLoadRender = true;
        self.showTitleReady = false;

        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        var mobileTemplate = self.workportalFacade.getTemplate("render-mobile");
        var loading = self.workportalFacade.getTemplate("loading-render");

        $.tmpl(loading).appendTo(canvas);

        // Detect device and initialize their facade
        if (bizagi.detectRealDevice() != "desktop") {
            // initialize mashups
            var mashup;
            var device = bizagi.detectRealDevice();
            device = (device == "tablet") ? "tablet_android" : device;
            device = (device == "smartphone") ? "smartphone_android" : device;

            $(canvas).empty();
            var urlParameters = {device: device};

            $.each(params, function (key, value) {
                // Take only strings and number parameters
                if (typeof value == "string" || typeof value == "number") {
                    urlParameters[key] = value;
                }
            });

            var url = "../../../../mashup/index.webparts.html?" + $.param(urlParameters);
            var height = (window.screen) ? window.screen.availHeight : "100%";

            var iframe = $.tmpl(mobileTemplate, {url: url, device: device, height: height});

            $(canvas).append(iframe);

            /*  bizagi.loader.init({
             callback: function() {
             bizagi.loader.start("mashup", device).then(function() {
             bizagi.enableCustomizations = true;

             mashup = new bizagi.mashup.facade({
             proxyPrefix: bizagiConfig.proxyPrefix || "",
             onClose: function () {
             console.log("closed");
             },
             onError: function(e){
             console.log("error", e);
             },
             onRenderAction: function (e) {
             console.log(e.actions);
             },
             showHeader: true,
             canvas: canvas,
             device: device
             });

             mashup.renderCase({"idCase": 201});

             mashup.showSummaryCase();

             mashup.showInternalHeader();

             mashup.hideInternalHeader();
             });
             }
             });*/
        } else {
            // initialize desktop render
            var rendering = self.rendering = new bizagi.rendering.facade(params);
            rendering.execute($.extend(params, {
                canvas: canvas
            }));

            rendering.subscribe("rendering-formRendered", function () {
                //se detecto una situaci�n, hay ocasiones en donde por cada ejecuci�n del rendering.execute ingresa varias veces al done.
                //Se agrego un filtro para minimizar la cantidad de veces que entra al m�todo showTitle
                //if (!self.showTitleReady) {
                self.sendDimensionsiFrame(true);
                self.showTitle(params);
                window.notifyMessageToParent("form-rendered");
                //}
            });

            $(window).resize(function () {
                self.rendering.resize({
                    forceResize: true
                });
            });
            // Attach handler to render container to subscribe for routing events
            if (canvas) {
                canvas.bind("routing", function (_, args) {
                    self.params.idCase = args.idCase;
                    self.performRouting();
                });
            }
        }
    },

    checkAsyncProcessingStatus: function (params) {
        var self = this;
        var params = params || self.params;

        $.when(self.dataService.getAsynchExecutionState({idCase: params.idCase}))
            .done(function (response) {

                // Check what to do next
                if (response.state == "Processing") {
                    // Verify errors in response
                    if (response.state == "Error" && response.errorMessage != undefined) {
                        // Change default error
                        response.errorMessage = bizagi.localization.getResource("render-async-error");

                    } else {
                        // Re-draw async feedback until finished
                        setTimeout(function () {
                            self.hideAsyncFeedback();
                            self.performRouting();
                        }, self.Class.ASYNC_CHECK_TIMER);
                    }

                    // Show feedback
                    self.showAsyncFeedback(response);


                } else if (response.state == "Finished") {
                    // Re-execute routing to draw next activity
                    self.performRouting();
                }
            });
    },

    showAsyncFeedback: function (response) {
        var self = this;
        var template = self.getTemplate("render-async");
        var asyncMessage = $.tmpl(template, response);
        var canvas = self.canvas;
        canvas.append(asyncMessage);
    },

    hideAsyncFeedback: function () {
        var self = this;
        var canvas = self.canvas;
        var asyncMessage = $("#ui-bizagi-webpart-render-async-wrapper", canvas);
        asyncMessage.remove();
    },
    hideButtons: function () {
        var self = this;
        var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
        if (buttonContainer.lenght > 0) {
            buttonContainer.remove();
        }
        else {
            //because performance
            var buttonContainerbody = $(".ui-bizagi-button-container");
            buttonContainerbody.remove();
        }
    },
    showFinishMessage: function (message) {
        var self = this;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        //Add finish message when case is finish
        var errorTemplate = self.workportalFacade.getTemplate("info-render");
        var endMessageHtml = $.tmpl(errorTemplate, {
            message: message
        });
        // Load end Message   
        canvas.empty();
        endMessageHtml.appendTo(canvas);
    },

    showTitle: function (params) {
        var self = this;
        var content = self.getContent();

        if (!params.idCase) return;

        // Call case summary service for header case
        $.when(self.dataService.getCaseSummary({
                idCase: params.idCase,
                onlyUserWorkItems: true
            }))
            .done(function (data) {
                // When the form is a start form, data is null
                data = data || {};

                //Add Title
                var titleTemplate = self.workportalFacade.getTemplate("title-render");
                var caseNumber = data.caseNumber;
                var processPath = data.processPath + data.process;
                var workItemState;

                if (params.idWorkitem) {
                    $.each(data.currentState, function (index, dataValue) {
                        if (dataValue.idWorkItem == params.idWorkitem) {
                            workItemState = dataValue.state;
                        }
                    });
                }

                var titleMessageHtml = $.tmpl(titleTemplate, {
                    caseNumber: caseNumber,
                    workItemState: workItemState,
                    processPath: processPath
                });
                //$(".ui-bizagi-webpart-header-container", content).html(titleMessageHtml);
                $(".ui-bizagi-webpart-header-container", content).empty();
                titleMessageHtml.appendTo(".ui-bizagi-webpart-header-container", content);

                self.resizeInPopUp(titleMessageHtml, params);

                //Filtro de veces de ejecucion
                self.showTitleReady = true;

            });
    },
    resizeInPopUp: function (titleMessageHtml, params) {
        var self = this;
        if (self.adjustButtonsToContent && (self.adjustButtonsToContent == "true" || self.adjustButtonsToContent == true)) {
            if (self.isWebpartInIFrame) {
                self.resizeInPopUpinIFrame(titleMessageHtml, params);

                $(window).resize(function () {
                    self.resizeInPopUpinIFrame(titleMessageHtml, params);
                });
            }
            else {
                self.resizeInPopUpHTML(titleMessageHtml, params);

                $(window).resize(function () {
                    self.resizeInPopUpHTML(titleMessageHtml, params);
                });
            }
        }
    },

    resizeInPopUpHTML: function (titleMessageHtml, params) {
        var self = this;
        var heightHeader = titleMessageHtml.height() || 0;
        if ($(".activitiFormContainer").length > 0) {
            var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
            var renderForm = $("#ui-bizagi-webpart-render-container", self.getContent());
            if (params.idWorkitem) {
                //display buttons
                var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
                var heightButtonContainer = buttonContainer.height() || 0;
                buttonContainer.appendTo(renderForm.parent());
                buttonContainer.addClass("ui-bizagi-button-container-popup");
                renderForm.height(heightActivitiFormContainer - heightHeader - 38 - heightButtonContainer);
            }
            else {
                //NOT display buttons
                renderForm.height(heightActivitiFormContainer - heightHeader - 48);
            }

            renderForm.css('overflow-y', 'auto');
            renderForm.css('overflow-x', 'hidden');
        }
    },

    resizeInPopUpinIFrame: function (titleMessageHtml, params) {
        var self = this;
        var renderForm = $('body');
        if (params.idWorkitem) {
            var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
            buttonContainer.appendTo(renderForm);
            buttonContainer.addClass("ui-bizagi-button-container-popup");

            buttonContainer.css({'position': 'fixed', 'bottom': '0px'});

            var heightButtonContainer = buttonContainer.height() || 0;
            heightButtonContainer = heightButtonContainer * 2;
            renderForm.css({'padding-bottom': heightButtonContainer + 'px'});
            renderForm.css({'height': '100%'});
        }
    },

    destroy: function () {
        var self = this;

        self.unsubscribe("ui-bizagi-show-render");
        self.unsubscribe("ui-bizagi-show-render-new");
        self.unsubscribe("ui-bizagi-show-cases");

    },

    canHide: function () {
        var self = this;
        if (self.avoidVerifyCanHide) {
            self.avoidVerifyCanHide = undefined;
            //send a deferred whit always resolve promise
            var deferred = $.Deferred().resolve();
            return deferred.promise();
        }
        // Check if there asre some pending changes
        return bizagi.util.autoSave();
    },

    prepareForRefresh: function () {
        var self = this;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        canvas.off();
        $(window).unbind("resize");

        // Dispose current rendering instance
        if (this.rendering) {
            this.rendering.dispose();
            delete this.rendering;
        }
    },

    applyExternalThemeStyles: function () {
        var self = this;

        // Set up a global flag to avoid apply this every time this webpart is rendered
        if (bizagi.externalStylesApplied) return;

        // Load external theme
        var themeFromQS = bizagi.util.getQueryString(window.location.href)["externalTheme"];
        if (!themeFromQS) return;
        var theme = JSON.parse(atob(themeFromQS));

        // Apply external styles to custom override theme
        var externalThemeCssUrl = "jquery/webparts/desktop/SharePoint/render/bizagi.webpart.render.externaltheme.css";
        $.ajax({url: externalThemeCssUrl, dataType: "text"})
            .done(function (text) {
                var styles = text.replace(/@([\w-.]+)@/g, function (_, style) {
                    var obj = theme;
                    var parts = style.split('.');
                    for (i = 0; i < parts.length; i++) {
                        var part = parts[i];
                        obj = obj[part];
                    }
                    return obj;
                });
                self.createDynamicStyleSheet(styles);
            });

        // Enable flag
        bizagi.externalStylesApplied = true;
    },

    jsonToStyle: function (json) {
        var result = "";
        for (var key in json) {
            result += '' + key + ': ' + json[key] + ';'
        }
        return result;
    },

    createDynamicStyleSheet: function (styles) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styles;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

});
