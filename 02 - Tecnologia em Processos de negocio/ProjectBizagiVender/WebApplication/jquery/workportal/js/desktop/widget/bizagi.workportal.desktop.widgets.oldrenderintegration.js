/*
 *   Name: BizAgi Workportal Desktop Integration old render within new look and feel
 *   Author: Edward Morales
 *   Comments:
 *   -   This script define base controller to integrate old render within new workportal
 */

// Extends itself
bizagi.workportal.widgets.oldrenderintegration.extend("bizagi.workportal.widgets.oldrenderintegration", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        // Call base
        this._super(workportalFacade, dataService, params);

        // Declare widget variables
        self.taskState = "all"; // general taskState from tabs
        self.icoTaskState = ""; // real staskState from list cases
        self.idWorkflow = 0;
        self.idCase = 0;

        //Load templates
        self.loadTemplates({
            "integration-old-render": bizagi.getTemplate("bizagi.workportal.desktop.widget.oldrenderintegration").concat("#ui-bizagi-workportal-widget-oldrender"),
            useNewEngine: false
        });
    },
    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this,
                content = self.getContent();

        if (self.params.restoreStatus) {
            bizagi.referrerParams = bizagi.referrerParams || {};
        } else {
            bizagi.referrerParams = bizagi.referrerParams ? { page: bizagi.referrerParams.page } : {};
        }

        self.params.taskState = self.params.taskState || bizagi.referrerParams.taskState || "all";


        // Bind navigation bar
        // Set idcase data
        $(".back", content).data("idCase", self.getBackCase());
        $(".next", content).data("idCase", self.getNextCase());

        // Bind for click event on back and bext botton
        $(".back, .next", content).click(function () {
            var idCase = $(this).data("idCase");
            if (idCase > 0) {
                self.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: idCase
                });
            }
        });

        // Bind for click event on refresh botton
        $(".refresh", content).click(function () {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: self.params.idCase,
                idTask: self.params.idTask,
                idWorkItem: self.params.idWorkitem,
                referrer: self.params.referrer || "inboxGrid"
            });
        });

        // Bind for click event on return botton
        $(".ui-bizagi-wp-app-inbox-bt-back, #innerContentInbox > h2", content).click(function () {
            var widget = bizagi.referrerParams.referrer || bizagi.cookie('bizagiDefaultWidget');
            // switch referer widget
            switch (widget) {
                case "inbox":
                    self.publish("changeWidget", {
                        widgetName: widget,
                        restoreStatus: true
                    });
                    break;
                case "inboxGrid":
                    self.publish("changeWidget", {
                        widgetName: widget,
                        restoreStatus: true
                    });
                    break;
                case "search":
                    self.publish("executeAction", {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                        radNumber: bizagi.referrerParams.radNumber || "",
                        page: bizagi.referrerParams.page || 1,
                        onlyUserWorkItems: false
                    });
                    break;
                case "queryform":
                    self.publish("showDialogWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
                        queryFormAction: "loadPrevious"
                    });
                    break;
                case "folders":
                    var url = bizagi.referrerParams.urlParameters + "&page=" + bizagi.referrerParams.page;
                    $.when(self.dataService.getCasesByFolder(url))
                            .done(function (data) {
                                data.customized = true;
                                data.urlParameters = bizagi.referrerParams.urlParameters

                                // Define title of widget
                                data.title = bizagi.referrerParams.name;

                                // Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
                                data.casesGroupedByFolder = true;
                                data.idFolder = bizagi.referrerParams.id;

                                self.publish("changeWidget", {
                                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
                                    data: data,
                                    referrerParams: {}
                                });
                            });
                    break;
                default:
                    self.publish("changeWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                        restoreStatus: true
                    });
                    break;
            }
        });

        // Bind for hover event on refresh and return botton
        $(".refresh,.return", content).hover(function () {
            $(this).addClass("active");
        }, function () {
            $(this).removeClass("active");
        });

        // Bind for hover event on next and back botton
        $(".next,.back", content).hover(
                function () {
                    if ($(this).data("idCase") > 0) {
                        $(this).addClass("active");
                    }
                },
                function () {
                    $(this).removeClass("active");
                });


        // Insert iframe with old render
        self.insertIframeOldRender();
    },
    getInjectJavaScript: function (params) {

        var args = {};
        var callback = function (args) {
            this.changeToWidget = function (widget) {
                args.controller.publish("changeWidget", {
                    widgetName: args.bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
                });
            };

            this.openBACase = function (idCase, sHref) {
                var workitem = null;
                if (sHref.indexOf("idWorkitem=") > -1) {
                    workitem = sHref.substring(sHref.indexOf("idWorkitem=") + 11);
                    workitem = workitem.substring(0, workitem.indexOf("&"));
                }
                // Executes the act on
                args.controller.publish("executeAction", {
                    action: args.routingAction,
                    idCase: idCase,
                    idWorkItem: workitem
                });

                // close dialog
                params.controller.publish("closeCurrentDialog");
            };
        }


        return {
            callback: callback,
            args: {
                routingAction: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                bizagi: bizagi
            }
        }

    },
    insertIframeOldRender: function () {
        var self = this;
        var content = self.getContent();
        var iframe;
        var theme = "bizagiDefault";
        var queryString = bizagi.readQueryString();

        $.each(content, function () {
            if ($(this).is("iframe")) {
                iframe = $(this);
            }
        });

        iframe.load(function () {
            // inject css
            var content = $(this).contents();
            var getInjectJS = self.getInjectJavaScript();

            // Fixed problem with relative path across the different browsers
            var cssLocation = ($.browser.mozilla || $.browser.webkit) ? "../../css/render_%theme%.css" : "css/render_%theme%.css";

            // Define theme
            cssLocation = cssLocation.replace("%theme%", (queryString["theme"] || theme));

            // Append css
            $('head', content).append("<link type='text/css' rel='stylesheet' href='" + cssLocation + "'>");

            iframe.callInside(
                    getInjectJS.callback,
                    $.extend(getInjectJS.args, {
                        controller: self
                    })
                    );

            content.bind('click', function () {
                bizagi.workportal.desktop.popup.closePopupInstance();
            });

            // Append javascript
            $('head', content).append("<script type='text/javascript' src='../../js/renderintegration.js'></script>");

            // Hack position fixed for IE8 in quirks mode
            /*if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
                var fixWizard = '<!--[if lte IE 8]> <style type="text/css"> #floater1Div { position: absolute; bottom: auto; right: auto; top: expression( ( -10 - floater1Div.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + "px" ); left: expression( ( -20 - floater1Div.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + "px" ); } #divClose { bottom: -3px; left: 0; } </style> <![endif]--><!--[if lte IE 7]> <link href="../../css/estilos.css" type="text/css" rel="stylesheet" /> <![endif]-->';
                $('head', content).append(fixWizard);
            }*/

            // Remove all the old elements than doesn't look well
            var $oldElements = $('body img[src*="Button.gif"], body td[style*="CellShadow.gif"], body img[src*="tab_active"], body img[src*="tab_inactive"]', content);
                
            // Remove elements
            $oldElements.parent().remove();

            // Fix scroll bug in FF
            iframe.css('overflow-y', 'auto');

        });
    },
    /*
    *  Navigation options
    */
    getListKey: function () {
        var self = this;
        bizagi.lstIdCases = bizagi.lstIdCases || {};
        if (bizagi.lstIdCases.length > 1) {
            for (var i = 0; i < bizagi.lstIdCases.length; i++) {
                if (self.params.idCase == bizagi.lstIdCases[i]) {
                    return i;
                }
            }
        }
        return -1;
    },
    getNextCase: function () {
        var self = this;
        var nextIdCase = 0;
        var key = self.getListKey();

        // Check if last element
        if (bizagi.lstIdCases.length == (key + 1) || bizagi.lstIdCases.length == 1) {
            nextIdCase = -1;
        } else {
            nextIdCase = bizagi.lstIdCases[key + 1];
        }

        return nextIdCase;
    },
    getBackCase: function () {
        var self = this;
        var prevIdCase = 0;
        var key = self.getListKey();

        // Check if first element
        if (key == 0) {
            prevIdCase = -1;
        } else {
            prevIdCase = bizagi.lstIdCases[key - 1];
        }

        return prevIdCase;
    }
});
