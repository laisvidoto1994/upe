/*
 *   Name: BizAgi Workportal Desktop Routing Widget Controller
 *   Author: Diego Parra (based on Edward Morales version)
 *   Comments:
 *   -   This script will provide desktop overrides to implement the routing widget
 */

// Auto extend
bizagi.workportal.widgets.renderform.extend("bizagi.workportal.widgets.renderform", {}, {

    /*
     *   Constructor
     */
    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "renderform": bizagi.getTemplate("bizagi.workportal.desktop.widget.renderform").concat("#ui-bizagi-workportal-widget-renderform"),
            useNewEngine: false
        });
    },
    /*
     *   To be overriden in each device to apply layouts
     */
    postRender: function(){ 
        var self = this;
        var content = self.getContent();
        
        self.params.referrerParams = self.params.referrerParams || {};
    	
        // Set instance variables
        self.summaryDisplayed = true;-
    	
        // Set scrollbars
        $("#ui-bizagi-wp-app-render-desc-panel", content).bizagiScrollbar();
        $(".scrollRender", content).bizagiScrollbar({
            autohide:false
        });
    
        // Attach panel slide event
        self.configureSlider();
    
        // Configure header buttons
        self.configureHeader();
        
        // Resize layout
        self.resizeLayout();
    	
            
        //self.renderSummaryTab.scrollabletab();
        // jQuery-ui tabs
        $( "#ui-bizagi-details-tabs",content).tabs().scrollabletab({
            tooltipNext: self.getResource("workportal-scrollabletab-nex"),
            tooltipPrevious:self.getResource("workportal-scrollabletab-prev")
        });
                                
            
        // Add click to view workflow
        $(".ui-bizagi-wp-app-inbox-cases-ico-view",content).click(function(){
            var baseUrl = "App/Cockpit/graphicquery.aspx?analysisType=2&CaseId=";
            window.open(baseUrl+self.params.idCase);
        });
        
        // Bind navigation bar
        // Set idcase data
        $(".back",content).data("idCase",self.getBackCase());
        $(".next",content).data("idCase",self.getNextCase());
        
        // Bind for click event on back and bext botton
        $(".back, .next",content).click(function(){
            var idCase = $(this).data("idCase");
            if( idCase > 0){
                self.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: idCase
                });
            }
        });          
        
        // Bind for click event on refresh botton
        $(".refresh",content).click(function(){
            self.publish("changeWidget", {
                widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER,
                idCase: self.params.idCase,
                idWorkitem: self.params.idWorkitem,
                idTask: self.params.idTask,
                referrer: bizagi.referrerParams.referrer
            }); 
        });
        
        // Bind for click event on return botton
        $(".ui-bizagi-wp-app-inbox-bt-back, #innerContentInbox h2",content).click(function(){
			var widget = bizagi.referrerParams.referrer || bizagi.cookie('bizagiDefaultWidget');
            // switch referer widget
            switch(widget){
                case "inbox":
                    self.publish("changeWidget", { 
                        widgetName : widget,
                        restoreStatus: true
                    });
                    break;
                case "inboxGrid":
                    self.publish("changeWidget", { 
                        widgetName : widget,
                        restoreStatus: true
                    });
                    break;
                case "search":
                    self.publish("executeAction", {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                        radNumber:bizagi.referrerParams.radNumber || "" ,
                        page:bizagi.referrerParams.page || 1 ,
                        onlyUserWorkItems:false
                    });
                    break;
                case "queryform":
                    self.publish("showDialogWidget", {
                        widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
                        queryFormAction: "loadPrevious"
                    });                    
                    break;
                case "folders":
                    var url = bizagi.referrerParams.urlParameters+"&page="+bizagi.referrerParams.page;
                    $.when(self.dataService.getCasesByFolder(url))
                    .done(function(data){
                        data.customized = true; 
                        data.urlParameters = bizagi.referrerParams.urlParameters
                        
                        // Define title of widget
                        data.title = bizagi.referrerParams.name;

                        // Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
                        data.casesGroupedByFolder = true;
                        data.idFolder = bizagi.referrerParams.id;

                        self.publish("changeWidget", {
                            widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
                            data: data,
                            referrerParams: {}
                        });    
                    });
                    break;
                default:
                    self.publish("changeWidget", { 
                        widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                        restoreStatus: true
                    });
                    break;
            }
        });
        
        // Bind for hover event on refresh and return botton
        $(".refresh,.return",content).hover(function(){
            $(this).addClass("active");                    
        },function(){            
            $(this).removeClass("active");                    
        });
        
        // Bind for hover event on next and back botton
        $(".next,.back",content).hover(
        function(){
            if($(this).data("idCase") > 0){
                $(this).addClass("active");                    
            }
        },
        function(){
            $(this).removeClass("active");
        });
        
        if (self.dataService.lastQueryFullKey != null) {
            $("#bt-case-action-showquery", content).click(function() {
                self.publish("showDialogWidget", {
                    widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
                    queryFormAction: "loadPrevious"
                });                    
            
            });
        }
        
        // Bind botton summary actions
        $("#bt-case-action-log",content).click(function(){
            var url ="App/Log/log.aspx?idCase="+self.params.idCase+"&logtype=s";
               
            self.publish("showDialogWidget", {
                widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                widgetURL: url,
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-log")
                },
                afterLoad: function (params) {
                    // This script will execute inside the iframe context
            		
                    // Hack this method because it will try to change iframe location
                    // instead of this we will for to close the current dialog
                    this.backURL = function() {
                        // Close current dialog
                        params.controller.publish("closeCurrentDialog");
                    };
                }
            });                    
        });
            
        $("#bt-case-action-reassing",content).click(function(){                    
            var url ="App/Admin/ListUsers.aspx?WorkItemAdmin="+self.params.idCase+"|"+self.params.idWorkitem+"|&UserAdminAction=2";
               
            self.publish("showDialogWidget", {
                widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                widgetURL: url,
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-reassign")
                },
                onClose: function () {
                    self.executeAction(bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING, {
                        idCase: self.params.idCase,	
                        idWorkitem: self.params.idWorkitem,	
                        idTask: self.params.idTask
                    });
                }
            });                    
        });
            
