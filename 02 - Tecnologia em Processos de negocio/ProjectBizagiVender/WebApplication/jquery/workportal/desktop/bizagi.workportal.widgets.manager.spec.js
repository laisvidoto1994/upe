describe('widgets.manager', function () {
    checkWorkportalDependencies();
    var manager, $layout;

    beforeEach(function () {
        var notifications = new bizagi.INotifications();
        manager = new bizagi.workportal.widgets.manager(dependencies.workportalFacade, dependencies.dataService, notifications, {});
        $layout = '<div id="contentLinks" class="proc col-sm-3 col-md-3 col-lg-3 col-xl-2 ui-bizagi-component-loading ui-bizagi-component-adjustable" data-loading="true" data-adjustable="true">' +
            '<div id="home-links" class="ui-bizagi-layout container-fluid default" layout="links"></div>' +
                '</div>' +
                    '<div id="dashboard-panel" class="col-sm-9 col-md-9 col-lg-9 col-xl-10 ui-bizagi-component-adjustable" data-adjustable="true">' +
                        '<div id="navigation-panel" class="ui-bizagi-layout row" layout="navigator">' +
                            '<div id="navbar"></div>' +
                                '</div>' +
                                    '<div id="content-homeportal" class="row ui-bizagi-component-adjustable" data-adjustable="true">' +
                                        '<div id="home-content" class="ui-bizagi-layout  ui-bizagi-component-loading ui-bizagi-component-adjustable" layout="content" data-loading="true" data-adjustable="true"><div class="ui-bizagi-loading-message" style="position: relative;"><div class="ui-bizagi-loading-message-center" style="position: absolute; top: 48%; left: 48%; display: ;"><div class="ui-bizagi-loading-icon"></div></div></div></div>' +
                                            '</div>' +
                                                '</div>';

        $layout = $($layout);

    });

    describe('Initialization', function () {

        it('An layout should be provided', function () {
            manager.setLayout($layout);

            expect(manager._layouts.length).toBe(3);
            expect(manager._widgets['links']).toBeDefined();
            expect(manager._widgets['navigator']).toBeDefined();
            expect(manager._widgets['content']).toBeDefined();

            expect(manager._widgets['navigator'].layout).toEqual('navigator');
            expect(manager._widgets['navigator'].canvas[0].outerHTML).toEqual('<div id="navigation-panel" class="ui-bizagi-layout row" layout="navigator"><div id="navbar"></div></div>');
        });
    });

    describe('Basic Behaviour', function () {
        var stubManager, home;
        beforeEach(function () {
            manager._widgets = {};
            manager._innerWidgets = {};
            manager._mainWidgets = {};
            manager._context = "none";
            manager._layouts = [];

            home = {
                data: {
                    widgets: {
                        "dashboard": {
                            "layout": "content",
                            "name": "bizagi.workportal.widgets.dashboard"
                        },
                        "stuff": {
                            "layout": "dashboard",
                            "name": "bizagi.workportal.widgets.stuff",
                            "canvas": "stuff"
                        },
                        "navigator": {
                            "layout": "navigator",
                            "name": "bizagi.workportal.widgets.navigator"
                        },
                        "sidebar": {
                            "layout": "links",
                            "name": "bizagi.workportal.widgets.sidebar"
                        },
                        "usersummary": {
                            "layout": "sidebar",
                            "name": "bizagi.workportal.widgets.usersummary",
                            "canvas": "sidebarcontent"
                        }
                    },
                    nav: { level: 0 }
                },
                context: "HOME"
            };

            manager.setLayout($layout);
            stubManager = sinon.stub(manager, '_render');
            sinon.spy(manager, '_searchWidgets');
            sinon.spy(manager, '_changeWidget');
            sinon.spy(manager, '_setContext');
        });

        afterEach(function () {
            manager._render.restore();
            manager._searchWidgets.restore();
            manager._changeWidget.restore();
            manager._setContext.restore();
        });

        it('When UpdateView is invoked should register the main widgets and the inner widgets', function () {

            var widgets = home.data.widgets;
            manager.updateView(home);

            expect(manager._searchWidgets.called).toBe(true);
            expect(manager._searchWidgets.calledWith(widgets)).toBe(true);

            // Main widgets
            expect(manager._mainWidgets['content'].widgetName).toEqual('bizagi.workportal.widgets.dashboard');
            expect(manager._mainWidgets['links'].widgetName).toEqual('bizagi.workportal.widgets.sidebar');
            expect(manager._mainWidgets['navigator'].widgetName).toEqual('bizagi.workportal.widgets.navigator');

            //inner widgets
            expect(manager._innerWidgets['content'].length).toEqual(1);
            expect(manager._innerWidgets['links'].length).toEqual(1);
            expect(manager._innerWidgets['navigator']).not.toBeDefined();

            expect(manager._innerWidgets['content'][0].widgetName).toEqual('bizagi.workportal.widgets.stuff');
            expect(manager._innerWidgets['content'][0].canvas).toEqual('stuff');

            expect(manager._innerWidgets['links'][0].widgetName).toEqual('bizagi.workportal.widgets.usersummary');
            expect(manager._innerWidgets['links'][0].canvas).toEqual('sidebarcontent');

        });


        it('When UpdateView is invoked should change the view with the widgets defined', function () {
            manager.updateView(home);

            expect(manager._changeWidget.called).toBe(true);
            expect(manager._changeWidget.calledThrice).toBe(true);

            var argsFirstCall = manager._changeWidget.firstCall.args[0];
            expect(argsFirstCall.layout).toEqual('content');
            expect(argsFirstCall.widgetName).toEqual('bizagi.workportal.widgets.dashboard');
            expect(argsFirstCall.args).toEqual({});

            var argsSecondCall = manager._changeWidget.secondCall.args[0];
            expect(argsSecondCall.layout).toEqual('navigator');
            expect(argsSecondCall.widgetName).toEqual('bizagi.workportal.widgets.navigator');
            expect(argsSecondCall.args).toEqual({});

            var argsThirdCall = manager._changeWidget.thirdCall.args[0];
            expect(argsThirdCall.layout).toEqual('links');
            expect(argsThirdCall.widgetName).toEqual('bizagi.workportal.widgets.sidebar');
            expect(argsThirdCall.args).toEqual({});

        });

        it('The context should be updated', function () {
            manager.updateView(home);

            expect(manager._setContext.called).toBe(true);
            expect(manager._setContext.calledWith(home.context));
        });
    });

    describe('Creation of widgets', function () {

        it('Each instance created of any widget should have at least 3 events linked', function () {
            // The events are notify, showDialogWidget, showNotification

            var instance = manager._createWidgetInstance('bizagi.workportal.widgets.dashboard', {});

            var events = $._data(instance.observableElement[0], 'events');
            expect(events.notify).toBeDefined();
            expect(events.showDialogWidget).toBeDefined();
            expect(events.showNotification).toBeDefined();

        });

        it('if the widget does not exist an exception should be to launch', function () {

        });
    });


    describe('Render the widgets defined in the current context', function () {
        var stubManager, home;
        beforeEach(function () {
            manager._widgets = {};
            manager._innerWidgets = {};
            manager._mainWidgets = {};
            manager._context = "none";
            manager._layouts = [];

            home = {
                data: {
                    widgets: {
                        "dashboard": {
                            "layout": "content",
                            "name": "bizagi.workportal.widgets.dashboard"
                        },
                        "stuff": {
                            "layout": "dashboard",
                            "name": "bizagi.workportal.widgets.stuff",
                            "canvas": "stuff"
                        },
                        "navigator": {
                            "layout": "navigator",
                            "name": "bizagi.workportal.widgets.navigator"
                        },
                        "sidebar": {
                            "layout": "links",
                            "name": "bizagi.workportal.widgets.sidebar"
                        },
                        "usersummary": {
                            "layout": "sidebar",
                            "name": "bizagi.workportal.widgets.usersummary",
                            "canvas": "sidebarcontent"
                        }
                    },
                    nav: { level: 0 }
                },
                context: "HOME"
            };

            manager.setLayout($layout);
            stubManager = sinon.stub(manager, '_render');
            sinon.spy(manager, '_createWidgetInstance');
            sinon.spy(manager, '_createInnerWidgets');
        });

        afterEach(function () {
            manager._render.restore();
            manager._createWidgetInstance.restore();
            manager._createInnerWidgets.restore();
        });


        it('should create the main widgets', function () {

            manager.updateView(home);
            expect(manager._createWidgetInstance.called).toBe(true);

            // render content widget
            expect(manager._createWidgetInstance.calledWith('bizagi.workportal.widgets.dashboard', {})).toBe(true);
            expect(manager._createWidgetInstance.calledWith('bizagi.workportal.widgets.navigator', {})).toBe(true);
            expect(manager._createWidgetInstance.calledWith('bizagi.workportal.widgets.sidebar', {})).toBe(true);

            expect(manager._widgets['content'].widget['bizagi.workportal.widgets.dashboard']).toBeDefined();
            expect(manager._widgets['navigator'].widget['bizagi.workportal.widgets.navigator']).toBeDefined();
            expect(manager._widgets['links'].widget['bizagi.workportal.widgets.sidebar']).toBeDefined();

            expect(manager._widgets['content'].active).toEqual('bizagi.workportal.widgets.dashboard');
            expect(manager._widgets['navigator'].active).toEqual('bizagi.workportal.widgets.navigator');
            expect(manager._widgets['links'].active).toEqual('bizagi.workportal.widgets.sidebar');

            expect(manager._render.called).toBe(true);
            expect(manager._render.calledThrice).toBe(true);

        });

        it('should create the inner widgets', function () {
            manager.updateView(home);

            expect(manager._createInnerWidgets.called).toBe(true);
            expect(manager._createInnerWidgets.calledThrice).toBe(true);

            expect(manager._widgets['content'].widget['bizagi.workportal.widgets.dashboard'].innerWidgets['stuff']).toBeDefined();
            expect(manager._widgets['navigator'].widget['bizagi.workportal.widgets.navigator'].innerWidgets).toEqual({});
            expect(manager._widgets['links'].widget['bizagi.workportal.widgets.sidebar'].innerWidgets['sidebarcontent']).toBeDefined();
        });
    });

});
