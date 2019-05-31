/*
 *   Name: BizAgi Workportal Menu Controller
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base class to handle manu layouts for any device
 */

bizagi.workportal.controllers.controller.extend("bizagi.workportal.controllers.menu", {}, {
    init: function (workportalFacade, dataService) {
        var self =this;
        self._super(workportalFacade, dataService);

        // Subscribe to change widget event
        this.subscribe("showMainMenu", function (e, params) {
            var def = new $.Deferred();
            $(self.getContent()).closest("#ui-bizagi-wp-menu").show();
            return def.promise();
        });
    },
    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("menu");
        var defer = new $.Deferred();
        var defaultImg = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////////VXz1bAAAAAJ0Uk5T/wDltzBKAAAA+0lEQVR42uzaSxLCMAwE0c79L82SFMXHJpKHhJ59at4utmS2cBAgQMCBT3dZDuBJ1gF4mSUA3qYfALUCauvnCZT3Twqo758T0NA/JaCjf0ZwIgC0COjpHxecBgBNAgF09Y8KBAgQIECAAAFnAXgiEiDAq5mA8wEuOCERIMBBpYAfAMTH9QLygPjOSEB+b5gHxFe3I4Lt4oD0+v4HAPEXFAIECBDw70+58oDw7zh7JMteTrPTcr5MDYBDOQqgIAcAFOU7AKWZBlCeKQAtGQXQmAEAzfkAYEHeAWC5gOX1DwQS/XsBkf6dgEz/XSBAgAABAgQIECBAQBxwE2AAjnkjnL/SDJsAAAAASUVORK5CYII=";

        // Get Current User
        $.when(self.dataService.getCurrentUser()).done(function (data) {
            // Define Global information to actual user
            bizagi.currentUser = data;

            $.datepicker.setDefaults(bizagi.localization.getResource("datePickerRegional"));

            //symbol from Rest/Users/CurrentUser, in server : data.symbol =  Business/Localization/Currency Symbol  || {language}.numericFormat.symbol
            var currencyInfo = bizagi.localization.getResource('numericFormat');
            if(currencyInfo){
                currencyInfo.decimalSymbol = data.decimalSeparator || currencyInfo.decimalSymbol;
                currencyInfo.symbol = data.symbol || currencyInfo.symbol;
                currencyInfo.digitGroupSymbol = data.groupSeparator || currencyInfo.digitGroupSymbol;

                bizagi.localization.setResource('numericFormat', currencyInfo);
                if(BIZAGI_DEFAULT_CURRENCY_INFO){
                    BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits = data.decimalDigits;
                    BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator = currencyInfo.decimalSymbol;
                    BIZAGI_DEFAULT_CURRENCY_INFO.symbol = currencyInfo.symbol;
                    BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator = currencyInfo.digitGroupSymbol;
                }
            }

            if(data.uploadMaxFileSize){
                BIZAGI_SETTINGS.UploadMaxFileSize = data.uploadMaxFileSize;
                bizagi.util.changeData({uploadMaxFileSize: BIZAGI_SETTINGS.UploadMaxFileSize});
            }

            self.security = new bizagi.workportal.command.security(self.dataService);
            $.when(self.security.getSecurity())
                .done(function(security) {
                    // Render content
                    var content = self.content = $.tmpl(template, $.extend(data, {
                        environment: bizagi.loader.environment || "",
                        build: bizagi.loader.build,
                        base64image: bizagi.themeLogo || "img/img/barra/logo-bizagi.svg",
                        photo: "data:image/png;base64," + ((bizagi.currentUser.userPicture) ? bizagi.currentUser.userPicture : defaultImg),
                        hasPicture: bizagi.currentUser.userPicture ? true: false,
                        initials: bizagi.currentUser.userFullName ? bizagi.currentUser.userFullName.getInitials() : "",
                        security: security
                    }));
                    defer.resolve(content);
                });
        }).fail(function(){
            self.dataService.logout();
        });

        return defer.promise();
    },

    /**
     *   Helper method to change the current widget in the workportal
     * @param params
     */
    changeWidget: function (params) {
        var self = this;
        self.publish("changeWidget", params);
    },

    /**
     *   Helper method to show a widget inside a dialog in the wokportal
     * @param params
     */
    showDialogWidget: function (params) {
        var self = this;
        self.publish("showDialogWidget", params);
    },

    /**
     *
     */
    performResizeLayout: function () {
        var self = this;
        if (typeof jQuery.browser != "undefined" && $.browser.msie && parseInt($.browser.version, 10) <= 8) {
            var idInterval = window.setInterval(function () {
                if (self.content !== null) {
                    var labels = $("#ui-bizagi-wp-app-menu-bt-container .text", self.content);
                    var userprofile = $("#userprofile", self.content);

                    var menuUsername = $("#ui-bizagi-wp-menu-username", userprofile);
                    var labelsUser = $(".text", menuUsername);

                    var logout = $("#logout", userprofile);
                    var about = $("#about", userprofile);

                    if ($(window).width() < 1400) {

                        labels.css({
                            "line-height": 0,
                            "display": "block"
                        });

                        if( $(window).width() < 1195) {

                            //Adjust the size to make room for the about button
                            logout.css({
                                "width": "20px"
                            });

                            //Minimize the about button
                            about.css({
                                "width": "24px"
                            });

                            $(".ui-button-text", about).hide();

                            //Readjust the logout icon
                            $(".ui-icon", logout).css({
                                "top" : "12px"
                            });

                            //hide the label
                            $(".ui-button-text",logout).hide();

                            //Hide the label user
                            labelsUser.css({
                                "display": "none"
                            });

                            //Set an specific height to the user name menu
                            menuUsername.css({
                                "height": "19px"
                            });

                        }
                        else
                        {

                            about.removeAttr("style");
                            $(".ui-icon", about).removeAttr("style");
                            $(".ui-button-text", about).show();

                            logout.removeAttr("style");
                            $(".ui-icon",logout).removeAttr("style");

                            //show the label
                            $(".ui-button-text",logout).show();
                        }

                    } else {
                        labels.css({
                            "line-height": "59px",
                            "display": "inline-block"
                        });

                        //Reset the user name menu
                        menuUsername.removeAttr("style");

                        //re-adjust the styles
                        menuUsername.css({
                            "padding-left": "25px",
                            "width": "auto"
                        });

                        labelsUser.removeAttr("style");

                        //Reset the about styles
                        about.removeAttr("style");
                        $(".ui-icon", about).removeAttr("style");
                        $(".ui-button-text", about).show();

                        logout.removeAttr("style");
                        $(".ui-icon",logout).removeAttr("style");

                        //show the label
                        $(".ui-button-text",logout).show();
                    }

                    window.clearInterval(idInterval);
                }
            }, 300);
        }
    }

});
