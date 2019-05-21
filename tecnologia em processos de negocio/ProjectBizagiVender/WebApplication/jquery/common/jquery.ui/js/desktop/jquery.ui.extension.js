/*
 *   Name: BizAgi JQuery UI Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will extend some stuff from the jquery ui plugins
 */


// Extend jquery ui dialog

// Extend default options
$.extend($.ui.dialog.prototype.options, {
    minimizeText: 'minimize',
    maximizeText: 'maximize',
    minimize: true,
    allowmaximize: true,
    maximize: true,
    maximized: false,
    maximizeOnly: false /* Prevent unmaximize botton */
});

$.ui.dialog.prototype.minimize = function () {
    var self = this,
        ui = self.uiDialog;

    if (!ui.data('is-minimized')) {
        if (self.options.minimize && typeof self.options.minimize !== "boolean" && $(self.options.minimize).length > 0) {
            self._min = $('<a>' + (ui.find('span.ui-dialog-title').html().replace(/&nbsp;/, '') || 'Untitled Dialog') + '</a>')
                .attr('title', 'Click to restore dialog').addClass('ui-corner-all ui-button').click(function (event) {
                    self.unminimize(event);
                });
            $(self.options.minimize).append(self._min);
            ui.data('is-minimized', true).hide();
        } else {
            if (ui.is(":data(resizable)")) {
                ui.data('was-resizable', true).resizable('destroy');
            } else {
                ui.data('was-resizable', false);
            }
            ui.data('minimized-height', ui.height());
            ui.find('.ui-dialog-content').hide();
            ui.find('.ui-dialog-titlebar-maximize').hide();
            ui.find('.ui-dialog-titlebar-minimize').css('right', '32px').removeClass('ui-icon-minusthick').addClass('ui-icon-arrowthickstop-1-s')
                .find('span').removeClass('ui-icon-minusthick').addClass('ui-icon-arrowthickstop-1-s').click(function (event) {
                    self.unminimize(event);
                    return false;
                });
            ui.data('is-minimized', true).height('auto');
        }
    }
    return self;
};

$.ui.dialog.prototype.unminimize = function () {
    var self = this,
        ui = self.uiDialog;

    if (ui.data('is-minimized')) {
        if (self._min) {
            self._min.unbind().remove();
            self._min = false;
            ui.data('is-minimized', false).show();
            self.moveToTop();
        } else {
            ui.height(ui.data('minimized-height')).data('is-minimized', false).removeData('minimized-height').find('.ui-dialog-content').show();
            ui.find('.ui-dialog-titlebar-maximize').show();
            ui.find('.ui-dialog-titlebar-minimize').css('right', '52px').removeClass('ui-icon-arrowthickstop-1-s').addClass('ui-icon-minusthick')
                .find('span').removeClass('ui-icon-arrowthickstop-1-s').addClass('ui-icon-minusthick').click(function () {
                    self.minimize();
                    return false;
                });
            if (ui.data('was-resizable') == true) {
                self._makeResizable(true);
            }
        }
    }
    return self;
};