//        $("#bt-case-action-print",content).click(function(){
//            var url ="App/ListaDetalle/PrintVersion.aspx?PostBack=1&idCase="+self.params.idCase+"&idWorkitem="+self.params.idWorkitem+"&idTask="+self.params.idTask;
//
//
//
//            self.publish("showDialogWidget", {
//                widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
//                widgetURL: url,
//                modalParameters: {
//                    title: bizagi.localization.getResource("render-actions-print")
//                },
//                buttons: [
//                    {
//                        text: bizagi.localization.getResource("workportal-widget-dialog-box-print"),
//                        click: function() {
//                            $(window.frames["iframe"]).focus();
//                            window.frames["iframe"].print();
//                        }
//                    }
//                ]
//            });
//        });
        $("#bt-case-action-print",content).click(function(){
            var url ="App/Admin/ListUsers.aspx?WorkItemAdmin="+self.params.idCase+"|"+self.params.idWorkitem+"|&UserAdminAction=2";

            self.publish("showDialogWidget", {
                widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                widgetURL: url,
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-reassign")
                },
                onClose: function () {
                    self.executeAction(bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING, {
                        idCase: self.params.idCase,
                        idWorkitem: self.params.idWorkitem,
                        idTask: self.params.idTask
                    });
                }
            });
        });
        
        
        
        
        
        $("#bt-case-action-help",content).click(function(){
            var url =$(this).find("#helpUrl").val();
               
            self.publish("showDialogWidget", {
                widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                widgetURL: url,
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-help")
                }
            });                    
        });
    },

    /*
     *   configures the slide event
     */
    configureSlider: function(){
        var self = this;
        var content = self.getContent();
        if (!content) return;
        
        var summaryContainer = self.getComponentContainer("summary");
        var sliderPanel = $("#panelArrowContainer", content);
    	
        sliderPanel.click(function(){
            if(summaryContainer.is(":visible")){
                // Hide left panel
                self.hideSummary();
            
            } else {
                // Show left panel
                self.showSummary();
            }
        });
    },
	
    /*
     *   Hides the summary component
     */
    hideSummary: function(animate) {
        var self = this;
        var content = self.getContent();
        if (!content) return;
    	
        var summaryContainer = self.getComponentContainer("summary");
        var renderPanel = $("#ui-bizagi-wp-app-render-form", content);
        var sliderPanel = $("#panelArrowContainer", content);
        var panelArrow = $("#panelArrow", content);
        
        if (!self.summaryDisplayed) return;
		
        // Hide description panel
        summaryContainer.parent().hide();
        sliderPanel.css("left", "0px");
        renderPanel.addClass("ui-bizagi-state-extended");
        $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "0px");
        
        // Change arrows
        panelArrow.removeClass("panelArrowLeft");
        panelArrow.addClass("panelArrowRight");
		
        // Turn off flag
        self.summaryDisplayed = false;
        
        // Trigger render resize
        if (self.renderingFacade) self.renderingFacade.resize({
            forceResize:  true
        });
    },
	
    /*
     *   Show the summary component
     */
    showSummary: function(animate) {
        var self = this;
        var content = self.getContent();
        if (!content) return;
    	
        var summaryContainer = self.getComponentContainer("summary");
        var renderPanel = $("#ui-bizagi-wp-app-render-form", content);
        var sliderPanel = $("#panelArrowContainer", content);
        var panelArrow = $("#panelArrow", content);
        animate = typeof(animate) !== "undefined" ? animate: false;
		
        if (self.summaryDisplayed) return;
		
        if (animate) {
            // Show description panel
            summaryContainer.parent().show('drop', { }, 500);

            // Resize render layout to set padding 400px
            $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "380px");

            // Run animation
            $.when(sliderPanel.animate({
                left: "380px"
            }, 300))
            .done(function() {
                renderPanel.removeClass("ui-bizagi-state-extended");
            });
		
        } else {
            // Show description panel
            summaryContainer.parent().show();
            $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "380px");
            sliderPanel.css("left", "380px");
            renderPanel.removeClass("ui-bizagi-state-extended");
        }

        // Change arrows
        panelArrow.removeClass("panelArrowRight");
        panelArrow.addClass("panelArrowLeft");
		
        // Turn on flag
        self.summaryDisplayed = true;
    	
        // Trigger render resize
        if (self.renderingFacade) self.renderingFacade.resize({
            forceResize:  true
        });
    },

    /*
     *   Configure header for the widget
     */
    configureHeader: function(){
        var self = this;
        var content = self.getContent();
    
        // Configure back button
        //        $("#ui-bizagi-wp-app-inbox-bt-back", content).click(function() {
        //            self.publish("changeWidget", {
        //                widgetName: bizagi.workportal.currentInboxView
        //            });
        //        });
    },
    	
    	  
    /*
     *   When the window resizes, runs this method to adjust stuff in each controller or widget
     *   Override when needed  
     */
    performResizeLayout: function() {
        var self = this;
        var windowWidth = $(window).width();
    
        // Call base
        this._super();
    	
        // If window width is less or equals 1024 hide the summary
        if (windowWidth <= 1024) {
            if (self.summaryDisplayed) {
                self.hideSummary(false);
            } else {
                // Trigger render resize
                if (self.renderingFacade) self.renderingFacade.resize({
                    forceResize:  true
                });
            }
        
        } else {
            if (!self.summaryDisplayed) {
                self.showSummary(false);
            }
            else {
                // Trigger render resize
                if (self.renderingFacade) self.renderingFacade.resize({
                    forceResize:  true
                });
            }
        }
    },
	
    /*
     *   Opens the workportal old form in a window
     */
    openOldWorkportalForm: function () {
        var self = this;
        var url = BIZAGI_PATH_TO_BASE + "defaulthtml.aspx?FrameURL=App/ListaDetalle/Detalle.aspx?idCase=" + self.params.idCase;
        window.open(url, "oldStyleBizAgi", "width=1024,height=768, Menubar=NO, Location=NO, Status=NO");
    },
    
    /*
     *  Navigation options
     */
    getListKey: function(){
        var self =  this;
        bizagi.lstIdCases = bizagi.lstIdCases || {};
        if(bizagi.lstIdCases.length > 1){
            for(var i=0; i < bizagi.lstIdCases.length; i++){
                if( self.params.idCase == bizagi.lstIdCases[i] ){
                    return i;
                }
            }
        }
        return -1;
    },
    
    getNextCase: function(){
        var self = this;
        var nextIdCase = 0;
        var key = self.getListKey();
        
        // Check if last element 
        if(bizagi.lstIdCases.length == (key+1) || bizagi.lstIdCases.length == 1){
            nextIdCase = -1;
        }else{
            nextIdCase = bizagi.lstIdCases[key+1];            
        }        
        
        return nextIdCase;
    },
    
    getBackCase: function(){
        var self = this;
        var prevIdCase = 0;
        var key = self.getListKey();
        
        // Check if first element 
        if(key == 0){
            prevIdCase = -1;
        }else{
            prevIdCase = bizagi.lstIdCases[key-1];            
        }        
        
        return prevIdCase;
    }
    
});

