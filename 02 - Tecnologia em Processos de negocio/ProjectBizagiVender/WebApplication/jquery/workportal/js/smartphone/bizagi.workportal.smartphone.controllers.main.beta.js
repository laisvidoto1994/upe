/*
*   Name: BizAgi Workportal Smartphone Main Controller
*   Author: oscaro
*   Comments:
*   -   This script will override main controller class to apply custom stuff just for tablet device
*/

// Auto extend
bizagi.workportal.controllers.controller.extend("bizagi.workportal.controllers.main", {
    PROJECT: "bzsmartphone"
}, {
    /* 
    *   Constructor
    */
    init: function (workportalFacade, dataService) {
        this._super(workportalFacade, dataService);
        this.project = this.Class.PROJECT;
        bizagi.workportal.controllers.instances = {};
        bizagi.workportal.controllers.instances.main = this;
    },
    /*
    * use old base
    */
    setWidget: function (params) {
        bizagi.log("not allowd setWidget" + params);
    },
    /*
    * get the templates principal and menu for app mobile 
    */
    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("base");
        var content = self.content = $.tmpl(template);
        var menu = self.menu = self.workportalFacade.getMenuController();
        $.when(menu.render())
        .done(function () {
            // Build menu
            menu.getContent().appendTo(self.getComponentContainer("menu"));
        });
        return content;
    },
    /*
    * load postRender in webparts 
    */
    postRender: function (params) {
        bizagi.util.smartphone.startLoading();
        var self = this, processCanvas = "", casesCanvas = "", renderCanvas = "",
            content = self.getContent();
        //bug in jquery 2.0  in html elements
        for (var counter = 0; counter <= content.length; counter++) {
            var tmpelement = content[counter];
            if (tmpelement && tmpelement.id) {
                if (tmpelement.id == "workarea") {
                    processCanvas = $(tmpelement).find("#webpart-process");
                }
                if (tmpelement.id == "workarea") {
                    casesCanvas = $(tmpelement).find("#webpart-cases");
                }
                if (tmpelement.id == "render") {
                    renderCanvas = $(tmpelement);
                }
                if (tmpelement.id == "newcase") {
                    ncasesCanvas = $(tmpelement);
                }
            }
        }
        //end  jquery bug
        self.enableSuscriber();
        self.postRenderProcess($.extend(params, { canvas: processCanvas }));
        self.postRenderRender($.extend(params, { canvas: renderCanvas }));
        self.postRenderNewCases($.extend(params, { canvas: ncasesCanvas }));
        self.postRenderCases($.extend(params, { canvas: casesCanvas }));


    },
    /*
    * add suscriber(listener for events)
    */
    enableSuscriber: function () {
        var self = this;
        self.subscribe("popup", self._showPopUp);
        self.subscribe("bz-create-view", self._eventRenderEdition);
        self.subscribe("bz-create-actionsheet", self._eventCreateActionSheet);
        self.subscribe("bz-newcase-render", self._renderNewCase);
        self.subscribe("bz-enable-newcase", self._enableNewCase);
        self.subscribe("executeAction", self._executeAction);

    },
    /*
    * execute webpart process
    */
    postRenderProcess: function (params) {
        var self = this;
        self.executeWebpart({
            webpart: "process",
            canvas: params.canvas,
            project: self.Class.PROJECT
        }).done(function (result) {
            self.process = result;
        });
    },
    /*
    * execute webpart cases and enable inbox
    */
    postRenderCases: function (params) {
        var self = this;
        self.executeWebpart({
            webpart: "cases",
            canvas: params.canvas,
            project: self.Class.PROJECT
        }).done(function (result) {
            self.cases = result;
            bizagi.util.smartphone.stopLoading();
            self.enableInbox();
        });
    },
    /*
    * execute webpart render and add event to menu in the view
    */
    postRenderRender: function (params) {
        var self = this;
        self.executeWebpart({
            webpart: "render",
            canvas: params.canvas,
            project: self.Class.PROJECT
        }).done(function (result) {
            self.render = result;
        });

        $("#bz-render-back", params.canvas).on("click", function () {
            bizagi.util.smartphone.startLoading();
            self.publish("bz-webparts-back", { project: self.project, callback: function (params) {
                // if (bizagi.kendoMobileApplication.pane.history[bizagi.kendoMobileApplication.pane.history.length - 2] == "newcase") {
                //   bizagi.kendoMobileApplication.bizagiNavigate("workarea");
                //   return;
                // }
                //  bizagi.kendoMobileApplication.bizagiNavigate("#:back");
                bizagi.kendoMobileApplication.bizagiNavigate("workarea");
            }
            });
        });
        $("#bz-render-next", params.canvas).on("click", function () {
            self.publish("bz-webparts-click-btn", { project: self.project, controller: self });
            bizagi.util.smartphone.startLoading();
        });


    },
    /*
    * execute webpart new Case and add event to menu in the view
    */
    postRenderNewCases: function (params) {
        var self = this;
        self.executeWebpart({
            webpart: "newcase",
            canvas: params.canvas,
            project: self.Class.PROJECT
        }).done(function (result) {
            self.newcase = result;
            bizagi.util.smartphone.stopLoading();
            // self.kendo.nc = $("#newcase").data("kendoMobileView");
            // self.kendo.nc.bind("beforeShow", function () {console.info("BEFORE SHOW") })
        });

        $("#bz-nc-back", params.canvas).on("click", function () {
            // bizagi.kendoMobileApplication.bizagiNavigate("workarea");
            bizagi.kendoMobileApplication.bizagiNavigate("#:back");
        });

    },
    /*
    *  call the function in the facade
    */
    executeWebpart: function (params) {
        return this.workportalFacade.executeWebpart(params);
    },

    /*
    * Enable the inbox (menu,cases, process) 
    * remove temporal view
    * extend the drawer (event menu swipe) when close 
    */
    enableInbox: function () {
        var self = this;
        var menutmp = $("#menu");
        self.drawer = menutmp.kendoMobileDrawer().data("kendoMobileDrawer");

        if (bizagi.util.isIphoneAndLessIOS6() == true) {// typeof cordova  === undefined ya que en el navegador del 7 si se ve el espacio
            $(".km-ios7-space").removeClass("km-ios7-space");
        }
        bizagi.kendoMobileApplication.bizagiNavigate("workarea", "none");

        //hide the filter for processes
        var workarea = $("#workarea").data("kendoMobileView");
            workarea.scroller.scrollTo(0, -50);

         workarea.bind("beforeShow", function () {
             workarea.scroller.scrollTo(0, -50);
         });

        var element = $("#initKendo");
        element.data("kendoMobileView").destroy();
        element.remove();


        self.drawer.bind("hide", function () {
            setTimeout(self.menu._hideMenu, 500);
        });

        self.menu.closeMenu = function () {
            self.drawer.hide();
            setTimeout(self.menu._hideMenu, 700);
        };

        //        element = $("#workarea").data("kendoMobileView");

        //        element.bind("hide", function () {
        //            self.cases.disable();
        //        });
        //        element.bind("beforeShow", function () {
        //            self.cases.enable();
        //         });

    },

    /*
    * Internal method private: user for create a view temporal 
    * and include a element html the use common -> render- render edition item
    * structure of params : {}
    */
    _eventRenderEdition: function (args, params) {
        var self = bizagi.workportal.controllers.instances.main;
        var reference = $.tmpl(self.workportalFacade.getTemplate("render.edition"), { id: bizagi.util.randomNumber() });

        var baseElement = $(".bz-container-render-edition", reference);
        baseElement.html(params.inputEdition);

        $("body").append(reference);
        reference.kendoMobileView();

        reference.find(".km-navbar").data("kendoMobileNavBar").title(params.label);
        bizagi.kendoMobileApplication.navigate(reference[0].id);

        var actionCommon = function () {
            bizagi.kendoMobileApplication.bizagiNavigate("render");
            //delete node
            reference.data("kendoMobileView").destroy();
            reference.remove();
        };
        $(".bz-renderedition-back", reference).on("click", function () {
            params.back();
            actionCommon();
        });
        $(".bz-renderedition-next", reference).on("click", function () {
            params.next(params.ref);
            actionCommon();
        });
    },
    /*
    * the action sheet is the visual efect when show button from the bottom
    * 
    */
    _eventCreateActionSheet: function (args, params) {
        var self = bizagi.workportal.controllers.instances.main;
        var reference = $.tmpl(self.workportalFacade.getTemplate("render.actionsheet"), params);
        $("body").append(reference);

        window.kendo.mobile.ui.ActionSheet.fn._click = function (n) {
            var tmp = $(n.currentTarget).data("id");
            if (!n.isDefaultPrevented()) {
                if (tmp) {
                    params.callback(tmp, params.ref);
                }
                this.close();
                this.destroy();
            }
        };
        reference.kendoMobileActionSheet();
        var dataelement = reference.data("kendoMobileActionSheet");
        dataelement.open();

    },

    /*
    * extend posibitlitys for mehtod _eventRenderEdition
    */
    _createView: function (args, params) { },
    /*
    * when render new canse this methos is call
    */
    _renderNewCase: function (args, params) { },
    /*
    *
    */
    _enableNewCase: function (args, params) {
        var self = this;
        bizagi.workportal.controllers.instances.main.newcase.reset();
        $("#menu").data("kendoMobileDrawer").hide();
        bizagi.kendoMobileApplication.bizagiNavigate("newcase");

    },
    /*
    * create a dinamic popup 
    * parameter popup: {}
    *  
    */
    _showPopUp: function (event, parameters) {
        //not posible use context 
        var self = bizagi.workportal.controllers.instances.main;
        var reference = $.tmpl(self.workportalFacade.getTemplate("base.popup"), { id: bizagi.util.randomNumber() });
        var container = $(".modalview-scrollercontent", reference);
        container.html(parameters.html);
        $("body").append(reference);
        reference.kendoMobileModalView();
        self.datapop = reference.data("kendoMobileModalView");
        //self.datapop = baseelement.data("kendoMobileModalView");
        /* if (self.datapop == null) {
        reference.kendoMobileModalView();
        self.datapop = reference.data("kendoMobileModalView");
        }*/
        parameters.callbackEvents(container, $.extend(parameters, { closepopup: function () {
            var baseelement = $("#modalview-bizagi");
            var dataelement = baseelement.data("kendoMobileModalView");
            self.datapop.close();
            self.datapop.destroy();
            //container.empty();
        }
        }));
        self.datapop.open();
    },
    /*
    * execute action for search or routing
    */
    _executeAction: function (args, parameters) {
        var self = this;
        var actionController = bizagi.workportal.controllers.instances.main.workportalFacade.getAction(parameters.action);
        // Executes the action
        actionController.execute(parameters);

    }


});