$.ui.dialog.prototype.maximize = function () {
    var self = this,
        ui = self.uiDialog;
    var uiContent = $(".ui-dialog-content", ui);
    ui.data("outer-heigth" , ui.height());

    if (!ui.data('is-maximized')) {
        if (ui.is(":data(draggable)")) {
            ui.data('was-draggable', true).draggable('destroy');
        } else {
            ui.data('was-draggable', false);
        }
        if (ui.is(":data(resizable)")) {
            ui.data('was-resizable', true).resizable('destroy');
        } else {
            ui.data('was-resizable', false);
        }

        // Find the scroll top
        var parent = ui.parent();
        parent = bizagi.util.scrollTop(parent);

        var top = parent.scrollTop() || 0;

        ui.data('maximized-height', ui.height())
            .data('maximized-width', ui.width())
            .data('maximized-top', ui.css('top'))
            .data('maximized-left', ui.css('left'))
            .data('is-maximized', true)
            //.height('auto')
            .height($(window).height() - 8)
            .width($(window).width())
            .css({
                "top": 0,
                "left": 0
            })
            .find('.ui-dialog-titlebar-minimize').hide();


        // Add custom class to maximize the dialog
        ui.data('content-height', uiContent.height());
        ui.addClass("ui-dialog-maximized");
        ui.addClass('ui-dialog-minimized');

        /** calculates the content height **/
        var titleHeight = ui.find(".ui-dialog-titlebar").outerHeight();
        var buttonsHeight = ui.find(".ui-dialog-buttonpane").outerHeight();
        var contentHeight = ui.height() - titleHeight - buttonsHeight - 15;

        /** saves the original value **/
        if (typeof Windows === "undefined") {
            uiContent.css("top", "40px");
        }

        ui.find('.ui-dialog-titlebar-maximize').unbind("click");
        ui.find('.ui-dialog-titlebar-maximize').click(function () {
            self.unmaximize();
            self._trigger("unmaximize");
            return false;
        });

        if(document.activeElement.className == "ui-select-data ui-selectmenu-value" && document.activeElement.tagName == "INPUT")
            document.activeElement.click();

        uiContent.height(contentHeight);
        ui.find('.ui-dialog-titlebar-maximize')
            .removeClass('ui-icon-plusthick')
            .addClass('ui-icon-arrowthick-1-sw')
            .find('span')
            .removeClass('bz-icon-maximize-outline')
            .addClass('bz-icon-minimize-outline');

        if (!this.options.maximizeOnly) {
            ui.find('.ui-dialog-titlebar')
                .dblclick(function () {
                    self.unmaximize();
                    return false;
                });
        }
    }
    return self;
};

$.ui.dialog.prototype.unmaximize = function (event) {
    var self = this,
        ui = self.uiDialog;

    if (ui.data('is-maximized')) {
        ui.width(ui.data('maximized-width')).css({
            "top": ui.data('maximized-top'),
            "left": ui.data('maximized-left')
        });

        ui.data('is-maximized', false).removeData('maximized-height').removeData('maximized-width').removeData('maximized-top').removeData('maximized-left').find('.ui-dialog-titlebar-minimize').show();

        ui.find('.ui-dialog-titlebar-maximize').unbind("click");
        ui.find('.ui-dialog-titlebar-maximize').click(function () {
            self.maximize(event);
            self._trigger("maximize");
            return false;
        });

        ui.find('.ui-dialog-titlebar-maximize').removeClass('ui-icon-arrowthick-1-sw').addClass('ui-icon-plusthick')
            .find('span').removeClass('bz-icon-minimize-outline').addClass('bz-icon-maximize-outline');

        ui.removeClass('ui-dialog-minimized');
        ui.find('.ui-dialog-titlebar').dblclick(function () {
            self.maximize();
            return false;
        });
        var uiContent = $(".ui-dialog-content", ui);
        /** restores the saved height **/
        uiContent.height(ui.data('content-height'));
        if (ui.data('was-draggable') == true) {
            self._makeDraggable(true);
        }
        if (ui.data('was-resizable') == true) {
            self._makeResizable(true);
        }

        if (typeof Windows != "undefined") {
            ui.height(ui.data("contentHeight") + ui.find(".ui-dialog-buttonpane").height() + 15)
        } else {
            ui.height(ui.data("outer-heigth"));
            uiContent.css({
                "position": "relative",
                "top": "40px"
            });
        }
    }
    return self;
};

