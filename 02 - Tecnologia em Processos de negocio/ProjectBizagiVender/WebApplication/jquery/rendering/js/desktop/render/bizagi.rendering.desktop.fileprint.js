/*
 *   Name: BizAgi Desktop Render fileprint Extension
 *   Author: Christian Collazos
 *   Comments:
 *   -   This script will redefine the fileprint render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.fileprint.extend("bizagi.rendering.fileprint", {}, {
    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;

        var control = self.getControl(),
            button = $(":button", control);

        // Stylize button
        button.button();
    },
    /*
     *   Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl(),
            button = $(":button", control);

        // Call base
        self._super();

        // Bind event
        button.click(function () {
            // Process button actions
            self.processButton();
        });
    },
    /*
     *   Method to render non editable values
     */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        // Execute the same as post-render
        self.postRender();

        // Set as disabled
        var button = $(":button", control);
        button.button("option", "disabled", "true");
    },
    /*
     *   Process the button actions workflow
     */
    processButton: function () {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            self.runButtonAction();
        }
    },
    getAbsoluteFilePrintUrl: function (fileType) {
        //This url must be absolute, in portal and sharepoint not apply relative
        var self = this;

        var time = (new Date()).getTime(),
            filePrintUrl = self.getFilePrintUrl(fileType);

        if (filePrintUrl.indexOf('http') != -1)
            return filePrintUrl + "&_=" + time;

        filePrintUrl = filePrintUrl.replace(bizagi.services.ajax.pathToBase, "");
        return bizagi.loader.basePath + filePrintUrl + "&_=" + time;
    },
    runButtonAction: function () {
        var self = this;
        self.getFormContainer().clearValidationMessages();

        var control = self.getControl(),
            fileObject = $(".fileobj");

        if (bizagi.util.isIE() && !bizagi.util.isIE10() && !bizagi.util.isIE11()) {

            var isAcrobatInstalled = self.checkAdobePlugin();

            if (!isAcrobatInstalled) {
                $.when(bizagi.showMessageBox(bizagi.localization.getResource("workportal-acrobat-message")))
                    .done(function () {
                        var w = window.open(self.getAbsoluteFilePrintUrl("inline"));
                    });
            } else {
                var template = "",
                    tempId = self.properties.id,
                    counter = 0,
                    message = bizagi.localization.getResource("webpart-render-loading");

                fileObject.remove();
                template = self.renderFactory.getTemplate("fileprint-object");

                control.append("<label id='loadingMsg'> " + message + "</label>");
                control.append($.tmpl(template, {
                    url: self.getAbsoluteFilePrintUrl("inline")
                }));

                var mycounter = setInterval(function () {

                    if (document.all["fileobj"] && document.all["fileobj"].readyState > 0) {

                        $("#loadingMsg").remove();
                        $(".fileobj:last", control).focus();
                        if (typeof ($(".fileobj:last", control)[0].print) != "undefined")
                            $(".fileobj:last", control)[0].print();
                        else
                            var myObject = window.open(self.getAbsoluteFilePrintUrl("attachment"));
                        window.clearInterval(mycounter);
                    } else if (counter >= 10) {

                        $("#loadingMsg").remove();

                        $.when(bizagi.showMessageBox(bizagi.localization.getResource("workportal-print-too-slow")))
                            .done(function () {
                                var wnd = window.open(self.getAbsoluteFilePrintUrl("inline"));
                                wnd.onload = function () {
                                    if (typeof (wnd.print) != "undefined") {
                                        wnd.print();
                                        wnd.close();
                                    }
                                    else {
                                        var myObject = window.open(self.getAbsoluteFilePrintUrl("attachment"));
                                    }
                                };
                            });

                        self.saveForm();
                        window.clearInterval(mycounter);
                    }
                    counter += 1;
                }, 1000);
            }
        } else {

            if ($.browser.mozilla) {
                var myObject = window.open(self.getAbsoluteFilePrintUrl("attachment"));
            }
            else {
                //remove previous iframe
                $("iframe", control).remove();

                //render new iframe
                var idFrame = "bz-render-fileprint-iframe-" + new Date().getTime();
                var tmpl = self.renderFactory.getTemplate("fileprint-iframe");
                var iframe = $.tmpl(tmpl, {
                    url: self.getAbsoluteFilePrintUrl("inline"),
                    id: idFrame
                });
                control.append(iframe);

                //print iframe
                var frm = document.getElementById(idFrame).contentWindow;
                if (typeof (frm.print) != "undefined" && !bizagi.util.isIE())
                    frm.print();
                else
                    var myObject = window.open(self.getAbsoluteFilePrintUrl("attachment"));
            }
        }
    },

    checkAdobePlugin: function () {
        var installed;
        try {
            installed = new ActiveXObject('AcroPDF.PDF');
        } catch (e) {
            bizagi.log(e);
        }
        if (!installed) {
            try {
                // Older Ie
                installed = new ActiveXObject('PDF.PdfCtrl');
            } catch (e) {
                bizagi.log(e);
            }
        }
        return installed;
    }

});