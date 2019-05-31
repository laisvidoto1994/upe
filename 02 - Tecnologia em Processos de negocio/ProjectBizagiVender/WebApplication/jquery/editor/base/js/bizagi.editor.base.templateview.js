/*
*   Name: BizAgi FormModeler Editor TemplatteView
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for templates view
*/

bizagi.editor.modelerView.extend("bizagi.editor.templateView", {}, {
    /*
    *   Creates a new template instance, accepts the  following params
    *   -   html
    *   -   css
    *   -   data
    */
    init: function (params) {
        var self = this;
        
        // Call base
        self._super(params);
        
    },

    /*
    *   Loads a persistence model
    */
    load: function (dataModel) {
        var self = this;
        // Wait until controller is ready
        $.when(this.controller.ready())
            .done(function () {
                self.executeCommand({ command: "loadModel", dataModel: dataModel, canUndo: false });
            });
    },

    /*
    *   Save a persistence model
    */
    save: function () {
        var self = this;

        // Assumes the component is ready, so we don't have to use ready check
        var args = { command: "saveModel", dataModel: {}, canUndo: false };
        self.executeCommand(args);

        return args.dataModel;

    },

    /*
    *   Performs validation process and save form
    */
    validateAndSaveForm: function () {
        var self = this;

        // Assumes the component is ready, so we don't have to use ready check
        self.performSave(true);

    },


    /*
    *   Update Nested Form
    */
    updateForm: function (data) {
        var self = this,
            args;

        // Assumes the component is ready, so we don't have to use ready check
        args = { command: "updateModel", data: data, canUndo: false };
        self.executeCommand(args);
    },

    /*
    *  Set original model
    */
    setOriginalModel: function () {
        var self = this;

        $.when(this.controller.ready())
            .done(function () {
                self.controller.setOriginalModel();
            });
    },

    /*
    *   Process modeler view layout
    */
    processLayout: function (params) {
        var self = this;
        var defer = new $.Deferred();        

        // Process main layout
        self.mainContainer = $("<form-modeler />").attr("id", "container-layout");
        self.mainContainer.appendTo(params.canvas || "body");

        self.configureHtmlPage();

        var layoutPresenter = new bizagi.editor.component.layout.presenter({ canvas: self.mainContainer, context: params.context, isActivityForm: params.isActivityForm });

        $.when(layoutPresenter.render())
            .done(function () {                
                
                setTimeout(function () {
                    // Configure left section (tabs)
                    self.configureLeftPane();

                    // Render ribbon
                    self.drawRibbon();
                    
                    // Configure rendering view
                    self.configureTemplateView();

                    //Show User information Message
                    if (self.controller.isReadOnlyForm()) {
                        self.showUserInformation();
                    }

                    defer.resolve();
                }, 100)                                
               
            });

        return defer.promise();
    },

    /*
    *   Configure html page, in order to add attributes and classes
    */
    configureHtmlPage: function () {
        var self = this;
        // Add top classes        
        self.mainContainer.addClass("biz-template-editor");
        self.mainContainer.addClass("biz-font").addClass("biz-normal-font").addClass("biz-text-color");
        $('body').attr('oncontextmenu', "return false");
    },

    configureLeftPane: function () {
        var self = this;
        // Show tabs            
        $.when(           
            self.drawXpathNavigator()                        
        ).done(function () {
                            
            // Adds tab plugin
            self.mainContainer.find("#left-panel").tabs({});
            
            self.mainContainer
                .find("#left-panel li[tabindex]:gt(0)")
                .remove();
                
                
        });
    },
    /*
    *
    */
    configureKeyHandlers: function () {
        var self = this;

        $(document).keydown(function (e) {
        }).keyup(function (e) {
            if (e.keyCode === 46) {
                if (!$(document.activeElement).is('input, textarea')) {
                    self.deleteElement();
                }
            }
        });

        // Como en awesomium no es posible acceder a event.ctrlKey se crean estos eventos globales
        $(document).on("keydown", function (event) {
            if (event.keyCode == 17) {
                self.controller.setCtrlKey(true);
            }
        });
        $(document).on("keyup", function (event) {
            if (self.controller.isCtrlKeyPressed()) {
                self.controller.setCtrlKey(false);
            }
        });
    },

    /*
    *   Check if needs to refresh rendering view when changing a tab in the left pane
    */
    needsRedrawAfterTabChange: function (currentTab) {
        var self = this;
        // When changing from layout tab to another
        if (self.currentTabIndex < 2 && currentTab === 2) return true;
        // When changing to layout tab from another
        if (self.currentTabIndex === 2 && currentTab < 2) return true;
        // Another change, no need to refresh
        return false;
    },

    setBannerVisibility: function (ui) {
        var self = this;
        var visibility = (ui) ? $('a', ui.newTab).attr('data-banner') : 'hide';

        if (visibility === 'show') {
            self.showBanner();
        } else {
            self.hideBanner();
        }
    },

    /*
    *   Reacts to refresh commands, executes actions necessary to render
    */
    preRender: function (args) {
        var self = this;

        if (self.validateForm && args.canValidate) {
            self.processTemplateValidations({ canRefresh: false });
        }
    },

    /*
    *   Reacts to refresh commands, and renders the view, after model changes
    */
    render: function (args, renderingMode) {
        var self = this;

        self.renderTemplate(args, renderingMode);
       
    },

    /*
    *   Reacts to refresh commands, executes actions after rendering the view
    */
    postRender: function () {
        var self = this;

        var guid = null;
        if (self.controller.thereAreMultiselection()) {
            guid = bizagi.editor.utilities.getGuidEmpty();
        }

        self.refreshRibbon(guid);
    },


    /*
    *   Refresh Styles for Form Canvas
    */
    refreshCanvas: function () {
        var mainPanel, wrapperPanel, canvasPercent, containerForm, topScrollMain, bottomScrollMain;

        mainPanel = $("#main-panel");
        wrapperPanel = $('.wrapper-main-scroll');
        canvasPercent = 1;
        containerForm = $('> .bz-design-template', mainPanel);

        topScrollMain = $('.top-scroll-grad', wrapperPanel);
        bottomScrollMain = $('.bottom-scroll-grad', wrapperPanel);

        // Adjust values
        var paddingMainPanel = parseFloat(mainPanel.css('padding-top')) + parseFloat(mainPanel.css('padding-bottom'));
        var containerCanvasHeight = Math.floor((wrapperPanel.height() * canvasPercent) - paddingMainPanel);

        //position Scroll Top Gradient and Scroll bottom Gradient
        var positionTopGraMain = wrapperPanel.position().top;
        var positionBottomGraMain = (wrapperPanel.position().top + wrapperPanel.outerHeight(true)) - bottomScrollMain.height();

        // Style main panel
        var containerFormScrollHeight = containerForm.prop('scrollHeight');

        if (containerFormScrollHeight > containerCanvasHeight) {
            mainPanel.addClass("biz-auto-height");
            bottomScrollMain.css('top', positionBottomGraMain).css('width', wrapperPanel.width());
            bottomScrollMain.show();
            topScrollMain.css('top', positionTopGraMain).css('width', wrapperPanel.width());
            topScrollMain.show();

        } else {
            bottomScrollMain.hide();
            topScrollMain.hide();
            mainPanel.removeClass("biz-auto-height");
        }

        if (mainPanel.hasClass('biz-auto-height')) {
            $('.top-scroll-grad', wrapperPanel).mouseover(function () {
                if (!bizagi.util.autoScrollInterval.init) {
                    bizagi.util.autoScrollTopInterval(wrapperPanel, 'panelOver', 'scrollGrad');
                }
            }).mouseleave(function () {
                if (!bizagi.util.autoScrollInterval.init) {
                    bizagi.util.removeAutoScroll('panelOver', 'scrollGrad');
                }
            });

            $('.bottom-scroll-grad', wrapperPanel).mouseover(function () {
                if (!bizagi.util.autoScrollInterval.init) {
                    bizagi.util.autoScrollBottomInterval(wrapperPanel, 'panelOver', 'scrollGrad');
                }
            }).mouseleave(function () {
                if (!bizagi.util.autoScrollInterval.init) {
                    bizagi.util.removeAutoScroll('panelOver', 'scrollGrad');
                }
            });
        }


    },

    /*
    *  Renders the template
    */
    renderTemplate: function (args, renderingMode) {
        var self = this;

        //self.refreshRenderingView(args, renderingMode);
        self.showRenderingModel();
    },

    /*
    *   Renders the form dummy
    */
    renderForm: function (args, renderingMode) {
        var self = this;
        var mainPanel = $("#main-panel");

        self.refreshRenderingView(args, renderingMode);

        if (self.controller.isActivityForm()) {
            self.refreshButtonEditor();

            //trigger this in all widgets (userfileds) that use timeouts or deferreds to be completed to refresh again the canvas and avoid unwanted behaviours
            if (self.renderingMode == "design") {
                mainPanel.on("widgetComplete", function () {
                    self.refreshCanvas();
                });
            }

            self.refreshCanvas();
        }
    },

    /*
    *   Renders the search form
    */
    renderSearchForm: function (renderingMode) {
        // Render the filters
        this.refreshRenderingView(renderingMode);

        // Render the results
        this.refreshSearchFormResult();
    },

    /*
    *   Refreshes the grid column editor, when we are on grid context
    */
    renderGridColumnEditor: function () {
        this.refreshGridColumnEditor();
    },

    /*
    *   Enables the layout tab
    */
    enableLayoutTab: function () {
        var self = this;
        self.mainContainer.find("#left-panel").tabs("option", "disabled", []);
    },

    /*
    *   Disables layout tab
    */
    disableLayoutTab: function () {
        var self = this;
        self.mainContainer.find("#left-panel").tabs("option", "disabled", [2]);
    }

});
    