$.ui.dialog.prototype.recalculate = function () {
    var self = this,
        ui = self.uiDialog;
    var uiContent = $(".ui-dialog-content", ui);

    if (ui.is(":data(draggable)")) {
        ui.data('was-draggable', true).draggable('destroy');
    } else {
        ui.data('was-draggable', false);
    }
    if (ui.is(":data(resizable)")) {
        ui.data('was-resizable', true).resizable('destroy');
    } else {
        ui.data('was-resizable', false);
    }

    // Find the scroll top
    var parent = ui.parent();
    parent = bizagi.util.scrollTop(parent);

    var top = parent.scrollTop() || 0;

    ui.data('maximized-height', ui.height())
        .data('maximized-width', ui.width())
        .data('maximized-top', ui.css('top'))
        .data('maximized-left', ui.css('left'))
        .data('is-maximized', true)
        //.height('auto')
        .height($(window).height() - 8)
        .width($(window).width())
        .css({
            "top": 0,
            "left": 0
        })
        .find('.ui-dialog-titlebar-minimize').hide();


    // Add custom class to maximize the dialog
    ui.data('content-height', uiContent.height());
    ui.addClass("ui-dialog-maximized");
    ui.addClass('ui-dialog-minimized');

    /** calculates the content height **/
    var titleHeight = ui.find(".ui-dialog-titlebar").height();
    var buttonsHeight = ui.find(".ui-dialog-buttonpane").height();
    var contentHeight = ui.height() - titleHeight - buttonsHeight - 15;

    /** saves the original value **/
    if (typeof Windows === "undefined") {
        uiContent.css("top", "40px");
    }

    uiContent.height(contentHeight);
    ui.find('.ui-dialog-titlebar-maximize')
        .removeClass('ui-icon-plusthick')
        .addClass('ui-icon-arrowthick-1-sw')
        .find('span')
        .removeClass('bz-icon-maximize-outline')
        .addClass('bz-icon-minimize-outline');

    return self;
};



var originalDialogInit = $.ui.dialog.prototype._init;
$.ui.dialog.prototype._init = function () {
    var element = this.element;
    var options = this.options;
    var self = this;

    // Auto attach open event
    element.bind("dialogopen", function () {
        var dialogParent = element.parents(".ui-dialog");
        var titleHeight = dialogParent.find(".ui-dialog-titlebar").height();
        var buttonsHeight = dialogParent.find(".ui-dialog-buttonpane").height();
        var dialogHeight = element.height() + titleHeight + buttonsHeight;

        // Fix dialog height when the window is too small
        if (dialogHeight > $(window).height()) {
            var newDialogHeight = ($(window).height() * 0.8) - titleHeight - buttonsHeight;
            element.height(newDialogHeight);
            dialogParent.css("position", "fixed");
            dialogParent.css("top", Math.floor(($(window).height() - (newDialogHeight + titleHeight + buttonsHeight)) / 2) + "px");
        }
    });

    // Call original jquery method
    var result = originalDialogInit.apply(this, arguments);

    var uiDialogTitlebar = $(".ui-dialog-titlebar", element.parents(".ui-dialog"));
    if (uiDialogTitlebar.length == 0 && typeof (isWebpart) != "undefined") {
        uiDialogTitlebar = $('<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-22" class="ui-dialog-title">' + options.title + '</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"><span class="ui-icon ui-icon-closethick">close</span></a></div>');
        $(".ui-dialog-titlebar-close", uiDialogTitlebar).click(function () {
            self.close();
        });
        element.parents(".ui-dialog").append(uiDialogTitlebar);
    }
    if (options.minimize && !options.modal) { //cannot use this option with modal
        var uiDialogTitlebarMinimize = $('<a href="#"></a>');
        uiDialogTitlebarMinimize
            .addClass(
                'ui-dialog-titlebar-minimize ' +
                'ui-corner-all'
            )
            .attr('role', 'button')
            .hover(
                function () {
                    uiDialogTitlebarMinimize.addClass('ui-state-hover');
                },
                function () {
                    uiDialogTitlebarMinimize.removeClass('ui-state-hover');
                }
            )
            .focus(function () {
                uiDialogTitlebarMinimize.addClass('ui-state-focus');
            })
            .blur(function () {
                uiDialogTitlebarMinimize.removeClass('ui-state-focus');
            })
            .click(function () {
                self.minimize();
                return false;
            })
            .appendTo(uiDialogTitlebar);

        self.uiDialogTitlebarMinimizeText = $('<span></span>')
            .addClass(
                'ui-icon ' +
                'ui-icon-minusthick'
            )
            .appendTo(uiDialogTitlebarMinimize)
            .text(options.minimizeText);
    }

    if (options.maximize && !options.maximizeOnly) { //cannot use this option with modal
        var uiDialogTitlebarMaximize = $('<a href="#"></a>')
            .addClass(
                'ui-dialog-titlebar-maximize ' +
                'ui-corner-all'
            )
            .attr('role', 'button')
            .hover(
                function () {
                    uiDialogTitlebarMaximize.addClass('ui-state-hover');
                },
                function () {
                    uiDialogTitlebarMaximize.removeClass('ui-state-hover');
                }
            )
            .focus(function () {
                uiDialogTitlebarMaximize.addClass('ui-state-focus');
            })
            .blur(function () {
                uiDialogTitlebarMaximize.removeClass('ui-state-focus');
            })
            .click(function () {
                self.maximize();
                self._trigger("maximize");
                return false;
            })
            .appendTo(uiDialogTitlebar);

        var ui = self.uiDialog;
        if (options.allowmaximize) {
            ui.find('.ui-dialog-titlebar-maximize').show();
            self.uiDialogTitlebarMaximizeText = $('<span></span>')
                .addClass(
                    'bz-icon ' + 'bz-icon-16 ' + 'bz-icon-maximize-outline'
                )
                .appendTo(uiDialogTitlebarMaximize);
                //.text(options.maximizeText);

            $(uiDialogTitlebar).dblclick(function () {
                self.maximize();
                return false;
            });
            if (options.maximized) {
                self.maximize();
            }
        } else {
            ui.find('.ui-dialog-titlebar-maximize').hide();
        }
    }

    if (options.maximizeOnly) {
        self.maximize();
    }

    // Return original response
    return result;
};

