
/*
* jQuery BizAgi Base Container Widget 0.1
*
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*/
var BIZAGI_CONTAINER_PREFIX = "ui-bizagi-container-";

(function ($) {
    
    // Base widget definition
    $.ui.widget.subclass("ui.baseContainer", {
        /* Default options here*/
        options: {
            properties: {},
            type: ''
        },

        /* Constructor */
        _create: function () {

            // Set variables
            var self = this,
            options = self.options,
            container = self.element;

             // Set access through baseClass
            $(self.element).data("baseContainer", this);

            // Check if the container has been processed
            if ($(self).data("processed") == true) {
                return;
            }

            // Set default properties
            container.properties = container.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
            
            // Clone properties
            options.originalProperties = JSON.parse( JSON.encode(container.properties)); 

            // Check editability
            if (container.properties.id) container.attr("container-id", BIZAGI_CONTAINER_PREFIX + container.properties.id);
            self.containerEditable = (typeof container.properties.editable != "undefined") ? container.properties.editable : true;

            // Add clearfix
            container.addClass("clearfix");

            // Extract metadata
            container.properties = options.properties = container.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

            // Render container
            self._internalRender();

            // Set container as processed
            $(self).data("processed", true);

            // Apply defaults
            self.applyContainerDefaults();
        },

        /* 
        *   Set container defaults
        */
        applyContainerDefaults: function(){
            var self = this,
                properties = self.options.properties;

            // Set customizations
            if (properties.backgroundColor) self.changeBackgroundColor(properties.backgroundColor);

            // Set required and visiblity
            var visible = properties.visible != undefined ? properties.visible : true;
            if (!self.containerEditable) self.changeEditability(self.containerEditable);
            if (!visible) self.changeVisibility(visible);
        },

        bindEvent: function (eventName, callback) {
            var self = this;

            self.element.bind((self.widgetEventPrefix + eventName).toLowerCase(), callback);
        },

        /*  Destructor */
        destroy: function () {
            var self = this,
                container = self.element;

            // Destroy inner containers
            container.children(".ui-bizagi-container").each(function () {
                childContainer = $(this);
                childContainer.baseContainer('destroy');
            });

            // Destroy inner renders
            container.children(".ui-bizagi-render").each(function () {
                var render = $(this);
                render.baseRender('destroy');
            });

            // Cleans the container contents 
            self._clean();

            return this;
        },

        /* PUBLIC METHODS */

        /* Changes background color*/
        changeBackgroundColor: function (color) {
            var self = this,
                container = self.element;

           // Check inner containers
            container.children(".ui-bizagi-container").each(function () {
                var container = $(this);

                container.baseContainer("changeBackgroundColor", color);
            });

            // Check inner renders
            container.children(".ui-bizagi-render").each(function () {
                var render = $(this);

                render.baseRender("changeBackgroundColor", color);
            });
        },

        /* Hides / Show container */
        changeVisibility: function (argument) {
            var self = this;

            // Hide - show the render
            if (argument == true) {
                self.element.fadeIn(function(){
                    self.element.css("display", "");
                });
                    
            } else {
                self.element.fadeOut(function(){
                    self.element.css("display", "none");
                });
            }
        },

        /* Change selected item */
        setAsActiveContainer:function(argument){
        },

        /* Changes editability */
        changeEditability: function (argument) {
            var self = this,
                properties = self.options.properties,
                container = self.element;

            // Render again all children
            self.containerEditable = argument;

            // Check inner containers
            container.children(".ui-bizagi-container").each(function () {
                var container = $(this);

                container.baseContainer("changeEditability", argument);
            });

            // Check inner renders
            container.children(".ui-bizagi-render").each(function () {
                var render = $(this);

                render.baseRender("changeEditability", argument);
            });
        },

        /* Focus on container*/
        focus: function(){
            var self = this,
                container = self.element;

            // Makes sure the container is shown
            var container = container.parents(".ui-bizagi-container:first").baseContainer("focus");
        },

        /* PRIVATE METHODS */
        /* Clean the container elements*/
        _clean: function () {
            var self = this
            var container = self.element;

            // Removes everything
            container.empty();
            container
            $(self).data("processed", false);
        },

        _internalRender: function () {
            var self = this;
            self._render();

            // Render children
            self._renderChildren();
        },

        /* Renders the container*/
        _render: function () {
            /* Override in each container type if needed*/
        },

        /* Renders children layout */
        _renderChildren: function () {
            var self = this,
                container = self.element;

            // Create inner containers
            container.children(".ui-bizagi-container").each(function () {
                var container = $(this);
                self._applyContainerPlugin(container);
            });

            // Apply inner rendering
            container.children(".ui-bizagi-render").each(function () {
                var render = $(this);
                
                // Process each render
                self._processRender(render);
            });
        },

        /* Process a render div */
        _processRender: function(render){
            var self = this;

            // Check if the render has been processed
            if (render.data("processed") == true) {
                return;
            }

            // Extract metadata
            render.properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

            if (render.properties.reType == "duplicate") {
                self._processRetypeWithDuplicate(render);
            }
            
            // Set basic stuff
            self._createRenderLayout(render);

            // Process label width and value width
            if (render.properties.labelWidth || render.properties.valueWidth) {
                self._processRenderWidth(render);
            }

            // Apply bizagi rendering                
            self._applyRenderPlugin(render);

            // Set render as processed
            render.data("processed", true);
        },

        /* 
        *   Process the basic render layout 
        */
        _createRenderLayout: function (render) {
            var self = this;


            // Add jquery ui classes
            render.addClass("ui-corner-all")
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
                                    .append('<span class="ui-icon ui-icon-info ui-bizagi-render-icon-help"></span>')
                                    .append('<span class="ui-icon ui-icon-alert ui-bizagi-render-icon-error"></span>');

            if (render.properties.displayType != "reversed") {
                controlIcons.appendTo(controlWrapper);
            } else {
                controlIcons.prependTo(controlWrapper);
            }

            var controlDiv = $('<div class="ui-bizagi-control"></div>')
                    .append(controlWrapper)
                    .appendTo(render);

            if (render.properties.helpText) {
                self._processRenderHelpText(render);
            }
        },

        /*
        *   Customizes render label and value width
        */
        _processRenderWidth: function (render) {
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
        },

        /*
        *   Sets a help text for the render
        */
        _processRenderHelpText: function (render) {
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
        },

        /* Special case for duplicate check renders*/
        _processRetypeWithDuplicate: function(render){
            var self = this;
            
            // No need to process more when it is already processed
            if (render.attr("clone") == "true") return;

            // Clone element
            var clonedRender = render.clone();
            clonedRender.properties = clonedRender.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
            clonedRender.properties.label = clonedRender.properties.label + " " + $.bizAgiResources["bizagi-ui-render-text-duplicate-label-sufix"];
            clonedRender.attr("properties", JSON.encode(clonedRender.properties));
            clonedRender.attr("cloneId", encodeXpath(render.properties.xpath));
            clonedRender.attr("clone", "true");            

            // Set element after actual element adn reference it to the original
            render.data("clone", clonedRender)
            clonedRender.insertAfter(render);

            // Process cloned render
            self._processRender(clonedRender);
        },

        /* 
        *   Apply the adequate render plugin (FACTORY)
        */
        _applyRenderPlugin: function (render) {
            var self = this,
                container = self.element;

            self.containerEditable = (typeof container.properties.editable != "undefined") ? container.properties.editable : true;

            /* Method located in bizagi.ui.render.factory*/
            buildRender(render, render.properties.type, { containerEditable: self.containerEditable });
        },

        /* 
        *   Apply the adequate container plugin (FACTORY)
        */
        _applyContainerPlugin: function (container) {
            /* Method located in bizagi.ui.container.factory*/
            buildContainer(container);
        },

        /* Validate all renders in the container */
        isValid: function (invalidElements) {
            var self = this,
                properties = self.options.properties,
                container = self.element;

            // Check inner containers
            container.children(".ui-bizagi-container").each(function () {
                var container = $(this);

                container.baseContainer("isValid", invalidElements);
            });

            // Check inner renders
            container.children(".ui-bizagi-render").each(function () {
                var render = $(this);

                render.baseRender("isValid", invalidElements);
            });

            return invalidElements.length == 0;
        }
    });

    $.extend($.ui.baseContainer, {
        version: "@VERSION",
        eventPrefix: "container"
    });

})(jQuery);