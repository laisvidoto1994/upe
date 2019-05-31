/*
*   Name: BizAgi Desktop Render Document Generator Extension
*   Author: Dario Estupiñan
*   Comments:
*   -   This script will redefine the document generator render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.document.extend("bizagi.rendering.document", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        self.applyDocumentTemplatesFormat();

        if (self.properties.allowSendInMail) {
            self.bindEmailDialog();
            //self.bindExternalPopup();
        }
    },

    /*
    *  Bind dialog for send email
    */
    bindEmailDialog: function () {
        var self = this;
        var control = self.getControl();
        var xpathContext = self.properties.xpathContext || "";
        var xpath = self.properties.xpath;

        $(".ui-bizagi-render-documentgenerator-sendmail", control).bizagiSendEmail({
            tmpl: self.renderFactory.getTemplate("dialog-send-email"),
            value: self.value,
            self: self,
            dataService: self.dataService,
            properties: self.properties,
            xpath: xpath,
            xpathContext: xpathContext
        });

    },

/**
 * TODO: Remove this method in the near future
 * because havent any reference
 *
    bindExternalPopup: function () {
        var self = this;
        var control = self.getControl();
        var params = self.getParams();
        var properties = self.properties;
        var isInGrid = (self.grid) ? true : false;
        var options = {
            idCase: params.idCase || bizagi.context.idCase,
            idWorkitem: params.idWorkitem || bizagi.context.idWorkitem,
            field: properties.xpath.split(".")[properties.xpath.split(".").length - 1]
        };
        var xpathContext = self.properties.xpathContext || "";

        if (isInGrid || xpathContext != "") {
            if (typeof xpathContext == "string") {
                options.xPath = (xpathContext != "") ? [xpathContext, properties.xpath].join(".") : properties.xpath;
            } else {
                $.extend(options, { xPath: self.grid.properties.xpath + "." + properties.xpath });
            }
        } else {
            $.extend(options, { xPath: properties.xpath });
        }

        $(".ui-bizagi-render-documentgenerator-sendmail", control).tooltip();

        $(".ui-bizagi-render-documentgenerator-sendmail", control).click(function () {
            var url = "App/Upload/SendAttachedDocs.aspx?";
            url += "idCase=" + options.idCase;
            url += "&idWorkitem=" + options.idWorkitem;
            url += "&xPath=" + options.xPath;
            url += "&field=" + options.field;

            // fix for SUITE-8927
            var values = [];
            if (self.value) {
                for (var i = 0; i < self.value.length; i++) {
                    values.push(self.value[i][1]);
                }
            }

            self.dataService.getCaseNumber({
                idCase: options.idCase
            }).done(function (response) {
                var caseNumber = response.caseNumber;
                caseNumber = caseNumber ? caseNumber : options.idCase;
                url += "&radNumber=" + caseNumber;

                self.currentPopup = "genericiframe";
                $(document).triggerHandler("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                    widgetURL: url,
                    injectCss: [".ui-bizagi-old-render*", ".ui-bizagi-old-render-upload"],
                    modalParameters: {
                        title: "Send attached documents",
                        id: "sendEmail"
                    },
                    afterLoad: function (params) {
                        var input = document.getElementById("btnClose");
                        if (input) { input.style.display = "none"; }
                        input = document.getElementById("btnCloseConfirm");
                        if (input) { input.style.display = "none"; }


                        // fix for SUITE-8927
                        if (params) {
                            if (params.values) {
                                var values = params.values;
                                var labels = document.getElementsByTagName("label");

                                if (labels) {
                                    for (var i = 0; i < labels.length; i++) {
                                        var label = labels[i];
                                        if (values.indexOf(label.innerHTML) == -1) {

                                            label.control.checked = false;
                                            label.parentElement.style.display = "none";
                                        }
                                    }
                                }
                            }
                        }
                    },
                    afterLoadParams: {
                        values: values
                    }
                });
            });

        });
    },*/

    /*
    *   Put formating to the documents that are generated by the control
    */
    applyDocumentTemplatesFormat: function () {
        var self = this;
        var control = self.getControl();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        // Resolve the type of the document based on the extension and put the icon to acconding to it
        var documentList = $(".ui-bizagi-document-upload-item", control);
        $.each(documentList, function (index, value) {
            $(".ui-bizagi-document-type", value).addClass("ui-bizagi-document-extension");
            //add the tooltip to the document preview icon
            var previewTooltip = $(".ui-bizagi-document-preview", value);
            previewTooltip.attr("title", self.resources.getResource('render-document-preview-tooltip'));
            previewTooltip.tooltip();

            // Disable preview
            var returnType = self.returnCssTypeFile($("a > span", value).html());
            $(".ui-bizagi-document-type", value).addClass(returnType);
            $(".ui-bizagi-button", value).remove();
            $(".ui-bizagi-document-preview", value).attr("display", "none");
        });
    },


    /*
    *   Template method to implement in each children to customize each control
    */
    /**
     * TODO: Remove this method in the near future
     * because havent any reference
     *
    renderPrintControl: function () {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var template = self.renderFactory.getTemplate("document");
        var noFiles = (properties.value) ? (properties.value.length == 0) : true;
        // Render template
        var html = $.fasttmpl(template, {
            editable: mode != "execution",
            downloadalldocuments: false,
            required: properties.required,
            allowgenerate: false,
            xpath: self.getXpath(properties.xpath),
            append: properties.append ? properties.append : false,
            caption: properties.caption,
            noFiles: noFiles
        });

        $('.ui-bizagi-div-error-container', html).remove();

        // Render current children
        var items = "";
        var length = (properties.value) ? properties.value.length : 0;
        for (var i = 0; i < length; i++) {
            var file = { id: properties.value[i][0], fileName: properties.value[i][1] };
            var item = self.renderDocumentItem(file);
            items += item;
        }
        if (!noFiles && downloadalldocuments) {
            var downloadAlldocumentsLink = { fileName: self.getResource("render-document-downloadalldocuments") };
            var item = self.renderAllDocumentDownload(downloadAlldocumentsLink);
            items += item;
        };
        html = self.replaceFilesHtml(html, items);
        return html;
    },
    */

    /*
    *   Method to correct the visualization of the link in the print mode.
    */

    updateControlForPrintMode: function (control) {

        //clear item that be don´t render
        $('.ui-bizagi-render-button', control).each(function () {
            $(this).remove();
        });

        $('.ui-bizagi-div-error-container', control).each(function () {
            $(this).remove();
        });

        $('.ui-bizagi-document-preview', control).each(function () {
            $(this).remove();
        });

        $('.ui-bizagi-document-type', control).each(function () {
            $(this).remove();
        });

        $('a', control).each(function () {
            $(this).attr('target', '_blank').attr('title', $('span', this).html()).css('text-decoration', 'none');
        });

        $('ol', control).each(function () {
            $(this).removeClass('ui-bizagi-container-documents');
            $(this).addClass('ui-bizagi-container-documents-print');
        });
    },

    /*
    *   Previews the document inside a dialog
    */
    showDocumentPreview: function (url, filename) {

        url = url + "&h_disposition=inline";
        var MSIEmatch = navigator.userAgent.match('MSIE (.)');
        navigator.sayswho = (function () {
            var N = navigator.appName, ua = navigator.userAgent, tem;
            var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
            M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

            return M;
        })();


        var self = this;
        var dialogBox = $("<div style='overflow:hidden;'></div>");
        dialogBox.empty();
        dialogBox.appendTo("body", window.document);

        // Create embed object
        if (!$.browser.mozilla && !$.browser.msie) {
            var template = self.renderFactory.getTemplate("document-item-preview");
        } else {
            var template = self.renderFactory.getTemplate("document-item-preview-object");
        }

        dialogBox.append($.fasttmpl(template, {
            url: url
        }));

        // Create dialog buttons
        var buttons = {};
        buttons[self.getResource("confirmation-box-ok")] = function () {
            dialogBox.dialog('destroy');
            dialogBox.remove();
        };

        if (navigator.sayswho[0] != "Firefox") {
            buttons[self.getResource("render-actions-print")] = function () {
                // Print the document
                var count = 0;
                var printFn = function (pdf) {
                    //Wait until PDF is ready to print    
                    if (!document.getElementById('ui-bizagi-document-pdf-preview') && count < 5) {
                        count += 1;
                        setTimeout(function () { printFn(pdf); }, 1000);
                    } else {
                        if (!$.browser.mozilla && !$.browser.msie) {
                            document.getElementById('ui-bizagi-document-pdf-preview').focus();
                            document.getElementById('ui-bizagi-document-pdf-preview').contentWindow.print();
                        } else {
                            $(".ui-bizagi-document-pdf-preview").focus();
                            $(".ui-bizagi-document-pdf-preview")[0].print();
                        }
                    }
                };
                printFn($("#ui-bizagi-document-pdf-preview", dialogBox)[0]);
            };
        }

        // Create dialog
        dialogBox.dialog({
            width: 800,
            height: 600,
            title: filename,
            maximized: false,
            modal: true,
            buttons: buttons,
            close: function () {
                dialogBox.dialog('destroy');
                dialogBox.remove();
            }
        });

    },



    /*
    *   Redraw documents when needed
    */
    redrawDocuments: function (documents, noFiles, downloadalldocuments) {
        var self = this;

        self._super(documents, noFiles, downloadalldocuments);
        // Add icons
        self.applyDocumentTemplatesFormat();
    },

    /*
    *   Shows the document if the flag is set. 
    */
    autoOpenDocuments: function () {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        if (properties.autoOpen) {
            if (properties.downloadalldocuments) {
                //Show only the joined document
                var joinedDocument = $(".ui-bizagi-document-upload-item[data-joined=true]", control);
                if (joinedDocument && joinedDocument.length == 1) {
                    self.showDocumentPreview($("> a", joinedDocument).attr("href"), joinedDocument.attr("data-filename"));
                }
            } else {
                // Auto-open documents if flag is set
                $.each($(".ui-bizagi-document-upload-item", control), function () {
                    // show only preview for files that are pdf
                    var extension = $(this).attr("data-filename").substr(($(this).attr("data-filename").lastIndexOf('.') + 1));
                    if (extension.toUpperCase() == "PDF" && !$(this).attr("data-joined"))
                        self.showDocumentPreview($("> a", this).attr("href"), $(this).attr("data-filename"));
                });
            }
        }
    }
});
