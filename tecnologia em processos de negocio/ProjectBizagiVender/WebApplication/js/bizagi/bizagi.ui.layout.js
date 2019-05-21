/// <reference path="jquery.js" />

// TODO: Deprecated - DELETE

/*
* BizAgi Layout Plugin
* * Converts a form within an structured div layout into a beauty jquery form
* http://www.visionsoftware.com.co
* 
* Date: 01-SEP-2010
* Requires jquery, jquery.ui, jquery.ui.tooltip, jquery.metadata
*/
(function ($) {
    // private closure;  <% /*debug*/ if (false) { %>  
    $ = jQuery;
    // <% } /*end debug*/ %> 

    $.fn.applyBizagiLayout = function (options) {
        // Implementation start here
        var self = this;

        // Check that object is valid
        if (self == null)
            return;

        // <main section>

        // Process self metadata
        self.properties = self.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

        // Process elements
        processContainers();
        processRenders();

        // Set form as processed
        if (getTagName(self) == "form") {
            self.data("processed", true);
        }
        // </main section>

        /* 
        * Process each container
        */
        function processContainers() {
            // <main Section>
            $(".ui-bizagi-container", self).each(function (i) {
                var container = $(this);

                // Check if the container has been processed
                if (container.data("processed") == true) {
                    return;
                }

                // Add clearfix
                container.addClass("clearfix");

                // Extract metadata
                container.properties = container.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Process panels
                if (container.hasClass("ui-bizagi-container-panel")) {
                    processPanelContainer(container);
                }

                // Process tabs
                if (container.hasClass("ui-bizagi-container-tabContainer")) {
                    processTabContainer(container);
                }

                // Process accordeons
                if (container.hasClass("ui-bizagi-container-accordionContainer")) {
                    processAccordionContainer(container);
                }

                // Process groups
                if (container.hasClass("ui-bizagi-container-group")) {
                    processGroupContainer(container);
                }

                // Process horizontals
                if (container.hasClass("ui-bizagi-container-horizontal")) {
                    processHorizontalContainer(container);
                }

                // Set class for last render
                $(">.ui-bizagi-render, >.ui-bizagi-container", container).last().addClass("ui-bizagi-render-last");

                // Set container as processed
                container.data("processed", true);
            });
            // </main Section>

            /* 
            * Process a panel
            */
            function processPanelContainer(container) {
                // Set title
                if (container.properties.title) {
                    var title = $('<h3/>')
                        .text(container.properties.title)
                        .prependTo(container);
                }

                // Set height
                if (container.properties.height) {
                    container.height(container.properties.height);

                    // Set panel height
                    processHeight(container);
                }

                // Set layout for container
                container.applyBizagiLayout();
            }

            /* 
            * Process a tab container
            */
            function processTabContainer(container) {

                // Add header layout
                var html = "<ul>";
                $(">.ui-bizagi-container-tab", container).each(function (i) {
                    var tab = $(this);
                    tab.addClass("ui-corner-all");
                    tab.properties = tab.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
                    tab.attr("id", "ui-bizagi-tab-" + tab.properties.id);

                    html += '<li><a href="#ui-bizagi-tab-' + tab.properties.id + '" title="' + tab.properties.id + '">' + tab.properties.title + '</a></li>';
                });
                html += "</ul>";
                container.prepend(html);

                // Enable tabs
                container.tabs({
                    show: function (event, ui) {
                        // BUGFIX for grids
                        $(".ui-bizagi-render", container).each(function (i) {
                            var render = $(this);
                            $(".ui-bizagi-render-grid", render).each(function (j) {
                                render.gridRender("resize");
                            });
                        });
                    }
                });

                // Process tab layouts
                $(">.ui-bizagi-container-tab", container).each(function (i) {
                    var tab = $(this);
                    tab.applyBizagiLayout();
                });
            }

            /* 
            * Process an accordion container
            */
            function processAccordionContainer(container) {
                // Add header layout
                $(">.ui-bizagi-container-accordionItem", container).each(function (i) {
                    var accordionItem = $(this);
                    accordionItem.properties = accordionItem.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
                    accordionItem.before('<h3><a href="#">' + accordionItem.properties.title + '</a></h3>');
                });

                // Enable accordeon
                container.accordion({
                    autoHeight: false
                });

                // Process inner container layouts
                $(">.ui-bizagi-container-accordionItem", container).each(function (i) {
                    var accordionItem = $(this);
                    accordionItem.applyBizagiLayout();
                });
            }

            /* 
            * Process a group container
            */
            function processGroupContainer(container) {
                // Build group layout
                container.children().wrapAll('<div class="ui-bizagi-container-group-wrapper ui-widget-content"/>');
                container.data("expanded", true);

                // Add Header
                var expandedIcon = "ui-icon-triangle-1-s";
                var collapsedIcon = "ui-icon-triangle-1-e";
                var icon = $('<span class="ui-icon"/>')
                    .addClass(expandedIcon);

                var header = $('<h3/>')
                    .addClass("ui-bizagi-container-group-header")
                    .addClass("ui-helper-reset")
                    .addClass("ui-state-active")
                    .addClass("ui-corner-top")
                    .append(icon)
                    .append('<a href="javascript:;">' + container.properties.title + '</a>')
                    .click(function () {
                        container.data("expanded", !container.data("expanded"));
                        if (container.data("expanded")) {
                            $(".ui-icon", container).addClass(expandedIcon).removeClass(collapsedIcon);
                            $(".ui-bizagi-container-group-wrapper").slideDown();

                        } else {
                            $(".ui-icon", container).addClass(collapsedIcon).removeClass(expandedIcon);
                            $(".ui-bizagi-container-group-wrapper").slideUp();
                        }
                    })
                    .prependTo(container);

                // Apply Internal Layout
                $(".ui-bizagi-container-group-wrapper").applyBizagiLayout();
            }

            /*
            * Process an horizontal container
            */
            function processHorizontalContainer(container) {
                // Recalculate always
                var iCount = container.children(".ui-bizagi-render, .ui-bizagi-container-panel").size();

                // Process each child
                container.children(".ui-bizagi-render, .ui-bizagi-container-panel").each(function (i) {

                    var element = $(this);

                    // Extract metadata
                    element.properties = element.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                    // Process width
                    var renderWidth = element.properties.width;
                    if (renderWidth == null || renderWidth.length == 0) {
                        // Set default size
                        renderWidth = 100 / iCount;
                    } else {
                        // Set custom size
                        renderWidth = percent2Number(renderWidth);
                    }

                    // Set width
                    if (i != (iCount - 1)) {
                        element.width(renderWidth + "%");
                    } else {
                        element.width((renderWidth - 1.00) + "%");
                    }
                });

                // Set layout for container
                container.applyBizagiLayout();

                // Set class for all renders
                $(">.ui-bizagi-render, >.ui-bizagi-container", container).last().addClass("ui-bizagi-render-last");
            }
        }

        /*
        * Process each render
        */
        function processRenders() {
            // <main Section>
            // Process all renders
            self.children(".ui-bizagi-render").each(function () {
                var render = $(this);
                processRender(render);
            });
            // </main Section>

            /* 
            * Process a single render layout
            */
            function processRender(render) {
                // Check if the render has been processed
                if (render.data("processed") == true) {
                    return;
                }

                // Extract metadata
                render.properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Set basic stuff
                processRenderLayout(render);

                // Process label width and value width
                if (render.properties.labelWidth || render.properties.valueWidth) {
                    processWidth(render);
                }

                // Set render as processed
                render.data("processed", true);
            }

            /* 
            *   Process the basic layout 
            */
            function processRenderLayout(render) {
                // Add jquery ui classes
                render
                .addClass("ui-corner-all")
                .addClass("ui-widget-content");

                // Add label
                var label = render.properties.label || "";
                
                if (render.properties.type != "label" &&
                    render.properties.displayType != "label" &&
                    render.properties.displayType != "reversed") label = label + ' :';

                var labelSpan = $('<span class="ui-bizagi-label"></span>')
                    .append('<label>' + label + '</label>')
                    .appendTo(render);

                // Add control
                var controlWrapper = $('<div class="ui-bizagi-control-wrapper"></div>')
                        .append('<span class="ui-bizagi-render-control"></span>');

                var controlIcons = $('<span class="ui-bizagi-render-icons"></span>')
                                    .append('<span class="ui-icon ui-icon-info"></span>')
                                    .append('<span class="ui-icon ui-icon-alert"></span>');

                if (render.properties.displayType != "reversed") {
                    controlIcons.appendTo(controlWrapper);
                } else {
                    controlIcons.prependTo(controlWrapper);
                }

                var controlDiv = $('<div class="ui-bizagi-control"></div>')
                    .append(controlWrapper)
                    .appendTo(render);

                if (render.properties.helpText) {
                    processHelpText(render);
                }
            }

            /*
            *   Customizes render label and value width
            */
            function processWidth(render) {
                var label = $(".ui-bizagi-label", render);
                var value = $(".ui-bizagi-control", render);

                // Read values
                var labelWidth = render.properties.labelWidth || null;
                var valueWidth = render.properties.valueWidth || null;

                // Normalize percentages
                if (labelWidth && !valueWidth) {
                    labelWidth = percent2Number(labelWidth);
                    valueWidth = 100 - labelWidth;

                } else if (!labelWidth && valueWidth) {
                    valueWidth = percent2Number(valueWidth);
                    labelWidth = 100 - valueWidth;

                } else {
                    labelWidth = percent2Number(labelWidth);
                    valueWidth = percent2Number(valueWidth);

                    // Check 100% percentage
                    if ((labelWidth + valueWidth) != 100) {
                        valueWidth = 100 - labelWidth;
                    }
                }

                // Now apply width
                label.width(labelWidth + "%");
                value.width((valueWidth - 0.01) + "%");
            }

            /*
            *   Sets a help text for the render
            */
            function processHelpText(render) {
                var iconHelp = $(".ui-icon.ui-icon-info", render);
                iconHelp.attr("title", render.properties.helpText);
                iconHelp.tooltip();

                render.focusin(function () {
                    iconHelp.show();
                    return false;
                });
                render.focusout(function () {
                    iconHelp.hide();
                    return false;
                });

                iconHelp.mouseleave(function () {
                    render.tooltip('hide');
                    return false;
                });
            }
        }

        /*
        *   Utilitary functions
        */
        function percent2Number(value) {
            return Number(String(value).replace("%", ""));
        }

        function getTagName(element) {
            return $(element)[0].tagName.toLowerCase();
        }
    };
})(jQuery);