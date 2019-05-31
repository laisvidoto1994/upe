/*
* jQuery BizAgi Render Tree Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	json2.js
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.tree.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    var DEFAULT_TREE_URL = "ajax/AjaxTreeHandler.aspx";
    $.bizagiTrees = [];

    $.ui.baseRender.subclass('ui.treeRender', {

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
            self.input = $('<input class="ui-bizagi-render-tree-input" type="text" />')
                .appendTo(control);

            // Creates tree layoput
            self._createTreeLayout();

            // Bind focus event
            self.input.bind("focus", function () {
                self.showTree();
            });

            // Add to global collection
            $.bizagiTrees.push(self);
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            if (self.selecting == true) return;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value && properties.editable) {

                self.input.val(value.text);
                self._setInternalValue(value.id);
                self._setDisplayValue(value.text);

                // Select node
                self._selectNode(value);
            }
        },

        /* Internally sets the display value */
        _setDisplayValue: function (value) {
            var self = this;
            $(self).data("displayValue", value);
        },

        /* Internally gets the display value */
        _getDisplayValue: function () {
            var self = this;
            return $(self).data("displayValue");
        },

        /* Check data to verify which nodes need to expand*/
        _selectNode: function (data) {
            var self = this,
                tree = self.tree,
                properties = self.options.properties;

            // Convert data
            if (data) {
                // Verify paths to expand automatically
                var paths = (data.path + "").split(".");
                if (paths.length > 1) {
                    for (k = 0; k < paths.length; k++) {
                        // Expand node
                        self._tryExpandNode(paths[k], (k == paths.length - 1));
                    }
                }
            }
        },

        /* Attempts to expand a node to select the current value*/
        _tryExpandNode: function (nodeId, selectNode, count) {
            var self = this,
                tree = self.tree;

            // End loop when count is 25 to avoid infinite callbacks
            if (count == undefined) count = 0;
            if (count == 25) return;

            var node = tree.tree("getNode", nodeId);
            if (node == null) {
                setTimeout(function () { self._tryExpandNode(nodeId, selectNode, count + 1) }, 250);

            } else {
                tree.tree("expandNode", nodeId);
                if (selectNode) {
                    self.selecting = true;
                    tree.tree("selectNode", nodeId);
                    self.selecting = false;
                }
            }
        },

        /* Creates tree layout*/
        _createTreeLayout: function () {
            var self = this,
                properties = self.options.properties,
                doc = self.element.ownerDocument;

            // Draw tree container
            var tree = self.tree = $('<div class="ui-bizagi-render-tree" />')
                .append('<ul/>')
                .appendTo("body", doc);

            // Apply tree plugin
            tree.tree({
                useCheckbox: self._hasCheckboxes(),
                nodeIdTemplate: '#{id}',
                ajaxRequestParams: { parent: '#{id}' },
                ajaxOptions: {
                    dataType: $.bizAgiCommunication.dataType,
                    jsonp: $.bizAgiCommunication.jsonpParam,
                    url: self.dataUrl
                },
                nodeBeforeLoadChildren: function (e, args) { self._treeNodeBeforeLoad(e, args); },
                nodeBeforeInsert: function (e, args) { self._treeNodeBeforeInsert(e, args); },
                nodeCheckChange: function (e, args) { self._treeNodeCheckChange(e, args); },
                nodeSelected: function (e, args) { self._treeNodeSelected(e, args); },
                nodeDoubleClick: function (e, args) { self._treeNodeDoubleClick(e, args); },
                treeLoaded: function (e) { self._treeLoaded(e); }
            });

            // Bind blur event to hide tree
            tree.bind("blur", function (event) {
                // Click on an inner element will cause a blur event
                tree.closing = setTimeout(function () { tree.hide(); }, 150);
            });

            // Creates button
            self.button = $('<button class="ui-bizagi-render-tree-button">&nbsp;</button>')
			    .attr("tabIndex", -1)
			    .attr("title", "Show Tree")
			    .insertAfter(self.input)
			    .button({
			        icons: {
			            primary: "ui-icon-triangle-1-s"
			        },
			        text: false
			    }).removeClass("ui-corner-all")
			    .addClass("ui-corner-right ui-button-icon")
                .click(function () {
                    // Close if already visible
                    if (tree.is(":visible")) {
                        tree.hide();
                        return false;
                    }
                    self.showTree();

                    return false;
                })
                .addClass("ui-bizagi-render-combo-button")
                .children("span").last().removeClass("ui-button-text");
        },

        /* Determines if the tree must have checkboxes*/
        _hasCheckboxes: function () {
            return false;
        },

        /* Dropdown the tree */
        showTree: function () {
            var self = this;
            var tree = self.tree;

            // Hide all trees
            for (i = 0; i < $.bizagiTrees.length; i++ ) {
                $.bizagiTrees[i].hideTree();
            }

            tree.width(self.input.width() + self.button.width());

            // Position tree
            self._positionTree();

            // Makes the tree to focus
            tree.focus();

            // Binds every inner element mouse down event
            $("*", tree).mousedown(function (e) {
                // Use another timeout to make sure the blur-event-handler on the input was already triggered
                setTimeout(function () { clearTimeout(tree.closing); }, 13);
            });
        },

        /* HIdes the dropdown*/
        hideTree: function () {
            var self = this;
            var tree = self.tree;

            tree.hide();
        },

        /* Reposition tree below the input*/
        _positionTree: function () {
            var self = this;
            var tree = self.tree;

            // Show, position and fix css
            tree.show()
                .css({ top: '0px', left: '0px' })
                .position({ my: "left top", at: "left bottom", of: self.input, collision: "none" });
        },

        /* TREE HANDLERS */

        /* Executes after tree has been loaded */
        _treeLoaded: function (e, args) {
            var self = this,
                properties = self.options.properties;

            self.treeLoaded = true;
        },

        /* Before Node Load*/
        _treeNodeBeforeLoad: function (e, args) {
            var self = this,
                properties = self.options.properties;

            // Add xpath 
            $.extend(args.ajaxOptions.data, { xpath: properties.xpath, idRender: properties.id });
        },

        /* Before Node Insert */
        _treeNodeBeforeInsert: function (e, args) {
            /* Override in children */
        },

        /* When a node is checked*/
        _treeNodeCheckChange: function (e, args) {
            /* Overrides in children */
        },

        /* When a node is selected */
        _treeNodeSelected: function (e, args) {
            var self = this,
                tree = self.tree;

            // Update value
            var id = args.node.id;
            var text = args.node.label;
            var path = args.node.path;

            self._setValue({ id: id, text: text, path: path });
        },

        /* When a node is double clicked */
        _treeNodeDoubleClick: function (e, args) {
            var self = this,
                tree = self.tree;

            // Close dropdown
            tree.hide();
        }

    });

})(jQuery);