if (jQuery.browser.msie && jQuery.browser.version == '9.0') {

    // Rewrite of the dialog to avoid IE9 problems
    var originalDialogCreate = $.ui.dialog.prototype._create;
    $.ui.dialog.prototype._create = function () {
        //DEPL: This code will prevent this bug
        // http://msdn.microsoft.com/en-us/library/gg622929%28v=VS.85%29.aspx

        var element = $(this);

        // Saves a backup for the iframes src and removes the src before the DOM manipulation
        var internalIFrames = $("iframe", element);

        $.each(internalIFrames, function (i, iframe) {
            $(iframe).data("src", iframe.src);
            iframe.src = "about:blank";
        });

        // Call original method
        var result = originalDialogCreate.apply(this, arguments);

        // Restore iframes src
        $.each(internalIFrames, function (i, iframe) {
            iframe.src = $(iframe).data("src");
        });

        return result;
    };

    // Rewrite of the detach to prevent IE9 problems with iframes
    var originalDetachMethod = jQuery.fn.detach;
    jQuery.fn.detach = function () {

        //Gets the current set of elements, preventing not to loose focus
        var element = this ? this.element : window.element;
        element = element || {};

        // Check if there is an iframe inside, to remove the src before detaching the content because
        // there is a rare bug with IE
        var internalIFrames = $("iframe", element);
        $.each(internalIFrames, function (i, iframe) {
            $(iframe).data("src", iframe.src);

            //Extra validation to clean iframes src, preventing not to clean the forms with iframes
            var baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            if(iframe.src.indexOf(baseUrl) !== -1)
                iframe.src = "about:blank";
            else {
                //helps to check if there is elements outside the DOM to be reseted
                var interval = setTimeout(
                    function() {
                        //if doesn't still inside an dialog, reset iframe src
                        if ($(iframe).parents(".ui-dialog").length == 0 && $(iframe).parents(".ui-widget-content").length == 0) {
                            iframe.src = "about:blank";
                        }
                    },
                    500
                );
            }
        });

        // Call original jquery method
        var result = originalDetachMethod.apply(this, arguments);

        // Return original response
        return result;
    };
}
