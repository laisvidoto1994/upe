/*
*   Name: BizAgi FormModeler Editor ModelerView
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for modeler view
*/

bizagi.editor.view.extend("bizagi.editor.modelerView", {}, {
    /*
    *   Creates a new modeler instance, accepts the  following params
    *   -   context(form, searchform, queryform)
    *   -   contextentity
    *   -   scopedefinition
    *   -   data
    */
    init: function (params) {
        var self = this;
        params = params || {};

        // Set current rendering mode
        self.renderingMode = "design";

        // Define current state of validation flag
        self.validateForm = false;

        // Call base
        self._super(params);

        // Define of current tab selected
        self.currentTabIndex = 0;

        // Set current editor language
        bizagi.editorLanguage = { displayname: "default", IsRightToLeft: false, key: "default" };

        // WE CAN LEAVE THIS ONE; BECAUSE IT IS ONLY FOR THE WAIT OPERATION
        var renderArea = $('body');
        var model = { message: bizagi.localization.getResource("formmodeler-component-wait-message-loading-form") };
        var presenter = new bizagi.editor.component.wait.presenter({ model: model, renderArea: renderArea });

        // Wait until controller is ready
        $.when(this.controller.ready(), presenter.render())
            .done(function () {
                // Process view layout
                $.when(self.processLayout(params))
                    .done(function () {
                        setTimeout(function() {
                            presenter.destroy();
                        }, 100)
                    });
            });

        // If the modeler was created with some data, then load the model
        if (params.data) {
            self.load(params.data);
        }

        //If the model has the property Autogenerate then
        if (params.autoGenerate) {
            self.autoGenerate();
        }

        self.setOriginalModel();

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
    *   Autogenerate the form
    */
    autoGenerate: function() {
        var self = this;
        // Wait until controller is ready
                
        $.when(this.controller.ready())
            .done(function () {
                $.when(self.controller.getXpathNavigatorModel())
                    .done(function (xpathModel) {
                        var rootNode;
                        var processEntityId = xpathModel.getProcessEntityId();

                        if (processEntityId) {
                            xpathModel.getProcessEntityModel();
                            var model = xpathModel.getRootNode() || {};
                            if ($.isArray(model.nodes)) {
                                rootNode = model.nodes[0];

                                if (rootNode) {
                                    $.when(xpathModel.getChildren(rootNode.id))
                                        .done(function () {
                                            self.executeCommand({ command: "addEntityChildren", node: rootNode, canUndo: false });
                                        });
                                }
                            }
                        }
                        else {
                            rootNode = xpathModel.getRootNode();
                            self.executeCommand({ command: "addEntityChildren", node: rootNode, canUndo: false });
                        }
                    });                
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
        self.configureHtmlPage(params);

        // Process main layout
        // IF THERE IS NO CANVAS THIS LINE WILL ADD THE MAIN CONTAINER TO 'BODY' 
        self.mainContainer = $("<form-modeler />").appendTo(params.canvas || "body");        

        self.mainContainer.attr("id", "container-layout");
        var layoutPresenter = new bizagi.editor.component.layout.presenter({ canvas: self.mainContainer, context: params.context, isActivityForm: params.isActivityForm });

        $.when(layoutPresenter.render())
            .done(function () {
               
                
                // Wait to model updated
                setTimeout(function () {
                    // Configure left section (tabs)
                    self.configureLeftPane();

                    // Render ribbon
                    self.drawRibbon();

                    // Configure search result view
                    if (self.controller.isSearchFormContext()) {
                        self.drawSearchResultEditor();
                    }

                    // Configure activity form view
                    if (self.controller.isActivityForm()) {
                        self.drawButtonEditor();
                    }

                    //Show User information Message
                    if (self.controller.isReadOnlyForm()) {
                        self.showUserInformation();
                    }
                    self.configureKeyHandlers();

                    // Configure rendering view                  
                    $.when(self.configureRenderingView())
                        .done(function() {
                            defer.resolve();
                        })
                   
                }, 100);
                

                
            });

        return defer.promise();
    },

    /*
    *   Configure html page, in order to add attributes and classes
    */
    configureHtmlPage: function () {        
        // Add top classes
        $("html").addClass("biz-work-area");
        $("body").addClass("biz-font").addClass("biz-normal-font").addClass("biz-text-color");
        $('body').attr('oncontextmenu', "return false");
    },

    configureLeftPane: function () {
        var self = this;
        // Show tabs            
        $.when(
            self.drawControlsNavigator(),
            self.drawXpathNavigator(),           
            self.drawLayoutNavigator(),
            self.drawBanner()
        ).done(function () {
            // Adds tab plugin
            self.mainContainer.find("#left-panel").tabs({
                beforeActivate: function (event, ui) {
                    var renderingMode = $('a', ui.newTab).data("rendering-mode");
                    // Hide properties
                    self.hidePropertyBox();

                    // Check if a render view refresh needs to be performed
                    if (self.needsRedrawAfterTabChange(ui.newTab.index())) {
                        self.currentSelectedElement = null;
                        self.controller.removeSelectedElement();
                        self.renderingMode = renderingMode;
                        self.render(renderingMode);
                    }
                    // Save current tab index
                    self.currentTabIndex = ui.newTab.index();
                    self.setBannerVisibility(ui);
                }
            });
            self.setBannerVisibility();
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
        var defer = new $.Deferred();

        if (self.validateForm && args.canValidate) {
            return self.processValidations({ canRefresh: false });
        }

        return defer.resolve();
    },

    /*
    *   Reacts to refresh commands, and renders the view, after model changes
    */
    render: function (args, renderingMode) {
        var self = this;
        var context = self.controller.getContext();
        if (context == "form") {
            self.renderForm(args, renderingMode);
        } else if (context == "searchform") {
            self.renderSearchForm(renderingMode);
        } else if (context == "grid" || context == "offlinegrid" || context == "adhocgrid") {
            self.renderGridColumnEditor();
        } else if (context == "offlineform") {
            self.renderForm(args, renderingMode);
        } else if (context == "queryform") {
            self.renderForm(args, renderingMode);
        } else if (context == "startform") {
            self.renderForm(args, renderingMode);
        } else if (context == "adhocform") {
            self.renderForm(args, renderingMode);
        }
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
        var self = this;
        var mainPanel, wrapperPanel, canvasPercent, containerForm, topScrollMain, bottomScrollMain;

        mainPanel = $("#main-panel");
        wrapperPanel = $('.wrapper-main-scroll');
        canvasPercent = 1;
        containerForm = $('> .ui-bizagi-container-form', mainPanel);

        topScrollMain = $('.top-scroll-grad', wrapperPanel);
        bottomScrollMain = $('.bottom-scroll-grad', wrapperPanel);

        // Adjust values
        var paddingMainPanel = parseFloat(mainPanel.css('padding-top')) + parseFloat(mainPanel.css('padding-bottom'));
        var containerCanvasHeight = Math.floor((wrapperPanel.height() * canvasPercent) - paddingMainPanel);

        //position Scroll Top Gradient and Scroll bottom Gradient
        var customizedTop = self.controller.getContext() == "adhocform" ? 96 : 0;
        var customizedWidth = self.controller.getContext() == "adhocform" ? wrapperPanel.width() + 20 : wrapperPanel.width();
        var positionTopGraMain = wrapperPanel.position().top + customizedTop;
        var positionBottomGraMain = (wrapperPanel.position().top + wrapperPanel.outerHeight(true)) - bottomScrollMain.height() + customizedTop;

        // Style main panel
        var containerFormScrollHeight = containerForm.prop('scrollHeight');

        if (containerFormScrollHeight > containerCanvasHeight) {
            mainPanel.addClass("biz-auto-height");
            bottomScrollMain.css('top', positionBottomGraMain).css('width', customizedWidth);
            bottomScrollMain.show();
            topScrollMain.css('top', positionTopGraMain).css('width', customizedWidth);
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

            setTimeout(function () {
                self.refreshCanvas();
            }, 500);
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
    
