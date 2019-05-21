/*
 *   Name: BizAgi Desktop Queries Dialog implementation
 *   Author: Juan Pablo Crossley
 *   Comments:
 *   -   ???
 */

// Extends itself
bizagi.workportal.widgets.genericiframe.extend("bizagi.workportal.widgets.genericiframe", {}, {

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();
        var iframe = $("iframe", content);
        var injectCss = (self.params.injectCss) ? self.params.injectCss : [".ui-bizagi-old-render*", "@font-face"];

        iframe.parent().addClass('loading-iframe');
        iframe.hide();


        iframe.load(function () {
            iframe.parent().removeClass('loading-iframe');
            iframe.fadeIn();
        });

        if (self.params.afterLoad && self.params.afterLoad != null) {
            iframe.load(function () {
                iframe.callInside(
                    self.params.afterLoad,
                    $.extend(self.params.afterLoadParams, {
                        controller: self
                    })
                    );
            });
        }

        if (injectCss != undefined) {
            var css = "";
            var cssList = "";

            if (typeof injectCss == "object") {
                $.each(injectCss, function (key, value) {
                    css += bizagi.getStyle(value);
                    cssList += value.replace(".", "") + " ";
                });
            } else {
                css += bizagi.getStyle(injectCss);
                cssList += injectCss.replace(".", "");
            }

            // Inject css within iframe
            iframe.load(function () {
                // inject css
                var iframeContent = $(this).contents();
                
                // Append css
                $('head', iframeContent).append("<style type='text/css'>" + css + "</style>");
                $('body', iframeContent).addClass(cssList.replace("*", ""));
                                
                // Hack position fixed for IE8 in quirks mode
                /*if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
                    var fixWizard = '<!--[if lte IE 8]> <style type="text/css"> #floater1Div { position: absolute; bottom: auto; right: auto; top: expression( ( -10 - floater1Div.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + "px" ); left: expression( ( -20 - floater1Div.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + "px" ); } #divClose { bottom: -3px; left: 0; } </style> <![endif]--><!--[if lte IE 7]> <link href="../../css/estilos.css" type="text/css" rel="stylesheet" /> <![endif]-->';
                    $('head', iframeContent).append(fixWizard);
                }*/

                // Add classes for IE8 in quirks mode
                $('body input', iframeContent).each(function () {
                    var $self = $(this),
                        inputType = $self.attr('type') ? 'ui-' + $self.attr('type') : '',
                        inputName = $self.attr('name') ? 'ui-' + $self.attr('name').replace(/_\d+$/, '') : '',
                        inputClasses = inputType + ' ' + inputName;

                    $self.addClass(inputClasses);
                })

                // Remove borders for buttons
                $('body img[src$="Button.gif"]', iframeContent).parent().remove();
            }).attr('frameborder', '0');
        }
    }
});

