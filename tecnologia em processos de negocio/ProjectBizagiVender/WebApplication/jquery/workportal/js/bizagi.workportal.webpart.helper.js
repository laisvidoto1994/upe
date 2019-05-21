
/*
*   Name: BizAgi Workportal Webpart helper
*   Author: Diego Parra
*   Comments:
*   -   This script will define helper functions that the webparts could use to reuse some logic
*/


$.Class.extend("bizagi.workportal.webpart.helper", {}, {
    /* 
    *   Constructor
    */
    init: function (webpart) {
        // Set data service
        this.dataService = webpart.dataService;

        // Set l10n service
        this.resources = webpart.resources;

        // Set workportal facade
        this.workportalFacade = webpart.workportalFacade;

        //Load Aditional templates
        this.templates = {};
    },

    /*
    *   Helper to set visible property to false to the given columns
    */
    hideCasesColumn: function (data, columnName) {
        var self = this;
        for (i = 0; i < data.columns.length; i++) {
            if (data.columns[i].name == columnName) {
                data.columns[i].visible = false;
                break;
            }
        }
        return data;
    },
    /*
    *   Helper to set visible property to false to the given columns
    */
    hideCasesColumn: function (data, columnName) {
        var self = this;
        for (i = 0; i < data.columns.length; i++) { 
            if (data.columns[i].name == columnName) {
                data.columns[i].visible = false;
                break;
            }
        }
        return data;
    },

    /*
    *   Helper to transform cases data into normalized grid data
    */
    transformCasesInfo: function (params) {
        var old = params.data,
            imageColumn = params.imageColumn;
        var newData = { transformed: true };

        // If the data is already transformed, don't do anything
        if (old.transformed) return old;

        var getColumnType = function (column) {
            if (column.fieldName == imageColumn) return "upload";
            if (column.fieldName == "I_idTask") return "workitems";
            return column.type;
        };

        // Parse columns, and add "id" column
        newData.columns = [{
            name: "id",
            displayName: "id",
            visible: false
        }];

        for (var i = 0; i < old.cases.columnTitle.length; i++) {
            var oldColumn = old.cases.columnTitle[i];
            newData.columns.push({
                name: oldColumn.fieldName,
                displayName: oldColumn.displayName,
                dataType: getColumnType(oldColumn)
            });

            if (bizagi.util.parseBoolean(oldColumn.isOrdered) == true) {
                newData.orderBy = oldColumn.fieldName;
                newData.orderType = oldColumn.orderType == 0 ? "asc" : "desc";
            }
        }

        // Add "workitems" column
        newData.columns.push({
            name: "workitems",
            displayName: "workitems",
            visible: false,
            dataType: "workitems"
        });

        newData.columns.push({
            name: "permissions",
            displayName: "permissions",
            visible: false,
            dataType: "permissions"
        });

        // Parse rows
        newData.rows = [];
        for (i = 0; i < old.cases.rows.length; i++) {
            var oldRow = old.cases.rows[i];
            var newRow = [];
            newRow.push(oldRow.id);

            // Add other fields
            for (var j = 0; j < oldRow.fields.length; j++) {
                newRow.push(oldRow.fields[j]);
            }
            newData.rows.push(newRow);
        }

        // Add other stuff
        newData.totalPages = old.cases.totalPages;
        newData.page = old.cases.page;

        return newData;
    },

    /*
    *   Helper to draw a grid view
    */
    drawGridView: function (params) {
        var templates = params.template;

        // This is the data that will be used in order to render the template
        var data = params.data;

        // Complete column information with defaults
        for (i = 0; i < data.columns.length; i++) {
            data.columns[i].visible = typeof (data.columns[i].visible) !== "undefined" ? bizagi.util.parseBoolean(data.columns[i].visible) : true;

            // Hide uploads & workitems
            if (data.columns[i].dataType == "upload") data.columns[i].visible = false;
            if (data.columns[i].dataType == "workitems") data.columns[i].visible = false;
            if (data.columns[i].dataType == "permissions") data.columns[i].visible = false;
        }

        // Check that required params are defined
        if (data.orderType == 0) data.orderType = "asc";
        if (data.orderType == 1) data.orderType = "desc";
        data.orderBy = !bizagi.util.isEmpty(data.orderBy) ? data.orderBy : "";
        data.orderType = !bizagi.util.isEmpty(data.orderType) ? data.orderType : "asc";
        data.totalPages = !bizagi.util.isEmpty(data.totalPages) ? data.totalPages : 0;

        // Add paging stuff
        var pages = [];
        for (var i = 1; i <= data.totalPages; i++) {
            pages.push({
                number: i,
                active: (i == data.page)
            });
        }

        // Build the html
        var result = $.tmpl(templates, $.extend(data, {
            pages: pages,
            actions: params.actions,
            filters: params.filters,
            title: params.title,
            getCaseId: function (row) {
                return row[0];
            },
            getEntityId: function (row) {
                return row[0];
            },
            splitHeaderName: function (displayName) {
                var finalDispName = displayName;
                var dispNameParts = displayName.split('_');
                if (dispNameParts.length > 1)
                    finalDispName = dispNameParts[1];
                return finalDispName;
            },
            getWorkItems: function (row) {
                var workitemsData = "[";
                var workitems = row[row.length - 2].workitems;
                if (workitems && workitems.length > 0) {
                    for (var wi in workitems) {
                        if (wi > 0) {
                            workitemsData += ",";
                        }
                        var wiInfo = "{\"idWorkItem\":";
                        wiInfo += workitems[wi].idWorkItem;
                        wiInfo += ",\"idTask\":";
                        wiInfo += workitems[wi].idTask;
                        wiInfo += "}";
                        workitemsData += wiInfo;
                    }

                }
                workitemsData += "]";
                return workitemsData;
            }
        }));

        return result;
    },

    /*
    *   Helper to draw a thumbnails view
    */
    drawThumbnailsView: function (params) {
        var self = this;
        var templates = params.template;

        // This is the data that will be used in order to render the template
        var data = params.data;
        var imageUrl, label;

        // Normalize label item
        for (i = 0; i < data.columns.length; i++) {
            // Set default visibility to true
            data.columns[i].visible = typeof (data.columns[i].visible) !== "undefined" ? bizagi.util.parseBoolean(data.columns[i].visible) : true;

            // Check label item
            if (data.columns[i].name == params.imageLabelColumn) {
                data.columns[i].dataType = "imageLabel";
            }

            // Check workitem item
            if (data.columns[i].dataType == "workitems") {
                data.columns[i].visible = false;
            }
        }

        // Check that required params are defined
        data.orderBy = !bizagi.util.isEmpty(data.orderBy) ? data.orderBy : "";
        data.orderType = !bizagi.util.isEmpty(data.orderType) ? data.orderType : "asc";
        data.totalPages = !bizagi.util.isEmpty(data.totalPages) ? data.totalPages : 0;

        // Add paging stuff
        var pages = [];
        for (var i = 1; i <= data.totalPages; i++) {
            pages.push({
                number: i,
                active: (i == data.page)
            });
        }

        // Build the html
        return $.tmpl(templates,
            $.extend(data, {
                pages: pages,
                getImage: function (files) { return self.getFileImage(files); },
                actions: params.actions,
                getCaseId: function (row) {
                    return row[0];
                },
                getEntityId: function (row) {
                    return row[0];
                },
                getWorkItems: function (row) {
                    var workitemsData = "[";
                    var workitems = row[row.length - 1].workitems;
                    if (workitems && workitems.length > 0) {
                        for (var wi in workitems) {
                            if (wi > 0) {
                                workitemsData += ",";
                            }
                            var wiInfo = "{\"idWorkItem\":";
                            wiInfo += workitems[wi].idWorkItem;
                            wiInfo += ",\"idTask\":";
                            wiInfo += workitems[wi].idTask;
                            wiInfo += "}";
                            workitemsData += wiInfo;
                        }

                    }
                    workitemsData += "]";
                    return workitemsData;
                }
            }
        ));
    },

    getEmptyFile: function () {
        return "/_layouts/Proxy/jquery/overrides/css/desktop/images/EmptyAsset.png";
        //return ""; //No Picture
    },
    /*  
    *   Returns the file url
    */
    getFileImage: function (files) {
        var self = this;

        if (!files || files.length == 0) return self.getEmptyFile();
        return files;
    },
    getFile: function (files) {
        var self = this;

        if (!files || files.length == 0) return self.getEmptyFile();
        return self.dataService.getFile(files[0]);
    },
    removeWaitContainer: function (container) {
        if ($(container)) {
            $(container).addClass("ui-bizagi-sharepoint-loading-container-hidden");
        }
    },
    addWaitContainer: function (container) {
        if ($(container)) {
            $(container).removeClass("ui-bizagi-sharepoint-loading-container-hidden");
        }
    },

    loadTemplate: function (template, templateDestination) {
        var self = this;

        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination)
                .done(function (resolvedRemplate) {
                    self.templates[template] = resolvedRemplate;
                });
    },

    getFailServerErrorDeferred: function (params, defer) {
        var self = this;
        var errorMessage = params.message;
        var remoteSeverURL = ""
        var errorTemplateName;
        if (params.sharepointProxyPrefix.indexOf("URL") != -1) {
            remoteSeverURL = params.sharepointProxyPrefix.substr(params.sharepointProxyPrefix.indexOf("URL") + 4, params.sharepointProxyPrefix.length);
            errorTemplateName = "bizagi.workportal.desktop.error-message-sharepoint";
        }
        else {
            errorTemplateName = "bizagi.workportal.desktop.error-message-portal";
        }
        errorMessage = remoteSeverURL + ": " + errorMessage;
        self.loadTemplate("error-message", bizagi.getTemplate(errorTemplateName))
            .done(function (eTemplate) {
                var content = self.content = $.tmpl(eTemplate, {
                    message: errorMessage,
                    address: params.helpAddress
                });

                defer.resolve(content);

            }).fail(function (msg) {
                defer.resolve("<div>Unhandled error</div>");
            });

    },
    getPaginationTemplate: function () {
        return self.loadTemplate("pagination-template", bizagi.getTemplate("inbox-common-pagination-inbox"))
    },

    publishShowRenderEvent: function (event, webpart, params) {
        // Check if the current render form can be changed
        if (!!!event) {
            alert("Event param cannot be undefined");
        }
        //The webparts that not visible no receive events  
        var deferRet = webpart.publish("ui-bizagi-can-change-activityform");
        if (deferRet) {
            deferRet.done(function () {
                // When the "ui-bizagi-can-change-activityform" event deferred is resolved, it means that we can change the activityform instance
                // otherwise the deferred fails and nothing happens because we don't have fail implementation

                // Publish the event so any other webpart could react to that
                webpart.publish(event, params);
            });
        }
        else {
            //Error autosave verification send error
            alert("autosave verification send error");
            //webpart.publish(event, params);
        }
    },
    isWebpartInIFrame: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    //This method send a message by postMessage to parent, and parent create a popUp,
    displayWebPartPopUpExternalIframe: function (webpartName, params, callback, postMessageSocket) {


        params.workportal = null;
        params.canvas = null;
        params.postMessageEventName = "postmessage-bizagi-openParentPopUp";
        params.webPartToDraw = webpartName;
        params.iframeidentifier = postMessageSocket.iframeidentifier;
        postMessageSocket.send(JSON.stringify(params));


    },
    displayWebPartPopUpinIFrame: function (webpartName, params, callback) {

        var webpartObject;
        // Publish the event so any other webpart could react to that
        var mask = document.createElement("div");
        mask.className = "containerPopUp";
        mask.style.height = "100%";

        var popUpParams = params;

        if (!mask.addEventListener) {
            mask.attachEvent("onclick", preClosePopUp);
        }
        else {
            mask.addEventListener("click", preClosePopUp, false);
        }

        function preClosePopUp(ev, params) {
            if (ev.eventPhase === 2) {
                closePopUp(ev, params);
            }
        }

        var canvas = document.createElement("div");
        canvas.className = "activitiFormContainer";
        var closeCanvas = document.createElement("div");
        closeCanvas.className = "closeCanvas";

        if (!closeCanvas.addEventListener) {
            closeCanvas.attachEvent("onclick", function (e, params) {
                closePopUp(e, params);
            });
        }
        else {
            closeCanvas.addEventListener("click", function (e, params) {
                closePopUp(e, params);
            }, false);
        }

        canvas.appendChild(closeCanvas);
        mask.appendChild(canvas);

        var webpartCanvasDiv = document.createElement("div");
        webpartCanvasDiv.className = "webpartCanvasDiv";
        webpartCanvasDiv.id = "webpartCanvasPopUp";
        canvas.appendChild(webpartCanvasDiv);

        var pathiFrame = "";
        if (params.pathiFrame) {
            pathiFrame = params.pathiFrame;
        }
        else {
            pathiFrame = window.location.href.substring(0, window.location.href.indexOf("jquery"));
        }

        var queryStringParams = window.location.toString().split('?')[1];


        pathiFrame = pathiFrame + "jquery/webparts/desktop/portal/pages/webpart.htm"
        pathiFrame = pathiFrame + "?type=" + webpartName;
        if (params.idCase) { pathiFrame = pathiFrame + "&idCase=" + params.idCase; }
        if (params.idWorkitem) { pathiFrame = pathiFrame + "&idWorkitem=" + params.idWorkitem; }
        if (params.idWfClass) { pathiFrame = pathiFrame + "&idWfClass=" + params.idWfClass; }
        if (queryStringParams) { pathiFrame = pathiFrame + "&" + queryStringParams; }

        pathiFrame = pathiFrame + "&remoteServer=" + window.location.toString();


        //Aqui se agrega el iframe
        var iframe = document.createElement("iframe");
        iframe.className = "csswebpartIframePopUp";
        iframe.id = "iframePopUp";
        iframe.src = pathiFrame;
        iframe.resizeInPopUp = function (params) {
            var self = this;
            var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
            $(iframe).height(heightActivitiFormContainer);
        }

        webpartCanvasDiv.appendChild(iframe);
        document.body.appendChild(mask);

        iframe.resizeInPopUp(params);
        $(window).resize(function () {
            iframe.resizeInPopUp(params);
        });

        function closePopUp(ev, params) {
            //if webpart has canHide event, call event canHide before

            var postmessageSocket = new bizagi.postmessage({ remoteServer: pathiFrame, destination: iframe.contentWindow, origin: window });
            postmessageSocket.receive = function (msg) {
                //the canHide process is made in iframe
                var params = eval("(" + msg.data + ")");
                if (params.postMessageEventName == "postmessage-bizagi-closeIFramePopUp") {
                    if (mask.parentNode) {
                        iframe.src = undefined; 
                        mask.parentNode.removeChild(mask);
                        if (callback) {
                            callback(this, popUpParams);
                        }
                    }
                }
            };
            var iframeclosemsg = {};
            iframeclosemsg.postMessageEventName = "postmessage-bizagi-canCloseIFramePopUp";
            postmessageSocket.send(JSON.stringify(iframeclosemsg));
        }

    },
    displayWebPartPopUp: function (webpartName, params, callback) {
        var webpartObject;
        // Publish the event so any other webpart could react to that
        var mask = document.createElement("div");
        mask.className = "containerPopUp";
        mask.style.height = "100%";

        var popUpParams = params;

        if (!mask.addEventListener) {
            mask.attachEvent("onclick", preClosePopUp);
        }
        else {
            mask.addEventListener("click", preClosePopUp, false);
        }

        function preClosePopUp(ev, params) {
            if (ev.eventPhase === 2) {
                closePopUp(ev, params);
            }
        }

        function closePopUp(ev, params) {
            //if webpart has canHide event, call event canHide before
            if (webpartObject.canHide) {
                $.when(webpartObject.canHide())
                .done(function () {
                    mask.parentNode.removeChild(mask);
                    if (callback) {
                        callback(this, popUpParams);
                    }
                    webpartObject.destroy();
                }).fail(function () {
                    mask.parentNode.removeChild(mask);
                    if (callback) {
                        callback(this, popUpParams);
                    }
                    webpartObject.destroy();
                });
            }
            else {
                mask.parentNode.removeChild(mask);
                if (callback) {
                    callback(this, popUpParams);
                }
                webpartObject.destroy();
            }
        }

        var canvas = document.createElement("div");
        canvas.className = "activitiFormContainer";
        var closeCanvas = document.createElement("div");
        closeCanvas.className = "closeCanvas";

        if (!closeCanvas.addEventListener) {
            closeCanvas.attachEvent("onclick", function (e, params) {
                closePopUp(e, params);
            });
        }
        else {
            closeCanvas.addEventListener("click", function (e, params) {
                closePopUp(e, params);
            }, false);
        }

        canvas.appendChild(closeCanvas);
        mask.appendChild(canvas);

        var webpartCanvasDiv = document.createElement("div");
        webpartCanvasDiv.className = "webpartCanvasDiv";
        webpartCanvasDiv.id = "webpartCanvasPopUp";
        canvas.appendChild(webpartCanvasDiv);

        var webpartParams = $.extend({}, params, { webpart: webpartName, canvas: $(webpartCanvasDiv), namespace: "PopUp", data: null, adjustButtonsToContent: true });

        //add popUp in document
        document.body.appendChild(mask);
        //The element webpartCanvasDiv must be already added to document, for can call  bizagi.starWaiting
        bizagi.startWaiting(webpartCanvasDiv);

        params.workportal.executeWebpart(webpartParams).done(function (result) {
            webpartObject = result.webpart;
            closeCanvas.onclick = function (e, params) {
                // callback(params);
            }
        });
	},
	displayWebPartDialog: function(webpartName, params, callback) {
		var webpartObject;
		var dialogParams = params.dialogParams;
		var canvas = document.createElement("div");
		canvas.className = "activitiFormContainer";
		var webpartCanvasDiv = document.createElement("div");
		webpartCanvasDiv.className = "webpartCanvasDiv";
		webpartCanvasDiv.id = "webpartCanvasPopUp";
		canvas.appendChild(webpartCanvasDiv);
		var webpartParams = $.extend({}, params, {
			webpart: webpartName,
			canvas: $(webpartCanvasDiv),
			namespace: "PopUp",
			data: null,
			adjustButtonsToContent: true
		});
		params.workportal.executeWebpart(webpartParams).done(function(result) {
			webpartObject = result.webpart;
			if(dialogParams.showCloseButton){
				dialogParams.buttons.push({
					text:bizagi.localization.getResource("workportal-widget-dialog-box-close"),
					click:function(p,a) {
						webpartObject.content.dialog("close");
    }
				});
			}
			webpartObject.content.dialog(dialogParams);
		});
	}
});

/*
*   Static Methods to configure webparts
*/
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.webparts = (typeof (bizagi.webparts) !== "undefined") ? bizagi.webparts : {};

bizagi.webparts.addConfigurationMessage = function (webpartParams, messageResourceName) {
    var doc = this.ownerDocument;
    var body = $("body", doc);
    var canvas = webpartParams.canvas || $("<div/>").appendTo(body);
    var errorTemplate = bizagi.getTemplate("bizagi.sharepoint.configurationerror");
    // Load template
    $.when(bizagi.templateService.getTemplate(errorTemplate))
        .then(function (template) {
            $.tmpl(template, {
                message: bizagi.localization.getResource(messageResourceName)
            }).appendTo(canvas);

        });
};
