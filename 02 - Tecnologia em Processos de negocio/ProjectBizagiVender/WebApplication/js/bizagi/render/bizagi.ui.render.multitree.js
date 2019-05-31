/*
* jQuery BizAgi Render Multi-Tree Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	json2.js
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.tree.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.tree.js
*/
(function ($) {

    $.ui.treeRender.subclass('ui.multitreeRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control.addClass("ui-bizagi-render-display-block");

            // Define control settings & defaults
            self.dataUrl = properties.dataUrl || DEFAULT_TREE_URL;

            // Creates input control
            self.input = $('<span class="ui-bizagi-render-tree-multi-input ui-widget-content"></span>')
                .appendTo(control);

            // Initializes data
            $(self).data("value", []);

            // Creates tree layoput
            self._createTreeLayout();

            // Bind focus event
            self.input.bind("focus", function () {
                self.showTree();
            });

            // Bind resize event
            self.input.resize(function () {
                // Fix button
                $(".ui-bizagi-render-tree-button", self.element).height(self.input.height() + 6);
            })
        },

        /* Determines if the tree must have checkboxes*/
        _hasCheckboxes: function () {
            return true;
        },


        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            if (self.checking == true) return;

            // Set value in control
            if (value && properties.editable) {

                // Select node
                self._checkNodes(value);
            }
        },

        /* Internally sets the value */
        _setInternalValue: function (value) {
            var self = this;

            // Call base
            $.ui.baseRender.prototype._setInternalValue.apply(this, arguments);

            // Decode json value to set display value
            var data = JSON.parse(value);
            var displayValues = [];
            for (i = 0; i < data.length; i++) {
                displayValues.push(data[i].text);
            }

            self._setDisplayValue("[" + displayValues.join(", ") + "]");
        },

        /* Check data to verify which nodes need to expand*/
        _checkNodes: function (data) {
            var self = this,
                tree = self.tree,
                properties = self.options.properties;

            // Convert data
            if (data) {
                for (i = 0; i < data.length; i++) {
                    // Verify paths to expand automatically
                    var paths = data[i].path.split(".");
                    if (paths.length > 1) {
                        for (k = 0; k < paths.length; k++) {
                            // Expand node
                            self._tryExpandNode(paths[k], (k == paths.length - 1));
                        }
                    }
                }
            }
        },

        /* Attempts to expand a node to check the current values*/
        _tryExpandNode: function (nodeId, checkNode, count) {
            var self = this,
                tree = self.tree;

            // End loop when count is 25 to avoid infinite callbacks
            if (count == undefined) count = 0;
            if (count == 25) return;

            var node = tree.tree("getNode", nodeId);
            if (node == null) {
                setTimeout(function () { self._tryExpandNode(nodeId, checkNode, count + 1) }, 250);

            } else {
                tree.tree("expandNode", nodeId);
                if (checkNode) {
                    self.checking = true;
                    tree.tree("checkNode", nodeId);
                    self.checking = false;
                }
            }
        },

        /* Determines if the tree must have checkboxes*/
        _hasCheckboxes: function () {
            return true;
        },

        /* TREE HANDLERS */

        /* Before Node Insert */
        _treeNodeBeforeInsert: function (e, args) {
            var self = this,
                tree = self.tree;

            // Executes for each node after the json is received
            var checked = false;
            var needToExpand = false;
            var data = $(self).data("value");
            if (data) {
                for (var dataElement in data) {
                    if (dataElement.id == args.data.id) {
                        checked = true;
                        needToExpand = dataElement.needToExpand;
                        break;
                    }
                }
            }

            //  Call base
            args.data.checked = checked;
            args.data.needToExpand = needToExpand;
        },

        /* When a node is checked*/
        _treeNodeCheckChange: function (e, args) {
            var self = this,
                tree = self.tree;

            // Executes each time a node checkbox is selected or deselected
            var id = args.node.id;
            var data = $(self).data("value");

            if (args.node.checked) {
                // Check duplicates
                if (data[id]) return;

                // Add value
                var text = args.node.label;
                var path = args.node.path;
                data[id] = { id: id, text: text, path: path };

                var item = $('<span class="ui-corner-all ui-state-default"/>')
                    .append('<label>' + text + '</label>')
                    .appendTo(self.input)
                    .attr("id", id)
                    .data("value", data[id]);

                // reposition tree
                if (!self.checking) {
                    self._positionTree();
                }

            } else {
                // Check that exists
                if (!data[id]) return;

                // Remove element
                $("span#" + id, self.input).fadeOut(100, function () {
                    $(this).detach();
                });

                delete data[id];
            }



            // Updates data
            $(self).data("value", data);
            self._serializeMultiTree();
        },

        /* When a node is selected */
        _treeNodeSelected: function (e, args) {
            // Do nothing
        },

        /* Serializes the data*/
        _serializeMultiTree: function () {
            var self = this,
                tree = self.tree;

            /* Build array to jsonify */
            var dataToSerialize = [];
            var data = $(self).data("value");
            for (var i in data) {
                var item = data[i];
                dataToSerialize.push(item);
            }

            // Serialize in hidden field
            self._setInternalValue(JSON.encode(dataToSerialize));
        }

    });

})(jQuery);