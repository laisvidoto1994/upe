/*
* jQuery BizAgi Render Repeater Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {

    var BIZAGI_REPEATER_SAVE_HANDLER = "ajax/AjaxRepeaterHandler.aspx";
    var BIZAGI_REPEATER_DATA_HANDLER = "ajax/AjaxRepeaterHandler.aspx";
    var BIZAGI_REPEATER_DELETE_HANDLER = "ajax/AjaxRepeaterHandler.aspx";

    $.ui.baseRender.subclass('ui.repeaterRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Just apply display-type: value, align it to the left
            self.changeDisplayType("vertical");
            self.changeLabelAlign("left");

            // Make control to behave as a block container
            self.control
                .addClass("ui-bizagi-render-repeater")
                .addClass("ui-bizagi-render-display-block");

            // Define control settings & defaults
            self.saveUrl = properties.saveUrl || BIZAGI_REPEATER_SAVE_HANDLER;
            self.dataUrl = properties.dataUrl || BIZAGI_REPEATER_DATA_HANDLER;
            self.deleteUrl = properties.deleteUrl || BIZAGI_REPEATER_DELETE_HANDLER;
            self.dataType = properties.dataUrl ? $.bizAgiCommunication.dataType : "local";
            self.data = self.dataType == "local" ? properties.data : [];
            self.readOnly = self.dataType == "local" ? true : (self.readOnly || false);

            // Create the main container
            self.repeaterContainers = $('<div class="ui-bizagi-render-repeater-containers"/>')
                .appendTo(control);

            // Build button
            if (!self.readOnly) {
                self.addButton = $('<input type="button" class="ui-bizagi-render-repeater-add"/>')
                .appendTo(control);
                self.addButton.val($.bizAgiResources["bizagi-ui-render-repeater-add"]);
                self.addButton.button();

                // Bind event
                self.addButton.click(function () {
                    var container = self._addRepeaterItem();
                    self._setContainerEditable(container);
                });
            }

            // Load data
            if (self.dataType != "local") {
                self._loadDataFromAjax();

            } else {
                self._loadData(self.data);
            }
        },

        /* Load existing data*/
        _loadDataFromAjax: function () {
            var self = this,
                properties = self.options.properties;

            // Check for existing data
            if (self.dataUrl) {
                $.ajax({
                    url: self.dataUrl,
                    type: $.bizAgiCommunication.type,
                    dataType: $.bizAgiCommunication.dataType,
                    jsonp: $.bizAgiCommunication.jsonpParam,
                    data: { xpath: properties.xpath, idRender: properties.id },
                    success: function (data) {
                        self._loadData(data);
                    }
                });
            }
        },

        /* Load data*/
        _loadData: function (data) {
            var self = this,
                properties = self.options.properties;

            if (!data) return;
            for (i = 0; i < data.length; i++) {

                // Add a container
                var container = self._addRepeaterItem();

                // Iterate each inner render
                $(".ui-bizagi-render", container).each(function (j) {
                    var item = $(this);

                    // Read metadata
                    item.properties = $(this).metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                    // Get value
                    for (entity in data[i]) {
                        if (item.properties.xpath == entity) {
                            item.baseRender("option", "value", data[i][entity]);
                        }
                    }

                    // Set metadata
                    item.attr("properties", JSON.encode(item.properties));
                });

                // Set the container ready
                self._setContainerNoEditable(container);
            }
        },

        /* Makes a container readonly*/
        _setContainerNoEditable: function (container) {
            var self = this,
                properties = self.options.properties;

            // Apply bizagi rendering
            container.properties = $(this).metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
            container.properties.editable = false;
            container.addClass("ui-bizagi-state-read-only");
            container.attr("properties", JSON.encode(container.properties));
            container.data("editing", false);

            // Set container no editable
            container.baseContainer("changeEditability", false);

            // Hide icons
            $(".ui-bizagi-render-repeater-container-header-icon", container).hide();

            // Enable button
            if (!self.readOnly) {
                self.addButton.button("enable");
            }
        },


        /* Set container editable */
        _setContainerEditable: function (container) {
            var self = this,
                properties = self.options.properties;

            // Apply bizagi rendering
            container.properties = $(this).metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
            container.properties.editable = true;

            container.attr("properties", JSON.encode(container.properties));
            container.removeClass("ui-state-highlight");
            container.removeClass("ui-bizagi-state-read-only");
            container.data("editing", true);

            // Set container editable
            container.baseContainer("changeEditability", true);

            // Show icons
            $(".ui-bizagi-render-repeater-container-header-icon", container).show();

            // Hide delete icon
            $("#ui-bizagi-render-repeater-delete-icon", container).hide();

            // Disable button
            self.addButton.button("disable");
        },

        _createRenders: function (container) {
            var self = this;

            // Clear container
            $(".ui-bizagi-render", container).detach();

            // Iterate through metadata
            $(".ui-bizagi-render-repeater-item", self.element).each(function (i) {
                // Read metadata
                var properties = $(this).metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
                properties.temporal = true;

                // Clone item
                var item = $('<div class="ui-bizagi-render" />')
                    .attr("properties", JSON.encode(properties))
                    .appendTo(container);
            });

            // Attach container widget
            container.baseContainer();
        },

        /* Creates a container for a new record*/
        _addRepeaterItem: function () {
            var self = this;

            // Create container
            var container = self._buildRepeaterContainer()
                            .appendTo(self.repeaterContainers);

            // Create renders
            self._createRenders(container);

            // Disable button
            if (!self.readOnly) {
                self.addButton.button("disable");
            }

            return container;
        },

        /* Draws the container in HTML language*/
        _buildRepeaterContainer: function () {
            var self = this;

            // Creates a new div to hold the renders
            var container = $('<div class="ui-bizagi-render-repeater-container"/>')
            .addClass("ui-widget-content")
            .addClass("ui-bizagi-container")
            .addClass("ui-bizagi-container-panel")
            .data("editing", true)
            .mouseover(function () {
                if ($(this).data("editing")) return;

                container.addClass("ui-state-highlight");
                // Show delete icon
                $("#ui-bizagi-render-repeater-delete-icon", container).show();
            })
            .mouseout(function () {
                if ($(this).data("editing")) return;

                container.removeClass("ui-state-highlight");
                // Hide delete icon
                $("#ui-bizagi-render-repeater-delete-icon", container).hide();
            })
            .click(function () {
                if (!self.readOnly) {
                    if ($(this).data("editing")) return;

                    self._setContainerEditable(container);
                }
            });

            // Creates container header
            if (!self.readOnly) {
                var containerHeader = self._buildContainerHeader(container);
                containerHeader.appendTo(container);
            }

            return container;
        },

        _buildContainerHeader: function (container) {
            var self = this;

            // Creates the header that will hold the icons
            var containerHeader = $('<div class="ui-bizagi-render-repeater-container-header"/>')
                .addClass("ui-state-default");

            // Icon container
            var headerIcons = $('<div class="ui-bizagi-render-repeater-container-header-icons" />')
                .appendTo(containerHeader);

            // Delete icon
            var deleteIcon = $('<div id="ui-bizagi-render-repeater-delete-icon" class="ui-bizagi-render-repeater-container-header-icon ui-corner-all" />')
                .text(" ")
                .append('<span class="ui-icon ui-icon-close"/>')
                .hide()
                .appendTo(headerIcons);

            // Save icon
            var saveIcon = $('<div class="ui-bizagi-render-repeater-container-header-icon ui-corner-all" />')
                .text("Guardar")
                .append('<span class="ui-icon ui-icon-disk"/>')
                .appendTo(headerIcons);


            // Cancel icon
            var cancelIcon = $('<div class="ui-bizagi-render-repeater-container-header-icon ui-corner-all" />')
                .text("Cancelar")
                .append('<span class="ui-icon ui-icon-arrowthickstop-1-w"/>')
                .appendTo(headerIcons);

            // Apply hover
            $([saveIcon, cancelIcon, deleteIcon]).each(function (i) {
                $(this)
                .mouseover(function () {
                    $(this).addClass("ui-state-hover");
                    $(this).addClass("ui-corner-all");
                })
                .mouseout(function () {
                    $(this).removeClass("ui-state-hover");
                    $(this).removeClass("ui-corner-all");
                });
            });

            // Add bindings
            saveIcon.click(function () { self._saveRepeaterItem(container); return false; });
            cancelIcon.click(function () { self._cancelRepeaterItem(container); return false; });
            deleteIcon.click(function () { self._deleteRepeaterItem(container); return false; });

            return containerHeader;
        },

        /* Sends a request to the server with the item information*/
        _saveRepeaterItem: function (container) {
            var self = this;
            var data = [];
            var key;

            $('.ui-bizagi-render', container).each(function (i) {
                // Get render
                var render = $(this);
                var properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Read values
                var isKey = properties.isKey ? properties.isKey : false;
                if (isKey) {
                    key = render.baseRender("getValue") || 0;
                }

                properties.value = !isKey ? render.baseRender("getValue") : key;
                properties.displayValue = render.baseRender("getDisplayValue");

                // Serialize properties
                render.attr("properties", JSON.encode(properties));

                // Add data to send
                data.push({ xpath: properties.xpath, value: properties.value, isKey: isKey });
            });

            // Send info
            if (self.saveUrl) {
                $.ajax({
                    url: self.saveUrl,
                    type: $.bizAgiCommunication.type,
                    data: { data: JSON.encode(data), key: key, xpath: self.options.properties.xpath },
                    dataType: $.bizAgiCommunication.dataType,
                    jsonp: $.bizAgiCommunication.jsonpParam,
                    success: function (response) {
                        // Update key
                        $('.ui-bizagi-render', container).each(function (i) {
                            // Get render
                            var properties = $(this).metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                            // Read values
                            var isKey = properties.isKey ? properties.isKey : false;
                            if (isKey) {
                                properties.value = response.id;
                            }

                            // Update properties
                            $(this).attr("properties", JSON.encode(properties));
                        });

                        self._setContainerNoEditable(container);
                    }
                });

            }
        },

        /* Cancels the edition of an item*/
        _cancelRepeaterItem: function (container) {
            var self = this;

            var key;
            $('.ui-bizagi-render', container).each(function (i) {
                // Get render
                var render = $(this);
                var properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Read values
                var isKey = properties.isKey ? properties.isKey : false;
                if (isKey) {
                    key = render.baseRender("getValue") || 0;
                }
            });

            if (key == 0) {
                // Remove container                    
                container.detach();

                // Enable button
                self.addButton.button("enable");
            }
            else {
                // Restore container
                self._setContainerNoEditable(container);
            }
        },

        /* Sends a request to the server to delete the item*/
        _deleteRepeaterItem: function (container) {
            var self = this;
            var data = [];
            var key;

            // Find key
            $('.ui-bizagi-render', container).each(function (i) {
                // Get render
                var render = $(this);
                var properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Read values
                var isKey = properties.isKey ? properties.isKey : false;
                if (isKey) {
                    key = render.baseRender("getValue") || 0;
                }
            });

            // Send info
            if (self.deleteUrl) {
                $.ajax({
                    url: self.deleteUrl,
                    type: $.bizAgiCommunication.type,
                    data: { key: key, xpath: self.options.properties.xpath },
                    dataType: $.bizAgiCommunication.dataType,
                    jsonp: $.bizAgiCommunication.jsonpParam,
                    complete: function (event, request, settings) {
                        container.fadeOut(300, function () {
                            container.detach();
                        });
                    }
                });

            }
        }
    });

})(jQuery);