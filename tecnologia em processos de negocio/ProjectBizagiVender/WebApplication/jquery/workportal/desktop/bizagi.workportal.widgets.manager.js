/*
 *   Name: BizAgi Workportal Widgets Manager Framework
 *   Author: Mauricio Snchez - Manuel Mejia
 *   Comments:
 *   -   This script will define the framework API to manage/mediate widgets
 */


bizagi.workportal.observable.extend("bizagi.workportal.widgets.manager", {
    "createCase": "bizagi.workportal.widgets.createcase",
    "updateForm": "bizagi.workportal.widgets.updateform"
}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, notifier, params) {
        var self = this;

        // call base
        self._super();

        self._facade = workportalFacade || null;
        self._dataService = dataService || null;
        self._notify = notifier;

        self._widgets = {};
        self._innerWidgets = {};
        self._mainWidgets = {};
        self._context = "none";
        self._layouts = [];
        self._supportNav = params && params.supportNav;
    },

    /*
    *   Main Observer
    */
    _notifyChange: function (event, params) {
        var self = this;

        if (params.type == "navigate") {
            self.updateView(params.args);
        }
        else {
            return self.pub('notifyChange', params);
        }
    },

    /*
    * Shows a widget in a dialog
    */
    _showDialogWidget: function (event, data) {
        var self = this,
            defer = new $.Deferred(),
            widgetName = self.Class[data.widgetName];

        var dialog = new bizagi.workportal.desktop.widgets.dialog(self._dataService, self._facade);
        data.widgetInstance = self._createWidgetInstance(widgetName, data);
        data.widgetInstance.sub('closeDialog', function (ev, params) {
            dialog.close();
            defer.resolve(params);
        });

        dialog.renderWidget(data);

        return defer.promise();
    },

    /*
    * Show a notification
    */
    _showNotification: function (ev, params) {
        var self = this,
            type = params.type;

        if (type == "message") {
            self._notify.showSucessMessage(params.message, params.title, params.options);
        } else if (type == "error") {
            self._notify.showErrorMessage(params.message, params.title, params.options);
        }

    },

    /*
    *  Renders the widget
    */
    _render: function (selector, widgetName, refresh) {
        var self = this,
            selection = self._widgets[selector],
            widget = selection.widget[widgetName],
            canvas = selection.canvas,
            defer = new $.Deferred();

        if (!refresh &&
             widget.isRendered() &&
             widget.getContent().is(':visible')) {
            return;
        }

        canvas.empty();
        $(canvas).startLoading();
        widget.clean();


        $.when(widget.render())
            .pipe(function (content) {
                return self._renderInnerWidgets(widget, content);
            })
            .done(function (content) {
                $(canvas).endLoading();
                canvas.append(content);
                defer.resolve();
            });

        return defer.promise();
    },


    /*
    *  Renders inner widgets and append the content to main widget
    **/
    _renderInnerWidgets: function (widget, content) {
        var defer = new $.Deferred(),
            innerRenderPromises = [];

        for (var canvas in widget.innerWidgets) {
            var innerInstance = widget.innerWidgets[canvas];
            innerInstance.clean();

            innerRenderPromises.push(
                    $.when(innerInstance.render(), innerInstance.canvas)
                        .done(function(innerContent, canvas) {
                            var container = content.find('.ui-bizagi-layout[layout="' + canvas + '"]');

                        if (container.length == 0) {
                            container = content.closest('.ui-bizagi-layout[layout="' + canvas + '"]');
                        }

                        container.empty();
                        container.append(innerContent);
                    })
            );


        }

        $.when.apply($, innerRenderPromises)
            .done(function () {
                defer.resolve(content);
            });

        return defer.promise();
    },

    /*
    * creates a new instance of a widget
    */
    _createWidgetInstance: function (widgetName, args, isNewInstance) {
        var self = this;

        var instance = (isNewInstance) ? bizagi.injector.getNewInstance(widgetName, args) : bizagi.injector.get(widgetName, args);
        instance.sub('notify', $.proxy(self._notifyChange, self));
        instance.sub('showDialogWidget', $.proxy(self._showDialogWidget, self));
        instance.sub('showNotification', $.proxy(self._showNotification, self));

        return instance;

    },

    /*
    * Changes current widget
    */
    _changeWidget: function (params) {
        var self = this,
            layout = params.layout,
            widgetName = params.widgetName,
            refresh = params.refresh,
            args = params.args,
            selection = self._widgets[layout],
        newInstance = params.newInstance || false;

        if (!selection.widget[widgetName]) {
            var instance = self._createWidgetInstance(widgetName, args, newInstance);
            self._createInnerWidgets(layout, instance, args);
            selection.widget[widgetName] = instance;
        } else if (self._innerWidgets[layout]) {
            instance = selection.widget[widgetName];
            self._createInnerWidgets(layout, instance, args);
        }

        selection.active = widgetName;
        return self._render(layout, widgetName, refresh);

    },

    /*
    * Creates the inner widgets
    */
    _createInnerWidgets: function (layout, instance, args) {
        var self = this,
            layoutWidgets = self._innerWidgets[layout] || [],
            innerWidgets = instance.innerWidgets || {};

        for (var i = 0, l = layoutWidgets.length; i < l; i++) {
            var data = layoutWidgets[i];
            var innerWidget = innerWidgets[data.canvas];

            if (!innerWidget) {
                innerWidget = self._createWidgetInstance(data.widgetName, args);
                innerWidget.canvas = data.canvas;
                innerWidgets[data.canvas] = innerWidget;
            }
            else {
                innerWidget.clean();
                innerWidget = self._createWidgetInstance(data.widgetName, args, true);
                innerWidget.canvas = data.canvas;
                innerWidgets[data.canvas] = innerWidget;
            }

        }

        instance.innerWidgets = innerWidgets;
    },

    /*
    * Returns the current context
    */
    _supportNavigation: function () {
        return this._supportNav;
    },

    /*
    * Set the context
    */
    _setContext: function (context) {
        this._context = context;
    },

    /*
    * Returns true if the current context is the same at context passed
    */
    _isSameContext: function (context) {
        var self = this;

        return (self._context == context);
    },


    /*
    * Raise event to all widgets
    */
    emit: function (params) {
        var self = this,
            widgets = self._widgets,
            answers = [],
            event = params.context;

        for (var selector in widgets) {
            var selection = widgets[selector];

            if (!$.isEmptyObject(selection.widget)) {
                var widget = selection.widget[selection.active];

                var result = widget.pub(event, params);
                if (typeof result !== "undefined")
                    answers.push(result);

                for (var canvas in widget.innerWidgets) {
                    result = widget.innerWidgets[canvas].pub(event, params);
                    if (typeof result !== "undefined")
                        answers.push(result);
                }
            }
        }

        return answers;
    },

    /*
    * Raise event to navigator widget
    */
    emitNavigate: function (params) {
        var self = this,
            selection = self._widgets["navigator"],
            args = params.args || {};
        if (selection) {
            var navigatorWidget = selection.widget[selection.active];
            if (navigatorWidget && !args.isRefresh) {
                $.when(navigatorWidget.isRendered())
                   .done(function () {
                       navigatorWidget.pub("NAVIGATE", params);
                   });
            }
        }

    },

    /*
    *  Organize the distribution of widgets in the
    *  main layout
    */
    _searchWidgets: function (widgets) {
        var self = this;

        delete self._innerWidgets;
        self._innerWidgets = {};

        delete self._mainWidgets;
        self._mainWidgets = {};

        for (var widget in widgets) {
            var item = widgets[widget];

            if (self._layouts.indexOf(item.layout) == -1) {
                var layout = widgets[item.layout];

                self._innerWidgets[layout.layout] = self._innerWidgets[layout.layout] || [];

                self._innerWidgets[layout.layout].push({
                    widgetName: item.name,
                    canvas: item.canvas,
                    refresh: (item.refresh == undefined) ? true : item.refresh
                });
            }
            else {
                self._mainWidgets[item.layout] = {
                    widgetName: item.name,
                    refresh: (item.refresh == undefined) ? true : item.refresh,
                    newInstance: (item.newInstance == undefined) ? false : item.newInstance

                };
            }
        }
    },

    /*
    * Updates the view. if the context is new the new widgets are created
    * otherwise a broadcast is executed
    */
    updateView: function (params) {
        var self = this,
            data = params.data,
            context = params.context,

            args = params.args || {},
            defer = new $.Deferred(),
            widgets = data.widgets;

        if (self._isSameContext(context) && !args.refreshAllWidgets) {
            params.args.refreshAllWidgets = undefined;
            var result = self.emit(params);

            if (!args.stopNavigation && self._supportNavigation()) {
                self.emitNavigate(params);
            }

            return result;
        }

        self._searchWidgets(widgets);
            
                $.when.apply($, $.map(self._mainWidgets, function (item, layout) {
                    return self._changeWidget({ layout: layout, widgetName: item.widgetName, refresh: item.refresh, newInstance: item.newInstance, args: args });
                }))
                .done(function () {
                    self.emit(params);
                    if (self._supportNavigation()) {
                        self.emitNavigate(params);
                    }
                    defer.resolve();
                });

        self._setContext(context);

        return defer.promise();
    },

    /*
    * Set the disposition of the layouts defined
    */
    setLayout: function ($content) {
        var self = this;

        self._context = "none";
        self._widgets = {};

        var layouts = self.getLayouts($content) || [];

        for (var i = 0, l = layouts.length; i < l; i++) {
            var item = layouts[i];

            self._widgets[item.name] = {
                widget: {},
                canvas: item.layout,
                layout: item.name
            };

            self._layouts.push(item.name);
        }
    },

    /*
    * Gets layouts available in the container
    */
    getLayouts: function ($content) {

        return $.map($('.ui-bizagi-layout[layout]', $content), function (layout) {
            return {
                name: $(layout).attr('layout'),
                layout: $(layout)
            };
        });
    },

    /*
    * Disposes all widgets
    */
    dispose: function () {
        var self = this;
    },

    /*
    * Clean all widget
    */
    clean: function () {

        var self = this;

        for (var selector in self._widgets) {
            var widgets = self._widgets[selector].widget;

            for (var name in widgets) {
                var instance = widgets[name];

                for (var canvas in instance.innerWidgets) {
                    instance.innerWidgets[canvas].clean();
                }

                instance.clean();
            }
        }
    }
});

bizagi.injector.register('widgetManager', ['workportalFacade', 'dataService', 'notifier', bizagi.workportal.widgets.manager]);