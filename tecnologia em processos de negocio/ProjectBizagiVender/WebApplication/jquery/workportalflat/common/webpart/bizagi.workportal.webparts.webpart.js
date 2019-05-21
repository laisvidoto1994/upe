/*
 *   Name: BizAgi Workportal Webpart Controller
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base class to all widgets
 */

/* Asegura que el namespace este creado*/
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.webpart = (typeof (bizagi.webpart) !== "undefined") ? bizagi.webpart : {};
bizagi.webpart.subscribe = function (eventName, callback) {
    $(document).bind(eventName, callback);
};
bizagi.webpart.publish = function (eventName, params) {
    return $(document).triggerHandler(eventName, params);
};

bizagi.webpart.whenCreated = function (webpartName, callback) {
    bizagi.webpart.subscribe("bizagi-webpart-created", function(params) {
        if (params.webpart.Class.fullname == "bizagi.workportal.webparts." + webpartName) {
            if (callback) callback(params);
        }
    });
};

bizagi.webpart.whenExecuted = function (webpartName, callback) {
    bizagi.webpart.subscribe("bizagi-webpart-executed", function(params) {
        if (params.webpart.Class.fullname == "bizagi.workportal.webparts." + webpartName) {
            if (callback) callback(params);
        }
    });
};


bizagi.workportal.controllers.controller.extend("bizagi.workportal.webparts.webpart", {
    BIZAGI_WORKPORTAL_WEBPART_ROUTING: "routing",
    BIZAGI_WORKPORTAL_WEBPART_RENDER: "activityform",
    BIZAGI_WORKPORTAL_WEBPART_ASYNC: "async",
    BIZAGI_WORKPORTAL_WEBPART_OLDRENDERINTEGRATION: "oldrenderintegration",
}, {
    /*
     *   Constructor
     */
    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, params);

        // Set helper
        this.helper = new bizagi.workportal.webpart.helper(this);

        this.canvas = params.canvas;

        this.pane = params.pane;

        // Set project
        this.project = params.project;
        this.sharepointProxyPrefix = params.sharepointProxyPrefix;

        //homePortal Framework
        this.homePortalFramework = this.workportalFacade.homePortalFramework;

        // Set namespace
        this.namespace = params.namespace;
        // visible
        this.isVisible = true;
        this.isWebpartInIFrame = typeof(params.isWebpartInIFrame) != 'undefined' ? params.isWebpartInIFrame : self.helper.isWebpartInIFrame();
        this.adjustButtonsToContent = params.adjustButtonsToContent;
        this.remoteServer = params.remoteServer;

        if (this.remoteServer) {

            //postmessage object definition
            self.postmessageSocket = new bizagi.postmessage({ remoteServer: this.remoteServer, destination: window.parent, origin: window });
            self.postmessageSocket.receive = function(msg) {
                var params = eval("(" + msg.data + ")");

                // Auto-discard self messages
                if (params.parameters) {
                    if (params.parameters.iframeidentifier == BIZAGI_IFRAME_IDENTIFIER) {
                        return;
                    }
                }

                if (params.postMessageEventName) {
                    switch (params.postMessageEventName) {
                        case "postmessage-bizagi-canCloseIFramePopUp":
                            if (self.canHide && self.Class.shortName == params.webPartDestine) {
                                $.when(self.canHide())
                                        .done(function() {
                                            var iframeclosemsg = {};
                                            iframeclosemsg.postMessageEventName = "postmessage-bizagi-closeIFramePopUp";
                                            iframeclosemsg.parameters = {};
                                            iframeclosemsg.parameters.iframeidentifier = BIZAGI_IFRAME_IDENTIFIER;
                                            self.postmessageSocket.send(JSON.stringify(iframeclosemsg));

                                            //Send message bizagi-show-cases refresh cases, cases are in other iframe
                                            var showCasesMSG = {};
                                            showCasesMSG.postMessageEventName = "ui-bizagi-reload-cases";
                                            //showCasesMSG.parameters = params.parameters;
                                            self.postmessageSocket.send(JSON.stringify(showCasesMSG));
                                        });
                            }
                            break;
                        case "postmessage-bizagi-openParentPopUp":
                            //Do nothing this message is for parent
                            break;
                        default:
                            //re send message to other webparts
                            self.publish(params.postMessageEventName, params.parameters, true);
                            break;
                    }
                } else {
                    //set iframe height and width

                }
            };
            self.sendDimensionsiFrame();
        }
    },
    sendDimensionsiFrame: function(mandatorysend) {
        var self = this;
        //If webpart is put in iFrame resize the iframe with content height
        //else if iframe show in popUp FixButtons, is desirable
        //If namespace is defined this is a chil webpart
        //delay wait for finish render
        if (this.remoteServer) {
            if (!!!self.adjustButtonsToContent && (!!!self.namespace || mandatorysend)) {
                if (self.isWebpartInIFrame) {
                    window.setTimeout(function() {

                        var iframeDimentions = {};
                        iframeDimentions.iframeName = BIZAGI_IFRAME_IDENTIFIER;
                        iframeDimentions.iframeHeight = $('body').height();
                        if (self.Class.shortName == "newcaselist") {
                            iframeDimentions.iframeWidth = $(document).width();
                        } else {
                            iframeDimentions.iframeWidth = undefined;
                        }
                        self.postmessageSocket.send(JSON.stringify(iframeDimentions));


                    }, 50);
                }
            }
        }

    },

    /**
     *   Publish an event so any controller can subscribe to it
     */
    publish: function(eventName, params, notFireToIframe) {
        var self = this;
        eventName = this.namespace ? this.namespace + "." + eventName : eventName;
        //publish event to iframe
        if (!!!notFireToIframe && eventName.indexOf("bizagi-webpart-created") == -1 && eventName.indexOf("bizagi-webpart-executed") == -1 && self.postmessageSocket) {
            var msg = {};
            msg.postMessageEventName = eventName;
            //By iFrame messages it can not transmit the canvas object or object workportal
            if (params) {
                params.canvas = null;
                params.workportal = null;
            }

            msg.parameters = $.extend(params, { project: this.project, iframeidentifier: BIZAGI_IFRAME_IDENTIFIER });
            self.postmessageSocket.send(JSON.stringify(msg));
        }
        //publish event localy in webparts
        return this._super(eventName, $.extend(params, { project: this.project }));
    },

    /**
     *   Subscribe to an event that any controller could trigger
     */
    subscribe: function(eventName, callback) {
        var self = this;
        eventName = this.namespace ? this.namespace + "." + eventName : eventName;
        this._super(eventName, function(e, params) {
            if (typeof params === 'undefined') params = {};
            if (self.project == params.project && self.isVisible)
                return callback(e, params);
        });
    },

    /**
     *   UnSubscribe to an event that any controller could trigger
     */
    unsubscribe: function(eventName, callback) {
        var self = this;
        eventName = this.namespace ? this.namespace + "." + eventName : eventName;
        this._super(eventName, callback);
    },

    /*
     *   Re-draw the webpart
     */
    refresh: function(params) {
        var self = this;

        var content;
        // Clear content
        if (self.canvas.data("role") == "view") {
            content = self.canvas.data("kendoMobileView").contentElement();
        } else {
            content = self.canvas;
        }
        content.empty();
        // Dispose stuff
        //self.prepareForRefresh();

        // Re-draw content;
        return self.render(params).then(function(newContent) {
            content.append(newContent);
            self.canvas.triggerHandler("ondomincluded");
            return "included";
        });
    },

    /*
     *   Renders the web part
     *   Also ensures that templates are loaded
     */
    render: function(params) {
        var self = this;

        // Set params in webpart variable
        self.params = params;

        if (params.creating) {
            self.content = self.empty();

            // Trigger webpart created event
            self.publish("bizagi-webpart-created", { webpart: self });

            return self.content;
        }

        // Trigger webpart created event
        self.publish("bizagi-webpart-created", { webpart: self });

        // Load templates
        return $.when(self.renderContent(params))
                .pipe(function(content) {
                    // Then customize in current device
                    // if you use fastTmpl the object string is trnaformed to object html -jquery
                    if (typeof(content) == "string"){
                        content = $(content);
                    }

                    self.content = content;
                    params.canvas.append(content);

                    return $.when(self.postRender(params)).then(function() {
                        // Trigger webpart executed event
                        self.publish("bizagi-webpart-executed", { webpart: self });
                        self.sendDimensionsiFrame();
                        return self.getContent();
                    });
                });
    },

    /*
     *   Renders the web part, override this method in each webpart
     */
    renderContent: function(params) {
    },

    /*
     *   Customize the web part in each device
     */
    postRender: function(params) {
    },

    /*
     *   Return the rendered content
     */
    getContent: function() {
        return this.content;
    },

    /*
     *   Creates an empty content
     */
    empty: function() {
        return $("<div/>");
    },

    /*  
     *   Return a specified template
     */
    getTemplate: function(template) {
        return this.workportalFacade.getTemplate(template);
    },

    /*  
     *   Create webpart
     */
    createWebpart: function(params) {
        return this.workportalFacade.workportal.createWebpart(params);
    },

    /*  
     *   Execute webpart
     */
    executeWebpart: function(params) {
        return this.workportalFacade.workportal.executeWebpart(params);
    },
    /**
     *   Manage the error in base class
     */
    manageError: function(msg, defer, canvasError) {
        var self = this;
        var errorMsg = '';
        if (msg.responseText) {
            errorMsg = msg.responseText;
        } else {
            errorMsg = msg;
        }
        if (errorMsg.indexOf("AUTHENTICATION_ERROR") == -1) {
            self.helper.getFailServerErrorDeferred({ message: errorMsg, sharepointProxyPrefix: self.sharepointProxyPrefix }, defer);
            self.endWaiting();
            //en caso de no tener un canvasError el error se despliega en todo el content
            if (canvasError) {
                defer.done(function(value) {
                    canvasError.append(value);
                    self.endWaiting();
                });
            }
            //defer.resolve(msg);
        } else {
            //when it's generate autentication error, cannot load the template
            var content = self.content = "<div class='ui-bizagi-webpart-error-message'>The current user does not exist as a registered user in the bizagi project</div>";
            if (canvasError) {
                canvasError.append(content);
            }
            self.endWaiting();
            defer.resolve(content);
        }
    },


    /**
     *   On waiting. En el area del webpart agrega un div del mismo tama�o y de las mismas coordenadas que el content.

     onWaiting: function () {
        var self = this;
        bizagi.startWaiting(document.getElementById(self.canvas[0].id));
    },
     /**
     *   Off waiting.

     endWaiting: function () {
        var self = this;
        self.canvas.children(".ui-bizagi-sharepoint-loading-container").remove();
    },
     */

    /**
     *   Hide WebPart
     */
    hide: function(hideParent) {
        var self = this;
        self.canvas.hide();
        if (hideParent) {
            self.canvas.parent().hide();
        }
        self.isVisible = false;
    },
    /**
     *    Show WebPart
     */
    show: function() {
        var self = this;
        self.canvas.show();
        self.canvas.parent().show();
        self.isVisible = true;
    },
    /**
     *    visible flat
     */
    isVisible: function() {
        var self = this;
        return self.isVisible;
    },

    destroy: function() {

    },

    getHomeportalFrameworkIntance: function(){
        if(!this.workportalFacade.homePortalFramework){
            this.workportalFacade.homePortalFramework = new bizagi.workportal.homeportalFramework(this.workportalFacade);
        }
        return this.workportalFacade.homePortalFramework;
    }

});
