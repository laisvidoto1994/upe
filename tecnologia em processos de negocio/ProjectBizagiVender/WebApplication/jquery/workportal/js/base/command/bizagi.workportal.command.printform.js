/*
*   Name: BizAgi Workportal Security Command
*   Author: David Andres Niño
*   Comments:
*   -   This script will define a common class to print forms, and edit mode forms
*/


$.Class("bizagi.workportal.command.printform", {}, {

    init: function (renderFactory) {
        var self = this;

        self.renderFactory = renderFactory;
    },

    print: function (properties) {

        var self = this;

        var printParams = $.extend({}, properties);

        $(document).triggerHandler("showDialogWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PRINT,
            modalParameters: {
                title: bizagi.localization.getResource("render-actions-print"),
                refreshInbox: false
            },
            params: printParams,
            referrer: (bizagi.hasOwnProperty('referrerParams') && bizagi.referrerParams.hasOwnProperty('referrer')) ? bizagi.referrerParams.referrer : "inboxGrid",
            buttons: [
                {
                    text: bizagi.localization.getResource("workportal-widget-dialog-box-print"),
                    click: function () {
                        var selfButton = $(this);

                        var frameTemplate = self.renderFactory.getTemplate("print-frame");
                        var headerTemplate = self.renderFactory.getTemplate("print-frame-header");

                        var executePrintWidgetAction = function() {

                            /**/
                            // Create a random name for the print frame.
                            var strFrameName = ("printer-" + (new Date()).getTime());

                            var jFrame = $.tmpl(frameTemplate, { printID: strFrameName });
                            var jFrameHeader = $.tmpl(headerTemplate, { environment: bizagi.loader.environment, productBuild: bizagi.loader.productBuildToAbout, build: bizagi.loader.build });


                            jFrame.appendTo($("body:first"));

                            // Get a FRAMES reference to the new frame.
                            var objFrame = window.frames[strFrameName];

                            // Get a reference to the DOM in the new frame.
                            var objDoc = objFrame.document;

                            // Write the HTML for the document. In this, we will
                            // write out the HTML of the current element.
                            objDoc.open();
                            var objDocStr = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";

                            objDocStr += "<html style='overflow: visible !important'> <head> <title> </title>";

                            objDocStr += jFrameHeader[0].innerHTML;

                            objDocStr += "</head> <body class='bz-wp-widget-print bz-wp-widget-print-load' style='overflow: visible !important'>";

                            objDocStr += $(".bz-wp-widget-print").html();

                            objDocStr += "</body></html>";


                            objDoc.write(objDocStr);

                            objDoc.close();
                            $(".ui-bizagi-cell-readonly", objDoc).css("maxHeight", "100%");
                            if (bizagi.util.isIE()) {
                                var win = window.open("", "", "top=0,left=0,width=10,height=10");

                                var styleLoading = '';
                                styleLoading += '<style>';
                                styleLoading += 'html{background: #293f55; color: #fff; text-align: center;}';
                                styleLoading += '</style>';

                                var textStyle = 'padding:10px auto; width:100%; text-align:center; font-family:Arial; font-size:12px;';

                                win.document.open();
                                win.document.write(styleLoading + '<div id="loading-emp" style="' + textStyle + '">' + bizagi.localization.getResource("webpart-render-loading") + '</div>');
                                win.document.close();

                                win.document.open();
                                win.document.write(objDocStr);
                                win.document.close();

                                win.print();
                                win.close();
                            }
                            else {
                                objFrame.focus();
                                setTimeout(function() {
                                    objFrame.print();
                                }, 500);
                            }


                            // Have the frame remove itself in about a minute so that
                            // we don't build up too many of these frames.
                            setTimeout(function() {
                                jFrame.remove();
                            }, 1000);

                            selfButton.removeAttr('disabled');
                        };

                        selfButton.attr('disabled', 'disabled');


                        if ($('#bz-wp-widget-print').length === 0) {
                            setTimeout(function () {
                                executePrintWidgetAction();
                            }, 1000);
                        } else {
                            executePrintWidgetAction();
                        }
                    }
                }
            ]
        });
    }
});